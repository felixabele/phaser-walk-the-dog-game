import Phaser from "phaser";
import config from "./config";
import StartScene from "./scenes/Start";
import Level1Scene from "./scenes/Level1";
import Level2Scene from "./scenes/Level2";
import Level3Scene from "./scenes/Level3";
import Level4Scene from "./scenes/Level4";
import Level5Scene from "./scenes/Level5";

new Phaser.Game(
  Object.assign(config, {
    scene: [
      StartScene,
      Level1Scene,
      Level2Scene,
      Level3Scene,
      Level4Scene,
      Level5Scene,
    ],
  })
);
