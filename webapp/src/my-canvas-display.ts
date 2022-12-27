import { LitElement, css, html, PropertyValueMap } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { pixelcoord } from "interfaces/PixelCoord";
import { rgb } from "interfaces/rgb";

declare var Module: any;

const imageScale = 5;

const hexToRgb = (hex: string): rgb => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        short:
          "" +
          parseInt(result[1], 16) +
          "," +
          parseInt(result[2], 16) +
          "," +
          parseInt(result[3], 16),
      }
    : {
        r: 0,
        g: 0,
        b: 0,
        short: "00,00,00",
      };
};

@customElement("my-canvas-display")
export class MyCanvasDisplay extends LitElement {
  @query("#display")
  canvas!: HTMLCanvasElement;

  @property({ type: Number })
  displayWidth: number = 0;

  @property({ type: Number })
  displayHeight: number = 0;

  @property({ type: Number })
  canvasScale: number = imageScale;

  @property({ type: Number })
  canvasGridWidth: number = 2;

  @property({ type: Boolean })
  showGrid: boolean = true;

  mouse_pixel_coord: pixelcoord = { x: 0, y: 0 };
  mouse_x: number = 0;
  mouse_y: number = 0;
  width: number = 0;
  height: number = 0;
  canvasWidth: number = 0;
  canvasHeight: number = 0;
  canvasCalcScaleX: number = 0;
  canvasCalcScaleY: number = 0;
  ctx: CanvasRenderingContext2D | null = null;
  arrayBuffer!: ArrayBuffer;
  typedArray!: Uint8Array;
  lastFrameTs: number = 0;
  lastAnimationRequest = 0;
  buffer: any = null;

  isMovingElement: boolean = false;
  elementStartMoveCoord: pixelcoord = { x: 0, y: 0 };
  effectLoop = Module.cwrap("Loop", "void");

  connectedCallback() {
    super.connectedCallback();
    //Module.onRuntimeInitialized = () => {
    console.log("pwet");

    this.arrayBuffer = new ArrayBuffer(this.width * this.height);
    this.typedArray = new Uint8Array(this.width * this.height);

    //this.effectInit();
    //draw();
    //};
  }

  effectInit() {
    let error;
    let resultArray;

    try {
      // Init the typed array with the same length as the number of items in the array parameter
      // Populate the array with the values
      var view = new DataView(this.arrayBuffer);
      for (let i = 0; i < this.width * this.height; i++) {
        this.typedArray[i] = view.getUint8(i);
      }

      // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
      this.buffer = Module._malloc(
        this.typedArray.length * this.typedArray.BYTES_PER_ELEMENT
      );

      // Assign the data to the heap - Keep in mind bytes per element
      Module.HEAPU32.set(this.typedArray, this.buffer >> 4);

      // Finally, call the function with "number" parameter type for the array (the pointer), and an extra length parameter
      //const outputPointer = Module._malloc(8);

      const resultPointer = Module.ccall(
        "Init",
        "number",
        ["number", "number", "number"],
        [this.buffer, this.width, this.height]
      );

      //todo: pass result back to javasscript array
      //let offset = Module.getValue(resultPointer, "i64");
      //console.log(offset);
      //let offset = typedArray.length*typedArray.BYTES_PER_ELEMENT

      resultArray = new Uint8Array(
        Module.HEAPU8.subarray(
          resultPointer,
          resultPointer + this.typedArray.byteLength
        )
      );
      //const decodedResults = msgpack.decode(resultArray);
    } catch (e) {
      error = e;
    } finally {
      // To avoid memory leaks we need to always clear out the allocated heap data
      // This needs to happen in the finally block, otherwise thrown errors will stop code execution before this happens
      Module._free(this.buffer);
    }
    // Finally, throw any errors so that we know when something goes wrong
    if (error) throw error;
    //console.log("init:", resultArray);
  }

  effectGetBuffer() {
    let error;
    let resultArray;
    try {
      const resultPointer = Module.ccall("GetBuffer", "number", [], []);
      resultArray = new Uint8Array(
        Module.HEAPU8.subarray(
          resultPointer,
          resultPointer + this.typedArray.byteLength
        )
      );
      //const decodedResults = msgpack.decode(resultArray);
    } catch (e) {
      error = e;
    } finally {
    }
    // Finally, throw any errors so that we know when something goes wrong
    if (error) throw error;
    //console.log("getbuffer:", resultArray);
    return resultArray;
  }

