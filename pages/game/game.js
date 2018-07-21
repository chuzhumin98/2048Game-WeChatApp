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
        [data_item]: 200 + this.getTypeOf2()
      });
    }
    /** 
    //init for test
    let set_array = [[201,202,203,401],[402,403,8,16],[32,64,128,256],[16384,32768,65536,16384]];
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
    let index = 0; //visit index
    while (index+1 < grids.length) {
      //note that when integer divide 10 the value equals, they already is the same type
      if (intDiv(grids[index], 10) === intDiv(grids[index+1], 10)) { 
        if (intDiv(grids[index], 10) !== 20 && intDiv(grids[index], 10) !== 40) {
          grids[index] *= 2;         
        } else if (intDiv(grids[index], 10) === 20) {
          //type 3 is a strong type
          if (grids[index] % 10 === 3 || grids[index+1] % 10 === 3) {
            grids[index] = 403;
          } else if (grids[index] === grids[index+1]) { //when they're both type 1 or 2, then get 4 of type 1
            grids[index] = 401;
          } else { //else get 4 of type 2
            grids[index] = 402;
          }
        } else {
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
    return grids;
  },

  //change the grids state based on the player's slide direction
  handleSlide: function (direction) {
    if (direction === 'left') {
      for (let i = 0; i < grid_per_edge; i++) {
        let cache_array = new Array();
        for (let j = 0; j < grid_per_edge; j++) {
          if (this.data.states[i][j] > 0) {
            cache_array[cache_array.length] = this.data.states[i][j];
          }
        }
        cache_array =  this.mergeGrids(cache_array);
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
        cache_array = this.mergeGrids(cache_array);
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
        cache_array = this.mergeGrids(cache_array);
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
        cache_array = this.mergeGrids(cache_array);
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
      if (position !== null) { //null represents no free grid
        let data_item = this.getStatesItemString(position.x, position.y);
        this.setData({
          [data_item]: 200+this.getTypeOf2()
        })
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
      if (direction !== 'none') {
        this.handleSlide(direction);
        let grid = this.selectComponent("#grid_0_0");
        grid.setAnimation();
      }
    }
    //console.log('end at '+event.changedTouches[0].clientX + ',' + event.changedTouches[0].clientY);
  },

  onTouchCancel: function (event) {
    is_ontouch = false; //drop this touch process
  }
})