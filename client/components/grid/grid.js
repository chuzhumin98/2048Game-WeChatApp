let animation_eta_arrays = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.0];

// components/grid/grid.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    eta: {
      type: Number,
      value: 1
    },
    gridType: {
      type: Number,
      value: 2
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  attached: function () { 

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setAnimation: function () {
      let index = 0;
      let that = this;
      let eta = that.data.eta;
      let interval = setInterval(function () {
        if (index >= animation_eta_arrays.length) {
          clearInterval(interval);
          return;
        }
        that.setData({
          eta: animation_eta_arrays[index]
        });
        index++;
      }, 60);
    }
  }
})
