"use strict";

// Choreographer Portfolio JavaScript
// All functionality moved from inline scripts for better security and maintainability

// DOM Elements
let mainPage, colonialismDetail, soliloquyDetail, politicalnessDetail, date2017Detail, lookingForSomeoneDetail;

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeElements();
  setupEventListeners();
  setupTypingAnimation();
});

// Initialize DOM element references
function initializeElements() {
  mainPage = document.getElementById("mainPage");
  colonialismDetail = document.getElementById("colonialismDetail");
  soliloquyDetail = document.getElementById("soliloquyDetail");
  politicalnessDetail = document.getElementById("politicalnessDetail");
  date2017Detail = document.getElementById("date2017Detail");
  lookingForSomeoneDetail = document.getElementById("lookingForSomeoneDetail");
}

// Setup all event listeners
function setupEventListeners() {
  // Home icon click event
  const homeIcon = document.querySelector(".home-icon");
  if (homeIcon) {
    homeIcon.addEventListener("click", function () {
      window.location.assign("index.html");
    });
  }

  // Work item click events
  setupWorkItemClickEvents();

  // Conveyor belt hover events
  setupConveyorBeltEvents();

  // Keyboard events
  setupKeyboardEvents();

  // Back button events
  setupBackButtonEvents();
}

// Setup work item click events
function setupWorkItemClickEvents() {
  // Colonialism work items
  const colonialismItems = document.querySelectorAll('.work-item img[alt="Colonialism : The weight of sound"]');
  colonialismItems.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      parent.addEventListener("click", function () {
        showDetail(colonialismDetail);
      });
    }
  });

  // Soliloquy work items
  const soliloquyItems = document.querySelectorAll('.work-item img[alt="Soliloquy"]');
  soliloquyItems.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      parent.addEventListener("click", function () {
        showDetail(soliloquyDetail);
      });
    }
  });

  // Politicalness work items
  const politicalnessItems = document.querySelectorAll('.work-item img[alt="Politicalness"]');
  politicalnessItems.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      parent.addEventListener("click", function () {
        showDetail(politicalnessDetail);
      });
    }
  });

  // 12.09.2017 work items
  const date2017Items = document.querySelectorAll('.work-item img[alt="12.09.2017"]');
  date2017Items.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      parent.addEventListener("click", function () {
        showDetail(date2017Detail);
      });
    }
  });

  // Looking For Someone To Be work items
  const lookingForSomeoneItems = document.querySelectorAll('.work-item img[alt="Looking For Someone To Be"]');
  lookingForSomeoneItems.forEach((item) => {
    const parent = item.parentElement;
    if (parent) {
      parent.addEventListener("click", function () {
        showDetail(lookingForSomeoneDetail);
      });
    }
  });
}

// Setup conveyor belt hover events
function setupConveyorBeltEvents() {
  const worksGrid = document.querySelector(".works-grid");
  if (worksGrid) {
    worksGrid.addEventListener("mouseenter", function () {
      this.classList.add("paused");
    });

    worksGrid.addEventListener("mouseleave", function () {
      this.classList.remove("paused");
    });
  }
}

// Setup keyboard events
function setupKeyboardEvents() {
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      ((colonialismDetail && colonialismDetail.classList.contains("slide-in")) ||
        (soliloquyDetail && soliloquyDetail.classList.contains("slide-in")) ||
        (politicalnessDetail && politicalnessDetail.classList.contains("slide-in")) ||
        (date2017Detail && date2017Detail.classList.contains("slide-in")) ||
        (lookingForSomeoneDetail && lookingForSomeoneDetail.classList.contains("slide-in")))
    ) {
      goBack();
    }
  });
}

// Setup typing animation
function setupTypingAnimation() {
  // Wait for page load to start typing animation
  window.addEventListener("load", function () {
    // Each typing animation element selection
    const nameElement = document.querySelector(".typing-animation");
    const leadElement = document.querySelector(".typing-animation-lead");
    const activeElement = document.querySelector(".typing-animation-active");

    // Execute animation after typing completion
    setTimeout(() => {
      const aboutText = document.querySelector(".about-text");
      const worksSection = document.querySelector(".works-section");

      // Move text up
      if (aboutText) {
        aboutText.classList.add("move-up");
      }

      // Fade in works
      setTimeout(() => {
        if (worksSection) {
          worksSection.classList.add("fade-in");
        }
      }, 1500);
    }, 7000); // After all typing is complete (5.5s + 1.5s = 7s)
  });
}

// Consolidated show detail function
function showDetail(targetDetail) {
  if (!mainPage || !targetDetail) return;

  mainPage.classList.add("slide-out");

  // Use transitionend instead of setTimeout for precise timing
  mainPage.addEventListener(
    "transitionend",
    function handlerOnce(e) {
      if (e.target === mainPage) {
        targetDetail.classList.add("slide-in");
        // Remove the listener after use
        mainPage.removeEventListener("transitionend", handlerOnce);
      }
    },
    { once: true }
  );
}

// Go back function
function goBack() {
  // Stop all videos in detail pages
  const iframes = document.querySelectorAll(".detail-page iframe");
  if (iframes.length > 0) {
    iframes.forEach((iframe) => {
      if (iframe) {
        const iframeSrc = iframe.src;
        iframe.src = iframeSrc; // Reset iframe src to stop video
      }
    });
  }

  // Hide all detail pages
  if (colonialismDetail) colonialismDetail.classList.remove("slide-in");
  if (soliloquyDetail) soliloquyDetail.classList.remove("slide-in");
  if (politicalnessDetail) politicalnessDetail.classList.remove("slide-in");
  if (date2017Detail) date2017Detail.classList.remove("slide-in");
  if (lookingForSomeoneDetail) lookingForSomeoneDetail.classList.remove("slide-in");

  // Use transitionend for precise timing
  setTimeout(() => {
    if (mainPage) {
      mainPage.classList.remove("slide-out");
    }
  }, 100);
}

// Setup back button events
function setupBackButtonEvents() {
  const backButtons = document.querySelectorAll(".back-button");
  if (backButtons.length > 0) {
    backButtons.forEach((button) => {
      if (button) {
        button.addEventListener("click", goBack);
      }
    });
  }
}
