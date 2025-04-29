var gameSettings = {
  playerSpeed: 400,
  maxPowerups: 2,
  powerUpVel: 50,
}

let config = {
  type:Phaser.AUTO,
  parent: 'game-container',
  width:640,
  height:1280,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: {y:600},
      debug:false,
    },
  },
  scene: [LoadScene, Level1]
};

let game = new Phaser.Game(config);