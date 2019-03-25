import { SVGSVGElementSerializer } from './serializer'

const plataformSerializer = (): SVGSVGElementSerializer =>
  typeof window !== 'undefined' && typeof window.document !== 'undefined'
    ? require('./browser').browserSerializer
    : require('./node').nodeSerializer

export const isomorphicSerializer: SVGSVGElementSerializer = {
  fromString(s: string): SVGSVGElement {
    return plataformSerializer().fromString(s)
  },

  toString(node: SVGSVGElement): string {
    return plataformSerializer().toString(node)
  }
}
