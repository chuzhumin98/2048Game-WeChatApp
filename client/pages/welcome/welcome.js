//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

  },
  onLoad: function () {

  },

  onStartGame: function (event) {
    wx.navigateTo({
      url: '/pages/game/game'　//navigate to the game page
    })
  }
})
