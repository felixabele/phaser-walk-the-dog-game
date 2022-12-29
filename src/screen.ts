import Phaser from "phaser";

function getScreenCenter(scene: Phaser.Scene): { x: number; y: number } {
  return {
    x: scene.cameras.main.worldView.x + scene.cameras.main.width / 2,
    y: scene.cameras.main.worldView.y + scene.cameras.main.height / 2,
  };
}

function setScreenText(
  text: string,
  scene: Phaser.Scene
): Phaser.GameObjects.GameObject {
  const { x, y } = getScreenCenter(scene);
  scene.add
    .renderTexture(
      scene.cameras.main.worldView.x,
      0,
      scene.game.canvas.width,
      scene.game.canvas.height
    )
    .fill(0x000000, 0.5);
  return scene.add
    .text(x, y, text, { font: "74px sans-serif" })
    .setOrigin(0.5)
    .setStroke("#000000", 6);
}

export { setScreenText, getScreenCenter };
