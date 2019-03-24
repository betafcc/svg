import svgToPDFKit from "svg-to-pdfkit";
import { SVGSVGElementSerializer } from "./serializers/interface";

interface PDFKitDrawOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const makeSVGClass = (serializer: SVGSVGElementSerializer) =>
  class SVG {
    /**
     * Creates an instance of SVG.
     * @param {() => SVGSVGElement} materialize
     */
    constructor(readonly materialize: () => SVGSVGElement) {}

    /**
     * Create a default, empty svg element
     * @static
     * @returns {SVG} svg element corresponding to the code:
     * ```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>```
     */
    static create(): SVG {
      return this.fromString(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`
      );
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
     * @param {string} s The svg code to parse
     * @returns {SVG}
     */
    static fromString(s: string): SVG {
      return new SVG(() => serializer.fromString(s));
    }

    toString(): string {
      return serializer.toString(this.materialize());
    }

    fmap(
      f: (svg: SVGSVGElement, ...fargs: any[]) => SVGSVGElement,
      ...fargs: any[]
    ): SVG {
      return new SVG(() => f(this.materialize(), ...fargs));
    }

    /**
     * Enqueue a function `f` to be called on the svg node with optional extra `...fargs`.
     *
     * Will run when `.materialize` is called
     *
     * @param {(svg: SVGSVGElement, ...fargs: any[]) => any} f
     * The function that will take the svg node as first argument
     * @param {...any[]} fargs Optional extra arguments to be passed to `f`
     * @returns {SVG}
     */
    call(
      f: (svg: SVGSVGElement, ...fargs: any[]) => any,
      ...fargs: any[]
    ): SVG {
      return new SVG(() => {
        const svg = this.materialize();
        f(svg, ...fargs);
        return svg;
      });
    }

    /**
     * Enqueue DOM attributes to be applied on the svg node
     *
     * @param {object} attrs The node attributes to be applied on the node
     * @returns {SVG}
     */
    attrs(attrs: object): SVG {
      return this.call(node => {
        Object.entries(attrs).reduce((acc, [k, v]) => {
          if (v === null) acc.removeAttribute(k);
          else acc.setAttribute(k, v);
          return acc;
        }, node);
      });
    }

    appendTo(parent: HTMLElement): void {
      parent.append(this.materialize());
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
    toPDFKit(
      doc: PDFKit.PDFDocument,
      options: Partial<PDFKitDrawOptions> = {}
    ): void {
      const { x, y, ...restOptions } = Object.assign(
        {},
        { x: 0, y: 0 },
        options
      );

      svgToPDFKit(doc, this.toString(), x, y, restOptions);
    }
  };
