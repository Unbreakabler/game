const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;

const PLACEABLE_MIN_DISTANCE_FROM_PATH = 50;

import type TD from "../../td";
import Bullet from "../tower_bullet";
import type Enemy from "../enemies/enemy";

type displayType = 'range' | 'placement'

export default class Turret extends Phaser.GameObjects.Image {
  public range = DEFAULT_RANGE;
  public attack_speed = DEFAULT_ATTACK_SPEED;
  public damage = DEFAULT_DAMAGE;
  public display_type: displayType = 'range';
  public is_selected = true;
  public show_range = false;
  
  private is_placed = false;
  private projectiles: BetterGroup<Bullet>;
  public display_range:  Phaser.GameObjects.Arc;
  private td_scene: TD;
  private next_tick = 0;
  

  public constructor(
    td_scene: TD,
    x: number = 0,
    y: number = 0,
    sprite_name: string = "turret",
    range: number = DEFAULT_RANGE,
    attack_speed: number = DEFAULT_ATTACK_SPEED,
    damage: number = DEFAULT_DAMAGE,
  ) {
    super(td_scene, x, y, sprite_name);
    this.td_scene = td_scene;
    this.range = range;
    this.attack_speed = attack_speed;
    this.damage = damage;
    this.projectiles = this.td_scene.add.group({ classType: Bullet, active: true, runChildUpdate: true }) as BetterGroup<Bullet>;
    this.display_range = this.td_scene.add.circle(0, 0, this.range, 0xff0000, 0.5);
  }

  public update(time: number, delta: number): void {
    //Look at near enemies
    this.display_range.x = this.x;
    this.display_range.y = this.y;
    this.displayRange()
    
    if (!this.is_placed) return;

    const e = this.findClosestEnemyInRange(20);

    if (e) {
      this.targetEnemy(e);
    } else {
      this.angle = 90;
    }
    // time to shoot
    if (time > this.next_tick) {
      //If fired at enemy, start cooldown
      if (this.attemptToFire()) this.next_tick = time + this.attack_speed;
    }
    this.display_range.x = this.x;
    this.display_range.y = this.y;
    this.displayRange()
  }

  public onDestroy() {
    this.is_selected = false;
    this.displayRange();
  }

  public isPlaceable(
    place_x: number,
    place_y: number,
  ): boolean {
    const min_dist = this.td_scene.path.getPoints(this.td_scene.path.getLength() / 20).reduce((acc, point) => {
      return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
    }, 1000);
    if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
      // console.error('Can not place turret next to path')
      return false;
    }

    for (const t of this.td_scene.turrets.getChildren()) {
      if (t == this.td_scene.selection) continue; // current turret on cursor

      let min_x = t.x - t.width/2
      let max_x = t.x + t.width/2
      let min_y = t.y - t.height/2
      let max_y = t.y + t.height/2
  
      let new_min_x = place_x - this.width/2
      let new_max_x = place_x + this.width/2
      let new_min_y = place_y - this.height/2
      let new_max_y = place_y + this.height/2
  
      const x_overlap = Math.max(0, Math.min(max_x, new_max_x) - Math.max(min_x, new_min_x));
      const y_overlap = Math.max(0, Math.min(max_y, new_max_y) - Math.max(min_y, new_min_y));

      if (x_overlap * y_overlap > 0) {
        // console.error('Can not place a turret overlapping another turret')
        return false;
      }
    }
    return true;
  }

  public place(place_x: number, place_y: number): boolean {
    if (!this.isPlaceable(place_x, place_y)) {
      console.error(`Error placing turret @ x:${place_x}, y:${place_y}`);
      return false;
    }
    this.x = place_x;
    this.y = place_y;
    this.setActive(true);
    this.setVisible(true);
    this.setInteractive();
    console.log(`placing turret @ x:${place_x}, y:${place_y}`);
    this.is_placed = true;
    this.is_selected = false;
    return true;
  }

  public displayRange() {
    const red = 0xff0000
    const green = 0x00ff00
    const blue = 0x0000ff
    if (this.is_selected && this.show_range) {
      this.display_range.setVisible(true);
      if (!this.is_placed) {
        if (this.isPlaceable(this.x, this.y)) {
          this.display_range.setFillStyle(green, 0.3);
        } else {
          this.display_range.setFillStyle(red, 0.3);
        }
      } else {
        this.display_range.setFillStyle(blue, 0.3);
      }
    } else {
      this.display_range.setVisible(false);
    }
  }

  public attemptToFire(): boolean {
    //Enemy Found
    const e = this.findClosestEnemyInRange();
    if (e) {
      //Add bullet
      this.fireBullet(this.x, this.y, this.getAngleToEnemy(e));
      //Update where turret is pointing
      this.targetEnemy(e);
      return true;
    }
    return false;
  }

  private findClosestEnemyInRange(range_bonus: number = 0): Enemy | undefined {
    const enemies = this.td_scene.enemies;
    let closest_enemy: Enemy | undefined;
    let closest_distance = Number.MAX_VALUE;
    for (const e of enemies.getChildren()) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
      if (d < this.range + range_bonus) {
        if (d < closest_distance) {
          closest_distance = d;
          closest_enemy = e;
        }
      }
    }
    return closest_enemy;
  }

  private getAngleToEnemy(enemy: Enemy): number {
    return Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
  }

  private targetEnemy(enemy: Enemy): void {
    this.rotation = this.getAngleToEnemy(enemy) + Math.PI / 2;
  }

  public fireBullet(x: number, y: number, angle: number): void {
    const b = new Bullet(this.scene);
    this.projectiles.add(b);
    //TODO - Make bullets smart so they follow units and delete selves when enemy is dead
    b.fire(x, y, angle, this.range, this.damage);
  }

  public enableBulletCollisions(enemies: BetterGroup<Enemy>): void {
    this.scene.physics.add.overlap(enemies, this.projectiles, this.td_scene.damageEnemy as ArcadePhysicsCallback);
  }
}
