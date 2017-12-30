export class Point2 {
  static ORIGO = new Point2(0, 0);

  static equals(a, b) {
    return a.isEqualTo(b);
  }

  static getDistanceBetween(a, b) {
    return a.getDistanceTo(b);
  }

  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add() {
    if ((arguments[0] instanceof Point2) || (arguments[0] instanceof Vector2)) {
      for (const arg of arguments) {
        this.x += arg.x;
        this.y += arg.y;
      }
    } else {
      this.x += arguments[0];
      this.y += arguments[1];
    }

    return this;
  }

  getVectorTo(otherPoint) {
    return new Vector2(otherPoint.x - this.x, otherPoint.y - this.y);
  }

  isEqualTo(otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }

  getDistanceTo(otherPoint) {
    return this.getVectorTo(otherPoint).length;
  }

  clone() {
    return new Point2(this.x, this.y);
  }
};

export class Vector2 {
  static NULL = new Vector2(0, 0);

  static equals(a, b) {
    return a.isEqualTo(b);
  }

  x;
  y;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  offset(x, y) {
    this.x += x;
    this.y += y;
    return this;
  }

  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  scaleToLength(newLength) {
    this.scale(newLength / this.length);
    return this;
  }

  normalize() {
    return this.scaleToLength(1);
  }

  isEqualTo(otherPoint) {
    return this.x === otherPoint.x && this.y === otherPoint.y;
  }

  clone() {
    return new Vector2(this.x, this.y);
  }

  toNormalized() {
    return this.clone().normalize();
  }
};
