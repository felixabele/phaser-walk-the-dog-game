import BaseLevel from "./BaseLevel";

export default class Level4 extends BaseLevel {
  constructor() {
    super({
      key: "Level4Scene",
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0 },
        },
      },
    });
    this.nextLevel = "";
    this.type = "underwater";
  }

  preload() {
    this.load.image("underwater", "assets/bg_underwater.png");
    this.load.tilemapTiledJSON("map4", "assets/level_4_tiles.json");
  }

  create() {
    super.create("map4", "tiles", "titles_01", "underwater", false);
  }
}
