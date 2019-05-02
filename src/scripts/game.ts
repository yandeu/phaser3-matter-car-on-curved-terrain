import 'phaser'

// poly-decomp and pathseg are required by matterjs
// @ts-ignore
import decomp from 'poly-decomp'
// @ts-ignore
window.decomp = decomp
// @ts-ignore
import 'pathseg'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'
import GuiScene from './scenes/guiScene'
import BackgroundScene from './scenes/backgroundScene'
import CustomCanvas from './customCanvas'

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 720
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

const customCanvas = new CustomCanvas()

const config: GameConfig = {
  type: customCanvas.type,
  canvas: customCanvas.canvas,
  // @ts-ignore
  context: customCanvas.context,
  backgroundColor: '#ffffff',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, BackgroundScene, MainScene, GuiScene],
  physics: {
    default: 'matter',
    matter: {
      gravity: {
        y: 1
      },
      debug: false,
      debugBodyColor: 0x000000
    }
  }
}

window.addEventListener('load', () => {
  let game = new Phaser.Game(config)
})
