import svgToPDFKit from 'svg-to-pdfkit'
import { browserSerializer } from '../serializer'

export interface PDFKitDrawOptions {
  x: number
  y: number
  width: number
  height: number
}

export class SVGBrowser {
  static serializer = browserSerializer

  /**
   * The function that will actually create the SVGSVGElement
   *
   * @memberof SVGBrowser
   */
  readonly materialize: () => SVGSVGElement

  /**
   * Creates an instance of SVGBrowser.
   * @param {() => SVGSVGElement} materialize The function that will actually create the SVGSVGElement
   * @memberof SVGBrowser
   */
  constructor(materialize: () => SVGSVGElement) {
    this.materialize = materialize
  }

  /**
   *
   *
   * @static
   * @template T Class or subclass of SVGBrowser
   * @param {T} this
   * @returns {InstanceType<T>} svg element corresponding to the code:
   * ```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>```
   * @memberof SVGBrowser
   */
  static create<T extends typeof SVGBrowser>(this: T): InstanceType<T> {
    return this.fromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`)
  }

  /**
   * Parses `s` as the code for creating a SVG elment and wraps into the `SVG` class
   *
   * @example
   * // creates a svg of a red circle
   * SVG.fromString(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="red/>
</svg>
`)
   * 
   * @static
   * @template T Class or subclass of SVGBrowser
   * @param {T} this
   * @param {string} s The svg code to parse
   * @returns {InstanceType<T>}
   * @memberof SVGBrowser
   */
  static fromString<T extends typeof SVGBrowser>(this: T, s: string): InstanceType<T> {
    // polymorphic 'this' in static methods workaround
    // https://github.com/Microsoft/TypeScript/issues/5863#issuecomment-410887254
    return new this(() => this.serializer.fromString(s)) as InstanceType<T>
  }

  toString(): string {
    return (this.constructor as typeof SVGBrowser).serializer.toString(this.materialize())
  }

  fmap(f: (svg: SVGSVGElement, ...fargs: any[]) => SVGSVGElement, ...fargs: any[]): this {
    return new (Object.getPrototypeOf(this)).constructor(() => f(this.materialize(), ...fargs))
  }

  /**
   * Enqueue a function `f` to be called on the svg node with optional extra `...fargs`.
   *
   * Will run when `.materialize` is called
   *
   * @param {(svg: SVGSVGElement, ...fargs: any[]) => any} f
   * The function that will take the svg node as first argument
   * @param {...any[]} fargs Optional extra arguments to be passed to `f`
   * @returns {SVGBrowser} The new `SVG` object with `f` enqueued to run when materialized
   */
  call(f: (svg: SVGSVGElement, ...fargs: any[]) => any, ...fargs: any[]): this {
    return new (Object.getPrototypeOf(this)).constructor(() => {
      const svg = this.materialize()
      f(svg, ...fargs)
      return svg
    })
  }

  /**
   * Enqueue DOM attributes to be applied on the svg node
   *
   * @param {object} attrs The node attributes to be applied on the node
   * @returns {SVGBrowser}
   */
  attrs(attrs: object): this {
    return this.call(node => {
      Object.entries(attrs).reduce((acc, [k, v]) => {
        if (v === null) acc.removeAttribute(k)
        else acc.setAttribute(k, v)
        return acc
      }, node)
    })
  }

  appendTo(parent: HTMLElement): void {
    parent.append(this.materialize())
  }

  /**
   *
   * @example
   * const fs = require('fs')
   * const PDFDocument = require('pdfkit')
   *
   * const doc = new PDFDocument()
   * doc.pipe(fs.createWriteStream('output.pdf'))
   * // a red circle
   * svg
   *   .fromString(`
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="50" fill="red/>
</svg>
`)
   * .toPDFKit(doc, {x: 0, y: 0, width: 600, height: 400})
   *
   * doc.end()
   *
   * @param {PDFKit.PDFDocument} doc The `PDFKit` document to draw on
   * @param {PDFKitDrawOptions} [options={}] 
   */
  toPDFKit(doc: PDFKit.PDFDocument, options: Partial<PDFKitDrawOptions> = {}): void {
    const { x, y, ...restOptions } = Object.assign({}, { x: 0, y: 0 }, options)

    svgToPDFKit(doc, this.toString(), x, y, restOptions)
  }
}
