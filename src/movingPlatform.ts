import Phaser from "phaser";
import { IPlayer } from "./types";

type Size = "platform_small" | "platform_medium" | "platform_big";

export default class MovingPlatform {
  scene: Phaser.Scene;
  player?: IPlayer;
  speed: number;

  public image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  direction: "left" | "right" = "left";
  minXposition: number = 0;
  maxXposition: number = 0;

  constructor(
    scene: Phaser.Scene,
    player?: IPlayer,
    x: number = 0,
    y: number = 0,
    config: Map<string, any> = new Map()
  ) {
    this.scene = scene;
    this.player = player;

    const size: Size = config.get("size") || "platform_big";
    const threshold: number = config.get("threshold") || 400;
    this.speed = config.get("speed") || 100;

    this.minXposition = x;
    this.maxXposition = x + threshold;

    this.image = this.scene.physics.add
      .image(x, y, "platforms", size)
      .setScale(1)
      .setImmovable(true);
    this.image.body.allowGravity = false;

    if (this.player) {
      this.scene.physics.add.collider(this.player.sprite, this.image);
    }
  }

  private calculateDirection(): void {
    if (this.image.x < this.minXposition) {
      this.direction = "right";
    } else if (this.image.x > this.maxXposition) {
      this.direction = "left";
    }
  }

  private move(): void {
    if (this.direction === "left") {
      this.image.setVelocityX(this.speed * -1);
    } else if (this.direction === "right") {
      this.image.setVelocityX(this.speed);
    }
  }

  public update(): void {
    this.calculateDirection();
    this.move();
  }
}
