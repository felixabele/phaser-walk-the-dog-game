import { Enemy } from "./../types";
import Button from "../button";
import Fighter from "../fighter";
import Chicken from "../chicken";
import Player from "../player";
import { getScreenCenter, setScreenText } from "../screen";
import Clouds from "./Clouds";
import Ball from "../ball";

export default class BaseLevel extends Phaser.Scene {
  player?: Player;
  clouds?: Clouds;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  monsters: Chicken[] | Fighter[] = [];

  killMonster(monster: Enemy) {
    this.monsters = this.monsters.filter((m) => m !== monster);
    monster?.die();
  }

  addMonster(
    Klass: typeof Chicken | typeof Fighter,
    collisionLayer: Phaser.Tilemaps.TilemapLayer,
    xPosition: number,
    onMonsterDefeat?: () => void,
    onPlayerDefeat?: () => void
  ) {
    if (this.player?.isDead) return;
    const monster = new Klass(this, xPosition, 0, onMonsterDefeat);
    this.physics.add.collider(monster.sprite, collisionLayer, (_, tile) => {
      if (tile.properties.kills) {
        this.killMonster(monster);
      }
    });

    this.monsters.push(monster);

    if (this.player && onPlayerDefeat) {
      this.physics.add.overlap(
        this.player.sprite,
        monster.sprite,
        onPlayerDefeat
      );
    }
  }

  addMonsterHittest(ball?: Ball) {
    if (!ball || ball.isPickedUp) return;

    this.monsters.forEach((monster) => {
      this.physics.add.collider(ball.sprite, monster.sprite, () =>
        this.killMonster(monster)
      );
    });
  }

  killCharacters() {
    this.player?.die();
    this.player = undefined;
    this.monsters.forEach((monster) => monster.die(true));
    this.monsters = [];
  }

  showGameOver() {
    const { x, y } = getScreenCenter(this);
    setScreenText("Game Over", this);
    new Button(x, y + 70, "Neustarten", this, () => this.scene.restart());
  }

  showSuccess(nextLevel?: string) {
    const { x, y } = getScreenCenter(this);
    setScreenText("!!! Gewonnen !!!", this);
    new Button(x, y + 70, "Neustarten", this, () => this.scene.restart());

    if (nextLevel) {
      new Button(x, y + 120, "Nächstes Level", this, () =>
        this.scene.start(nextLevel)
      );
    }
  }

  addLevelEnd(
    map: Phaser.Tilemaps.Tilemap,
    player: Player,
    onEnd?: () => void
  ) {
    const endLayer = this.physics.add.staticGroup();
    const endObjects = map.getObjectLayer("End").objects;
    if (!endObjects.length) throw new Error("End Object missing");
    const endObj = endLayer
      .create(endObjects[0].x, endObjects[0].y, "end")
      .setVisible(false);
    this.physics.add.overlap(player.sprite, endObj, onEnd);
  }

  createBackground() {
    const height = this.scale.height;
    this.add
      .image(0, 0, "mountains")
      .setOrigin(0, 1)
      .setScrollFactor(0.75)
      .setDepth(0)
      .setScale(0.5)
      .setX(500)
      .setY(height + 160);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createBackground();
    this.clouds = new Clouds(this);
  }

  update() {
    this.clouds?.update();
    this.monsters.forEach((monster) => monster.update());
  }
}
