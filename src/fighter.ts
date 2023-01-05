import Phaser from "phaser";
import Monster from "./monster";
import { randomInteger } from "./utils";

export default class Fighter extends Monster {
  static spritesheet = {
    key: "fighter",
    url: "/assets/fighter_3.png",
    frameConfig: {
      frameWidth: 200,
      frameHeight: 185,
      endFrame: 5,
    },
  };

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, "fighter", x, y);
    const { anims } = this.scene;

    this.walkingSpeed = randomInteger(70, 120);

    const frames = anims.generateFrameNumbers("fighter", {
      frames: [0, 1, 2, 3, 4],
    });

    anims.create({
      key: "fighter-walk",
      frames,
      frameRate: 6,
    });
  }
}
