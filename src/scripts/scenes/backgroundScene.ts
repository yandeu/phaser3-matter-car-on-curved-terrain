export default class GuiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BackgroundScene' })
  }

  create() {
    // blue background
    this.add
      .graphics({ x: 0, y: 0 })
      .fillGradientStyle(0x43c1d8, 0x43c1d8, 0x91eef5, 0x91eef5)
      .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)
      .setScrollFactor(0)
  }
}
