/*
  Worldbuilder ================
  DESKTOP ONLY!
  64x64 cell map,
  inside each cell 32x32 local map.
*/
const treeImg = new Image();
treeImg.src = 'img/tree.png';

const grassImg = new Image();
grassImg.src = 'img/grass.png';

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
let showDrawingMap = false;
let showMouseClicks = false;
let showCoordinates = true;

// ==============================================
largeMap.width = W*tileSize;
largeMap.height = H*tileSize;

// coordinates of current tile
let currentTile = {
  x: null,
  y: null,
  color: null,
  localMap: [],
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
    this.crdY = crdY;
    this.biome = biome;
    // array of local tiles
    this.localMap = [];
    this.hasLocalMap = true;
    this.createLocalTerrain()
  }
  draw() {
    ctx.fillStyle = this.biome.lgMapColor;
    ctx.fillRect(this.x, this.y, this.w, this.h);
  }
  // function for creating local map
  createLocalTerrain() {
    if (this.hasLocalMap) {
      for (let i = 0; i < 32; i++) {
        for (let j = 0; j < 32; j++) {
          this.localMap.push( new LocalTerrainTile(i * localTileSize, j * localTileSize, this.biome))
        }
      }
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
    this.structure = [];
    // randomized color based on biome
    this.color = this.biome.localMapColors[Math.floor(Math.random() * this.biome.localMapColors.length)];
    this.createStructures();
  }
  draw() {
   
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.w, this.h);

    if (this.structure[0] === 'tree') {
      ctx.drawImage(treeImg, this.x, this.y, this.w, this.h);
    }
    if (this.structure[0] === 'grass') {
      ctx.drawImage(grassImg, this.x, this.y, this.w, this.h)
    }
  }
  createStructures() {
    // add some more structures and generator logic
    let hasTree = Math.round(Math.random());
    let hasGrass = Math.round(Math.random());
    if(this.biome.name === 'forest' && hasTree == 1) {
      this.structure.push('tree');
    } else if (this.biome.name === 'plains' && hasGrass == 1) {
      this.structure.push('grass')
    }
  }
}
// BIOMES ================================================

// large map color for the representation of the tile on large map and pallete of colors of local map
const biomeArray = 
[
  {
    name: 'plains', lgMapColor: 'hsl(72, 48%, 34%)', localMapColors: [
      'hsl(72, 40%, 34%)',
      'hsl(72, 48%, 34%)',
      'hsl(72, 50%, 34%)',
      'hsl(72, 55%, 35%)'
    ]
  },
  {
    name: 'forest', lgMapColor: 'hsl(105, 54%, 24%)', localMapColors: [
      'hsl(105, 40%, 34%)',
      'hsl(105, 48%, 34%)',
      'hsl(105, 50%, 34%)',
      'hsl(105, 55%, 34%)'
    ]
  },
  {
    name: 'rocks', lgMapColor: 'hsl(37, 12%, 57%)', localMapColors: [
    'hsl(37, 20%, 34%)', 
    'hsl(37, 20%, 40%)', 
    'hsl(37, 20%, 55%)', 
    'hsl(37, 20%, 65%)'
    ]
  },
  {
    name: 'desert', lgMapColor: 'hsl(42, 54%, 63%)', localMapColors: [
    'hsl(42, 40%, 60%)', 
    'hsl(42, 48%, 67%)',
    'hsl(42, 50%, 75%)',
    'hsl(44, 56%, 80%)'
    ]
  },
  {
    name: 'river', lgMapColor: 'hsl(176, 48%, 34%)', localMapColors: [
      'hsl(176, 40%, 34%)',
      'hsl(176, 48%, 34%)',
      'hsl(176, 50%, 34%)',
      'hsl(176, 55%, 34%)'
    ]
  },
];

// WORLD GENERATION =====================

function createWorld() {
  lgMapTileArray.length = 0;
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) {
      // ADD SOME LOGIC TO BIOME RANDOMIZATION
      let biomeIndex = 0;
      let randNum = Math.floor(Math.random() * 100);
      // plains
      if (randNum < 40) biomeIndex = 0;
      // forests
      if (randNum > 40 && randNum < 60) biomeIndex = 1;
      // rocks
      if (randNum > 60 && randNum < 70) biomeIndex = 2;
      // desert
      if (randNum > 70 && randNum < 90) biomeIndex = 3;
      // river
      if (randNum > 95) biomeIndex = 4;
      // tinker some way to accumulate simillar biomes together

      // let biome = biomeArray[Math.floor(Math.random()*biomeArray.length)];
      let biome = biomeArray[biomeIndex];
      lgMapTileArray.push( new Tile(x * tileSize, y * tileSize, x, y , biome))
      // add randomized local map generation iside the tile
    }
  }
  console.log(`Dimension of the World: Width: ${W * localW}, Height: ${H * localH} |number of large cells: ${W * H} | number of total local cells: ${(W * H) * (localW * localH)}`)
}
createWorld();



