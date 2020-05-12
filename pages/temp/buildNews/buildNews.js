// pages/temp/buildNews/buildNews.js
let newsData={
  CollectedIMG :"/img/shoucang.png",
  WatchedIMG :"/img/watch.png",
};
let path;
let app=getApp();
let util=require('../../../utils/util.js');
let domainUrl=app.globalData.url;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wrapHeight:0,
    statusBarHeight:0,
    navgationBarHeight:0,
    picShow:true,
    subShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var time=util.formatTime(new Date);
    console.log(time);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //富文本context
    // this.getContext().exec(res=>{
    //   // res[0].
    // });
    this.setData({
      wrapHeight:app.globalData.page_header_height,
      statusBarHeight:app.globalData.statusBarHeight,
      // navgationBarHeight:
    });
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
  getContext:function(){
    return wx.createSelectorQuery().select('.q-editor').context();
  },
  editorReady:function(){
   
  }, 
  titleOnBlur:function(e){
    newsData.title=e.detail.value;
  },
  editorInput:function(e){ 
    newsData.content=e.detail.text
  },
  // 添加图片按钮
  addPic:function(e){    
    let that=this;
    wx.chooseImage({
      count:1,
      complete: (res) => {
        path=res.tempFilePaths[0];
        // 添加到富文本编辑器内
        that.getContext().exec(res=>{
          res[0].context.insertImage({
            src:path,
            success:()=>{
              that.setData({
                picShow:false,
                subShow:true
              });
            }
          });
        });      
      },
    });
  },
  //提交按钮
  submit:function(){    
    newsData.AuthorId= wx.getStorageSync('AuthorEntity').AuthorId;
    newsData.time=util.formatTime(new Date);
       wx.uploadFile({
         filePath: path,
         name: 'file',
         url: domainUrl+'/Work/BuildNews',
         header:{
           'content-type':'multipart/form-data'
         },
         formData: {
          'news': JSON.stringify(newsData)
        },
         success:res=>{
          let result=JSON.parse(res.data);
          wx.showToast({
            title: result.msg,
            icon:"none",
            duration:2000
          });
         },
         fail:err=>{
           console.log(err);
         }
       });    



    // util.HttpRequest(domainUrl+'/Work/BuildNews','POST',data,res=>{      
    //   wx.showModal({
    //     title:'Tips',
    //     content:res.data.Msg,
    //     showCancel:false,
    //     success:res=>{
    //       if(res.confirm){
    //         wx.switchTab({
    //           url: '../temp',
    //         });
    //       }
    //     }
    //   });
    // },"application/json");
  },
  // backHome
  backHome:function(){
    wx.switchTab({
      url: '../temp',
    });
  }
})