const TileType = Object.freeze({
  Empty: 0,
  Wall:  1
})

class AlignedGrid {
  constructor(w, h, resolution) {
    if (w <= 0 || h <= 0 || resolution <= 0) {
      throw Error("Invalid grid values")
    }

    this.grid = Array
      .from({length: Math.floor(w / resolution)})
      .map(() =>
        Array
          .from({length: Math.floor(h / resolution)})
          .map(() => TileType.Empty)
      )

    this.width = w
    this.height = h
    this.resolution = resolution
  }
  
  draw(ctx) {
    // ...
  }
}