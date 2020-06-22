var util = require('../../utils/util.js');
var api = require('../../config/api.js');


var app = getApp();
Page({
  data: {
    region: ['省','市','区'],
    mobile:'',
    username:'',
    detailinfo:'',
    provincename:'',
    cityname:'',
    active: false
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
  
  /**
  * 关闭参会提示
  */
 close:function(){
  this.setData({active: false});
  wx.navigateBack({
    delta: 1,
    complete: (res) => {
    },
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
    
    
    if (name == "") {
      warn = '请输入姓名';
    } else if (!/^1(3|4|5|7|8|9)\d{9}$/i.test(mobile)) {
      warn = '您输入的手机号有误'
    } else if (area == '["省","市","区"]'){
      warn = '请选择地区';
    } else if (fulladdress == "") {
      warn = "请填写具体地址";
    } else {
      flag = false;
    }

    if(flag==true){
      wx.showModal({
        title: '提示',
        content: warn
      })
    }else{
      
      
    /*  util.request(api.JoinInPost, 
      { userName: name, 
      mobile: mobile, 
      provinceName: that.data.region[0], 
      cityName: that.data.region[1], 
      countyName: that.data.region[2], 
      detailInfo: fulladdress, 
        }, 'POST','application/json').then(function (res) {
      if (res.errno === 0) {

        wx.hideLoading();

        wx.showToast({
          title: res.data,
          icon: 'success',
          duration: 2000,
          complete: function () {
            that.setData({
              mobile: ''
            });
          }
        });
      } else {
        util.showErrorToast(res.data);
      }
      
    });*/
    this.setData({
      active: true
    });
    wx.navigateTo({
      url: '/pages/share/index?type=2',
    })
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