class Entity {
  constructor(name, pos, width, height) {
    this.name = name
    this.rect = Rect.CenteredRect(pos, width, height)
  }

  step(dt) { /* Abstract*/ }
  draw(ctx, dt) { /* Abstract */ }

  get pos() {
    return this.rect.center
  }
  set pos(p) {
    this.rect = this.rect.centeredAt(p)
  }

  toString() {
    return `${this.name}`
  }

  move(dir) {
    this.rect = this.rect.translate(dir)
  }

  tryMove(dir) {
    // TODO
  }
}

class Player extends Entity {
  constructor(pos, width, height) {
    super("Player", pos, width, height)
  }

  step(dt) {
    const move = new Vector2(horizontal, vertical)

    if (move.isZero) {
      return
    }

    const dir = move
      .normalized
      .scale(speed * dt)

    player.move(dir)

    //player.tryMove(dir)

    shouldRedraw = true
  }

  draw(ctx, dt) {
    ctx.beginPath()
    ctx.rect(
      player.rect.topLeft.x,
      player.rect.topLeft.y,
      player.rect.width,
      player.rect.height
    )
    ctx.fillStyle = "green"
    ctx.fill()
    ctx.stroke()
  }
}

class Enemy extends Entity {
  constructor(pos, width, height) {
    super("Enemy", pos, width, height)
  }

  step(dt) {
    // ...
  }

  draw(ctx, dt) {
    // ...
  }
}