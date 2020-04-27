// pages/Websocket/Websocket.js
let app=getApp();
let wss=app.globalData.wssUrl;
let domainUrl=app.globalData.url;
let text;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    socketStatus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    wx.connectSocket({
      url: wss+'/SenparcWebSocket',
      success:res=>{
        that.setData({
          socketStatus:true
        });       
      }
    });
    wx.onSocketError(function(err){
      console.log(err)
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
  gettext:function(e){
    text=e.detail.value;
  },
  sendMessage:function(e){
    if(!this.data.socketStatus){return;}
    var message=JSON.stringify({
      'Message':text,
      "SessionId":'',
      "FormId":''
    });
    wx.sendSocketMessage({
      data: message,
      success:()=>{
        wx.onSocketMessage((result) => {
          console.log(result);
        });
      }
    });
  }
})