import Phaser from "phaser";
import Button from "../button";
import { getScreenCenter, setScreenText } from "../screen";

export default class Start extends Phaser.Scene {
  constructor() {
    super("StartScene");
  }

  create() {
    const { x, y } = getScreenCenter(this);
    setScreenText("Bereit zu spielen?", this);
    new Button(x, y + 70, "Starten", this, () => this.scene.start("GameScene"));
  }
}
