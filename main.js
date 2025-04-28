let config = {
  type:Phaser.AUTO,
  width:288,
  height:512,
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y:600},
      debug:false,
    },
  },
  scene: {
    preload:preload,
    create: create,
    update: update,
  },
};

let isGameOver = false;
let score = 0;
let scoreText;
let isRefresh =false;
let hitPlayed= false;
let diePlayed = false;
let character;
let base;
let baseImage;
let baseHeight;
let baseWidth;
let speed = -150;
let spawnTime = 1500;
let gameStart = false;
let game = new Phaser.Game(config);

function preload() {
  //Load assets here
}

function create() {

}

function update() {
  
}