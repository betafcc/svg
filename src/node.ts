import { makeSVGClass } from "./base";
import { serializer } from "./serializers/node";

export const SVG = makeSVGClass(serializer);
