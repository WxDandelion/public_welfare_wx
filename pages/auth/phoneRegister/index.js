var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var app = getApp()

Page({
    data: {
        mobile: '',
        mobileInput: '',
        userInfo: {
            avatarUrl: '',
            nickName: ''
        },
        password: '',
        passwordInput: '',
        confirmPassword: '',
        confirmPasswordInput: '',
        disableGetMobileCode: false,
        disableSubmitMobileCode: true,
        getCodeButtonText: '获取验证码',
        type: 0,
        code: '',
        codeInput: '',
    },

    onShow: function () {
    },

    onLoad: function (options) {
        var that = this
        // type 0 为注册，1为忘记密码
        that.setData({
            userInfo: app.globalData.userInfo,
            type: options.type
        })
        if (app.globalData.token) {
        } else {
            var token = wx.getStorageSync('userToken')
            if (token) {
                app.globalData.token = token
            }
        }

    },

    bindCheckMobile: function (mobile) {
        if (!mobile) {
            wx.showModal({
                title: '错误',
                content: '请输入手机号码'
            });
            return false
        }
        if (!mobile.match(/^1[3-9][0-9]\d{8}$/)) {
            wx.showModal({
                title: '错误',
                content: '手机号格式不正确，仅支持国内手机号码'
            });
            return false
        }
        return true
    },

    bindGetPassCode: function (e) {
        var that = this
        that.setData({disableGetMobileCode: true})
    },

    bindInputMobile: function (e) {
        this.setData({
            mobile: e.detail.value,
        })
    },

    bindInputCode: function (e) {
        this.setData({
            code: e.detail.value,
        })
    },

    countDownPassCode: function () {
        if (!this.bindCheckMobile(this.data.mobile)) {
            return
        }
        util.request(api.SendMsg, {num: this.data.mobile})
            .then(function (res) {
                console.log(res);
                if (res.errno == 0) {
                    wx.showToast({
                        title: '发送成功',
                        icon: 'success',
                        duration: 1000
                    })
                    var pages = getCurrentPages()
                    var i = 60;
                    var intervalId = setInterval(function () {
                        i--
                        if (i <= 0) {
                            pages[pages.length - 1].setData({
                                disableGetMobileCode: false,
                                disableSubmitMobileCode: false,
                                getCodeButtonText: '获取验证码'
                            })
                            clearInterval(intervalId)
                        } else {
                            pages[pages.length - 1].setData({
                                getCodeButtonText: i,
                                disableGetMobileCode: true,
                                disableSubmitMobileCode: false
                            })
                        }
                    }, 1000);
                } else {
                    wx.showToast({
                        title: '发送失败',
                        icon: 'none',
                        duration: 1000
                    })
                }
            });

    },

    bindLoginMobilecode: function (e) {
        let that = this;
        var {mobile, code, password, confirmPassword} = this.data;
        if (!this.bindCheckMobile(mobile)) {
            return
        }
        if (!(e.detail.value.code && e.detail.value.code.length === 6)) {
            wx.showModal({
                title: '错误信息',
                content: '验证码格式错误',
                showCancel: false
              });
            return
        }
        if (password.length < 3) {
            wx.showModal({
              title: '错误信息',
              content: '密码不得少于3位',
              showCancel: false
            });
            return
        }
        if (password != confirmPassword) {
            wx.showModal({
              title: '错误信息',
              content: '确认密码不一致',
              showCancel: false
            });
            return;
          }
        wx.showToast({
            title: '操作中...',
            icon: 'loading',
            duration: 5000
        })
        util.request(api.CheckCode, {code: e.detail.value.code, num: mobile})
            .then(function (res) {
                if (res.errno === 0) {
                    that.registUser();                   
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '验证码错误',
                        showCancel: false
                    })
                }
            })
    },
    registUser: function() {
        let that = this;
        let params = {
            mobile: that.data.mobile,
            password: that.data.password
        };
        let url = that.data.type == 0 ? api.Register : api.EditPassword;
        util.request(url, params).then(function (res) {
            console.log(res);
            if (res.errno == 0) {
                wx.showModal({
                    title: '提示',
                    content: '注册成功',
                    showCancel: false
                });
                that.login();
            } else {
                wx.showModal({
                    title: '提示',
                    content: '注册失败，请稍后再试',
                    showCancel: false
                })
            }
          });
    },
    login: function() {
        let that = this;
        let params = {
            mobile: that.data.mobile,
            password: that.data.password
        };
        util.request(api.Login, params).then(function (res) {
            console.log(res);
            if (res.errno === 0) {
                //存储用户信息
                res.data.userInfo.avatarUrl = res.data.userInfo.avatarUrl ? res.data.userInfo.avatarUrl : '/static/images/default-avatar.jpg';
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
    clearInput: function (e) {
        switch (e.currentTarget.id) {
          case 'clear-mobile':
            this.setData({
              mobile: '',
              mobileInput: ''
            });
            break;
          case 'clear-password':
            this.setData({
              password: '',
              passwordInput: '',
            });
            break;
          case 'clear-confirm-password':
            this.setData({
              confirmPassword: '',
              confirmPasswordInput: '',
            });
            break;
          case 'clear-code':
            this.setData({
              code: '',
              codeInput: '',
            });
            break;
        }
      },
      bindPasswordInput: function (e) {
        this.setData({
          password: e.detail.value
        });
      },
      bindConfirmPasswordInput: function (e) {
        this.setData({
          confirmPassword: e.detail.value
        });
      },
})