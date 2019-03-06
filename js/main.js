// [x, y, left x offset, left y offset, right x offset, right y offset]
let player = [25, 25, -10, -10, 10, 10]
let range = 200
let speed = 0.15

// Input vars
let horizontal = 0
let vertical = 0

let shouldRedraw = true

let entities = [
  // [
  //  x,
  //  y,
  //  top left x offset,
  //  top left y offset,
  //  bottom right x offset,
  //  bottom right y offset
  // ]
  // TODO: move to new Entity class
  [200, 200, -10, -10, 10, 10],
  [275, 200, -10, -10, 10, 10]
]

const DirKey = Object.freeze({
  Up: "w",
  Down: "s",
  Right: "d",
  Left: "a"
})

// Vector functions
const magnitude = v => Math.sqrt(v[0] * v[0] + v[1] * v[1])
const normalize = v => {
  const m = magnitude(v)
  return [v[0] / m, v[1] / m]
} // scale(v, 1/magnitude(v))
const scale = (v, s) => [s * v[0], s * v[1]] // v.map(e => s * e)
const negate = v => scale(v, -1)
const add = (v0, v1) => [v0[0] + v1[0], v0[1] + v1[1]] // v0.map((e, i) => e + v1[i])
const sub = (v0, v1) => add(v0, negate(v1))
const isZero = v => v[0] === 0 && v[1] === 0 // v.every(e => e === 0)
// Assume range.x <= range.y
const clampVector = (v, xRange, yRange) => {
  const clampScalar = (s, range) => {
    if (s < range[0]) {
      return range[0]
    }
    if (s > range[1]) {
      return range[1]
    }

    return s
  }

  return [clampScalar(v[0], xRange), clampScalar(v[1], yRange)]
}


// Draw functions:

const clearScreen = (c, ctx) => {
  ctx.clearRect(0, 0, c.width, c.height)
}

const drawPlayer = ctx => {

  // Debug draw:
  // TODO: Move to separate debug function
  ctx.beginPath()
  ctx.rect(
    player[0] + player[2],
    player[1] + player[3],
    player[4] - player[2],
    player[5] - player[3]
  )
  ctx.fillStyle = "green"
  ctx.fill()
  ctx.stroke()
}

const drawEntities = ctx => {
  entities.forEach(e => {
    ctx.beginPath()
    ctx.rect(
      e[0] + e[2],
      e[1] + e[3],
      e[4] - e[2],
      e[5] - e[3]
    )
    ctx.fillStyle = "red"
    ctx.fill()
    ctx.stroke()
  })
}

function draw(c, ctx) {
  if (shouldRedraw) {
    clearScreen(c, ctx)
    drawGrid(ctx)
    drawTiles(ctx)
    drawPlayer(ctx)
    drawEntities(ctx)

    shouldRedraw = false
  }
}

// Step functions:
const resolveAabbCollision = (movingEntity, staticEntity, dr) => {
  // TODO:
  throw Error("Unimplemented function")

  const Side = Object.freeze({
    None: {},
    Top: {},
    Bottom: {},
    Left: {},
    Right: {}
  })

  const dx = staticEntity[0] - movingEntity[0]
  const dy = staticEntity[1] - movingEntity[1]

  if (Math.abs(dx) > Math.abs(dy)) {

  }
  else if (Math.abs(dx) < Math.abs(dy)) {

  }
  // Special case:
  // dx = dy = 0

  // else if () {}

  // Special case:
  // dx = dy = C

  // else if () {}


  // let sideRelAB = []
  // if (dx > 0) {
  //   sideRelAB[0] = Side.Left
  // }
  // else if (dx < 0) {
  //   sideRelAB[0] = Side.Right
  // }
  // else {
  //   sideRelAB[0] = Side.None
  // }

  // if (dy > 0) {

  // }
  // else if (dy < 0) {

  // }
  // else {

  // }

  return
}

const stepPlayer = (dt) => {
  if (isZero([horizontal, vertical])) {
    return
  }

  const plyPos = clampVector(
    add(
      player,
      scale(
        normalize([horizontal, vertical]),
        speed * dt
      )
    ),
    // TODO: Retrieve canvas dimensions from game variable
    [0, 800],
    [0, 600]
  )

  player[0] = plyPos[0]
  player[1] = plyPos[1]

  // TODO: Get walls from tile neighbors
  world
    .filter(t => t[4] === TileType.Wall)
    .forEach(w => {
      // TODO:
      // player = resolveAabbCollision(player, w)
    })

  shouldRedraw = true
}

const step = (t, dt) => {
  // TODO:

  stepPlayer(dt)
  //stepEntities(dt)

  //flushInputBuffer()
}

function loop(t) {
  const dt = t - this.last
  this.last = t

  step(t, dt)
  draw(this.canvas, this.canvasCtx)

  window.requestAnimationFrame(loop.bind(this))
}

const startLoop = (t, c, ctx) => {
  const loopContext = {
    start: t,
    last: t,
    canvas: c,
    canvasCtx: ctx
  }

  window.requestAnimationFrame(loop.bind(loopContext))
}

const init = (mainCanvas, mainCtx, debugCanvas, debugCtx) => {
  const refreshCanvas = () => {
    mainCanvas.setAttribute("width", `${window.innerWidth}px`)
    mainCanvas.setAttribute("height", `${window.innerHeight}px`)
  }
  refreshCanvas()

  debugCanvas.setAttribute("width", `${300}px`)
  debugCanvas.setAttribute("height", `${225}px`)

  shouldRedraw = true

  window.addEventListener("keydown", ev => {
    if (ev.repeat) {
      return
    }

    if (ev.key === DirKey.Down) {
     vertical += 1
    }
    else if (ev.key === DirKey.Up) {
      vertical -= 1
    }
    else if (ev.key === DirKey.Right) {
      horizontal += 1
    }
    else if (ev.key === DirKey.Left) {
      horizontal -= 1
    }

    // ev.preventDefault()
  })

  window.addEventListener("keyup", ev => {
    if (ev.repeat) {
      return
    }

    // keydown, but values negated
    if (ev.key === DirKey.Down) {
      vertical -= 1
    }
    else if (ev.key === DirKey.Up) {
      vertical += 1
    }
    else if (ev.key === DirKey.Right) {
      horizontal -= 1
    }
    else if (ev.key === DirKey.Left) {
      horizontal += 1
    }

    // ev.preventDefault()
  })

  mainCanvas.addEventListener("mousedown", ev => {
    // start = player
    // end = player + range * |click - player|
    const dir = normalize(sub([ev.x, ev.y], player))
    const entity = testHit(
      player,
      add(player, scale(dir, range)),
      entities,
      debugCtx
    )

    if (entity) {
      // entity.damage(amt)
    }

    ev.preventDefault()
  })

  // c.addEventListener("mousemove", updateDir)
}

const getScreens = (mainId, debugId) => {
  // TODO: Error checking
  return [
    document.getElementById(mainId),
    document.getElementById(debugId)
  ]
}

function main() {
  const [mainC, debugC] = getScreens("screen-main", "screen-debug")
  const mainCtx = mainC.getContext("2d")
  const debugCtx = debugC? debugC.getContext("2d") : null

  init(mainC, mainCtx, debugC, debugCtx)
  startLoop(
    window.performance.now(),
    mainC,
    mainCtx,
    debugC,
    debugCtx
  )
}


// TODO:
// GAME = Object.freeze({
//   init: function() {},
//   main: () => {

//   },


// })

// TODO:
// const INPUT = {
//   horizontal: 0,
//   vertical: 0,
//   shooting: false
// }