import { makeSVGClass } from "./base";
import { serializer } from "./serializers/browser";

export const SVG = makeSVGClass(serializer);
