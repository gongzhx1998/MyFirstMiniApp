// pages/me/MyBaseInfo/MyBaseInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    initData: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let eventChannel = this.getOpenerEventChannel();
    eventChannel.on('sendData', function (e) {
      function fn(e) {
        for (let item of e.data) {
          let temp = '';
          temp = item.Content.substr(0, 30);
          item.Content = temp+'...';          
        }        
      }
      fn(e);
      that.setData({
        initData: e.data
      });
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
  //跳转到文章详情
  navgateDetail:function(e){
    let id=e.currentTarget.dataset.newsid;
    wx.navigateTo({
      url: '../../temp/News/News-detail?id='+id,
    });
  }
})