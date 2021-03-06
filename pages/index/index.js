//index.js
//获取应用实例
const app = getApp();
const domainUrl = app.globalData.url;
let uploadFunction=require('../../utils/uploadFile.js');
let utils = require('../../utils/util.js')
Page({
  data: {
    array: [1, 2, 3, 4, 5, 99, 666, -1],
    range: [{
        key: "男",
        value: 0
      },
      {
        key: '女',
        value: 1
      },
      {
        key: '性别友好',
        value: 2
      }
    ],
    sex: '',
    pick_time: '',
    pick_date: '',
    pick_city: '',
    radio_items: [{
        id: 0,
        name: '中国'
      },
      {
        id: 1,
        name: '日本'
      },
      {
        id: 2,
        name: '香港'
      }
    ],
    status: false,
    img_src: '',
    videoSrc: '',
    img_width: 0,
    img_height: 0,
    range2: [{
        key: '男',
        value: 0
      },
      {
        key: '女',
        value: 1
      }
    ],
    ImgSrc: ''
  },
  TakePhoto: function () {
    var that = this;
    var ipath = '';
    this.ctx.takePhoto({
      success: (res) => {
        ipath = res.tempImagePath;
        that.setData({
          img_height: res.height,
          img_width: res.width,
          img_src: ipath
        });
        console.log(res);
        console.log('width :', res.width, "height :", res.height);
        wx.saveImageToPhotosAlbum({
          filePath: ipath,
          success: res => {
            wx.showToast({
              title: 'Success',
              icon: 'success',
              duration: 2500,
              mask: true
            });
          },
          fail: err => {
            console.log(err);
            wx.showToast({
              image: '/img/fail.png',
              title: 'fail',
              duration: 2500
            });
          }
        })
      },
      fail: err => {
        console.log(err);
      }
    });
  },
  startRecord() {
    this.ctx.startRecord({
      success: (res) => {
        console.log(res)
      }
    })
  },
  stopRecord() {
    this.ctx.stopRecord({
      success: (res) => {
        console.log(res);
        this.setData({
          src: res.tempThumbPath,
          videoSrc: res.tempVideoPath
        })
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },
  Scan: function (e) {
    wx.scanCode({
      success: res => {
        console.log(res);
      }
    });
  },
  //判断switch是否是打开状态
  Ischecked: function (e) {
    var a = this.data.status;
    this.setData({
      status: !a
    })
  },
  radioChange: function (e) {
    console.log(e);
  },
  //region选择器
  CityChange: function (e) {
    console.log(e);
    this.setData({
      pick_city: e.detail.value
    });
  },
  //date选择器change事件
  DateChange: function (e) {
    this.setData({
      pick_date: e.detail.value
    })
  },
  //Time change事件
  TimeChange: function (e) {
    this.setData({
      pick_time: e.detail.value
    });
  },
  //性别选择器change事件
  selectorChange: function (e) {
    for (var i = 0; i < this.data.range.length; ++i) {
      if (this.data.range[i].value == e.detail.value) {
        this.setData({
          sex: this.data.range[i].key
        });
      }
    }
  },
  onLoad: function () {
    let that = this;
    wx.request({
      url: domainUrl + '/File/GetImg',
      success: res => {
        let base64 = wx.arrayBufferToBase64(res.data.headImg);
        that.setData({
          ImgSrc: base64
        });
      }
    });


    this.ctx = wx.createCameraContext();
  },
  //下载pic
  down: function () {
    wx.downloadFile({
      url: domainUrl + '/img/abcd.png',
      success: res => {
        const path = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success: res => {
            wx.showToast({
              title: '保存成功',
            });
          },
          fail: err => {
            wx.showToast({
              title: '保存失败',
              image: '/img/fail.png'
            });
          }
        });
      }
    });
  },
  //上传
  uploadFile: function () {
    wx.chooseImage({
      success: function (res) {        
        let path = res.tempFilePaths[0];
        wx.uploadFile({
          url: domainUrl + '/File/UploadFile',
          header: {
            "content-type": "multipart/form-data"
          },
          filePath: path,
          name: 'file',
          formData: {
            'filePath': path
          },
          success: function (res) {
            let result=JSON.parse(res.data);
            let content="上传失败！";
            if(result.Success) content="上传成功！";
            wx.showModal({
              showCancel:false,
              title:'Tips',
              content:content
            });
          },
          fail: err => {
            console.log(err);
          }
        });
      },
    });
  },
  openDoc: () => {
    wx.downloadFile({
      url: domainUrl + '/img/img09930.pdf',
      success: res => {
        const TFilePath = res.tempFilePath;
        wx.openDocument({
          filePath: TFilePath,
          showMenu: true,
          success: res => {
            console.log(res);
            //保存文件
            wx.saveFile({
              tempFilePath: TFilePath,
              success: res => {
                console.log(res);
              }
            });
          },
          fail: err => {
            console.log(err);
          }
        });
      }
    });
  },
  viewImg() {
    wx.previewImage({
      urls: [
        domainUrl + '/img/meinv.png',
        domainUrl + '/img/canon.png',
        domainUrl + '/img/bazaar.png',
      ],
    });

  },
  // 下发模版消息
  OpenCategory1: function () {
    wx.requestSubscribeMessage({
      tmplIds: ['lvwRHvXqqcPBRWWigbPpT0F7C89GFFdOI-Y4tjhpdqE'],
    });
    utils.getToken();
    let token = wx.getStorageSync('access_token');
    let url = 'https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=' + token;
    let TempData = {
      'name9': {
        'value': '宫志鑫'
      },
      'thing2': {
        'value': '申请作者'
      },
      'date4': {
        'value': '2020-04-18'
      },
      'phrase16': {
        'value': '审核完成'
      },
      'thing19': {
        'value': '审核通过'
      }
    };
    let data = {
      'touser': 'oVTwL41RinDRRX7gLZo7nGkcdYpI',
      'template_id': 'lvwRHvXqqcPBRWWigbPpT0F7C89GFFdOI-Y4tjhpdqE',
      'data': TempData
    }
    let callback = function (res) {
      console.log(res)
    }
    utils.HttpRequest(url, "POST", data, callback);
    wx.removeStorageSync('access_token');
  },
  websocket: () => {
    wx.navigateTo({
      url: '../Websocket/Websocket',
    });
  },
  //点击按钮上传文件到AliOss
  UploadToOss:function(){
    wx.chooseImage({
      count:1,
      complete: (res) => {
        let filePath= res.tempFilePaths[0];
        wx.showToast({
          title: '此功能被禁用',
        });
        // uploadFunction(filePath,'',res=>{
        //   console.log(res);
        // },err=>{
        //   console.log(err);
        // });
      },
    });
  },
});