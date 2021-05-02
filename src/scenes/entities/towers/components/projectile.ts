import type { TowerId, TowerInfo } from "../../../../gamelogic/td/tower_defense";
import type TD from "../../../td";
import type Enemy from "../../enemies/enemy";
import type Tower from "../tower";
import { findFirstEnemyInRange } from "./target_handler";

// projectiles can proc:
// on shooting
// X seconds after shooting
// on hitting an enemy
// X seconds after hitting
// on enemy death
// X seconds after enemy death

export default class Projectile extends Phaser.GameObjects.Image {

  public tower_id!: TowerId;
  public td_scene: TD;

  public damage: number = 0;
  public range: number = 0;
  public speed: number = 0;

  public dx: number = 0;
  public dy: number = 0;
  public target_angle: number = 0;

  public target?: Enemy;

  public chains: number = 0;

  public last_enemy_hit?: Enemy;

  public lifespan: number = 0;
  public initial_lifespan: number = 0;

  public targeting_mode = 'first';

  public body!: Phaser.Physics.Arcade.Body;

  public constructor(scene: Phaser.Scene, bullet_type = 'small_bullet') {
    super(scene, 0, 0, bullet_type);
    this.td_scene = this.scene as TD;
  }

  public fire(
    tower: Tower, 
    bullet_type: string, 
    lifespan: number = 1000, // Idk if this always been 1 second is fine? probably wont work for range
  ) {
    this.target = tower.target;
    this.target_angle = tower.target_angle;

    this.tower_id = tower.tower_id;

    this.lifespan = lifespan;
    this.speed = tower.tower_info.attributes.projectile_speed;
    this.damage = tower.tower_info.attributes.damage;
    this.range = tower.tower_info.attributes.range;

    tower.tower_info.attributes.projectile_modifiers?.forEach(mod => {
      if (mod.chains) this.chains += mod.chains
    })

    this.initial_lifespan = this.lifespan;
    this.last_enemy_hit = undefined;

    this.dx = Math.cos(this.target_angle)
    this.dy = Math.sin(this.target_angle)

    this.setPosition(tower.x, tower.y);
    this.setRotation(this.target_angle - Math.PI / 2);
    this.setTexture(bullet_type);
    
    this.body.setEnable(true);
    this.body.reset(tower.x, tower.y)
    this.body.setVelocity(this.dx * this.speed, this.dy * this.speed);
    
    this.setActive(true);
    this.setVisible(true);
  }

  public update(time: number, delta: number) {
    this.lifespan -= delta;

    console.log('proj', this.lifespan)

    if (this.lifespan <= 0) {
      this.setActive(false);
      this.setVisible(false);
      this.body.setEnable(false);
    }
  }

  public hit(enemy: Enemy) {
    let still_alive = false;
    if (this.chains > 0) {
      this.chains--;
      const targets = this.target ? [this.target] : []
      const new_target = findFirstEnemyInRange(this as any, this.td_scene, this.range, targets)
      if (new_target) {
        still_alive = true;
        this.target = new_target;
        this.lifespan = this.initial_lifespan;
        this.target_angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);
        this.dx = Math.cos(this.target_angle);
        this.dy = Math.sin(this.target_angle);
        this.setRotation(this.target_angle - Math.PI / 2);
        this.body.reset(this.x, this.y);
        this.body.setVelocity(this.dx * this.speed, this.dy * this.speed);
      }
    }

    if (!still_alive) { 
      this.setActive(false);
      this.setVisible(false);
      this.body.setEnable(false);
      this.lifespan = 0;
    }

    return this.damage;
  }
}