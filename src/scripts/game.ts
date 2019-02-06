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

const ratio = Math.max(window.innerWidth / window.innerHeight, window.innerHeight / window.innerWidth)
const DEFAULT_HEIGHT = 720
const DEFAULT_WIDTH = ratio * DEFAULT_HEIGHT

const config: GameConfig = {
  backgroundColor: '#ffffff',
  parent: 'phaser-game',
  scale: {
    mode: Phaser.Scale.FIT,
    // @ts-ignore
    autoCenter: Phaser.DOM.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
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
