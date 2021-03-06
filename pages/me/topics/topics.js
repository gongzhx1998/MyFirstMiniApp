// pages/me/topics/topics.js
let app = getApp();
let util = require('../../../utils/util.js');
let domainURL = app.globalData.url;
let testedValue = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topics: null,
    testScore: 0,
    display:'none',
    isHidden:true,
    ScoreIsHidden:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let openid = wx.getStorageSync('openId');
    if (openid == null | openid == '') {
      wx.showModal({
        showCancel: false,
        title: 'Tips',
        content: '未获取到账号信息，登录后重试！',
        success: res => {
          if (res.confirm) {
            wx.switchTab({
              url: '../me',
            });
          }
        }
      });
    }

    let a = res => {
      wx.setStorageSync('topics', res.data);
      that.setData({
        topics: res.data
      });
    }
    util.HttpRequest(domainURL + '/Topics', 'POST', null, a);
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
    testedValue=[];
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    testedValue=[];
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
  radChange: function (e) {
    let _this = this;
    let value = e.detail.value;
    let questionId = e.currentTarget.dataset.questionid;
    let initData = wx.getStorageSync('topics');
    let istrue;
    for (let item of initData) {
      if (item.QuestionId == questionId) {
        for (let i = 0; i < testedValue.length; i++) {
          if (testedValue[i].questionId == questionId) {
            testedValue.splice(i, 1);
            break;
          }
        }
        istrue= item.Truethly == value ? true : false;
          let testValue = {
            isTrue: istrue,
            questionId: questionId,
            question:item.Question,
            testValue: value
          }
          testedValue.push(testValue);
        break;
      }
    }

    if(testedValue.length==initData.length){
      this.setData({
        display:'block'
      });
    }
  },
  submitAnwser:function(){
    let score=0;
    for (let item of testedValue) {
      score=item.isTrue?score+=1:score;
    }
    this.setData({
      testScore:score,
      isHidden:false,
      ScoreIsHidden:true
    });

    let ReqData={
      data:JSON.stringify(testedValue),
      sessionId:wx.getStorageSync('SessionId'),
      score:score,
      nickName:wx.getStorageSync("BaseUserInfo").nickName,
      platform:'WX-MiniApp'
    }
    util.HttpRequest(domainURL+'/Topics/TestedValue','POST',ReqData,res=>{
      console.log(res);
    },'application/json');

    testedValue=[];
    wx.removeStorageSync('topics');
  }
})