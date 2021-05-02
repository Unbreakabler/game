import { gameModel, GameModel } from "../../../../gamelogic/gamemodel";
import { OutlinePipeline } from "../../../../plugins/outline";
import type TD from "../../../td";
import type Tower from "../tower";
import type { TowerComponent } from "./component_interface";

// Should this be passed down from td.ts instead?
let gameModelInstance: GameModel;
gameModel.subscribe((m) => (gameModelInstance = m));

export default () => {
  const tower_component: TowerComponent = {
    type: 'selection_handler',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {
      const width = parent.width ? parent.width : 128;
      const height = parent.height ? parent.height : 128;
      const rect = new Phaser.Geom.Rectangle(-(width/2), -(height/2), width, height);

      
      parent.rotating_sprites?.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
      parent.static_sprites?.setInteractive(rect, Phaser.Geom.Rectangle.Contains);

      parent.scene.input.on('pointermove', 
        (pointer: Phaser.Input.Pointer, game_objects_under_pointer: Tower[]) => {
          if (game_objects_under_pointer.length) {
            for (const obj of game_objects_under_pointer) {
              if (obj.name === parent.static_sprites?.name || obj.name === parent.rotating_sprites?.name) {
                if (!parent.selection) parent.selection = 'hovered';
              }
            }
          } else {
            parent.selection = parent.selection === 'hovered' ? undefined : parent.selection;
          }
        }
      )

      parent.scene.input.on('pointerup', 
      (pointer: Phaser.Input.Pointer, game_objects_under_pointer: Tower[]) => {
        let selected = false;
        if (game_objects_under_pointer.length) {
          for (const obj of game_objects_under_pointer) {
            if (obj.name === parent.static_sprites?.name || obj.name === parent.rotating_sprites?.name) {
              selected = true;
            }
          } 
          if (selected) {
            console.log(1, parent.selection);
            gameModelInstance.tower_defense.setSelection(parent.tower_id); 
          }
        } else {
          gameModelInstance.tower_defense.setSelection(null);
        }
      })
    },
    onUpdate: (parent: Tower, time: number, delta: number) => {
      if (parent.selection) {
        let already_applied = parent.static_sprites?.getPostPipeline(OutlinePipeline)
        if (already_applied instanceof Array && !already_applied.length) parent.static_sprites?.setPostPipeline(OutlinePipeline)

        already_applied = parent.rotating_sprites?.getPostPipeline(OutlinePipeline)
        if (already_applied instanceof Array && !already_applied.length) parent.rotating_sprites?.setPostPipeline(OutlinePipeline)
      } else {
        parent.static_sprites?.removePostPipeline(OutlinePipeline);
        parent.rotating_sprites?.removePostPipeline(OutlinePipeline);
      }
    }
  }
  return tower_component;
}