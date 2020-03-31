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
    wx.request({
      url: domainUrl + '/Work/AnyNews',
      method: 'GET',
      data: {
        'NewsId': id
      },
      success: res => {
        let nextViewData = res;
        wx.navigateTo({
          url: 'News/News-detail',
          events: {
            getData: function(option) {
              console.log(option)
            }
          },
          success: res => {            
            res.eventChannel.emit('acceptDataFromOpenerPage', {
              data: nextViewData
            });
          }
        });
      },
      fail: err => {
        wx.showToast({
          title: '获取失败',
          image: '/img/fail.png',
          duration: 2500,
          mask: true
        });
      }
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
    console.log(1)
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method:'POST',
      success: res => {      
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
    this.onShow();
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