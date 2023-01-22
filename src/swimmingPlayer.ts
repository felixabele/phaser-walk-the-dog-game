import Phaser from "phaser";
import { IPlayer } from "./types";

export default class SwimmingPlayer implements IPlayer {
  static spritesheet = {
    key: "swimmingPlayer",
    url: "/assets/swimming-dog-sprite.png",
    frameConfig: {
      frameWidth: 780,
      frameHeight: 316,
      endFrame: 4,
    },
  };

  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public orientationX: "left" | "right" = "right";
  public orientationY: "up" | "down" = "down";
  public isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
    this.scene = scene;
    this.sprite = scene.physics.add
      .sprite(x, y, "swimmingPlayer", 0)
      .setScale(0.25, 0.25)
      .setSize(300, 316)
      .setFlipX(true)
      .setCollideWorldBounds(false);

    this.initAnmations();
  }

  private initAnmations(): void {
    const { anims } = this.scene;

    anims.create({
      key: "swim",
      frames: anims.generateFrameNumbers("swimmingPlayer", { frames: [0, 1, 2, 3] }),
      frameRate: 8,
    });

    anims.create({
      key: "stop",
      frames: anims.generateFrameNumbers("swimmingPlayer", { frames: [0] }),
    });
  }

  public update(goLeft: boolean, goRight: boolean, goUp: boolean, goDown: boolean): void {
    if (this.isDead) return;

    const isSwimming = goLeft || goRight || goUp || goDown;    

    if (!isSwimming) {
      this.sprite.play({ key: "stop" });
    } else {
      this.sprite.play({ key: "swim", repeat: 1 }, true);
    }

    if (goLeft) {
      this.swimLeft();
    } else if (goRight) {
      this.swimRight();
    } else if (goUp) {
      this.swimUp();
    } else if (goDown) {
      this.swimDown();
    } else {
      const floatingX = this.orientationX === "left" ? -20 : 20;
      const floatingY = this.orientationY === "up" ? -20 : 20;
      this.sprite.body.setVelocity(floatingX, floatingY);
    }
  }

  public addBall() {}

  private swimLeft(): void {
    this.orientationX = "left";
    this.sprite.flipX = false;
    this.sprite.body.setVelocityX(-120);
  }

  private swimRight(): void {
    this.orientationX = "right";
    this.sprite.flipX = true;
    this.sprite.body.setVelocityX(120);
  }

  private swimUp(): void {
    this.orientationY = "up";
    this.sprite.body.setVelocityY(-120);
  }

  private swimDown(): void {
    this.orientationY = "down";    
    this.sprite.body.setVelocityY(120);
  }

  public die() {
    this.isDead = true;
    this.sprite.destroy();
  }
}
