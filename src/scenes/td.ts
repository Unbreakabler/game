import "phaser";

import { gameModel } from "../gamelogic/gamemodel";

import type Enemy from "./entities/enemies/enemy";
import type Bullet from "./entities/tower_bullet";

import GreenKnight from "./entities/enemies/green_knight";
import BaseTurret from "./entities/towers/base_turret";
import MachineGun from "./entities/towers/machine_gun";
import type Turret from "./entities/towers/turret";

export default class TD extends Phaser.Scene {
  public path!: Phaser.Curves.Path;
  private placement_radius!:  Phaser.GameObjects.Arc;
  private nextEnemy = 0;
  public enemies!: BetterGroup<Enemy>;
  public turrets!: BetterGroup<Turret>;
  public machine_guns!: BetterGroup<MachineGun>;
  public selection!: Turret | null;
  private selection_type: string | null = null;

  public constructor() {
    super({ key: "td", active: true });
  }

  public preload(): void {
    this.load.image("turret", "static/shotgun.png");
    this.load.image("machine_gun", "static/machine_gun.png");
    this.load.image("small_bullet", "static/small_bullet.png");
    this.load.spritesheet("green-knight", "static/green_knight.png", {
      frameWidth: 329/16,
      frameHeight: 30,
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
      key: 'green-knight-walking-down',
      frames: this.anims.generateFrameNames('green-knight', {start: 0, end: 3}),
      frameRate: 3,
      repeat: -1
    })
    this.anims.create({
      key: 'green-knight-walking-right',
      frames: this.anims.generateFrameNames('green-knight', {start: 4, end: 7}),
      frameRate: 3,
      repeat: -1
    })
    this.anims.create({
      key: 'green-knight-walking-left',
      frames: this.anims.generateFrameNames('green-knight', {start: 8, end: 11}),
      frameRate: 3,
      repeat: -1
    })
    this.anims.create({
      key: 'green-knight-walking-up',
      frames: this.anims.generateFrameNames('green-knight', {start: 12, end: 15}),
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
    this.machine_guns = this.add.group({ classType: MachineGun, runChildUpdate: true }) as BetterGroup<Turret>;
    this.enemies = this.add.group({ classType: GreenKnight, runChildUpdate: true }) as BetterGroup<Enemy>;
    this.placement_radius = this.add.circle(100, 100, this.selection?.range, 0xff0000, 0.5);
    this.placement_radius.setVisible(false);
  }

  private setupModelSubscriptions() {
    const unsubscribe_store = gameModel.subscribe((model) => {    
      if (model.tower_defense.selection !== this.selection_type) {
        this.selection?.destroy();
        if (model.tower_defense.selection === 'basic') {
          this.selection = this.turrets?.get();
        } else if (model.tower_defense.selection === 'machine_gun') {
          this.selection = this.machine_guns?.get();
        } else {
          this.selection = null
        }
        if (this.selection) {
          this.placement_radius.setRadius(this.selection.range)
        }

        this.placement_radius.setVisible(false);
        this.selection?.setVisible(false);
        this.selection?.setActive(false);
        this.selection_type = model.tower_defense.selection
      }
    });
    this.events.on("destroy", function () {
      unsubscribe_store();
    });
  }

  private setupInputHandlers() {
    // Place turrets on click, this will be changed to be a drag/drop from a tower menu
    this.input.on("pointerdown", this.selectUnderCursor.bind(this));
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
    
    if (game_objects_under_pointer.length === 0) {
      const t = this.selection;
      if (!t.place(place_x, place_y, width, height)) {
        t.destroy();
        return false;
      }
      this.turrets.add(t, true);
      t.enableBulletCollisions(this.enemies);
      this.selection = null;
      return true;
    }
    return false;
  }

  public selectUnderCursor(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    // broadcast game object out of phaser to game model
    // in order to do this the game objects real state should be stored in svelte/js instead of phaser
    // and then a "selected" flag or similar should be toggled by this method.
    // This means creating and managing a player inventory of towers.
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
