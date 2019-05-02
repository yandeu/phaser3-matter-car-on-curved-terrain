interface DynamicTextures {
  x1: number
  x2: number
  type: 'TileSprite' | 'Graphics' | 'Image' | 'Sprite'
  texture:
    | Phaser.GameObjects.TileSprite
    | Phaser.GameObjects.Graphics
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Sprite
}

export default class Terrain {
  private dynamicTextures: DynamicTextures[] = []
  private _scene: Phaser.Scene

  constructor(scene: Phaser.Scene, path: any, x: number, y: number, terrainIndex?: number) {
    this._scene = scene
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter

    let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttributeNS(null, 'd', path)
    pathElement.setAttributeNS(null, 'id', 'path3780')

    var vertexSets: { x: number; y: number }[][] = []
    let PATH_LENGTH = 36
    vertexSets.push(Matter.Svg.pathToVertices(pathElement, PATH_LENGTH))

    //console.log(JSON.stringify(vertexSets))

    const minMax = (items: number[]) => {
      return items.reduce(
        (acc, val) => {
          acc.high = isNaN(acc.high) || val > acc.high ? val : acc.high
          acc.low = isNaN(acc.low) || val < acc.low ? val : acc.low
          return acc
        },
        { high: NaN, low: NaN }
      )
    }

    let points = {
      x: minMax(vertexSets[0].map(point => point.x)),
      y: minMax(vertexSets[0].map(point => point.y))
    }

    vertexSets[0].push({
      x: vertexSets[0][vertexSets[0].length - 1].x,
      y: vertexSets[0][vertexSets[0].length - 1].y + points.y.high + 360
    })
    vertexSets[0].unshift({
      x: vertexSets[0][0].x,
      y: vertexSets[0][0].y + points.y.high + 500
    })

    points = {
      x: minMax(vertexSets[0].map(point => point.x)),
      y: minMax(vertexSets[0].map(point => point.y))
    }

    const normalizeVertices = (vertices: { x: number; y: number }[]) => {
      return vertices.map(point => {
        return { x: point.x - points.x.low, y: point.y - points.y.low }
      })
    }

    vertexSets[0] = normalizeVertices(vertexSets[0])

    let PADDING = 200
    let LINE_HEIGHT = 25
    let WIDTH = points.x.high - points.x.low
    let HEIGHT = points.y.high - points.y.low

    // create the terrain
    let terrain = scene.add.graphics({ x: x, y: y })
    terrain.fillStyle(0x685339)
    terrain.beginPath()
    vertexSets[0].forEach(c => {
      terrain.lineTo(Math.round(c.x), Math.round(c.y))
    })
    terrain.closePath()
    terrain.fillPath()

    const mask = terrain.createGeometryMask()

    const V = vertexSets[0]

    // create the wholes in the terrain
    for (let i = 0; i < Math.ceil(WIDTH / 1024); i++) {
      let xx = x + i * 1024

      // get the highest value from all vertices inside the x range of the tilesprite
      let points = V.filter(point => {
        return point.x > i * 1024 && point.x < i * 1024 + 1024
      })

      let low = minMax(points.map(p => p.y)).low
      let skip = Math.floor(low / (288 * 2))
      let yy = y
      yy = skip * 288 * 2

      let wholes = scene.add.tileSprite(xx, yy, 512, Math.min(HEIGHT, 1024 /*288 * 2 * 2*/), 'atlas', 'wholes-small')
      wholes.setOrigin(0)
      wholes.setScale(2, 2)
      wholes.setMask(mask)
      this.dynamicTextures.push({ x1: xx, x2: xx + 1024, texture: wholes, type: 'TileSprite' })
    }

    terrain.setVisible(false)

    // create the grass layer
    const divide = Math.round(1024 / PATH_LENGTH)
    //let grass: Phaser.GameObjects.Graphics
    for (let i = 1; i < V.length - 1; i += divide) {
      let x1 = V[i].x + x
      let x2 = V[Math.min(i + divide, V.length - 2)].x + x

      let grass = scene.add.graphics({ x: x1, y: y })
      grass.lineStyle(LINE_HEIGHT, 0xadea53)
      grass.beginPath()

      for (let j = i === 1 ? 1 : -1; j < divide; j++) {
        if (i + j > V.length - 1) break
        grass.lineTo(Math.round(V[i + j].x - x1 + x), Math.round(V[i + j].y))
      }

      // grass.closePath()
      grass.strokePath()

      // let debug = true
      // if (debug) {
      //   let t = `${Math.random()}`
      //   grass.generateTexture(t)
      //   let bla = scene.add.sprite(400, 300, t)
      //   console.log(bla.width, bla.height)
      // }

      this.dynamicTextures.push({
        x1: Math.min(x1, x2),
        x2: Math.max(x1, x2),
        texture: grass,
        type: 'Graphics'
      })
      //scene.physics.add.existing(grass)
    }

    // plant the grass
    let plants = 0
    vertexSets[0].forEach(point => {
      // for (let i = 0; i < 150; i++) {
      // let point = vertexSets[0][i]
      if (Math.random() < 0.15) {
        plants++
        let grass = scene.add.image(point.x + x, point.y + y - 15, 'atlas', 'grass')
        this.dynamicTextures.push({ x1: grass.x, x2: grass.x, texture: grass, type: 'Image' })
      }
    })
    // }

    let terrainBody: any = scene.matter.add.fromVertices(
      WIDTH / 2 + x,
      HEIGHT / 2 + y,
      vertexSets,
      {
        label: 'terrain',
        isStatic: true,
        friction: 0.7
      },
      true,
      //@ts-ignore
      0.01,
      1
    )

    // get offset of center of mass
    // and set the terrain to its correct position
    // https://github.com/liabru/matter-js/issues/211#issuecomment-184804576
    let centerOfMass = Matter.Vector.sub(terrainBody.bounds.min, terrainBody.position)
    Matter.Body.setPosition(terrainBody, { x: Math.abs(centerOfMass.x) + x, y: Math.abs(centerOfMass.y) + y })

    this.dynamicTextures.forEach(child => {
      // @ts-ignore
      //console.log(child.type, child.texture.width, child.texture.height)
      //if (child.type === 'Graphics') console.log(child.texture)
    })
  }

  update() {
    let x1 = this._scene.cameras.main.worldView.x
    let x2 = x1 + this._scene.cameras.main.worldView.width

    const isVisible = (points: DynamicTextures): boolean => {
      const case1 = points.x1 > x1 && points.x1 < x2
      const case2 = points.x2 > x1 && points.x2 < x2
      const case3 = points.x1 < x1 && points.x2 > x2
      return case1 || case2 || case3
    }

    let countVisible = 0
    this.dynamicTextures.forEach(whole => {
      if (whole.texture.visible) countVisible++
      if (isVisible(whole)) {
        if (!whole.texture.visible) {
          whole.texture.setVisible(true)
        }
      } else {
        if (whole.texture.visible) whole.texture.setVisible(false)
      }
    })
  }
}
