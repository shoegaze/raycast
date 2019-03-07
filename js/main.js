// [x, y, left x offset, left y offset, right x offset, right y offset]
let player = new Player(new Vector2(25, 25), 20, 20)
let range = 200
let speed = 0.15

// Input vars
let horizontal = 0
let vertical = 0

let shouldRedraw = true

const entities = [
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

// Draw functions:

const clearScreen = (c, ctx) => {
  ctx.clearRect(0, 0, c.width, c.height)
}

const drawPlayer = ctx => {
  player.draw(ctx)
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

function draw(c, ctx, dt) {
  if (shouldRedraw) {
    clearScreen(c, ctx)
    drawGrid(ctx)
    drawTiles(ctx)

    player.draw(ctx)
    drawEntities(ctx)

    shouldRedraw = false
  }
}

// Step functions:
const tryMove = (mover, dr) => {
  const tryMoveInner = (r, dr) => {
    const w = overlapsWall(r.add(dr))
    if (w) {
      const w1 = width(r), w2 = width(w)
      const h1 = height(r), h2 = height(w)

      const maxDist = Math.sqrt(
        (w1 + w2) ** 2 +
        (h1 + h2) ** 2) / 2

      const d = ((a, b) => {
        const dx = b[0] - a[0]
        const dy = b[1] - a[1]
        return Math.sqrt(dx * dx + dy * dy)
      })(r, w)

      const n = getRectNormal(r, w)
      // Check recursively if we intersect any other walls
      tryMoveInner(r, dr + n * (maxDist - d))
    }

    r = r.add(dr)
  }

  tryMoveInner(mover, dr)
}

const step = (t, dt) => {
  // TODO:

  player.step(dt)
  // entities.forEach(e => e.step())

  //InputBuffer.flush()
}

function loop(t) {
  const dt = t - this.last
  this.last = t

  step(t, dt)
  draw(this.canvas, this.canvasCtx, dt)

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

const init = (mainCanvas, mainCtx) => {
  const refreshCanvas = () => {
    mainCanvas.setAttribute("width", `${window.innerWidth}px`)
    mainCanvas.setAttribute("height", `${window.innerHeight}px`)
  }
  refreshCanvas()

  shouldRedraw = true

  window.addEventListener("keydown", ev => {
    if (ev.repeat) {
      return
    }

    if (ev.key === DirKey.Down) {
     vertical += 1
    }

    if (ev.key === DirKey.Up) {
      vertical -= 1
    }

    if (ev.key === DirKey.Right) {
      horizontal += 1
    }

    if (ev.key === DirKey.Left) {
      horizontal -= 1
    }
  })

  window.addEventListener("keyup", ev => {
    if (ev.repeat) {
      return
    }

    if (ev.key === DirKey.Down) {
      vertical -= 1
    }

    if (ev.key === DirKey.Up) {
      vertical += 1
    }

    if (ev.key === DirKey.Right) {
      horizontal -= 1
    }

    if (ev.key === DirKey.Left) {
      horizontal += 1
    }
  })

  mainCanvas.addEventListener("mousedown", ev => {
    // end = player + range * |click - player|
    const dir = Vector2.from(ev)
      .sub(player.pos)
      .normalized

    const entity = testHit(
      player.pos,
      player.pos.add(dir.scale(range)),
      entities,
      mainCtx
    )

    if (entity) {
      // entity.damage(amt)
    }

    ev.preventDefault()
  })
}

function main() {
  const mainC = document.getElementById("screen-main")
  const mainCtx = mainC.getContext("2d")

  init(mainC, mainCtx)
  startLoop(
    window.performance.now(),
    mainC,
    mainCtx
  )
}
