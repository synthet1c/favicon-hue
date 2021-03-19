type Transformer = (r: number, g: number, b: number, a: number) => number[];

export interface DrawParams {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  image: HTMLImageElement;
  transformer: Transformer;
}

export async function draw({
  canvas,
  ctx,
  image,
  transformer,
}: DrawParams): Promise<DrawParams> {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b, a] = transformer(
      data[i],
      data[i + 1],
      data[i + 2],
      data[i + 3]
    );
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
  }
  ctx.putImageData(imageData, 0, 0);

  return {
    canvas,
    ctx,
    image,
    transformer,
  };
}

export function spin(degrees: number): (r: number, g: number, b: number, a: number) => number[] {
  return (r: number, g: number, b: number, a: number): number[] => {

    const whiteTolerance = 250;

    if (r > whiteTolerance && g > whiteTolerance && b > whiteTolerance) {
      return [r, g, b, a];
    }

    const [h, s, l] = rgbToHsl(r, g, b);
    const result = hslToRgb((h * (degrees / 100)) % 1, s, l);
    return [
      result[0],
      result[1],
      result[2],
      a
    ];
  };
}

export function rgbToHsl(r: number, g: number, b: number): number[] {

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s;
  const l = (max + min) / 2;

  if (max === min) {
    h = s = 0; // achromatic
  }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, l];
}


export function hslToRgb(h: number, s: number, l: number): number[] {
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  }
  else {
    // tslint:disable-next-line:no-shadowed-variable
    function hue2rgb(p: number, q: number, t: number): number {
      if (t < 0) {
        t += 1;
      }
      if (t > 1) {
        t -= 1;
      }
      if (t < 1 / 6) {
        return p + (q - p) * 6 * t;
      }
      if (t < 1 / 2) {
        return q;
      }
      if (t < 2 / 3) {
        return p + (q - p) * (2 / 3 - t) * 6;
      }
      return p;
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [r * 255, g * 255, b * 255];
}
