import { distance } from '../functions/math';
import { ICircle } from '../interfaces/circle';
import { Point2D } from '../interfaces/point-2d';
import { Particle } from './particle';

export interface ParticlesStyle {
  background?: string;
  particleColor?: string;
  strokeStyle?: string;
  position?: string;
  top?: string;
  left?: string;
  width?: string;
  height?: string;
}

export class Particles {
  static defaultStyles = {
    background: 'radial-gradient(#1c1425, #07060b)',
    particleColor: '#bb95e1',
    strokeStyle: '#bb95e1a8',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
  };

  styles: ParticlesStyle = Particles.defaultStyles;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private mouse: ICircle;
  private particlesArray: Particle[];
  private resizeObserver: ResizeObserver;
  container = document.body;

  constructor(container?: HTMLElement, styles?: ParticlesStyle) {
    if (container) {
      this.container = container;
    }

    this.styles = {
      ...Particles.defaultStyles,
      ...styles,
    };

    this.build();
    this.init();
    this.animate();
  }

  private setDimensions() {
    if (this.container.isEqualNode(document.body)) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    } else {
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
    }
    this.mouse.radius = ((this.canvas.height / 80) * this.canvas.width) / 80;
  }

  private applyStyle() {
    this.canvas.style.background = this.styles.background;
    this.canvas.style.position = this.styles.position;
    this.canvas.style.top = this.styles.top;
    this.canvas.style.left = this.styles.left;
    this.canvas.style.width = this.styles.width;
    this.canvas.style.height = this.styles.height;
  }

  private build() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.mouse = {
      x: undefined,
      y: undefined,
      radius: ((this.canvas.height / 80) * this.canvas.width) / 80,
    };

    this.setDimensions();
    this.applyStyle();

    this.container.prepend(this.canvas);

    this.container.addEventListener('mousemove', (ev) => {
      this.mouse.x = ev.x;
      this.mouse.y = ev.y;
    });

    // this.container.addEventListener('resize', (ev) => {
    //   this.setDimensions();
    // });

    this.resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        this.setDimensions();
      });
    });

    this.resizeObserver.observe(this.container);

    this.container.addEventListener('mouseout', (ev) => {
      this.mouse.x = undefined;
      this.mouse.y = undefined;
    });
  }

  /**
   * @description Create particle array
   */
  init() {
    this.particlesArray = [];
    const numberOfParticles = (this.canvas.height * this.canvas.width) / 7000;
    for (let i = 0; i < numberOfParticles; i++) {
      const size = Math.random() * 5 + 1;
      const x = Math.random() * (innerWidth - size * 2 - size * 2 + size * 2);
      const y = Math.random() * (innerHeight - size * 2 - size * 2 + size * 2);
      const directionX = Math.random() * 1 - 0.5;
      const directionY = Math.random() * 1 - 0.5;
      const color = this.styles.particleColor;
      const particle = new Particle(
        x,
        y,
        directionX,
        directionY,
        size,
        color,
        this.canvas,
        this.ctx
      );
      this.particlesArray.push(particle);
    }
  }

  /**
   * @description Animation loop
   */
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    let particles = this.particlesArray;
    if (this.mouse.x && this.mouse.y) {
      const mouseParticle = new Particle(
        this.mouse.x,
        this.mouse.y,
        0,
        0,
        3,
        this.styles.particleColor,
        this.canvas,
        this.ctx
      );

      particles = particles.concat(mouseParticle);
    }
    for (let i = 0; i < this.particlesArray.length; i++) {
      particles[i].update(this.mouse);
    }
    this.connect();
  }

  connect() {
    const points = this.particlesArray as Point2D[]; //.concat(this.mouse);
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const maxDistance = (this.canvas.width / 7) * (this.canvas.height / 7);
        if (distance(points[i], points[j]) < maxDistance) {
          this.ctx.strokeStyle = this.styles.strokeStyle;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(points[i].x, points[i].y);
          this.ctx.lineTo(points[j].x, points[j].y);
          this.ctx.shadowBlur = 0;
          this.ctx.stroke();
        }
      }
    }
  }
}
