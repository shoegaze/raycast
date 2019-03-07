// TODO: Move to var game
const width = 800
const height = 600
const gridResolution = 25
const TileType = Object.freeze({
  Empty: 0,
  Wall:  1,
})

// TODO: alignedGrid.initialize(data)
const alignedGrid = Array
  .from({length: Math.floor(width / gridResolution)})
  .map(() =>
    Array
      .from({length: Math.floor(height / gridResolution)})
      .map(() => TileType.Empty)
  )

// DEBUG:
function drawGrid(ctx) {
  const col = Math.floor(width / gridResolution)
  const row = Math.floor(height / gridResolution)

  ctx.beginPath()
  // draw rows
  for (let r = 0; r <= row; r++) {
    const y = gridResolution * r

    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }

  // draw columns
  for (let c = 0; c <= col; c++) {
    const x = gridResolution * c

    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }

  ctx.fillStyle = "black"
  ctx.stroke()
}

// DEBUG:
function drawTiles(ctx) {
  // TODO:
  alignedGrid.forEach((col, x) => {
    col.forEach((t, y) => {
      if (t === TileType.Empty) {
        // Do nothing
      }
      else if (t === TileType.Wall) {
        ctx.fillStyle = "grey"
        ctx.fillRect(x * gridResolution, y * gridResolution, gridResolution, gridResolution)
      }
    });
  });
}


// TODO: negative numbers
const getNextMultiple = (val, mult) => {
  if (val === 0) {
    return 0
  }

  if (val === mult) {
    return mult
  }

  return val + mult - (val % mult)
}

const solveX = (y, a, b, c) => -(b * y + c) / a
const solveY = (x, a, b, c) => -(a * x + c) / b
const getX = (x0, i) => x0 + i * gridResolution
const getY = (y0, j) => y0 + j * gridResolution
const xToWorldIndex = x => Math.floor(x / gridResolution)
const yToWorldIndex = y => Math.floor(y / gridResolution)
// TODO: get rid of floating pt. comparison
const isTopEdge = y => y % gridResolution === 0
const isSideEdge = x => x % gridResolution === 0

const getTileOrNull = (world, i, j) => {
  if (typeof world[i] === "undefined" || typeof world[i][j] === "undefined") {
    return null
  }

  return world[i][j]
}

const getEdgeAdjacents = (world, x, y) => {
  const pack = (ii, jj, tile) => [x, y, ii, jj, tile]
  const xIsEdge = isSideEdge(x)
  const yIsEdge = isTopEdge(y)
  const i = xToWorldIndex(x)
  const j = yToWorldIndex(y)

  if (xIsEdge && yIsEdge) {
    return [
      pack(i-1, j-1, getTileOrNull(world, i-1, j-1)),
      pack(i-1, j,   getTileOrNull(world, i-1, j)),
      pack(i,   j-1, getTileOrNull(world, i,   j-1)),
      pack(i,   j,   getTileOrNull(world, i,   j))
    ].filter(v => v[2] !== null)
  }
  else if (xIsEdge) {
    return [
      pack(i-1, j, getTileOrNull(world, i-1, j)),
      pack(i,   j, getTileOrNull(world, i,   j))
    ].filter(v => v[2] !== null)
  }
  else if (yIsEdge) {
    return [
      pack(i, j-1, getTileOrNull(world, i, j-1)),
      pack(i, j,   getTileOrNull(world, i, j))
    ].filter(v => v[2] !== null)
  }
  else {
    // HACK
    // TODO: Fix floating pt error so this is impossible
    //  -> Math.floor / Math.round?
    return []
  }
}



