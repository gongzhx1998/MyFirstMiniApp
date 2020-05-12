let app = getApp();
const domainUrl = app.globalData.url;
let count = 0;
let utils = require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    psot_data: [],
    IsCacelShow: false,
    IsBodyShow: true,
    IsSearchViewShow: false,
    Searched_data: [],
    statusBarHeight: app.globalData.statusBarHeight,
    header_input_height: app.globalData.header_input_height,
    page_header_height: app.globalData.page_header_height,
    ShowNewsBuild: false
  },
  //点击新闻Content跳转
  post_item: e => {
    let id = e.currentTarget.dataset.newsid;
    let title = e.currentTarget.dataset.newstitle;
    wx.navigateTo({
      url: 'News/News-detail?id=' + id + '&title=' + title,
    });
  },
  // 当上方搜索框获取焦点时隐藏页面，显示搜索页
  OnFocus: function (e) {
    this.setData({
      IsBodyShow: false,
      IsSearchViewShow: true,
      IsCacelShow: true,
      Searched_data: []
    });
  },
  //返回News界面
  OnIcontap: function () {
    this.setData({
      IsBodyShow: true,
      IsSearchViewShow: false,
      IsCacelShow: false
    });
  },
  //搜索
  OnBlur: function (e) {
    let str = e.detail.value;
    this.GetAnyNewsByTitle(str);
  },
  OnConfirm: function (e) {
    let str = e.detail.value;
    this.GetAnyNewsByTitle(str);
  },
  //根据输入信息搜索文章
  GetAnyNewsByTitle: function (str) {
    let that = this;
    if (str == '' || str == null) {
      wx.showModal({
        content: '输入内容在搜索',
        showCancel: false,
        title: 'Tips'
      });
      return;
    }
    wx.request({
      url: domainUrl + '/Work/GetAnyNewsByTitle',
      method: "POST",
      data: {
        'str': str
      },
      success: res => {        
        if (res.data == null || res.data.length == 0) {
          return;
        }
        for (let item of res.data) {
          item.ContentIMG=wx.arrayBufferToBase64(item.ContentIMG)
        }        
        that.setData({
          Searched_data: res.data
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method: 'POST',
      data: {
        'skip': 0,
        "take": 2
      },
      header: {
        "content-type": 'application/json'
      },
      success: res => {
        for (let item of res.data) {
          item.ContentIMG=wx.arrayBufferToBase64(item.ContentIMG)
        }
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
  //左上角+，发表文章
  AddNews: function (e) {
    let key = wx.getStorageSync('SessionId');
    if(wx.getStorageSync('openId')==''){
      wx.showToast({
        title: '请重新登陆后重试~',
        icon:"none"
      });
      return;
    }
    utils.HttpRequest(domainUrl + '/Work/CheckAuthor', 'POST', {
      sessionId: key
    }, res => {
      //作者信息
      wx.setStorageSync('AuthorEntity', res.data.entity);
      if (!res.data.Success) {
        wx.showModal({
          title: 'Tips',
          content: '当前为止，你还不能发表文章~~轻按确定申请，取消返回刚才的页面',
          success: res => {
            if(res.confirm){
              wx.navigateTo({
                url: '../me/author/author',
              });
            }            
          }
        });
      } else {
        wx.navigateTo({
          url: './buildNews/buildNews',
        });
      }
    }, 'application/json');
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
    this.onLoad();
    count = 0;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    count += 2;
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method: 'POST',
      data: {
        'skip': count,
        "take": 2
      },
      success: res => {
        if (res.data == null || res.data.length == 0) {
          wx.showToast({
            title: '已经到底啦~',
            duration: 2000,
            mask: true,
            icon: 'none'
          });
          return;
        }
        for (let item of res.data) {
          item.ContentIMG=wx.arrayBufferToBase64(item.ContentIMG)          
        }
        let post_data = that.data.psot_data.concat(res.data);
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})