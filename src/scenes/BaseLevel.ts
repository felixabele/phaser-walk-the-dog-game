import { Enemy } from "./../types";
import { propertyMap } from "../utils";
import Button from "../button";
import Fighter from "../fighter";
import Chicken from "../chicken";
import Player from "../player";
import { getScreenCenter, setScreenText } from "../screen";
import Clouds from "./Clouds";
import Ball from "../ball";
import ObjectGenerator from "../objectGenerator";
import MovingPlatform from "../movingPlatform";

export default class BaseLevel extends Phaser.Scene {
  player?: Player;
  clouds?: Clouds;
  nextLevel?: string;
  monsters: Chicken[] | Fighter[] = [];
  platforms: MovingPlatform[] = [];

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  map!: Phaser.Tilemaps.Tilemap;
  objectGenerator!: ObjectGenerator;
  collisionLayer!: Phaser.Tilemaps.TilemapLayer;

  killMonster(monster: Enemy) {
    this.monsters = this.monsters.filter((m) => m !== monster);
    monster?.die();
  }

  addMonster(
    Klass: typeof Chicken | typeof Fighter,
    xPosition: number = 0,
    onMonsterDefeat?: () => void
  ) {
    if (this.player?.isDead) return;
    const monster = new Klass(this, xPosition, 0, onMonsterDefeat);
    this.physics.add.collider(
      monster.sprite,
      this.collisionLayer,
      (_, tile: any) => {
        if (tile.properties.kills) {
          this.killMonster(monster);
        }
      }
    );

    this.monsters.push(monster);

    if (this.player) {
      this.physics.add.overlap(this.player.sprite, monster.sprite, () => {
        if (!monster.isDead) {
          this.killPlayer();
        }
      });
    }
  }

  addMonsterHittest(ball?: Ball) {
    if (!ball || ball.isPickedUp) return;

    this.monsters.forEach((monster) => {
      this.physics.add.collider(ball.sprite, monster.sprite, () => {
        if (ball.isDeadly()) {
          this.killMonster(monster);
        }
      });
    });
  }

  addFighter() {
    const figters = this.objectGenerator.findObjects("Fighter");
    figters.forEach((fighter) => {
      this.addMonster(Fighter, fighter.x);
    });
  }

  addChicken() {
    const chicken = this.objectGenerator.findObjects("Chicken");
    const addChick = (chick: any) => {
      this.addMonster(Chicken, chick.x, () => addChick(chick));
    };
    chicken.forEach(addChick);
  }

  addBalls() {
    const balls = this.objectGenerator.findObjects("Balls");
    balls.forEach((ball) => {
      if (this.player) {
        new Ball(this, this.collisionLayer, this.player, ball.x, ball.y);
      }
    });
  }

  addPlatforms() {
    if (!this.player) return;
    const platformObjects = this.objectGenerator.findObjects("Platforms");
    this.platforms = platformObjects.map((platformObj: any) => {
      const config = propertyMap(platformObj.properties);
      return new MovingPlatform(
        this,
        this.player,
        platformObj.x,
        platformObj.y,
        config
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

  levelEnd() {
    this.killCharacters();
    this.showSuccess(this.nextLevel);
  }

  killPlayer() {
    this.killCharacters();
    this.showGameOver();
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

  addShotBinding() {
    this.input.keyboard.on("keydown", (event: any) => {
      if (["Enter"].includes(event.key)) {
        const ball = this.player?.shoot();
        this.addMonsterHittest(ball);
      }
    });
  }

  addColliders() {
    if (!this.player) return;
    const collisionFn = (_: any, tile: any) => {
      if (tile.properties.kills) {
        this.killPlayer();
      }
    };
    this.physics.add.collider(
      this.player.sprite,
      this.collisionLayer,
      collisionFn
    );
  }

  create(
    mapKey: string,
    tilesetKey: string,
    tilesetName: string = "titles_01"
  ) {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.createBackground();
    this.clouds = new Clouds(this);

    this.map = this.make.tilemap({ key: mapKey });
    const camera = this.cameras.main;
    this.objectGenerator = new ObjectGenerator(this);
    camera.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    const tileset = this.map.addTilesetImage(tilesetName, tilesetKey);
    this.collisionLayer = this.map
      .createLayer("collision", tileset, 0, 0)
      .setCollisionByProperty({ collides: true });

    this.player = this.objectGenerator.createPlayer();
    this.addColliders();
    camera.startFollow(this.player.sprite, true, 0.08, 0.08);

    this.addLevelEnd(this.map, this.player, () => this.levelEnd());
    this.addShotBinding();
    this.addBalls();
    this.addPlatforms();
    this.addFighter();
    this.addChicken();
  }

  update() {
    this.clouds?.update();
    this.monsters.forEach((monster) => monster.update());
    this.player?.update(
      this.cursors.left.isDown,
      this.cursors.right.isDown,
      this.cursors.up.isDown || this.cursors.space.isDown
    );
    this.platforms.map((p) => p.update());
  }
}
