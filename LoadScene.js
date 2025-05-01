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
    this.load.spritesheet("explosion", "assets/gameObjects/explosion.png",{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("playerBullet", "assets/gameObjects/playerBullet.png");

    //Enemy
    this.load.image("enemy1", "assets/gameObjects/enemy1.png");
    this.load.image("enemyBullet", "assets/gameObjects/enemyBullet.png");

    //Audio
    this.load.audio("audio_beam", ["assets/soundEffects/beam.ogg", "assets/soundEffects/beam.mp3"]);
    this.load.audio("audio_explosion", ["assets/soundEffects/explosion.ogg", "assets/soundEffects/explosion.mp3"]);
    this.load.audio("music", ["assets/soundEffects/sci-fi_platformer12.ogg", "assets/soundEffects/sci-fi_platformer12.mp3"]);
  }

  create() {
    const { width, height } = this.cameras.main;
    this.add.text(5, 5, "Loading game...");
    this.scene.start("StartMenu");

    this.anims.create({
      key: "thruster",
      frames: this.anims.generateFrameNumbers("thruster"),
      frameRate: 20,
      repeat: -1
    });
    this.anims.create({
      key: 'explode',
      frames: this.anims.generateFrameNumbers("explosion"),
      frameRate: 20,
      repeat: 0,
      hideOnComplete: true
    });

  }


}
