var app = getApp();
var wxh = require('../../../utils/wxh.js');
var utils = require('../../../utils/util.js');
var api = require('../../../config/api.js');

// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  userInfo:[],
  userLevelDesc:'',
  userRegTime:0,
  userMobile:'',
  orderStatusNum:[],
  coupon:'',
  uid:0,
  showModal: false,
  socialWorkInput: '',
  socialWorkId: "",
  inputValue: ""
  },

  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },

  catchTouchMove: function (res) {
    return false
  },

  Setting: function () {
    wx.openSetting({
      success: function (res) {
        console.log(res.authSetting)
      }
    });
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    app.setBarColor();
	  let userInfo = wx.getStorageSync('userInfo');
  	let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('userId');
    let userRegTime = wx.getStorageSync('userRegTime');
    let socialNumber = wx.getStorageSync('socialNumber');
    var len =new Date(userRegTime);
    var RegTime=utils.formatDate(len);

	// 页面显示
	   if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
     }
     that.setData({
      userInfo: app.globalData.userInfo,
      userRegTime:RegTime,
      uid: uid,
      socialWorkId: socialNumber
    })
     this.getuserLevel();
     this.getSocialNumber();
  }, 

  getuserLevel:function(){
    let that=this;
    let levelList = {
      "普通用户": 1,
      "青铜用户": 2,
      "白金用户": 3,
      "钻石用户": 4,
      "黑金用户": 5
    };
    var userLevel;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) {
      //获取用户等级
    utils.request(api.UserLevel).then(function (res) {
        if (res.errno === 0) {
          if (res.data) {
            userLevel=res.data.userLevel;
            wx.setStorage({
              key: "userLevelId",
              data: levelList[userLevel]
            });
            that.setData({
            userLevelDesc: userLevel,
            });
          } 
        }
      }) 
    } 
  },
  /**
   * 绑定弹窗关闭
   */
  modalCancel: function() {
    this.setData({
      socialWorkInput: "",
      inputValue: ""
    })
  },
  /**
   * 社工绑定弹窗 绑定确定 按钮
   */
  modalConfirm: function() {
    let that = this;
    // 请求绑定社工编号
    //api.SocialNumberBind + '?number=' + that.data.socialWorkInput
    utils.request(api.SocialNumberBind, {number: that.data.socialWorkInput}).then(function (res) {
      if (res.errno === 0) {
        wx.setStorage({
          key: "socialNumber",
          data: that.data.socialWorkInput
        });
        that.setData({
          socialWorkId: that.data.socialWorkInput
        })
      } else {
        wx.showToast({
          title: '绑定失败，请稍后再试',
          duration: 2000
        })
      }
      that.setData({
        inputValue: ""
      })
    }) 
  },
  /**
   * 获取输入框内容
   * @param {*} e 
   */
  bindInputValue: function(e) {
    let that = this;
    that.setData({
      socialWorkInput: e.detail.value
    })
  },
  /**
   * 控制弹窗开启
   */
  showBindModal: function() {
    this.setData({
      showModal: true,
    })
  },
  /**
   * 获取个人社工信息
   * 若所有登陆都获取到了社工信息，这部分则可以省去
   */
  getSocialNumber: function() {
    let that = this;
    if(wx.getStorageSync('token') && !that.data.socialWorkId) {
      utils.request(api.CheckIsSocial).then(function (res) {
        if (res.errno === 0) {
          if (res.data) {
            wx.setStorage({
              key: "socialNumber",
              data: res.data.socialNumber
            });
            that.setData({
              socialWorkId: "",
            });
          } 
        }
      }) 
    }
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

  goPages: function (e) {
      wx.navigateTo({
        url: e.currentTarget.dataset.url
     })
  },
  onShow: function () {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }
    this.setData({
      userinfo: app.globalData.userInfo,
    });
  },  
   /**
   * 生命周期函数--公益排行
   */
  welfarerank:function(){
    wx.navigateTo({
      url: '/pages/welfare_rank/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的积分
   */
  integral: function () {
    wx.navigateTo({
      url: '/pages/ucenter/integral/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的优惠卷
   */
  coupons: function () {
    wx.navigateTo({
      url: '/pages/ucenter/coupon/coupon',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
   /**
   * 生命周期函数--我的收藏
   */
  collects: function () {
    wx.navigateTo({
      url: '/pages/ucenter/collect/collect',
    })
  },
   
   /**
   * 生命周期函数--地址管理
   */
  goAddress: function () {
    wx.navigateTo({
      url: '/pages/ucenter/address/address',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--会员中心
   */
  goUser: function () {
    wx.navigateTo({
      url: '/pages/ucenter/uservip/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--审核进度查询
   */
  goTrace: function () {
    wx.navigateTo({
      url: '/pages/helpissue/helpissue',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

   /**
   * 生命周期函数--签到
   */
  goSign: function () {
    wx.navigateTo({
      url: '/pages/ucenter/sgin/index',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

   /**
   * 生命周期函数--我的反馈
   */
  goFeedback: function () {
    wx.navigateTo({
      url: '/pages/ucenter/feedback/feedback',
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})