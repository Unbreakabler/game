import GetFrag from './shaders/outline-frag.js';

const PostFXPipeline = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
const GetValue = Phaser.Utils.Objects.GetValue;
const IntegerToRGB = Phaser.Display.Color.IntegerToRGB;
const Color = Phaser.Display.Color;
let Quality = 0.5;
let FragmentShader = GetFrag(Quality);
class OutlinePipeline extends PostFXPipeline {
    constructor(game) {
        super({
            game: game,
            renderTarget: true,
            fragShader: FragmentShader,
            name: 'outline',
        });
        this._thickness = 5;
        this._outlineColor = new Color(255, 255, 255);
    }
    resetFromJSON(o) {
        this.setThickness(GetValue(o, 'thickness', 5));
        this.setOutlineColor(GetValue(o, 'outlineColor', 0xffffff));
        return this;
    }
    onPreRender() {
        this.set1f('thickness', this._thickness);
        if (this._thickness > 0) {
            this.set3f('outlineColor', this._outlineColor.redGL, this._outlineColor.greenGL, this._outlineColor.blueGL);
        }
        this.set2f('texSize', this.renderer.width, this.renderer.height);
    }
    get thickness() {
        return this._thickness;
    }
    set thickness(value) {
        this._thickness = value;
    }
    setThickness(value) {
        this.thickness = value;
        return this;
    }
    get outlineColor() {
        return this._outlineColor;
    }
    set outlineColor(value) {
        let color_object = value;
        if (typeof (value) === 'number') {
            color_object = IntegerToRGB(value);
        }
        this._outlineColor.setFromRGB(color_object);
    }
    setOutlineColor(value) {
        this.outlineColor = value;
        return this;
    }
    static setQuality(quality) {
        Quality = quality;
        FragmentShader = GetFrag(quality);
    }
    static getQuality() {
        return Quality;
    }
}

export { OutlinePipeline };
//# sourceMappingURL=outline.js.map
