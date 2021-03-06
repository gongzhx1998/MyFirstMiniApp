let app=getApp();
let domainUrl=app.globalData.url;
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  // return [year, month, day].map(formatNumber).join('/');
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**封装wx.request，返回requestTask
 * 
 * @param {*} url   请求地址
 * @param {*} method 请求方式 
 * @param {*} data    控制器参数，object类型
 * @param {*} callBack  回调
 * @param {*} header  请求头
 */
let HttpRequest = function (url, method, data,callBack,header) {
  if(header==null||header==''){
    header='application/json'
  }
  return wx.request({
    url: url,
    data: data,
    header:{
      // 'content-type': 'application/octet-stream' 鉴黄接口用到了
      // 'content-type': 'application/json'   大多数情况用这个
      // 'content-type':"multipart/form-data"  上传文件
      'content-type': header
    },
    fail: (err) => {
      wx.showModal({
        showCancel:false,
        title:'Tips',
        content:err.errMsg
      });
    },    
    method: method,
    success: callBack  
  });  
}
//获取access_token
let getToken=function(){
  wx.request({
    url: domainUrl+'/wxLogin/GetToken',
    method:'POST',
    success:res=>{      
      wx.setStorageSync('access_token', res.data.AccessToken);
    }
  });
}
module.exports = {
  formatTime: formatTime,
  HttpRequest: HttpRequest,
  getToken:getToken
}