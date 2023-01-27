import Chicken from "../chicken";
import BaseLevel from "./BaseLevel";

export default class Level5 extends BaseLevel {
  constructor() {
    super("Level5Scene");
    this.nextLevel = "";
  }

  preload() {
    this.load.tilemapTiledJSON("map5", "assets/level_5_tiles.json");
  }

  addChicken() {
    const addChick = (chick: Phaser.Types.Tilemaps.TiledObject) => {
      const chicken = this.addMonster(Chicken, chick.x, chick.y);
      // generate a new chicken after x seconds
      setTimeout(() => {
        if (chicken) {
          this.killMonster(chicken);
        }
        this.addChicken();
      }, 30_000);
    };
    this.objectGenerator.findObjects("Chicken").forEach(addChick);
  }

  create() {
    // create several chicken and kill them after a while
    // underwater level with a path
    // exploding chicken
    super.create("map5", "tiles");
  }
}
