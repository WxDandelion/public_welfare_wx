var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp();
// pages/helpAdd/helpAdd.js
Page({
  data: {
    region: ['省','市','区'],
    index:0,
    hidde: true,
    array:["请选择求助类型","心理咨询","勤工助学","助力扶贫","善款筹集"],
    content:'',
    contentLength:0,
    mobile:'',
    username:'',
    detailinfo:'',
    provincename:'',
    cityname:'',
    collectionprice:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function (opends) {
    app.setBarColor();
  //  app.setUserInfo();
    var that = this;
  },
  
  bindRegionChange: function (e) {
  this.setData({
    region: e.detail.value
  })
  },
  
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    });
    if (this.data.index==4){
      this.setData({
        hidde: false
      })
    }else {
      this.setData({
        hidde: true
      })
    }
  },
  
  contentInput: function (e) {
   
    let that = this;
    this.setData({
      contentLength: e.detail.cursor,
      content: e.detail.value,
    });
  },
  

  formSubmit:function(e){
    
    var that = this;
    var flag = true;
    var warn = "";

    var name = e.detail.value.name;
    var mobile = e.detail.value.phone;
    var area = JSON.stringify(this.data.region);
    var fulladdress = e.detail.value.fulladdress;
    var gyhelptype = this.data.array[this.data.index];
    var wmoney = e.detail.value.wmoney;
    var wmoney = Number(wmoney);
    var typeid = this.data.index;
    var content = this.data.content;
    
    if (name == "") {
      warn = '请输入姓名';
    } else if (!/^1(3|4|5|7|8|9)\d{9}$/i.test(mobile)) {
      warn = '您输入的手机号有误'
    } else if (area == '["省","市","区"]'){
      warn = '请选择地区';
    } else if (fulladdress == "") {
      warn = "请填写具体地址";
    } else if (gyhelptype == "请选择求助类型") {
      warn = "请选择求助类型";
    } else if(that.data.hidde==false && wmoney==""){
      warn = "请填写筹集资金金额";
    } else if(content==""){
      warn = "请填写求助详情";
    } else {
      flag = false;
    }

    if(flag==true){
      wx.showModal({
        title: '提示',
        content: warn
      })
    }else{
      
      
      util.request(api.HelpIssuePost, 
      { userName: name, 
      typeId: that.data.index, 
      mobile: mobile, 
      content: that.data.content, 
      provinceName: that.data.region[0], 
      cityName: that.data.region[1], 
      countyName: that.data.region[2], 
      detailInfo: fulladdress, 
      collectionPrice: that.data.collectionprice ,
        }, 'POST','application/json').then(function (res) {
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