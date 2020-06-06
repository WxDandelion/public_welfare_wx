var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

var app = getApp();
Page({
  data: {
    _num:1,
    region: ['省','市','区'],
    //cartId : '',
    //pinkId : '',
    //couponId : '',
    address: {
      id:0,
      province_id: 0,
      city_id: 0,
      district_id: 0,
      address: '',
      full_region: '',
      userName: '',
      telNumber: '',
      is_default: 0
    },
    addressId: 0,
    //userAddress:[]
  },
 /*bindinputMobile(event) {
    let address = this.data.address;
    address.telNumber = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    address.userName = event.detail.value;
    this.setData({
      address: address
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    address.detailInfo = event.detail.value;
    this.setData({
      address: address
    });
  }, */
  
  onLoad: function (options) {
    app.setBarColor();
    app.setUserInfo();
    /*if (options.cartId){
      this.setData({
        cartId: options.cartId,
        pinkId: options.pinkId,
        couponId: options.couponId,
      })
    } */
    if (options.id){
      this.setData({
        addressId: options.id
      })
      this.getUserAddress();
    }
  },
  getUserAddress: function () {//get_user_address
    let that = this;
    util.request(api.AddressDetail, { id: that.data.addressId }).then(function (res) {
      if (res.errno === 0) {
        if(res.data){
          console.log(res);
          var regionOne = "region.0";
          var regionTwo = "region.1";
          var regionTherr = "region.2";
            that.setData({
                address: res.data,
                [regionOne]: res.data.provinceName,
                [regionTwo]: res.data.cityName,
                [regionTherr]: res.data.countyName,
                _num: res.data.is_default == 1 ? 0 :1
            });
        }
      }
    });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  defaulttap:function(e){
    var num = this.data._num;
    if(num==1){
      this.setData({
        _num: 0
      })
    }else{
      this.setData({
        _num: 1
      })
    }
  }, 
  
   formSubmit: function (e) {
    var warn = "";
    var that = this;
    var flag = true;
    //var cartId = '';
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var area = JSON.stringify(this.data.region);
    var fulladdress = e.detail.value.fulladdress;
    //var addressP = {};
    let address = this.data.address;
    if (name == "") {
      warn = '请输入姓名';
    } else if (!/^1(3|4|5|7|8|9)\d{9}$/i.test(phone)) {
      warn = '您输入的手机号有误'
    } else if (area == '["省","市","区"]'){
      warn = '请选择地区';
    } else if (fulladdress == "") {
      warn = "请填写具体地址";
    } else{
      flag = false;
    }
    if(flag==true){
      wx.showModal({
        title: '提示',
        content: warn
      })
    }else{
      address.province_name = this.data.region[0];
      address.city_name = this.data.region[1];
      address.district_name = this.data.region[2];
      address.province_id = this.data.region[0].id;
      address.city_id = this.data.region[1].id;
      address.district_id = this.data.region[2].id;
      let that = this;
    util.request(api.AddressSave, { 
      id: address.id,
      userName: name,
      telNumber: phone,
      province_id: address.province_id,
      city_id: address.city_id,
      district_id: address.district_id,
      is_default: that.data._num == 0 ? 1 : 0,
      provinceName: address.province_name,
      cityName: address.city_name,
      countyName: address.district_name,
      detailInfo: fulladdress,
    }, 'POST', 'application/json').then(function (res) {
      /*if (res.errno === 0) {
        wx.navigateBack({
          url: '/pages/address/address',
        })
      }*/
      //   success: function (res) {
          if (res.data.code == 200) {
            if (that.data.id) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                duration: 1000
              })
            }else{
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1000
              })
            }
        }
    });
         
           setTimeout(function () {
           /*   if (that.data.cartId) {

                var cartId = that.data.cartId;
                var pinkId = that.data.pinkId;
                var couponId = that.data.couponId;
                that.setData({
                  cartId: '',
                  pinkId: '',
                  couponId:'',
                })
                wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                  url: '/pages/order-confirm/order-confirm?id=' + cartId + '&addressId=' + that.data.id + '&pinkId=' + pinkId + '&couponId=' + couponId
                })
              } else { */
                wx.navigateTo({ //跳转至指定页面并关闭其他打开的所有页面（这个最好用在返回至首页的的时候）
                  url: '/pages/ucenter/address/address'
                })
              })
       /*     },1200)
          }
        }
      })
    }
  } */


    }
   }
  })