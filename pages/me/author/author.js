// pages/me/author/author.js
let app = getApp();
let domainUrl = app.globalData.url;
let dataA = {};
let utils = require('../../../utils/util.js')
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
    wx.requestSubscribeMessage({
      tmplIds: ['lvwRHvXqqcPBRWWigbPpT0F7C89GFFdOI-Y4tjhpdqE'],
      success:res=>{
        console.log(res)
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
  },
  bingWx: function () {    
    let Auditresults;
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
        let YesOrNo=res.data.success;
        Auditresults = res.data.Msg;
        wx.showModal({
          title: 'Tips',
          content: Auditresults,
          showCancel: false,
          success: res => {
            if (res.confirm) {
              wx.switchTab({
                url: '/pages/me/me',
              });
              //后台返回false直接return
              if(!YesOrNo) {return;}
              let url = domainUrl + '/wxLogin/TemplateMessage';
              let reqData = {
                'sessionId': wx.getStorageSync('SessionId'),
                'templateId': 'lvwRHvXqqcPBRWWigbPpT0F7C89GFFdOI-Y4tjhpdqE'
              }
              let callback = function (res) {
                console.log(res)
              }
              utils.HttpRequest(url, 'POST', reqData, callback,'application/json');
            }
          }
        });
      },
      fail: err => {
        console.log(err);
      }
    });
  },
})