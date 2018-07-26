//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    image_width: 750,
    image_height: 1000
  },
  onLoad: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        const app = getApp();
        app.globalData.window_width = res.windowWidth;
        app.globalData.window_height = res.windowHeight;
        console.log(app);
        let rpx_height = res.windowHeight * 750 / res.windowWidth;
        if (rpx_height - 110 <= 1000) {
          that.setData({
            image_width: (rpx_height - 110) * 0.75,
            image_height: rpx_height - 110
          })
        }
      }
    });
  },

  onStartGame: function (event) {
    wx.navigateTo({
      url: '/pages/game/game'　//navigate to the game page
    })
  }
})
