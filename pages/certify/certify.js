// pages/integral-details/index.js

var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  active: true,
    integral:0
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },
  getUserInfo:function(){
    var that=this;
    var nowTime= new Date();
    var adt = util.formatTime(nowTime);
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let id = wx.getStorageSync('userId');

    that.setData({    
        userInfo: userInfo,
        uid:id,
        addTime:adt
            });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
    this.setData({
    integral:options.nmoney
    })
  },

   /**
   * 关闭捐赠提示
  */
 close:function(){
  this.setData({active: false});
},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   
  }
})