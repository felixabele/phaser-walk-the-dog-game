import Phaser from "phaser";
import Player from "./player";

export default class Ball {
  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  public isPickedUp: boolean = false;

  private player: Player;
  private inventaryImage?: Phaser.GameObjects.Image;

  constructor(
    scene: Phaser.Scene,
    collisionLayer: Phaser.Tilemaps.TilemapLayer,
    player: Player,
    x: number = 0,
    y: number = 0
  ) {
    this.scene = scene;
    this.player = player;
    const { physics } = scene;

    this.sprite = this.createBall(x, y);
    physics.add.collider(this.sprite, collisionLayer);
    physics.add.collider(this.sprite, player.sprite, () => this.pickUp());
  }

  public addToInventary(xPos: number) {
    this.inventaryImage = this.scene.add
      .image(xPos, 50, "ball")
      .setScrollFactor(0);
  }

  public shoot() {
    if (!this.isPickedUp) return;
    const { x, y } = this.player.sprite;
    const { orientation } = this.player;
    this.isPickedUp = false;
    const angle = orientation === "left" ? 195 : -15;
    const xStart = orientation === "left" ? x - 70 : x + 70;
    this.sprite.setPosition(xStart, y).setVisible(true);
    this.scene.physics.velocityFromAngle(angle, 600, this.sprite.body.velocity);

    if (this.inventaryImage) {
      this.inventaryImage.destroy();
    }
  }

  public isDeadly(): boolean {
    return this.sprite.body.velocity.x > 0;
  }

  private pickUp() {
    if (this.isPickedUp) return;
    this.sprite.setVisible(false).setY(-100);
    this.isPickedUp = true;
    this.player.addBall(this);
  }

  private createBall(
    x: number = 0,
    y: number = 0
  ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
    return this.scene.physics.add
      .sprite(x, y, "ball")
      .setBounceX(0.1)
      .setBounceY(0.7)
      .setDrag(10)
      .enableBody(true, x, y, true, true);
  }
}
