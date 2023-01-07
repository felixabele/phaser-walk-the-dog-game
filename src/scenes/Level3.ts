import BaseLevel from "./BaseLevel";

export default class Level3 extends BaseLevel {
  constructor() {
    super("Level3Scene");
    this.nextLevel = "";
  }

  preload() {
    this.load.tilemapTiledJSON("map3", "assets/level_3_tiles.json");
  }

  create() {
    super.create("map3", "tiles", "titles_01", "galleria", false);
  }
}
