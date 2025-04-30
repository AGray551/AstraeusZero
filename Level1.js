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

    this.enemy1 = this.add.sprite(config.width / 2 - 50, -100, "enemy1");
    this.enemy1.setScale(5); 
    this.enemy1.setInteractive();

    //Group creation
    this.enemies = this.physics.add.group(); 
    this.enemyProjectiles = this.add.group();
    this.playerProjectiles = this.add.group();

    //Collider set up
    this.physics.add.overlap(this.playerShip, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.playerShip, this.enemyProjectiles, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.enemies, this.playerProjectiles, this.hurtEnemy, null, this);

    //Gamepad API
    window.addEventListener("gamepadconnected", gamepadAPI.connect);
    window.addEventListener("gamepaddisconnected", gamepadAPI.disconnect);

    this.spawnEnemy(128, -50, "enemy1", 275, 150, 3000, 145);
    this.spawnEnemy(512, -50, "enemy1", 275, 150, 3000, -145);
    this.spawnEnemy(512, -50, "enemy1", 25, 150, 3000, -145);
  }

  update(nonFiredTime, delta) {
    //Gamepad API
    gamepadAPI.update();

    //Keeping a timer for input tracking
    this.nonFiredTime += delta / 1000;
  
    this.background.tilePositionY -= 0.5;
    this.movePlayerManager();
    this.energyStorageManager();
  
    this.thruster.x = this.playerShip.x;
    this.thruster.y = this.playerShip.y + 35;
  
    this.enemies.getChildren().forEach(enemy => {
      this.LShapedPattern(enemy);
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
            this.firePaused = false;
          },
          callbackScope: this, 
          loop: false
        });
        this.nonFiredTime = 0;
      }
      else if (!this.firePaused) {
        this.shootPlayerBullet(this.playerShip, 90);
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
  
  
  movePlayerManager() {
  
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
    const enemy = this.physics.add.sprite(xSpawn, ySpawn, spriteKey);
    enemy.setScale(5);
    enemy.setInteractive();
    enemy._pattern = {
      ySpeed: ySpeed,
      distance: distance,
      pauseTime: pauseTime,
      xSpeed: xSpeed,
      hasPaused: false,
      hasFired: false,
      hasResumed: false
    };
    enemy.health = 3;
    this.enemies.add(enemy);
  }
  
  LShapedPattern(enemy) {
    const pattern = enemy._pattern;

    if (!enemy.active) {
      return; 
    }
  
  
    if (!pattern.hasPaused) {
      enemy.setVelocityY(pattern.ySpeed);
    }

    if (enemy.y >= pattern.distance - 1 && enemy.y <= pattern.distance + 1)
    {
      pattern.hasPaused = true;
      console.log("pattern distance reached");
    }

    if (pattern.hasPaused == true)
      {
        enemy.setVelocityY(0);
        enemy.setVelocityX(pattern.xSpeed);

        this.timerEvent = this.time.addEvent({
          delay: pattern.pauseTime / 2,
          callback: () => {
            if (!pattern.hasFired)
            {
              this.shootEnemyBullet(enemy);
              pattern.hasFired = true;
            }
          },
          callbackScope: this, 
          loop: false
        });
        
        this.timerEvent = this.time.addEvent({
          delay: pattern.pauseTime,
          callback: () => {
            if (pattern.hasPaused == true)
            {
              enemy.setVelocityX(0);
              enemy.setVelocityY(pattern.ySpeed * 2);
            }
          },
          callbackScope: this, 
          loop: false
        });
      }
    
  }

  shootEnemyBullet(enemy) {
    const eBullet = new enemyBullet(this, enemy, this.playerShip);
    this.enemyProjectiles.add(eBullet);
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
      console.log("Game Over");
    }
  }

  hurtEnemy(enemy, projectile) {
    enemy.health--;

    this.tweens.add({
        targets: enemy,
        alpha: 0.5,
        ease: 'Linear',
        duration: 50,
        yoyo: true,
        onComplete: () => {
            enemy.alpha = 1;
        }
    });

    projectile.destroy();

    if (enemy.health <= 0) {
        this.destroyEnemy(enemy);
    }
}

destroyEnemy(enemy) {
    this.tweens.add({
        targets: enemy,
        scaleX: 0,
        scaleY: 0,
        duration: 200,
        onComplete: () => {
            enemy.destroy();
        }
    });
}
  

  energyStorageManager() {
  
    if (this.cursorKeys.space.isDown)
    {

    }
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
