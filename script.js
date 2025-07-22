// Advanced Interactive Dual Portfolio with Reactive Animations

class DualPortfolio {
  constructor() {
    this.init();
  }

  init() {
    this.setupElements();
    this.setupEventListeners();
    this.setupAnimations();
    this.hideLoadingScreen();
  }

  setupElements() {
    // Get DOM elements
    this.cursorDot = document.querySelector(".cursor-dot");
    this.sections = document.querySelectorAll(".section");
    this.loadingScreen = document.querySelector(".loading-screen");
    this.navIndicator = document.querySelector(".nav-indicator");

    // Mouse position tracking
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetX = 0;
    this.targetY = 0;

    // Animation states
    this.isHovering = false;
    this.currentSection = null;

    // Performance optimization
    this.animationId = null;
    this.lastTime = 0;
  }

  setupEventListeners() {
    // Mouse movement for cursor and reactive effects
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      // Only update targetX/targetY, do not set style.transform here
      this.updateReactiveEffects(e);
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Touch events for mobile
    if ("ontouchstart" in window) {
      this.setupTouchEvents();
    }

    // Window resize
    window.addEventListener("resize", () => {
      this.handleResize();
    });

    // Performance monitoring
    this.startPerformanceMonitoring();
  }

  updateCursor() {
    // Smooth cursor following with easing
    this.targetX += (this.mouseX - this.targetX) * 0.1;
    this.targetY += (this.mouseY - this.targetY) * 0.1;

    this.cursorDot.style.transform = `translate(${this.targetX - 4}px, ${this.targetY - 4}px)`;
  }

  updateReactiveEffects(e) {
    // Update CSS custom properties for reactive animations
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    document.documentElement.style.setProperty("--mouse-x", x);
    document.documentElement.style.setProperty("--mouse-y", y);

    // Add parallax effect to floating elements
    this.sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionX = (e.clientX - rect.left) / rect.width;
      const sectionY = (e.clientY - rect.top) / rect.height;

      const floatingElements = section.querySelectorAll(".element, .tech-element");
      floatingElements.forEach((element, index) => {
        const speed = element.dataset.speed || 0.5;
        const xOffset = (sectionX - 0.5) * 20 * speed;
        const yOffset = (sectionY - 0.5) * 20 * speed;

        element.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });
  }

  handleSectionHover(e, section) {
    this.isHovering = true;
    this.currentSection = section;

    // Add hover effects
    section.style.transform = "scale(1.02)";

    // Pause other section animations
    this.sections.forEach((s) => {
      if (s !== section) {
        s.style.animationPlayState = "paused";
      }
    });

    // Add glow effect
    const isChoreographer = section.classList.contains("choreographer-section");
    const glowColor = isChoreographer ? "rgba(255, 107, 107, 0.3)" : "rgba(6, 182, 212, 0.3)";
    section.style.boxShadow = `0 0 50px ${glowColor}`;

    // Update navigation indicator
    this.updateNavIndicator(section);
  }

  handleSectionLeave(e, section) {
    this.isHovering = false;
    this.currentSection = null;

    // Reset hover effects
    section.style.transform = "scale(1)";
    section.style.boxShadow = "none";

    // Resume all animations
    this.sections.forEach((s) => {
      s.style.animationPlayState = "running";
    });
  }

  handleSectionMouseMove(e, section) {
    if (!this.isHovering) return;

    const rect = section.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Add 3D tilt effect
    const tiltX = (y - 0.5) * 10;
    const tiltY = (x - 0.5) * 10;

    section.style.transform = `scale(1.02) perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

    // Update content position based on mouse
    const content = section.querySelector(".content-wrapper");
    const moveX = (x - 0.5) * 20;
    const moveY = (y - 0.5) * 20;

    content.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  }

  handleSectionClick(e, section) {
    // Create ripple effect
    this.createRippleEffect(e, section);

    // Navigate to appropriate page
    setTimeout(() => {
      const isChoreographer = section.classList.contains("choreographer-section");
      window.location.href = isChoreographer ? "choreographer.html" : "developer.html";
    }, 300);
  }

  createRippleEffect(e, element) {
    const ripple = document.createElement("div");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1000;
        `;

    element.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  updateNavIndicator(section) {
    const isChoreographer = section.classList.contains("choreographer-section");
    const indicator = this.navIndicator.querySelector("::before");

    if (isChoreographer) {
      this.navIndicator.style.setProperty("--indicator-position", "0%");
    } else {
      this.navIndicator.style.setProperty("--indicator-position", "100%");
    }
  }

  handleKeyboardNavigation(e) {
    let targetSection = null;

    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        targetSection = document.querySelector(".choreographer-section");
        break;
      case "ArrowRight":
      case "d":
      case "D":
        targetSection = document.querySelector(".developer-section");
        break;
    }

    if (targetSection) {
      // Add visual feedback
      targetSection.style.transform = "scale(1.05)";
      targetSection.style.boxShadow = "0 0 60px rgba(255, 255, 255, 0.4)";

      setTimeout(() => {
        targetSection.style.transform = "scale(1)";
        targetSection.style.boxShadow = "none";

        // Navigate
        const isChoreographer = targetSection.classList.contains("choreographer-section");
        window.location.href = isChoreographer ? "choreographer.html" : "developer.html";
      }, 200);
    }
  }

