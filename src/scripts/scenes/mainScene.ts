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

    // blue background
    this.add
      .graphics({ x: 0, y: 0 })
      .fillGradientStyle(0x43c1d8, 0x43c1d8, 0x91eef5, 0x91eef5)
      .fillRect(0, 0, this.cameras.main.width, this.cameras.main.height)
      .setScrollFactor(0)

    const path1 =
      'M 74.81666,514.21742 C 74.81666,514.21742 374.321,732.78572 594.0804,755.02832 835.3767,779.45082 1045.9297,611.68292 1290.4287,621.96262 1474.8186,629.71512 1612.7862,780.37232 1783.1279,765.10912 2081.0544,738.41392 2288.7161,392.49392 2586.6191,365.53772 2842.8679,397.85915 3246.5862,547.36452 3699.8774,626.79279 3787.2823,642.10836 3888.1957,583.45654 3977.2041,596.36139 4005.7559,600.50096 4062.5122,681.44448 4090.876,685.63538 4626.7198,764.80918 5123.9581,786.11104 5391.4213,788.82122 5676.8901,787.80382 5946.04,518.19412 6321.2353,502.71442 6547.1391,493.39412 6662.9208,847.73052 6886.7895,797.37202 7448.2663,671.06962 7641.9925,767.80782 7865.5294,757.17532 7981.0915,751.67862 8422.8681,314.29902 8679.4947,314.52712 8944.8236,314.76302 9053.4985,94.706358 9223.129,115.07212 9480.291,145.94688 9772.0478,337.90909 9989.4286,276.04226 10425.588,151.91089 10425.391,647.76642 10432.99,647.05522 10448.54,645.59995 10447.409,938.37882 10446.475,1045.4974 10446.266,1069.467 90.39953,1089.8545 90.39953,1089.8545'
    const path2 =
      'M 10316.178,2117.1298 C 10316.178,2117.1298 10215.724,1937.6019 9998.9436,1844.7832 9781.7034,1751.7674 9421.8726,1689.1243 9128.8491,1707.6769 8958.1667,1718.4835 8806.4916,1866.0866 8636.1499,1850.8234 8338.2234,1824.1282 8130.5617,1478.2082 7832.6587,1451.252 7576.4099,1483.5734 7172.6916,1633.0788 6719.4004,1712.5071 6631.9955,1727.8226 6531.0821,1669.1708 6442.0737,1682.0757 6413.5219,1686.2152 6208.1942,1807.1588 6179.8304,1811.3497 5643.9866,1890.5235 5301.034,1746.111 5027.8565,1874.5355 4690.9591,1993.5181 4473.2378,1603.9084 4098.0425,1588.4287 3872.1387,1579.1084 3756.357,1933.4448 3532.4883,1883.0863 2971.0115,1756.7839 2777.2853,1853.5221 2553.7484,1842.8896 2438.1863,1837.3929 2047.8383,1525.7276 1791.2117,1525.9557 1525.8828,1526.1916 1365.7793,1180.4206 1196.1488,1200.7864 938.9868,1231.6612 647.23,1423.6234 429.8492,1361.7565 -6.3098824,1237.6252 -6.1128824,1733.4807 -13.711882,1732.7695 -29.261882,1731.3142 -28.130882,2024.0931 -27.196882,2131.2117 -26.987882,2155.1813 10328.879,2175.5688 10328.879,2175.5688'

    new Bridge(this, 10003, 542, 960, 16)
    new Terrain(this, path1, -200, 350)
    new Terrain(this, path2, 10826 - 81, 5 + 375)
    this.car = new Car(this, 340, 800)
    new Gas(this, this.car)
    new Restart(this).addRestartButton()

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
    this.cameras.main.centerOn(carBody.position.x, carBody.position.y - 100)

    this.car.update()
  }
}
