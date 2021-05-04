import type { TowerBaseType } from "../../../../gamelogic/td/tower_defense";
import type TD from "../../../td";
import type Tower from "../tower";
import type { TowerComponent } from "./component_interface";

const BASE_DIMENSIONS: { [id in TowerBaseType]: { scale: number, width: number, height: number }} = {
  'tower_base_1': {
    scale: 0.7,
    width: 64,
    height: 64,
  },
  'tower_base_2': {
    scale: 0.7,
    width: 64,
    height: 64,
  },
  'tower_base_3': {
    scale: 0.7,
    width: 64,
    height: 64,
  },
  'tower_base_4': {
    scale: 0.7,
    width: 64,
    height: 64,
  }
}

export default (
  base_type: TowerBaseType = 'tower_base_1',
) => {
  const tower_component: TowerComponent = {
    type: 'rotating_turret',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {
      // Setup sprites
      if (!parent.static_sprites) {
        parent.static_sprites = new Phaser.GameObjects.Container(td_scene, x, y);
        parent.static_sprites.name = `${parent.tower_id}_static_sprites` // randomly generate this name?
        parent.static_sprites.depth = 0;
        td_scene.add.existing(parent.static_sprites);
        parent.static_sprites.scale = BASE_DIMENSIONS[base_type].scale;
        parent.width = BASE_DIMENSIONS[base_type].width;
        parent.height = BASE_DIMENSIONS[base_type].height;
      }

      const base = new Phaser.GameObjects.Sprite(td_scene, 0, 0, base_type);
      parent.static_sprites.add(base);
    }
  }
  return tower_component;
}