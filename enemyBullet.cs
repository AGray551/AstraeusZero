class enemyBullet extends Phaser.GameObjects.Sprite {
    constructor(scene, enemy) {

        var x = enemy.x;
        var y = enemy.y;

        super(scene, x, y, "enemyBullet");
        scene.add.existing(this);
        this.setScale(3);

        scene.physics.world.enableBody(this);
        this.body.velocity.y = - 250;
    }

    update(){
  
        if(this.y < 32 ){
          this.destroy();
        }
    }
}