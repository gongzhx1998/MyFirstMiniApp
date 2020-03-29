//markers数组
var markersData = [];
//MapContext对象
const map = wx.createMapContext('myMap', this);
//移动到地图中心点
var move = ()=> {
  var map = wx.createMapContext('myMap', this);
  wx.getLocation({
    type: 'gcj02',
    success: function(res) {
      map.moveToLocation({
        longitude: res.longitude,
        latitude: res.latitude
      });
    },
  });
}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
    mapId: 'myMap',
    mark: [],
    scale: 16
  },
  //点击地图界面添加一个标记点
  tapMap: function(e) {
    var me = this;
    //先清空数组
    markersData = [];
    me.setData({
      mark: []
    });
    //chooseLocation
    wx.chooseLocation({
      success: function(res) {
        console.log(res);
        //放置一个标记
        var Mdata = {
          longitude: res.longitude,
          latitude: res.latitude,
          id: 0,
          iconPath: '/img/weizhi.png',
          callout: {
            content: res.name,
            borderRadius: 5,
            fontSize: 14,
            textAlign: 'center',
            display: 'BYCLICK',
            bgColor: 'transparent'
          }
        }
        markersData.push(Mdata);
        me.setData({
          mark: markersData
        });
      },
      fail: err => {
        console.log(err);
      }
    })
  },
  // region:function(e){
  //   console.log(e);
  // },
  // //点击poi时
  // poi:function(e){
  //   console.log(e);
  // },
  //点击标记点
  markerTap: function(e) {
    // console.log(e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //监听
    wx.startLocationUpdate({
      success: res => {

        wx.onLocationChange(sda);
      }
    });
    //监听函数回调
    var sda = function(e) {
      move();
    }
    //获取当前位置
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        });
      }
    });
  },
  //右下角按钮点击事件
  back: function() {
    this.setData({
      scale: 16
    });
    move();
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
    var asd = function(e) {
      console.log(e);
    }
    wx.offLocationChange(asd);
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

  }
})