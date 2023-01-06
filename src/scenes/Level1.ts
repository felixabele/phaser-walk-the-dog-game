import BaseLevel from "./BaseLevel";

export default class Level1 extends BaseLevel {
  constructor() {
    super("Level1Scene");
    this.nextLevel = "Level2Scene";
  }

  preload() {
    this.load.tilemapTiledJSON("map1", "assets/level_1_tiles.json");
  }

  create() {
    super.create("map1", "tiles", "level");
  }
}
