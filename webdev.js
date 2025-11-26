// Luxury Metal Portfolio - Clean Implementation
class LuxuryMetalPortfolio {
  constructor() {
    this.currentPanel = 0;
    this.totalPanels = 3;
    this.isTransitioning = false;
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializePanel();
    this.setupInteractiveEffects();
  }

  bindEvents() {
    // CTA Button Navigation
    document.querySelectorAll(".cta-button").forEach((button) => {
      button.addEventListener("click", (e) => {
        const nextPanel = parseInt(e.currentTarget.dataset.nextPanel);
        if (!isNaN(nextPanel)) {
          this.navigateToPanel(nextPanel);
        }
      });
    });

    // Progress Dot Navigation
    document.querySelectorAll(".progress-dot").forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const panelIndex = parseInt(e.currentTarget.dataset.panel);
        this.navigateToPanel(panelIndex);
      });
    });

    // Work Frame Interactions
    document.querySelectorAll(".work-frame").forEach((frame) => {
      frame.addEventListener("click", (e) => {
        const project = frame.dataset.project;
        this.openProjectOverlay(project);
      });
    });

    // Copy Email Button
    document.querySelector(".copy-button").addEventListener("click", () => {
      this.copyEmailToClipboard();
    });

    // Project Overlay Close Button
    document.querySelector(".overlay-close").addEventListener("click", () => {
      this.closeProjectOverlay();
    });

    // Keyboard Navigation
    document.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Swipe Gestures
    this.setupSwipeGestures();
  }

  setupSwipeGestures() {
    const panelContainer = document.querySelector(".panel-container");
    let touchStartX = 0;
    let touchStartY = 0;

    panelContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    panelContainer.addEventListener(
      "touchend",
      (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            // Swipe right - previous panel
            this.navigateToPanel((this.currentPanel - 1 + this.totalPanels) % this.totalPanels);
          } else {
            // Swipe left - next panel
            this.navigateToPanel((this.currentPanel + 1) % this.totalPanels);
          }
        }
      },
      { passive: true }
    );
  }

  handleKeyboardNavigation(e) {
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        this.navigateToPanel((this.currentPanel + 1) % this.totalPanels);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        this.navigateToPanel((this.currentPanel - 1 + this.totalPanels) % this.totalPanels);
        break;
      case "Escape":
        if (document.getElementById("project-overlay").classList.contains("active")) {
          this.closeProjectOverlay();
        }
        break;
    }
  }

  navigateToPanel(panelIndex) {
    if (this.isTransitioning || panelIndex === this.currentPanel) {
      return;
    }

    this.isTransitioning = true;

    // Update progress dots
    this.updateProgressDots(panelIndex);

    // Get current and target panels
    const currentPanel = document.querySelector(`section[data-panel="${this.currentPanel}"]`);
    const targetPanel = document.querySelector(`section[data-panel="${panelIndex}"]`);

    if (!currentPanel || !targetPanel) {
      this.isTransitioning = false;
      return;
    }

    // Determine transition direction
    const direction = panelIndex > this.currentPanel ? 1 : -1;

    // 3D transition - current panel fades out
    currentPanel.style.transform = `translate3d(0, 0, -2000px) scale(0.1) rotateY(${45 * direction}deg)`;
    currentPanel.style.opacity = "0";
    currentPanel.style.zIndex = "1";

    // Target panel starts from behind
    targetPanel.style.transform = `translate3d(0, 0, -2000px) scale(0.1) rotateY(${-45 * direction}deg)`;
    targetPanel.style.opacity = "0";
    targetPanel.style.visibility = "visible";
    targetPanel.style.zIndex = "5";

    // Force reflow
    targetPanel.offsetHeight;

    // Animate target panel emerging
    setTimeout(() => {
      targetPanel.style.transform = "translate3d(0, 0, 0) scale(1) rotateY(0deg)";
      targetPanel.style.opacity = "1";
      targetPanel.style.zIndex = "10";
    }, 50);

    // After transition, update classes and clean up
    setTimeout(() => {
      // Update classes
      currentPanel.classList.remove("active");
      targetPanel.classList.add("active");

      // Clean up inline styles
      currentPanel.removeAttribute("style");
      targetPanel.removeAttribute("style");

      this.currentPanel = panelIndex;
      this.isTransitioning = false;
    }, 1000);
  }

  updateProgressDots(activeIndex) {
    document.querySelectorAll(".progress-dot").forEach((dot) => {
      const dotPanelIndex = parseInt(dot.dataset.panel);
      dot.classList.toggle("active", dotPanelIndex === activeIndex);
    });
  }

  openProjectOverlay(projectId) {
    const overlay = document.getElementById("project-overlay");
    const overlayImage = overlay.querySelector(".overlay-image");
    const overlayTitle = overlay.querySelector(".overlay-title");
    const overlayRole = overlay.querySelector(".overlay-role");
    const overlayLink = overlay.querySelector(".overlay-link");

    // Get project data
    const projectData = this.getProjectData(projectId);

    // Update overlay content
    overlayImage.style.backgroundImage = `url(${projectData.image})`;
    overlayTitle.textContent = projectData.title;
    overlayRole.textContent = projectData.role;
    overlayLink.href = projectData.link;

    // Show overlay
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";

    // Focus management
    overlay.querySelector(".overlay-close").focus();
  }

  closeProjectOverlay() {
    const overlay = document.getElementById("project-overlay");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  getProjectData(projectId) {
    const projects = {
      woosang: {
        title: "Woosangjeon Heotjit",
        role: "Artist Portfolio",
        link: "https://woosangjeon-heotjit.com",
        image: "https://seungwebsite.s3.eu-central-1.amazonaws.com/Photos/Woosang+web+screenshot.png",
      },
      smith: {
        title: "Smith & McDowell",
        role: "Studio Website",
        link: "https://smith-mcdowell.com",
        image: "https://seungwebsite.s3.eu-central-1.amazonaws.com/Photos/Monique+web+screenshot.png",
      },
      katharina: {
        title: "Katharina Ludwig",
        role: "Dancer Portfolio",
        link: "https://ludwigkatharina.com",
        image: "https://seungwebsite.s3.eu-central-1.amazonaws.com/Photos/Katharina+web+screenshot.png",
      },
      seung: {
        title: "Pro Dance",
        role: "Performance Site",
        link: "https://seungdance.github.io/Pro/index.html",
        image: "https://seungwebsite.s3.eu-central-1.amazonaws.com/Photos/Seung+Website+Screenshot.png",
      },
    };

    return projects[projectId] || projects.woosang;
  }

  async copyEmailToClipboard() {
    const email = "work@seungdance.com";
    const copyButton = document.querySelector(".copy-button");

    try {
      await navigator.clipboard.writeText(email);

      // Visual feedback
      copyButton.classList.add("copied");
      copyButton.innerHTML = '<span class="copy-icon">✓</span>';

      setTimeout(() => {
        copyButton.classList.remove("copied");
        copyButton.innerHTML = '<span class="copy-icon">📋</span>';
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = email;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);

      // Same visual feedback
      copyButton.classList.add("copied");
      copyButton.innerHTML = '<span class="copy-icon">✓</span>';

      setTimeout(() => {
        copyButton.classList.remove("copied");
        copyButton.innerHTML = '<span class="copy-icon">📋</span>';
      }, 2000);
    }
  }

  initializePanel() {
    // Set initial panel as active
    const initialPanel = document.querySelector(`section[data-panel="${this.currentPanel}"]`);
    if (initialPanel) {
      initialPanel.classList.add("active");
      // Start from behind and emerge
      initialPanel.style.transform = "translate3d(0, 0, -2000px) scale(0.1)";
      initialPanel.style.opacity = "0";
      setTimeout(() => {
        initialPanel.style.transform = "translate3d(0, 0, 0) scale(1)";
        initialPanel.style.opacity = "1";
        setTimeout(() => {
          initialPanel.removeAttribute("style");
        }, 1000);
      }, 100);
    }

    // Hide other panels
    document.querySelectorAll("section.panel").forEach((panel, index) => {
      if (index !== this.currentPanel) {
        panel.classList.remove("active");
        panel.style.transform = "translate3d(0, 0, -2000px) scale(0.1)";
        panel.style.opacity = "0";
      }
    });

    this.updateProgressDots(this.currentPanel);
  }

  setupInteractiveEffects() {
    // Custom cursor
    this.createCustomCursor();

    // Mouse move parallax effects
    this.setupParallaxEffects();

    // Interactive hover effects
    this.setupHoverEffects();

    // Text reveal animations
    this.setupTextReveal();
  }

  createCustomCursor() {
    // Only on desktop
    if (window.innerWidth <= 768) return;

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    const cursorFollower = document.createElement("div");
    cursorFollower.className = "cursor-follower";
    document.body.appendChild(cursorFollower);

    let mouseX = 0;
    let mouseY = 0;
    let followerX = 0;
    let followerY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    // Smooth follower animation
    const animateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = followerX + "px";
      cursorFollower.style.top = followerY + "px";
      requestAnimationFrame(animateFollower);
    };
    animateFollower();

    // Interactive elements
    const interactiveElements = document.querySelectorAll("a, button, .work-frame, .progress-dot");
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-hover");
        cursorFollower.classList.add("active");
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-hover");
        cursorFollower.classList.remove("active");
      });
    });
  }

  setupParallaxEffects() {
    // Parallax effects disabled
  }

  setupHoverEffects() {
    // CTA buttons ripple effect
    document.querySelectorAll(".cta-button").forEach((button) => {
      button.addEventListener("click", function (e) {
        const ripple = document.createElement("span");
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + "px";
        ripple.style.left = x + "px";
        ripple.style.top = y + "px";
        ripple.classList.add("ripple");

        this.appendChild(ripple);

        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    // Work frames 3D magnetic effect
    document.querySelectorAll(".work-frame").forEach((frame, index) => {
      let baseTransform = { x: 0, y: 0, z: index * 30, rotateX: 0, rotateY: 0, scale: 1 };

      frame.addEventListener("mousemove", (e) => {
        const rect = frame.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2); // -1 to 1
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2); // -1 to 1

        baseTransform.x = x * 15;
        baseTransform.y = y * 15;
        baseTransform.z = index * 30 + 50;
        baseTransform.rotateX = -y * 10;
        baseTransform.rotateY = x * 10;
        baseTransform.scale = 1.1;

        frame.style.transform = `translate3d(${baseTransform.x}px, ${baseTransform.y}px, ${baseTransform.z}px) rotateX(${baseTransform.rotateX}deg) rotateY(${baseTransform.rotateY}deg) scale(${baseTransform.scale})`;
        frame.style.transition = "transform 0.1s ease-out";
      });

      frame.addEventListener("mouseleave", () => {
        baseTransform = { x: 0, y: 0, z: index * 30, rotateX: 0, rotateY: 0, scale: 1 };
        frame.style.transform = `translate3d(0, 0, ${baseTransform.z}px) rotateX(0deg) rotateY(0deg) scale(1)`;
        frame.style.transition = "transform 0.3s ease-out";
      });
    });
  }

  setupTextReveal() {
    // Intersection Observer for text animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
        }
      });
    }, observerOptions);

    // Observe text elements
    document.querySelectorAll(".hero-heading, .hero-tagline, .hero-description, .contact-heading, .contact-subhead").forEach((el) => {
      el.classList.add("reveal-text");
      observer.observe(el);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LuxuryMetalPortfolio();
});
