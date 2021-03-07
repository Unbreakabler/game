import '../../node_modules/phaser/dist/phaser.js';
import { gameModel } from '../gamelogic/gamemodel.js';
import GreenKnight from './entities/enemies/green_knight.js';
import Turret from './entities/towers/turret.js';

let gameModelInstance;
gameModel.subscribe((m) => (gameModelInstance = m));
class TD extends Phaser.Scene {
    constructor() {
        super({ key: "td", active: true });
        this.nextEnemy = 0;
        this.selection = null;
        this.selected_turret = null;
        this.slots = [];
        this.tower_map = new Map();
    }
    preload() {
        this.load.image("basic", "static/shotgun.png");
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
        // this.setupModelSubscriptions();
        this.setupInputHandlers();
        this.newTurretManagement();
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
    newTurretManagement() {
        // Subscribe to model.tower_defense.slots
        // For each id, generate a "turret" using the tower_info from tower_maps,
        // This can happen on initial launch to replace turrets if is_placed is true;
        // Store this list of tower_ids -> turret game objects in a hashmap in td.ts;
        this.setupTurrets();
        // Subscribe to model.tower_defense.selection
        // When the selection changes from null -> Selection,
        // set the selected tower by finding it in the hashmap by id.
        // if it's not placed, allow it to be placed, otherwise "highlight" the turret.
        this.setupSelection();
    }
    setupTurrets() {
        const unsubscribe_store = gameModel.subscribe((model) => {
            model.tower_defense.slots.forEach((model_tower_id, index) => {
                const phaser_slot_tower_id = this.slots[index];
                if (model_tower_id && model_tower_id !== this.slots[index]) {
                    // tower was added to slot
                    const tower_info = model.tower_defense.getTower(model_tower_id);
                    if (tower_info) {
                        const new_turret = new Turret(this, model_tower_id, tower_info.x, tower_info.y, tower_info.type);
                        if (tower_info.is_placed) {
                            this.add.existing(new_turret);
                            new_turret.place(tower_info.x, tower_info.y);
                        }
                        this.tower_map.set(model_tower_id, new_turret);
                    }
                }
                else if (phaser_slot_tower_id && !model_tower_id) {
                    // slot was cleared from the bar, destroy tower
                    this.tower_map.get(phaser_slot_tower_id);
                }
            });
            this.slots = model.tower_defense.slots;
        });
        this.events.on("destroy", function () {
            unsubscribe_store();
        });
    }
    setupSelection() {
        let cur_selection = null;
        const unsubscribe_store = gameModel.subscribe((model) => {
            // get the turret by id, if the turret is placed, highlight it
            // if the turret is not placed, get a new turret and put it on cursor
            if (cur_selection !== model.tower_defense.selection) {
                cur_selection = model.tower_defense.selection;
                const new_selection_tower_info = model.tower_defense.getTower(cur_selection?.id || '');
                const active_selection_tower_info = model.tower_defense.getTower(this.selection?.id || '');
                if (cur_selection && this.selection !== cur_selection) {
                    if (this.selected_turret) {
                        this.selected_turret.is_selected = false;
                    }
                    if (this.selection && active_selection_tower_info?.is_placed == false) {
                        if (this.selected_turret) {
                            this.selected_turret.setVisible(false);
                        }
                        this.selected_turret = null;
                        this.selection = null;
                    }
                    this.selection = cur_selection;
                    if (new_selection_tower_info?.is_placed) {
                        console.log('SELECT PLACED TURRET');
                        // selecting tower already placed
                        this.selection.cursor = 'selected';
                        this.selected_turret = this.tower_map.get(this.selection.id) || null;
                        if (this.selected_turret) {
                            this.selected_turret.is_selected = true;
                        }
                    }
                    else {
                        console.log('SELECT UNPLACED TURRET');
                        // selecting a tower that is not yet placed
                        this.selection.cursor = 'placement';
                        this.selected_turret = this.tower_map.get(this.selection.id) || null;
                        if (this.selected_turret) {
                            this.add.existing(this.selected_turret);
                            this.selected_turret.setVisible(false);
                        }
                    }
                }
                else if (cur_selection && this.selection === cur_selection) {
                    // reselecting - i don't think this ever happens, you can only toggle selection currently.
                    console.log('RESELECT TURRET');
                }
                else if (!cur_selection && this.selection && active_selection_tower_info?.is_placed == false) {
                    // deselecting unplaced turret
                    console.log('DESELECT UNPLACED TURRET');
                    if (this.selected_turret) {
                        this.selected_turret.is_selected = false;
                        this.selected_turret.setVisible(false);
                    }
                    this.selected_turret = null;
                    this.selection = null;
                }
                else if (!cur_selection && this.selection && active_selection_tower_info?.is_placed) {
                    console.log('DESELECT PLACED TURRET');
                    if (this.selected_turret) {
                        this.selected_turret.is_selected = false;
                    }
                    this.selected_turret = null;
                    this.selection = null;
                }
            }
        });
        this.events.on("destroy", function () {
            unsubscribe_store();
        });
    }
    setupEntities() {
        // Add gameobject groups enemies, these manage interactions and collisions
        this.enemies = this.add.group({ classType: GreenKnight, runChildUpdate: true });
    }
    setupInputHandlers() {
        // Place turrets on click, this will be changed to be a drag/drop from a tower menu
        this.input.on("pointerdown", this.selectUnderCursor.bind(this));
        this.input.on("pointerdown", this.placeTurret.bind(this));
        this.input.on('pointermove', this.testTurretPlacement.bind(this));
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
        this.tower_map.forEach((tower, key) => {
            if (tower.is_placed) {
                tower.update(time, delta);
            }
        });
    }
    testTurretPlacement(pointer, game_objects_under_pointer) {
        if (!this.selection || this.selection.cursor !== 'placement' || !this.selected_turret)
            return;
        this.selected_turret.setVisible(true);
        this.selected_turret.is_selected = true;
        this.selected_turret.x = pointer.x;
        this.selected_turret.y = pointer.y;
    }
    placeTurret(pointer, game_objects_under_pointer) {
        if (!this.selection || this.selection.cursor !== 'placement' || !this.selected_turret)
            return false;
        const place_x = Math.floor(pointer.x);
        const place_y = Math.floor(pointer.y);
        const t = this.selected_turret;
        if (!t.place(place_x, place_y)) {
            return false;
        }
        if (gameModelInstance.tower_defense.selection) {
            gameModelInstance.tower_defense.placeTower(gameModelInstance.tower_defense.selection.id, place_x, place_y);
        }
        this.selection = null;
        gameModelInstance.tower_defense.selection = null;
        return true;
    }
    selectUnderCursor(pointer, game_objects_under_pointer) {
        // broadcast game object out of phaser to game model
        // in order to do this the game objects real state should be stored in svelte/js instead of phaser
        // and then a "selected" flag or similar should be toggled by this method.
        // This means creating and managing a player inventory of towers.
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
