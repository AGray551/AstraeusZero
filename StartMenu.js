class StartMenu extends Phaser.Scene {
  constructor() {
    super("StartMenu");
  }

  create() {
    //Background
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    // Game title
    this.add.text(config.width / 2, config.height / 2 - 100, "Astreus Zero", {
      fontSize: "48px",
      fill: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const startText = this.add.text(config.width / 2, config.height / 2, "Press ENTER or START to Play", {
      fontSize: "32px",
      fill: "#ffffff"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("Level1");
    });

    this.playerShip = this.add.sprite(config.width / 2 - 8, config.height - 84, "playerShip");
    this.playerShip.setScale(6);
    this.playerShip.setDepth(1);
    this.thruster = this.add.sprite(config.width / 2 - 8, config.height - 48, "thruster");
    this.thruster.play("thruster");
    this.thruster.setScale(6);

    window.addEventListener("gamepadconnected", gamepadAPI.connect);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
  }

  update(time, delta) {
    gamepadAPI.update();


    if (gamepadAPI.buttonPressed("A", true)) {
      this.scene.start("Level1");
    }
  }
}
