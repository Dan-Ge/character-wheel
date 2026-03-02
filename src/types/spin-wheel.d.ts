declare module 'spin-wheel' {
  interface WheelItem {
    backgroundColor?: string | null;
    image?: HTMLImageElement | null;
    imageOpacity?: number;
    imageRadius?: number;
    imageRotation?: number;
    imageScale?: number;
    label?: string;
    labelColor?: string | null;
    value?: unknown;
    weight?: number;
    getCenterAngle(): number;
    getEndAngle(): number;
    getIndex(): number;
    getRandomAngle(): number;
    getStartAngle(): number;
    init(props?: Partial<WheelItem>): void;
  }

  interface WheelProps {
    borderColor?: string;
    borderWidth?: number;
    debug?: boolean;
    image?: HTMLImageElement | null;
    isInteractive?: boolean;
    itemBackgroundColors?: string[];
    itemLabelAlign?: 'left' | 'center' | 'right';
    itemLabelBaselineOffset?: number;
    itemLabelColors?: string[];
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelStrokeColor?: string;
    itemLabelStrokeWidth?: number;
    items?: Array<Partial<WheelItem>>;
    lineColor?: string;
    lineWidth?: number;
    offset?: { x: number; y: number };
    onCurrentIndexChange?: ((event: { type: string; currentIndex: number }) => void) | null;
    onRest?: ((event: { type: string; currentIndex: number; rotation: number }) => void) | null;
    onSpin?: ((event: { type: string; method: string; [key: string]: unknown }) => void) | null;
    overlayImage?: HTMLImageElement | null;
    pixelRatio?: number;
    pointerAngle?: number;
    radius?: number;
    rotation?: number;
    rotationResistance?: number;
    rotationSpeed?: number;
    rotationSpeedMax?: number;
  }

  export class Wheel {
    constructor(container: HTMLElement, props?: WheelProps);

    borderColor: string;
    borderWidth: number;
    debug: boolean;
    isInteractive: boolean;
    itemBackgroundColors: string[];
    itemLabelAlign: 'left' | 'center' | 'right';
    itemLabelColors: string[];
    itemLabelFont: string;
    itemLabelFontSizeMax: number;
    itemLabelRadius: number;
    itemLabelRadiusMax: number;
    items: WheelItem[];
    lineColor: string;
    lineWidth: number;
    offset: { x: number; y: number };
    onCurrentIndexChange: ((event: { type: string; currentIndex: number }) => void) | null;
    onRest: ((event: { type: string; currentIndex: number; rotation: number }) => void) | null;
    onSpin: ((event: { type: string; method: string; [key: string]: unknown }) => void) | null;
    overlayImage: HTMLImageElement | null;
    pixelRatio: number;
    pointerAngle: number;
    radius: number;
    rotation: number;
    rotationResistance: number;
    readonly rotationSpeed: number;
    rotationSpeedMax: number;

    init(props?: WheelProps): void;
    resize(): void;
    remove(): void;
    spin(rotationSpeed?: number): void;
    spinTo(rotation?: number, duration?: number, easingFunction?: ((n: number) => number) | null): void;
    spinToItem(
      itemIndex?: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: 1 | -1,
      easingFunction?: ((n: number) => number) | null,
    ): void;
    stop(): void;
    getCurrentIndex(): number;
  }
}
