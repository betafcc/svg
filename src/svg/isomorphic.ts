import { isomorphicSerializer } from '../serializer'
import { SVGBrowser } from './browser'

export class SVGIsomorphic extends SVGBrowser {
  static serializer = isomorphicSerializer
}
