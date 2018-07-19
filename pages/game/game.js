const grid_per_edge = 4; //define the grid number per edge
/*
the grids' state
0-None, 2,4,8,···,65536-Number, 
30x-Love, 50x-Break, 6-Gabbage
*/
let grids_state = new Array(); 
for (let i = 0; i < grid_per_edge; i++) {
  grids_state[i] = new Array();
  for (let j = 0; j < grid_per_edge; j++) {
    grids_state[i][j] = 0;
  }
}

let is_ontouch = false; //is on touch mobile or not
let touch_startX = 0; //touch start position X coordinate
let touch_startY = 0; //touch start position Y coordinate 

function intDiv(num, den) {
  return Math.floor(num/den); //simplify as always positive condition
}


Page({
  data: {
    current_score: 1234,
    best_score: 5678,
    states: grids_state
  },

  onLoad: function (options) {
    //when game loaded, randomly generate 1-2 elements
    for (let i = 0; i < 2; i++) {
      let idx = Math.floor(Math.random() * 16);
      let data_item = this.getStatesItemString(intDiv(idx, grid_per_edge), idx % grid_per_edge); //set for the change item string
      this.setData({
        [data_item]: 2
      })
      
    }
    console.log(this.data.states);
  },

  //get the states array's item string
  getStatesItemString: function (idx, idy) {
    return 'states['+idx+']['+idy+']';
  },

  /*
  get the player's slide direction
  none, left, right, up, dowm
  */
  getSlideDirection: function (startX, startY, endX, endY) {
    let deltaX = endX - startX;
    let deltaY = endY - startY;
    if (Math.abs(deltaX) + Math.abs(deltaY) < 10) { //ignore too small slide
      return 'none';
    } else {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > 0) {
          return 'right';
        } else {
          return 'left';
        }
      } else {
        if (deltaY > 0) {
          return 'down';
        } else {
          return 'up';
        }
      }
    }
  },

  onTouchStart: function (event) {
    touch_startX = event.touches[0].clientX; //record the start touch position
    touch_startY = event.touches[0].clientY;
    is_ontouch = true; //change ontouch attribute to true
    //console.log('start at '+event.touches[0].clientX+','+event.touches[0].clientY);
  },

  onTouchEnd: function (event) {
    if (is_ontouch) {
      is_ontouch = false; //set to prepare next slide process
      let direction = this.getSlideDirection(touch_startX, touch_startY, event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      console.log(direction);
    }
    //console.log('end at '+event.changedTouches[0].clientX + ',' + event.changedTouches[0].clientY);
  },

  onTouchCancel: function (event) {
    is_ontouch = false; //drop this touch process
  }
})