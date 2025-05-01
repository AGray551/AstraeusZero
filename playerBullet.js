class playerBullet extends Phaser.GameObjects.Sprite {
  constructor(scene, player, direction) {
    super(scene, player.x, player.y, "playerBullet");

    scene.add.existing(this);
    this.setScale(6.5);

    this.rotation = Phaser.Math.DegToRad(direction); 

    scene.physics.world.enableBody(this);
    this.body.setAllowGravity(false);

    this.body.setVelocity(
      Math.cos(this.rotation) * 1000,  
      Math.sin(this.rotation) * -1000  
    );
  }

  update() {
    if (this.y < 32 || this.y > config.height || this.x < 0 || this.x > config.width) {
      this.destroy();
    }
  }
}
