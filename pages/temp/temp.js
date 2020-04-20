let app = getApp();
const domainUrl = app.globalData.url;
let count=0;
let utils=require("../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    psot_data: [],
    IsCacelShow:false,
    IsBodyShow:true,
    IsSearchViewShow:false,
    Searched_data:[],
    statusBarHeight:app.globalData.statusBarHeight,
    header_input_height:app.globalData.header_input_height,
    page_header_height:app.globalData.page_header_height
  },
  //点击新闻Content跳转
  post_item: e => {
    let id = e.currentTarget.dataset.newsid;
    let title=e.currentTarget.dataset.newstitle;
    wx.navigateTo({
      url: 'News/News-detail?id='+id+'&title='+title,
    });
  },
  // 当上方搜索框获取焦点时隐藏页面，显示搜索页
  OnFocus:function(e){
    this.setData({
      IsBodyShow:false,
      IsSearchViewShow:true,
      IsCacelShow:true,
      Searched_data:[]
    });    
  },
  //返回News界面
  OnIcontap:function(){
    this.setData({
      IsBodyShow:true,
      IsSearchViewShow:false,
      IsCacelShow:false
    });    
  },
  //搜索
  OnBlur:function(e){
    let str=e.detail.value;
    this.GetAnyNewsByTitle(str);
  },
  OnConfirm:function(e){
    let str=e.detail.value;
    this.GetAnyNewsByTitle(str);
  },
  GetAnyNewsByTitle:function(str){
    let that=this;
    if(str==''||str==null){
      wx.showModal({
        content:'输入内容在搜索',
        showCancel:false,
        title:'Tips'
      });
      return;
    }
    wx.request({
      url: domainUrl+'/Work/GetAnyNewsByTitle',
      method:"POST",
      data:{
        'str':str
      },
      success:res=>{
        let data=res.data;
        if(data==null||data.length==0){          
          return;
        }        
        that.setData({
          Searched_data:data
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method:'POST',
      data:{
        'skip':0,
        "take":2
      },
      header:{
        "content-type":'application/json'
      },
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
  AddNews:function(e){
    wx.showToast({
      title: '此功能正在开发中',
      mask:true,
      duration:2500
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
    count=0;
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    count+=2;
    let that = this;
    wx.request({
      url: domainUrl + '/Work/GetNews',
      method:'POST',
      data:{
        'skip':count,
        "take":2
      },     
      success: res => {
        if(res.data==null||res.data.length==0){
          wx.showToast({
            title: '已经到底啦~',
            duration:2000,
            mask:true,
            icon:'success'
          });
          return;
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
  onShareAppMessage: function() {

  },

})