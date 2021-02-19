import Bullet from './tower_bullet';

export default class Turret extends Phaser.GameObjects.Image {
  private next_tick = 0;
  private projectiles: Phaser.GameObjects.Group | null = null;
  private range = 150;
  private attack_speed = 1000;
  private damage = 50;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'turret');
    // this.projectiles = this.scene.add.group({ classType: Bullet, runChildUpdate: true });
  }

  public place (place_y: number, place_x: number, height: number, width: number, turrets: Phaser.GameObjects.Group, path: Phaser.Curves.Path, bullets: Phaser.GameObjects.Group) {
    this.projectiles = bullets
    try {
      // Get 50 random samples along the path, find the closest point to the tower.
      // This will need to be scaled depending on the total length of the path.
      const min_dist = path.getPoints(50).reduce((acc, point) => {
        return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
      }, 1000)
      if (min_dist < 50) {
        throw 'Can not place turret next to path'
      }

      turrets.children.entries.forEach((t) => {
        let min_x = t.x - t.width/2
        let max_x = t.x + t.width/2
        let min_y = t.y - t.height/2
        let max_y = t.y + t.height/2

        let new_min_x = place_x - width/2
        let new_max_x = place_x + width/2
        let new_min_y = place_y - height/2
        let new_max_y = place_y + height/2

        const x_overlap = Math.max(0, Math.min(max_x, new_max_x) - Math.max(min_x, new_min_x));
        const y_overlap = Math.max(0, Math.min(max_y, new_max_y) - Math.max(min_y, new_min_y));

        if (x_overlap * y_overlap > 0) {
          throw 'Can not place a turret over another another turret'
        }
      })
      this.y = place_y;
      this.x = place_x;
      this.setActive(true);
      this.setVisible(true);
    } catch (e) {
      console.error(`Error placing turret @ x:${place_x}, y:${place_y}`, e)
      this.setActive(false);
      this.setVisible(false);
    }
  }

  public update (time: number, delta: number) {
    // time to shoot
    if (time > this.next_tick) {    
      this.fire();
      this.next_tick = time + this.attack_speed;
    }
  }

  public fire() {
    const enemy = this.scene.getEnemy(this.x, this.y, this.range);
    if (enemy) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
        this.addBullet(this.x, this.y, angle);
        this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
    }
  }

  public addBullet(x: number, y: number, angle: number) {
    if (this.projectiles) {
      const bullet = this.projectiles.get();
      if (bullet) {
          bullet.fire(x, y, angle, this.range, this.damage);
      }
    }
  }
}