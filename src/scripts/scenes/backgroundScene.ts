export default class GuiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BackgroundScene' })
  }

  create() {
    // blue background
    // this.add
    //   .graphics({ x: 0, y: 0 })
    //   .fillGradientStyle(0x43c1d8, 0x43c1d8, 0x91eef5, 0x91eef5)
    //   .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)
    //   .setScrollFactor(0)
    this.cameras.main.setBackgroundColor('#4ba9e4')
    let bg = this.add
      .sprite(0, 0, 'atlas', 'sky')
      .setScrollFactor(0)
      .setOrigin(0)
      .setScale(3)
  }
}
