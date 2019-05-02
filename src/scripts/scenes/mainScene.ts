import Bridge from '../objects/bridge'
//import Terrain from '../objects/terrain'
import Terrain from '../objects/terrainDynamic'
import Car from '../objects/car'
import Gas from '../objects/gas'
import Restart from '../objects/restart'
import { Scene } from 'phaser'

export default class MainScene extends Phaser.Scene {
  car: Car
  terrains: Terrain[]

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    //this.matter.add.mouseSpring({})

    const path1 =
      'M -10.837105,399.91531 C -10.837105,399.91531 360.95089,618.41855 633.74796,640.65452 933.27973,665.06975 1194.6484,497.3518 1498.1559,507.62844 1727.0472,515.37863 1898.3125,665.99098 2109.7652,650.73232 2479.5945,624.04507 2737.3742,278.22805 3107.1744,251.27988 3425.2674,283.59165 3926.4207,433.05255 4489.1112,512.4571 4597.6107,527.76814 4722.879,469.1338 4833.3691,482.03476 4868.8117,486.17313 4939.2658,567.09253 4974.475,571.28218 5639.6416,650.43241 6256.8855,671.72797 6588.8994,674.43736 6943.2645,673.42027 7277.3722,403.89083 7743.1187,388.41574 8023.5431,379.09821 8167.268,733.32913 8445.1661,682.98562 9142.1521,556.72082 9382.633,653.43022 9660.1193,642.80088 9803.5716,637.30582 10351.968,200.05637 10670.53,200.2844 10999.895,200.52023 11134.798,-19.470908 11345.368,0.88878878 11664.594,31.754353 12026.765,223.6594 12296.609,161.811 12838.032,37.716588 12837.788,533.42456 12847.221,532.71357'
    const path2 =
      'M 11617.063,3528.4898 C 11621.249,3524.7808 11611.68,3447.0568 11669.83,3358.5231 11865.52,3060.5827 11575.859,3311.6521 11343.718,3201.6923 11139.351,3104.8886 10961.733,3006.1663 10729.49,2913.6747 10396.606,2781.1024 10101.548,2541.1218 9731.5518,2514.1701 9413.2902,2546.4861 8911.8712,2695.9665 8348.8826,2775.3815 8240.3255,2790.6945 8114.9908,2732.0525 8004.4422,2744.9552 7968.9808,2749.094 7713.9634,2870.0174 7678.7355,2874.2076 7013.2163,2953.3682 6587.2685,2808.9798 6247.9814,2937.3829 5829.5541,3056.3456 5559.1438,2666.801 5093.1504,2651.3239 4812.5774,2642.0051 4668.7763,2996.2823 4390.7309,2945.9322 3693.3755,2819.6509 3452.7672,2916.373 3175.1339,2905.7423 3031.6055,2900.2465 2546.7924,2588.6333 2228.0616,2588.8613 1898.5226,2589.0972 1699.6737,2243.384 1488.9922,2263.7464 1169.5965,2294.616 807.23392,2486.5461 537.2465,2424.6896 -4.4640133,2300.579 -4.2193389,2796.3516 -13.657313,2795.6406'

    new Bridge(this, -960 - 200, 740, 960, 18)
    new Bridge(this, 10003 + 2500, 542, 960, 18)
    const terrain1 = new Terrain(this, path1, -200, 350, 1)
    const terrain2 = new Terrain(this, path2, 10826 - 81 + 2500, 5 + 375, 2)
    this.terrains = [terrain1, terrain2]
    this.car = new Car(this, 490, 650)

    // check of the rear wheels are touching the ground
    this.matter.world.on('collisionactive', (collisions: any, b: any, c: any) => {
      this.car.wheelsDown = { rear: false, front: false }
      collisions.pairs.forEach((pair: any) => {
        let labels: string[] = [pair['bodyA'].label, pair['bodyB'].label]
        if (labels.includes('wheelRear')) {
          this.car.wheelsDown.rear = true
        }
        if (labels.includes('wheelFront')) {
          this.car.wheelsDown.front = true
        }
      })
    })

    // listen to pointerdown click events and show world coordinates
    // this.input.addListener('pointerdown', (pointer: Phaser.Input.Pointer) => {
    //   console.log(pointer.worldX, pointer.worldY)
    // })

    // hide the loading screen
    let loadingScreen = document.getElementById('loading-screen')
    if (loadingScreen) loadingScreen.style.display = 'none'
  }

  update() {
    //console.log(this.cameras.main.worldView.x, this.cameras.main.worldView.width)
    this.terrains.forEach(terrain => {
      terrain.update()
    })

    // fix the camera to the car
    const carBody = this.car.bodies[0]
    this.cameras.main.centerOn(carBody.position.x + 300, carBody.position.y - 100)

    // set the smooth zoom
    const wheelRear = this.car.bodies[1]
    const currentZoom = this.cameras.main.zoom
    let zoom = 1 - wheelRear.angularVelocity / 1.65
    if (zoom > currentZoom + currentZoom * 0.0022) zoom = currentZoom + currentZoom * 0.0022
    else if (zoom < currentZoom - currentZoom * 0.0022) zoom = currentZoom - currentZoom * 0.0022
    if (zoom > 1) zoom = 1
    if (zoom < 0.6) zoom = 0.6
    this.cameras.main.setZoom(zoom)

    this.car.update()
  }
}
