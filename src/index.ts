import Phaser from 'phaser';
import config from './config';
import StartScene from './scenes/Start';
import GameScene from './scenes/Game';

new Phaser.Game(
  Object.assign(config, {
    scene: [StartScene, GameScene]
  })
);
