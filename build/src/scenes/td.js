import '../../node_modules/phaser/dist/phaser.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import GreenKnight from './entities/enemies/green_knight.js';
import BaseTurret from './entities/towers/base_turret.js';
import MachineGun from './entities/towers/machine_gun.js';

class TD extends Phaser.Scene {
    constructor() {
        super({ key: "td", active: true });
        this.nextEnemy = 0;
    }
    preload() {
        this.load.image("turret", "static/shotgun.png");
        this.load.image("machine_gun", "static/machine_gun.png");
        this.load.image("small_bullet", "static/small_bullet.png");
        this.load.spritesheet("green-knight", "static/green_knight.png", {
            frameWidth: 329 / 16,
            frameHeight: 30,
        });
    }
    create() {
        this.generateAnimations();
        this.drawPath();
        this.setupEntities();
        this.setupModelSubscriptions();
        this.setupInputHandlers();
    }
    generateAnimations() {
        // Set up animations
        this.anims.create({
            key: 'green-knight-walking-down',
            frames: this.anims.generateFrameNames('green-knight', { start: 0, end: 3 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'green-knight-walking-right',
            frames: this.anims.generateFrameNames('green-knight', { start: 4, end: 7 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'green-knight-walking-left',
            frames: this.anims.generateFrameNames('green-knight', { start: 8, end: 11 }),
            frameRate: 3,
            repeat: -1
        });
        this.anims.create({
            key: 'green-knight-walking-up',
            frames: this.anims.generateFrameNames('green-knight', { start: 12, end: 15 }),
            frameRate: 3,
            repeat: -1
        });
    }
    drawPath() {
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
    setupEntities() {
        // Add gameobject groups for towers and enemies, these manage interactions and collisions
        this.turrets = this.add.group({ classType: BaseTurret, runChildUpdate: true });
        this.machine_guns = this.add.group({ classType: MachineGun, runChildUpdate: true });
        this.enemies = this.add.group({ classType: GreenKnight, runChildUpdate: true });
        this.placement_radius = this.add.circle(100, 100, this.selection?.range, 0xff0000, 0.5);
    }
    setupModelSubscriptions() {
        const unsubscribe_store = gameModel.subscribe((model) => {
            if (model.tower_defense.selection === 'basic') {
                this.selection = this.turrets?.get();
                if (this.selection) {
                    this.placement_radius?.setRadius(this.selection.range);
                }
            }
            else if (model.tower_defense.selection === 'machine_gun') {
                this.selection = this.machine_guns?.get();
                if (this.selection) {
                    this.placement_radius?.setRadius(this.selection.range);
                }
            }
            else {
                this.placement_radius?.setVisible(false);
                this.selection?.setVisible(false);
                this.selection = null;
            }
            this.selection?.setActive(false);
        });
        this.events.on("destroy", function () {
            unsubscribe_store();
        });
    }
    setupInputHandlers() {
        // Place turrets on click, this will be changed to be a drag/drop from a tower menu
        this.input.on("pointerdown", this.placeTurret.bind(this));
        this.input.on('pointermove', this.testTurretPlacement.bind(this));
        // Get turret info when hovering
        // if (this.turrets) {
        //   this.input.setHitArea(this.turrets.getChildren()).on('pointerover', this.test)
        // }
    }
    update(time, delta) {
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
    testTurretPlacement(pointer, game_objects_under_pointer) {
        if (!this.selection)
            return;
        this.selection.setVisible(true);
        this.placement_radius.setVisible(true);
        this.selection.x = pointer.x;
        this.selection.y = pointer.y;
        this.placement_radius.x = pointer.x;
        this.placement_radius.y = pointer.y;
        const is_placeable = this.selection.isPlaceable(pointer.x, pointer.y, 32, 32, this.turrets, this.path);
        if (is_placeable) {
            this.placement_radius.setFillStyle(0x00ff00, 0.3);
        }
        else {
            this.placement_radius.setFillStyle(0xff0000, 0.3);
        }
    }
    placeTurret(pointer, game_objects_under_pointer) {
        if (!this.selection)
            return false;
        const place_x = Math.floor(pointer.x);
        const place_y = Math.floor(pointer.y);
        const width = 32; // Default width/height for now, can be changed per tower.
        const height = 32;
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
    damageEnemy(enemy, bullet) {
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // we remove the bullet right away
            bullet.destroy();
            // decrease the enemy hp with BULLET_DAMAGE
            enemy.receiveDamage(bullet.damage);
        }
    }
}

export default TD;
//# sourceMappingURL=td.js.map
