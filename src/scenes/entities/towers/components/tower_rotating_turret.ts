import type { TowerType } from "../../../../gamelogic/td/tower_defense";
import type TD from "../../../td";
import type Tower from "../tower";
import type { TowerComponent } from "./component_interface";

export default (
  turret_type: TowerType = 'basic') => {
  const tower_component: TowerComponent = {
    type: 'rotating_turret',
    onInit: (parent: Tower, td_scene: TD, x: number, y: number) => {
      // Setup sprites
      if (!parent.rotating_sprites) {
        parent.rotating_sprites = new Phaser.GameObjects.Container(td_scene, x, y);
        parent.rotating_sprites.name = `${parent.tower_id}_rotating_sprites` // randomly generate this name?
        parent.rotating_sprites.depth = 1;
        parent.rotating_sprites.scale = 0.5;
        td_scene.add.existing(parent.rotating_sprites);
      }

      const turret = new Phaser.GameObjects.Sprite(td_scene, 0, 0, turret_type);
      parent.rotating_sprites.add(turret); 
  
    },
    onUpdate: (parent: Tower, time: number, delta: number) => {
      if (!parent.active) return

      if (parent.target && parent.rotating_sprites ) {
        // console.log('target pos', parent.x, parent.y, parent.target.x, parent.target.y)
        parent.rotating_sprites.rotation = Phaser.Math.Angle.Between(parent.x, parent.y, parent.target.x, parent.target.y) + Math.PI / 2; 
      }
    }
  }
  return tower_component;
}