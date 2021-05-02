const setup_image_assets = (scene: Phaser.Scene): void => {
  scene.load.image("basic", "static/tower/turrets/basic.png");
  scene.load.image("machine_gun", "static/tower/turrets/machine_gun.png");

  scene.load.image("tower_base_1", "static/tower/bases/base_1.png");
  scene.load.image("tower_base_2", "static/tower/bases/base_2.png");
  scene.load.image("tower_base_3", "static/tower/bases/base_3.png");
  scene.load.image("tower_base_4", "static/tower/bases/base_4.png");

  scene.load.image("tower_cover_1", "static/tower/covers/cover_1.png");
  scene.load.image("tower_cover_2", "static/tower/covers/cover_2.png");
  scene.load.image("tower_cover_3", "static/tower/covers/cover_3.png");
  scene.load.image("tower_cover_4", "static/tower/covers/cover_4.png");

  scene.load.image("small_bullet", "static/small_bullet.png");
  scene.load.image("dirt0", "static/dirt0.png");
  scene.load.image("grass0", "static/grass0.png");
  scene.load.image("sand0", "static/sand0.png");
  scene.load.spritesheet("green_knight", "static/green_knight.png", {
    frameWidth: 20,
    frameHeight: 30,
  });
  scene.load.spritesheet("bug", "static/bug.png", {
    frameWidth: 20,
    frameHeight: 26,
  });
  scene.load.spritesheet("blue_dragon", "static/blue_dragon.png", {
    frameWidth: 24,
    frameHeight: 30,
  });
  scene.load.image('tiles', 'static/towerDefense_tilesheet@2.png')
  scene.load.tilemapTiledJSON('map', 'static/map.json')
}

export default setup_image_assets