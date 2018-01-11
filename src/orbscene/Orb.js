import { Point2 } from './geometry2D';
import ColorRGB from './ColorRGB';
import { getRandomIntBetween, clamp } from './util/math';

export default class Orb {
  constructor(loc, vec, size) {
    this.location = loc;
    this.vector = vec;
    this.size = size;
    this.color = ColorRGB.createRandom();
    //this.color = new ColorRGB(0xFF, 0x66, 0x00); -- orange
  }

  get direction() {
    return this.vector.toNormalized();
  }

  get speed() {
    return this.vector.length;
  }

  redirectTo(destPoint, speed) {
    this.vector = this.location.getVectorTo(destPoint).scaleToLength(speed);
    this.color = ColorRGB.createRandom();
  }

  update(scene) {
    this.location.add(this.vector);

    let redirect = false;

    if (this.location.x <= this.size || this.location.x + this.size >= scene.width) {
      this.location.x = clamp(this.location.x, this.size, scene.width - this.size);
      redirect = true;
    }

    if (this.location.y <= this.size || this.location.y + this.size >= scene.height) {
      this.location.y = clamp(this.location.y, this.size, scene.height - this.size);
      redirect = true;
    }

    if (redirect) {
      // generate random vector that points inside the scene
      // for this, we'll select a random point along the opposite wall, and head towards that
      let minX, maxX, minY, maxY;
      if (this.location.x === this.size) {
        // left edge
        minX = maxX = scene.width;
        minY = 0;
        maxY = scene.height;
      } else if (this.location.x === scene.width - this.size) {
        // right edge
        minX = maxX = 0;
        minY = 0;
        maxY = scene.height;
      } else if (this.location.y === this.size) {
        // top edge
        minX = 0;
        maxX = scene.width;
        minY = maxY = scene.height;
      } else /*if(this.location.y === scene.height - this.size)*/ {
        // bottom edge
        minX = 0;
        maxX = scene.width;
        minY = maxY = 0;
      }

      const dest = new Point2(getRandomIntBetween(minX, maxX), getRandomIntBetween(minY, maxY));
      this.redirectTo(dest, this.speed);
    }
  }

  render(ctx) {
    ctx.fillStyle = this.color.toString();

    ctx.beginPath();
    ctx.arc(
      /*x=*/Math.floor(this.location.x),
      /*y=*/Math.floor(this.location.y),
      /*radius=*/Math.floor(this.size),
      /*startAngle=*/0,
      /*endAngle=*/Math.PI * 2,
      /*counterclockwise=*/false
    );
    ctx.fill();
  }
};
