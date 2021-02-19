import Enemy from './enemy'

export default class GreenKnight extends Enemy {

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'green-knight')
    this.anims.play('green-knight-walking')
  }
}