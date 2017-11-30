class Point2 {
  static equals(a, b) {
    return a.isEqualTo(b);
  }

  static getDistanceBetween(a, b) {
    return a.getDistanceTo(b);
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add() {
    if ((arguments[0] instanceof Point2) || (arguments[0] instanceof Vec2)) {
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
    return new Vec2(otherPoint.x - this.x, otherPoint.y - this.y);
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
}

Point2.ORIGO = new Point2(0, 0);

class Vec2 {
  static equals(a, b) {
    return a.isEqualTo(b);
  }

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
    return new Vec2(this.x, this.y);
  }

  toNormalized() {
    return this.clone().normalize();
  }
}

Vec2.NULL = new Vec2(0, 0);

function clamp(a, min, max) {
  return Math.min(Math.max(a, min), max);
}

function genRandom(min, max) {
  return min + Math.random() * (max - min);
}

class ColorRGB {
  static createRandom() {
    return new ColorRGB(
      genRandom(0, 256),
      genRandom(0, 256),
      genRandom(0, 256)
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

class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    this._orbs = [];
    this._isRunning = false;

    this._genFrame = this._genFrame.bind(this);

    this.minOrbSpeed = 0.4;
    this.maxOrbSpeed = 2;

    this.minOrbSize = 2;
    this.maxOrbSize = 10;

    this.orbConnectionThreshold = 120;
    this.orbConnectionMaxWidth = 5;

    this._lastFrameTime = null;
    this._fpsSamples = [];
    this._fpsSampleSize = 10;
    this._fpsCallback = null;
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  createOrb() {
    const loc = new Point2(genRandom(0, this.width), genRandom(0, this.height));
    const vec = (new Vec2(Math.random(), Math.random())).scaleToLength(genRandom(this.minOrbSpeed, this.maxOrbSpeed));
    const size = genRandom(this.minOrbSize, this.maxOrbSize);

    const orb = new Orb(loc, vec, size);
    this._orbs.push(orb);
    return orb;
  }

  get numOrbs() {
    return this._orbs.length;
  }

  set numOrbs(numOrbs) {
    if (numOrbs < this._orbs.length) {
      this._orbs.splice(numOrbs);
    } else {
      for (let i = 0; i < numOrbs - this._orbs.length; i++) {
        this.createOrb();
      }
    }
  }

  update() {
    for (const orb of this._orbs) {
      orb.update(this);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  _renderConnections() {
    let remainingOrbs = this._orbs.concat([]);

    let orb;
    while ((orb = remainingOrbs.pop()) !== undefined) {
      for (const otherOrb of remainingOrbs) {
        const distance = Point2.getDistanceBetween(orb.location, otherOrb.location);
        if (distance <= this.orbConnectionThreshold) {
          this.context.save();

          this.context.strokeStyle = `rgba(0, 153, 255, ${1 - distance / this.orbConnectionThreshold})`;
          this.context.lineWidth = (1 - (distance / this.orbConnectionThreshold)) * this.orbConnectionMaxWidth;

          this.context.beginPath();
          this.context.moveTo(Math.floor(orb.location.x), Math.floor(orb.location.y));
          this.context.lineTo(Math.floor(otherOrb.location.x), Math.floor(otherOrb.location.y));
          this.context.stroke();

          this.context.restore();
        }
      }
    }
  }

  render() {
    // clear the canvas
    this.clear();

    // render the orbs
    for (const orb of this._orbs) {
      orb.render(this.context);
    }

    this._renderConnections();
  }

  get isRunning() {
    return this._isRunning;
  }

  _genFrame() {
    if (!this._isRunning)
      return;

    if (this._fpsCallback !== null) {
      const nowMS = performance.now();
      if (this._lastFrameTime !== null) {
        const elapsedMS = nowMS - this._lastFrameTime;
        this._fpsSamples.push(1000.0 / elapsedMS);

        if (this._fpsSamples.length >= this._fpsSampleSize) {
          const avgFPS = this._fpsSamples.reduce((acc, item) => acc + item, 0) / this._fpsSamples.length;
          this._fpsSamples = [];
          this._fpsCallback(avgFPS);
          this._fpsCallback = null;
        }
      }

      this._lastFrameTime = nowMS;
    }

    this.update();
    this.render();

    window.requestAnimationFrame(this._genFrame);
  }

  run() {
    this._isRunning = true;
    window.requestAnimationFrame(this._genFrame);
  }

  stop() {
    this._isRunning = false;
  }

  measureFPS(callback) {
    if (this._fpsCallback !== null)
      return false;

    this._lastFrameTime = null;
    this._fpsCallback = callback;
    return true;
  }
}

class Orb {
  constructor(loc, vec, size) {
    this.location = loc;
    this.vector = vec;
    this.size = size;
    this.color = ColorRGB.createRandom();
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

      const dest = new Point2(genRandom(minX, maxX), genRandom(minY, maxY));
      this.redirectTo(dest, this.speed);
    }
  }

  render(ctx) {
    ctx.save();
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

    ctx.restore();
  }
}