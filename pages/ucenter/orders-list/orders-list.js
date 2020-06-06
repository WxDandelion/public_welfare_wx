var app = getApp();
var wxh = require('../../../utils/wxh.js');
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    //url: app.globalData.urlImages,
    page: 1,
    size: 5,
    nomore: false,
    totalPages: 1,
    nowstatus:"",
    orderlist: [],
    orderlist_all: [],
    search: "",
    title: "暂无订单",
    hidden: false
  },
  setTouchMove: function (e) {
    var that = this;
    wxh.home(that, e);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();
    if (parseInt(options.nowstatus)){
      this.setData({
        nowstatus: (parseInt(options.nowstatus) - 1).toString()
      })
      this.getorderlist(parseInt(options.nowstatus) - 1);
    } else {
      this.getorderlist("");
    }
  },
  getorderlist:function(e){
    
    var that = this;
    var search = that.data.search;
    var status = e;
    if (that.data.totalPages <= that.data.page - 1) {
      that.setData({
        nomore: true,
        title: "全部加载完成",
        hidden: true
      })
      return;
     }
     /* 效果不太好
    that.setData({
      title: "玩命加载中..."
    })
    */
   let params = {
     page: that.data.page,
     size: that.data.size,
     status: that.data.nowstatus
   }
    util.request(api.OrderList, params).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          title: "加载更多",
          orderlist_all: res.data.data,
          page: res.data.currentPage + 1,
          totalPages: res.data.totalPages,
          orderlist: that.data.orderlist.length ? that.data.orderlist.concat(res.data.data) : res.data.data
        })
        wx.hideLoading();
      }
    }
    )},
  statusClick:function(e){
    var nowstatus = e.currentTarget.dataset.show;
    this.setData({
       nowstatus: nowstatus,
       page:1,
       orderlist: [],
       title: "玩命加载中...",
       hidden: false
    });
    this.getorderlist(nowstatus);
  },
  searchSubmit:function(){
    this.setData({
      orderlist: [],
      page:1,
      title: "玩命加载中...",
      hidden: false
    });
    var e = this.data.nowstatus;
    this.getorderlist(e);
  },
  searchInput:function(e){
    this.setData({
      search: e.detail.value
    });
  },
  delOrder:function(e){
    var header = {
      'content-type': 'application/x-www-form-urlencoded',
    };
    var uni = e.currentTarget.dataset.uni;
    var that = this;
    wx.showModal({
      title: '确认删除订单？',
      content: '订单删除后将无法查看',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.url + '/routine/auth_api/user_remove_order?uid=' + app.globalData.uid,
            data: { uni: uni },
            method: 'get',
            header: header,
            success: function (res) {
              wx.hideLoading();
              if (res.data.code == 200){
                wx.showToast({
                  title: '成功',
                  icon: 'success',
                  duration: 2000
                });
              } else {
                wx.showToast({
                  title: res.data.msg,
                  icon: 'none',
                  duration: 2000
                })
              }
              
            },
            fail: function (res) {
              console.log('submit fail');
            },
            complete: function (res) {
              console.log('submit complete');
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onReachBottom: function () {
    var e = this.data.nowstatus;
    this.getorderlist(e);
  },
  loadMore: function() {
    let that = this;
    that.getorderlist();
  }
})