import FragSrc from './dissolve-frag.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const Clamp = Phaser.Math.Clamp;

export default class DissolvePostFxPipeline extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline {

    private _progress: number = 0;

    public toFrame: Phaser.Textures.Frame | undefined = undefined;
    public toTexture: string | null = '__DEFAULT';
    public targetTexture: WebGLTexture | undefined = undefined;
    public resizeMode: ResizeMode = ResizeMode.contain;
    public toRatio: number = 1;
    public noiseX: number = 0;
    public noiseY: number = 0;
    public noiseZ: number = 0;
    public fromEdgeStart: number = 0.01;
    public fromEdgeWidth: number = 0.05;
    public toEdgeStart: number = 0.01;
    public toEdgeWidth: number = 0.05;

    constructor(game: Phaser.Game) {
        super({
            name: 'DissolvePostFX',
            game: game,
            renderTarget: true,
            fragShader: FragSrc
        });
    }

    resetFromJSON(o: object) {
        this.setTransitionTargetTexture(GetValue(o, 'toTexture', '__DEFAULT'), GetValue(o, 'toFrame', undefined), GetValue(o, 'resizeMode', 1));
        this.setNoise(GetValue(o, 'noiseX', undefined), GetValue(o, 'noiseY', undefined), GetValue(o, 'noiseZ', undefined));
        this.setFromEdge(GetValue(o, 'fromEdgeStart', 0.01), GetValue(o, 'fromEdgeWidth', 0.05));
        this.setToEdge(GetValue(o, 'toEdgeStart', 0.01), GetValue(o, 'toEdgeWidth', 0.05));
        return this;
    }

    onBoot() {
        this.setTransitionTargetTexture();
    }

    onPreRender() {
        this.set1f('progress', this.progress);
        this.set1i('resizeMode', this.resizeMode);

        this.set1f('noiseX', this.noiseX);
        this.set1f('noiseY', this.noiseY);
        this.set1f('noiseZ', this.noiseZ);
        this.set1f('fromEdgeStart', this.fromEdgeStart);
        this.set1f('fromEdgeWidth', this.fromEdgeWidth);
        this.set1f('toEdgeStart', this.toEdgeStart);
        this.set1f('toEdgeWidth', this.toEdgeWidth);
    }

    onDraw(renderTarget: Phaser.Renderer.WebGL.RenderTarget) {
        this.set1f('fromRatio', renderTarget.width / renderTarget.height);

        this.bindTexture(this.targetTexture, 1);

        this.bindAndDraw(renderTarget);
    }

    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = Clamp(value, 0, 1);
    }

    setProgress(value: number) {
        this.progress = value;
        return this;
    }

    setTransitionTargetTexture(key?: string, frame?: string, resizeMode?: ResizeMode) {
        if (key === undefined) {
            key = '__DEFAULT';
        }
        var phaserTexture = this.game.textures.getFrame(key, frame);

        if (!phaserTexture) {
            phaserTexture = this.game.textures.getFrame('__DEFAULT');
        }

        this.toRatio = phaserTexture.width / phaserTexture.height;

        this.toFrame = phaserTexture;
        this.targetTexture = phaserTexture.glTexture;

        if (resizeMode !== undefined) {
            this.resizeMode = resizeMode;
        }

        this.set1i('uMainSampler2', 1);
        this.set1f('toRatio', this.toRatio);

        return this;
    }

    setResizeMode(mode: ResizeMode) {
        this.resizeMode = mode;
        return this;
    }

    setNoise(x?: number, y?: number, z?: number) {
        if (x === undefined) {
            x = 4 + Math.random() * 6;
        }
        if (y === undefined) {
            y = 4 + Math.random() * 6;
        }
        if (z === undefined) {
            z = Math.random() * 10;
        }
        this.noiseX = x;
        this.noiseY = y;
        this.noiseZ = z;
        return this;
    }

    setFromEdge(edgeStart: number, edgeWidth: number) {
        this.fromEdgeStart = edgeStart;
        this.fromEdgeWidth = edgeWidth;
        return this;
    }

    setToEdge(edgeStart: number, edgeWidth: number) {
        this.toEdgeStart = edgeStart;
        this.toEdgeWidth = edgeWidth;
        return this;
    }
}

/**
 * Set the resize mode of the target texture.
 * 
 * Can be either:
 * 
 * 0 - Stretch. The target texture is stretched to the size of the source texture.
 * 1 - Contain. The target texture is resized to fit the source texture. This is the default.
 * 2 - Cover. The target texture is resized to cover the source texture.
 * 
 * If the source and target textures are the same size, then use a resize mode of zero
 * for speed.
 *
 */
enum ResizeMode {
    stretch,
    contain,
    cover,
}
