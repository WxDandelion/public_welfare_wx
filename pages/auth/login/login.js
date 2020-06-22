var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    username: '',
    usernaemInput: '',
    password: '',
    passwordInput: '',
    code: '',
    codeInput: '',
    loginErrorCount: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 页面渲染完成

  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  weixinLogin: function() {
      wx.navigateTo({
        url: '/pages/auth/btnAuth/btnAuth',
      })
  },

  startLogin: function () {
    var that = this;

    if (that.data.password.length < 1 || that.data.username.length < 1) {
      wx.showModal({
        title: '错误信息',
        content: '请输入用户名和密码',
        showCancel: false
      });
      return false;
    }
    let params = {
      mobile: that.data.username,
      password: that.data.password
    };
    util.request(api.Login, params).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        that.setData({
          'loginErrorCount': 0
        });
        res.data.userInfo.avatarUrl = res.data.userInfo.avatarUrl ? res.data.userInfo.avatarUrl : '/static/images/default-avatar.jpg';
        //存储用户信息
        wx.setStorageSync('userInfo', res.data.userInfo);
        wx.setStorageSync('token', res.data.token);
        wx.setStorageSync('userId', res.data.userId);
        wx.setStorageSync('userRegTime', res.data.userRegTime);
        wx.setStorageSync('userDeduIntegral', res.data.userDeduIntegral);
        wx.setStorageSync('userDonaIntegral', res.data.userDonaIntegral);
        wx.setStorageSync('userTaskIntegral', res.data.userTaskIntegral);
        wx.setStorageSync('userMobile', res.data.userMobile);
        wx.setStorageSync('userLevelId', res.data.userlevelId);
        wx.setStorageSync('socialNumber', res.data.socialNumber);
        wx.setStorageSync('idForShow', res.data.idForShow);
        wx.switchTab({
          url: '/pages/ucenter/index/index',
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '登录失败，请稍后再试',
          showCancel: false
        })
      }
    });
  },
  bindUsernameInput: function (e) {

    this.setData({
      username: e.detail.value
    });
  },
  bindPasswordInput: function (e) {

    this.setData({
      password: e.detail.value
    });
  },
  bindCodeInput: function (e) {

    this.setData({
      code: e.detail.value
    });
  },
  clearInput: function (e) {
    switch (e.currentTarget.id) {
      case 'clear-username':
        this.setData({
          username: '',
          usernaemInput: '',
        });
        break;
      case 'clear-password':
        this.setData({
          password: '',
          passwordInput: '',
        });
        break;
      case 'clear-code':
        this.setData({
          code: '',
          codeInput: '',
        });
        break;
    }
  }
})