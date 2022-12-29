import Phaser from "phaser";
import { randomInteger, randomDecimal } from "../utils";

interface Cloud {
  image: Phaser.GameObjects.Image;
  velocity: number;
}

export default class Clouds extends Phaser.Scene {
  private cloudImages: Cloud[];
  private frames: string[];

  constructor() {
    super("CloudsScene");
    this.cloudImages = [];
    this.frames = [];
  }

  preload(): void {
    this.load.image("mountains", "assets/bg_mountains.png");
    this.load.atlas(
      "clouds",
      "assets/clouds.png",
      "assets/clouds_spritesheet.json"
    );
  }

  createCloud(xPosition: number): Cloud {
    const randomFrame = this.frames[randomInteger(0, this.frames.length - 1)];
    const image = this.add
      .image(xPosition, randomInteger(-70, 300), "clouds", randomFrame)
      .setAlpha(0.7)
      .setScrollFactor(1);
    const velocity = randomDecimal(0.1, 0.6);
    return { image, velocity };
  }

  createBackground() {
    const height = this.scale.height;
    this.add
      .image(0, 0, "mountains")
      .setOrigin(0, 1)
      .setScrollFactor(0.25)
      .setDepth(0)
      .setScale(0.7)
      .setY(height + 160);
  }

  killAndRecreateCloud(cloudIndex: number): void {
    this.cloudImages.splice(cloudIndex, 1);
    const newCloud = this.createCloud(-400);
    this.cloudImages.push(newCloud);
  }

  create(): void {
    this.createBackground();
    const atlasTexture = this.textures.get("clouds");
    this.frames = atlasTexture.getFrameNames();

    const initCloudCount = 4;
    this.cloudImages = [...Array(initCloudCount)].map(() => {
      const xPosition = randomInteger(-600, 1800);
      return this.createCloud(xPosition);
    });
  }

  update(): void {
    this.cloudImages.forEach(({ image, velocity }, i) => {
      image.x += velocity;

      // if cloud outside of scene destroy it and recreate
      if (image.x - image.width > this.sys.game.canvas.width) {
        this.killAndRecreateCloud(i);
      }
    });
  }
}
