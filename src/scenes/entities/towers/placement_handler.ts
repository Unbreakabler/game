import type TD from "../../td"
import type Tower from "./tower"

const PLACEABLE_MIN_DISTANCE_FROM_PATH = 64;

export default (blocked_by: any[] = []) => {
  return {
    type: 'placement_handler',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {},
    onUpdate: (parent: Tower, time: number, delta: number) => {
      if (parent.is_placed) return;

      const place_x = parent.td_scene.game.input.activePointer.x;
      const place_y = parent.td_scene.game.input.activePointer.y;
      const min_dist = parent.td_scene.path.getPoints(parent.td_scene.path.getLength() / 20).reduce((acc, point) => {
        return Math.min(Phaser.Math.Distance.Between(place_x, place_y, point.x, point.y), acc);
      }, 1000);
      if (min_dist < PLACEABLE_MIN_DISTANCE_FROM_PATH) {
        // console.error('Can not place turret next to path')
        parent.is_placeable = false;
        return 
      }
  
      for (const t of parent.td_scene.tower_map.values()) {
        if (t == parent.td_scene.selected_turret) continue; // current turret on cursor
  
        const min_x = t.x - t.width/2
        const max_x = t.x + t.width/2
        const min_y = t.y - t.height/2
        const max_y = t.y + t.height/2
    
        const new_min_x = place_x //- parent.width/2
        const new_max_x = place_x //+ parent.width/2
        const new_min_y = place_y //- parent.height/2
        const new_max_y = place_y //+ parent.height/2
    
        const x_overlap = Math.max(0, Math.min(max_x, new_max_x) - Math.max(min_x, new_min_x));
        const y_overlap = Math.max(0, Math.min(max_y, new_max_y) - Math.max(min_y, new_min_y));
  
        if (x_overlap * y_overlap > 0) {
          // console.error('Can not place a turret overlapping another turret')
          parent.is_placeable = false;
          return
        }
      }
      parent.is_placeable = true;

      if (parent.td_scene.game.input.activePointer.isDown 
          && parent.is_placeable 
          && !parent.is_placed
          && parent.selection === 'selected') {
        parent.place(parent.td_scene.game.input.activePointer.x, parent.td_scene.game.input.activePointer.y)
      }
    },
  }
}