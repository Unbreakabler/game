export default class Bullet extends Phaser.GameObjects.Image {

  public dx: number = 0;
  public dy: number = 0;
  public lifespan: number = 0;
  public speed: number = 0;
  public damage: number = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'small_bullet');

    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    this.speed = Phaser.Math.GetSpeed(600, 1);
  }

  public fire(x: number, y: number, angle: number, range: number, damage: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
    this.setRotation(angle - Phaser.Math.PI2 / 4); // FIXME(jon): not necessary if proj is round
    this.dx = Math.cos(angle); // 
    this.dy = Math.sin(angle);
    this.lifespan = range;
    this.damage = damage;
  }

  public update(time: number, delta: number) {
    this.lifespan -= delta;

    this.x += this.dx * (this.speed * delta);
    this.y += this.dy * (this.speed * delta);

    if (this.lifespan <= 0)
    {
      this.setActive(false);
      this.setVisible(false);
    }
  }

}