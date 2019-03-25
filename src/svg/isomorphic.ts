import { SVGBrowser } from './browser'
import { SVGNode } from './node'

export const SVGIsomorphic =
  typeof window !== 'undefined' && typeof window.document !== 'undefined' ? SVGBrowser : SVGNode
