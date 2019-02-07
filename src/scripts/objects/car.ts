import Restart from './restart'

export default class Car {
  readonly MAX_VELOCITY = 11
  readonly ACCELERATION = 0.22
  readonly ACCELERATION_BACKWARDS = this.ACCELERATION - 0.06

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

    const density = 0.1
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

    let axelA = scene.matter.add.constraint(body.body, wheelA.body, 2, 0.95, {
      pointA: { x: wheelAOffset, y: wheelYOffset }
    })

    let axelB = scene.matter.add.constraint(body.body, wheelB.body, 2, 0.95, {
      pointA: { x: wheelBOffset, y: wheelYOffset }
    })

    this.bodies = [body.body, wheelA.body, wheelB.body]
  }

  update() {
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter
    const carBody = this.bodies[0]

    // restart the game if the car falls
    if (carBody.position.y > 3000) Restart.restart(this._scene)

    const setBodyVelocity = (velocity: number, direction: 'forward' | 'backwards') => {
      const v = adjustMaxVelocity(velocity)
      const tan = Math.tan(carBody.angle)
      const x = v * (2 - Math.abs(tan))
      const y = v * tan
      const vv = direction === 'forward' ? { x: x, y: y } : { x: -x, y: -y }
      Matter.Body.setVelocity(carBody, vv)
    }

    const getCurrentVelocity = () => {
      return (Math.abs(carBody.velocity.x) + Math.abs(carBody.velocity.y)) / 2
    }

    const adjustMaxVelocity = (velocity: number) => {
      return velocity > this.MAX_VELOCITY ? this.MAX_VELOCITY : velocity
    }

    if (this.wheelsDown.rear || this.wheelsDown.front) {
      if (this.gas.right) {
        let newVelocity = carBody.velocity.x <= 0 ? 1 : getCurrentVelocity() + this.ACCELERATION
        setBodyVelocity(newVelocity, 'forward')
      } else if (this.gas.left) {
        let newVelocity = carBody.velocity.x >= 0 ? 1 : getCurrentVelocity() + this.ACCELERATION_BACKWARDS
        setBodyVelocity(newVelocity, 'backwards')
      }
    }
  }
}
