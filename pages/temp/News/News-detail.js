// pages/temp/News/News-detail.js
let app = getApp();
const domainUrl = app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    psot_data: [],
    Favorites: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
        content: '未获取到OpenId，请登录后重新尝试！'
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
            Favorites: FavoriteCount
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
    let eventChannel = this.getOpenerEventChannel();
    // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
    // eventChannel.emit('someEvent', { data: 'test' });
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      let e = data.data.data;
      that.setData({
        psot_data: e,
        Favorites: e.Favorites
      });
      wx.request({
        url: domainUrl + '/Work/UpdatePV',
        method: 'POST',
        data: {
          'id': e.NewsId
        },
        success: res => {
          console.log(res);
        },
        fail: err => {
          console.log(err);
        }
      });
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