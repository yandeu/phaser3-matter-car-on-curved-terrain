export default class Terrain {
  constructor(scene: Phaser.Scene, path: any, x: number, y: number) {
    // @ts-ignore
    const Matter = Phaser.Physics.Matter.Matter

    let pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    pathElement.setAttributeNS(null, 'd', path)
    pathElement.setAttributeNS(null, 'id', 'path3780')

    var vertexSets: { x: number; y: number }[][] = []
    vertexSets.push(Matter.Svg.pathToVertices(pathElement, 30))

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
      x: minMax(vertexSets[0].map(bla => bla.x)),
      y: minMax(vertexSets[0].map(bla => bla.y))
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

    // create the wholes in the terrain
    let wholes = scene.add.tileSprite(x, y, WIDTH, HEIGHT, 'wholes')
    wholes.setOrigin(0)
    wholes.setMask(mask)

    // create the grass layer
    let grass = scene.add.graphics({ x: x, y: y })
    grass.lineStyle(LINE_HEIGHT, 0xadea53)
    grass.beginPath()
    vertexSets[0].forEach(c => {
      grass.lineTo(Math.round(c.x), Math.round(c.y))
    })
    grass.closePath()
    grass.strokePath()

    // plant the grass
    vertexSets[0].forEach(point => {
      if (Math.random() < 0.15) scene.add.image(point.x + x, point.y + y - 15, 'grass')
    })

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
  }
}
