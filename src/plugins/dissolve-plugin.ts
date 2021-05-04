import DissolvePostFxPipeline from './shaders/dissolve/dissolve-post-fx-pipeline';
import BasePostFxPipelinePlugin from './utils/base-post-fx-plugin';

class DissolvePipelinePlugin extends BasePostFxPipelinePlugin {
    constructor(pluginManager: Phaser.Plugins.PluginManager) {
        super(pluginManager);
        this.setPostPipelineClass(((DissolvePostFxPipeline as unknown) as Phaser.Renderer.WebGL.Pipelines.PostFXPipeline), 'DissolvePostFX');
    }
}


export default DissolvePipelinePlugin;