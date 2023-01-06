import Phaser from "phaser";
import MovingPlatform from "../movingPlatform";
import { propertyMap } from "../utils";
import BaseLevel from "./BaseLevel";

export default class Level2 extends BaseLevel {
  platforms: MovingPlatform[] = [];

  constructor() {
    super("Level2Scene");
    this.nextLevel = "Level3Scene";
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "assets/level_2_tiles.json");
  }

  addColliders() {
    if (!this.player) return;
    const collisionFn = (_: any, tile: any) => {
      if (tile.properties.kills) {
        this.killPlayer();
      }
    };
    this.physics.add.collider(
      this.player.sprite,
      this.collisionLayer,
      collisionFn
    );
  }

  addPlatforms() {
    if (!this.player) return;
    const platformObjects = this.objectGenerator.findObjects("platforms");
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
    super.create("map2", "tiles");
    this.addPlatforms();
    this.addColliders();
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
