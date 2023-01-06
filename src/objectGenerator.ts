import Phaser from "phaser";
import Player from "./player";

export default class ObjectGenerator {
  public scene: Phaser.Scene;
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: Phaser.Scene, map: Phaser.Tilemaps.Tilemap) {
    this.scene = scene;
    this.map = map;
  }

  public createPlayer(): Player {
    const spawnPoint = this.map.findObject("Spawn", () => true);
    return new Player(this.scene, spawnPoint.x, spawnPoint.y);
  }

  public findObjects(name: string): object[] {
    return this.map.getObjectLayer(name).objects;
  }
}
