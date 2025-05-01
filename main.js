var gameSettings = {
  playerSpeed: 500,
}

const gamepadAPI = {
  controller: {},
  turbo: false,
  connect(evt) {
    gamepadAPI.controller = evt.gamepad;
    gamepadAPI.turbo = true;
    console.log("Gamepad connected.");
  },
  disconnect(evt) {
    gamepadAPI.turbo = false;
    delete gamepadAPI.controller;
    console.log("Gamepad disconnected.");
  },
  update() {
    gamepadAPI.buttonsCache = [...gamepadAPI.buttonsStatus];
    gamepadAPI.buttonsStatus = [];

    const c = gamepadAPI.controller || {};

    const pressed = [];
    if (c.buttons) {
      for (let b = 0; b < c.buttons.length; b++) {
        if (c.buttons[b].pressed) {
          pressed.push(gamepadAPI.buttons[b]);
        }
      }
    }

    const axes = [];
    if (c.axes) {
      for (let a = 0; a < c.axes.length; a++) {
        axes.push(c.axes[a].toFixed(2));
      }
    }

    gamepadAPI.axesStatus = axes;
    gamepadAPI.buttonsStatus = pressed;
    return pressed;
  },
  buttonPressed(button, hold) {
    let newPress = false;
    for (let i = 0; i < gamepadAPI.buttonsStatus.length; i++) {
      if (gamepadAPI.buttonsStatus[i] === button) {
        newPress = true;
        if (!hold) {
          for (let j = 0; j < gamepadAPI.buttonsCache.length; j++) {
            if (gamepadAPI.buttonsCache[j] === button) {
              newPress = false;
            }
          }
        }
      }
    }
    return newPress;
  },
  buttons: [
    "A",          //  0
    "B",          //  1
    "X",          //  2
    "Y",          //  3
    "LB",         //  4
    "RB",         //  5
    "LT",         //  6  (left trigger)
    "RT",         //  7  (right trigger)
    "Back",       //  8
    "Start",      //  9
    "LS",         // 10 (left stick press)
    "RS",         // 11 (right stick press)
    "DPad-Up",    // 12
    "DPad-Down",  // 13
    "DPad-Left",  // 14
    "DPad-Right", // 15
    "Home"        // 16 (sometimes present)
  ],
  buttonsCache: [],
  buttonsStatus: [],
  axesStatus: [],
};

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
  scene: [LoadScene, StartMenu, Level1, WinScreen]
};

let game = new Phaser.Game(config);