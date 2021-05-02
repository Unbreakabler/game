const generate_animations = (scene: Phaser.Scene) => {
  // Set up animations
  scene.anims.create({
    key: "green_knight-walking-down",
    frames: scene.anims.generateFrameNames("green_knight", { start: 0, end: 3 }),
    frameRate: 3,
    repeat: -1,
  });
  scene.anims.create({
    key: "green_knight-walking-right",
    frames: scene.anims.generateFrameNames("green_knight", { start: 4, end: 7 }),
    frameRate: 3,
    repeat: -1,
  });
  scene.anims.create({
    key: "green_knight-walking-left",
    frames: scene.anims.generateFrameNames("green_knight", { start: 8, end: 11 }),
    frameRate: 3,
    repeat: -1,
  });
  scene.anims.create({
    key: "green_knight-walking-up",
    frames: scene.anims.generateFrameNames("green_knight", { start: 12, end: 15 }),
    frameRate: 3,
    repeat: -1,
  });

  scene.anims.create({
    key: "bug-walking-down",
    frames: scene.anims.generateFrameNames("bug", { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "bug-walking-right",
    frames: scene.anims.generateFrameNames("bug", { start: 2, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "bug-walking-left",
    frames: scene.anims.generateFrameNames("bug", { start: 4, end: 5 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "bug-walking-up",
    frames: scene.anims.generateFrameNames("bug", { start: 6, end: 7 }),
    frameRate: 2,
    repeat: -1,
  });

  scene.anims.create({
    key: "blue_dragon-walking-down",
    frames: scene.anims.generateFrameNames("blue_dragon", { start: 0, end: 1 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "blue_dragon-walking-right",
    frames: scene.anims.generateFrameNames("blue_dragon", { start: 2, end: 3 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "blue_dragon-walking-left",
    frames: scene.anims.generateFrameNames("blue_dragon", { start: 4, end: 5 }),
    frameRate: 2,
    repeat: -1,
  });
  scene.anims.create({
    key: "blue_dragon-walking-up",
    frames: scene.anims.generateFrameNames("blue_dragon", { start: 6, end: 7 }),
    frameRate: 2,
    repeat: -1,
  });

}

export default generate_animations