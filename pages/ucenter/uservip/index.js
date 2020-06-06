// pages/member-center/index.js
var utils = require('../../../utils/util.js');
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
      'title': '会员中心',
      'class':'1',
      'color':true
    },
    vipList: [],
    indicatorDots: false,
    circular: true,
    autoplay: false,
    interval: 3000,
    duration: 500,
    swiperIndex: 0,
    growthValue: true,
    userLevel: 0,
    task:[],//任务列表
    reachCount: 0,
    integral : 0
  },
  /**
   * 授权回调
  */
  onLoadFun:function(){
    this.setLeveLComplete();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setLeveLComplete();
  },
  /**
   * 会员切换
  */
  bindchange(e) {
    var that = this;
    var index = e.detail.current;
    let finishTask = that.data.task[index].filter(function(item) {return item.finish == true})
    this.setData({
      swiperIndex: index,
      reachCount: finishTask.length
    });
  },
  /**
   * 关闭说明
  */
  growthValue:function(){
    this.setData({growthValue: true})
  },
  /**
   * 打开说明
   * 并未做点击后的解释效果
  */
  opHelp:function(e){
    // var index = e.currentTarget.dataset.index;
    // this.setData({ growthValue: false, illustrate: this.data.task[index].illustrate});
  },
  /**
   * 设置会员
  */
  setLeveLComplete: function() {
    let that = this;
    that.getuserLevel();
    that.getVipList();
  },
  getuserLevel: function(){
    let that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    if (userInfo && token) {
      //获取用户等级
      let level_id = wx.getStorageSync('userLevelId');
      that.setData({
        userLevel: level_id
      })
    }
  },
  /**
   * 获取会员等级列表
  */
  getVipList: function() {
    var that=this;
    utils.request(api.UserLevelList).then(function (res) {
      if (res.errno === 0) {
        if (res.data) {
          // 若有会员等级相关权益，在此做数据处理，统一讲数据set至vipList中
          that.setData({
            vipList: res.data.userLevelList
          });
          // 由于task需要会员信息以及积分情况，因此嵌套了回调
          that.getIntegral();
        } 
      }
    }) 
},
  /**
   * 获取任务要求
  */
  getTask: function() {
    var that= this;
    let taskList = [];
    let sumIntegral = that.data.integral;
    //console.log(that.data.vipList);
    that.data.vipList.forEach(item => {
      let curTask = [];
      let obj = {};
      obj.type = "integral";
      obj.bar = parseInt(item.description);
      obj.finish = item.description > sumIntegral ? false : true;
      obj.speed = obj.finish ? 100 : (sumIntegral / obj.bar * 100);
      curTask.push(obj);
      taskList.push(curTask);
    });
    let finishTask = taskList[that.data.userLevel - 1].filter(function(item) {return item.finish == true})
    that.setData({
      task: taskList,
      reachCount: finishTask.length
    });
  },
  /**
  * 获取积分
  */
  getIntegral: function(){
    var that = this;
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    utils.request(api.IntegralList).then(function (res) {
      if (res.errno == 0 && userInfo && token) {
        let data = res.data;
        let sum_integral = data.task_integral + data.donation_integral + data.sign_integral + data.deduction_integral;
        that.setData({
          integral: sum_integral
        });
        that.getTask();
      }
    })
  },
})