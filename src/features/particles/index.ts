import { Particles, ParticlesStyle } from './classes/particles';

export function createParticles(
  container?: HTMLElement,
  styles?: ParticlesStyle
) {
  return new Particles(container, styles);
}
