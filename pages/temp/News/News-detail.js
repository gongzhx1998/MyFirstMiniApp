// pages/temp/News/News-detail.js
let app = getApp();
const domainUrl = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psot_data: [],
    FavoritesCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(typeof options.id)
    let that = this;
    let id = options.id;
    wx.setStorageSync('DetailNewsId', id);
    wx.request({
      url: domainUrl + '/Work/AnyNews',
      method: 'GET',
      data: {
        'NewsId': id
      },
      success: res => {
        that.setData({
          psot_data: res.data,
          FavoritesCount: res.data.FavoritesCount
        });
      }
    });
  },
  Collect: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let FavoriteCount = e.currentTarget.dataset.favorites + 1;
    let Open_Id = wx.getStorageSync('openId');
    if (Open_Id == "" || Open_Id == null) {
      wx.showModal({
        showCancel: false,
        title: '错误',
        content: '请登录后重新尝试！'
      });
      return;
    }
    wx.request({
      url: domainUrl + '/Work/Favorites',
      method: 'POST',
      data: {
        'NewsId': id,
        'openId': Open_Id
      },
      success: res => {
        wx.showToast({
          title: res.data,
          duration: 2500,
          icon: 'success'
        });
        if (res.data == '收藏成功') {
          that.setData({
            FavoritesCount: FavoriteCount
          });
        }
      },
      fail: err => {
        wx.showToast({
          title: err.errMsg,
          image: '/img/fail.png',
          duration: 2500
        })
      }
    })
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
    let that = this;
    let id= wx.getStorageSync('DetailNewsId');
    wx.request({
      url: domainUrl + '/Work/UpdatePV',
      method: 'POST',
      data: {
        'id': id
      }
    });
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

  }
})