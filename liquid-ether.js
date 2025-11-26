// LiquidEther Background Effect - Vanilla JS (converted from React)
class LiquidEther {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
      mouseForce: 20,
      cursorSize: 100,
      isViscous: false,
      viscous: 30,
      iterationsViscous: 32,
      iterationsPoisson: 32,
      dt: 0.014,
      BFECC: true,
      resolution: 0.5,
      isBounce: false,
      autoDemo: true,
      autoSpeed: 0.5,
      autoIntensity: 2.2,
      takeoverDuration: 0.25,
      autoResumeDelay: 3000,
      autoRampDuration: 0.6,
      ...options
    };
    
    this.rafId = null;
    this.isVisible = true;
    this.running = false;
    
    this.init();
  }

  init() {
    this.setupPaletteTexture();
    this.setupCommon();
    this.setupMouse();
    this.setupAutoDriver();
    this.setupOutput();
    this.setupEvents();
    this.start();
  }

  setupPaletteTexture() {
    const stops = this.options.colors;
    let arr;
    if (Array.isArray(stops) && stops.length > 0) {
      arr = stops.length === 1 ? [stops[0], stops[0]] : stops;
    } else {
      arr = ['#ffffff', '#ffffff'];
    }
    
    const w = arr.length;
    const data = new Uint8Array(w * 4);
    for (let i = 0; i < w; i++) {
      const c = new THREE.Color(arr[i]);
      data[i * 4 + 0] = Math.round(c.r * 255);
      data[i * 4 + 1] = Math.round(c.g * 255);
      data[i * 4 + 2] = Math.round(c.b * 255);
      data[i * 4 + 3] = 255;
    }
    
    this.paletteTex = new THREE.DataTexture(data, w, 1, THREE.RGBAFormat);
    this.paletteTex.magFilter = THREE.LinearFilter;
    this.paletteTex.minFilter = THREE.LinearFilter;
    this.paletteTex.wrapS = THREE.ClampToEdgeWrapping;
    this.paletteTex.wrapT = THREE.ClampToEdgeWrapping;
    this.paletteTex.generateMipmaps = false;
    this.paletteTex.needsUpdate = true;
    
    this.bgVec4 = new THREE.Vector4(0, 0, 0, 0);
  }

  setupCommon() {
    this.Common = {
      width: 0,
      height: 0,
      aspect: 1,
      pixelRatio: 1,
      time: 0,
      delta: 0,
      container: this.container,
      renderer: null,
      clock: null
    };
    
    this.Common.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    this.resize();
    
    this.Common.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.Common.renderer.autoClear = false;
    this.Common.renderer.setClearColor(new THREE.Color(0x000000), 0);
    this.Common.renderer.setPixelRatio(this.Common.pixelRatio);
    this.Common.renderer.setSize(this.Common.width, this.Common.height);
    this.Common.renderer.domElement.style.width = '100%';
    this.Common.renderer.domElement.style.height = '100%';
    this.Common.renderer.domElement.style.display = 'block';
    
    this.Common.clock = new THREE.Clock();
    this.Common.clock.start();
    
    this.container.prepend(this.Common.renderer.domElement);
  }

  resize() {
    if (!this.container) return;
    const rect = this.container.getBoundingClientRect();
    this.Common.width = Math.max(1, Math.floor(rect.width));
    this.Common.height = Math.max(1, Math.floor(rect.height));
    this.Common.aspect = this.Common.width / this.Common.height;
    if (this.Common.renderer) {
      this.Common.renderer.setSize(this.Common.width, this.Common.height, false);
    }
    if (this.output) {
      this.output.resize();
    }
  }

  setupMouse() {
    this.Mouse = {
      mouseMoved: false,
      coords: new THREE.Vector2(),
      coords_old: new THREE.Vector2(),
      diff: new THREE.Vector2(),
      timer: null,
      isHoverInside: false,
      hasUserControl: false,
      isAutoActive: false,
      autoIntensity: this.options.autoIntensity,
      takeoverActive: false,
      takeoverStartTime: 0,
      takeoverDuration: this.options.takeoverDuration,
      takeoverFrom: new THREE.Vector2(),
      takeoverTo: new THREE.Vector2()
    };
    
    this.lastUserInteraction = performance.now();
    
    // Event handlers
    this._onMouseMove = (e) => this.onMouseMove(e);
    this._onTouchStart = (e) => this.onTouchStart(e);
    this._onTouchMove = (e) => this.onTouchMove(e);
    this._onTouchEnd = () => this.onTouchEnd();
    this._onMouseLeave = () => this.onMouseLeave();
    
    window.addEventListener('mousemove', this._onMouseMove);
    window.addEventListener('touchstart', this._onTouchStart, { passive: true });
    window.addEventListener('touchmove', this._onTouchMove, { passive: true });
    window.addEventListener('touchend', this._onTouchEnd);
    document.addEventListener('mouseleave', this._onMouseLeave);
  }

  isPointInside(clientX, clientY) {
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
  }

  setCoords(x, y) {
    if (this.Mouse.timer) window.clearTimeout(this.Mouse.timer);
    const rect = this.container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    
    const nx = (x - rect.left) / rect.width;
    const ny = (y - rect.top) / rect.height;
    this.Mouse.coords.set(nx * 2 - 1, -(ny * 2 - 1));
    this.Mouse.mouseMoved = true;
    
    this.Mouse.timer = window.setTimeout(() => {
      this.Mouse.mouseMoved = false;
    }, 100);
  }

  setNormalized(nx, ny) {
    this.Mouse.coords.set(nx, ny);
    this.Mouse.mouseMoved = true;
  }

  onMouseMove(e) {
    // Always track mouse position for interaction
    this.lastUserInteraction = performance.now();
    
    // Smooth takeover from auto to manual
    if (this.Mouse.isAutoActive && !this.Mouse.takeoverActive) {
      const rect = this.container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      this.Mouse.takeoverFrom.copy(this.Mouse.coords);
      this.Mouse.takeoverTo.set(nx * 2 - 1, -(ny * 2 - 1));
      this.Mouse.takeoverStartTime = performance.now();
      this.Mouse.takeoverActive = true;
      this.Mouse.hasUserControl = true;
      this.Mouse.isAutoActive = false;
      if (this.autoDriver) this.autoDriver.forceStop();
      return;
    }
    
    this.setCoords(e.clientX, e.clientY);
    this.Mouse.hasUserControl = true;
    this.Mouse.isHoverInside = true;
  }

  onTouchStart(e) {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    
    this.lastUserInteraction = performance.now();
    if (this.autoDriver) this.autoDriver.forceStop();
    
    this.setCoords(t.clientX, t.clientY);
    this.Mouse.hasUserControl = true;
    this.Mouse.isHoverInside = true;
  }

  onTouchMove(e) {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    
    this.lastUserInteraction = performance.now();
    if (this.autoDriver) this.autoDriver.forceStop();
    
    this.setCoords(t.clientX, t.clientY);
  }

  onTouchEnd() {
    this.Mouse.isHoverInside = false;
  }

  onMouseLeave() {
    this.Mouse.isHoverInside = false;
  }

  updateMouse() {
    if (this.Mouse.takeoverActive) {
      const t = (performance.now() - this.Mouse.takeoverStartTime) / (this.Mouse.takeoverDuration * 1000);
      if (t >= 1) {
        this.Mouse.takeoverActive = false;
        this.Mouse.coords.copy(this.Mouse.takeoverTo);
        this.Mouse.coords_old.copy(this.Mouse.coords);
        this.Mouse.diff.set(0, 0);
      } else {
        const k = t * t * (3 - 2 * t);
        this.Mouse.coords.copy(this.Mouse.takeoverFrom).lerp(this.Mouse.takeoverTo, k);
      }
    }
    
    this.Mouse.diff.subVectors(this.Mouse.coords, this.Mouse.coords_old);
    this.Mouse.coords_old.copy(this.Mouse.coords);
    
    if (this.Mouse.coords_old.x === 0 && this.Mouse.coords_old.y === 0) {
      this.Mouse.diff.set(0, 0);
    }
    
    if (this.Mouse.isAutoActive && !this.Mouse.takeoverActive) {
      this.Mouse.diff.multiplyScalar(this.Mouse.autoIntensity);
    }
  }

  setupAutoDriver() {
    this.autoDriver = {
      enabled: this.options.autoDemo,
      speed: this.options.autoSpeed,
      resumeDelay: 1500, // Resume auto after 1.5 seconds of no movement
      rampDurationMs: this.options.autoRampDuration * 1000,
      active: false,
      current: new THREE.Vector2(0, 0),
      target: new THREE.Vector2(),
      lastTime: performance.now(),
      activationTime: 0,
      margin: 0.2,
      _tmpDir: new THREE.Vector2()
    };
    
    this.pickNewTarget();
  }

  pickNewTarget() {
    const r = Math.random;
    this.autoDriver.target.set(
      (r() * 2 - 1) * (1 - this.autoDriver.margin),
      (r() * 2 - 1) * (1 - this.autoDriver.margin)
    );
  }

  forceStopAuto() {
    this.autoDriver.active = false;
    this.Mouse.isAutoActive = false;
    this.Mouse.hasUserControl = true;
  }

  updateAutoDriver() {
    if (!this.autoDriver.enabled) return;
    
    const now = performance.now();
    const idle = now - this.lastUserInteraction;
    
    // Only pause auto when user is actively moving (within resumeDelay)
    if (idle < this.autoDriver.resumeDelay) {
      if (this.autoDriver.active) this.forceStopAuto();
      return;
    }
    
    // Don't stop auto just because cursor is hovering - only stop when actively interacting
    
    if (!this.autoDriver.active) {
      this.autoDriver.active = true;
      this.autoDriver.current.copy(this.Mouse.coords);
      this.autoDriver.lastTime = now;
      this.autoDriver.activationTime = now;
    }
    
    if (!this.autoDriver.active) return;
    
    this.Mouse.isAutoActive = true;
    
    let dtSec = (now - this.autoDriver.lastTime) / 1000;
    this.autoDriver.lastTime = now;
    if (dtSec > 0.2) dtSec = 0.016;
    
    const dir = this.autoDriver._tmpDir.subVectors(this.autoDriver.target, this.autoDriver.current);
    const dist = dir.length();
    
    if (dist < 0.01) {
      this.pickNewTarget();
      return;
    }
    
    dir.normalize();
    
    let ramp = 1;
    if (this.autoDriver.rampDurationMs > 0) {
      const t = Math.min(1, (now - this.autoDriver.activationTime) / this.autoDriver.rampDurationMs);
      ramp = t * t * (3 - 2 * t);
    }
    
    const step = this.autoDriver.speed * dtSec * ramp;
    const move = Math.min(step, dist);
    this.autoDriver.current.addScaledVector(dir, move);
    
    this.setNormalized(this.autoDriver.current.x, this.autoDriver.current.y);
  }

  setupOutput() {
    // Shaders
    const face_vert = `
      attribute vec3 position;
      uniform vec2 px;
      uniform vec2 boundarySpace;
      varying vec2 uv;
      precision highp float;
      void main(){
        vec3 pos = position;
        vec2 scale = 1.0 - boundarySpace * 2.0;
        pos.xy = pos.xy * scale;
        uv = vec2(0.5)+(pos.xy)*0.5;
        gl_Position = vec4(pos, 1.0);
      }
    `;
    
    const line_vert = `
      attribute vec3 position;
      uniform vec2 px;
      precision highp float;
      varying vec2 uv;
      void main(){
        vec3 pos = position;
        uv = 0.5 + pos.xy * 0.5;
        vec2 n = sign(pos.xy);
        pos.xy = abs(pos.xy) - px * 1.0;
        pos.xy *= n;
        gl_Position = vec4(pos, 1.0);
      }
    `;
    
    const mouse_vert = `
      precision highp float;
      attribute vec3 position;
      attribute vec2 uv;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 pos = position.xy * scale * 2.0 * px + center;
        vUv = uv;
        gl_Position = vec4(pos, 0.0, 1.0);
      }
    `;
    
    const advection_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform bool isBFECC;
      uniform vec2 fboSize;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        vec2 ratio = max(fboSize.x, fboSize.y) / fboSize;
        if(isBFECC == false){
          vec2 vel = texture2D(velocity, uv).xy;
          vec2 uv2 = uv - vel * dt * ratio;
          vec2 newVel = texture2D(velocity, uv2).xy;
          gl_FragColor = vec4(newVel, 0.0, 0.0);
        } else {
          vec2 spot_new = uv;
          vec2 vel_old = texture2D(velocity, uv).xy;
          vec2 spot_old = spot_new - vel_old * dt * ratio;
          vec2 vel_new1 = texture2D(velocity, spot_old).xy;
          vec2 spot_new2 = spot_old + vel_new1 * dt * ratio;
          vec2 error = spot_new2 - spot_new;
          vec2 spot_new3 = spot_new - error / 2.0;
          vec2 vel_2 = texture2D(velocity, spot_new3).xy;
          vec2 spot_old2 = spot_new3 - vel_2 * dt * ratio;
          vec2 newVel2 = texture2D(velocity, spot_old2).xy;
          gl_FragColor = vec4(newVel2, 0.0, 0.0);
        }
      }
    `;
    
    const color_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D palette;
      uniform vec4 bgColor;
      varying vec2 uv;
      void main(){
        vec2 vel = texture2D(velocity, uv).xy;
        float lenv = clamp(length(vel), 0.0, 1.0);
        vec3 c = texture2D(palette, vec2(lenv, 0.5)).rgb;
        vec3 outRGB = mix(bgColor.rgb, c, lenv);
        float outA = mix(bgColor.a, 1.0, lenv);
        gl_FragColor = vec4(outRGB, outA);
      }
    `;
    
    const divergence_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform float dt;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float x0 = texture2D(velocity, uv-vec2(px.x, 0.0)).x;
        float x1 = texture2D(velocity, uv+vec2(px.x, 0.0)).x;
        float y0 = texture2D(velocity, uv-vec2(0.0, px.y)).y;
        float y1 = texture2D(velocity, uv+vec2(0.0, px.y)).y;
        float divergence = (x1 - x0 + y1 - y0) / 2.0;
        gl_FragColor = vec4(divergence / dt);
      }
    `;
    
    const externalForce_frag = `
      precision highp float;
      uniform vec2 force;
      uniform vec2 center;
      uniform vec2 scale;
      uniform vec2 px;
      varying vec2 vUv;
      void main(){
        vec2 circle = (vUv - 0.5) * 2.0;
        float d = 1.0 - min(length(circle), 1.0);
        d *= d;
        gl_FragColor = vec4(force * d, 0.0, 1.0);
      }
    `;
    
    const poisson_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D divergence;
      uniform vec2 px;
      varying vec2 uv;
      void main(){
        float p0 = texture2D(pressure, uv + vec2(px.x * 2.0, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * 2.0, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * 2.0)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * 2.0)).r;
        float div = texture2D(divergence, uv).r;
        float newP = (p0 + p1 + p2 + p3) / 4.0 - div;
        gl_FragColor = vec4(newP);
      }
    `;
    
    const pressure_frag = `
      precision highp float;
      uniform sampler2D pressure;
      uniform sampler2D velocity;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
        float step = 1.0;
        float p0 = texture2D(pressure, uv + vec2(px.x * step, 0.0)).r;
        float p1 = texture2D(pressure, uv - vec2(px.x * step, 0.0)).r;
        float p2 = texture2D(pressure, uv + vec2(0.0, px.y * step)).r;
        float p3 = texture2D(pressure, uv - vec2(0.0, px.y * step)).r;
        vec2 v = texture2D(velocity, uv).xy;
        vec2 gradP = vec2(p0 - p1, p2 - p3) * 0.5;
        v = v - gradP * dt;
        gl_FragColor = vec4(v, 0.0, 1.0);
      }
    `;
    
    const viscous_frag = `
      precision highp float;
      uniform sampler2D velocity;
      uniform sampler2D velocity_new;
      uniform float v;
      uniform vec2 px;
      uniform float dt;
      varying vec2 uv;
      void main(){
        vec2 old = texture2D(velocity, uv).xy;
        vec2 new0 = texture2D(velocity_new, uv + vec2(px.x * 2.0, 0.0)).xy;
        vec2 new1 = texture2D(velocity_new, uv - vec2(px.x * 2.0, 0.0)).xy;
        vec2 new2 = texture2D(velocity_new, uv + vec2(0.0, px.y * 2.0)).xy;
        vec2 new3 = texture2D(velocity_new, uv - vec2(0.0, px.y * 2.0)).xy;
        vec2 newv = 4.0 * old + v * dt * (new0 + new1 + new2 + new3);
        newv /= 4.0 * (1.0 + v * dt);
        gl_FragColor = vec4(newv, 0.0, 0.0);
      }
    `;

    // Store shaders for use
    this.shaders = {
      face_vert,
      line_vert,
      mouse_vert,
      advection_frag,
      color_frag,
      divergence_frag,
      externalForce_frag,
      poisson_frag,
      pressure_frag,
      viscous_frag
    };

    // Create simulation
    this.simulation = this.createSimulation();
    
    // Create output scene
    this.outputScene = new THREE.Scene();
    this.outputCamera = new THREE.Camera();
    
    this.outputMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.RawShaderMaterial({
        vertexShader: face_vert,
        fragmentShader: color_frag,
        transparent: true,
        depthWrite: false,
        uniforms: {
          velocity: { value: this.simulation.fbos.vel_0.texture },
          boundarySpace: { value: new THREE.Vector2() },
          palette: { value: this.paletteTex },
          bgColor: { value: this.bgVec4 }
        }
      })
    );
    this.outputScene.add(this.outputMesh);
  }

  createSimulation() {
    const sim = {
      options: {
        iterations_poisson: this.options.iterationsPoisson,
        iterations_viscous: this.options.iterationsViscous,
        mouse_force: this.options.mouseForce,
        resolution: this.options.resolution,
        cursor_size: this.options.cursorSize,
        viscous: this.options.viscous,
        isBounce: this.options.isBounce,
        dt: this.options.dt,
        isViscous: this.options.isViscous,
        BFECC: this.options.BFECC
      },
      fbos: {},
      fboSize: new THREE.Vector2(),
      cellScale: new THREE.Vector2(),
      boundarySpace: new THREE.Vector2()
    };
    
    // Calculate sizes
    const width = Math.max(1, Math.round(sim.options.resolution * this.Common.width));
    const height = Math.max(1, Math.round(sim.options.resolution * this.Common.height));
    sim.cellScale.set(1.0 / width, 1.0 / height);
    sim.fboSize.set(width, height);
    
    // Create FBOs
    const type = this.getFloatType();
    const opts = {
      type,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    };
    
    const fboNames = ['vel_0', 'vel_1', 'vel_viscous0', 'vel_viscous1', 'div', 'pressure_0', 'pressure_1'];
    fboNames.forEach(name => {
      sim.fbos[name] = new THREE.WebGLRenderTarget(sim.fboSize.x, sim.fboSize.y, opts);
    });
    
    // Create shader passes
    this.createShaderPasses(sim);
    
    return sim;
  }

  getFloatType() {
    const isIOS = /(iPad|iPhone|iPod)/i.test(navigator.userAgent);
    return isIOS ? THREE.HalfFloatType : THREE.FloatType;
  }

  createShaderPasses(sim) {
    // Advection pass
    sim.advection = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera(),
      uniforms: {
        boundarySpace: { value: sim.cellScale },
        px: { value: sim.cellScale },
        fboSize: { value: sim.fboSize },
        velocity: { value: sim.fbos.vel_0.texture },
        dt: { value: sim.options.dt },
        isBFECC: { value: true }
      }
    };
    
    const advMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.face_vert,
      fragmentShader: this.shaders.advection_frag,
      uniforms: sim.advection.uniforms
    });
    
    sim.advection.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), advMaterial);
    sim.advection.scene.add(sim.advection.plane);
    
    // Boundary lines
    const boundaryG = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -1, -1, 0, -1, 1, 0, -1, 1, 0, 1, 1, 0, 1, 1, 0, 1, -1, 0, 1, -1, 0, -1, -1, 0
    ]);
    boundaryG.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const boundaryM = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.line_vert,
      fragmentShader: this.shaders.advection_frag,
      uniforms: sim.advection.uniforms
    });
    sim.advection.line = new THREE.LineSegments(boundaryG, boundaryM);
    sim.advection.scene.add(sim.advection.line);
    
    // External force pass
    sim.externalForce = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera()
    };
    
    const mouseG = new THREE.PlaneGeometry(1, 1);
    const mouseM = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.mouse_vert,
      fragmentShader: this.shaders.externalForce_frag,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      uniforms: {
        px: { value: sim.cellScale },
        force: { value: new THREE.Vector2(0.0, 0.0) },
        center: { value: new THREE.Vector2(0.0, 0.0) },
        scale: { value: new THREE.Vector2(sim.options.cursor_size, sim.options.cursor_size) }
      }
    });
    sim.externalForce.mouse = new THREE.Mesh(mouseG, mouseM);
    sim.externalForce.scene.add(sim.externalForce.mouse);
    
    // Viscous pass
    sim.viscous = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera(),
      uniforms: {
        boundarySpace: { value: sim.boundarySpace },
        velocity: { value: sim.fbos.vel_1.texture },
        velocity_new: { value: sim.fbos.vel_viscous0.texture },
        v: { value: sim.options.viscous },
        px: { value: sim.cellScale },
        dt: { value: sim.options.dt }
      }
    };
    
    const viscMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.face_vert,
      fragmentShader: this.shaders.viscous_frag,
      uniforms: sim.viscous.uniforms
    });
    
    sim.viscous.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), viscMaterial);
    sim.viscous.scene.add(sim.viscous.plane);
    
    // Divergence pass
    sim.divergence = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera(),
      uniforms: {
        boundarySpace: { value: sim.boundarySpace },
        velocity: { value: sim.fbos.vel_viscous0.texture },
        px: { value: sim.cellScale },
        dt: { value: sim.options.dt }
      }
    };
    
    const divMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.face_vert,
      fragmentShader: this.shaders.divergence_frag,
      uniforms: sim.divergence.uniforms
    });
    
    sim.divergence.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), divMaterial);
    sim.divergence.scene.add(sim.divergence.plane);
    
    // Poisson pass
    sim.poisson = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera(),
      uniforms: {
        boundarySpace: { value: sim.boundarySpace },
        pressure: { value: sim.fbos.pressure_0.texture },
        divergence: { value: sim.fbos.div.texture },
        px: { value: sim.cellScale }
      }
    };
    
    const poissonMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.face_vert,
      fragmentShader: this.shaders.poisson_frag,
      uniforms: sim.poisson.uniforms
    });
    
    sim.poisson.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), poissonMaterial);
    sim.poisson.scene.add(sim.poisson.plane);
    
    // Pressure pass
    sim.pressure = {
      scene: new THREE.Scene(),
      camera: new THREE.Camera(),
      uniforms: {
        boundarySpace: { value: sim.boundarySpace },
        pressure: { value: sim.fbos.pressure_0.texture },
        velocity: { value: sim.fbos.vel_viscous0.texture },
        px: { value: sim.cellScale },
        dt: { value: sim.options.dt }
      }
    };
    
    const pressureMaterial = new THREE.RawShaderMaterial({
      vertexShader: this.shaders.face_vert,
      fragmentShader: this.shaders.pressure_frag,
      uniforms: sim.pressure.uniforms
    });
    
    sim.pressure.plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), pressureMaterial);
    sim.pressure.scene.add(sim.pressure.plane);
  }

  updateSimulation() {
    const sim = this.simulation;
    
    if (sim.options.isBounce) {
      sim.boundarySpace.set(0, 0);
    } else {
      sim.boundarySpace.copy(sim.cellScale);
    }
    
    // Advection
    sim.advection.uniforms.dt.value = sim.options.dt;
    sim.advection.line.visible = sim.options.isBounce;
    sim.advection.uniforms.isBFECC.value = sim.options.BFECC;
    this.Common.renderer.setRenderTarget(sim.fbos.vel_1);
    this.Common.renderer.render(sim.advection.scene, sim.advection.camera);
    
    // External force
    const forceX = (this.Mouse.diff.x / 2) * sim.options.mouse_force;
    const forceY = (this.Mouse.diff.y / 2) * sim.options.mouse_force;
    const cursorSizeX = sim.options.cursor_size * sim.cellScale.x;
    const cursorSizeY = sim.options.cursor_size * sim.cellScale.y;
    const centerX = Math.min(Math.max(this.Mouse.coords.x, -1 + cursorSizeX + sim.cellScale.x * 2), 1 - cursorSizeX - sim.cellScale.x * 2);
    const centerY = Math.min(Math.max(this.Mouse.coords.y, -1 + cursorSizeY + sim.cellScale.y * 2), 1 - cursorSizeY - sim.cellScale.y * 2);
    
    const forceUniforms = sim.externalForce.mouse.material.uniforms;
    forceUniforms.force.value.set(forceX, forceY);
    forceUniforms.center.value.set(centerX, centerY);
    forceUniforms.scale.value.set(sim.options.cursor_size, sim.options.cursor_size);
    
    this.Common.renderer.setRenderTarget(sim.fbos.vel_1);
    this.Common.renderer.render(sim.externalForce.scene, sim.externalForce.camera);
    
    // Viscous (if enabled)
    let vel = sim.fbos.vel_1;
    if (sim.options.isViscous) {
      sim.viscous.uniforms.v.value = sim.options.viscous;
      let fbo_in, fbo_out;
      
      for (let i = 0; i < sim.options.iterations_viscous; i++) {
        if (i % 2 === 0) {
          fbo_in = sim.fbos.vel_viscous0;
          fbo_out = sim.fbos.vel_viscous1;
        } else {
          fbo_in = sim.fbos.vel_viscous1;
          fbo_out = sim.fbos.vel_viscous0;
        }
        sim.viscous.uniforms.velocity_new.value = fbo_in.texture;
        sim.viscous.uniforms.dt.value = sim.options.dt;
        this.Common.renderer.setRenderTarget(fbo_out);
        this.Common.renderer.render(sim.viscous.scene, sim.viscous.camera);
      }
      vel = fbo_out;
    }
    
    // Divergence
    sim.divergence.uniforms.velocity.value = vel.texture;
    this.Common.renderer.setRenderTarget(sim.fbos.div);
    this.Common.renderer.render(sim.divergence.scene, sim.divergence.camera);
    
    // Poisson
    let pressure;
    let p_in, p_out;
    for (let i = 0; i < sim.options.iterations_poisson; i++) {
      if (i % 2 === 0) {
        p_in = sim.fbos.pressure_0;
        p_out = sim.fbos.pressure_1;
      } else {
        p_in = sim.fbos.pressure_1;
        p_out = sim.fbos.pressure_0;
      }
      sim.poisson.uniforms.pressure.value = p_in.texture;
      this.Common.renderer.setRenderTarget(p_out);
      this.Common.renderer.render(sim.poisson.scene, sim.poisson.camera);
    }
    pressure = p_out;
    
    // Pressure
    sim.pressure.uniforms.velocity.value = vel.texture;
    sim.pressure.uniforms.pressure.value = pressure.texture;
    this.Common.renderer.setRenderTarget(sim.fbos.vel_0);
    this.Common.renderer.render(sim.pressure.scene, sim.pressure.camera);
  }

  setupEvents() {
    this._onResize = () => this.resize();
    this._onVisibility = () => {
      if (document.hidden) {
        this.pause();
      } else if (this.isVisible) {
        this.start();
      }
    };
    
    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVisibility);
    
    // Intersection Observer
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this.isVisible = entry.isIntersecting && entry.intersectionRatio > 0;
        if (this.isVisible && !document.hidden) {
          this.start();
        } else {
          this.pause();
        }
      },
      { threshold: [0, 0.01, 0.1] }
    );
    this.intersectionObserver.observe(this.container);
    
    // Resize Observer
    this.resizeObserver = new ResizeObserver(() => {
      if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf);
      this.resizeRaf = requestAnimationFrame(() => this.resize());
    });
    this.resizeObserver.observe(this.container);
  }

  render() {
    // Reset user control if idle long enough
    const now = performance.now();
    const idle = now - this.lastUserInteraction;
    if (idle > this.autoDriver.resumeDelay) {
      this.Mouse.hasUserControl = false;
    }
    
    this.updateAutoDriver();
    this.updateMouse();
    
    this.Common.delta = this.Common.clock.getDelta();
    this.Common.time += this.Common.delta;
    
    this.updateSimulation();
    
    // Render output
    this.Common.renderer.setRenderTarget(null);
    this.Common.renderer.render(this.outputScene, this.outputCamera);
  }

  loop() {
    if (!this.running) return;
    this.render();
    this.rafId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.loop();
  }

  pause() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  dispose() {
    this.pause();
    
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('mousemove', this._onMouseMove);
    window.removeEventListener('touchstart', this._onTouchStart);
    window.removeEventListener('touchmove', this._onTouchMove);
    window.removeEventListener('touchend', this._onTouchEnd);
    document.removeEventListener('mouseleave', this._onMouseLeave);
    document.removeEventListener('visibilitychange', this._onVisibility);
    
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    if (this.Common.renderer) {
      const canvas = this.Common.renderer.domElement;
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
      this.Common.renderer.dispose();
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('liquid-ether-bg');
  if (container) {
    window.liquidEther = new LiquidEther(container, {
      colors: ['#5227FF', '#FF9FFC', '#B19EEF'],
      mouseForce: 35,
      cursorSize: 120,
      isViscous: false,
      viscous: 30,
      iterationsViscous: 32,
      iterationsPoisson: 32,
      resolution: 0.5,
      isBounce: false,
      autoDemo: true,
      autoSpeed: 0.6,
      autoIntensity: 2.5,
      takeoverDuration: 0.2,
      autoResumeDelay: 1500,
      autoRampDuration: 0.5
    });
  }
});


