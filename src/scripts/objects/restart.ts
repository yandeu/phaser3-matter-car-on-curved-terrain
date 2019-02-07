export default class Restart {
  private _scene: Phaser.Scene

  constructor(scene: Phaser.Scene) {
    this._scene = scene
  }

  addRestartButton() {
    // add the restart button
    this._scene.add
      .image(this._scene.cameras.main.width / 2, 15, 'restart')
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setInteractive()
      .on('pointerdown', () => {
        Restart.restart(this._scene)
      })
  }

  static restart(scene: Phaser.Scene) {
    let loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) {
      loadingScreen.style.display = 'flex'
    }
    scene.time.addEvent({
      delay: 250,
      callback: () => {
        const mainScene = scene.scene.get('MainScene')
        mainScene.scene.restart()
        const GuiScene = scene.scene.get('GuiScene')
        GuiScene.scene.restart()
      }
    })
  }
}
