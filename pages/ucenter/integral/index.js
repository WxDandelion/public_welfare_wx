// pages/integral-details/index.js

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
    page:1,
    limit:10,
    integralList:[],
    integral:0,
    task_integral:0,
    deduction_integral:0,
    donation_integral:0,
    loadend:false,
    loading:false,
    loadTitle:'加载更多',
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
    this.getIntegralList();
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
    util.request(api.IntegralList).then(function (res) {
      if (res.errno == 0 && userInfo && token) {
            integralList= res.data.userAccountList;
            task_integral=res.data.task_integral;
            donation_integral=res.data.donation_integral;
            sign_integral=res.data.sign_integral;
            sum_integral=task_integral+donation_integral+sign_integral+deduction_integral;
            for(var i = 0; i < integralList.length; ++i){
            var len= new Date(integralList[i].createTime);
            integralList[i].createTime = util.formatTime(len)
            }
            that.setData({
            integralList:integralList,
            userInfo: userInfo,
            deduction_integral:res.data.deduction_integral,
            donation_integral:res.data.donation_integral,
            task_integral:res.data.task_integral,
            integral:sum_integral
            });
          }
    })
  },

  /**
   * 获取积分明细
  */
  getIntegralList:function(){
    var that=this;
    if(that.data.loading) return;
    if(that.data.loadend) return;
    that.setData({loading:true,loadTitle:''});
    getIntegralList({ page: that.data.page, limit: that.data.limit }).then(function(res){
      var list=res.data,loadend=list.length < that.data.limit;
      that.data.integralList = app.SplitArray(list,that.data.integralList);
      that.setData({
        integralList: that.data.integralList,
        page:that.data.page+1,
        loading:false,
        loadend:loadend,
        loadTitle:loadend ? '哼~😕我也是有底线的~':"加载更多"
      });
    },function(res){
      that.setData({ loading: false, loadTitle:'加载更多'});
    });
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