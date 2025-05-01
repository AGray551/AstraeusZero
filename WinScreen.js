class WinScreen extends Phaser.Scene {
  constructor() {
    super("WinScreen");
  }

  create() {
    //Background
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);

    // Game title
    this.add.text(config.width / 2, config.height / 2 - 100, "You Stopped the Invasion!", {
      fontSize: "38px",
      fill: "#ffffff",
      fontStyle: "bold"
    }).setOrigin(0.5);

    const startText = this.add.text(config.width / 2, config.height / 2, "Press ENTER or START to Play Again", {
      fontSize: "28px",
      fill: "#ffffff"
    }).setOrigin(0.5);

    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("StartMenu");
    });

    window.addEventListener("gamepadconnected", gamepadAPI.connect);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);
  }

  update(time, delta) {
    gamepadAPI.update();


    if (gamepadAPI.buttonPressed("A", true)) {
      this.scene.start("StartMenu");
    }
  }
}
