import { gameModel } from '../../../../gamelogic/gamemodel.js';
import { OutlinePipeline } from '../../../../plugins/outline.js';

// Should this be passed down from td.ts instead?
let gameModelInstance;
gameModel.subscribe((m) => (gameModelInstance = m));
var selection_handler = () => {
    const tower_component = {
        type: 'selection_handler',
        onInit: (parent, td_scene, x, y) => {
            const width = parent.width ? parent.width : 128;
            const height = parent.height ? parent.height : 128;
            const rect = new Phaser.Geom.Rectangle(-(width / 2), -(height / 2), width, height);
            parent.rotating_sprites?.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
            parent.static_sprites?.setInteractive(rect, Phaser.Geom.Rectangle.Contains);
            parent.scene.input.on('pointermove', (pointer, game_objects_under_pointer) => {
                if (game_objects_under_pointer.length) {
                    for (const obj of game_objects_under_pointer) {
                        if (obj.name === parent.static_sprites?.name || obj.name === parent.rotating_sprites?.name) {
                            if (!parent.selection) {
                                parent.selection = 'hovered';
                                document.body.style.cursor = 'pointer';
                            }
                        }
                    }
                }
                else {
                    parent.selection = parent.selection === 'hovered' ? undefined : parent.selection;
                    document.body.style.cursor = 'auto';
                }
            });
            parent.scene.input.on('pointerup', (pointer, game_objects_under_pointer) => {
                let selected = false;
                if (game_objects_under_pointer.length) {
                    for (const obj of game_objects_under_pointer) {
                        if (obj.name === parent.static_sprites?.name || obj.name === parent.rotating_sprites?.name) {
                            selected = true;
                        }
                    }
                    if (selected) {
                        gameModelInstance.tower_defense.setSelection(parent.tower_id);
                    }
                }
                else {
                    gameModelInstance.tower_defense.setSelection(null);
                }
            });
        },
        onUpdate: (parent, time, delta) => {
            if (parent.selection) {
                let already_applied = parent.static_sprites?.getPostPipeline(OutlinePipeline);
                if (already_applied instanceof Array && !already_applied.length)
                    parent.static_sprites?.setPostPipeline(OutlinePipeline);
                already_applied = parent.rotating_sprites?.getPostPipeline(OutlinePipeline);
                if (already_applied instanceof Array && !already_applied.length)
                    parent.rotating_sprites?.setPostPipeline(OutlinePipeline);
            }
            else {
                parent.static_sprites?.removePostPipeline(OutlinePipeline);
                parent.rotating_sprites?.removePostPipeline(OutlinePipeline);
            }
        }
    };
    return tower_component;
};

export default selection_handler;
//# sourceMappingURL=selection_handler.js.map
