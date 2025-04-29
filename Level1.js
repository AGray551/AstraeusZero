class Level1 extends Phaser.Scene {
  constructor() {
    super("Level1");
    this.enemyPaused = false;
  }

  create() {
    this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
    this.background.setOrigin(0, 0);
    
    this.playerShip = this.physics.add.sprite(config.width / 2 - 8, config.height - 64, "playerShip");

    this.cursorKeys = this.input.keyboard.createCursorKeys();
    this.playerShip.setCollideWorldBounds(true);
    this.playerShip.setScale(6); 


    this.enemy1 = this.add.sprite(config.width / 2 - 50, -100, "enemy1");
    this.enemy1.setScale(5); 
    this.enemy1.setInteractive();

    //Group creation
    this.projectiles = this.physics.add.group();
    this.enemies = this.physics.add.group(); 

    this.spawnEnemy(128, -50, "enemy1", 275, 150, 3000, 145);
    this.spawnEnemy(512, -50, "enemy1", 275, 150, 3000, -145);
  }

  update() {
    this.background.tilePositionY -= 0.5;
    this.movePlayerManager();
    this.energyStorageManager();
  
    this.enemies.getChildren().forEach(enemy => {
      this.LShapedPattern(enemy);
    });
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
      hasResumed: false
    };
  
    this.enemies.add(enemy);
  }
  
  LShapedPattern(enemy) {
    const pattern = enemy._pattern;
  
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

        this.time.delayedCall(pattern.pauseTime / 2, () => {
          this.shootEnemyBullet(enemy);
        }, null, this);
        
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
    const bullet = new enemyBullet(this, enemy);
    this.projectiles.add(bullet); 
  }
  

  straightFirePattern()
  {

  }

  movePlayerManager() {
  
    this.playerShip.setVelocity(0);

    if (this.cursorKeys.left.isDown) {
      this.playerShip.setVelocityX(-gameSettings.playerSpeed);
      this.playerShip.setFrame(1); 
    } else if (this.cursorKeys.right.isDown) {
      this.playerShip.setVelocityX(gameSettings.playerSpeed);
      this.playerShip.setFrame(2); 
    } else {
      this.playerShip.setFrame(0);
    }

    if (this.cursorKeys.up.isDown) {
      this.playerShip.setVelocityY(-gameSettings.playerSpeed);
    } else if (this.cursorKeys.down.isDown) {
      this.playerShip.setVelocityY(gameSettings.playerSpeed);
    }
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
