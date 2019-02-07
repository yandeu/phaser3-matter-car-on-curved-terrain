import Restart from './restart'

export default class Car {
  readonly MAX_SPEED = 0.75
  readonly MAX_SPEED_BACKWARDS = this.MAX_SPEED * 0.75
  readonly ACCELERATION = this.MAX_SPEED / 50
  readonly ACCELERATION_BACKWARDS = this.ACCELERATION * 0.75

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
    wheelOffset: { x: number; y: number } = { x: 38, y: 40 }
  ) {
    this._scene = scene

    const wheelBase = wheelOffset.x,
      wheelAOffset = -width * 0.5 + wheelBase,
      wheelBOffset = width * 0.5 - wheelBase,
      wheelYOffset = wheelOffset.y

    const density = 0.2
    const friction = 0.9

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
        density
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
        friction,
        density
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
        friction,
        density
      }
    )

    let axelA = scene.matter.add.constraint(body.body, wheelA.body, 2, 1, {
      pointA: { x: wheelAOffset, y: wheelYOffset }
    })

    let axelB = scene.matter.add.constraint(body.body, wheelB.body, 2, 1, {
      pointA: { x: wheelBOffset, y: wheelYOffset }
    })

    this.bodies = [body.body, wheelA.body, wheelB.body]
  }

  update() {
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter
    const carBody = this.bodies[0]
    const wheelRear = this.bodies[1]
    const wheelFront = this.bodies[2]

    // restart the game if the car falls
    if (carBody.position.y > 3000) Restart.restart(this._scene)

    if (this.gas.right) {
      let newSpeed = wheelRear.angularSpeed <= 0 ? this.MAX_SPEED / 10 : wheelRear.angularSpeed + this.ACCELERATION
      if (newSpeed > this.MAX_SPEED) newSpeed = this.MAX_SPEED
      Matter.Body.setAngularVelocity(wheelRear, newSpeed)
      Matter.Body.setAngularVelocity(wheelFront, newSpeed)
    } else if (this.gas.left) {
      let newSpeed =
        wheelRear.angularSpeed <= 0
          ? this.MAX_SPEED_BACKWARDS / 10
          : wheelRear.angularSpeed + this.ACCELERATION_BACKWARDS
      if (newSpeed > this.MAX_SPEED_BACKWARDS) newSpeed = this.MAX_SPEED_BACKWARDS
      Matter.Body.setAngularVelocity(wheelRear, -newSpeed)
    }
  }
}
