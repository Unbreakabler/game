import { FacebookInstantGamesLeaderboard } from "phaser";


export class HealthBar extends Phaser.GameObjects.Rectangle {
  private current_hp: number;
  private starting_hp: number;
  private background_bar: Phaser.GameObjects.Rectangle
  private starting_width: number;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, starting_hp: number) {
    const height = 5;
    super(scene, x, y, width, height, 0x00ff00);
    scene.add.existing(this);
    this.starting_hp = starting_hp
    this.current_hp = this.starting_hp;
    this.starting_width = width;

    this.background_bar = scene.add.rectangle(x, y - 1, width, height + 2, 0x000000)
    this.background_bar.setStrokeStyle(1, 0xffffff)
    this.background_bar.setDepth(-1)

    this.setVisible(false);
    this.background_bar.setVisible(false);
  }

  public preDestroy() {
    this.background_bar.destroy();
  }

  public setCurrentHp(health_points: number) {
    if (health_points !== this.current_hp) {
      this.current_hp = health_points;
  
      const r = this.current_hp / this.starting_hp
      this.width = this.starting_width * r;
    }
    if (this.current_hp < this.starting_hp && !this.visible) {
      this.setVisible(true);
      this.background_bar.setVisible(true);
      this.background_bar.setActive(true);
    }
  }

  public setPosition(x: number, y: number): this {
    this.x = x;
    this.y = y;
    if (this.background_bar) {
      this.background_bar.setPosition(x, y);
    }
    return this
  }
}