import type TD from "../../td";
import Bullet from "../tower_bullet";
import type Enemy from "../enemies/enemy";
import { gameModel } from "../../../gamelogic/gamemodel";
import type { TowerId, TowerInfo, TargetingMode } from "../../../gamelogic/td/tower_defense";
import { OutlinePipeline } from "../../../plugins/outline";

const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;
const PLACEABLE_MIN_DISTANCE_FROM_PATH = 35;


export default class Turret extends Phaser.GameObjects.Image {
  public range = DEFAULT_RANGE;
  public attack_speed = DEFAULT_ATTACK_SPEED;
  public damage = DEFAULT_DAMAGE;
  public is_selected = false;
  public is_hovered = false;
  public show_range = false;
  public is_placed = false;
  public tower_id: TowerId;
  
  private projectiles: BetterGroup<Bullet>;
  public display_range:  Phaser.GameObjects.Arc;
  private td_scene: TD;
  private next_tick = 0;
  private tower_info!: TowerInfo | null;
  private target!: Enemy | null;
  private target_indicator!: Phaser.GameObjects.Arc;
  private targeting_mode: TargetingMode = 'first'
  private current_time: number = 0;

  public constructor(
    td_scene: TD,
    tower_id: TowerId,
    x: number = 0,
    y: number = 0,
    sprite_name: string = "turret",
  ) {
    super(td_scene, x, y, sprite_name);
    this.td_scene = td_scene;
    this.tower_id = tower_id;

    // TODO(jon): Projectiles will have to be managed differently to allow different projectiles for each turret.
    this.projectiles = this.td_scene.add.group({ classType: Bullet, active: true }) as BetterGroup<Bullet>;
    this.display_range = this.td_scene.add.circle(0, 0, this.range, 0xff0000, 0.5);
    this.display_range.setVisible(false);
    this.setupTowerSubscription(tower_id)
  }

  private setupTowerSubscription(tower_id: string) {
    const unsubscribe_store = gameModel.subscribe((model) => {
      this.tower_info = model.tower_defense.getTower(tower_id as TowerId)
  
      if (this.tower_info) {
        if (this.range !== this.tower_info.attributes.range) {
          this.range = this.tower_info.attributes.range
          this.display_range.setRadius(this.range)
        }
        if (this.attack_speed !== this.tower_info.attributes.attack_speed) {
          this.attack_speed = this.tower_info.attributes.attack_speed
        }
        if (this.damage !== this.tower_info.attributes.damage) {
          this.damage = this.tower_info.attributes.damage
        }
        if (this.is_selected !== this.tower_info.status.is_selected) {
          this.is_selected = this.tower_info.status.is_selected
        }
        if (this.is_placed !== this.tower_info.status.is_placed) {
          this.is_placed = this.tower_info.status.is_placed;
        }
        if (this.targeting_mode !== this.tower_info.status.targeting_mode) {
          this.targeting_mode = this.tower_info.status.targeting_mode;
        }
      }
    })
    this.td_scene.events.on("destroy", function () {
      unsubscribe_store();
    });
  }

  public preUpdate() { this.setDisplayRange() }

  public update(time: number, delta: number): void {
    for (const proj of this.projectiles.getChildren()) proj.update(time, delta)
    if (this.is_selected || this.is_hovered) {
      const already_applied = this.getPostPipeline(OutlinePipeline)
      if (already_applied instanceof Array && !already_applied.length) this.setPostPipeline(OutlinePipeline)
    } else {
      this.removePostPipeline(OutlinePipeline);
    }

    if (!this.is_placed) return;

    let e;
    if (this.targeting_mode === 'closest') e = this.findClosestEnemyInRange(20);
    if (this.targeting_mode === 'last') e = this.findLastEnemyInRange(20);
    if (this.targeting_mode === 'first') e = this.findFirstEnemyInRange(20);
    if (this.targeting_mode === 'strongest') e = this.findStrongestEnemyInRange(20);

    // time to shoot
    this.current_time += delta;
    if (this.current_time > this.next_tick) {
      if (e) {
        this.targetEnemy(e);
      } else if (this.target_indicator) {
        this.target_indicator.setVisible(false);
      }
      //If fired at enemy, start cooldown
      if (this.attemptToFire()) this.next_tick = this.current_time + this.attack_speed;
    }
  }

  public preDestroy() {
    if (this.tower_info) {
      this.tower_info.status.is_selected = false;
      this.tower_info.status.is_placed = false;
    }
    this.setDisplayRange();
  }

  private isPlaceable(
    place_x: number,
    place_y: number,
  ): boolean {
    // TODO(jon): check performance here
    const min_dist = this.td_scene.path.getPoints(this.td_scene.path.getLength() / 20).reduce((acc, point) => {
      return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
    }, 1000);
    if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
      // console.error('Can not place turret next to path')
      return false;
    }

    for (const t of this.td_scene.tower_map.values()) {
      if (t == this.td_scene.selected_turret) continue; // current turret on cursor

      const min_x = t.x - t.width/2
      const max_x = t.x + t.width/2
      const min_y = t.y - t.height/2
      const max_y = t.y + t.height/2
  
      const new_min_x = place_x - this.width/2
      const new_max_x = place_x + this.width/2
      const new_min_y = place_y - this.height/2
      const new_max_y = place_y + this.height/2
  
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
    this.select(false);
    this.enableBulletCollisions();
    return true; 
  }

