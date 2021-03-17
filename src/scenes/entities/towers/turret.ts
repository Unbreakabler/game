import type TD from "../../td";
import Bullet from "../tower_bullet";
import type Enemy from "../enemies/enemy";
import { gameModel, GameModel } from "../../../gamelogic/gamemodel";
import type { TowerInfo } from "../../../gamelogic/td/tower_defense";

const DEFAULT_RANGE = 200;
const DEFAULT_ATTACK_SPEED = 1000;
const DEFAULT_DAMAGE = 50;
const PLACEABLE_MIN_DISTANCE_FROM_PATH = 25;

export default class Turret extends Phaser.GameObjects.Image {
  public range = DEFAULT_RANGE;
  public attack_speed = DEFAULT_ATTACK_SPEED;
  public damage = DEFAULT_DAMAGE;
  public is_selected = false;
  public show_range = false;
  public is_placed = false;
  public tower_id: string;
  
  private projectiles: BetterGroup<Bullet>;
  public display_range:  Phaser.GameObjects.Arc;
  private td_scene: TD;
  private next_tick = 0;
  private tower_info!: TowerInfo | undefined;
  private target!: Enemy | null;
  private target_indicator!: Phaser.GameObjects.Arc;

  public constructor(
    td_scene: TD,
    tower_id: string,
    x: number = 0,
    y: number = 0,
    sprite_name: string = "turret",
  ) {
    super(td_scene, x, y, sprite_name);
    this.td_scene = td_scene;
    this.tower_id = tower_id;
    // TODO(jon): Projectiles will have to be managed different to allow differently projectiles for each turret.
    this.projectiles = this.td_scene.add.group({ classType: Bullet, active: true, runChildUpdate: true }) as BetterGroup<Bullet>;
    this.display_range = this.td_scene.add.circle(0, 0, this.range, 0xff0000, 0.5);
    this.display_range.setVisible(false);
    this.setupTowerSubscription(tower_id)
  }

  private setupTowerSubscription(tower_id: string) {
    const unsubscribe_store = gameModel.subscribe((model) => {
      this.tower_info = model.tower_defense.getTower(tower_id)
  
      if (this.tower_info) {
        if (this.range !== this.tower_info.range) {
          this.range = this.tower_info.range
          this.display_range.setRadius(this.range)
        }
        if (this.attack_speed !== this.tower_info.attack_speed) {
          this.attack_speed = this.tower_info.attack_speed
        }
        if (this.damage !== this.tower_info.damage) {
          this.damage = this.tower_info.damage
        }
        if (this.is_selected !== this.tower_info.is_selected) {
          this.is_selected = this.tower_info.is_selected
        }
        if (this.is_placed !== this.tower_info.is_placed) {
          this.is_placed = this.tower_info.is_placed;
        }
      }
    })
    this.td_scene.events.on("destroy", function () {
      unsubscribe_store();
    });
  }

  public preUpdate() { this.displayRange() }

  public update(time: number, delta: number): void {
    if (!this.is_placed) return;

    //Look at near enemies
    const e = this.findClosestEnemyInRange(20);

    if (e) {
      this.targetEnemy(e);
    } else if (this.target_indicator) {
      this.target_indicator.setVisible(false);
    }
    // time to shoot
    if (time > this.next_tick) {
      //If fired at enemy, start cooldown
      if (this.attemptToFire()) this.next_tick = time + this.attack_speed;
    }
  }

  public preDestroy() {
    if (this.tower_info) {
      this.tower_info.is_selected = false;
      this.tower_info.is_placed = false;
    }
    this.displayRange();
  }

  private isPlaceable(
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
    if (this.tower_info) {
      this.tower_info.is_selected = false;
      this.tower_info.is_placed = true;
    }
    this.select(false);
    this.enableBulletCollisions();
    return true;
  }

  public displayRange() {
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
    const enemies = this.td_scene.wave_manager.enemies;
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
    if (!this.target_indicator) {
      this.target_indicator = this.td_scene.add.circle(enemy.x, enemy.y, enemy.width, 0xff0000)
    }
    if (!this.tower_info?.is_selected) {
      this.target_indicator.setVisible(false);
      // return;
    }
    if (this.target != enemy && this.tower_info?.is_selected) {
      // this.target = enemy
      this.target_indicator.width = enemy.width;
      this.target_indicator.setVisible(true);
      this.target_indicator.setStrokeStyle(2, 0xffffff)
      this.target_indicator.setAlpha(0.4)
    }
    this.target_indicator.setPosition(enemy.x, enemy.y)
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
    b.fire(this.tower_id, x + (dx * (this.width - 10)), y + (dy * (this.height - 10)), angle, this.range, this.damage);
  }

  public enableBulletCollisions(): void {
    this.scene.physics.add.overlap(this.td_scene.wave_manager.enemies, this.projectiles, this.td_scene.damageEnemy as ArcadePhysicsCallback);
  }

  public select(is_selected = true): void {
    if (this.tower_info) {
      this.tower_info.is_selected = is_selected;
    }
  }
}