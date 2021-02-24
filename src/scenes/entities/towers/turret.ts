const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;

const PLACEABLE_MIN_DISTANCE_FROM_PATH = 50;

import Bullet from '../tower_bullet'

export default class Turret extends Phaser.GameObjects.Image {
  private next_tick = 0;
  private projectiles: Phaser.GameObjects.Group;
  public range = DEFAULT_RANGE;
  public attack_speed = DEFAULT_ATTACK_SPEED;
  public damage = DEFAULT_DAMAGE;

  constructor(scene: Phaser.Scene, x: number = 0, y:number = 0, 
              sprite_name: string = 'turret', range: number = DEFAULT_RANGE, 
              attack_speed: number = DEFAULT_ATTACK_SPEED, damage: number = DEFAULT_DAMAGE) {
    super(scene, 0, 0, sprite_name);
    this.range = range;
    this.attack_speed = attack_speed;
    this.damage = damage;
    this.projectiles = this.scene.physics.add.group({ classType: Bullet, runChildUpdate: true });
  }

  public isPlaceable(place_x: number, place_y: number, width: number, height: number, turrets: Phaser.GameObjects.Group, path: Phaser.Curves.Path): boolean {
    const min_dist = path.getPoints(path.getLength()/20).reduce((acc, point) => {
      return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
    }, 1000)
    if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
      // console.error('Can not place turret next to path')
      return false
    }

    for (const t of turrets.children.entries) {
      if (t == this.scene.selection) continue; // current turret on cursor

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
        // console.error('Can not place a turret overlapping another turret')
        return false
      }
    }
    return true
  }

  public place (place_x: number, place_y: number, width: number, height: number, turrets: Phaser.GameObjects.Group, path: Phaser.Curves.Path) {
    if (this.isPlaceable(place_x, place_y, width, height, turrets, path)) {
      this.x = place_x;
      this.y = place_y;
      this.setActive(true);
      this.setVisible(true);
      this.setInteractive();
    } else {
      console.error(`Error placing turret @ x:${place_x}, y:${place_y}`)
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
    const enemy = this.scene.getEnemy(this.x, this.y, this.range - 50);
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

  public enableBulletCollisions(enemies: Phaser.GameObjects.Group) {
    this.scene.physics.add.overlap(enemies, this.projectiles, this.scene.damageEnemy)
  }
}