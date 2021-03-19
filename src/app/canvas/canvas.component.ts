import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {draw, DrawParams, spin} from '../utils/image-manipulation';

const trace = (tag: string) => <T>(x: T): T => x;

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements AfterViewInit {

  // @ts-ignore
  @ViewChild('canvasElement') canvas: ElementRef<HTMLCanvasElement>;

  @Input() url: string | undefined;

  private context: CanvasRenderingContext2D | undefined;

  constructor() { }

  ngAfterViewInit(): void {
    // @ts-ignore
    this.context = this.canvas.nativeElement.getContext('2d');
    this.initImage('https://spotlightstores.com.au/favicon.ico')
      .then(console.log.bind(console, 'inited'));
  }

  initImage = (src: string): Promise<DrawParams> =>
    // fetch(src)
      // .then(trace('fetched'))
      // .then(response => response.blob())
      // .then(trace('blob'))
      // .then(this.readAsBase64)
      // .then(trace('base64'))
      // .then(this.loadImage)
    this.loadImage(src)
      .then(trace('image'))
      .then(this.writeImageToCanvas)


  readAsBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    })

  loadImage = (src: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
      image.onerror = reject;
    })

  writeImageToCanvas = (image: HTMLImageElement): Promise<DrawParams> =>
    draw({
      canvas: this.canvas.nativeElement,
      ctx: this.context,
      image,
      transformer: spin(40)
    })

}
