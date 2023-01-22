const mountainBackground = (scene: Phaser.Scene) => {
  const height = scene.scale.height;
  scene.add
    .image(0, 0, "mountains")
    .setOrigin(0, 1)
    .setScrollFactor(0.75)
    .setDepth(0)
    .setScale(0.5)
    .setX(500)
    .setY(height + 160);
};

const galleriaBackground = (scene: Phaser.Scene) => {
  const height = scene.scale.height;
  scene.add
    .image(0, 0, "galleria")
    .setOrigin(0, 1)
    .setScrollFactor(0.85)
    .setDepth(0)
    .setScale(0.85)
    .setAlpha(0.75)
    .setY(height + 160);
};

const underwaterBackground = (scene: Phaser.Scene) => {
  const height = scene.scale.height;
  scene.add
    .image(200, height + 10, "underwater")
    .setOrigin(0, 1)
    .setScrollFactor(0.85)
    .setDepth(0)
    .setScale(0.75)
    .setAlpha(0.45);
};

export default (background: string, scene: Phaser.Scene): void => {
  switch (background) {
    case "mountains":
      mountainBackground(scene);
      break;
    case "galleria":
      galleriaBackground(scene);
      break;
    case "underwater":
      underwaterBackground(scene);
      break
    default:
      break;
  }
};
