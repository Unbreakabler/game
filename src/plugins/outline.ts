import GetFrag from './shaders/outline-frag';

const PostFXPipeline = Phaser.Renderer.WebGL.Pipelines.PostFXPipeline;
const GetValue = Phaser.Utils.Objects.GetValue;
const IntegerToRGB = Phaser.Display.Color.IntegerToRGB;
const Color = Phaser.Display.Color;

let Quality = 0.5;
let FragmentShader = GetFrag(Quality)

export class OutlinePipeline extends PostFXPipeline {

  private _thickness = 5;
  private _outlineColor = new Color(255, 255, 255);

  constructor(game: Phaser.Game) {
      super({
          game: game,
          renderTarget: true,
          fragShader: FragmentShader,
          name: 'outline',
      });
  }

  resetFromJSON(o: any) {
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

  setThickness(value: number) {
      this.thickness = value;
      return this;
  }

  get outlineColor() {
      return this._outlineColor;
  }

  set outlineColor(value) {
    let color_object = value as Phaser.Types.Display.InputColorObject
      if (typeof (value) === 'number') {
        color_object = IntegerToRGB(value);
      }
      this._outlineColor.setFromRGB(color_object);
  }

  setOutlineColor(value: Phaser.Display.Color) {
      this.outlineColor = value;
      return this;
  }

  static setQuality(quality: number) {
      Quality = quality;
      FragmentShader = GetFrag(quality);
  }

  static getQuality() {
      return Quality;
  }
}