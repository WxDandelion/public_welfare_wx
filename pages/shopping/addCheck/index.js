var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();

Page({
  data: {
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0,
    couponId: 0,
    isBuy: false,
    couponDesc: '',
    couponCode: '',
    buyType: '',
    number: 1,
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    this.getGoodInfo();
    if (options.isBuy!=null) {
      this.data.isBuy = options.isBuy
    }
    
    this.data.buyType = this.data.isBuy?'buy':'cart'
    //每次重新加载界面，清空数据
    app.globalData.userCoupon = 'NO_USE_COUPON'
    app.globalData.courseCouponCode = {}
  },
  getGoodInfo: function() {
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          goods: res.data.info,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
        });
          //设置默认值
          that.setDefSpecInfo(that.data.specificationList);
      }
    });
  },
  setDefSpecInfo: function (specificationList) {
    //未考虑规格联动情况
    let that = this;
    if (!specificationList)return;
    for (let i = 0; i < specificationList.length;i++){
        let specification = specificationList[i];
        let specNameId = specification.specification_id;
        //规格只有一个时自动选择规格
        if (specification.valueList && specification.valueList.length == 1){
            let specValueId = specification.valueList[0].id;
            that.clickSkuValue({ currentTarget: { dataset: { "nameId": specNameId, "valueId": specValueId } } });
        }
    }
    specificationList.map(function(item){

    });

},
  getCheckoutInfo: function () {
    let that = this;
    var url = api.CartCheckout
    let buyType = this.data.isBuy ? 'buy' : 'cart'
    util.request(url, { addressId: that.data.addressId, couponId: that.data.couponId, type: buyType }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon ? res.data.checkedCoupon : "",
          couponList: res.data.couponList ? res.data.couponList : "",
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
        //设置默认收获地址
        if (that.data.checkedAddress.id){
            let addressId = that.data.checkedAddress.id;
            if (addressId) {
                that.setData({ addressId: addressId });
            }
        }else{
            wx.showModal({
                title: '',
                content: '请添加默认收货地址!',
                success: function (res) {
                    if (res.confirm) {
                        that.selectAddress();
                    }
                }
            })
        }
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addaddress/addaddress',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    this.getCouponData()
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
    
    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  /**
   * 获取优惠券
   */
  getCouponData: function () {
    if (app.globalData.userCoupon == 'USE_COUPON') {
      this.setData({
        couponDesc: app.globalData.courseCouponCode.name,
        couponId: app.globalData.courseCouponCode.user_coupon_id,
      })
    } else if (app.globalData.userCoupon == 'NO_USE_COUPON') {
      this.setData({
        couponDesc: "不使用优惠券",
        couponId: '',
      })
    }
  },

  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },

  /**
   * 选择可用优惠券
   */
  tapCoupon: function () {
    let that = this
  
      wx.navigateTo({
        url: '../selCoupon/selCoupon?buyType=' + that.data.buyType,
      })
  },

  submitOrder: function () {
    let that = this;
    let uid = wx.getStorageSync('userId');
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, type: this.data.buyType }, 'POST', 'application/json').then(res => {
      if (res.errno === 0) {
        // const orderId = res.data.orderInfo.id;
        // pay.payOrder(parseInt(orderId)).then(res => {
        //   wx.redirectTo({
        //     url: '/pages/payResult/payResult?status=1&orderId=' + orderId
        //   });
        // }).catch(res => {
        //   wx.redirectTo({
        //     url: '/pages/payResult/payResult?status=0&orderId=' + orderId
        //   });
        // });
        wx.redirectTo({
          url: '/pages/certify/certify?id=' + uid + '&nmoney='+ that.data.goodsTotalPrice
        })
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})