  _clearBuffer(rgb: rgb = hexToRgb("#000000")) {
    for (let i = 0; i < this.typedArray.length; i += 4) {
      this.typedArray[i + 0] = rgb.r;
      this.typedArray[i + 1] = rgb.g;
      this.typedArray[i + 2] = rgb.b;
      this.typedArray[i + 3] = 0;
    }
  }

  _draw(ts: number) {
    //todo: limit fps?
    //if(ts-this.lastFrameTs < (1000/30))
    //  return;
    if (!this.buffer) this.effectInit();
    this.effectLoop();
    const resultArray = this.effectGetBuffer();
    //console.log("getbuffer:", this.resultArray);
    if (!resultArray) return;

    this.lastFrameTs = ts;
    if (this.ctx) {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
      this._drawCanvas(resultArray);
      this.ctx.restore();
    }
    this.lastAnimationRequest = requestAnimationFrame((ts: number) => {
      this._draw(ts);
    });
  }

  _initCanvas(width: number, height: number) {
    if (this.lastAnimationRequest) {
      window.cancelAnimationFrame(this.lastAnimationRequest);
    }
    this.width = width;
    this.height = height;
    this.arrayBuffer = new ArrayBuffer(width * height * 4);
    this.typedArray = new Uint8Array(this.arrayBuffer);
    this.canvasWidth =
      width * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (width + 1) : 0);
    this.canvasHeight =
      height * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (height + 1) : 0);
    this.canvasCalcScaleX = this.canvasWidth / width;
    this.canvasCalcScaleY = this.canvasHeight / height;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    const event = new CustomEvent("init-canvas", {
      detail: {
        width: width,
        height: height,
      },
    });
    this.dispatchEvent(event);
    this._draw(this.lastFrameTs);
  }

  _drawCanvasGrid(ctx: CanvasRenderingContext2D) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = this.canvasGridWidth;
    for (
      let x = this.canvasGridWidth / 2;
      x < this.canvasWidth;
      x += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.canvasHeight);
      ctx.stroke();
    }
    for (
      let y = this.canvasGridWidth / 2;
      y < this.canvasHeight;
      y += this.canvasScale + this.canvasGridWidth
    ) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.canvasWidth, y);
      ctx.stroke();
    }
  }

  _drawCanvas(buffer: Uint8Array) {
    this.canvasWidth =
      this.displayWidth * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.displayWidth + 1) : 0);
    this.canvasHeight =
      this.displayHeight * this.canvasScale +
      (this.showGrid ? this.canvasGridWidth * (this.displayHeight + 1) : 0);
    this.canvasCalcScaleX = this.canvasWidth / this.displayWidth;
    this.canvasCalcScaleY = this.canvasHeight / this.displayHeight;
    this.canvas.width = this.canvasWidth;
    this.canvas.height = this.canvasHeight;

    const ctx = this.ctx;
    if (!ctx) return;
    //fill with white backgound (for transparency)
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    //Draw grid
    if (this.showGrid) {
      this._drawCanvasGrid(ctx);
    }

    //drawing to scaled canvas
    for (let x = 0; x < this.displayWidth; x++) {
      for (let y = 0; y < this.displayHeight; y++) {
        // get color from buffer
        const pixelIndex = (y * this.displayWidth + x) * 4;
        const r = buffer[pixelIndex];
        const g = buffer[pixelIndex + 1];
        const b = buffer[pixelIndex + 2];
        //put pixel color but at 0.9 alpha on canvas
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + ", 0.9)";
        const canvasX =
          x * this.canvasScale +
          (this.showGrid ? this.canvasGridWidth * (x + 1) : 0);
        const canvasY =
          y * this.canvasScale +
          (this.showGrid ? this.canvasGridWidth * (y + 1) : 0);
        //draw scaled pixel rect
        ctx.fillRect(canvasX, canvasY, this.canvasScale, this.canvasScale);
      }
    }
  }

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    this.ctx = this.canvas.getContext("2d");
    this._initCanvas(this.displayWidth, this.displayHeight);
  }

  protected update(
    changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    super.update(changedProperties);
    if (
      changedProperties.has("displayWidth") ||
      changedProperties.has("displayHeight")
    ) {
      if (!this.canvas) return;
      this._initCanvas(this.displayWidth, this.displayHeight);
      this.effectInit();
    }
  }

  render() {
    return html`
      <div class="">
        <canvas id="display"></canvas>
      </div>
    `;
  }

  static styles = css`
    :host {
      background-color: pink;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "my-canvas-display": MyCanvasDisplay;
  }
}
