let font_sizes = new Array(); //set for different type of font-size
font_sizes[0] = font_sizes[201] = font_sizes[202] = font_sizes[203] = font_sizes[401] = font_sizes[402] = font_sizes[403] = font_sizes[8] = font_sizes[16] = font_sizes[32] = font_sizes[64] = 90;
font_sizes[128] = font_sizes[256] = font_sizes[512] = 75;
font_sizes[1024] = font_sizes[2048] = font_sizes[4096] = font_sizes[8192] = 58;
font_sizes[16384] = font_sizes[32768] = font_sizes[65536] = 48;

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
    _font_sizes: font_sizes
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
      }, 80);

    }
  }
})
