

export class Path extends Phaser.Curves.Path {
  public road_width: number = 30;
  public mesh!: Phaser.GameObjects.Mesh;

  private td_scene: Phaser.Scene
  private points: Phaser.Math.Vector2[] = [];
  public debug!: Phaser.GameObjects.Graphics;

  constructor(scene: Phaser.Scene, points: number[][]) {
    super(points[0][0], points[0][1]);
    console.log('start', points[0][0], points[0][1])
    this.td_scene = scene;
    points.forEach((pt_set, index) => {
      this.points[index] = new Phaser.Math.Vector2(pt_set[0], pt_set[1])
      if (index !== 0) {
        this.lineTo(pt_set[0], pt_set[1])
      }
    })
    this.drawDebugPath();
    this.createPathMesh();
    // this.drawTriangle();
  }

  drawDebugPath() {
    const graphics = this.td_scene.add.graphics();
    graphics.lineStyle(3, 0xffffff, 1); // default line to see path;
    this.draw(graphics);
  }

  drawTriangle() {
    const vertices = [
      81,0,​
      111,0,
      ​81,​-276 -16,
      ​111,​-246 -16,
    ];

    const uvs = [
        0, 0,
        1, 0,
        0, 1,
        1, 1,
    ];

    const indicies = [ 0, 2, 1, 1, 2, 3];
    this.mesh = this.td_scene.add.mesh(0, 0);
    this.mesh.addVertices(vertices, uvs, indicies)
    this.mesh.panZ(this.mesh.height / (2 * Math.tan(Math.PI / 16)))
    this.debug = this.td_scene.add.graphics();
    this.mesh.setDebug(this.debug);
  }

  createPathMesh() {
    const verts: integer[] = [];
    const uvs: integer[] = [];
    const vert_indicies: integer[] = [];
    let vert_index = 0;
    let face_index = 0;

    for (let i = 0; i < this.points.length; i++) {
      let forward = Phaser.Math.Vector2.ZERO;
      let temp_vec = new Phaser.Math.Vector2();
      if (i < this.points.length -1) {
        temp_vec.x = this.points[i + 1].x
        temp_vec.y = this.points[i + 1].y
        // console.log('wat', temp_vec, this.points[i + 1], this.points[i])
        temp_vec.subtract(this.points[i])
        // console.log('forward', forward)
        forward.add(temp_vec)
        // console.log('forward', forward)
      }
      if (i > 0) {
        // console.log('wat', temp_vec, this.points[i])
        temp_vec.x = this.points[i].x
        temp_vec.y = this.points[i].y
        // console.log('wat', temp_vec, this.points[i], this.points[i - 1])
        temp_vec.subtract(this.points[i - 1])
        // console.log('wat', temp_vec, this.points[i])
        // console.log('forward', forward)
        forward.add(temp_vec)
        // console.log('forward', forward)
      }
      forward.normalize();
      
      let left = new Phaser.Math.Vector2(-forward.y, forward.x)
      console.log('left', left)

      verts[vert_index] = Math.floor(this.points[i].x + (left.x * this.road_width * 0.5));
      verts[vert_index + 1] = -Math.floor(this.points[i].y + (left.y * this.road_width * 0.5));

      verts[vert_index + 2] = Math.floor(this.points[i].x - (left.x * this.road_width * 0.5));
      verts[vert_index + 3] = -Math.floor(this.points[i].y - (left.y * this.road_width * 0.5));
      // debugger;

      let completion_percent = i/(this.points.length - 1);
      uvs[vert_index] = 0;
      uvs[vert_index+1] = completion_percent;
      uvs[vert_index+2] = 1;
      uvs[vert_index+3] = completion_percent;

      if (i < this.points.length - 1) {
        vert_indicies[face_index] = vert_index
        vert_indicies[face_index + 1] = vert_index + 2;
        vert_indicies[face_index + 2] = vert_index + 1;

        vert_indicies[face_index + 3] = vert_index + 1
        vert_indicies[face_index + 4] = vert_index + 2;
        vert_indicies[face_index + 5] = vert_index + 3;
      }

      vert_index += 4
      face_index += 6
    }
    // this.mesh = new Phaser.GameObjects.Mesh(this.td_scene)
    console.log('points', this.points)
    console.log('verts', verts)
    console.log('uvs', uvs)
    console.log('vert_indicies', vert_indicies)
    this.mesh = this.td_scene.add.mesh(0, 0)
    this.mesh.addVertices(verts, uvs, vert_indicies)
    this.mesh.panZ(this.mesh.height / (2 * Math.tan(Math.PI / 16)))
    // this.mesh.hideCCW = true;
    // this.mesh.setOrtho(this.mesh.width, this.mesh.height)
    this.mesh.addedToScene = () => console.log('added to scene')
    this.debug = this.td_scene.add.graphics();
    this.mesh.setDebug(this.debug);
    console.log('faces',this.mesh.faces);
    console.log('pos', this.mesh.modelPosition)

    this.mesh.faces.forEach(f => console.log(f, f.isCounterClockwise(this.mesh.modelPosition.z)))

    this.td_scene.input.keyboard.on('keydown-D', () => {
      console.log('test???', this.mesh.debugCallback)
      if (this.mesh.debugCallback)
      {
          this.mesh.setDebug();
      }
      else
      {
          this.mesh.setDebug(this.debug);
      }

  });
    // this.td_scene.add.existing(this.mesh);
  }

}