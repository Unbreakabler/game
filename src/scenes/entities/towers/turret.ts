const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;

const PLACEABLE_MIN_DISTANCE_FROM_PATH = 50;

import type TD from "../../td";
import Bullet from "../tower_bullet";
import type Enemy from "../enemies/enemy";

export default class Turret extends Phaser.GameObjects.Image {
  private next_tick = 0;
  private projectiles: Bullet[];
  private range = DEFAULT_RANGE;
  private attack_speed = DEFAULT_ATTACK_SPEED;
  private damage = DEFAULT_DAMAGE;
  private td_scene: TD;

  public constructor(
    td_scene: TD,
    x: number = 0,
    y: number = 0,
    sprite_name: string = "turret",
    range: number = DEFAULT_RANGE,
    attack_speed: number = DEFAULT_ATTACK_SPEED,
    damage: number = DEFAULT_DAMAGE,
  ) {
    super(td_scene as Phaser.Scene, 0, 0, sprite_name);
    this.td_scene = td_scene;
    this.td_scene.add.existing(this);
    td_scene.add.group(this, { active: true });
    this.range = range;
    this.attack_speed = attack_speed;
    this.damage = damage;
    this.projectiles = [];
    this.setActive(true);
    this.setVisible(true);
  }

  private isPlaceable(
    place_x: number,
    place_y: number,
    width: number,
    height: number,
    turrets: Turret[],
    path: Phaser.Curves.Path,
  ): boolean {
    const min_dist = path.getPoints(path.getLength() / 20).reduce((acc, point) => {
      return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
    }, 1000);
    if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
      return false; // Can not place turret next to path
    }

    for (const t of turrets) {
      const min_x = t.x - t.width / 2;
      const max_x = t.x + t.width / 2;
      const min_y = t.y - t.height / 2;
      const max_y = t.y + t.height / 2;

      const new_min_x = place_x - width / 2;
      const new_max_x = place_x + width / 2;
      const new_min_y = place_y - height / 2;
      const new_max_y = place_y + height / 2;

      const x_overlap = Math.max(0, Math.min(max_x, new_max_x) - Math.max(min_x, new_min_x));
      const y_overlap = Math.max(0, Math.min(max_y, new_max_y) - Math.max(min_y, new_min_y));

      if (x_overlap * y_overlap > 0) {
        return false; // Can not place a turret overlapping another turret
      }
    }
    return true;
  }

  public place(place_x: number, place_y: number, width: number, height: number): boolean {
    if (this.isPlaceable(place_x, place_y, width, height, this.td_scene.turrets, this.td_scene.path)) {
      this.x = place_x;
      this.y = place_y;
      this.setActive(true);
      this.setVisible(true);
      this.setInteractive();
      console.log(`placing turret @ x:${place_x}, y:${place_y}`);
      return true;
    } else {
      console.error(`Error placing turret @ x:${place_x}, y:${place_y}`);
      return false;
    }
  }

  public update(time: number, delta: number): void {
    //Look at near enemies
    const e = this.findClosestEnemyInRange(100);

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

    for (const p of this.projectiles) p.update(time, delta);
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
    for (const e of enemies) {
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
    this.projectiles.push(b);
    //TODO - Make bullets smart so they follow units and delete selves when enemy is dead
    b.fire(x, y, angle, this.range, this.damage);
  }

  public enableBulletCollisions(enemies: Enemy[]): void {
    this.scene.physics.add.overlap(
      enemies as Phaser.GameObjects.GameObject[],
      this.projectiles as Phaser.GameObjects.GameObject[],
      this.td_scene.damageEnemy as ArcadePhysicsCallback,
    );
  }
}
