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
      'title': '签到',
      'color': true,
      'class':'0'
    },
    signSystemList:[
    { 
    'day': '第1天',
    'is_sign': true,
    'sign_num': 10
    },
    { 
      'day': '第2天',
      'is_sign': false,
      'sign_num': 20
    },
    { 
      'day': '第3天',
      'is_sign': true,
      'sign_num': 40
    },
    { 
      'day': '第4天',
      'is_sign': true,
      'sign_num': 50
    },
    { 
      'day': '第5天',
      'is_sign': true,
      'sign_num': 60
    },
    { 
      'day': '第6天',
      'is_sign': true,
      'sign_num': 70
    },
    { 
      'day': '奖励',
      'is_sign': true,
      'sign_num': 100
    }
    ],
    active:false,
    userInfo:{},
    signCount:[],
    signList:[],
    integral:'',
    is_day_sign:false,
    sign_index:0,
    sum_sign_integral:0,
    sum_sign_day: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo();
  },

  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.getUserInfo();
  },

  getUserInfo:function(){
    var that=this;
    var sum_sign_day;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    if (userInfo && token) {
     this.setData({
      userInfo: userInfo
        });
    }
    util.request(api.IntegralType, { type_id: "sign" }).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          let now = new Date();
          let nowDay = util.formatDate(now);
          let beforeDay = util.formatDate(new Date(now.getTime() - 24*60*60*1000));
          let signDay = util.formatDate(new Date(res.data.userAccountList[0].modifyTime));
          sum_sign_day=res.data.sign_info,
          that.setData({
          signList:res.data.userAccountList,
          sum_sign_day: sum_sign_day,
          sum_sign_integral:res.data.userAccountList[0].balance,
          // 判断是否为前一天签到，是 则为succSign,否则 0
          sign_index: beforeDay == signDay || nowDay == signDay ? res.data.userAccountList[0].succsign : 0,
          signCount: that.PrefixInteger(sum_sign_day, 4), 
          is_day_sign: nowDay == signDay ? true : false
          })
        } 
      }
    })
  },

  /**
   * 数字分割为数组
   * @param int num 需要分割的数字
   * @param int length 需要分割为n位数组
  */
  PrefixInteger: function (num, length) {
    return (Array(length).join('0') + num).slice(-length).split('');
  },

  /**
   * 用户签到
  */
  goSign:function(e){
    let that = this;
    let signL = that.data.signList;
    var integral;
    var succ_record;
    let signTime = signL[0].modifyTime;
    let succday =signL[0].succsign;
    let nowDay = Date.parse(util.formatDate(new Date()));
    let signDay = Date.parse(util.formatDate(new Date(signTime)));
    var day = parseInt((nowDay-signDay)/(1000*60*60*24))
    if(day>1) { 
      succday=1; //签到不连续，连续天数归1
      integral = that.data.signSystemList[succday-1].sign_num,
      succ_record=succday;
      util.request(api.SignToday,{succ_record:succ_record,integral:integral}).then(function (res){
        if (res.errno === 0) {
        that.setData({
          active: true,
          integral: integral,
          sign_index: (that.data.sign_index + 1) > that.data.signSystemList.length ? 1 : that.data.sign_index + 1,
          is_day_sign:true,
          sum_sign_day: parseInt(that.data.sum_sign_day) + 1,
          signCount: that.PrefixInteger(that.data.sum_sign_day+1, 4), 
          sum_sign_integral:that.data.sum_sign_integral+integral
        });
      }
      })
    } else if (day==1){ //连续签到，连续天数加1
      succday=succday+1;
      if(succday==7){succdays=1};//最多连续7天归1
      integral = that.data.signSystemList[succday-1].sign_num,
      succ_record = succday;
      util.request(api.SignToday,{succ_record:succ_record,integral:integral}).then(function (res){
        if (res.errno === 0) {
        that.setData({
          active: true,
          integral: integral,
          sign_index: (that.data.sign_index + 1) > that.data.signSystemList.length ? 1 : that.data.sign_index + 1,
          is_day_sign:true,
          sum_sign_day: parseInt(that.data.sum_sign_day) + 1,
          signCount: that.PrefixInteger(that.data.sum_sign_day + 1, 4), 
          sum_sign_integral:that.data.sum_sign_integral+integral
        });
      }
      })
    } else { //今日已签到
      that.setData({
        is_day_sign:true
      });
    }
  },
  /**
   * 关闭签到提示
  */
  close:function(){
    this.setData({active: false});
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }

})