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
    this.load.image("basic", "static/shotgun.png");
    this.load.image("machine_gun", "static/machine_gun.png");
    this.load.image("small_bullet", "static/small_bullet.png");
    this.load.image("dirt0", "static/dirt0.png");
    this.load.image("grass0", "static/grass0.png");
    this.load.image("sand0", "static/sand0.png");
    this.load.spritesheet("green_knight", "static/green_knight.png", {
      frameWidth: 20,
      frameHeight: 30,
    });
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
  }

  private drawPath(): void {
    const points: integer[][] = [
      [96, -32],
      [96, 264],
      [500, 264],
      [500, 114],
      [300, 114],
      [300, 514],
      [96, 514],
      [96, 380],
      [850, 380],
    ];

    this.path = new Path(this, points);
    this.path_border = new Path(this, points, 34);

    this.bg_sprite = this.add.tileSprite(0, 0, 800, 600, "grass0");
    this.bg_sprite.setOrigin(0, 0);
    this.path_border_sprite = this.add.tileSprite(0, 0, 800, 600, "sand0");
    this.path_border_sprite.setOrigin(0, 0);
    this.path_sprite = this.add.tileSprite(0, 0, 800, 600, "dirt0");
    this.path_sprite.setOrigin(0, 0);
    this.path_sprite.setMask(this.path.graphics.createGeometryMask());
    this.path_border_sprite.setMask(this.path_border.graphics.createGeometryMask());
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
    this.tower_map.forEach((tower) => tower.update(time, delta));
    this.wave_manager.update(time, delta)
  }

  public checkUnderCursor(pointer: Phaser.Input.Pointer, game_objects_under_pointer: Phaser.GameObjects.GameObject[]) {
    if (game_objects_under_pointer.length) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'auto';
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
    const place_x = Math.floor(pointer.x);
    const place_y = Math.floor(pointer.y);

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
    if (!game_objects_under_pointer.length) gameModelInstance.tower_defense.setSelection(null)
    game_objects_under_pointer.forEach(g => {
      if (g.hasOwnProperty('tower_id')) {
        gameModelInstance.tower_defense.setSelection((g as Turret).tower_id)
      }
    })
  }

  public damageEnemy(enemy: Enemy, bullet: Bullet): void {
    // only if both enemy and bullet are alive
    if (enemy.active === true && bullet.active === true) {
      // decrease the enemy hp with BULLET_DAMAGE
      const bullet_damage = bullet.hit(enemy);
      if (!bullet_damage) return;

      const still_alive = enemy.receiveDamage(bullet_damage, gameModelInstance.wallet);
      if (!still_alive) {
        gameModelInstance.tower_defense.recordTowerKill(bullet.tower_id, enemy.name)
        gameModelInstance.tower_defense.current_wave_info.alive--;
      }
      // gameModelInstance.tower_defense.recordTowerDamage(bullet.tower_id, bullet_damage, still_alive)
    }
  }
}
