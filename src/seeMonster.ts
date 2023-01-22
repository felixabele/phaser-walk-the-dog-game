import Phaser from "phaser";
import Monster from "./monster";
import { IMonster } from "./types";
import { randomInteger, randomArrayItem } from "./utils";

export default class SeeMonster extends Monster implements IMonster {
  static spritesheetFish = {
    key: "fish",
    url: "/assets/see_monster_fish_sprite.png",
    frameConfig: {
      frameWidth: 386,
      frameHeight: 185,
      endFrame: 4,
    },
  };

  static spritesheetKraken = {
    key: "kraken",
    url: "/assets/see_monster_kraken_sprite.png",
    frameConfig: {
      frameWidth: 224,
      frameHeight: 185,
      endFrame: 4,
    },
  };

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    afterDeath?: () => void
  ) {
    const fighterName = randomArrayItem<string>(["fish", "kraken"]);
    super(scene, fighterName, x, y, afterDeath);
    const { anims } = this.scene;

    this.walkingSpeed = randomInteger(30, 60);
    this.sprite
      .setScale(0.5, 0.5)
      .setSize(200, 100);

    anims.create({
      key: `${fighterName}-walk`,
      frames: anims.generateFrameNumbers(fighterName, {
        frames: [0, 1, 2, 3],
      }),
      frameRate: 6,
      yoyo: true,
    });

    anims.create({
      key: `${fighterName}-die`,
      frames: anims.generateFrameNumbers(fighterName, {
        frames: [2, 3],
      }),
      frameRate: 6,
    });
  }
}
