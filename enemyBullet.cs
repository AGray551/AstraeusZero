class enemyBullet extends Phaser.GameObjects.Sprite {
  constructor(scene, enemy, player) {
    super(scene, enemy.x, enemy.y, "enemyBullet");

    scene.add.existing(this);
    this.setScale(6.5);

    scene.physics.world.enableBody(this);
    this.body.setVelocity(0);
    this.body.setAllowGravity(false); 

    scene.physics.moveToObject(this, player, 500);
    console.log(this);
  }

  update() {
    if (this.y < 32 || this.y > config.height || this.x < 0 || this.x > config.width) {
      this.destroy();
    }
  }
}
