import "phaser";

import Enemy from "./entities/enemy"
import Turret from "./entities/tower";
import Bullet from "./entities/tower_bullet";

export default class TD extends Phaser.Scene {
  private path: Phaser.Curves.Path | null = null;
  private nextEnemy = 0;
  private enemies: Phaser.GameObjects.Group | null = null;
  private turrets: Phaser.GameObjects.Group | null = null;
  private bullets: Phaser.GameObjects.Group | null = null;

  public constructor() {
    super({ key: 'td', active: true });
  }

  public preload(): void {
    this.load.image('turret', 'static/shotgun.png')
    this.load.image('small_bullet', 'static/small_bullet.png')
    // this.load.image('shotgun')
    this.load.spritesheet('green-knight', 'static/green_knight.png', {
      frameWidth: 20,
      frameHeight: 29,
  })
  }

  public create(): void {
    const graphics = this.add.graphics();    
    
    // the path for our enemies
    // parameters are the start x and y of our path
    this.path = this.add.path(96, -32);
    this.path.lineTo(96, 164);
    this.path.lineTo(500, 164);
    this.path.lineTo(500, 644);
    
    graphics.lineStyle(3, 0xffffff, 1);
    // visualize the path
    this.path.draw(graphics);

    this.anims.create({
      key: 'green-knight-idle',
      frames: this.anims.generateFrameNames('green-knight', {start: 0, end: 3}),
      frameRate: 3,
      repeat: -1
    })

    this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy);

    this.input.on('pointerdown', this.placeTurret);
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
	
  public placeTurret(pointer: Phaser.Input.Pointer) {
    const place_y = Math.floor(pointer.y);
    const place_x = Math.floor(pointer.x);
    const width:  number = 32; // Default width/height for now, can be changed per tower.
    const height: number = 32
    // NO IDEA why I have to access turrents/path/bullets via this.scene instead of this. directly.
    if(this.scene.turrets && this.scene.path) {
      const turret = this.scene.turrets.get();
      if (turret) {
        turret.place(place_y, place_x, height, width, this.scene.turrets, this.scene.path, this.scene.bullets);
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
