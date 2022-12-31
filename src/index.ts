import Phaser from "phaser";
import config from "./config";
import StartScene from "./scenes/Start";
import GameScene from "./scenes/Game";
import Level2Scene from "./scenes/Level2";

new Phaser.Game(
  Object.assign(config, {
    scene: [StartScene, GameScene, Level2Scene],
  })
);
