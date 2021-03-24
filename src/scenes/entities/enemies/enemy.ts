import type TD from "../../td";
import { CombatText } from '../combat_text';
import { HealthBar } from '../health_bar';
import { EnemyModifier, ENEMY_MODIFIERS, ModifierId } from '../../../gamelogic/td/enemy_wave_generator'

const DEFAULT_ENEMY_SPEED = 1 / 10;
const DEFAULT_ENEMY_HP = 100;

// TODO(jon): show health bar when hp is below 100%
// TODO(jon): show floating combat text when an enemy takes damage.
// potentially also show the combat text on the tower? probably at least show the log when you select the tower.

export default class Enemy extends Phaser.GameObjects.Sprite {
  public follower: { t: number; vec: Phaser.Math.Vector2 };
  public health_points = DEFAULT_ENEMY_HP;
  public name: string;

  private path: Phaser.Curves.Path | null = null;
  private speed: number = DEFAULT_ENEMY_SPEED;
  private original_speed: number;
  private original_health_points: number;
  private sprite_name: string;
  private prev_ang: number = 0;
  private td_scene: TD;
  private health_bar: HealthBar;
  private modifiers: EnemyModifier[] = [];
  private difficulty: number = 0;

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
    this.td_scene = td_scene;
    this.sprite_name = sprite_name;
    this.name = this.sprite_name // Likely the enemy name and sprite_name will differ in future
    this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
    this.speed = speed || DEFAULT_ENEMY_SPEED;
    this.original_speed = this.speed;
    this.health_points = health_points;
    this.original_health_points = this.health_points; // health_points will need to be set for each enemy
    this.setActive(true);
    // this.setVisible(true);

    this.health_bar = new HealthBar(td_scene, x, y - this.height, this.width, this.health_points)
  }

  // Allows reuse of enemy sprites
  private resetEnemy(): void {
    if (!this.path) return;
    if (!this.speed) this.speed = DEFAULT_ENEMY_SPEED;
    // this.setActive(true);
    this.setVisible(true);
    // set the t parameter at the start of the path
    this.follower.t = 0;

    // get x and y of the given t point
    this.path.getPoint(this.follower.t, this.follower.vec);

    // set the x and y of our enemy to the received from the previous step
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    this.health_points = this.original_health_points;
    this.speed = this.original_speed;
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
    this.original_speed = this.speed;
  }

  public setName(name: string): this {
    this.name = name;
    this.sprite_name = name;
    return this;
  }

  public setHealthPoints(health_points: number): void {
    this.health_points = health_points;
    this.original_health_points = this.health_points;
  }

  public setDifficulty(difficulty: number): void {
    this.difficulty = difficulty;
  }

  public setModifiers(modifiers: string[]): void {
    // this.modifiers = modifiers;
    // reset to display height/width to original size
    this.displayHeight = this.height
    this.displayWidth = this.width

    for (let i = 0; i < modifiers.length; i ++) {
      const mod = ENEMY_MODIFIERS[modifiers[i] as ModifierId]
      if (!mod) return
      this.modifiers[i] = mod
      // group mods have already affected group size, skip, should be removed from list.
      if (mod.mod_type === 'group') continue;


      if (mod.stat_multipliers?.health_points) {
        this.original_health_points *= mod.stat_multipliers.health_points
        this.health_points *= mod.stat_multipliers.health_points
      }

      if (mod.stat_multipliers?.movement_speed) {
        this.setSpeed(this.speed * mod.stat_multipliers.movement_speed)
      }

      if (mod.visual_modifiers?.height) {
        this.displayHeight *= mod.visual_modifiers.height
      }

      if (mod.visual_modifiers?.width) {
        this.displayWidth *= mod.visual_modifiers?.width
      }
      
    }
  }

  public startOnPath(path: Phaser.Curves.Path): void {
    this.path = path;
    this.resetEnemy();
  }

  public update(time: number, delta: number): void {
    // move the t point along the path, 0 is the start and 0 is the end
    if (!this.path) return; // skip updates if path has not be set by startOnPath
    this.health_bar.setCurrentHp(this.health_points)
    this.health_bar.setPosition(this.x, this.y - this.height)
    this.follower.t += (this.speed / this.path.getLength()) * delta;

    // get the new x and y coordinates in vec
    this.path.getPoint(this.follower.t, this.follower.vec);
    
    // angle between 0 and 2*PI
    const ang = Phaser.Math.Angle.Between(this.x, this.y, this.follower.vec.x, this.follower.vec.y) + Math.PI;
    if (ang != this.prev_ang) {
      if (ang < 1/4 * Math.PI || ang >= 7/4 * Math.PI) {
        // right
        this.anims.play(`${this.sprite_name}-walking-left`, true)
      } else if (ang < 7/4 * Math.PI && ang >= 5/4 * Math.PI) {
        // down
        this.anims.play(`${this.sprite_name}-walking-down`, true)
      } else if (ang < 5/4 * Math.PI && ang >= 3/4 * Math.PI) {
        // left
        this.anims.play(`${this.sprite_name}-walking-right`, true)
      } else if (ang < 3/4 * Math.PI && ang >= 1/4 * Math.PI) {
        // up
        this.anims.play(`${this.sprite_name}-walking-up`, true)
      }
    }
    this.prev_ang = ang;

    // update enemy x and y to the newly obtained x and y
    this.setPosition(this.follower.vec.x, this.follower.vec.y);
    // We should probably add a small amount of left/right movement based on the forward vector so that every
    // enemy isn't following an identical path

    // if we have reached the end of the path, remove the enemy
    if (this.follower.t >= 1) {
      this.setActive(false);
      this.setVisible(false);
      this.destroy();
      this.td_scene.wave_manager.recordEnemyLeak();
    }
  }

  public preDestroy() {
    this.health_bar.destroy();
  }

  public receiveDamage(damage: number): boolean {
    this.health_points -= damage;
    // combat text is self managed and destroys itself from the scene after it's lifespan (default 250ms) has expired.
    // Generates a new floating combat text instance for each instance of damage
    new CombatText(this.td_scene, this.x, this.y - this.height, `${damage}`);
    if (this.health_points > 0) return true;
    this.setActive(false);
    this.setVisible(false);
    this.destroy();
    return false;
  }
}
