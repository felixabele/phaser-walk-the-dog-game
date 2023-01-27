import Phaser from "phaser";
import { randomInteger, randomDecimal } from "../utils";

interface Cloud {
  image: Phaser.GameObjects.Image;
  velocity: number;
}

export default class Clouds {
  private scene: Phaser.Scene;
  private cloudImages: Cloud[];
  private frames: string[];
  private worldEnd: number;

  constructor(scene: Phaser.Scene, count: number = 4) {
    this.scene = scene;
    this.cloudImages = [];
    this.frames = [];
    this.worldEnd = 2240;

    const atlasTexture = this.scene.textures.get("clouds");
    this.frames = atlasTexture.getFrameNames();

    this.cloudImages = [...Array(count)].map(() => {
      const xPosition = randomInteger(-600, 1800);
      return this.createCloud(xPosition);
    });
  }

  createCloud(xPosition: number): Cloud {
    const randomFrame = this.frames[randomInteger(0, this.frames.length - 1)];
    const scale = randomDecimal(0.6, 1);
    const image = this.scene.add
      .image(xPosition, randomInteger(-70, 300), "clouds", randomFrame)
      .setAlpha(0.7)
      .setScrollFactor(1)
      .setDepth(0)
      .setScale(scale);
    const velocity = randomDecimal(0.1, 0.6);
    return { image, velocity };
  }

  killAndRecreateCloud(cloudIndex: number): void {
    const oldCloud = this.cloudImages.splice(cloudIndex, 1)[0];
    oldCloud.image.destroy();
    const newCloud = this.createCloud(-400);
    this.cloudImages.push(newCloud);
  }

  update(): void {
    this.cloudImages.forEach(({ image, velocity }, i) => {
      image.x += velocity;

      if (image.x - image.width > this.worldEnd) {
        this.killAndRecreateCloud(i);
      }
    });
  }
}
