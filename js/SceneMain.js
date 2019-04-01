class SceneMain extends Phaser.Scene {
  constructor() {
    super({ key: "SceneMain" });
  }

  preload() {
    this.load.spritesheet("sprWater", "content/sprWater.png", {
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image("sprSand", "content/sprSand.png");
    this.load.image("sprGrass", "content/sprGrass.png");
  }


  create() {

    this.anims.create({
      key: "sprWater",
      frames: this.anims.generateFrameNumbers("sprWater"),
      frameRate: 5,
      repeat: -1
    });

    this.chunkSize = 16;
    this.tileSize = 16;
    this.cameraSpeed = 5;
    this.zoom = 1;

    this.cameras.main.setZoom(this.zoom);
    this.followPoint = new Phaser.Math.Vector2(
      this.cameras.main.worldView.x + (this.cameras.main.worldView.width * 0.5),
      this.cameras.main.worldView.y + (this.cameras.main.worldView.height * 0.5)
    );

    this.chunks = [];

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyPlus = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyMinus = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);

  }

  getChunk(x, y) {
    var chunk = null;
    for (var i = 0; i < this.chunks.length; i++) {
      if (this.chunks[i].x == x && this.chunks[i].y == y) {
        chunk = this.chunks[i];
      }
    }
    return chunk;
  }

  update() {

    var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.x / (this.chunkSize * this.tileSize));
    var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(this.followPoint.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    var numChunksToLoad = 5;

    for (var x = snappedChunkX - numChunksToLoad; x < snappedChunkX + numChunksToLoad; x++) {
      for (var y = snappedChunkY - numChunksToLoad; y < snappedChunkY + numChunksToLoad; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y);
          this.chunks.push(newChunk);
        }
      }
    }

    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];

      if (Phaser.Math.Distance.Between(
        snappedChunkX,
        snappedChunkY,
        chunk.x,
        chunk.y
      ) < 3) {
        if (chunk !== null) {
          chunk.load();
        }
      }
      else {
        if (chunk !== null) {
          chunk.unload();
        }
      }
    }

    if (this.keyW.isDown) {
      this.followPoint.y -= this.cameraSpeed;
    }
    if (this.keyS.isDown) {
      this.followPoint.y += this.cameraSpeed;
    }
    if (this.keyA.isDown) {
      this.followPoint.x -= this.cameraSpeed;
    }
    if (this.keyD.isDown) {
      this.followPoint.x += this.cameraSpeed;
    }
    if (this.keyPlus.isDown) {
      this.zoom = this.zoom + .3;
    }
    if (this.keyMinus.isDown) {
      this.zoom = this.zoom - 0.3;
    }


    this.cameras.main.centerOn(this.followPoint.x, this.followPoint.y);
  }
}
