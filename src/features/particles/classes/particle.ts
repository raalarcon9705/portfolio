import { circleCollision } from '../functions/math';
import { ICircle } from '../interfaces/circle';

/**
 * @class Particle class for background
 */
export class Particle {
  constructor(
    public x: number,
    public y: number,
    public directionX: number,
    public directionY: number,
    public size: number,
    public color: string,
    public canvas: HTMLCanvasElement,
    public ctx: CanvasRenderingContext2D
  ) {}

  get circle(): ICircle {
    return {
      x: this.x,
      y: this.y,
      radius: this.size,
    };
  }

  /**
   * @description Method to draw individual particle
   */
  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    this.ctx.fillStyle = this.color;
    this.ctx.shadowColor = this.color;
    this.ctx.shadowBlur = 10;
    this.ctx.fill();
  }

  /**
   * @description Check particle position, check mouse position, move the particle, draw the particle
   */
  update(mouse?: ICircle) {
    // Check if particle is still within canvas
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    // Check collision between mouse and particle
    if (mouse && circleCollision(mouse, this.circle)) {
      if (mouse.x < this.x && this.x < this.canvas.width - this.size * 10) {
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        this.x -= 10;
      }

      if (mouse.y < this.y && this.y < this.canvas.height - this.size * 10) {
        this.y += 10;
      }

      if (mouse.y > this.y && this.y > this.size * 10) {
        this.y -= 10;
      }
    }

    // Move particle
    this.x += this.directionX;
    this.y += this.directionY;

    // Draw particle
    this.draw();
  }
}
