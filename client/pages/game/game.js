const grid_per_edge = 4; //define the grid number per edge
/*
the grids' state
0-None, 8,···,65536-Number, 
2(4)01,2(4)02,2(4)03-different type of 2(4)
*/
let grids_state = new Array(); 
let temp_grids_state = new Array(); //temporal grids' state, using for store changes
for (let i = 0; i < grid_per_edge; i++) {
  grids_state[i] = new Array();
  temp_grids_state[i] = new Array();
  for (let j = 0; j < grid_per_edge; j++) {
    grids_state[i][j] = 0;
    temp_grids_state[i][j] = 0;
  }
}

let is_ontouch = false; //is on touch mobile or not
let touch_startX = 0; //touch start position X coordinate
let touch_startY = 0; //touch start position Y coordinate 

function intDiv(num, den) {
  return Math.floor(num/den); //simplify as always positive condition
}

const app = getApp();

Page({
  data: {
    current_score: 0,
    best_score: 0,
    states: grids_state,
    game_over: false
  },

  initSet: function () {
    this.setData({
      current_score: 0,
    }); //set zero for current score
    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge; j++) {
        let data_item = this.getStatesItemString(i, j);
        this.setData({
          [data_item]: 0
        });
      }
    }
    //when game loaded, randomly generate 1-2 elements
    for (let i = 0; i < 2; i++) {
      let idx = Math.floor(Math.random() * 16);
      let data_item = this.getStatesItemString(intDiv(idx, grid_per_edge), idx % grid_per_edge); //set for the change item string
      this.setData({
        [data_item]: 200 + this.getTypeOf2()
      });
    }
  },

  onLoad: function (options) {
    let that = this;
    let that_best_score = 0;
    console.log(app.globalData.openid);
    wx.request({
      url: "https://chuzm15.iterator-traits.com/query?id=" + app.globalData.openid,
      method: "GET",
      data: {

      },
      header: {

      },

      success: function (res) {
        console.log(res);
        that_best_score = res.data.BESTSCORE;
        that.setData({
          best_score: that_best_score
        });
      }

    });

    this.initSet(); //initial set for the game

    /**
    //init for test
    let set_array = [[0, 202, 403, 0], [8, 402, 201, 0], [32, 0, 16, 203], [64, 256, 1024, 512]];
    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge; j++) {
        let data_item = this.getStatesItemString(i, j);
        this.setData({
          [data_item]: set_array[i][j]
        });
      }
    }
    */
    console.log(this.data.states);
  },

  sumbitRecord: function () {
    wx.request({
      url: "https://chuzm15.iterator-traits.com/record?id=" + app.globalData.openid + "&best=" + this.data.best_score,
      method: "GET",
      data: {

      },
      header: {

      },

      success: function (res) {
        console.log(res);
      }

    });
  },

  onUnload: function (options) {
    console.log('now is unload');
    this.sumbitRecord();
  },

  onHide: function (options) {
    console.log('now is unHide');
    this.sumbitRecord();
  },

  //get the states array's item string
  getStatesItemString: function (idx, idy) {
    return 'states['+idx+']['+idy+']';
  },

  //randomly get the type of 2, 49% prob of type 1 and 2, 2% prob of type 3
  getTypeOf2: function () {
    let random_idx = Math.random() * 100;
    if (random_idx < 49) {
      return 1;
    } else if (random_idx < 98) {
      return 2;
    } else {
      return 3;
    }
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

  //get a random free position, return {x, y}, null for no free position to set
  getRandomPosition: function () {
    let free_grids = new Array();
    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge; j++) {
        if (this.data.states[i][j] === 0) {
          let position = {'x' : i, 'y' : j};
          free_grids[free_grids.length] = position;
        }
      }
    }
    if (free_grids.length === 0) {
      return null;
    } else {
      let random_index = Math.floor(Math.random() * free_grids.length);
      return free_grids[random_index];
    }
  },

  //merge an array of grids
  mergeGrids: function (grids) {
    let merge_indexes = new Array(); //indexes with merged
    let index = 0; //visit index
    while (index+1 < grids.length) {
      //note that when integer divide 10 the value equals, they already is the same type
      if (intDiv(grids[index], 10) === intDiv(grids[index+1], 10)) {
        merge_indexes[merge_indexes.length] = index; 
        if (intDiv(grids[index], 10) !== 20 && intDiv(grids[index], 10) !== 40) {
          let new_score = this.data.current_score + grids[index]*2;
          this.setData({
            current_score: new_score
          });
          grids[index] *= 2;         
        } else if (intDiv(grids[index], 10) === 20) {
          let new_score = this.data.current_score + 4;
          this.setData({
            current_score: new_score
          });
          //type 3 is a strong type
          if (grids[index] % 10 === 3 || grids[index+1] % 10 === 3) {
            grids[index] = 403;
          } else if (grids[index] === grids[index+1]) { //when they're both type 1 or 2, then get 4 of type 1
            grids[index] = 401;
          } else { //else get 4 of type 2
            grids[index] = 402;
          }
        } else {
          let new_score = this.data.current_score + 8;
          this.setData({
            current_score: new_score
          });
          //both type 3 get the very strong effect
          if (grids[index] % 10 === 3 && grids[index+1] % 10 === 3) {
            if (index === 0) {
              grids[index] = 16; //when they're the head of array, double them
            } else { //else double the front one
              grids[index-1] *= 2;
              grids[index] = 8;
            }
          } else if ((grids[index] % 10) + (grids[index+1] % 10) === 3) { //a+b=1+2(or 2+1) = 3
            grids[index] = 203; //different type of 4(type 1 and 2) generate 2 of type 3  
          } else { //else merge to 8
            grids[index] = 8;
          }
        }
        grids = grids.slice(0, index + 1).concat(grids.slice(index + 2)); 
      }
      index++;
    }
    return [grids, merge_indexes];
  },

  //change the grids state based on the player's slide direction
  handleSlide: function (direction) {
    let animate_positions = new Array(); //the positions that need animate
    if (direction === 'left') {
      for (let i = 0; i < grid_per_edge; i++) {
        let cache_array = new Array();
        for (let j = 0; j < grid_per_edge; j++) {
          if (this.data.states[i][j] > 0) {
            cache_array[cache_array.length] = this.data.states[i][j];
          }
        }
        let results = this.mergeGrids(cache_array);
        cache_array =  results[0];
        let indexes = results[1];
        for (let j = 0; j < indexes.length; j++) {
          animate_positions[animate_positions.length] = {x: i, y: indexes[j]};
        }
        //console.log(cache_array);
        for (let j = 0; j < cache_array.length; j++) {
          temp_grids_state[i][j] = cache_array[j];
        }
        for (let j = cache_array.length; j < grid_per_edge; j++) {
          temp_grids_state[i][j] = 0;
        }
      }
    } else if (direction === 'right') {
      for (let i = 0; i < grid_per_edge; i++) {
        let cache_array = new Array();
        for (let j = grid_per_edge-1; j >= 0; j--) {
          if (this.data.states[i][j] > 0) {
            cache_array[cache_array.length] = this.data.states[i][j];
          }
        }
        let results = this.mergeGrids(cache_array);
        cache_array = results[0];
        let indexes = results[1];
        for (let j = 0; j < indexes.length; j++) {
          animate_positions[animate_positions.length] = { x: i, y: grid_per_edge - 1 - indexes[j] };
        }
        //console.log(cache_array);
        for (let j = 0; j < cache_array.length; j++) {
          temp_grids_state[i][grid_per_edge-1-j] = cache_array[j];
        }
        for (let j = cache_array.length; j < grid_per_edge; j++) {
          temp_grids_state[i][grid_per_edge-1-j] = 0;
        }
      }
    } else if (direction === 'up') {
      for (let i = 0; i < grid_per_edge; i++) {
        let cache_array = new Array();
        for (let j = 0; j < grid_per_edge; j++) {
          if (this.data.states[j][i] > 0) {
            cache_array[cache_array.length] = this.data.states[j][i];
          }
        }
        let results = this.mergeGrids(cache_array);
        cache_array = results[0];
        let indexes = results[1];
        for (let j = 0; j < indexes.length; j++) {
          animate_positions[animate_positions.length] = { x: indexes[j], y: i };
        }
        //console.log(cache_array);
        for (let j = 0; j < cache_array.length; j++) {
          temp_grids_state[j][i] = cache_array[j];
        }
        for (let j = cache_array.length; j < grid_per_edge; j++) {
          temp_grids_state[j][i] = 0;
        }
      }
    } else if (direction === 'down') {
      for (let i = 0; i < grid_per_edge; i++) {
        let cache_array = new Array();
        for (let j = grid_per_edge - 1; j >= 0; j--) {
          if (this.data.states[j][i] > 0) {
            cache_array[cache_array.length] = this.data.states[j][i];
          }
        }
        let results = this.mergeGrids(cache_array);
        cache_array = results[0];
        let indexes = results[1];
        for (let j = 0; j < indexes.length; j++) {
          animate_positions[animate_positions.length] = { x: grid_per_edge - 1 - indexes[j], y: i };
        }
        //console.log(cache_array);
        for (let j = 0; j < cache_array.length; j++) {
          temp_grids_state[grid_per_edge - 1 - j][i] = cache_array[j];
        }
        for (let j = cache_array.length; j < grid_per_edge; j++) {
          temp_grids_state[grid_per_edge - 1 - j][i] = 0;
        }
      }
    } else {
      return;
    }
    let isMoved = false; //record for the game state change or not

    for (let i = 0; i < animate_positions.length; i++) {
      let item = this.selectComponent('#grid_' + animate_positions[i].x + '_' + animate_positions[i].y);
      item.setAnimation();
    }

    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge; j++) {
        //update only when changed
        if (temp_grids_state[i][j] !== this.data.states[i][j]) {
          isMoved = true;
          let data_item = this.getStatesItemString(i, j);
          this.setData({
            [data_item]: temp_grids_state[i][j]
          });
        }
      }
    }
    if (isMoved) { //when state changed, set for a random 2
      let position = this.getRandomPosition(); //random position to set for new 2
      console.log(position);
      let item = this.selectComponent('#grid_' + position.x + '_' + position.y);
      item.setAnimation();
      animate_positions[animate_positions.length] = position;
      if (position !== null) { //null represents no free grid
        let new_score = this.data.current_score + 2;
        this.setData({
          current_score: new_score
        });
        let data_item = this.getStatesItemString(position.x, position.y);
        this.setData({
          [data_item]: 200+this.getTypeOf2()
        })
      }
      if (this.data.best_score < this.data.current_score) {
        this.setData({
          best_score: this.data.current_score
        })
      }
    }
    if (this.judgeGameOver()) {
      console.log('game over');
      this.setData({
        game_over: true
      });
    }
  },
  
  //judge the game is over or not
  judgeGameOver: function () {
    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge; j++) {
        if (this.data.states[i][j] === 0) {
          return false;
        }
      }
    }
    for (let i = 0; i < grid_per_edge; i++) {
      for (let j = 0; j < grid_per_edge-1; j++) {
        if (intDiv(this.data.states[i][j], 10) === intDiv(this.data.states[i][j+1],10)) {
          return false;
        }
        if (intDiv(this.data.states[j][i],10) === intDiv(this.data.states[j+1][i],10)) {
          return false;
        }
      }
    }
    return true;
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
      if (direction !== 'none') {
        this.handleSlide(direction);
      }
    }
    //console.log('end at '+event.changedTouches[0].clientX + ',' + event.changedTouches[0].clientY);
  },

  onTouchCancel: function (event) {
    is_ontouch = false; //drop this touch process
  },

  onQuitEvent: function (event) {
    this.setData({
      game_over: false
    });
    this.initSet();
  },


})