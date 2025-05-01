class Enemy1 extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);
    this.scene = scene;
    this.setScale(5);
    this.setInteractive();
    this.health = 5;
    this._pattern = {
      ySpeed: 275,
      distance: 150,
      pauseTime: 1000,
      xSpeed: 145,
      hasPaused: false,
      hasFired: false,
      hasResumed: false
    };
    scene.physics.world.enable(this);
    scene.add.existing(this);
    this._timerEvent = null;

    this.beamSound = scene.sound.add("audio_beam", { volume: 0.1, rate: 2 });
  }


  update(time, delta) {
    if (!this.active || !this.body) {
      return;
    }
    this.LShapedPattern();
  }

  shootEnemyBullet() {
    const eBullet = new enemyBullet(this.scene, this, this.scene.playerShip);
    this.scene.enemyProjectiles.add(eBullet);
  }

  LShapedPattern() {
    const pattern = this._pattern;

    if (!this.active) {
      return;
    }

    // Move the enemy downwards initially
    if (!pattern.hasPaused) {
      this.setVelocityY(pattern.ySpeed);
    }

    // Check if the enemy has reached the desired distance to pause
    if (this.y >= pattern.distance - 5 && this.y <= pattern.distance + 5) {
      pattern.hasPaused = true;
      console.log("Pattern distance reached");
    }

    //L shaped pattern logic
    if (pattern.hasPaused) {
      this.setVelocityY(0);
      this.setVelocityX(pattern.xSpeed);

      //Bullet fire logic
      if (!pattern.hasFired) {
        this._shootTimer = this.scene.time.addEvent({
          delay: pattern.pauseTime / 2,
          callback: () => {
            if (!pattern.hasFired && this.scene) {
              this.shootEnemyBullet();
              this.beamSound.play();
              pattern.hasFired = true;
            }
          },
          callbackScope: this,
          loop: false
        });
      }
      this._resumeTimer = this.scene.time.addEvent({
        delay: pattern.pauseTime,
        callback: () => {
          if (pattern.hasPaused && this.body) {
            this.setVelocityX(0);
            this.setVelocityY(pattern.ySpeed * 2);
          }
        },
        callbackScope: this,
        loop: false
      });
    }
  }

  //Damage logic
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
      this.destroyEnemy();
    }
  }

  //Destroys the enemy and disables any ongoing code
  destroyEnemy() {
    this.body.enable = false;
    this.disableInteractive();
    this.setActive(false).setVisible(false);

    if (this._timerEvent) {
      this._timerEvent.remove(false);
      this._timerEvent = null;
    }

    if (this._shootTimer) {
    this._shootTimer.remove(false);
    this._shootTimer = null;
    }
    if (this._resumeTimer) {
      this._resumeTimer.remove(false);
      this._resumeTimer = null;
    }

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
