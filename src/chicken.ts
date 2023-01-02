import Phaser from "phaser";
import { randomInteger, randomDecimal } from "./utils";

export default class Chicken {
  static spritesheet = {
    key: "chicken",
    url: "/assets/chicken-sprite.png",
    frameConfig: {
      frameWidth: 146,
      frameHeight: 144,
      endFrame: 4,
    },
  };

  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private direction: "left" | "right" = "left";
  private walkingSpeed: number = 80;
  private bouncingSpeed: number = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.scene = scene;
    const { anims, physics } = scene;

    this.walkingSpeed = randomInteger(70, 120);
    this.bouncingSpeed = randomDecimal(0.7, 1);

    console.log("init chicken with", {
      walkingSpeed: this.walkingSpeed,
      bouncingSpeed: this.bouncingSpeed,
    });

    this.sprite = physics.add
      .sprite(x, y, "chicken", 0)
      .setScale(0.5, 0.5)
      .setFlipX(true)
      .setBounce(this.bouncingSpeed)
      .setCollideWorldBounds(false);

    this.sprite.body.onWorldBounds = true;
    this.scene.physics.world.on(
      "worldbounds",
      (
        _body: boolean,
        _up: boolean,
        _down: boolean,
        left: boolean,
        right: boolean
      ) => {
        if (left) {
          this.direction = "right";
        } else if (right) {
          this.direction = "left";
        }
      }
    );

    anims.create({
      key: "chicken-walk",
      frames: anims.generateFrameNumbers("chicken", { frames: [0, 1, 2, 3] }),
      frameRate: 6,
    });
  }

  public update(): void {
    if (this.direction === "left") {
      this.walkLeft();
    } else if (this.direction === "right") {
      this.walkRight();
    }
  }

  private walkLeft(): void {
    this.sprite.flipX = true;
    this.sprite.body.setVelocityX(this.walkingSpeed * -1);
    this.sprite.play({ key: "chicken-walk", repeat: 1 }, true);
  }

  private walkRight(): void {
    this.sprite.play({ key: "chicken-walk", repeat: 1 }, true);
    this.sprite.flipX = false;
    this.sprite.body.setVelocityX(this.walkingSpeed);
  }

  public die() {
    this.sprite.destroy();
  }
}