// mouse object
const mouse = {
  x: null,
  y: null,
  size: 3,
  cursorColor: 'white',
  lmbPressed: false,
  rmbPressed: false,

}

// MOUSE EVENTS ==========================================
// mouse move capture - x, y coords;
addEventListener('mousemove', e=>{
  mouse.x = e.x;
  mouse.y = e.x;
});

largeMap.addEventListener('click', e=> {
  if (showMouseClicks) showMouse();
  if (showCoordinates) showCoords(e);
});
  // debug option, showing mouse coords on canvas
function showMouse() {
  console.log('mouse x : ' +mouse.x)
  console.log('mouse y : ' +mouse.y)
}
function showCoords(e) {
  let map = largeMap.getBoundingClientRect();
  let calcX = Math.floor((e.clientX - map.left) / 10)
  let calcY = Math.floor((e.clientY - map.top) / 10)
  // debug option showing clicked tile coords
  if (isLgMap) console.log(`%c tile X: ${calcX}, tile Y: ${calcY}`, 'background: #black; color: goldenrod;')
  
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


// dbl click on canvas function, firing up zoom in, that draws Local Map
largeMap.addEventListener('dblclick', e=> {
  
  zoomIn(e)
});

// KEYBOARD EVENTS ==================
// arrows to move between local maps
addEventListener('keydown', e=> {
  if (isLocalMap) {
    
    if (e.key === 'ArrowLeft') console.log('Going West')

    if (e.key === 'ArrowUp') console.log('Going North')

    if (e.key === 'ArrowRight') console.log('Going East')

    if (e.key === 'ArrowDown') console.log('Going South')

  }
})


// MAP DRAWING FUNCTIONS ===============================================


// zooming in and out
// enlarging map function after doubleclick 
function zoomIn(e) {

  console.log('%c map zoomed in...🔍', 'background: #000; color: limegreen;')
  let map = largeMap.getBoundingClientRect();
  // console.log(map.x, map.y);
  // calculated coordinates of clicked tile
  let calcX = Math.floor((e.clientX - map.left) / 10)
  let calcY = Math.floor((e.clientY - map.top) / 10)
  // console.log(calcX, calcY);

  currentTile.x = calcX;
  currentTile.y = calcY;
  
  let array = lgMapTileArray;

  // finding the object by x and y coords
  

  for (let i = 0; i < array.length; i++) {
    // coordinate x, y temp variables from lgMapTileArray
    let crdX = array[i].crdX;
    let crdY = array[i].crdY;
 
    if (crdX == currentTile.x && crdY == currentTile.y) {
      console.log('%c Entering choosen tile...', 'background: black; color: goldenrod;')
      // console.log('biome: ', array[i].biome);
      console.log(`%c biome:  ${array[i].biome.name}`, 'background: #888; color: white;');
      // console.log(array[i].localMap[0])
      currentTile.color = array[i].biome.lgMapColor;
      currentTile.localMap = array[i].localMap;
    }
  
  }
  console.log(currentTile)
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

function drawLocalMap(coordX, coordY, localMap) {
  // coords passed from dblclick event
 
  let array = lgMapTileArray;
  let tile = null;
  
  // debug mode log
  if (showDrawingMap) console.log('drawing LOCAL map');

  // drawing map from tile[x, y]
  let currentlocalMap = currentTile.localMap
  for (tile of currentlocalMap) {
    tile.draw();
  }

}
// drawing currentTile
function drawCurrentCellFrame() {
  if (currentTile != []) {
    let x = currentTile.x * 10;
    let y = currentTile.y * 10;
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255,0,255,.5)';
    ctx.strokeRect(x, y, 10, 10);
  }
 
}


// todo change largeMap const name to Map
// add some sprites to the local map tiles
// example : darker tiles can have some obstacles, trees, rocks, buildings etc

// LOOP FUNCTION ========================================================
function loop() {
  ctx.clearRect(0, 0, largeMap.width, largeMap.height);
  //drawing large map, checks for global boolean 'isLgMap' active or not
  if (isLgMap){
    drawLgMap();
    drawCurrentCellFrame();
  }
  //drawing local map, checks for global boolean 'isLocalMap' active or not
  if (isLocalMap) {
    // passing coordinates from currentTile; currentTile has coords from click event

    drawLocalMap(currentTile.x, currentTile.y, currentTile.localMap);
  }
  // drawCursor();
  requestAnimationFrame(loop);
}
loop();