var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var app = getApp();

Page({
  data: {
    issueList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getIssueList();
  },
  getIssueList (){
    let that = this;
    util.request(api.HelpIssueList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          issueList: res.data
        });
      }
    });
  },
  issueAddOrUpdate (event) {
    wx.navigateTo({
      url: '/pages/helpAdd/helpAdd'
    });
  },
  issueDetail(event){
    wx.navigateTo({
      url: '/pages/ucenter/expressInfo/expressInfo?id='+event.currentTarget.dataset.issueId
      });
  },
  
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})