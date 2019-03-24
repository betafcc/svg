import svgToPDFKit from "svg-to-pdfkit";
import { SVGSVGElementSerializer } from "./serializers/interface";

export const makeSVGClass = (serializer: SVGSVGElementSerializer) =>
  class SVG {
    constructor(readonly materialize: () => SVGSVGElement) {}

    static create(): SVG {
      return this.fromString(
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`
      );
    }

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

    toPDFKit(doc: PDFKit.PDFDocument, { x = 0, y = 0, ...options } = {}): void {
      svgToPDFKit(doc, this.toString(), x, y, options);
    }
  };
