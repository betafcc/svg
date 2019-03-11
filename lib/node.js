const util = require('util')
const SVGBase = require('./base')


module.exports = class SVGNode extends SVGBase {
  static fromString(s) {
    return new SVGNode(() =>
      (new (require('jsdom').JSDOM)(s))
      .window
      .document
      .querySelector('svg')
    )
  }

  toString() {
    // Fix a jsdom issue where all SVG tagNames are lowercased:
    // https://github.com/tmpvar/jsdom/issues/620
    return ['linearGradient', 'radialGradient', 'clipPath', 'textPath']
      .reduce((text, tagName) => text.replace(
        new RegExp('(<|</)' + tagName.toLowerCase() + '\\b', 'g'),
        (all, start) => start + tagName
      ), this.materialize().outerHTML)
  }

  [util.inspect.custom]() {
    return this.toString()
  }
}
