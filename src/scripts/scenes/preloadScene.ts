export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.image('tile', 'assets/img/tile.png')
    this.load.image('gas', 'assets/img/gas.png')

    this.load.image('car', 'assets/img/car-small.png')
    this.load.image('wheel', 'assets/img/wheel-small.png')
    this.load.image('restart', 'assets/img/restart-btn.png')
  }

  create() {
    this.scene.start('MainScene')
  }
}
