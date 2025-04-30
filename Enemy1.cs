class Enemy1 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.setScale(5);
    this.setInteractive();

    // Enemy-specific variables
    this.health = 3;
    this._pattern = {
      ySpeed: 275,
      distance: 150,
      pauseTime: 3000,
      xSpeed: 145,
      hasPaused: false,
      hasFired: false,
      hasResumed: false
    };

    scene.physics.world.enable(this);
    scene.add.existing(this);

    this._timerEvent = null; // Timer to handle pause/delay
  }

  update() {
    if (!this.active) {
      return; // Don't update if the enemy is inactive
    }

    const pattern = this._pattern;

    if (!pattern.hasPaused) {
      this.setVelocityY(pattern.ySpeed);
    }

    if (this.y >= pattern.distance - 1 && this.y <= pattern.distance + 1) {
      pattern.hasPaused = true;
      console.log("Pattern distance reached");
    }

    if (pattern.hasPaused) {
      this.setVelocityY(0);
      this.setVelocityX(pattern.xSpeed);

      if (!pattern.hasFired) {
        this._timerEvent = this.scene.time.addEvent({
          delay: pattern.pauseTime / 2,
          callback: () => {
            this.shootEnemyBullet();
            pattern.hasFired = true;
          },
          callbackScope: this,
          loop: false
        });

        this._timerEvent = this.scene.time.addEvent({
          delay: pattern.pauseTime,
          callback: () => {
            if (pattern.hasPaused) {
              this.setVelocityX(0);
              this.setVelocityY(pattern.ySpeed * 2);
            }
          },
          callbackScope: this,
          loop: false
        });
      }
    }
  }

  shootEnemyBullet() {
    const eBullet = new enemyBullet(this.scene, this, this.scene.playerShip);
    this.scene.enemyProjectiles.add(eBullet);
  }

  hurt() {
    this.health--;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      ease: 'Linear',
      duration: 50,
      yoyo: true,
      onComplete: () => {
        this.alpha = 1;
      }
    });

    if (this.health <= 0) {
      this.scene.destroyEnemy(this);
    }
  }

  destroyEnemy() {
    this.scene.tweens.add({
      targets: this,
      scaleX: 0,
      scaleY: 0,
      duration: 200,
      onComplete: () => {
        this.destroy();
      }
    });
  }
}
