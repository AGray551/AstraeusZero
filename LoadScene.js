class LoadScene extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  preload() {
    //background
    this.load.image("background", "assets/background/spaceBackground.png");

    //Ui
    this.load.image("heart", "assets/UI/heart.png");

    //Player
    this.load.spritesheet("playerShip", "assets/gameObjects/shipSprites.png",{
      frameWidth: 8,
      frameHeight: 7
    });
    this.load.spritesheet("thruster", "assets/gameObjects/thrusterSprites.png",{
      frameWidth: 8,
      frameHeight: 9
    });
    this.load.image("playerBullet", "assets/gameObjects/playerBullet.png");

    this.load.image("enemy1", "assets/gameObjects/enemy1.png");
    this.load.image("enemyBullet", "assets/gameObjects/enemyBullet.png");
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.text(5, 5, "Loading game...");
    this.scene.start("Level1");

    this.anims.create({
      key: "thruster",
      frames: this.anims.generateFrameNumbers("thruster"),
      frameRate: 20,
      repeat: -1
    });

  }


}
