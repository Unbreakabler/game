import { OutlinePipeline } from '../../../../plugins/outline.js';

// lookup is_placeable here?
const red = 0xff0000;
const green = 0x00ff00;
const blue = 0x0000ff;
var range_indicator = () => {
    return {
        type: 'range_indicator',
        onInit: (parent, td_scene, x, y) => {
            parent.range_indicator = parent.td_scene.add.circle(parent.x, parent.y, parent.tower_info.attributes.range, 0xff0000, 0.5);
            parent.range_indicator.setStrokeStyle(2, 0xffffff);
            parent.range_indicator.setVisible(false);
        },
        onUpdate: (parent, time, delta) => {
            if (parent.selection !== 'selected') {
                parent.range_indicator?.setVisible(false);
                return;
            }
            parent.range_indicator?.setVisible(true);
            if (parent.is_placed) {
                parent.range_indicator?.setFillStyle(blue, 0.15);
            }
            else {
                let outline_color;
                if (parent.is_placeable) {
                    parent.range_indicator?.setFillStyle(green, 0.3);
                    outline_color = new Phaser.Display.Color(0, 255, 0);
                }
                else {
                    parent.range_indicator?.setFillStyle(red, 0.3);
                    outline_color = new Phaser.Display.Color(255, 0, 0);
                }
                let outline = parent.static_sprites?.getPostPipeline(OutlinePipeline);
                if (outline) {
                    outline.outlineColor = outline_color;
                }
                outline = parent.rotating_sprites?.getPostPipeline(OutlinePipeline);
                if (outline) {
                    outline.outlineColor = outline_color;
                }
            }
        }
    };
};

export default range_indicator;
//# sourceMappingURL=range_indicator.js.map
