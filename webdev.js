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

    // Set target panel to start position (off-screen)
    targetPanel.style.transform = `translate3d(${100 * direction}%, 0, 0)`;
    targetPanel.style.opacity = "1";
    targetPanel.style.visibility = "visible";
    targetPanel.style.zIndex = "5";

    // Force reflow
    targetPanel.offsetHeight;

    // Animate both panels
    currentPanel.style.transform = `translate3d(${-100 * direction}%, 0, 0)`;
    currentPanel.style.opacity = "0";
    currentPanel.style.zIndex = "1";

    targetPanel.style.transform = "translate3d(0, 0, 0)";
    targetPanel.style.zIndex = "10";

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
    }, 550);
  }

  updateProgressDots(activeIndex) {
    document.querySelectorAll(".progress-dot").forEach((dot, index) => {
      dot.classList.toggle("active", index === activeIndex);
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
    const email = "1@seungdance.com";
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
    }

    // Hide other panels
    document.querySelectorAll("section.panel").forEach((panel, index) => {
      if (index !== this.currentPanel) {
        panel.classList.remove("active");
      }
    });

    this.updateProgressDots(this.currentPanel);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new LuxuryMetalPortfolio();
});
