const DEFAULT_ENEMY_SPEED = 1/10000;

export default class Enemy extends Phaser.GameObjects.Sprite {
  public follower: { t: number, vec: Phaser.Math.Vector2}
  private path: Phaser.Curves.Path | null = null
  private speed: number = DEFAULT_ENEMY_SPEED;
  private health_points = 100;
  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'green-knight');
    this.anims.play('green-knight-idle')
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
  }

  public setSpeed(speed: number) {
    this.speed = speed;
  }

  public startOnPath (path: Phaser.Curves.Path) {
    this.path = path
    // set the t parameter at the start of the path
    this.follower.t = 0;
    
    // get x and y of the given t point            
    this.path.getPoint(this.follower.t, this.follower.vec);
    
    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
  }

  public update (time: number, delta: number) {
    // move the t point along the path, 0 is the start and 0 is the end
    if (!this.path) {
      return // skip updates if path has not be set by startOnPath
    }
    this.follower.t += this.speed * delta;
    
    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);
    
    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);

    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1)
    {
      this.setActive(false);
      this.setVisible(false);
    }
  }

  public receiveDamage(damage: number) {
    this.health_points -= damage;
    if (this.health_points < 0) {
      this.setActive(false);
      this.setVisible(false);
    }
  }
}