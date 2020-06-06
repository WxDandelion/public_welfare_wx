// pages/donation/index.js

var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '积分详情',
      'color': true,
      'class': '0'
    },
    navList:[
      { 'name': '捐赠明细', 'icon':'icon-mingxi'},
    ],
    current: 0,
    wmoney:'',
    uid:0
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },

  /**
    * 生命周期函数--登录
    */
  goLogin: function () {
    wx.navigateTo({
      url: '/pages/auth/login/login',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
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

   bindinputNum(event) {
    let wmoney = this.data.wmoney;
    wmoney = event.detail.value;
    this.setData({
      wmoney: wmoney
    });
  },
    
 goDonation:function(e){
   var that = this;
   var flag = false;
   var warn = "";
   let uid = this.data.uid;

   let wmoney = this.data.wmoney;
   if (wmoney == "") {
     warn = "请填写捐赠金额";
   }  else {
     flag = false;
   }

   if (flag == true) {
     wx.showModal({
       title: '提示',
       content: warn
     })
    //  {
    //   balance:wmoney
    // }
   } else {
     util.request(api.Donation + "?balance=" + wmoney).then(function (res) {
         if (res.errno === 0) {
           wx.navigateTo({
             url: '/pages/certify/certify?id='+uid+'&nmoney='+wmoney
           });
         } else {
           util.showErrorToast(res.data);
         }
       });
   }
 } ,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setUserInfo();
    this.getUserInfo();
  },
  
  nav:function(e){
     this.setData({
       current: e.currentTarget.dataset.idx
     })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   
  }
})