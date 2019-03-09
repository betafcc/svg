const SVGBase = require('./svg-base')


module.exports = class SVGBrowser extends SVGBase {
  static fromString(s) {
    return new SVGBrowser(() =>
      (new DOMParser())
      .parseFromString(s, 'image/svg+xml')
      .documentElement
    )
  }

  toString() {
    return this.materialize().outerHTML
  }
}
