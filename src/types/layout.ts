export type LayoutUnit = "mm" | "px" | "cm" | "in";

export type ElementType = "qr" | "text" | "image";

export interface LayoutElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width?: number;
  height?: number;

  fontSize?: number;
  bold?: boolean;
  dataKey: string; // value from database
}

export interface LayoutPage {
  width: number;
  height: number;
  unit: LayoutUnit;
}

export interface QRLayout {
  name: string;
  page: LayoutPage;
  elements: LayoutElement[];
}
