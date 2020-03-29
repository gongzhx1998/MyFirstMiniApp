//index.js
//获取应用实例
const app = getApp();
const domainUrl = app.globalData.url;

Page({
  data: {
    array: [1, 2, 3, 4, 5, 99, 666, -1],
    range: [{
        key: "男",
        value: 0
      },
      {
        key: '女',
        value: 1
      },
      {
        key: '性别友好',
        value: 2
      }
    ],
    sex: '',
    pick_time: '',
    pick_date: '',
    pick_city: '',
    radio_items: [{
        id: 0,
        name: '中国'
      },
      {
        id: 1,
        name: '日本'
      },
      {
        id: 2,
        name: '香港'
      }
    ],
    status: false,
    img_src: '',
    videoSrc: '',
    img_width: 0,
    img_height: 0,
    range2: [{
        key: '男',
        value: 0
      },
      {
        key: '女',
        value: 1
      }
    ]
  },
  TakePhoto: function() {
    var that = this;
    var ipath = '';
    this.ctx.takePhoto({
      success: (res) => {
        ipath = res.tempImagePath;
        that.setData({
          img_height: res.height,
          img_width: res.width,
          img_src: ipath
        });
        console.log(res);
        console.log('width :', res.width, "height :", res.height);
        wx.saveImageToPhotosAlbum({
          filePath: ipath,
          success: res => {
            wx.showToast({
              title: 'Success',
              icon: 'success',
              duration: 2500,
              mask: true
            });
          },
          fail: err => {
            console.log(err);
            wx.showToast({
              image: '/img/fail.png',
              title: 'fail',
              duration: 2500
            });
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log(res)
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        console.log(res);
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  Scan: function(e) {
    wx.scanCode({
      success: res => {
        console.log(res);
      }
    });
  },
  //判断switch是否是打开状态
  Ischecked: function(e) {
    var a = this.data.status;
    this.setData({
      status: !a
    })
  },
  radioChange: function(e) {
    console.log(e);
  },
  //region选择器
  CityChange: function(e) {
    console.log(e);
    this.setData({
      pick_city: e.detail.value
    });
  },
  //date选择器change事件
  DateChange: function(e) {
    this.setData({
      pick_date: e.detail.value
    })
  },
  //Time change事件
  TimeChange: function(e) {
    this.setData({
      pick_time: e.detail.value
    });
  },
  //性别选择器change事件
  selectorChange: function(e) {
    for (var i = 0; i < this.data.range.length; ++i) {
      if (this.data.range[i].value == e.detail.value) {
        this.setData({
          sex: this.data.range[i].key
        });
      }
    }
  },
  onLoad: function() {
    this.ctx = wx.createCameraContext();
    wx.getSetting({
      success: res => {
        if (!res.authSetting["scope.userInfo"]) {
          wx.authorize({
            scope: 'scope.userInfo',
            success: res => {
              console.log(res);
            }
          });
        }
      }
    });
  },
  //点击登录
  getuser: function() {
    setTimeout(function() {
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.navigateTo({
              url: './user',
            });
          } else {
            wx.showModal({
              title: '提示',
              content: '请您授权登录后重试。',
              showCancel: false
            });
          }
        }
      });
    }, 2500);
  },
  //下载pic
  down: function() {
    wx.downloadFile({
      url: domainUrl + '/img/abcd.png',
      success: res => {
        const path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: res => {
            wx.showToast({
              title: '保存成功',
            });
          },
          fail: err => {
            wx.showToast({
              title: '保存失败',
              image: '/img/fail.png'
            });
          }
        });
      }
    });
  },
  uploadFile: function() {
    wx.chooseImage({
      success: function(res) {
        console.log(res);
        const path = res.tempFilePaths[0];
        wx.uploadFile({
          url: 'https://legschina.com/',
          method: 'get',
          filePath: path,
          name: 'a.png',
          success: function(res) {
            console.log(res);
          },
          fail: err => {
            console.log(err);
          }
        });
      },
    });
  },
  singIn: function(e) {
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
            wx.setStorageSync("SessionId", res.data.SessionId);
          },
          fail: err => {
            console.log(err);
          },
          //效验
          complete: com => {
            wx.getUserInfo({
              withCredentials: true,
              success: function(userRes) {
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
                  }
                });
              },
              fail: function(err) {
                console.log(err);
              }
            });
          }
        });
      }
    });
  },
  //获取Token
  getToken: () => {
    wx.request({
      url: domainUrl + '/wxLogin/GetToken',
      method: "POST",
      success: res => {
        console.log(res);
      }
    });
  },
  openDoc: () => {
    wx.downloadFile({
      url: domainUrl + '/img/img09930.pdf',
      success: res => {
        const TFilePath = res.tempFilePath;
        wx.openDocument({
          filePath: TFilePath,
          showMenu: true,
          success: res => {
            console.log(res);
            //保存文件
            wx.saveFile({
              tempFilePath: TFilePath,
              success: res => {
                console.log(res);
              }
            });
          },
          fail: err => {
            console.log(err);
          }
        });
      }
    });
  },
  viewImg() {
    wx.previewImage({
      urls: [
        domainUrl + '/img/meinv.png',
        domainUrl + '/img/canon.png',
        domainUrl + '/img/bazaar.png',
      ],
    });

  },
  clearStorage: () => {
  },
});
