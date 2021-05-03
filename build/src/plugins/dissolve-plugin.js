import DissolvePostFxPipeline from './shaders/dissolve/dissolve-post-fx-pipeline.js';
import BasePostFxPipelinePlugin from './utils/base-post-fx-plugin.js';

class DissolvePipelinePlugin extends BasePostFxPipelinePlugin {
    constructor(pluginManager) {
        super(pluginManager);
        this.setPostPipelineClass(DissolvePostFxPipeline, 'DissolvePostFX');
    }
}

export default DissolvePipelinePlugin;
//# sourceMappingURL=dissolve-plugin.js.map
