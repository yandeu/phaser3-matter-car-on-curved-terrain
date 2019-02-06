import Restart from './restart'

export default class Car {
  bodies: any[] = []
  gas = {
    right: false,
    left: false
  }
  wheelsDown = {
    rear: false,
    front: false
  }
  private _scene: Phaser.Scene

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number = 252,
    height: number = 90,
    wheelSize: number = 25,
    wheelOffset: { x: number; y: number } = { x: 40, y: 35 }
  ) {
    this._scene = scene

    const wheelBase = wheelOffset.x,
      wheelAOffset = -width * 0.5 + wheelBase,
      wheelBOffset = width * 0.5 - wheelBase,
      wheelYOffset = wheelOffset.y

    let group = scene.matter.world.nextGroup(true)

    let body = scene.matter.add.image(x, y, 'car')
    body.setBody(
      {
        type: 'rectangle',
        width: width,
        height: height
      },
      {
        label: 'carBody',
        collisionFilter: {
          group: group
        },
        chamfer: {
          radius: height * 0.5
        },
        density: 0.05
      }
    )

    let wheelA = scene.matter.add.image(x + wheelAOffset, y + wheelYOffset, 'wheel')
    wheelA.setBody(
      {
        type: 'circle',
        radius: wheelSize
      },
      {
        label: 'wheelRear',
        collisionFilter: {
          group: group
        },
        friction: 0.8,
        density: 0.05
      }
    )

    let wheelB = scene.matter.add.image(x + wheelBOffset, y + wheelYOffset, 'wheel')
    wheelB.setBody(
      {
        type: 'circle',
        radius: wheelSize
      },
      {
        label: 'wheelFront',
        collisionFilter: {
          group: group
        },
        friction: 0.8,
        density: 0.05
      }
    )

    let axelA = scene.matter.add.constraint(body.body, wheelA.body, 2, 0.95, {
      pointA: { x: wheelAOffset, y: wheelYOffset }
    })

    let axelB = scene.matter.add.constraint(body.body, wheelB.body, 2, 0.95, {
      pointA: { x: wheelBOffset, y: wheelYOffset }
    })

    this.bodies = [body.body, wheelA.body, wheelB.body]
  }

  update() {
    const VELOCITY = 14 / 2

    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter
    const carBody = this.bodies[0]

    // restart the game if the car falls
    if (carBody.position.y > 3000) Restart.restart(this._scene)

    if (this.wheelsDown.rear) {
      let tan = Math.tan(carBody.angle)
      //let deg = Phaser.Math.RadToDeg(carBody.angle)

      let x = VELOCITY * (2 - Math.abs(tan))
      let y = VELOCITY * tan

      if (this.gas.right) {
        Matter.Body.setVelocity(carBody, { x: x, y: y })
      } else if (this.gas.left) {
        Matter.Body.setVelocity(carBody, { x: -x * 0.7, y: -y * 0.7 })
      }
    }
  }
}
