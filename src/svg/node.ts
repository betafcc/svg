import { nodeSerializer } from '../serializer'
import { SVGBrowser } from './browser'

export class SVGNode extends SVGBrowser {
  static serializer = nodeSerializer
}
