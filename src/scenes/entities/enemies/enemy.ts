import type TD from "../../td";

const DEFAULT_ENEMY_SPEED = 1 / 10;
const DEFAULT_ENEMY_HP = 100;

export default class Enemy extends Phaser.GameObjects.Sprite {
  public follower: { t: number; vec: Phaser.Math.Vector2 };
  private path: Phaser.Curves.Path | null = null;
  private speed: number = DEFAULT_ENEMY_SPEED;
  private health_points = DEFAULT_ENEMY_HP;
  private original_health_points;
  private sprite_name: string;
  private prev_ang: number = 0;
  public constructor(
    td_scene: TD,
    x: number = 0,
    y: number = 0,
    sprite_name: string,
    speed: number = DEFAULT_ENEMY_SPEED,
    health_points: number = DEFAULT_ENEMY_HP,
  ) {
    super(td_scene as Phaser.Scene, x, y, sprite_name);
    td_scene.physics.add.existing(this);
    this.sprite_name = sprite_name;
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.speed = speed;
    this.health_points = health_points;
    this.original_health_points = this.health_points; // health_points will need to be set for each enemy
    this.setActive(true);
    this.setVisible(true);
  }

  private resetEnemy(): void {
    if (!this.path) {
      return;
    }
    // set the t parameter at the start of the path
    this.follower.t = 0;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);

    // set the x and y of our enemy to the received from the previous step
    
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    this.health_points = this.original_health_points;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public startOnPath(path: Phaser.Curves.Path): void {
    this.path = path;
    this.resetEnemy();
  }

  public update(time: number, delta: number): void {
    // move the t point along the path, 0 is the start and 0 is the end
    if (!this.path) {
      return; // skip updates if path has not be set by startOnPath
    }
    this.follower.t += (this.speed / this.path.getLength()) * delta;

    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);

    // angle between 0 and 2*PI
    const ang = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y) + Math.PI;
    if (ang != this.prev_ang) {
      if (ang < 1/4 * Math.PI || ang >= 7/4 * Math.PI) {
        // right
        this.anims.play(`${this.sprite_name}-walking-left`)
      } else if (ang < 7/4 * Math.PI && ang >= 5/4 * Math.PI) {
        // down
        this.anims.play(`${this.sprite_name}-walking-down`)
      } else if (ang < 5/4 * Math.PI && ang >= 3/4 * Math.PI) {
        // left
        this.anims.play(`${this.sprite_name}-walking-right`)
      } else if (ang < 3/4 * Math.PI && ang >= 1/4 * Math.PI) {
        // up
        this.anims.play(`${this.sprite_name}-walking-up`)
      }
    }
    this.prev_ang = ang;


    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);

    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
      console.log("Enemy reached end.");
    }
  }

  public receiveDamage(damage: number): void {
    this.health_points -= damage;
    if (this.health_points < 0) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
}
