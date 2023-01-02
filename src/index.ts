import Phaser from "phaser";
import config from "./config";
import StartScene from "./scenes/Start";
import Level1Scene from "./scenes/Level1";
import Level2Scene from "./scenes/Level2";

new Phaser.Game(
  Object.assign(config, {
    scene: [StartScene, Level1Scene, Level2Scene],
  })
);
