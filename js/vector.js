class Vector2 {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  get magnitude() {
    Math.sqrt(this.x * this.x + this.y * this.y)
  }

  get normalized() {
    return this.scale(1 / this.magnitude)
  }

  get negated() {
    return this.scale(-1)
  }

  get isZero() {
    // Is this comparison safe?
    return this.x === 0 && this.y === 0
  }

  scale(s) {
    return new Vector2(this.x * s, this.y * s)
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  sub(v) {
    return this.add(v.negated)
  }

  dist(v) {
    return Math.hypot(v.x - this.x, v.y - this.y)
  }

  dot(v) {
    return this.x * v.x + this.y * v.y
  }

  clamp(xRange, yRange) {
    return new Vector2(
      Math.min(Math.max(this.x, xRange[0]), xRange[1]),
      Math.min(Math.max(this.y, yRange[0]), yRange[1])
    )
  }
}