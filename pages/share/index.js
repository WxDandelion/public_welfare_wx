var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    shareUrl: '',
    shareName: '',
    shareImgUrl: '',
    active: false,
    integral: 0,
    codeUrl: [],
    name: '',
  },
  handlePhotoSaved() {
    this.savePhoto(this.data.sharePath)
  },
  close:function(){
    this.setData({active: false});
  },
  drawPic(options) {
    const type = options.type;
    const name = options.name;
    if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
      this.triggerEvent('initData') 
      return
    }
    wx.showLoading({
      title: '生成中'
    })
    // 需要判断路径，生成不同的图片    邀请函 or 商品 or 捐赠
    // 1334
    if(type == 0) {
      this.setData({
        active: true,
        imgDraw: {
          width: '1200rpx',
          height: '1600rpx',
          background: 'https://gyj-1302199081.cos.ap-beijing.myqcloud.com/picture/WechatIMG572.jpeg',
          views: [
            {
              type: 'text',
              text: name ? name : wx.getStorageSync('userInfo').nickName,
              css: {
                top: '532rpx',
                fontSize: '46rpx',
                width: '258rpx',
                maxLines: 1,
                left: '82rpx',
                align: 'left',
                color: '#282828'
              }
            }
            //width: '258rpx',
            //left: '82rpx',
            //align: 'left',
            // {
            //   type: 'text',
            //   text: wx.getStorageSync('userInfo').nickName,
            //   css: {
            //     top: '332.5rpx',
            //     fontSize: '30rpx',
            //     width: '163rpx',
            //     maxLines: 1,
            //     left: '50rpx',
            //     align: 'left',
            //     color: '#282828'
            //   }
            // }
          ]
        }
      })
    } else {
      this.setData({
        imgDraw: {
          width: '750rpx',
          height: '1200rpx',
          background: 'https://gyj-1302199081.cos.ap-beijing.myqcloud.com/picture/E7DRoMmpfntZjvS.jpg',
          views: [
            {
              type: 'image',
              url: type == 1 ? wx.getStorageSync('shareImgUrl') : `https://gyj-1302199081.cos.ap-beijing.myqcloud.com/picture/MYRy79QUZHWAdcL.png`,
              css: {
                top: '32rpx',
                left: '30rpx',
                right: '32rpx',
                width: '688rpx',
                height: '480rpx',
                borderRadius: '16rpx'
              },
            },
            {
              type: 'image',
              url: wx.getStorageSync('userInfo').avatarUrl,
              // 96rpx
              css: {
                top: '484rpx',
                left: '311rpx',
                width: '130rpx',
                height: '130rpx',
                borderWidth: '6rpx',
                borderColor: '#FFF',
                borderRadius: '130rpx',
              }
            },
            {
              type: 'text',
              text: wx.getStorageSync('userInfo').nickName,
              css: {
                top: '612rpx',
                fontSize: '30rpx',
                left: '375rpx',
                align: 'center',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: type == 1 ? `邀您一起探索公益服务` : `邀您一起参加公益活动`,
              css: {
                top: '656rpx',
                left: '375rpx',
                align: 'center',
                fontSize: '30rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: wx.getStorageSync('shareName'),
              //`四川粑粑柑`,
              css: {
                top: '724rpx',
                left: '375rpx',
                maxLines: 1,
                align: 'center',
                fontWeight: 'bold',
                fontSize: '44rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: type == 1 ? `长按二维码查看服务详情` : `长按二维码查看活动详情`,
              css: {
                top: '960rpx',
                left: '85rpx',
                maxLines: 2,
                align: 'left',
                fontSize: '30rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'text',
              text: `分享自「公益家」`,
              css: {
                top: '1000rpx',
                left: '85rpx',
                maxLines: 2,
                align: 'left',
                fontSize: '30rpx',
                color: '#3c3c3c'
              }
            },
            {
              type: 'image',
              url: api.CreateCode + "?scene=id=123",
              css: {
                top: '890rpx',
                left: '470rpx',
                width: '200rpx',
                height: '200rpx'
              }
            }
          ]
        }
      })
    }
  },
  onImgErr(e) {
    wx.hideLoading()
    wx.showToast({
      title: '生成分享图失败，请刷新页面重试'
    })
  },
  onImgOK(e) {
    wx.hideLoading()
    this.setData({
      sharePath: e.detail.path,
      visible: true,
    })
    //通知外部绘制完成，重置isCanDraw为false
    this.triggerEvent('initData') 
  },
  preventDefault() { },
  // 保存图片
  savePhoto(path) {
    wx.showLoading({
      title: '正在保存...',
      mask: true
    })
    this.setData({
      isDrawImage: false
    })
    wx.saveImageToPhotosAlbum({
      filePath: path,
      success: (res) => {
        wx.showToast({
          title: '保存成功',
          icon: 'none'
        })
        // setTimeout(() => {
        //   this.setData({
        //     visible: false
        //   })
        // }, 300)
      },
      fail: (res) => {
        wx.getSetting({
          success: res => {
            let authSetting = res.authSetting
            if (!authSetting['scope.writePhotosAlbum']) {
              this.setData({
                isModal: true
              })
            }
          }
        })
        setTimeout(() => {
          wx.hideLoading()
          this.setData({
            visible: false
          })
        }, 300)
      }
    })
  },
  onLoad: function (options) {
    // options.type  options.nmoney
    this.setData({
      type: options.type,
      name: options.name ? options.name : '',
      integral: options.nmoney ? options.nmoney : 0,
      shareUrl: options.type == 0 ? '/pages/index/index' : wx.getStorageSync('shareUrl'),
      shareName: wx.getStorageSync('shareName'),
      shareImgUrl: options.type == 0 ? '' : wx.getStorageSync('shareImgUrl')
    });
    let arr = this.data.shareUrl.split('?');
    this.setData({
      codeUrl: arr,
    });
    this.drawPic(options);
    // util.request(api.CreateCode, params).then(function (res) {
    //   console.log(res);
    //   this.drawPic(options);
    // });
  },
  onShareAppMessage: function () {
    const { type, shareUrl, shareImgUrl, shareName } = this.data;
    const nickName = wx.getStorageSync('userInfo').nickName;
    let title = '';
    if(type == 0) {
      title = `${nickName}在公益家获得了公益证书，快来一起参加吧`;
      return {
        title: title,
        path: shareUrl
      }
    }else if (type == 1) {
      title = `${nickName}给您分享一件公益好物，快来看看`
    } else {
      title = `${nickName}给您分享一项公益活动，邀请您一起参加`
    }
    return {
      title: title,
      path: shareUrl,
      imageUrl: shareImgUrl
    }
  },
})
