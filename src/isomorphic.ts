export const SVG =
  typeof window !== "undefined" && typeof window.document !== "undefined"
    ? require("./browser").SVG
    : require("./node").SVG;
