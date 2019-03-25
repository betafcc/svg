import { SVGSVGElementSerializer } from './serializer'

export const browserSerializer: SVGSVGElementSerializer = {
  fromString(s: string): SVGSVGElement {
    return (new DOMParser().parseFromString(s, 'image/svg+xml').documentElement as unknown) as SVGSVGElement
  },

  toString(node: SVGSVGElement): string {
    return node.outerHTML
  }
}
