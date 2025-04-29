class LoadScene extends Phaser.Scene {
  constructor() {
    super("LoadScene");
  }

  preload() {
    this.load.image("background", "assets/background/spaceBackground.png");

    this.load.spritesheet("playerShip", "assets/gameObjects/shipSprites.png",{
      frameWidth: 8,
      frameHeight: 7
    });

    this.load.image("enemy1", "assets/gameObjects/enemy1.png");
    this.load.image("enemyBullet", "assets/gameObjects/enemyBullet.png");
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.text(5, 5, "Loading game...");
    this.scene.start("Level1");

  }


}
