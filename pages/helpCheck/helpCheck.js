var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp();
// pages/helpAdd/helpAdd.js
Page({
  data: {
    rejectcontent:'',
    issueId:0,
    traces:[],
    _num: 1,
    approveStatus:0
   // issueType,
   // issueTime
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    if (options.id) {
      this.setData({
        issueId: options.id
      })
      this.getUserIssue();
    }
  },

  defaulttap: function (e) {
    var num = this.data._num;
    if (num == 1) {
      this.setData({
        _num: 0
      })
    } 
  }, 
  defaulttap1: function (e) {
    var num = this.data._num;
    if (num == 0) {
      this.setData({
        _num: 1
      })
    } 
  }, 

  getUserIssue: function () {//get_user_issue
    let that = this;

    util.request(api.HelpIssueListbyId, { id: that.data.issueId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          traces: res.data.userIssueList
        });
        var li = [];
        var lists = res.data.userIssueList;
        if (lists.addTime) {
          var len = new Date(lists.addTime)
          var adt = util.formatTime(len)
          li.push(adt);
        }
        that.setData({
          issueTime: li,
          issueType: res.data.userIssueType.typeName
        })
      }
    });
  },

  formSubmit:function(e){
    
    var that = this;
    var flag = true;
    var warn = "";

    var num = this.data._num; 
    if(num == 0){
       that.setData({
         approveStatus:1
         })
       }else {
       that.setData({
        approveStatus:2,
        rejectcontent: e.detail.value.content
       })
    }
    var rejectcontent=that.data.rejectcontent
    if (num == 1 && rejectcontent=="") {
      warn = '请输入拒绝的理由';
    } else {
      flag = false;
    }

    if(flag==true){
      wx.showModal({
        title: '提示',
        content: warn
      })
    }else{
      util.request(api.HelpIssueCheck, 
      { 
        approveMsg: that.data.rejectcontent, 
        id: that.data.issueId,
        approveStatus: that.data.approveStatus
        }).then(function (res) {
      if (res.errno === 0) {

        wx.hideLoading();

        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          complete: function () {
            that.setData({
              index: 0,
              content: '',
              contentLength: 0,
              mobile: ''
            });
          }
        });
      } else {
        util.showErrorToast(res.data);
      }
      
    });
  }
    
  },

 
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})