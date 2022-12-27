export interface EspHomeFontJSON {
  name: string;
  height: number;
  glyphstr: string;
  glyphs: Array<Glyph>;
  data: Array<number>;
}

export interface Glyph {
  glyph: string;
  offset_x: number;
  offset_y: number;
  width: number;
  height: number;
  start: number;
}

export interface RenderResult {
  dataUrl: string;
  width: number;
  height: number;
  image: any;
}

export interface TextBound {
  width: number;
  height: number;
}
