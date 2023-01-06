import Phaser from "phaser";
import Monster from "./monster";
import { randomInteger } from "./utils";

export default class Fighter extends Monster {
  static spritesheet3 = {
    key: "fighter3",
    url: "/assets/fighter_3_sprite.png",
    frameConfig: {
      frameWidth: 200,
      frameHeight: 185,
      endFrame: 6,
    },
  };

  static spritesheet2 = {
    key: "fighter2",
    url: "/assets/fighter_2_sprite.png",
    frameConfig: {
      frameWidth: 158,
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
    const nb = randomInteger(2, 3);
    const fighterName = `fighter${nb}`;
    super(scene, fighterName, x, y, afterDeath);
    const { anims } = this.scene;

    this.walkingSpeed = randomInteger(50, 80);
    this.sprite.setScale(0.5, 0.5);

    anims.create({
      key: `${fighterName}-walk`,
      frames: anims.generateFrameNumbers(fighterName, {
        frames: [0, 1, 2, 3, 4],
      }),
      frameRate: 6,
    });

    anims.create({
      key: `${fighterName}-die`,
      frames: anims.generateFrameNumbers(fighterName, {
        frames: [4, 5, 6],
      }),
      frameRate: 6,
    });
  }
}
