var app = getApp();
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
var WxParse = require('../../lib/wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
      'title': '公告详情',
      'content': "",
       articleId:0,
       addTime:[],
       "type":1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      articleId: options.id
    });
    this.getArticleOne();
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
    this.getArticleOne();
  },
  getArticleOne:function(){
    var that = this;
    util.request(api.ArticleListId, {
      id: that.data.articleId
    }).then(function(res) {
      if (res.errno === 0) {
         that.setData({ 
             title: res.data.articleList.title, 
             content: res.data.articleList.content,
             addTime: res.data.articleList.addTime
         });
         
          //html转wxml
        WxParse.wxParse('content', 'html', res.data.articleList.content, that, 0);
        var li = [];
        var lists = res.data.articleList;
        if (lists.addTime) {
          var len = new Date(lists.addTime)
          var adt = util.formatTime(len)
          li.push(adt);
          }
        that.setData({
          addTime: li
        })
        
      }
    });
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