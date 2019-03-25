import { nodeSerializer } from '../serializer/node'
import { SVGBrowser } from './browser'

export class SVGNode extends SVGBrowser {
  static serializer = nodeSerializer
}
