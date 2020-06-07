const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navUrl: '',
    code: '',
    isGoIndex: {
      type: Boolean,
      value: true,
    }
  },

  onLoad: function (options) {
    let that = this;
    if (wx.getStorageSync("navUrl")) {
      that.setData({
        navUrl: wx.getStorageSync("navUrl")
      })
    } else {
      that.setData({
        navUrl: '/pages/index/index'
      })
    }

    wx.login({
      success: function (res) {
        if (res.code) {
          that.setData({
            code: res.code
          })
          console.log("hhhh");
        }
      }
    });
  },

  close() {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (this.data.isGoIndex) {
      wx.switchTab({ url: '/pages/index/index' });
    } else {
      this.setData({
        iShidden: true
      });
      if (currPage && currPage.data.iShidden != undefined) {
        currPage.setData({ iShidden: true });
      }
    }
  },

  bindGetUserInfo: function (e) {
    let that = this;
    //登录远程服务器
    if (that.data.code) {
      util.request(api.AuthLoginByWeixin, {
        code: that.data.code,
        userInfo: e.detail
      }, 'POST', 'application/json').then(res => {
        if (res.errno === 0) {
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
        } else {
          // util.showErrorToast(res.errmsg)
          wx.showModal({
            title: '提示',
            content: res.errmsg,
            showCancel: false
          });
        }
      });
    }
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    let userId = wx.getStorageSync('userId');

    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
      app.globalData.uid = userId;
      app.globalData.isLogin = true;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
      userId: app.globalData.uid,
    
    });
    if (that.data.navUrl && that.data.navUrl == '/pages/index/index') {
      wx.switchTab({
        url: that.data.navUrl,
      })
    } else if (that.data.navUrl) {
     // wx.redirectTo({
     //   url: that.data.navUrl,
      wx.switchTab({
        url: that.data.navUrl,
      })
    }
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})