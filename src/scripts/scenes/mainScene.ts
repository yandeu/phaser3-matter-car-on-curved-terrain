import Bridge from '../objects/bridge'
import Terrain from '../objects/terrain'
import Car from '../objects/car'
import Gas from '../objects/gas'
import Restart from '../objects/restart'

export default class MainScene extends Phaser.Scene {
  car: Car

  constructor() {
    super({ key: 'MainScene' })
  }

  create() {
    //this.matter.add.mouseSpring({})

    const path1 =
      'M -10.897628,399.93176 C -10.897628,399.93176 288.60672,618.50006 508.36612,640.74266 749.66242,665.16516 960.21539,497.39726 1204.7144,507.67696 1389.1043,515.42946 1527.0719,666.08666 1697.4136,650.82346 1995.3401,624.12826 2203.0018,278.20826 2500.9048,251.25206 2757.1536,283.57346 3160.8719,433.07886 3614.1631,512.50706 3701.568,527.82266 3802.4814,469.17086 3891.4898,482.07566 3920.0416,486.21526 3976.7979,567.15876 4005.1617,571.34966 4541.0055,650.52346 5038.2438,671.82536 5305.707,674.53556 5591.1758,673.51816 5860.3257,403.90846 6235.521,388.42876 6461.4248,379.10846 6577.2065,733.44486 6801.0752,683.08636 7362.552,556.78396 7556.2782,653.52216 7779.8151,642.88966 7895.3772,637.39296 8337.1538,200.0133 8593.7804,200.2414 8859.1093,200.4773 8967.7842,-19.579351 9137.4147,0.78640883 9394.5767,31.661165 9686.3335,223.62336 9903.7143,161.75654 10339.873,37.625175 10339.676,533.48076 10347.275,532.76956 10362.825,531.31426 10361.694,1521.236 10360.76,1628.3545 10360.551,1652.3241 4.6852435,1672.7116 4.6852435,1672.7116'
    const path2 =
      'M 10316.178,3179.9869 C 10316.178,3179.9869 10215.724,3000.459 9998.9436,2907.6403 9781.7034,2814.6245 9421.8726,2751.9814 9128.8491,2770.534 8958.1667,2781.3406 8806.4916,2928.9437 8636.1499,2913.6805 8338.2234,2886.9853 8130.5617,2541.0653 7832.6587,2514.1091 7576.4099,2546.4305 7172.6916,2695.9359 6719.4004,2775.3642 6631.9955,2790.6797 6531.0821,2732.0279 6442.0737,2744.9328 6413.5219,2749.0723 6208.1942,2870.0159 6179.8304,2874.2068 5643.9866,2953.3806 5301.034,2808.9681 5027.8565,2937.3926 4690.9591,3056.3752 4473.2378,2666.7655 4098.0425,2651.2858 3872.1387,2641.9655 3756.357,2996.3019 3532.4883,2945.9434 2971.0115,2819.641 2777.2853,2916.3792 2553.7484,2905.7467 2438.1863,2900.25 2047.8383,2588.5847 1791.2117,2588.8128 1525.8828,2589.0487 1365.7793,2243.2777 1196.1488,2263.6435 938.9868,2294.5183 647.23,2486.4805 429.8492,2424.6136 -6.3098824,2300.4823 -6.1128824,2796.3378 -13.711882,2795.6266 -29.261882,2794.1713 -28.130882,3772.6645 -27.196882,3879.7831 -26.987882,3903.7527 10328.879,3924.1402 10328.879,3924.1402'

    new Bridge(this, 10003, 542, 960, 16)
    new Terrain(this, path1, -200, 350)
    new Terrain(this, path2, 10826 - 81, 5 + 375)
    this.car = new Car(this, 340, 800)

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
    // fix the camera to the car
    const carBody = this.car.bodies[0]
    this.cameras.main.centerOn(carBody.position.x + 200, carBody.position.y - 100)

    // set the smooth zoom
    const wheelRear = this.car.bodies[1]
    const currentZoom = this.cameras.main.zoom
    let zoom = 1 - wheelRear.angularVelocity / 2.5
    if (zoom > currentZoom + currentZoom * 0.002) zoom = currentZoom + currentZoom * 0.002
    else if (zoom < currentZoom - currentZoom * 0.002) zoom = currentZoom - currentZoom * 0.002
    if (zoom > 1) zoom = 1
    this.cameras.main.setZoom(zoom)

    this.car.update()
  }
}
