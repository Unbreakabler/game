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
        this.delta_to_next_enemy = 0;
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
                    const turret_to_delete = this.tower_map.get(phaser_slot_tower_id);
                    if (this.selected_turret == turret_to_delete) {
                        this.selected_turret = null;
                    }
                    turret_to_delete?.destroy();
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
            if (cur_selection !== model.tower_defense.selection) {
                // Selection changed
                cur_selection = model.tower_defense.selection;
                const new_selection_tower_info = model.tower_defense.getTower(cur_selection?.id || '');
                const active_selection_tower_info = model.tower_defense.getTower(this.selection?.id || '');
                if (cur_selection && this.selection !== cur_selection) {
                    // New selection, deselect previously selected turret
                    this.selected_turret?.select(false);
                    // Hide turret and deselect before updating selection, this allows the user to toggle
                    // between multiple unplaced turrets
                    if (this.selection && active_selection_tower_info?.is_placed == false) {
                        if (this.selected_turret) {
                            this.selected_turret.setVisible(false);
                        }
                        this.selected_turret = null;
                        this.selection = null;
                    }
                    // Update selection
                    this.selection = cur_selection;
                    if (new_selection_tower_info?.is_placed) {
                        // selecting tower already placed, highlight range
                        // Allows a user to select a tower to see details or take actions
                        console.log('SELECT PLACED TURRET');
                        this.selection.cursor = 'selected';
                        this.selected_turret = this.tower_map.get(this.selection.id) || null;
                        this.selected_turret?.select(true);
                    }
                    else {
                        // selecting a tower that is not yet placed, make placeable
                        // Allows a user to select a tower for placement
                        console.log('SELECT UNPLACED TURRET');
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
                    // deselecting unplaced turret, hide gameobject
                    // Allows a user to unselect a turret that is currently on their cursor for placement
                    console.log('DESELECT UNPLACED TURRET');
                    if (this.selected_turret) {
                        this.selected_turret?.select(false);
                        this.selected_turret.setVisible(false);
                    }
                    this.selected_turret = null;
                    this.selection = null;
                }
                else if (!cur_selection && this.selection && active_selection_tower_info?.is_placed) {
                    // Deselecting a turret that is already placed
                    // Allows a user to deselect a placed turret that was selected to highlight range or take action
                    console.log('DESELECT PLACED TURRET');
                    this.selected_turret?.select(false);
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
        this.delta_to_next_enemy -= delta;
        if (this.delta_to_next_enemy <= 0) {
            const enemy = this.enemies.get();
            // place the enemy at the start of the path
            enemy.startOnPath(this.path);
            this.delta_to_next_enemy = 2000;
        }
        this.tower_map.forEach(tower => tower.update(time, delta));
    }
    testTurretPlacement(pointer, game_objects_under_pointer) {
        if (!this.selection || this.selection.cursor !== 'placement' || !this.selected_turret)
            return;
        this.selected_turret.setVisible(true);
        this.selected_turret.select();
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
        if (!game_objects_under_pointer.length)
            gameModelInstance.tower_defense.setSelection(null);
        game_objects_under_pointer.forEach(g => {
            if (g.hasOwnProperty('tower_id')) {
                gameModelInstance.tower_defense.setSelection(g.tower_id);
            }
        });
        // broadcast game object out of phaser to game model
        // in order to do this the game objects real state should be stored in svelte/js instead of phaser
        // and then a "selected" flag or similar should be toggled by this method.
        // This means creating and managing a player inventory of towers.
    }
    damageEnemy(enemy, bullet) {
        // only if both enemy and bullet are alive
        if (enemy.active === true && bullet.active === true) {
            // decrease the enemy hp with BULLET_DAMAGE
            const bullet_damage = bullet.hit();
            gameModelInstance.tower_defense.recordTowerDamage(bullet.tower_id, bullet_damage);
            const still_alive = enemy.receiveDamage(bullet_damage);
            if (still_alive)
                return;
            gameModelInstance.tower_defense.recordTowerKill(bullet.tower_id, enemy.name);
        }
    }
}

export default TD;
//# sourceMappingURL=td.js.map
