import type { SlotProjectileModifier } from "../../gamelogic/td/stats_tower_modifiers";
import type TD from "../td";
import type Enemy from "./enemies/enemy";

export default class Bullet extends Phaser.GameObjects.Image {
  public dx: number = 0;
  public dy: number = 0;
  public lifespan: number = 1000;
  public speed: number = 1000;
  public damage: number = 0;
  public range: number = 600;
  public tower_id!: string;

  private td_scene: TD;
  private mods!: SlotProjectileModifier[];
  private chains: number = 0;
  private last_enemy_hit!: Enemy;
  private original_lifespan: number = 1000;

  public constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "small_bullet");
    this.td_scene = scene as TD;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(25, 25); // set physics body collision size
    this.setActive(false);
    this.setVisible(false);
  }


  public fire(tower_id: string, x: number, y: number, angle: number, range: number, damage: number, projectile_modifiers: SlotProjectileModifier[]): void {
    this.tower_id = tower_id;
    this.setActive(true);
    this.setVisible(true);
    if (!this.mods) this.initialize_mods(projectile_modifiers)
    this.setPosition(x, y);
    this.setRotation(angle - Math.PI / 2); // FIXME(jon): not necessary if proj is round
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    this.body.setVelocity(dx * this.speed, dy * this.speed)
    this.damage = damage;
    this.range = range;
  }

  public update(time: number, delta: number): void {
    this.lifespan -= delta;
    if (this.lifespan <= 0) {
      console.log('BULLET LIFESPAN EXPIRED')
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
    }
  }
/**
 * Returns damage done by hit.
 * 
 * Retargets and refires projectile for certain modifiers (chain).
 */
  public hit(enemy: Enemy): number | null {
    if (enemy === this.last_enemy_hit) return null;

    let still_alive = false;
    if (this.chains > 0) {
      this.lifespan = this.original_lifespan;
      const e = this.findClosestEnemyInRange(this.range, enemy);
      if (e) {
        this.last_enemy_hit = enemy;
        still_alive = true
        this.chains--;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y)
        this.setRotation(angle - Math.PI / 2);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        (this.body as Phaser.Physics.Arcade.Body).setVelocity(dx * this.speed, dy * this.speed);
      } else {
        console.log('NO ENEMY IN CHAIN RANGE')
        this.chains = 0;
        this.lifespan = 0;
      }
    } 
    if (!still_alive) this.destroy();
    return this.damage;
  }

  private initialize_mods(projectile_modifiers: SlotProjectileModifier[] = []) {
    this.mods = projectile_modifiers;
    this.mods.forEach(mod => {
      if (mod.chains) this.chains += mod.chains
    })
  }

  private findClosestEnemyInRange(range: number = 0, current_target: Enemy): Enemy | undefined {
    const enemies = this.td_scene.wave_manager.enemies;
    let closest_enemy: Enemy | undefined;
    let closest_distance = Number.MAX_VALUE;
    for (const e of enemies.getChildren()) {
      if (e === current_target || e === this.last_enemy_hit || !e.active) continue;
      const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
      if (d < range*range && d < closest_distance) {
        closest_distance = d;
        closest_enemy = e;
      }
    }
    return closest_enemy;
  }
}
