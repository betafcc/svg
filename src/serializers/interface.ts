export type Serializer<T> = {
  fromString(s: string): T;
  toString(node: T): string;
};

export type SVGSVGElementSerializer = Serializer<SVGSVGElement>;
