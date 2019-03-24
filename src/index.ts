import PDFKit from 'pdfkit'
import svgToPDFKit from 'svg-to-pdfkit'


class SVG {
  constructor(readonly materialize: () => SVGSVGElement) { }

  static create<T extends typeof SVG>(this: T): InstanceType<T> {
    return this.fromString(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"></svg>`
    ) as InstanceType<T>
  }

  static fromString(s: string): SVG {
    return new SVG(() =>
      (new DOMParser())
      .parseFromString(s, 'image/svg+xml')
      .documentElement as unknown as SVGSVGElement
    )
  }

  fmap(
    f: (svg: SVGSVGElement, ...fargs: any[]) => SVGSVGElement,
    ...fargs: any[]
  ): SVG {
    return new SVG(() => f(this.materialize(), ...fargs))
  }

  call(
    f: (svg: SVGSVGElement, ...fargs: any[]) => any,
    ...fargs: any[]
  ): SVG {
    return new SVG(() => {
      const svg = this.materialize()
      f(svg, ...fargs)
      return svg
    })
  }

  attrs(attrs: object): SVG {
    return this.call(node => {
      Object.entries(attrs).reduce((acc, [k, v]) => {
        if (v === null)
          acc.removeAttribute(k)
        else
          acc.setAttribute(k, v)
        return acc
      }, node)
    })
  }

  toString(): string {
    return this.materialize().outerHTML
  }

  appendTo(parent: HTMLElement): void {
    parent.append(this.materialize())
  }

  toPDFKit(doc: PDFKit, {x=0, y=0, ...options}={}) {
    svgToPDFKit(doc, this.toString(), x, y, options)
  }
}


class Foo extends SVG {
}

// Foo.cre
