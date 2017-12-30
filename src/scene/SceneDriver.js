import Orb from './Orb';
import { Point2, Vector2 } from './geometry2D';
import { getRandomIntBetween } from '../util/math';

export default class SceneDriver {
  static defaultSettings = {
    renderOrbs: true,
    numOrbs: 100,
    minOrbSpeed: 0.4,
    maxOrbSpeed: 2,
    minOrbSize: 2,
    maxOrbSize: 10,
    connectionThreshold: 120,
    connectionMaxWidth: 5
  };

  canvasEl;
  context;

  _settings;

  _orbs = [];
  _isRunning = false;
  _runningTransitionCallback = null;
  _animFrameRequestID = null;

  _lastFrameTime = null;
  _fpsSamples = [];
  _fpsSampleSize = 10;
  _fpsCallback = null;

  constructor(canvasEl, settings) {
    this.canvasEl = canvasEl;
    this.context = canvasEl.getContext("2d");

    this._settings = Object.assign({}, SceneDriver.defaultSettings);

    this._runProcFrame = this._runProcFrame.bind(this);

    if (settings)
      this.updateSettings(settings);
  }

  get width() {
    return this.canvasEl.width;
  }

  get height() {
    return this.canvasEl.height;
  }

  get settings() {
    return this._settings;
  }

  createOrb() {
    const loc = new Point2(getRandomIntBetween(0, this.width), getRandomIntBetween(0, this.height));
    const vec = (new Vector2(Math.random(), Math.random()))
      .scaleToLength(getRandomIntBetween(this._settings.minOrbSpeed, this._settings.maxOrbSpeed));
    const size = getRandomIntBetween(this._settings.minOrbSize, this._settings.maxOrbSize);

    const orb = new Orb(loc, vec, size);
    this._orbs.push(orb);
    return orb;
  }

  _changeNumOrbs(newNumOrbs) {
    if (newNumOrbs < this._orbs.length) {
      this._orbs.splice(newNumOrbs);
    } else {
      for (let i = 0; i < newNumOrbs - this._orbs.length; i++) {
        this.createOrb();
      }
    }
  }

  updateSettings(changes) {
    if (changes.numOrbs) {
      this._changeNumOrbs(changes.numOrbs);
    }

    Object.assign(this._settings, changes);
  }

  update() {
    for (const orb of this._orbs) {
      orb.update(this);
    }
  }

  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  _renderConnection(orb1, orb2, distance) {
    //this.context.strokeStyle = `rgba(255, 192, 203, ${1 - distance / this._settings.connectionThreshold})`;
    this.context.strokeStyle = `rgba(0, 153, 255, ${1 - distance / this._settings.connectionThreshold})`;
    this.context.lineWidth = (1 - (distance / this._settings.connectionThreshold)) * this._settings.connectionMaxWidth;

    this.context.beginPath();
    this.context.moveTo(Math.floor(orb1.location.x), Math.floor(orb1.location.y));
    this.context.lineTo(Math.floor(orb2.location.x), Math.floor(orb2.location.y));
    this.context.stroke();
  }

  _renderConnections() {
    const remainingOrbs = this._orbs.concat([]);

    let orb;
    while ((orb = remainingOrbs.pop()) !== undefined) {
      for (const otherOrb of remainingOrbs) {
        const distance = Point2.getDistanceBetween(orb.location, otherOrb.location);
        if (distance <= this._settings.connectionThreshold) {
          this._renderConnection(orb, otherOrb, distance);
        }
      }
    }
  }

  render() {
    this.clear();

    if (this._settings.renderOrbs) {
      for (const orb of this._orbs) {
        orb.render(this.context);
      }
    }

    this._renderConnections();
  }

  get isRunning() {
    return this._isRunning;
  }

  processFrame(ts) {
    this.update(ts);
    this.render(ts);
  }

  _runProcFrame(ts) {
    if (this._runningTransitionCallback) {
      this._runningTransitionCallback();
      this._runningTransitionCallback = null;
    }

    this.processFrame(ts);

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

    if (this._isRunning) {
      this._animFrameRequestID = window.requestAnimationFrame(this._runProcFrame);
    } else {
      if (this._runningTransitionCallback) {
        this._runningTransitionCallback();
        this._runningTransitionCallback = null;
      }
    }
  }

  run(callback) {
    if (this._isRunning)
      return;

    this._isRunning = true;
    this._runningTransitionCallback = callback || null;

    this._animFrameRequestID = window.requestAnimationFrame(this._runProcFrame);
  }

  stop(callback) {
    if (!this._isRunning)
      return;

    this._isRunning = false;

    if (this._animFrameRequestID) {
      window.cancelAnimationFrame(this._animFrameRequestID);
      this._animFrameRequestID = null;

      if (callback)
        callback();
    } else {
      this._runningTransitionCallback = callback || null;
    }
  }

  measureFPS(callback) {
    if (this._fpsCallback !== null)
      return false;

    this._lastFrameTime = null;
    this._fpsCallback = callback;
    return true;
  }

  renderWithContext(tmpContext) {
    const oldContext = this.context;
    this.context = tmpContext;
    this.render();
    this.context = oldContext;
    return tmpContext;
  }

  // TODO: move to UI code
  /*exportToSVG() {
    const svgRendererContext = new C2S(scene.width, scene.height);
    scene.renderWithContext(svgRendererContext);
    promptDownloadFile("orbscene.svg", svgRendererContext.getSerializedSvg(), "image/svg+xml");
  }*/
};
