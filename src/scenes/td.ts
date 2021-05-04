import "phaser";

import { GameModel, gameModel } from "../gamelogic/gamemodel";

import type { SelectionCursor, TowerId, TowerType } from "../gamelogic/td/tower_defense";
import { Path } from "./entities/path";
import { WaveManager } from "./wave_manager";

import Tower from "./entities/towers/tower";
import generate_animations from "./setup/setup_animations";
import setup_image_assets from "./setup/setup_image_assets";

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
  public wave_manager!: WaveManager;

  public selection: Selection = null;
  public prev_selection: Selection = null;

  public new_tower_map: Map<string, Tower> = new Map<string, Tower>();

  public constructor() {
    super({ key: "td", active: true });
  }

  public preload(): void {
    setup_image_assets(this);
  }

  public create(): void {
    generate_animations(this);

    this.drawPath();
    this.wave_manager = new WaveManager(this, this.path);

    this.bindTowerModels();
  }

  private bindTowerModels() {
    gameModelInstance.tower_defense.slots.forEach(slot_id => {
      if (slot_id) {
        const tower = gameModelInstance.tower_defense.getTower(slot_id);
        if (tower) {
          const new_tower = new Tower(this, tower);
          if (tower.status.is_placed) {
            new_tower.place(tower.status.x, tower.status.y);
          }
          this.new_tower_map.set(tower.status.id, new_tower)
        }
      } 
    })
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

  public update(time: number, delta: number): void {
    if (gameModelInstance.tower_defense.time_multiplier === 0) {
      this.physics.pause();
    } else if (this.physics){
      this.physics.resume();
    }

    for (let i = 0; i < gameModelInstance.tower_defense.time_multiplier; i++) {
      this.physics.world.step(delta / 1000);
      this.wave_manager.update(time, delta)
      this.new_tower_map.forEach(t => t.update(time, delta));
    }

    this.updateSelectionHandling();
  }

  private updateSelectionHandling() {
    // Selection handling - Should be moved into the tower class
    this.selection = gameModelInstance.tower_defense.selection;
    let tower, prev_tower
    if (this.selection) {
      tower = this.new_tower_map.get(this.selection.id);
    }
    if (this.prev_selection) {
      prev_tower = this.new_tower_map.get(this.prev_selection.id);
    }

    if (tower?.is_placeable) {
      tower.setVisible(true);
      tower.setPosition(this.game.input.activePointer.x, this.game.input.activePointer.y)
    }
    
    if (!this.selection) {
      if (tower) tower.selection = undefined;
      if (prev_tower) prev_tower.selection = undefined;
    } else {
      if (tower !== prev_tower) {
        if (tower) {
          tower.selection = 'selected';
        }
        if (prev_tower) {
          prev_tower.selection = undefined;
          if (!prev_tower.is_placed) {
            prev_tower.setVisible(false);
          }
        }
      }
    }

    this.prev_selection = this.selection
  }
}
