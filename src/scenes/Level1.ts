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

  addChicken() {
    const chicken = this.objectGenerator.findObjects("Chicken");
    chicken.forEach((chick) => {
      this.addMonster(
        Chicken,
        chick.x,
        () => this.addChicken(chick),
        () => this.killPlayer()
      );
    });
  }

  create() {
    super.create("map1", "tiles", "level");
    this.addColliders();
    this.addChicken();
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
