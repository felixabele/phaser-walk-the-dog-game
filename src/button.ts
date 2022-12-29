export default class Button {
  constructor(x: number, y: number, label: string, scene: Phaser.Scene, callback: () => void) {
    const button = scene.add.text(x, y, label, { font: '20px sans-serif' })
      .setOrigin(0.5)
      .setPadding(10)
      .setStyle({ backgroundColor: '#000' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => callback())
      .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => button.setStyle({ fill: '#FFF' }));
  }
}