  setupTouchEvents() {
    this.sections.forEach((section) => {
      section.addEventListener("touchstart", (e) => {
        e.preventDefault();
        section.style.transform = "scale(0.98)";
      });

      section.addEventListener("touchend", (e) => {
        section.style.transform = "scale(1)";
      });
    });
  }

  handleResize() {
    // Update viewport-based calculations
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    document.documentElement.style.setProperty("--section-width", `${vw / 2}px`);
    document.documentElement.style.setProperty("--section-height", `${vh}px`);
  }

  setupAnimations() {
    // Start animation loop
    this.animate();

    // Add staggered animations to elements
    this.addStaggeredAnimations();
  }

  animate() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Update cursor with smooth interpolation
    this.updateCursor();

    // Continue animation loop
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  addStaggeredAnimations() {
    // Add staggered entrance animations
    const elements = document.querySelectorAll(".title, .subtitle, .dancer-figure, .code-structure");

    elements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";

      setTimeout(() => {
        element.style.transition = "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, index * 200);
    });
  }

  hideLoadingScreen() {
    setTimeout(() => {
      this.loadingScreen.style.opacity = "0";
      setTimeout(() => {
        this.loadingScreen.style.display = "none";
      }, 500);
    }, 1500);
  }

  startPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));

        // Reduce animation complexity if FPS is low
        if (fps < 30) {
          document.body.classList.add("low-performance");
        } else {
          document.body.classList.remove("low-performance");
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(monitorPerformance);
    };

    requestAnimationFrame(monitorPerformance);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DualPortfolio();

  // Add navigation to Enter buttons
  const artistBtn = document.querySelector(".artist-btn");
  if (artistBtn) {
    artistBtn.addEventListener("click", () => {
      window.location.href = "choreographer.html";
    });
  }
  const devBtn = document.querySelector(".dev-btn");
  if (devBtn) {
    devBtn.addEventListener("click", () => {
      window.location.href = "developer.html";
    });
  }

  // Cursor color change based on section
  const cursorDot = document.querySelector(".cursor-dot");
  const artistSection = document.querySelector(".choreographer-section");
  const devSection = document.querySelector(".developer-section");
  if (cursorDot && artistSection && devSection) {
    artistSection.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("white");
      cursorDot.classList.add("black");
    });
    artistSection.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("black");
      cursorDot.classList.add("white");
    });
    devSection.addEventListener("mouseenter", () => {
      cursorDot.classList.remove("black");
      cursorDot.classList.add("white");
    });
    devSection.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("white");
      cursorDot.classList.add("black");
    });
    // Set initial state based on mouse position
    document.addEventListener("mousemove", (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const el = document.elementFromPoint(x, y);
      if (el && artistSection.contains(el)) {
        cursorDot.classList.remove("white");
        cursorDot.classList.add("black");
      } else if (el && devSection.contains(el)) {
        cursorDot.classList.remove("black");
        cursorDot.classList.add("white");
      }
    });
  }

  // Custom typing animation for intro prompts
  const customPrompts = ["Hi !", "I'm Seung !", "A Web Developer :)", "Do you need a website ?", "Come in !"];
  const typingTarget = document.getElementById("typing-code");
  const TYPING_SPEED = 90; // ms per character
  const ERASING_SPEED = 40; // ms per character
  const PAUSE_AFTER_TYPING = 1200; // ms
  const PAUSE_AFTER_ERASE = 600; // ms

  function typeAndErasePrompt(prompt, cb) {
    let i = 0;
    function type() {
      if (i <= prompt.length) {
        typingTarget.textContent = prompt.slice(0, i);
        i++;
        setTimeout(type, TYPING_SPEED);
      } else {
        setTimeout(erase, PAUSE_AFTER_TYPING);
      }
    }
    function erase() {
      if (i >= 0) {
        typingTarget.textContent = prompt.slice(0, i);
        i--;
        setTimeout(erase, ERASING_SPEED);
      } else {
        setTimeout(cb, PAUSE_AFTER_ERASE);
      }
    }
    type();
  }

  if (typingTarget) {
    let idx = 0;
    function loop() {
      const prompt = customPrompts[idx];
      idx = (idx + 1) % customPrompts.length;
      typeAndErasePrompt(prompt, loop);
    }
    loop();
  }

  // Add additional CSS for enhanced effects
  const additionalStyles = document.createElement("style");
  additionalStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .low-performance * {
        animation-duration: 2s !important;
        transition-duration: 0.3s !important;
    }
    
    .section {
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }
    
    .content-wrapper {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .cursor-follower {
        transition: transform 0.1s ease, background 0.3s ease, scale 0.3s ease;
    }
    
    .cursor-dot {
        transition: transform 0.05s ease;
    }
    
    /* Enhanced hover states */
    .section:hover .title {
        text-shadow: 0 0 40px rgba(255, 255, 255, 0.8);
    }
    
    .section:hover .dancer-figure,
    .section:hover .code-structure {
        filter: brightness(1.2) contrast(1.1);
    }
    
    /* Smooth transitions for all interactive elements */
    .section,
    .section * {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                    filter 0.3s ease;
    }
`;
  document.head.appendChild(additionalStyles);
});
