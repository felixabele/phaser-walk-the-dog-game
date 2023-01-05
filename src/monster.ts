import Phaser from "phaser";

export default class Monster {
  public scene: Phaser.Scene;
  public sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

  spriteName: string;
  direction: "left" | "right" = "left";
  walkingSpeed: number = 80;

  constructor(scene: Phaser.Scene, spriteName: string, x: number, y: number) {
    this.scene = scene;
    this.spriteName = spriteName;
    this.sprite = this.scene.physics.add.sprite(x, y, spriteName, 0);

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
    this.sprite.play({ key: `${this.spriteName}-walk`, repeat: 1 }, true);
  }

  private walkRight(): void {
    this.sprite.play({ key: `${this.spriteName}-walk`, repeat: 1 }, true);
    this.sprite.flipX = false;
    this.sprite.body.setVelocityX(this.walkingSpeed);
  }

  public die(afterDeath?: () => void) {
    this.sprite.destroy();

    if (afterDeath) {
      afterDeath();
    }
  }
}
