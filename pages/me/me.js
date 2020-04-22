// pages/me/me.js
let app = getApp();
const domainUrl = app.globalData.url;
let that = this;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'IsLogin': undefined,
    'headImg': '',
    'nickName': '',
    'city': ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.checkSession({
      success: res => {
        // console.log(res);
        //页面加载时，从缓存获取openId，获取不到意味当前没有登录
        let openid = wx.getStorageSync('openId');
        if (openid != '' && openid != null) {
          //获取到openId设置页面上的头像、网名
          this.setUserData();
        } else {
          this.setData({
            IsLogin: false
          });
        }
      },
      fail: err => {
        wx.showModal({
          showCancel: false,
          title: 'Tips',
          content: '未获取到你的账号信息，请重新登录~',
          success: res => {
            if (res.confirm) {
              that.removeStorageSync('openId');
              that.removeStorageSync('SessionId');
              that.setData({
                IsLogin: false
              });
            }
          }
        });
      },
      complete: (res) => {},
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击清理缓存按钮
  clear: () => {
    wx.showLoading({
      title: '正在清理',
    });
    let cache = wx.getStorageInfoSync().keys;
    if (cache.includes("logs")) {
      for (let item of cache) {
        if (item == 'logs') {
          wx.removeStorage({
            key: item,
            success: () => {
              wx.hideLoading({
                complete: (res) => {
                  wx.showModal({
                    showCancel: false,
                    title: 'Tips',
                    content: '清理完成',
                  });
                },
              });
            }
          });
        }
      }
    } else {
      setTimeout(() => {
        wx.hideLoading({
          complete: (res) => {
            wx.showModal({
              showCancel: false,
              title: 'Tips',
              content: '清理完成',
            });
          },
        });
      }, 1500);
    }
  },
  //登录状态
  singIn: function (e) {
    let encryptedData;
    let iv;
    let that = this;
    wx.login({
      success: res => {
        wx.request({
          url: domainUrl + '/wxLogin/Index',
          method: 'POST',
          data: {
            key: res.code
          },
          success: res => {
            console.log(res);
            that.setData({
              IsLogin: true
            });
            wx.setStorageSync("SessionId", res.data.SessionId);
            wx.setStorageSync('openId', res.data.Open_Id);
          },
          fail: err => {
            console.log(err);
          },
          //效验
          complete: () => {
            wx.getUserInfo({
              withCredentials: true,
              success: function (userRes) {
                iv = userRes.iv;
                encryptedData = userRes.encryptedData;
                wx.request({
                  url: domainUrl + '/wxLogin/OnCheck',
                  method: 'POST',
                  data: {
                    sessionId: wx.getStorageSync("SessionId"),
                    rawData: userRes.rawData,
                    signnature: userRes.signature
                  },
                  success: res => {                    
                    console.log(res);
                    wx.setStorageSync('BaseUserInfo', userRes.userInfo);
                    that.setUserData();
                  }
                });
              },
              fail: function (err) {
                console.log(err);
              },
              complete: () => {
                let sessionId = wx.getStorageSync("SessionId")
                wx.request({
                  url: domainUrl + '/wxLogin/DecodeEncryptedDataBySessionId',
                  method: 'POST',
                  data: {
                    'sessionId': sessionId,
                    'iv': iv,
                    'encryptedData': encryptedData
                  },
                  success: res => {
                    console.log(res);
                  },
                  fail: err => {
                    console.log(err)
                  }
                });
              }
            });
          }
        });
      }
    });
  },
  //获取缓存中的微信基本数据，设置头像、网名
  setUserData: function () {
    let baseInfo = wx.getStorageSync('BaseUserInfo');
    if (baseInfo != '' && baseInfo != null) {
      this.setData({
        IsLogin: true,
        headImg: baseInfo.avatarUrl,
        nickName: baseInfo.nickName,
        city: baseInfo.city
      });
    }
  },
  //退出登录
  quit: function () {
    let that = this;
    wx.removeStorage({
      key: 'openId',
      success: () => {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '登出成功',
          success: res => {
            if (res.confirm) {
              wx.removeStorageSync("SessionId");
              that.onLoad();
            }
          }
        });
      }
    });
  },
  //设置
  settings: function () {
    wx.openSetting({
      complete: (res) => {},
    });
  },
  //查看我的收藏
  ViewCollection: function () {
    let openid = wx.getStorageSync('openId');
    let that = this;
    if (openid == null | openid == '') {
      wx.showModal({
        showCancel: false,
        title: 'Tips',
        content: '未获取到账号信息，登录后重试！'
      });
      return;
    }
    wx.request({
      url: domainUrl + '/Work/ViewCollection',
      data: {
        'open_Id': openid
      },
      success: res => {
        let temp = res.data.data;
        if (res.data.msg == '获取成功') {
          wx.navigateTo({
            url: 'MyCollection/Collection',
            events: {
              getdata: function (options) {
                console.log(options)
              }
            },
            success: res => {
              res.eventChannel.emit('sendData', {
                data: temp
              })
            }
          });
        } else if (res.data.data == '' || res.data.data == null) {
          wx.showModal({
            showCancel: false,
            title: 'Tips',
            content: '未获取到收藏的文章！'
          });
        }
      },
      fail: err => {
        console.log(err)
      }
    });
  },
  //点击头像栏，查看修改个人信息
  lookMyselef: function () {
    let base = wx.getStorageSync("BaseUserInfo");
    let openId = wx.getStorageSync('openId');
    if ((openId == '' || openId == null) || (base == null || base == '')) {
      wx.showModal({
        showCancel: false,
        title: 'Tips',
        content: '未获取到你得信息，重新登录后重试！'
      });
      return;
    }
    wx.navigateTo({
      url: 'MyBaseInfo/MyBaseInfo',
    });
  },
  askFor: function () {
    wx.navigateTo({
      url: 'author/author',
    });
  },
})