import Ball from "./ball";
import Chicken from "./chicken";
import Fighter from "./fighter";
import SeeMonster from "./seeMonster";

export type Enemy = Fighter | Chicken | SeeMonster;
export type Enemies = Enemy[];

export interface IPlayer {
    scene: Phaser.Scene;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    orientation?: "left" | "right";
    balls?: Ball[];
    isDead: boolean;
    update: (goLeft: boolean, goRight: boolean, jump: boolean, _kneel: boolean) => void; 
    shoot?: () => Ball | undefined;
    addBall: (ball: Ball) => void;
    die: () => void;
}

export interface IMonster {
  scene: Phaser.Scene;
  sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  update: () => void;
  die: (preventCallback?: boolean) => void;
}