import "phaser";

import { GameModel, gameModel } from "../gamelogic/gamemodel";

import type Enemy from "./entities/enemies/enemy";
import type Bullet from "./entities/tower_bullet";

import Turret from "./entities/towers/turret";
import type { SelectionCursor, TowerId, TowerType } from "../gamelogic/td/tower_defense";
import { Path } from "./entities/path";
import { WaveManager } from "./wave_manager";

type Selection = {
  type: TowerType;
  id: TowerId;
  cursor: SelectionCursor;
} | null;

let gameModelInstance: GameModel;
gameModel.subscribe((m) => (gameModelInstance = m));

export default class TD extends Phaser.Scene {
  public path!: Path;
  public path_border!: Path;
  private bg_sprite!: Phaser.GameObjects.TileSprite;
  private path_sprite!: Phaser.GameObjects.TileSprite;
  private path_border_sprite!: Phaser.GameObjects.TileSprite;
  public wave_manager!: WaveManager;

  public selection: Selection | null = null;
  public selected_turret: Turret | null = null;

  private slots: Array<string | null> = [];
  public tower_map: Map<string, Turret> = new Map<string, Turret>();

  public constructor() {
    super({ key: "td", active: true });
  }

  public preload(): void {
    this.load.image("basic", "static/tower/turrets/basic.png");
    this.load.image("machine_gun", "static/tower/turrets/machine_gun.png");

    this.load.image("tower_base_1", "static/tower/bases/base_1.png");
    this.load.image("tower_base_2", "static/tower/bases/base_2.png");
    this.load.image("tower_base_3", "static/tower/bases/base_3.png");
    this.load.image("tower_base_4", "static/tower/bases/base_4.png");

    this.load.image("tower_cover_1", "static/tower/covers/cover_1.png");
    this.load.image("tower_cover_2", "static/tower/covers/cover_2.png");
    this.load.image("tower_cover_3", "static/tower/covers/cover_3.png");
    this.load.image("tower_cover_4", "static/tower/covers/cover_4.png");

    this.load.image("small_bullet", "static/small_bullet.png");
    this.load.image("dirt0", "static/dirt0.png");
    this.load.image("grass0", "static/grass0.png");
    this.load.image("sand0", "static/sand0.png");
    this.load.spritesheet("green_knight", "static/green_knight.png", {
      frameWidth: 20,
      frameHeight: 30,
    });
    this.load.spritesheet("bug", "static/bug.png", {
      frameWidth: 20,
      frameHeight: 26,
    });
    this.load.spritesheet("blue_dragon", "static/blue_dragon.png", {
      frameWidth: 24,
      frameHeight: 30,
    });
    this.load.image('tiles', 'static/towerDefense_tilesheet@2.png')
    this.load.tilemapTiledJSON('map', 'static/map.json')
  }

  public create(): void {

    this.generateAnimations();
    this.drawPath();

    this.setupWaveManager();
    this.setupInputHandlers();
    this.setupTurrets();
    this.setupSelectionSubscription();
  }

