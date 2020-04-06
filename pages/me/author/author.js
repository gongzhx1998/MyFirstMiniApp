// pages/me/author/author.js
let app = getApp();
let domainUrl = app.globalData.url;
let dataA = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    check: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  checkBoxChange: function (e) {
    let temp = this.data.check;
    this.setData({
      check: !temp
    });
  },
  idcard: function (e) {
    let id = e.detail.value;
    dataA.IDNumber = id;
    // console.log(id)
  },
  phoneNumber: function (e) {
    let phoneNumber = e.detail.value;
    dataA.PhoneNumber = phoneNumber;
    // console.log(phoneNumber)
  },
  bingWx: function () {
    let baseInfo = wx.getStorageSync('BaseUserInfo');
    let open_Id = wx.getStorageSync('openId');
    dataA.Open_Id = open_Id;
    dataA.AuthorName = baseInfo.nickName;
    dataA.City = baseInfo.city;
    dataA.Avatar = baseInfo.avatarUrl;
    // console.log(dataA);
    wx.request({
      url: domainUrl + '/Work/askFor',
      method: 'GET',
      data: {
        'a': dataA
      },
      success: res => {
        if (res.data.success) {
          wx.showModal({
            showCancel: false,
            title: 'Tips',
            content: res.data.Msg,
            success: res => {
              console.log(res)
              if (res.confirm) {
                wx.switchTab({
                  url: '../../me/me',                  
                });
              }
            }
          });
        } else {
          wx.showModal({
            showCancel: false,
            title: 'Tips',
            content: res.data.Msg,
            success: res => {
              if (res.confirm) {
                wx.switchTab({
                  url: '../../me/me',                  
                });
              }
            }
          });
        }
      },
      fail: err => {
        console.log(err);
      }
    });
  },
})