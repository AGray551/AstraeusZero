class playerBullet extends Phaser.GameObjects.Sprite {
  constructor(scene, player, direction) {
    super(scene, player.x, player.y, "playerBullet");

    scene.add.existing(this);
    this.setScale(6.5);

    // Set the bullet's rotation based on the direction passed
    this.rotation = Phaser.Math.DegToRad(direction); // Convert degrees to radians

    scene.physics.world.enableBody(this);
    this.body.setAllowGravity(false);

    // Use angle for velocity calculation
    this.body.setVelocity(
      Math.cos(this.rotation) * 1000,  // x velocity
      Math.sin(this.rotation) * -1000  // y velocity (negative to go upwards)
    );
  }

  update() {
    if (this.y < 32 || this.y > config.height || this.x < 0 || this.x > config.width) {
      this.destroy();
    }
  }
}
