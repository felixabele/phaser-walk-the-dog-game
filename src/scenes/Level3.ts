import BaseLevel from "./BaseLevel";
import Ball from "../ball";
import Fighter from "../fighter";

export default class Level3 extends BaseLevel {
  constructor() {
    super("Level3Scene");
    this.nextLevel = "";
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "assets/level_3_tiles.json");
  }

  addColliders() {
    if (!this.player) return;
    this.physics.add.collider(this.player.sprite, this.collisionLayer);
  }

  addFighter() {
    this.addMonster(
      Fighter,
      900,
      () => this.addFighter(),
      () => this.killPlayer()
    );
  }

  create() {
    super.create("map3", "tiles");
    if (!this.player) throw new Error("Player or map not generated");

    if (this.collisionLayer) {
      new Ball(this, this.collisionLayer, this.player, 100, 0);
      new Ball(this, this.collisionLayer, this.player, 400, 0);
      new Ball(this, this.collisionLayer, this.player, 600, 0);
    }

    this.addFighter();

    this.input.on(
      "pointerup",
      () => {
        const ball = this.player?.shoot();
        this.addMonsterHittest(ball);
      },
      this
    );
    this.addColliders();
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
