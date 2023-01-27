import Phaser from "phaser";
import Ball from "./ball";
import { IPlayer } from "./types";

export default class Player implements IPlayer {
  static spritesheet = {
    key: "player",
    url: "/assets/white-dog-sprite.png",
    frameConfig: {
      frameWidth: 728,
      frameHeight: 316,
      endFrame: 5,
    },
  };

  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public orientation: "left" | "right" = "right";
  public balls: Ball[];
  public isDead: boolean = false;

  constructor(scene: Phaser.Scene, x: number = 0, y: number = 0) {
    this.scene = scene;
    this.balls = [];
    this.sprite = scene.physics.add
      .sprite(x, y, "player", 0)
      .setScale(0.25, 0.25)
      .setFlipX(true)
      .setSize(300, 300)
      .setCollideWorldBounds(false);

    this.initAnmations();
  }

  private initAnmations(): void {
    const { anims } = this.scene;

    anims.create({
      key: "walk",
      frames: anims.generateFrameNumbers("player", { frames: [0, 1, 2, 3] }),
      frameRate: 8,
    });

    anims.create({
      key: "stop",
      frames: anims.generateFrameNumbers("player", { frames: [3, 0] }),
      frameRate: 8,
    });

    anims.create({
      key: "jump",
      frames: anims.generateFrameNumbers("player", { frames: [4, 5] }),
      frameRate: 8,
    });
  }

  public update(goLeft: boolean, goRight: boolean, jump: boolean, _kneel: boolean): void {
    if (this.isDead) return;

    const { x, y } = this.sprite.body.velocity;
    const isJumping = y !== 0;
    const isWalking = x !== 0;

    if (!isWalking && !isJumping) {
      this.sprite.play({ key: "stop" });
    } else if (isJumping) {
      this.sprite.setFrame(5);
    }

    // Horizontal movement
    if (goLeft) {
      this.walkLeft();
    } else if (goRight) {
      this.walkRight();
    } else {
      this.sprite.body.setVelocityX(0);
    }

    if (jump && !isJumping) {
      this.jump();
    }
  }

  public shoot(): Ball | undefined {
    if (!this.balls.length || this.isDead) return;
    const ball = this.balls.pop();
    ball?.shoot();
    return ball;
  }

  public addBall(ball: Ball) {
    this.balls.push(ball);
    const xPos = 40 + this.balls.length * 14;
    ball.addToInventary(xPos);
  }

  private walkLeft(): void {
    this.orientation = "left";
    this.sprite.flipX = false;
    this.sprite.body.setVelocityX(-120);
    this.sprite.play({ key: "walk", repeat: 1 }, true);
  }

  private walkRight(): void {
    this.orientation = "right";
    this.sprite.play({ key: "walk", repeat: 1 }, true);
    this.sprite.flipX = true;
    this.sprite.body.setVelocityX(120);
  }

  private jump(): void {
    setTimeout(() => {
      this.sprite.body.setVelocityY(-200);
    }, 200);
    this.sprite.play({ key: "jump" });
  }

  public die() {
    this.isDead = true;
    this.sprite.destroy();
  }
}
