import "phaser";

import { gameModel } from "../gamelogic/gamemodel";

import type Enemy from "./entities/enemies/enemy"
import type Bullet from "./entities/tower_bullet";

import GreenKnight from "./entities/enemies/green_knight";
import BaseTurret from "./entities/towers/base_turret";

export default class TD extends Phaser.Scene {
  private path: Phaser.Curves.Path | null = null;
  private placement_radius:  Phaser.GameObjects.Arc | null = null;
  private nextEnemy = 0;
  private enemies: Phaser.GameObjects.Group | null = null;
  private turrets: Phaser.GameObjects.Group | null = null;

  private selection: BaseTurret | null = null;

  public constructor() {
    super({ key: 'td', active: true });
  }

  public preload(): void {
    this.load.image('turret', 'static/shotgun.png')
    this.load.image('small_bullet', 'static/small_bullet.png')
    this.load.spritesheet('green-knight', 'static/green_knight.png', {
      frameWidth: 20,
      frameHeight: 29,
  })
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
    this.turrets = this.add.group({ classType: BaseTurret, runChildUpdate: true });
    this.enemies = this.physics.add.group({ classType: GreenKnight, runChildUpdate: true });
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
    this.input.on('pointerdown', this.placeTurret);

    this.input.on('pointermove', this.testTurretPlacement);

    // Get turret info when hovering
    if (this.turrets) {
      this.input.setHitArea(this.turrets.getChildren()).on('pointerover', this.test)
    }
  }

  public update(time: number, delta: number) {  
    // if its time for the next enemy
    if (time > this.nextEnemy && this.enemies) { 
      let enemy = this.enemies.get();
      if (enemy) {
        enemy.setActive(true);
        enemy.setVisible(true);
        // place the enemy at the start of the path
        enemy.startOnPath(this.path);
        this.nextEnemy = time + 2000;
      }
    }
  }

  public test(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    // Update this method to handle selecting an already placed turret
    console.log(pointer, game_objects_under_pointer)
  }

  public testTurretPlacement(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    if (this.scene.selection) {
      this.scene.selection.setVisible(true);
      this.scene.placement_radius.setVisible(true);
      this.scene.selection.x = pointer.x;
      this.scene.selection.y = pointer.y;
      this.scene.placement_radius.x = pointer.x;
      this.scene.placement_radius.y = pointer.y;
      const is_placeable = this.scene.selection.isPlaceable(pointer.x, pointer.y, 32, 32, this.scene.turrets, this.scene.path)
      if (is_placeable) {
        this.scene.placement_radius.setFillStyle(0x00ff00, 0.3);
      } else {
        this.scene.placement_radius.setFillStyle(0xff0000, 0.3);
      }
    }
  }
	
  public placeTurret(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    const place_x = Math.floor(pointer.x);
    const place_y = Math.floor(pointer.y);
    const width:  number = 32; // Default width/height for now, can be changed per tower.
    const height: number = 32
    // NO IDEA why I have to access turrents/path/bullets via `this.scene.` instead of `this.` directly.
    // I think accessing through scene is correct but I'm not sure how to update the type signatures.
    if(this.scene.turrets && this.scene.path && game_objects_under_pointer.length <= 1) {
      const turret = this.scene.selection;
      if (turret) {
        turret.place(place_x, place_y, width, height, this.scene.turrets, this.scene.path);
        turret.enableBulletCollisions(this.scene.enemies)
        this.scene.selection = null;
      }   
    }
  }

  public getEnemy(x: number, y: number, distance: number) {
    if (this.enemies) {
      const enemyUnits = this.enemies.getChildren();
      for(var i = 0; i < enemyUnits.length; i++) {       
          if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) <= distance)
              return enemyUnits[i];
      }
    }
    return false;
  }

  public damageEnemy(enemy: Enemy, bullet: Bullet) {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // we remove the bullet right away
      bullet.setActive(false);
      bullet.setVisible(false);    
      
      // decrease the enemy hp with BULLET_DAMAGE
      enemy.receiveDamage(bullet.damage);
    }
  }
}
