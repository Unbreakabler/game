import "phaser";

import { gameModel } from "../gamelogic/gamemodel";

import type Enemy from "./entities/enemies/enemy";
import type Bullet from "./entities/tower_bullet";

import GreenKnight from "./entities/enemies/green_knight";
import BaseTurret from "./entities/towers/base_turret";
import type Turret from "./entities/towers/turret";

export default class TD extends Phaser.Scene {
  public path!: Phaser.Curves.Path;
  private placement_radius!:  Phaser.GameObjects.Arc;
  private nextEnemy = 0;
  public enemies!: BetterGroup<Enemy>;
  public turrets!: BetterGroup<Turret>;
  public selection!: Turret | null;

  public constructor() {
    super({ key: "td", active: true });
  }

  public preload(): void {
    this.load.image("turret", "static/shotgun.png");
    this.load.image("small_bullet", "static/small_bullet.png");
    this.load.spritesheet("green-knight", "static/green_knight.png", {
      frameWidth: 20,
      frameHeight: 29,
    });
  }

  public create(): void {
    this.generateAnimations();
    this.drawPath();
    this.setupEntities();
    this.setupModelSubscriptions();
    this.setupInputHandlers();

  }

  private generateAnimations() {
    // Set up animations
    this.anims.create({
      key: 'green-knight-walking',
      frames: this.anims.generateFrameNames('green-knight', {start: 0, end: 3}),
      frameRate: 3,
      repeat: -1
    })
  }

  private drawPath() {
    const graphics = this.add.graphics();    
    
    // The path for the current level, the coorodinates should be stored as a list
    // of tuples and be loaded on level start.
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 264);
    this.path.lineTo(500, 264);
    this.path.lineTo(500, 114);
    this.path.lineTo(300, 114);
    this.path.lineTo(300, 514);
    this.path.lineTo(96, 514);
    this.path.lineTo(96, 380);
    this.path.lineTo(850, 380);

    // This will be swapped out for tiles eventually but for now we'll draw a white line.
    graphics.lineStyle(3, 0xffffff, 1);
    this.path.draw(graphics);
  }

  private setupEntities() {
    // Add gameobject groups for towers and enemies, these manage interactions and collisions
    this.turrets = this.add.group({ classType: BaseTurret, runChildUpdate: true }) as BetterGroup<Turret>;
    this.enemies = this.add.group({ classType: GreenKnight, runChildUpdate: true }) as BetterGroup<Enemy>;
    this.placement_radius = this.add.circle(100, 100, this.selection?.range, 0xff0000, 0.5);
  }

  private setupModelSubscriptions() {
    const unsubscribe_store = gameModel.subscribe((model) => {
      if (model.tower_defense.selection == 'basic') {
        this.selection = this.turrets?.get()
        if (this.selection) {
          this.placement_radius?.setRadius(this.selection.range)
          // this.selection?.setVisible(false);
        }
      } else {
        this.placement_radius?.setVisible(false);
        this.selection?.setVisible(false);
        this.selection = null
      }
      this.selection?.setActive(false);
    });
    this.events.on("destroy", function () {
      unsubscribe_store();
    });
  }

  private setupInputHandlers() {
    // Place turrets on click, this will be changed to be a drag/drop from a tower menu
    this.input.on("pointerdown", this.placeTurret.bind(this));

    this.input.on('pointermove', this.testTurretPlacement.bind(this));

    // Get turret info when hovering
    // if (this.turrets) {
    //   this.input.setHitArea(this.turrets.getChildren()).on('pointerover', this.test)
    // }
  }

  public update(time: number, delta: number): void {
    // if its time for the next enemy
    if (time > this.nextEnemy) {
      const enemy = new GreenKnight(this);
      this.enemies.add(enemy, true);
      // place the enemy at the start of the path
      enemy.startOnPath(this.path);
      this.nextEnemy = time + 2000;
    }
  }

  // public test(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]): void {
  //   console.log(pointer, game_objects_under_pointer);
  // }

  public testTurretPlacement(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    if (!this.selection) return;
    this.selection.setVisible(true);
    this.placement_radius.setVisible(true);
    this.selection.x = pointer.x;
    this.selection.y = pointer.y;
    this.placement_radius.x = pointer.x;
    this.placement_radius.y = pointer.y;
    const is_placeable = this.selection.isPlaceable(pointer.x, pointer.y, 32, 32, this.turrets, this.path)
    if (is_placeable) {
      this.placement_radius.setFillStyle(0x00ff00, 0.3);
    } else {
      this.placement_radius.setFillStyle(0xff0000, 0.3);
    }
  }

  public placeTurret(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]): boolean {
    if (!this.selection) return false;
    const place_x = Math.floor(pointer.x);
    const place_y = Math.floor(pointer.y);
    const width: number = 32; // Default width/height for now, can be changed per tower.
    const height: number = 32;
    // NO IDEA why I have to access turrents/path/bullets via `this.scene.` instead of `this.` directly.
    // I think accessing through scene is correct but I'm not sure how to update the type signatures.
    if (game_objects_under_pointer.length === 0) {
      const t = new BaseTurret(this);
      if (!t.place(place_x, place_y, width, height)) {
        t.destroy();
        return false;
      }
      this.turrets.add(t, true);
      t.enableBulletCollisions(this.enemies);
      return true;
    }
    return false;
  }

  public damageEnemy(enemy: Enemy, bullet: Bullet): void {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away
      bullet.destroy();

      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(bullet.damage);
    }
  }
}
