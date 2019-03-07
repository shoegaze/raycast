class Entity {
  constructor(name, pos, width, height) {
    this.name = name
    this.rect = Rect.CenteredRect(pos, width, height)
  }

  step(dt) { /* Abstract*/ }
  draw(ctx, dt) { /* Abstract */ }

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