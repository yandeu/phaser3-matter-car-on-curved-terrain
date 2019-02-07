import Restart from '../objects/restart'
import Gas from '../objects/gas'
import MainScene from './mainScene'

export default class GuiScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GuiScene' })
  }

  create() {
    // @ts-ignore
    const mainScene: MainScene = this.scene.get('MainScene')

    new Restart(this).addRestartButton()
    new Gas(this, mainScene.car)
  }
}
