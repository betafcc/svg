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

  call(f, ...fargs) {
    return new (this.constructor)((...args) => {
      const node = this.materialize(...args)
      f(node, ...fargs)
      return node
    })
  }

  attrs({...attrs}) {
    return this.call(node =>
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
