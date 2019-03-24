import { SVGSVGElementSerializer } from "./interface";

export const browserSVGSVGElementSerializer: SVGSVGElementSerializer = {
  fromString(s: string): SVGSVGElement {
    return (new DOMParser().parseFromString(s, "image/svg+xml")
      .documentElement as unknown) as SVGSVGElement;
  },

  toString(node: SVGSVGElement): string {
    return node.outerHTML;
  }
};