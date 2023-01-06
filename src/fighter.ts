import Phaser from "phaser";
import Monster from "./monster";
import { randomInteger } from "./utils";

export default class Fighter extends Monster {
  static spritesheet = {
    key: "fighter",
    url: "/assets/fighter_3_sprite.png",
    frameConfig: {
      frameWidth: 200,
      frameHeight: 185,
      endFrame: 6,
    },
  };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    afterDeath?: () => void
  ) {
    super(scene, "fighter", x, y, afterDeath);
    const { anims } = this.scene;

    this.walkingSpeed = randomInteger(50, 80);
    this.sprite.setScale(0.5, 0.5);

    anims.create({
      key: "fighter-walk",
      frames: anims.generateFrameNumbers("fighter", {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 6,
    });

    anims.create({
      key: "fighter-die",
      frames: anims.generateFrameNumbers("fighter", {
        frames: [4, 5, 6],
      }),
      frameRate: 6,
    });
  }
}
