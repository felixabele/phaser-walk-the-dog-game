import Phaser from "phaser";
import Player from "../player";
import Chicken from "../chicken";
import BaseLevel from "./BaseLevel";

export default class Level1 extends BaseLevel {
  player?: Player;
  chicken?: Chicken;

  constructor() {
    super("Level1Scene");
  }

  preload() {
    this.load.image("tiles", "assets/titles_01.png");
    this.load.tilemapTiledJSON("map", "assets/level_1_tiles.json");
    this.load.spritesheet(Chicken.spritesheet);
  }

  killCharacters() {
    this.player?.die();
    this.player = undefined;
    this.chicken?.die();
    this.chicken = undefined;
  }

  killPLayer() {
    this.killCharacters();
    this.showGameOver();
  }

  levelEnd() {
    this.killCharacters();
    this.showSuccess("Level2Scene");
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

  addColliders(layer: Phaser.Tilemaps.TilemapLayer) {
    if (!this.player) return;
    const collisionFn = (_: any, tile: any) => {
      if (tile.properties.kills) {
        this.killPLayer();
      }
    };
    this.physics.add.collider(this.player.sprite, layer, collisionFn);
  }

  create() {
    const map = this.make.tilemap({ key: "map" });
    const camera = this.cameras.main;
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

    super.create();

    const tileset = map.addTilesetImage("level", "tiles");
    const collisionLayer = map
      .createLayer("collision", tileset, 0, 0)
      .setCollisionByProperty({ collides: true });

    map.findObject("Spawn", (spawnPoint) => {
      this.player = new Player(this, spawnPoint.x, spawnPoint.y);
      camera.startFollow(this.player.sprite, true, 0.08, 0.08);
      this.addColliders(collisionLayer);

      map.findObject("Chicken", (chicken) => {
        this.addChicken(collisionLayer, chicken.x);
      });

      this.addLevelEnd(map, this.player, () => this.levelEnd());
    });
  }

  update() {
    super.update();
    this.player?.update(
      this.cursors.left.isDown,
      this.cursors.right.isDown,
      this.cursors.up.isDown || this.cursors.space.isDown
    );

    this.chicken?.update();
  }
}
