const DEFAULT_PATH_WIDTH = 64;

export class Path extends Phaser.Curves.Path {
  public road_width: number;

  private td_scene: Phaser.Scene;
  public readonly graphics!: Phaser.GameObjects.Graphics;

  public constructor(scene: Phaser.Scene, points: number[][], road_width: number = DEFAULT_PATH_WIDTH) {
    super(points[0][0], points[0][1]);
    this.td_scene = scene;
    this.road_width = road_width;
    const p: Phaser.Math.Vector2[] = [];
    for (const point of points) {
      p.push(new Phaser.Math.Vector2(point[0], point[1]));
    }
    p.forEach(vec2 => this.lineTo(vec2))
    this.graphics = this.td_scene.add.graphics();
    this.drawPathInvisible();
  }

  /**
   * Draws path invisible so it can be used as a mask
   */
  private drawPathInvisible(): void {
    this.graphics.lineStyle(this.road_width, 0xffffff, 0.0); // default line to see path;
    this.draw(this.graphics);
  }
}
