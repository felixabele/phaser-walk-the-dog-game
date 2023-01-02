import Phaser from "phaser";
import Button from "../button";
import Player from "../player";
import { getScreenCenter, setScreenText } from "../screen";

export default class Start extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  preload() {
    this.load.image("tiles2", "assets/titles_01.png");
    this.load.tilemapTiledJSON("map2", "assets/level_2_tiles.json");
    this.load.image("mountains", "assets/bg_mountains.png");
    this.load.spritesheet(Player.spritesheet);

    this.load.atlas(
      "clouds",
      "assets/clouds.png",
      "assets/clouds_spritesheet.json"
    );

    this.load.atlas(
      "platforms",
      "assets/platforms.png",
      "assets/platforms_spritesheet.json"
    );
  }

  create() {
    const { x, y } = getScreenCenter(this);
    setScreenText("Bereit zu spielen?", this);
    new Button(x, y + 70, "Starten", this, () =>
      this.scene.start("Level1Scene")
    );

    new Button(x, y + 120, "Starten Level 2", this, () =>
      this.scene.start("Level2Scene")
    );
  }
}
