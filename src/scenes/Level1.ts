import Phaser from "phaser";
import Chicken from "../chicken";
import BaseLevel from "./BaseLevel";

export default class Level1 extends BaseLevel {
  constructor() {
    super("Level1Scene");
    this.nextLevel = "Level2Scene";
  }

  preload() {
    this.load.tilemapTiledJSON("map1", "assets/level_1_tiles.json");
  }

  killPlayer() {
    this.killCharacters();
    this.showGameOver();
  }

  addColliders() {
    if (!this.player || !this.collisionLayer) return;
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

  addChicken(chicken: any) {
    if (!this.collisionLayer) return;
    this.addMonster(
      Chicken,
      this.collisionLayer,
      chicken.x,
      () => this.addChicken(chicken),
      () => this.killPlayer()
    );
  }

  create() {
    super.create("map1", "tiles", "level");
    if (!this.player || !this.map || !this.collisionLayer)
      throw new Error("Player or map not generated");

    this.addColliders();
    const chicken = this.map.findObject("Chicken", () => true);
    this.addChicken(chicken);
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
