let app = getApp();
const domainUrl = app.globalData.url;
let js = require('../../js/public.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    psot_data: [],
    items: [{
        'name': 'zh-CN',
        'value': "中国"
      },
      {
        'name': 'USA',
        value: '美国'
      },
      {
        name: 'ENG',
        value: '英国'
      },
      {
        name: 'JP',
        value: '日本'
      }
    ],
    nodes1: [{
      name: 'br'
    }],
    inputvalue: '',
    sad: [
      ['脊椎动物', '无脊椎动物'],
      ['水下生物', '陆地生物']
    ],
    sab: ['男', '女'],
  },
  checkboxChange: function(e) {
    console.log(e);
  },
  long: function() {
    wx.showActionSheet({
      itemList: ['a', 'b', 'c'],
      success: res => {
        console.log(res);
      }
    });
  },
  //点击新闻Content跳转
  post_item: e => {
    let id = e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: 'News/News-detail?id='+id,
    });
  },
  GetValue: function(e) {
    this.setData({
      inputvalue: e.detail.value
    });
    console.log(e);
  },
  multi: function(e) {
    console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method:'POST',
      header:{
        "content-type":'application/json'
      },
      success: res => {    
        console.log(res);
        let post_data = res.data;
        that.setData({
          psot_data: post_data
        });
      },
      fail: err => {
        wx.showToast({
          title: 'fail',
          image: '/img/fail.png',
          duration: 2500
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

})