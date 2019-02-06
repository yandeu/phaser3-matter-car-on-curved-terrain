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
    let g = scene.add.graphics({ x: x, y: y })
    g.lineStyle(LINE_HEIGHT, 0xadea53)
    g.fillStyle(0x685339)
    g.beginPath()
    vertexSets[0].forEach(c => {
      g.lineTo(Math.round(c.x), Math.round(c.y))
    })
    g.closePath()
    g.fillPath()
    g.strokePath()
    //g.generateTexture('ground', WIDTH, HEIGHT)
    //g.destroy()

    let terrainBody: any = scene.matter.add.fromVertices(
      WIDTH / 2 + x,
      HEIGHT / 2 + y,
      vertexSets,
      {
        label: 'terrain',
        isStatic: true
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
