import type TD from "../../../td";
import type Tower from "../tower"

export default () => {
  return {
    type: 'target_indicator',
    onInit: (parent: Tower, td_scene: TD, x: number, y:number) => {
      if (!parent.targeting_indicator) {
        parent.targeting_indicator = parent.td_scene.add.circle(parent.x, parent.y, parent.width, 0xff0000)
        parent.targeting_indicator.setDepth(1);
        parent.targeting_indicator.setStrokeStyle(2, 0xffffff)
        parent.targeting_indicator.setAlpha(0.4)
      }
    },
    onUpdate: (parent: Tower, time: number, delta: number) => {
      if (!parent.target || parent.selection !== 'selected') {
        parent.targeting_indicator?.setVisible(false);
        return;
      }

      if (parent.targeting_indicator) {
        parent.targeting_indicator.setVisible(true);
        parent.targeting_indicator.setPosition(parent.target.x, parent.target.y);
        parent.targeting_indicator.displayWidth = parent.target.height * 2;
        parent.targeting_indicator.displayHeight = parent.target.height * 2;
      }
    }
  }
}