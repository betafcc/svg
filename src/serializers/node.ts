import { JSDOM } from "jsdom";
import { SVGSVGElementSerializer } from "./interface";

export const serializer: SVGSVGElementSerializer = {
  fromString(s: string): SVGSVGElement {
    return new JSDOM(s).window.document.querySelector("svg") as SVGSVGElement;
  },

  toString(node: SVGSVGElement): string {
    // Fix a jsdom issue where all SVG tagNames are lowercased:
    // https://github.com/tmpvar/jsdom/issues/620
    return ["linearGradient", "radialGradient", "clipPath", "textPath"].reduce(
      (text, tagName) =>
        text.replace(
          new RegExp("(<|</)" + tagName.toLowerCase() + "\\b", "g"),
          (all, start) => start + tagName
        ),
      node.outerHTML
    );
  }
};
