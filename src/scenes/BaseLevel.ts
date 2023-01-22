import { IMonster, IPlayer } from "./../types";
import { propertyMap } from "../utils";
import Fighter from "../fighter";
import SceneDisplay from "../sceneDisplay";
import Chicken from "../chicken";
import Clouds from "./Clouds";
import Ball from "../ball";
import ObjectGenerator from "../objectGenerator";
import MovingPlatform from "../movingPlatform";
import createBackground from "./createBackground";
import SeeMonster from "../seeMonster";

export default class BaseLevel extends Phaser.Scene {
  type: "underwater" | "land" = "land";
  player?: IPlayer;
  clouds?: Clouds;
  nextLevel?: string;
  monsters: IMonster[] = [];
  platforms: MovingPlatform[] = [];

  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  map!: Phaser.Tilemaps.Tilemap;
  objectGenerator!: ObjectGenerator;
  collisionLayer!: Phaser.Tilemaps.TilemapLayer;
  sceneDisplay!: SceneDisplay;

  killMonster(monster: IMonster) {
    this.monsters = this.monsters.filter((m) => m !== monster);
    monster?.die();
  }

  addMonster(
    Klass: typeof Chicken | typeof Fighter | typeof SeeMonster,
    xPosition: number = 0,
    yPosition: number = 0,
    onMonsterDefeat?: () => void
  ) {
    if (this.player?.isDead) return;
    const monster = new Klass(this, xPosition, yPosition, onMonsterDefeat);
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
      this.addMonster(Fighter, fighter.x, fighter.y);
    });

    const seeMonsters = this.objectGenerator.findObjects("SeeMonster");
    seeMonsters.forEach((fighter) => {
      this.addMonster(SeeMonster, fighter.x, fighter.y);
    });
  }

  addChicken() {
    const chicken = this.objectGenerator.findObjects("Chicken");
    const addChick = (chick: any) => {
      this.addMonster(Chicken, chick.x, chick.y, () => addChick(chick));
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

  levelEnd() {
    this.killCharacters();
    this.sceneDisplay.showSuccess(this.nextLevel);
  }

  killPlayer() {
    this.killCharacters();
    this.sceneDisplay.showGameOver();
  }

  addLevelEnd(map: Phaser.Tilemaps.Tilemap, onEnd?: () => void) {
    if (!this.player) return;
    const endLayer = this.physics.add.staticGroup();
    const endObjects = map.getObjectLayer("End").objects;
    if (!endObjects.length) throw new Error("End Object missing");
    const endObj = endLayer
      .create(endObjects[0].x, endObjects[0].y, "end")
      .setVisible(false);
    this.physics.add.overlap(this.player.sprite, endObj, onEnd);
  }

  addShotBinding() {
    this.input.keyboard.on("keydown", (event: any) => {
      if (["Enter"].includes(event.key)) {
        if (this.player?.shoot) {
          const ball = this.player.shoot();
          this.addMonsterHittest(ball);
        }
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
    tilesetName: string = "titles_01",
    background: string = "mountains",
    loadClouds: boolean = true,
  ) {
    this.cursors = this.input.keyboard.createCursorKeys();
    createBackground(background, this);
    if (loadClouds) {
      this.clouds = new Clouds(this);
    }
    this.sceneDisplay = new SceneDisplay(this);

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

    this.addLevelEnd(this.map, () => this.levelEnd());
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
      this.cursors.up.isDown || this.cursors.space.isDown,
      this.cursors.down.isDown,
    );
    this.platforms.map((p) => p.update());
  }
}
