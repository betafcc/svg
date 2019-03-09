const SVGBase = require('./svg-base')


module.exports = class SVGBrowser extends SVGBase {
  static fromString(s) {
    return new (this.constructor)(() =>
      (new DOMParser())
      .parseFromString(s, 'image/svg+xml')
      .documentElement
    )
  }

  toString() {
    return this.materialize().outerHTML
  }
}
