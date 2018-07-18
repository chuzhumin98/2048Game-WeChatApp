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
  }
})