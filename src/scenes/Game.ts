import Phaser from "phaser";
import Player from "../player";
import Chicken from "../chicken";
import Button from "../button";
import { getScreenCenter, setScreenText } from "../screen";
import Clouds from "./Clouds";

export default class Game extends Phaser.Scene {
  cursors: any;

  clouds?: Phaser.Scene;

  player?: Player;

  chicken?: Chicken;

  screenCenter: { x: number; y: number };

  constructor() {
    super("GameScene");
    this.screenCenter = { x: 0, y: 0 };
  }

  preload() {
    this.load.image("tiles", "assets/titles_01.png");
    this.load.tilemapTiledJSON("map", "assets/level_1_tiles.json");
    this.load.spritesheet(Player.spritesheet);
    this.load.spritesheet(Chicken.spritesheet);
  }

  killCharacters() {
    this.player?.die();
    this.player = undefined;
    this.chicken?.die();
    this.chicken = undefined;
    this.scene.remove(this.clouds);
  }

  killPLayer() {
    this.killCharacters();
    this.showGameOver();
  }

  levelEnd() {
    this.killCharacters();
    this.showSuccess();
  }

  showGameOver() {
    const { x, y } = getScreenCenter(this);
    setScreenText("Game Over", this);
    new Button(x, y + 70, "Neustarten", this, () => this.scene.restart());
  }

  showSuccess() {
    const { x, y } = getScreenCenter(this);
    setScreenText("!!! Gewonnen !!!", this);
    new Button(x, y + 70, "Neustarten", this, () => this.scene.restart());
  }

  addChicken(collisionLayer: Phaser.Tilemaps.TilemapLayer, xPosition: number) {
    this.chicken = new Chicken(this, xPosition, 0);
    this.physics.add.collider(
      this.chicken.sprite,
      collisionLayer,
      (_, tile) => {
        if (tile.properties.kills) {
          this.chicken?.die();
          this.chicken = undefined;
          this.addChicken(collisionLayer, xPosition);
        }
      }
    );

    if (this.player) {
      this.physics.add.overlap(this.player.sprite, this.chicken.sprite, () =>
        this.killPLayer()
      );
    }
  }

  addLevelEnd(map: Phaser.Tilemaps.Tilemap, player: Player) {
    const endLayer = this.physics.add.staticGroup();
    const endObjects = map.getObjectLayer("End").objects;
    if (!endObjects.length) throw new Error("End Object missing");
    const endObj = endLayer
      .create(endObjects[0].x, endObjects[0].y, "end")
      .setVisible(false);
    this.physics.add.overlap(player.sprite, endObj, () => this.levelEnd());
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.clouds = this.scene.add("clouds", Clouds, true, { x: 0, y: 0 });
    this.clouds.scene.moveDown();

    // this.createBackgrounds();
    const map = this.make.tilemap({ key: "map" });

    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    const tileset = map.addTilesetImage("level", "tiles");
    const collisionLayer = map.createLayer("collision", tileset, 0, 0);
    collisionLayer.setCollisionByProperty({ collides: true });

    map.findObject("Spawn", (spawnPoint) => {
      this.player = new Player(this, spawnPoint.x, spawnPoint.y);
      camera.startFollow(this.player.sprite, true, 0.08, 0.08);
      this.physics.add.collider(
        this.player.sprite,
        collisionLayer,
        (_, tile) => {
          if (tile.properties.kills) {
            this.killPLayer();
          }
        }
      );

      this.addChicken(collisionLayer, map.widthInPixels);
      this.addLevelEnd(map, this.player);
    });
  }

  update() {
    this.player?.update(
      this.cursors.left.isDown,
      this.cursors.right.isDown,
      this.cursors.up.isDown
    );

    this.chicken?.update();
  }
}
