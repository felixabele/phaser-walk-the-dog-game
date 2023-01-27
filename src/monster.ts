import Phaser from "phaser";

export default class Monster {
  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  spriteName: string;
  direction: "left" | "right" = "left";
  walkingSpeed: number = 80;
  afterDeath?: () => void;
  isDead: boolean = false;

  constructor(
    scene: Phaser.Scene,
    spriteName: string,
    x: number,
    y: number,
    afterDeath?: () => void
  ) {
    this.scene = scene;
    this.spriteName = spriteName;
    this.sprite = this.scene.physics.add.sprite(x, y, spriteName, 0);
    this.afterDeath = afterDeath;

    this.sprite.body.onWorldBounds = true;
    this.scene.physics.world.on(
      "worldbounds",
      (_b: boolean, _u: boolean, _d: boolean, l: boolean, r: boolean) => {
        this.verticallyBounce(l, r);
      }
    );
  }

  private verticallyBounce(left: boolean, right: boolean): void {
    if (left) {
      this.direction = "right";
    } else if (right) {
      this.direction = "left";
    }
  }

  public update(): void {
    if (!this.sprite.body || this.isDead) return;
    const { left, right } = this.sprite.body.blocked;
    this.verticallyBounce(left, right);

    if (this.direction === "left") {
      this.walkLeft();
    } else if (this.direction === "right") {
      this.walkRight();
    }
  }

  private walkLeft(): void {
    this.sprite.flipX = true;
    this.sprite.body.setVelocityX(this.walkingSpeed * -1);
    this.sprite.play({ key: `${this.spriteName}-walk`, repeat: 1 }, true);
  }

  private walkRight(): void {
    this.sprite.play({ key: `${this.spriteName}-walk`, repeat: 1 }, true);
    this.sprite.flipX = false;
    this.sprite.body.setVelocityX(this.walkingSpeed);
  }

  public die(preventCallback?: boolean) {
    if (!this.sprite || this.isDead) return;
    try {
      this.sprite.play({ key: `${this.spriteName}-die` });
    } catch (error) {}
    this.sprite.body.setVelocityX(0);

    this.isDead = true;
    setTimeout(() => {
      if (!preventCallback && this.afterDeath) {
        this.afterDeath();
      }
      this.sprite.destroy();
    }, 1500);
  }
}
