const SpliceOne = Phaser.Utils.Array.SpliceOne;

class BasePostFxPipelinePlugin extends Phaser.Plugins.BasePlugin {

  public PostFxPipelineClass!: Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
  public postFxPipelineName!: string;

  public setPostPipelineClass(PostFxPipelineClass: Phaser.Renderer.WebGL.Pipelines.PostFXPipeline, postFxPipelineName: string) {
    this.PostFxPipelineClass = PostFxPipelineClass;
    this.postFxPipelineName = postFxPipelineName;
    return this;
  }

  public start() {
    var eventEmitter = this.game.events;
    eventEmitter.on('destroy', this.destroy, this);

    // Odd that the docs for `addPostPipeline` say to pass a class as the second param, 
    // but doing so causes a type error leading to this weird type casting.
    (this.game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).pipelines.addPostPipeline(this.postFxPipelineName, (this.PostFxPipelineClass as unknown) as Function);
  }

  public add(gameObject: Phaser.GameObjects.Sprite, config: any | undefined) {
    if (config === undefined) {
      config = {};
    }

    gameObject.setPostPipeline(this.PostFxPipelineClass);
    var pipeline = gameObject.postPipelines[gameObject.postPipelines.length - 1];
    (pipeline as any).resetFromJSON(config);

    if (config.name) {
      pipeline.name = config.name;
    }

    return pipeline;
  }

  public remove(gameObject: Phaser.GameObjects.Sprite, name: string | undefined) {
    if (name === undefined) {
      var pipelines = gameObject.postPipelines;
      for (var i = (pipelines.length - 1); i >= 0; i--) {
        var instance = pipelines[i];
        if (instance instanceof (this.PostFxPipelineClass as any)) {
          instance.destroy();
          SpliceOne(pipelines, i);
        }
      }
    } else {
      var pipelines = gameObject.postPipelines;
      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];
        if ((instance instanceof (this.PostFxPipelineClass as any)) && (instance.name === name)) {
          instance.destroy();
          SpliceOne(pipelines, i);
        }
      }
    }
  }

  public get(gameObject: Phaser.GameObjects.Sprite, name: string | undefined) {
    if (name === undefined) {
      var result = [];
      var pipelines = gameObject.postPipelines;
      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];
        if (instance instanceof (this.PostFxPipelineClass as any)) {
          result.push(instance)
        }
      }
      return result;
    } else {
      var pipelines = gameObject.postPipelines;
      for (var i = 0, cnt = pipelines.length; i < cnt; i++) {
        var instance = pipelines[i];
        if ((instance instanceof (this.PostFxPipelineClass as any)) && (instance.name === name)) {
          return instance;
        }
      }
    }
    return;
  }
}

export default BasePostFxPipelinePlugin;