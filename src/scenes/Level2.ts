import Phaser from "phaser";
import Player from "../player";
import MovingPlatform from "../movingPlatform";
import { propertyMap } from "../utils";
import BaseLevel from "./BaseLevel";

export default class Level2 extends BaseLevel {
  platforms: MovingPlatform[] = [];

  constructor() {
    super("Level2Scene");
  }

  killPlayer() {
    this.killCharacters();
    this.showGameOver();
  }
  levelEnd() {
    this.killCharacters();
    this.showSuccess();
  }

  addColliders(layer: Phaser.Tilemaps.TilemapLayer) {
    if (!this.player) return;
    const collisionFn = (_: any, tile: any) => {
      if (tile.properties.kills) {
        this.killPlayer();
      }
    };
    this.physics.add.collider(this.player.sprite, layer, collisionFn);
  }

  addPlatforms(platformObjects: Phaser.Types.Tilemaps.TiledObject[]) {
    if (!this.player) return;
    this.platforms = platformObjects.map((platformObj: any) => {
      const config = propertyMap(platformObj.properties);
      return new MovingPlatform(
        this,
        this.player,
        platformObj.x,
        platformObj.y,
        config
      );
    });
  }

  create() {
    const map = this.make.tilemap({ key: "map2" });
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    super.create();

    const tileset = map.addTilesetImage("titles_01", "tiles2");
    const collisionLayer = map
      .createLayer("collision", tileset, 0, 0)
      .setCollisionByProperty({ collides: true });

    const platformObjects = map.getObjectLayer("platforms").objects;

    map.findObject("Spawn", (spawnPoint) => {
      this.player = new Player(this, spawnPoint.x, spawnPoint.y);
      this.addPlatforms(platformObjects);
      camera.startFollow(this.player.sprite, true, 0.08, 0.08);
      this.addColliders(collisionLayer);
      this.addLevelEnd(map, this.player, () => this.levelEnd());
    });
  }

  update() {
    super.update();
    this.player?.update(
      this.cursors.left.isDown,
      this.cursors.right.isDown,
      this.cursors.up.isDown || this.cursors.space.isDown
    );

    this.platforms.map((p) => p.update());
  }
}
