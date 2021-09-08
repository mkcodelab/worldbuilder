const largeMap = document.querySelector('#largeMap');
const ctx = largeMap.getContext('2d');
//GLOBALS =====================================
const W = 64;
const H = 64;
const tileSize = 10;

const localW = 32;
const localH = 32;
const localTileSize = 20;

//DEBUGGING OPTIONS ============================
// DEBUG OPTION FOR LOCAL AND LARGE MAP
const showDrawingMap = false;
const showMouseClicks = false;

// ==============================================
largeMap.width = W*tileSize;
largeMap.height = H*tileSize;

// coordinates of current tile
let currentTile = {
  x: null,
  y: null,
  color: null,
};

const lgMapTileArray = [];

// bools for large and local map
let isLgMap = true;
let isLocalMap = false;


class Tile {
  constructor(x, y, crdX, crdY, biome) {
    this.w = tileSize;
    this.h = tileSize;
    this.x = x;
    this.y = y;
    // coordinate x and y 0 - 63
    this.crdX = crdX;
    this.crdy = crdY;
    this.biome = biome;
    // array of local tiles
    this.localMap = [];

  }
  draw() {
    ctx.fillStyle = this.biome.lgMapColor;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  // function for creating local map
  createLocalTerrain(biome) {
    this.localMap = [];
    for (let i = 0; i < 32; i++) {
      this.localMap.push( new LocalTerrainTile(x, y, biome))
    }
  }
}

class LocalTerrainTile {
  constructor(x, y, biome) {
    this.w = localTileSize;
    this.h = localTileSize;
    this.x = x;
    this.y = y;
    
    this.biome = biome;
    
  }
}

// large map color for the representation of the tile on large map and pallete of colors of local map
const biomeArray = 
[
  {name: 'plains', lgMapColor: 'hsl(72, 48%, 34%)', localMapColors: ['hsl(72, 40%, 34%)', 'hsl(72, 48%, 34%)', 'hsl(72, 50%, 34%)', 'hsl(72, 55%, 34%)']},
  {name: 'river', lgMapColor: 'hsl(176, 48%, 34%)', localMapColors: ['hsl(176, 40%, 34%)', 'hsl(176, 48%, 34%)', 'hsl(176, 50%, 34%)', 'hsl(176, 55%, 34%)']},
  {name: 'forest', lgMapColor: 'hsl(105, 54%, 24%)', localMapColors: ['hsl(105, 40%, 34%)', 'hsl(105, 48%, 34%)', 'hsl(105, 50%, 34%)', 'hsl(105, 55%, 34%)']},
  {name: 'desert', lgMapColor: 'hsl(42, 54%, 63%)', localMapColors: ['hsl(42, 40%, 34%)', 'hsl(42, 48%, 34%)', 'hsl(42, 50%, 34%)', 'hsl(42, 55%, 34%)']},
  {name: 'rocks', lgMapColor: 'hsl(37, 12%, 57%)', localMapColors: ['hsl(37, 40%, 34%)', 'hsl(37, 48%, 34%)', 'hsl(37, 50%, 34%)', 'hsl(37, 55%, 34%)']},
];

// WORLD GENERATION =====================

function createWorld() {
  lgMapTileArray.length = 0;
  for (let i = 0; i < W; i++) {
    for (let j = 0; j < H; j++) {
      // add some logic to biome randomization
      let biome = biomeArray[Math.floor(Math.random()*biomeArray.length)];
      lgMapTileArray.push( new Tile(i * tileSize, j * tileSize, i, j , biome))
      // add randomized local map generation iside the tile
    }
  }
}
createWorld();



// mouse object
const mouse = {
  x: null,
  y: null,
  lmbPressed: false,
  rmbPressed: false,

}

// MOUSE EVENTS ==========================================
// mouse move capture - x, y coords;
addEventListener('mousemove', e=>{
  mouse.x = e.x;
  mouse.y = e.x;
});

largeMap.addEventListener('click', ()=> {
  if(showMouseClicks) showMouse();
});
  // debug option, showing mouse coords on canvas
function showMouse() {
  console.log('mouse x : ' +mouse.x)
  console.log('mouse y : ' +mouse.y)
}

// add zoom out function
addEventListener('contextmenu', e => e.preventDefault());
addEventListener('mousedown', e => {
  if (showMouseClicks) console.log('mouse button pressed: ' + e.button);
  // lmb click
  if (e.button == 0) {
    lmbPressed = true;
  }
  //rmb click
  if (e.button == 2) {
    zoomOut();
    rmbPressed = true;
  }

})

addEventListener('mouseup', e => {
  if (e.button == 0) {
    lmbPressed = false;
  }
  if (e.button == 2) {
    rmbPressed = false;
  }
})


// dbl click on canvas function, firing up enlargeMap, that draws Local Map
largeMap.addEventListener('dblclick', e=> {
  
  zoomIn(e)
});



// MAP DRAWING FUNCTIONS ===============================================


// zooming in and out
// enlarging map function after doubleclick 
function zoomIn(e) {
  console.log('%c map zoomed in...🔍', 'background: #000; color: limegreen;')
  let map = largeMap.getBoundingClientRect();
  // console.log(map.x, map.y);
  // calculated coordinates of tile
  let calcX = Math.floor((e.clientX - map.left) / 10)
  let calcY = Math.floor((e.clientY - map.top) / 10)
  console.log(calcX, calcY);
  currentTile.x = calcX;
  currentTile.y = calcY;
  console.log('current tile is: ', currentTile);
  isLgMap = false;
  isLocalMap = true;
}

function zoomOut() {
  isLgMap = true;
  isLocalMap = false;
  console.log('%c zoomed out...🔍', 'background: #000; color: limegreen;')
}



// DRAWING LARGE MAP FUNCTION
function drawLgMap() {
  // debug mode log
  if (showDrawingMap) console.log('drawing LRAGE map');
    for (tile of lgMapTileArray) {
      tile.draw();
    }
}


// DRAWING LOCAL MAP FUNCTION

function drawLocalMap(coordX, coordY) {
  // coords passed from dblclick event
  let x = coordX;
  let y = coordY;
  // debug mode log
  if (showDrawingMap) console.log('drawing LOCAL map');


  // OGARNIJ TUTAJ TE KOORDYNATY DO MALOWANIA KONKRETNEJ LOKALNEJ MAPY

  // drawing map from tile[x, y]

  // search for tile in largeTileArray by x and y coords

  // temporary drawing square 
  // add color from current tile
  ctx.fillStyle = currentTile.color;
  ctx.fillRect(0, 0, largeMap.width, largeMap.height)
}


// todo change largeMap const name to Map


// LOOP FUNCTION ========================================================
function loop() {
  ctx.clearRect(0, 0, largeMap.width, largeMap.height);
  //drawing large map, checks for global boolean 'isLgMap' active or not
  if (isLgMap){
    drawLgMap();
  }
  //drawing local map, checks for global boolean 'isLocalMap' active or not
  if (isLocalMap) {
    // passing coordinates from currentTile; currentTile has coords from click event
    drawLocalMap(currentTile.x, currentTile.y);
  }
  requestAnimationFrame(loop);
}
loop();