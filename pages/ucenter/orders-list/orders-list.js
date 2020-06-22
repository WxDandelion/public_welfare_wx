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
    page: [1, 1, 1, 1, 1],
    size: 10,
    nomore: [false, false, false, false, false],
    loading: [false, false, false, false, false],
    total: [],
    nowstatus: -1,
    orderlist: [[],[],[],[],[]],
    orderlist_all: [],
    search: "",
    title: "",
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
    this.setData({
      nowstatus: parseInt(options.nowstatus) - 1
    });
    this.getorderlist(parseInt(options.nowstatus) - 1);
  },
  getorderlist:function(e){
    let status = e;
    let tmpStatus = parseInt(status) + 1;
    var that = this;
    let { nomore, loading, total, page, orderlist, search, size} = that.data;
    if(this.data.loading[tmpStatus]) {
      return
    }
    if(nomore[tmpStatus]) {
      return
    }
    //let status = that.data.nowstatus;
    loading[tmpStatus] = true;
    that.setData({loading: loading, title:'玩命加载中'});
   let params = {
     page: page[tmpStatus],
     size: size,
     status: parseInt(status)
   };
    util.request(api.OrderList, params).then(function (res) {
      if (res.errno === 0) {
        total[tmpStatus] = res.data.count;
        page[tmpStatus] = page[tmpStatus] + 1
        if(orderlist[tmpStatus].length) {
          orderlist[tmpStatus] = orderlist[tmpStatus].concat(res.data.data);
        } else {
          orderlist[tmpStatus] = res.data.data;
        }
        nomore[tmpStatus] = res.data.count > orderlist[tmpStatus].length ? false : true;
        loading[tmpStatus] = false;
        that.setData({
          title: res.data.count > orderlist[tmpStatus].length ? "加载更多" : (orderlist[tmpStatus].length == 0 ? "暂无订单" : "全部加载完成"),
          nomore: nomore,
          orderlist_all: res.data.data,
          page: page,
          total: total,
          orderlist: orderlist,
          loading: loading
        })
        wx.hideLoading();
      }
    })
  },
  statusClick:function(e){
    var nowstatus = e.currentTarget.dataset.show;
    this.setData({
       nowstatus: parseInt(nowstatus),
       title: "玩命加载中...",
       hidden: false
    });
    this.getorderlist(nowstatus);
  },
  searchSubmit:function(){
    // 待修改
    // this.setData({
    //   orderlist: [],
    //   page:1,
    //   title: "玩命加载中...",
    //   hidden: false
    // });
    // var e = this.data.nowstatus;
    // this.getorderlist(e);
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
  // onReachBottom: function () {
  //   var e = this.data.nowstatus;
  //   this.getorderlist(e);
  // },
  loadMore: function() {
    let that = this;
    that.getorderlist(that.data.nowstatus);
  }
})