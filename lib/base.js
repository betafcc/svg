module.exports = class SVGBase {
  constructor(materialize) {
    this.materialize = materialize
  }

  static create() {
    return this.fromString(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`
    )
  }

  preprocess(f) {
    return new (this.constructor)((...args) => this.materialize(f(...args)))
  }

  fmap(f) {
    return new (this.constructor)((...args) =>
      f(this.materialize(...args))
    )
  }

  apply(f) {
    return new (this.constructor)((...args) => {
      const temp = this.materialize(...args)
      f(temp)
      return temp
    })
  }

  attrs({...attrs}) {
    return this.apply(node =>
      Object.entries(attrs).reduce((acc, [k, v]) => {
        if (v === null)
          acc.removeAttribute(k, v)
        else
          acc.setAttribute(k, v)
        return acc
      }, node)
    )
  }

  toPdfkit(doc, {x=0, y=0, ...options}={}) {
    require('svg-to-pdfkit')(doc, this.toString(), x, y, options)
  }
}
