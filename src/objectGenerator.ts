import Phaser from "phaser";
import Player from "./player";
import BaseLevel from "./scenes/BaseLevel";

export default class ObjectGenerator {
  public scene: BaseLevel;
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: BaseLevel) {
    this.scene = scene;
    this.map = this.scene.map;
  }

  public createPlayer(): Player {
    const spawnPoint = this.map.findObject("Spawn", () => true);
    return new Player(this.scene, spawnPoint.x, spawnPoint.y);
  }

  public findObjects(name: string): Phaser.Types.Tilemaps.TiledObject[] {
    const layer = this.map.getObjectLayer(name);
    return layer ? layer.objects : [];
  }
}
