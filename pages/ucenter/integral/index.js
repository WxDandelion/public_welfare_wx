var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '积分详情',
      'color': true,
      'class': '0'
    },
    navList:[
      { 'name': '分值明细', 'icon':'icon-mingxi'},
      { 'name': '分值提升', 'icon': 'icon-tishengfenzhi' }
    ],
    current:0,
    page: 1,
    limit: 10,
    integralList:[],
    integral: 0,
    task_integral: 0,
    deduction_integral: 0,
    donation_integral: 0,
    loadend: false,
    loading: false,
    loadTitle: '',
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },
  getUserInfo:function(){
    var that=this;
    var integralList = [];
    var integralList;
    var sum_integral;
    var deduction_integral=0;
    var task_integral;
    var donation_integral;
    var sign_integral;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    util.request(api.IntegralList, {page: that.data.page, size: that.data.limit}).then(function (res) {
      if (res.errno == 0 && userInfo && token) {
        integralList = res.data.userAccountList;
        task_integral = res.data.task_integral || 0;
        donation_integral= res.data.donation_integral || 0;
        sign_integral = res.data.sign_integral || 0;
        sum_integral = task_integral + donation_integral + sign_integral + deduction_integral;
        for(var i = 0; i < integralList.length; ++i){
          var len= new Date(integralList[i].createTime);
          integralList[i].createTime = util.formatTime(len)
          if(integralList[i].modifyTime) {
            var lenModify= new Date(integralList[i].modifyTime);
            integralList[i].modifyTime = util.formatTime(lenModify)
          }
        }
        that.setData({
          integralList: integralList,
          deduction_integral: deduction_integral,
          donation_integral: donation_integral,
          task_integral: task_integral,
          integral:sum_integral,
          page: that.data.page + 1,
          loadend: integralList.length < that.data.limit ? true : false,
          loadTitle: integralList.length < that.data.limit ? (integralList.length ? "哼~😕我也是有底线的~" : "暂无积分明细") : "加载更多",
        });
      }
    })
  },

  /**
   * 获取积分明细
  */
  getIntegralList: function() {
    let that = this;
    if(this.data.loading) {
      return
    }
    if(this.data.loadend) {
      return
    }
    that.setData({loading:true,loadTitle:''});
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    util.request(api.IntegralList, {page: that.data.page, size: that.data.limit}).then(function (res) {
      if (res.errno == 0 && userInfo && token) {
        let integralList = res.data.userAccountList;
        for(var i = 0; i < integralList.length; ++i){
          var len= new Date(integralList[i].createTime);
          integralList[i].createTime = util.formatTime(len);
          if(integralList[i].modifyTime) {
            var lenModify= new Date(integralList[i].modifyTime);
            integralList[i].modifyTime = util.formatTime(lenModify)
          }
        }
        that.setData({
          integralList: that.data.integralList.concat(integralList),
          loadend: integralList.length < that.data.limit ? true : false,
          page: that.data.page + 1,
          loading: false,
          loadTitle: integralList.length < that.data.limit ? '哼~😕我也是有底线的~' : "加载更多"
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },
  
  nav:function(e){
     this.setData({
       current: e.currentTarget.dataset.idx
     })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getIntegralList();
  }
})