  public setDisplayRange() {
    const red = 0xff0000
    const green = 0x00ff00
    const blue = 0x0000ff
    this.display_range.x = this.x;
    this.display_range.y = this.y;
    if (this.is_selected) {
      this.display_range.setVisible(true);
      this.display_range.setStrokeStyle(2, 0xffffff);
      if (!this.is_placed) {
        if (this.isPlaceable(this.x, this.y)) {
          this.display_range.setFillStyle(green, 0.3);
        } else {
          this.display_range.setFillStyle(red, 0.3);
        }
      } else {
        this.display_range.setFillStyle(blue, 0.15);
      }
    } else {
      this.display_range.setVisible(false);
    }
  }

  public attemptToFire(): boolean {
    //Enemy Found
    let e;
    if (this.targeting_mode === 'closest') e = this.findClosestEnemyInRange(20);
    if (this.targeting_mode === 'last') e = this.findLastEnemyInRange(20);
    if (this.targeting_mode === 'first') e = this.findFirstEnemyInRange(20);
    if (this.targeting_mode === 'strongest') e = this.findStrongestEnemyInRange(20);

    if (e) {
      this.fireBullet(this.x, this.y, this.getAngleToEnemy(e));
      return true;
    }
    return false;
  }

  private findClosestEnemyInRange(range_bonus: number = 0): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let closest_enemy: Enemy | undefined;
    let closest_distance = Number.MAX_VALUE;
    for (const e of enemies.getChildren()) {
      const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
      if (d < (this.range + range_bonus) * (this.range + range_bonus)) {
        if (d < closest_distance) {
          closest_distance = d;
          closest_enemy = e;
        }
      }
    }
    return closest_enemy;
  }

  private findFirstEnemyInRange(range_bonus: number = 0): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let first_enemy: Enemy | undefined;
    let first_distance = Number.MIN_VALUE;
    for (const e of enemies.getChildren()) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
      if (d < this.range + range_bonus) {
        if (e.follower.t > first_distance) {
          first_distance = e.follower.t;
          first_enemy = e;
        }
      }
    }
    return first_enemy;
  }

  private findLastEnemyInRange(range_bonus: number = 0): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let furthest_enemy: Enemy | undefined;
    let furthest_distance = Number.MAX_VALUE;
    for (const e of enemies.getChildren()) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
      if (d < this.range + range_bonus) {
        if (e.follower.t < furthest_distance) {
          furthest_distance = e.follower.t;
          furthest_enemy = e;
        }
      }
    }
    return furthest_enemy;
  }

  private findStrongestEnemyInRange(range_bonus: number = 0): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let strongest_enemy: Enemy | undefined;
    let heightest_hp = Number.MIN_VALUE;
    for (const e of enemies.getChildren()) {
      const d = Phaser.Math.Distance.Between(this.x, this.y, e.x, e.y);
      if (d < this.range + range_bonus) {
        if (e.health_points > heightest_hp) {
          heightest_hp = e.health_points;
          strongest_enemy = e;
        }
      }
    }
    return strongest_enemy;
  }

  private getAngleToEnemy(enemy: Enemy): number {
    return Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
  }

  private targetEnemy(enemy: Enemy): void {
    if (!this.target_indicator) {
      this.target_indicator = this.td_scene.add.circle(enemy.x, enemy.y, enemy.width, 0xff0000)
    }
    if (!this.tower_info?.status.is_selected) {
      this.target_indicator.setVisible(false);
      // return;
    }
    if (this.target != enemy && this.tower_info?.status.is_selected) {
      this.target = enemy
      this.target_indicator.width = enemy.width;
      this.target_indicator.setVisible(true);
      this.target_indicator.setStrokeStyle(2, 0xffffff)
      this.target_indicator.setAlpha(0.4)
    }
    this.target_indicator.setPosition(enemy.x, enemy.y)
    this.target_indicator.setDepth(1)
    this.rotation = this.getAngleToEnemy(enemy) + Math.PI / 2;
  }

  public fireBullet(x: number, y: number, angle: number): void {
    const b = this.projectiles.get();
    //TODO - Make bullets smart so they follow units
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    // position the bullet in front of the tower "cannon". If the tower is not a cannon this will cause the projectile to
    // spawn in front of the turret. Another approach here is to have all projectiles spawn at the turret center, but render
    // under the tower sprite.
    b.fire(this.tower_id, x + (dx * (this.width - 10)), y + (dy * (this.height - 10)), angle, this.range, this.damage, this.tower_info?.attributes.projectile_modifiers);
  }

  public enableBulletCollisions(): void {
    this.scene.physics.add.overlap(this.td_scene.wave_manager.enemies, this.projectiles, this.td_scene.damageEnemy as ArcadePhysicsCallback);
  }

  public select(is_selected = true): void {
    if (this.tower_info) {
      this.tower_info.status.is_selected = is_selected;
    }
  }
}