import { getRandomIntBetween } from '../util/math';

export default class ColorRGB {
  static createRandom() {
    return new ColorRGB(
      getRandomIntBetween(0, 256),
      getRandomIntBetween(0, 256),
      getRandomIntBetween(0, 256)
    );
  }

  constructor(red, green, blue) {
    this.red = Math.floor(red) || 0;
    this.green = Math.floor(green) || 0;
    this.blue = Math.floor(blue) || 0;
  }

  toString() {
    return `rgb(${this.red}, ${this.green}, ${this.blue})`;
  }
}