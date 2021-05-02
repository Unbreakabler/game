import type { SlotProjectileModifier } from "../../gamelogic/td/stats_tower_modifiers";
import type TD from "../td";
import type Enemy from "./enemies/enemy";

const DEFAULT_LIFESPAN = 1000;

export default class Bullet extends Phaser.GameObjects.Image {
  public dx: number = 0;
  public dy: number = 0;
  public lifespan: number = DEFAULT_LIFESPAN;
  public speed: number = 500;
  public damage: number = 0;
  public range: number = 600;
  public tower_id!: string;
  public body!: Phaser.Physics.Arcade.Body;

  private td_scene: TD;
  private mods?: SlotProjectileModifier[];
  private chains: number = 0;
  public last_enemy_hit!: Enemy;
  private original_lifespan: number = DEFAULT_LIFESPAN;

  public constructor(scene: Phaser.Scene) {
    // TODO(jon): create bullet at tower location
    super(scene, 0, 0, "small_bullet");
    this.td_scene = scene as TD;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setSize(100, 100); // large body to improve tunneling at high game speed
    this.setActive(false);
    this.setVisible(false);
  }

  public fire(tower_id: string, x: number, y: number, angle: number, range: number, damage: number, projectile_modifiers: SlotProjectileModifier[]): void {
    this.tower_id = tower_id;
    this.setPosition(x, y);
    this.body.reset(x, y);
    this.initialize_mods(projectile_modifiers)
    this.setRotation(angle - Math.PI / 2); // FIXME(jon): not necessary if proj is round
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    this.body.setVelocity(dx * this.speed, dy * this.speed)
    this.damage = damage;
    this.range = range;
    this.setActive(true);
    this.setVisible(true);
    this.lifespan = this.original_lifespan;
  }

  public update(time: number, delta: number): void {
    this.lifespan -= delta;

    // Check for broad phase AABB swept box collision.
    // We don't need to run a narrow phase check as we are only concerned with the projectile hitting or not hitting.
    // If it hits an enemy next to the "correct" enemy, that is still acceptable and not noticable at high game speeds.
    // The basics of this algorithm are to draw a bounding box surrounding the start and end position of the projectile on every time step.
    // Then check if that bounding box overlaps with any enemy. If it does, the enemy takes damage, the projectile position is reset to the enemy
    // position and simulation continues. If more then one enemy is overlapping, a random selection is made.
    // We don't need to be concerned with calculating the correct projectile position, or rerunning the simulation
    // from the time the collision occured. These small discrepencies will only start happening at high game speeds, at which point the player
    // will not be able to tell that there are slight miscalculations.
    // In order to implement this projectiles and enemies will have their Arcade collision turned off, and the collisions will be manually calculated
    // in the projectile class.
    // This approach should be very fast as we only need to calculate collisions between axis aligned boxes, in fact it should
    // be the roughly the same speed as the Arcade algorithm using AABB as we are essentially running AABB with larger boxes.
    // Enemies should also draw a swept AABB over their delta to which the projectile swept AABB can be compared. For the first version we will
    // attempt to only use swept AABB on projectiles and see how it performs.

    if (this.lifespan <= 0) {
      // console.log('BULLET LIFESPAN EXPIRED', this.chains)
      this.setActive(false);
      this.setVisible(false);
      // this.mods = undefined;
      // this.destroy(); // TODO(jon): Seed the bullet group and stop destroying bullets
    }
  }
/**
 * Returns damage done by hit.
 * 
 * Retargets and refires projectile for certain modifiers (chain).
 */
  public hit(enemy: Enemy): number | null {
    if (enemy === this.last_enemy_hit) return null;
    this.setPosition(enemy.x, enemy.y);
    this.body.reset(enemy.x, enemy.y);
    this.last_enemy_hit = enemy;

    let still_alive = false;
    if (this.chains > 0) {
      const e = this.findClosestEnemyInRange(this.range / 2, enemy);
      if (e) {
        this.lifespan = this.original_lifespan;
        console.log('ATTEMPTED CHAIN')
        still_alive = true
        this.chains--;
        const angle = Phaser.Math.Angle.Between(this.x, this.y, e.x, e.y)
        this.setRotation(angle - Math.PI / 2);
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        this.body.setVelocity(dx * this.speed, dy * this.speed);
      } else {
        console.log('NO CHAIN')
        // const angle = Phaser.Math.Angle.RandomDegrees();
        // this.setRotation(angle - Math.PI / 2);
        // const dx = Math.cos(angle);
        // const dy = Math.sin(angle);
        // this.body.setVelocity(dx * this.speed, dy * this.speed);
        this.lifespan = 0;
        this.chains = 0;
      }
    } 
    if (!still_alive) { this.setActive(false); this.setVisible(false); }
    
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
    for (const e of enemies.getMatching('active', true)) {
      if (e === current_target || e === this.last_enemy_hit) continue;
      const d = Phaser.Math.Distance.Squared(this.x, this.y, e.x, e.y);
      if (d < range*range && d < closest_distance) {
        closest_distance = d;
        closest_enemy = e;
      }
    }
    return closest_enemy;
  }
}
