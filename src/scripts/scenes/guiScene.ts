import Restart from '../objects/restart'
import Gas from '../objects/gas'
import MainScene from './mainScene'

export default class GuiScene extends Phaser.Scene {
  fpsText: FpsText

  constructor() {
    super({ key: 'GuiScene' })
  }

  create() {
    // @ts-ignore
    const mainScene: MainScene = this.scene.get('MainScene')

    new Restart(this).addRestartButton()
    new Gas(this, mainScene.car)

    this.fpsText = new FpsText(this)

    this.add
      .text(this.cameras.main.width - 10, 10, `Phaser: v${Phaser.VERSION}`, { color: 'black', fontSize: 28 })
      .setOrigin(1, 0)
      .setScrollFactor(0)

    this.add
      .text(this.cameras.main.width - 10, 10 + 28 + 8, `Render: ${window.RENDERING_CONTEXT}`, {
        color: 'black',
        fontSize: 28
      })
      .setOrigin(1, 0)
      .setScrollFactor(0)
  }
  update() {
    this.fpsText.update(this)
  }
}

class FpsText extends Phaser.GameObjects.Text {
  constructor(scene: Phaser.Scene) {
    super(scene, 10, 10, '', { color: 'black', fontSize: 28 })
    scene.add.existing(this)
    this.setOrigin(0)
    this.setScrollFactor(0)
  }

  public update(scene: Phaser.Scene) {
    this.setText(`fps: ${Math.round(scene.game.loop.actualFps)}`)
  }
}
