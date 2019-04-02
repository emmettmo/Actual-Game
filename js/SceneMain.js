var player;
var tileGroup;
var playerGroup;

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
    this.load.image("sprRock", "content/sprRock.png");
    this.load.image("sprPlayer", "content/sprPlayer.png");

  }


  create() {
    this.anims.create({
      key: "sprWater",
      frames: this.anims.generateFrameNumbers("sprWater"),
      frameRate: 4,
      repeat: -1
    });

    this.chunkSize = 4;
    this.tileSize = 16;
    this.cameraSpeed = 5;
    this.playerSpeed = 3;
    this.zoom = 1;
    this.numChunksToLoad = 5;
    this.chunks = [];

    this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyPlus = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    this.keyMinus = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L);
    this.keyChunkUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.O);
    this.keyChunkDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);

    player = this.physics.add.image(100, 100, "sprPlayer");
    this.cameras.main.setZoom(this.zoom);
    this.cameras.main.startFollow(player, true);

    tileGroup = this.add.group();
    playerGroup = this.add.group();
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

    var snappedChunkX = (this.chunkSize * this.tileSize) * Math.round(player.x / (this.chunkSize * this.tileSize));
    var snappedChunkY = (this.chunkSize * this.tileSize) * Math.round(player.y / (this.chunkSize * this.tileSize));

    snappedChunkX = snappedChunkX / this.chunkSize / this.tileSize;
    snappedChunkY = snappedChunkY / this.chunkSize / this.tileSize;

    //For creating new chunks
    for (var x = snappedChunkX - this.numChunksToLoad; x < snappedChunkX + this.numChunksToLoad; x++) {
      for (var y = snappedChunkY - this.numChunksToLoad; y < snappedChunkY + this.numChunksToLoad; y++) {
        var existingChunk = this.getChunk(x, y);

        if (existingChunk == null) {
          var newChunk = new Chunk(this, x, y);
          this.chunks.push(newChunk);
        }
      }
    }


    /*
    for (var i = 0; i < this.chunks.length; i++) {
      var chunk = this.chunks[i];

      if (Phaser.Math.Distance.Between(snappedChunkX, snappedChunkY, chunk.x, chunk.y) < this.numChunksToLoad) {
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
    */
    player.setVelocity(0);
    if (this.keyW.isDown) {
      player.setVelocityY(-40);
    }
    if (this.keyS.isDown) {
      player.setVelocityY(40);
    }
    if (this.keyA.isDown) {
      player.setVelocityX(-40);
    }
    if (this.keyD.isDown) {
      player.setVelocityX(40);
    }
    if (this.keyPlus.isDown) {
      this.zoom = this.zoom + 0.03;
    }
    if (this.keyMinus.isDown) {
      this.zoom = this.zoom - 0.03;
    }
    if (this.keyChunkUp.isDown) {
      this.numChunksToLoad += 1;
      console.log(this.numChunksToLoad);
    }
    if (this.keyChunkDown.isDown) {
      this.numChunksToLoad -= 1;
    }

    this.cameras.main.setZoom(this.zoom);

  }
}
