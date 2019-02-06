import Car from './car'

export default class Gas {
  constructor(scene: Phaser.Scene, car: Car) {
    // left gas
    scene.add
      .image(20, scene.cameras.main.height - 20, 'gas')
      .setScrollFactor(0)
      .setOrigin(0, 1)
      .setInteractive()
      .on('pointerdown', () => (car.gas.left = true))
      .on('pointerup', () => (car.gas.left = false))

    // right gas
    scene.add
      .image(scene.cameras.main.width - 20, scene.cameras.main.height - 20, 'gas')
      .setScrollFactor(0)
      .setOrigin(1, 1)
      .setInteractive()
      .on('pointerdown', () => (car.gas.right = true))
      .on('pointerup', () => (car.gas.right = false))
  }
}
