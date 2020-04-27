//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          });
        } else {
          wx.authorize({
            scope: 'scope.userInfo',
          });
        }
      }
    });
    //是否为调试状态
    let isDebug = true;
    let _url = isDebug ? 'http://api.legschina.com' : 'https://legschina.com';
    let _wssUrl = isDebug ? 'ws://api.legschina.com' : 'wss://legschina.com';
    this.globalData.url = _url;
    this.globalData.wssUrl = _wssUrl;


    //获取高度
    let menu = wx.getMenuButtonBoundingClientRect();
    let that = this;
    wx.getSystemInfo({
      complete: (res) => {
        let Navigation_height = (menu.top - res.statusBarHeight) * 2 + menu.height + res.statusBarHeight;
        let height1 = menu.height - 2;
        that.globalData.header_input_height = height1;
        that.globalData.page_header_height = Navigation_height;
        that.globalData.statusBarHeight = res.statusBarHeight;
      },
    });
    //更新
    let updateManager = wx.getUpdateManager();
    updateManager.onUpdateReady(function () {
      wx.showModal({
        showCancel: false,
        title: '版本更新',
        content: '新版本已经准备好了，点击确定下载',
        success: res => {
          if (res.confirm) {
            updateManager.applyUpdate();
          }
        }
      });
    });
  },
  globalData: {
    userInfo: null,
    url: null,
    wssUrl:null,
    statusBarHeight: 0,
    header_input_height: 0,
    page_header_height: 0,
  },
})