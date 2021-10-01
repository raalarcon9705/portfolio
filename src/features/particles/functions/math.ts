import { ICircle } from '../interfaces/circle';
import { Point2D } from '../interfaces/point-2d';

/**
 *
 * @param c1 circle 1
 * @param c2 circle 2
 * @returns true if there is collision, false otherwise
 * @description Check collision between two circles
 */
export function circleCollision(c1: ICircle, c2: ICircle) {
  const dx = c1.x - c2.x;
  const dy = c1.y - c2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < c1.radius + c2.radius;
}

/**
 *
 * @param p1 point 1
 * @param p2 point 2
 * @returns Square distance between two 2d pints
 */
export function distance(p1: Point2D, p2: Point2D) {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return dx * dx + dy * dy;
}
