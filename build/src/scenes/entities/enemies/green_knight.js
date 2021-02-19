import Enemy from './enemy.js';

class GreenKnight extends Enemy {
    constructor(scene) {
        super(scene, 0, 0, 'green-knight');
        this.anims.play('green-knight-walking');
    }
}

export default GreenKnight;
//# sourceMappingURL=green_knight.js.map
