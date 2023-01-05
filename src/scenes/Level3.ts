import Phaser from "phaser";
import Player from "../player";
import BaseLevel from "./BaseLevel";
import Ball from "../ball";

export default class Level3 extends BaseLevel {
  player?: Player;
  collisionLayer?: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super("Level3Scene");
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "assets/level_3_tiles.json");
  }

  addColliders() {
    if (!this.player || !this.collisionLayer) return;
    this.physics.add.collider(this.player.sprite, this.collisionLayer);
  }

  create() {
    const map = this.make.tilemap({ key: "map3" });
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    super.create();

    const tileset = map.addTilesetImage("titles_01", "tiles2");
    this.collisionLayer = map
      .createLayer("collision", tileset, 0, 0)
      .setCollisionByProperty({ collides: true });

    map.findObject("Spawn", (spawnPoint) => {
      this.player = new Player(this, spawnPoint.x, spawnPoint.y);
      camera.startFollow(this.player.sprite, true, 0.08, 0.08);

      if (this.collisionLayer) {
        new Ball(this, this.collisionLayer, this.player, 100, 0);
        new Ball(this, this.collisionLayer, this.player, 400, 0);
        new Ball(this, this.collisionLayer, this.player, 600, 0);
      }

      this.input.on("pointerup", () => this.player?.shoot(), this);
      this.addColliders();
      this.addLevelEnd(map, this.player);
    });
  }

  update() {
    super.update();
    this.player?.update(
      this.cursors.left.isDown,
      this.cursors.right.isDown,
      this.cursors.up.isDown || this.cursors.space.isDown
    );
  }
}