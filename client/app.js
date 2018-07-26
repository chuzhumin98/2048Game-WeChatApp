//app.js
App({
  globalData: {
    openid: null
  },

  onLaunch: function () {
    wx.clearStorageSync(); //clear user's local cache
    // 展示本地存储能力
    let logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.getUserInfo({
          success: function (res_login) {
            console.log('code:'+res.code);
            wx.request({
              url: "https://chuzm15.iterator-traits.com/code?code="+res.code,
              method: "GET",
              data: {

              },
              header: {

              },

              success: function (res_code) {
                console.log('openid:'+res_code.data.openid);
                const app = getApp();
                app.globalData.openid = res_code.data.openid;
              }

            });
          }
        });
      }
    })
  }
})