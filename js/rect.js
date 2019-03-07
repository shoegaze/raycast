const RectSide = Object.freeze({
  None: 0,
  Left: 1,
  Right: 2,
  Up: 4,
  Down: 8,

  matches(s0, s1) {
    return s0 & s1 !== 0
  }
})

class Rect {
  static get Sides() {
    return RectSide
  }

  static CenteredRect(pos, w, h) {
    return new Rect(
      new Vector2(pos.x - w/2, pos.y - h/2),
      w,
      h
    )
  }

  constructor(topLeft, width, height) {
    this.topLeft = topLeft
    this.bottomRight = new Vector2(
      topLeft.x + width,
      topLeft.y + height
    )
  }

  get center() {
    return new Vector2(
      this.topLeft.x + this.width / 2,
      this.topLeft.y + this.height / 2
    )
  }

  get width() {
    return Math.abs(this.bottomRight.x - this.topLeft.x)
  }

  get height() {
    return Math.abs(this.bottomRight.y - this.topLeft.y)
  }

  toString() {
    return `(${this.topLeft.toString()}, ${this.bottomRight.toString})`
  }

  atPosition(v) {
    return new Rect(
      v,
      this.width,
      this.height
    )
  }

  translate(v) {
    return new Rect(
      this.topLeft.add(v),
      this.width,
      this.height
    )
  }

  centeredAt(pos) {
    return new Rect(
      pos.sub(this.width / 2, this.y / 2),
      this.width,
      this.height
    )
  }

  // Distance between centers of rectangles
  //  when the corners are touching:
  maxTouchingDist(r) {
    return Math.sqrt(
      (this.width + r.width) ** 2 +
      (this.height + r.height) ** 2) / 2
  }

  intersects(r) {
    this.center.dist(r.center) <= this.maxTouchingDist(r)
  }

  sideRelativeTo(r) {
    const dx = r.center.x - this.center.x
    const dy = r.center.y - this.center.y
    let s = RectSide.None

    if (dx > 0) {
      s += RectSide.Left
    }

    if (dx < 0) {
      s += RectSide.Right
    }

    if (dy > 0) {
      s += RectSide.Up
    }

    if (dy < 0) {
      s += RectSide.Down
    }

    return s
  }

  normalRelativeTo(r) {
    const s = this.sideRelativeTo(r)
    let n = new Vector2(0,0)

    if (RectSide.matches(s, RectSide.Left)) {
      n = n.add(new Vector2(-1, 0))
    }

    if (RectSide.matches(s, RectSide.Right)) {
      n = n.add(new Vector2(+1, 0))
    }

    if (RectSide.matches(s, RectSide.Up)) {
      n = n.add(new Vector2(0, -1))
    }

    if (RectSide.matches(s, RectSide.Down)) {
      n = n.add(new Vector2(0, +1))
    }

    return n.normalized()
  }

  pointInside(p) {
    return this.topLeft.x <= p.x && p.x <= this.bottomRight.x &&
           this.topLeft.y <= p.y && p.y <= this.bottomRight.y
  }

  // TODO:
  lineIntersects(l) {
    throw new Error("Unimplemented method")
  }
}