  private generateAnimations(): void {
    // Set up animations
    this.anims.create({
      key: "green_knight-walking-down",
      frames: this.anims.generateFrameNames("green_knight", { start: 0, end: 3 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "green_knight-walking-right",
      frames: this.anims.generateFrameNames("green_knight", { start: 4, end: 7 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "green_knight-walking-left",
      frames: this.anims.generateFrameNames("green_knight", { start: 8, end: 11 }),
      frameRate: 3,
      repeat: -1,
    });
    this.anims.create({
      key: "green_knight-walking-up",
      frames: this.anims.generateFrameNames("green_knight", { start: 12, end: 15 }),
      frameRate: 3,
      repeat: -1,
    });

    this.anims.create({
      key: "bug-walking-down",
      frames: this.anims.generateFrameNames("bug", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "bug-walking-right",
      frames: this.anims.generateFrameNames("bug", { start: 2, end: 3 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "bug-walking-left",
      frames: this.anims.generateFrameNames("bug", { start: 4, end: 5 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "bug-walking-up",
      frames: this.anims.generateFrameNames("bug", { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1,
    });

    this.anims.create({
      key: "blue_dragon-walking-down",
      frames: this.anims.generateFrameNames("blue_dragon", { start: 0, end: 1 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "blue_dragon-walking-right",
      frames: this.anims.generateFrameNames("blue_dragon", { start: 2, end: 3 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "blue_dragon-walking-left",
      frames: this.anims.generateFrameNames("blue_dragon", { start: 4, end: 5 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "blue_dragon-walking-up",
      frames: this.anims.generateFrameNames("blue_dragon", { start: 6, end: 7 }),
      frameRate: 2,
      repeat: -1,
    });

  }

  private drawPath(): void {
    const points: integer[][] = [
      [185, -132],
      [185, 450],
      [950, 450],
      [950, 180],
      [575, 180],
      [575, 960],
      [185, 960],
      [185, 700],
      [1670, 700],
      [1670, 1080],
    ];
    // TODO(jon): Would be nice to include the path points in the map json or a related file.
    this.path = new Path(this, points);
    const map = this.add.tilemap('map');
    const tileset = map.addTilesetImage('towerDefense_tilesheet@2', 'tiles');
    const grass = map.createLayer('Grass', tileset)
    const path = map.createLayer('Path', tileset)
    const plants = map.createLayer('Plants', tileset)
    grass.setScale(0.5, 0.5)
    path.setScale(0.5, 0.5)  
    plants.setScale(0.5, 0.5)
  }

  private setupTurrets(): void {
    // Subscribe to model.tower_defense.slots
    // For each id, generate a "turret" using the tower_info from tower_maps,
    // This can happen on initial launch to replace turrets if is_placed is true;
    // Store this list of tower_ids -> turret game objects in a hashmap in td.ts;
    const unsubscribe_store = gameModel.subscribe((model) => {
      model.tower_defense.slots.forEach((model_tower_id, index) => {
        const phaser_slot_tower_id = this.slots[index];
        if (model_tower_id && model_tower_id !== this.slots[index]) {
          // tower was added to slot
          const tower_info = model.tower_defense.getTower(model_tower_id);
          if (tower_info) {
            const new_turret = new Turret(this, model_tower_id, tower_info.status.x, tower_info.status.y, tower_info.status.type);
            if (tower_info.status.is_placed) {
              this.add.existing(new_turret);
              new_turret.place(tower_info.status.x, tower_info.status.y);
            }
            this.tower_map.set(model_tower_id, new_turret);
          }
        } else if (phaser_slot_tower_id && !model_tower_id) {
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

  private setupSelectionSubscription(): void {
    // Subscribe to model.tower_defense.selection
    // When the selection changes from null -> Selection,
    // set the selected tower by finding it in the hashmap by id.
    // if it's not placed, allow it to be placed, otherwise "highlight" the turret.
    let cur_selection: Selection = null;
    const unsubscribe_store = gameModel.subscribe((model) => {
      if (cur_selection !== model.tower_defense.selection) {
        // Selection changed
        cur_selection = model.tower_defense.selection;
        const new_selection_tower_info = model.tower_defense.getTower(cur_selection?.id as TowerId || "");
        const active_selection_tower_info = model.tower_defense.getTower(this.selection?.id as TowerId || "");
        if (cur_selection && this.selection !== cur_selection) {
          // New selection, deselect previously selected turret
          this.selected_turret?.select(false);

          // Hide turret and deselect before updating selection, this allows the user to toggle
          // between multiple unplaced turrets
          if (this.selection && active_selection_tower_info?.status.is_placed == false) {
            this.selected_turret?.setVisible(false);
            this.selected_turret = null;
            this.selection = null;
          } 

          // Update selection
          this.selection = cur_selection;
          if (new_selection_tower_info?.status.is_placed) {
            // selecting tower already placed, highlight range
            // Allows a user to select a tower to see details or take actions
            this.selection.cursor = "selected";
            this.selected_turret = this.tower_map.get(this.selection.id) || null;
            this.selected_turret?.select(true);
          } else {
            // selecting a tower that is not yet placed, make placeable
            // Allows a user to select a tower for placement
            this.selection.cursor = "placement";
            this.selected_turret = this.tower_map.get(this.selection.id) || null;
            if (this.selected_turret) {
              this.add.existing(this.selected_turret);
              this.selected_turret.setVisible(false);
            }
          }
        } else if (cur_selection && this.selection === cur_selection) {
          // reselecting - i don't think this ever happens, you can only toggle selection currently.
        } else if (!cur_selection && this.selection && active_selection_tower_info?.status.is_placed == false) {
          // deselecting unplaced turret, hide gameobject
          // Allows a user to unselect a turret that is currently on their cursor for placement
          this.selected_turret?.select(false);
          this.selected_turret?.setVisible(false);
          this.selected_turret = null;
          this.selection = null;
        } else if (!cur_selection && this.selection && active_selection_tower_info?.status.is_placed) {
          // Deselecting a turret that is already placed
          // Allows a user to deselect a placed turret that was selected to highlight range or take action
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

  private setupWaveManager(): void {
    this.wave_manager = new WaveManager(this, this.path);
  }

  private setupInputHandlers(): void {
    // Place turrets on click, this will be changed to be a drag/drop from a tower menu
    this.input.on("pointerdown", this.selectUnderCursor.bind(this));
    this.input.on("pointerdown", this.placeTurret.bind(this));
    this.input.on('pointermove', this.checkUnderCursor.bind(this));
    this.input.on('pointermove', this.testTurretPlacement.bind(this));
  }

  public update(time: number, delta: number): void {
    // delta = delta * gameModelInstance.tower_defense.time_multiplier;

    this.physics.world.timeScale = 1 / gameModelInstance.tower_defense.time_multiplier;
    this.tweens.timeScale = 1 / gameModelInstance.tower_defense.time_multiplier;
    this.time.timeScale = 1 / gameModelInstance.tower_defense.time_multiplier;
    this.anims.globalTimeScale = 1 / gameModelInstance.tower_defense.time_multiplier;

    delta /= this.physics.world.timeScale;
    this.tower_map.forEach((tower) => tower.update(time, delta));
    this.wave_manager.update(time, delta)
  }

  // TODO(jon): This should track when objects are hovered and not assume it's a tower.
  public checkUnderCursor(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]|Turret[]) {
    if (game_objects_under_pointer.length) {
      document.body.style.cursor = 'pointer';
      for (const obj of game_objects_under_pointer) {
        if ('is_hovered' in obj) obj.is_hovered = true;
      }
    } else {
      document.body.style.cursor = 'auto';
      for (const [key, obj] of this.tower_map) {
        if ('is_hovered' in obj) obj.is_hovered = false;
      }
    }
  }

  public testTurretPlacement(pointer: Phaser.Input.Pointer) {
    if (!this.selection || this.selection.cursor !== 'placement' || !this.selected_turret) return;
    this.selected_turret.setVisible(true);
    this.selected_turret.select();
    this.selected_turret.x = pointer.x;
    this.selected_turret.y = pointer.y;
  }

  public placeTurret(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]): boolean {
    if (!this.selection || this.selection.cursor !== "placement" || !this.selected_turret) return false;
    const place_x = pointer.x;
    const place_y = pointer.y;

    const t = this.selected_turret;
    if (!t.place(place_x, place_y)) {
      return false;
    }
    if (this.selection) {
      gameModelInstance.tower_defense.placeTower(this.selection.id, place_x, place_y);
    }
    this.selection = null;
    gameModelInstance.tower_defense.selection = null;
    return true;
  }

  public selectUnderCursor(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    if (!game_objects_under_pointer.length && this.selected_turret?.is_placed) gameModelInstance.tower_defense.setSelection(null)
    game_objects_under_pointer.forEach(g => {
      if (g.hasOwnProperty('tower_id')) {
        gameModelInstance.tower_defense.setSelection((g as Turret).tower_id)
      }
    })
  }

  public damageEnemy(enemy: Enemy, bullet: Bullet): void {
    // only if both enemy and bullet are alive
    if (enemy.active && bullet.active && enemy.targettable) {
      // debugger;
      // decrease the enemy hp with BULLET_DAMAGE
      const bullet_damage = bullet.hit(enemy); 
      if (!bullet_damage) return;

      const still_alive = enemy.receiveDamage(bullet_damage, gameModelInstance.wallet);
      if (!still_alive) {
        gameModelInstance.tower_defense.recordTowerKill(bullet.tower_id, enemy.name)
      }
      gameModelInstance.tower_defense.recordTowerDamage(bullet.tower_id, bullet_damage)
    }
  }
}
