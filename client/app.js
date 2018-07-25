//app.js
App({
  globalData: {
    userInfo: null,
    openid: null
  },

  onLaunch: function () {
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
                if (app.userInfoReadyCallback) {
                  app.userInfoReadyCallback(res_code)
                }
              }

            });
          }
        });
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }
})