function testHit(start, end, entities, ctx) {
  // DEBUG:
  const drawIntersection = (x, y, r) => {
    ctx.beginPath()
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fillStyle = "red"
    ctx.fill()
  }

  // DEBUG:
  const drawIntersections = (x0, y0, a, b, c) => {
    const xmax = Math.max(start.x, end.x)
    for (let i = 0, x = getX(x0, i); x <= xmax; i++, x = getX(x0, i)) {
      const y = solveY(x, a, b, c)
      drawIntersection(x, y, 2)
    }

    const ymax = Math.max(start.y, end.y)
    for (let j = 0, y = getY(y0, j); y <= ymax; j++, y = getY(y0, j)) {
      const x = solveX(y, a, b, c)
      drawIntersection(x, y, 2)
    }
  }

  // DEBUG:
  const drawEnds = (start, end, ctx) => {
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.strokeStyle = "black"
    ctx.closePath()
    ctx.stroke()
  }

  // DEBUG:
  const markTile = (i, j, tileSize) => {
    const x = i * tileSize + tileSize / 2
    const y = j * tileSize + tileSize / 2

    ctx.beginPath()
    ctx.arc(x, y, 4, 0, 2 * Math.PI)
    ctx.fillStyle = "blue"
    ctx.fill()
  }

  // Use the standard form of a line:
  // ax + by + c = 0
  //  -> a = start.y - end.y (flip because y axis is down)
  //  -> b = end.x - start.x
  //  -> c = -(ax + by)
  //  -> y = -(ax + c) / b
  //  -> x = -(by + c) / a
  const a = start.y - end.y
  const b = end.x - start.x
  const c = -(a * start.x + b * start.y)
  // Math.min so we can ascend from min to max
  const x0 = getNextMultiple(Math.min(start.x, end.x), gridResolution)
  const y0 = getNextMultiple(Math.min(start.y, end.y), gridResolution)

  // TODO: Refactor loops into a function
  let adj = []
  const xmax = Math.max(start.x, end.x)
  for (let i = 0, x = getX(x0, i); x <= xmax; i++, x = getX(x0, i)) {
    const y = solveY(x, a, b, c)

    adj = adj.concat(
      getEdgeAdjacents(alignedGrid, x, y)
    )
  }

  const ymax = Math.max(start.y, end.y)
  for (let j = 0, y = getY(y0, j); y <= ymax; j++, y = getY(y0, j)) {
    const x = solveX(y, a, b, c)

    adj = adj.concat(
      getEdgeAdjacents(alignedGrid, x, y)
    )
  }

  // DEBUG:
  if (adj.some(v => v[4] === TileType.Wall)) {
    console.log(`hit wall! (${adj.filter(v => v[4] === TileType.Wall).length})`)
  }

  const hit = adj
    .filter(t => t[4] === TileType.Wall)
    .sort((a, b) => start.dist(a) - start.dist(b))

  // New end point
  const lim = (hit.length > 0) ?
    new Vector2(hit[0][0], hit[0][1]) : end

  const isValueBetween = (v, a, b) => Math.sign(v - a) !== Math.sign(v - b)
  const isPointInRectangle = (x, y, rx0, ry0, rx1, ry1) => {
    return isValueBetween(x, rx0, rx1) &&
           isValueBetween(y, ry0, ry1)
  }

  // Assume rx1 >= rx0, ry1 >= ry0
  const doesLineHitRectangle = (start, end, rx0, ry0, rx1, ry1) => {
    const pointBetweenPoints = (x, y) => {
      return isPointInRectangle(x, y, start.x, start.y, end.x, end.y)
    }

    // const a = start.y - end.y
    // const b = end.x - start.x
    // const c = -(a * start.x + b * start.y)
    const leftY = solveY(rx0, a, b, c)
    const rightY = solveY(rx1, a, b, c)
    const topX = solveX(ry0, a, b, c)
    const bottomX = solveX(ry1, a, b, c)

    return (pointBetweenPoints(rx0, leftY) && isValueBetween(leftY, ry0, ry1)) ||
           (pointBetweenPoints(rx1, rightY) && isValueBetween(rightY, ry0, ry1)) ||
           (pointBetweenPoints(topX, ry0) && isValueBetween(topX, rx0, rx1)) ||
           (pointBetweenPoints(bottomX, ry1) && isValueBetween(bottomX, rx0, rx1))
  }

  let minDist = Infinity
  let closest = null
  entities.forEach(e => {
    const rx0 = e[0] + e[2]
    const ry0 = e[1] + e[3]
    const rx1 = e[0] + e[4]
    const ry1 = e[1] + e[5]

    if (doesLineHitRectangle(start, lim, rx0, ry0, rx1, ry1)) {
      const d = start.dist(new Vector2(e[0], e[1]))
      if (d < minDist) {
        minDist = d
        closest = e
      }
    }
  })

  // DEBUG:
  if (closest) {
    console.log(`hit entity at (${closest[0]}, ${closest[1]})`)
  }

  // DEBUG:
  if (ctx) {
    drawEnds(start, lim, ctx)
    drawIntersections(x0, y0, a, b, c)
    adj.forEach(v => {
      markTile(v[2], v[3], gridResolution)
    })
  }

  return closest
}

function overlapsWall(entity) {
  // return alignedGrid
  //   .map(c => c.filter(t => t === TileType.Wall))
  //   .find(w => )
}

// Set up tiles
// DEBUG:
for (let i = 4; i <= 12; i++) {
  alignedGrid[i][3] = TileType.Wall
  alignedGrid[i][11] = TileType.Wall
}
// DEBUG:
for (let j = 4; j <= 10; j++) {
  alignedGrid[4][j] = TileType.Wall
  alignedGrid[12][j] = TileType.Wall
}
