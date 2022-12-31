import Phaser from "phaser";
import Player from "./player";

type Size = "platform_small" | "platform_medium" | "platform_big";

export default class MovingPlatform {
  scene: Phaser.Scene;
  player?: Player;
  threshold: number;

  public image: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  direction: "left" | "right" = "left";
  speed: number = 1;
  minXposition: number = 0;
  maxXposition: number = 0;

  constructor(
    scene: Phaser.Scene,
    player?: Player,
    x: number = 0,
    y: number = 0,
    size: Size = "platform_big",
    threshold: number = 400
  ) {
    this.scene = scene;
    this.player = player;
    this.threshold = threshold;

    this.minXposition = x - this.threshold;
    this.maxXposition = x + this.threshold;

    this.image = this.scene.physics.add.image(x, y, "platforms", size);
    this.image.setImmovable(true);
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
      this.image.setVelocityX(-100);
    } else if (this.direction === "right") {
      this.image.setVelocityX(+100);
    }
  }

  public update(): void {
    this.calculateDirection();
    this.move();
  }
}
