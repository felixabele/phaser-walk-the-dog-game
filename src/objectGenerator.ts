import Phaser from "phaser";
import Player from "./player";
import SwimmingPlayer from "./swimmingPlayer";
import BaseLevel from "./scenes/BaseLevel";

export default class ObjectGenerator {
  public scene: BaseLevel;
  public map: Phaser.Tilemaps.Tilemap;

  constructor(scene: BaseLevel) {
    this.scene = scene;
    this.map = this.scene.map;
  }

  public createPlayer(): Player | SwimmingPlayer {
    const spawnPoint = this.map.findObject("Spawn", () => true);
    
    if (this.scene.type === "underwater") {
      return new SwimmingPlayer(this.scene, spawnPoint.x, spawnPoint.y);
    } else {
      return new Player(this.scene, spawnPoint.x, spawnPoint.y);
    }
  }

  public findObjects(name: string): Phaser.Types.Tilemaps.TiledObject[] {
    const layer = this.map.getObjectLayer(name);
    return layer ? layer.objects : [];
  }
}
