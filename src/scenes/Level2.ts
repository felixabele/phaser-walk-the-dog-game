import BaseLevel from "./BaseLevel";

export default class Level2 extends BaseLevel {
  constructor() {
    super("Level2Scene");
    this.nextLevel = "Level3Scene";
  }

  preload() {
    this.load.tilemapTiledJSON("map2", "assets/level_2_tiles.json");
  }

  create() {
    super.create("map2", "tiles");
  }
}
