class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
    this.enemyPaused = false;
    this.shotFired = false;
    this.isInvincible = false;
    this.nonFiredTime = 0;
    this.firePaused = false;
  }

  

  create() {
    this.sound.stopAll();

    //Background
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    
    //Setting up the player sprites
    this.playerShip = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "playerShip");
    this.playerShip.setScale(6);
    this.playerShip.setDepth(1);
    this.thruster = this.add.sprite(config.width / 2 - 8, config.height - 48, "thruster");
    this.thruster.play("thruster");
    this.thruster.setScale(6);

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.fKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);

    this.playerShip.setCollideWorldBounds(true);
    this.elapsed = 0;


    
    //Enemy wave spawning logic
    //xSpawn, ySpawn, spriteKey, ySpeed, distance, pauseTime, xSpeed
    this.waves = [
      {
        // spawn at t = 2s
        time: 2000,
        enemies: [
          { x: 128, y: -50, texture: "enemy1", ySpeed: 300, distance: 150, pauseTime: 3000, xSpeed: 45 },
          { x: 512, y: -50, texture: "enemy1", ySpeed: 300, distance: 150, pauseTime: 3000, xSpeed: -45 },
        ]
      },
      {
        time: 5000,
        enemies: [
          { x: 128, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 6000,
        enemies: [
          { x: 120, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 7000,
        enemies: [
          { x: 140, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 8000,
        enemies: [
          { x: 111, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 9000,
        enemies: [
          { x: 100, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 10000,
        enemies: [
          { x: 120, y: -50, texture: "enemy1", ySpeed: 275, distance: 150, pauseTime: 3000, xSpeed: 145 },
        ]
      },
      {
        time: 11000,
        enemies: [
          { x: 500, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
      {
        time: 11500,
        enemies: [
          { x: 430, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
      {
        time: 12000,
        enemies: [
          { x: 100, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
      {
        time: 12500,
        enemies: [
          { x: 300, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
      {
        time: 13000,
        enemies: [
          { x: 550, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
      {
        time: 13500,
        enemies: [
          { x: 200, y: -50, texture: "enemy1", ySpeed: 275, distance: 250, pauseTime: 500, xSpeed: 0 },
        ]
      },
    ];
    this.nextWaveIndex = 0;
    this.sceneStartTime = 0;

    //Survival time
    const finalDelay = 20500; // or whatever absolute ms you want
    this.time.delayedCall(
      finalDelay,
      () => this.winScreen(),
      null,
      this
    );
     
    //Audio setup
    this.beamSound = this.sound.add("audio_beam", { volume: 0.05 }); 
    this.explosionSound = this.sound.add("audio_explosion", { volume: 0.05 });
    this.music = this.sound.add("music");
      var musicConfig = {
          mute: false,
          volume: 0.05,
          rate: 1,
          detune: 0,
          seek: 0,
          loop: false,
          delay: 0
      }
    this.music.play(musicConfig);

    //Health system
    this.maxHealth = 3;
    this.currentHealth = this.maxHealth;
    this.hearts = [];
    for (let i = 0; i < this.maxHealth; i++) {
      var heart = this.add.sprite(16 + i * 32, 16, "heart");
      heart.setOrigin(0, 0);
      heart.setScale(3);
      this.hearts.push(heart);
    }

    //Enemy sprite setup
    this.enemy1 = this.add.sprite(config.width / 2 - 50, -100, "enemy1");
    this.enemy1.setScale(5); 
    this.enemy1.setInteractive();

    //Group creation
    this.enemies= this.physics.add.group({
      classType: Enemy1,
      runChildUpdate: true
    });
    this.enemyProjectiles = this.add.group();
    this.playerProjectiles = this.add.group();

    //Collider set up
    this.physics.add.overlap(this.playerShip, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.playerShip, this.enemyProjectiles, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.enemies, this.playerProjectiles, this.hurtEnemy, null, this);

    //Gamepad API
    window.addEventListener("gamepadconnected", gamepadAPI.connect);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

    this.sceneStartTime = this.time.now;
  }

  update(time, delta) {
    //Gamepad API
    gamepadAPI.update();

    //Keeping a timer for input tracking
    this.nonFiredTime += delta / 1000;
    this.elapsed += delta;
  
    this.background.tilePositionY -= 0.5;
    this.movePlayerManager();
  
    this.thruster.x = this.playerShip.x;
    this.thruster.y = this.playerShip.y + 35;

    if (this.nextWaveIndex < this.waves.length) {
      const wave = this.waves[this.nextWaveIndex];
      if (this.elapsed >= wave.time) {
        this.spawnWave(wave);
        this.nextWaveIndex++;
      }
    }
  
  
    this.enemies.getChildren().forEach(enemy => {
      enemy.LShapedPattern(); // Call LShapedPattern method of the enemy
    });
  
    this.enemyProjectiles.getChildren().forEach(eBullet => {
      eBullet.update();
    });


    //playerfire system
    if (this.fKey.isDown || gamepadAPI.buttonPressed("A", true)) {
      if (this.nonFiredTime > 0.45) {
        this.shootPlayerBullet(this.playerShip, 70);
        this.shootPlayerBullet(this.playerShip, 90);
        this.shootPlayerBullet(this.playerShip, 110);
        this.firePaused = true;
        this.timerEvent = this.time.addEvent({
          delay: 100,
          callback: () => {
            this.shootPlayerBullet(this.playerShip, 70);
            this.shootPlayerBullet(this.playerShip, 80);
            this.shootPlayerBullet(this.playerShip, 100);
            this.shootPlayerBullet(this.playerShip, 110);
            this.beamSound.play();
            this.firePaused = false;
          },
          callbackScope: this, 
          loop: false
        });
        this.nonFiredTime = 0;
      }
      else if (!this.firePaused) {
        this.shootPlayerBullet(this.playerShip, 90);
        this.beamSound.play();
        this.firePaused = true;
        this.timerEvent = this.time.addEvent({
          delay: 100,
          callback: () => {
            this.firePaused = false;
          },
          callbackScope: this, 
          loop: false
        });
        this.nonFiredTime = 0;
      }
    }
  }

  
  hurtEnemy(projectile, enemy) {
    if (enemy.hurt) {
      enemy.hurt();
    }
    projectile.destroy();
  }

  spawnWave(wave) {
    wave.enemies.forEach(cfg => {
      const e = new Enemy1(this, cfg.x, cfg.y, cfg.texture);
      e._pattern = {
        ySpeed:    cfg.ySpeed,
        distance:  cfg.distance,
        pauseTime: cfg.pauseTime,
        xSpeed:    cfg.xSpeed,
        hasPaused: false,
        hasFired:  false,
        hasResumed:false
      };
      this.enemies.add(e);
    });
  }
  
  
  movePlayerManager() {
    if (!this.playerShip || !this.playerShip.body) return;
    this.playerShip.setVelocity(0);

    if (this.cursorKeys.left.isDown || gamepadAPI.buttonPressed("DPad-Left", true)) {
      this.playerShip.setVelocityX(-gameSettings.playerSpeed);
      this.playerShip.setFrame(1); 
    } else if (this.cursorKeys.right.isDown || gamepadAPI.buttonPressed("DPad-Right", true)) {
      this.playerShip.setVelocityX(gameSettings.playerSpeed);
      this.playerShip.setFrame(2); 
    } else {
      this.playerShip.setFrame(0);
    }

    if (this.cursorKeys.up.isDown || gamepadAPI.buttonPressed("DPad-Up", true)) {
      this.playerShip.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown || gamepadAPI.buttonPressed("DPad-Down", true)) {
      this.playerShip.setVelocityY(gameSettings.playerSpeed);
    }

    if (this.fKey.isDown || gamepadAPI.buttonPressed("A", true)) {
      if (this.cursorKeys.left.isDown || gamepadAPI.buttonPressed("DPad-Left", true)) {
        this.playerShip.setVelocityX(-gameSettings.playerSpeed / 2);
        this.playerShip.setFrame(1); 
      } else if (this.cursorKeys.right.isDown || gamepadAPI.buttonPressed("DPad-Right", true)) {
        this.playerShip.setVelocityX(gameSettings.playerSpeed / 2);
        this.playerShip.setFrame(2); 
      } else {
        this.playerShip.setFrame(0);
      }
  
      if (this.cursorKeys.up.isDown || gamepadAPI.buttonPressed("DPad-Up", true)) {
        this.playerShip.setVelocityY(-gameSettings.playerSpeed / 2);
      } else if (this.cursorKeys.down.isDown || gamepadAPI.buttonPressed("DPad-Down", true)) {
        this.playerShip.setVelocityY(gameSettings.playerSpeed / 2);
      }
    }
  }

  spawnEnemy(xSpawn, ySpawn, spriteKey, ySpeed, distance, pauseTime, xSpeed) {
    const enemy = new Enemy1(this, xSpawn, ySpawn, spriteKey);
    enemy._pattern = {
      ySpeed: ySpeed,
      distance: distance,
      pauseTime: pauseTime,
      xSpeed: xSpeed,
      hasPaused: false,
      hasFired: false,
      hasResumed: false
    };
    this.enemies.add(enemy);
  }

  shootPlayerBullet(player, direction) {
    const pBullet = new playerBullet(this, player, direction);
    this.playerProjectiles.add(pBullet);
  }

  hurtPlayer(player, source) {
    if (!this.isInvincible)
    {
      if (source.texture && source.texture.key === "enemyBullet") {
        source.destroy();
      }
      this.isInvincible = true;

      this.tweens.add({
        targets: player,
        alpha: 0,
        ease: 'Linear',
        duration: 100,
        repeat: 5,
        yoyo: true,
        onComplete: () => {
          player.alpha = 1;
          this.isInvincible = false;
        }
      });

      this.currentHealth--;
      for (let i = 0; i < this.maxHealth; i++) {
        this.hearts[i].setVisible(i < this.currentHealth);
      }
    }

    if (this.currentHealth <= 0) {
      this.killPlayer(player);
    }
  }
  

  killPlayer(player) {
    this.explosionSound.play();
    const boom = this.add.sprite(player.x, player.y, 'explosion')
      .setScale(5)
      .play('explode');

    boom.once('animationcomplete', () => boom.destroy());

    player.destroy();
    this.thruster.destroy();

    this.timerEvent = this.time.addEvent({
      delay: 1500,
      callback: () => {
        this.scene.start("StartMenu");
      },
      callbackScope: this, 
      loop: false
    });
  }

  winScreen() {
    this.scene.start("WinScreen");
  }
  
  

  moveShip(playerShip, ySpeed) {
    playerShip.y += ySpeed;
    if (playerShip.y > config.height) {
      this.resetShipPos(playerShip);
    }
  }

  resetShipPos(playerShip) {
    playerShip.y = 0;
    var randomX = Phaser.Math.Between(0, config.width);
    playerShip.x = randomX;
  }


}
