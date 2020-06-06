var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();

Page({
  data: {
    userInfo: {},
    issueSN: [],
    issueId:0,
    issueTime:[],
    issueStatus:[],
    traces:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (app.globalData.isLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        isLogin: true
      })
    }
    if (options.id) {
      this.setData({
        issueId: options.id
      })
      this.getUserIssue();
     }
  },
  getUserIssue: function() {//get_user_issue
    let that = this;
   
    util.request(api.HelpIssueListbyId, { id: that.data.issueId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          traces: res.data
        });
        var li = [];
        var lists = res.data.userIssueList;
        if (lists.addTime) {
            var len = new Date(lists.addTime)
            var adt = util.formatTime(len)
            li.push(adt);
          }
        if (lists.updateTime) {
            var len = new Date(lists.updateTime)
            var adt = util.formatTime(len)
            li.push(adt);
          }
        that.setData({
          issueTime: li
        })
      }
    });
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取用户的登录信息
    if (app.globalData.isLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
        isLogin: true
      });
  }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})