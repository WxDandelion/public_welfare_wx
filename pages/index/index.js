const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    keyword: "",
    keywordInput: '',
    newGoods: [],
    newWelfare: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    article:[],
    indicatorDots: false,
    circular: true,
    autoplay: true,
    interval: 3000,
    duration: 500,
    psyIssue: [],
    styIssue: [],
    poorIssue: [],
    fundIssue: [],
    numToChn: ["一", "二", "三", "四"],
    type: [{
      name: "心理咨询",
      url: "https://i.loli.net/2020/06/03/zdPZQwhWy8lkv3E.png"},{
      name: "勤工助学",
      url: "https://i.loli.net/2020/06/03/5w1NSnxcDsoivKT.png"}, {
      name: "助力扶贫",
      url: "https://i.loli.net/2020/06/03/5aLOugdAIZJfUiX.png"},{
      name: "善款筹集",
      url: "https://i.loli.net/2020/06/03/N1mWCJhZSsi3Pnz.png"}],
      shopList: ["用户王**购买了", "微信用户晓*购买了", "微信用户然*购买了", "用户李**购买了"],
  },
  onShareAppMessage: function () {
    return {
      title: '公益家',
      desc: '益莲微信小程序公益商城',
      path: '/pages/index/index'
    }
  },onPullDownRefresh(){
	  	// 增加下拉刷新数据的功能
	    var self = this;
      this.getIndexData();
      this.getHelpIssue();
 },
  /**
  * 获取各类型审核通过且未关闭通道的求助
  */
  getHelpIssue: function() {
    let that = this;
    // type_id is_on_sale
    let params = {
      approve: 1,
      //type_id: 1 心理咨询、勤工助学、助力扶贫、善款筹集
    };
    util.request(api.HelpIssueListByParas, params).then(function (res) {
      if (res.errno === 0) {
        let goodsList = [];
        goodsList.push(res.data.filter((item) => item.userIssueVo.typeId === 1)[0]);
        goodsList.push(res.data.filter((item) => item.userIssueVo.typeId === 2)[0]);
        goodsList.push(res.data.filter((item) => item.userIssueVo.typeId === 3)[0]);
        goodsList.push(res.data.filter((item) => item.userIssueVo.typeId === 4)[0]);
        that.setData({
          psyIssue: res.data.filter((item) => item.userIssueVo.typeId === 1).slice(0,7),
          styIssue: res.data.filter((item) => item.userIssueVo.typeId === 2).slice(0,7),
          poorIssue: res.data.filter((item) => item.userIssueVo.typeId === 3).slice(0,7),
          fundIssue: res.data.filter((item) => item.userIssueVo.typeId === 4).slice(0,7),
          newWelfare: goodsList
        });
      }
    });
  },
  getIndexData: function () {
    let that = this;
    var data = new Object();
    util.request(api.IndexUrlNewGoods).then(function (res) {
      if (res.errno === 0) {
      let length = res.data.newGoodsList.length;
      let list = that.data.shopList;
      if(length != 0) {
        list.forEach((item, index) => {
          let rand = Math.floor(Math.random() * (length));
          list[index] = list[index] + res.data.newGoodsList[rand].name
        })
      } else {
        list = [];
      }
      that.setData({
        newGoods: res.data.newGoodsList,
        shopList: list
      });
      }
    });
    util.request(api.IndexUrlHotGoods).then(function (res) {
      if (res.errno === 0) {
        data.hotGoods = res.data.hotGoodsList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlTopic).then(function (res) {
      if (res.errno === 0) {
        data.topics = res.data.topicList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlBrand).then(function (res) {
      if (res.errno === 0) {
        data.brand = res.data.brandList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlCategory).then(function (res) {
      if (res.errno === 0) {
        data.floorGoods = res.data.categoryList
      that.setData(data);
      }
    });
    util.request(api.IndexUrlBanner).then(function (res) {

      if (res.errno === 0) {
        data.banner = res.data.banner
      that.setData(data);
      }
    });
    util.request(api.IndexUrlChannel).then(function (res) {
      if (res.errno === 0) {
        data.channel = res.data.channel
      that.setData(data);
      }
    });
    util.request(api.ArticleDetail,{typeid:1}).then(function (res) {
      if (res.errno === 0) {
          that.setData({
          article: res.data.articleList
           });
         }
       })
  },
  inputChange: function (e) {
    this.setData({
      keyword: e.detail.value,
      searchStatus: false
    });
  },
  clearKeyword: function () {
    this.setData({
      keyword: '',
      keywordInput: '',
    });
  },
  onKeywordConfirm: function() {
    let that = this;
    util.request(api.SearchGoods, {name: that.data.keyword}, 'GET').then(function (res) {
      if (res.errno === 0) {
        if(res.data.length) {
          that.setData({
            keyword: '',
            keywordInput: '',
          })
          wx.navigateTo({
            url: '/pages/goods/goods?id=' + res.data[0].id,
          })
        } else {
          wx.showToast({
            title: '暂无对应服务',
            icon: 'none',
            duration: 2000
          })
        }
      } else {
        wx.showToast({
          title: '搜索失败，请稍后再试',
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  goCatalog: function() {
    wx.switchTab({
      url: '/pages/catalog/catalog',
    })
  },
  onLoad: function (options) {
    this.getIndexData();
    this.getHelpIssue();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
})
