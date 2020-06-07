// pages/commission_rank/index.js
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '公益排行',
      'color': true,
      'class': '0'
    },
    navList: ["周排行", "月排行"],
    active: 0,
    rankList:[],
    page: 1,
    limit:10,
    size: 5,
    loadend:false,
    loading:false,
    loadTitle:'加载更多',
    type:'week',
    position:0,
    isClone:false
  },
  switchTap:function(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      active: index,
      type: index ? 'month': 'week',
      page: 1,
      loadend:false,
      rankList:[],
    });
    this.getRankList();
  },
  onLoadFun:function(){
    this.getRankList();
  },
  getRankList:function(){
    let that=this;
    if(this.data.loadend) return;
    if(this.data.loading) return;
    this.setData({loading:true,loadTitle:''});
    let params = {
      page: that.data.page,
      size: that.data.size
    }
    if(that.data.type=='week'){
      util.request(api.UserRankWeek, params).then(function (res) {
      if (res.errno == 0 ) {
      let list = res.data.userRankbyWeek;
      let loadend = list.length < that.data.limit;
      that.setData({
        loading:false,
        loadend: loadend,
        loadTitle: loadend ? '😕我也是有底线的':'加载更多',
        rankList: that.data.rankList.concat(list),
        position: res.data.position
       });
     }
      that.setData({loading:false,loadTitle:'加载更多'});
      })
    } else if(that.data.type=='month'){
      util.request(api.UserRankMonth + "?page=" + that.data.page + "&size=" + that.data.size).then(function (res) {
        if (res.errno == 0 ) {
        let list = res.data.userRankbyMonth;
        let loadend = list.length < that.data.limit;
        that.setData({
          loading:false,
          loadend: loadend,
          loadTitle: loadend ? '😕我也是有底线的':'加载更多',
          rankList: that.data.rankList.concat(list),
          position: res.data.position
        });
       }
        that.setData({loading:false,loadTitle:'加载更多'});
        })
     }
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRankList();
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
    if (app.globalData.isLogin){
      //this.setData({ page: 1, loadend: false, rankList:{}});
      this.getRankList();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({isClone:true});
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
    this.getRankList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  loadMore: function() {
    console.log(111);
    let that = this;
    if(that.data.type=='week'){
      util.request(api.UserRankWeek).then(function (res) {
      if (res.errno == 0 ) {
        let list = res.data.userRankbyWeek;
        let loadend = list.length < that.data.limit;
      that.setData({
        loading:false,
        loadend: loadend,
        loadTitle: loadend ? '😕我也是有底线的':'加载更多',
        rankList: that.data.rankList.concat(res.data.userRankbyWeek),
       });
     }
      that.setData({loading:false,loadTitle:'加载更多'});
      })
    } else if(that.data.type=='month'){
      util.request(api.UserRankMonth).then(function (res) {
        if (res.errno == 0 ) {
        let list = res.data.userRankbyMonth;
        let loadend = list.length < that.data.limit;
        that.setData({
          loading:false,
          loadend: loadend,
          loadTitle: loadend ? '😕我也是有底线的':'加载更多',
          rankList: that.data.rankList.concat(res.data.userRankbyMonth),
        });
       }
        that.setData({loading:false,loadTitle:'加载更多'});
        })
     }
  }
})