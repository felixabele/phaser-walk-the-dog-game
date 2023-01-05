import Phaser from "phaser";
import Monster from "./monster";
import { randomInteger, randomDecimal } from "./utils";

export default class Chicken extends Monster {
  static spritesheet = {
    key: "chicken",
    url: "/assets/chicken-sprite.png",
    frameConfig: {
      frameWidth: 146,
      frameHeight: 144,
      endFrame: 4,
    },
  };

  bouncingSpeed: number = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, "chicken", x, y);
    const { anims } = this.scene;

    this.walkingSpeed = randomInteger(70, 120);
    this.bouncingSpeed = randomDecimal(0.7, 1);

    this.sprite
      .setBounce(this.bouncingSpeed)
      .setScale(0.5, 0.5)
      .setFlipX(true)
      .setBounce(this.bouncingSpeed)
      .setCollideWorldBounds(false);

    anims.create({
      key: "chicken-walk",
      frames: anims.generateFrameNumbers("chicken", { frames: [0, 1, 2, 3] }),
      frameRate: 6,
    });
  }
}
