"use strict";

// Choreographer Portfolio JavaScript
// All functionality moved from inline scripts for better security and maintainability
// iOS Safari 환경 최적화 및 works-grid 무한 루프 개선

// Immediate test to see if script is loading
console.log("=== choreographer.js loaded successfully ===");

// DOM Elements
let mainPage, colonialismDetail, soliloquyDetail, politicalnessDetail, date2017Detail, lookingForSomeoneDetail;

// iOS Safari 100vh 버그 대응을 위한 CSS 변수 관리
let vh = 0;
let vw = 0;

// Initialize the page when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  console.log("=== DOM Content Loaded ===");
  initializeElements();
  setupEventListeners();
  setupTypingAnimation();
  setupViewportHeight(); // iOS Safari 100vh 버그 대응
  setupWorksGridInfiniteLoop(); // works-grid 무한 루프 설정
});

// Also try window load as backup
window.addEventListener("load", function () {
  console.log("=== Window Loaded ===");
  // Re-initialize if elements weren't found earlier
  if (!mainPage || !colonialismDetail) {
    console.log("Re-initializing elements...");
    initializeElements();
    setupEventListeners();
  }
  // iOS Safari 환경에서 viewport 높이 재계산
  setupViewportHeight();
});

// iOS Safari 100vh 버그 대응: CSS 변수 --vh 설정
function setupViewportHeight() {
  console.log("=== Setting up viewport height for iOS Safari ===");

  // 초기 viewport 높이 설정
  updateViewportHeight();

  // resize 이벤트 시 높이 갱신
  window.addEventListener("resize", updateViewportHeight);

  // orientationchange 이벤트 시 높이 갱신 (모바일 기기)
  window.addEventListener("orientationchange", function () {
    // orientationchange 후 약간의 지연을 두고 높이 갱신
    setTimeout(updateViewportHeight, 100);
  });

  // visualViewport API 지원 시 (iOS Safari 13+)
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", updateViewportHeight);
  }

  // iOS Safari에서 주소창 열림/닫힘 시 높이 갱신
  if ("ontouchstart" in window) {
    // 터치 디바이스에서 스크롤 이벤트로 높이 감지
    let lastHeight = window.innerHeight;
    window.addEventListener("scroll", function () {
      if (Math.abs(window.innerHeight - lastHeight) > 50) {
        lastHeight = window.innerHeight;
        updateViewportHeight();
      }
    });
  }
}

// viewport 높이를 CSS 변수로 설정
function updateViewportHeight() {
  vh = window.innerHeight * 0.01;
  vw = window.innerWidth * 0.01;

  // CSS 변수로 설정하여 CSS에서 사용할 수 있도록 함
  document.documentElement.style.setProperty("--vh", `${vh}px`);
  document.documentElement.style.setProperty("--vw", `${vw}px`);

  console.log(`Viewport height updated: ${vh * 100}px (${vh}vh)`);
}

// works-grid 무한 루프를 위한 아이템 복제 및 설정
function setupWorksGridInfiniteLoop() {
  console.log("=== Setting up works-grid infinite loop ===");

  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) {
    console.log("Works grid not found");
    return;
  }

  // 기존 아이템들을 복제하여 무한 루프 효과 생성
  const originalItems = Array.from(worksGrid.querySelectorAll(".work-item"));
  console.log(`Found ${originalItems.length} original work items`);

  if (originalItems.length > 0) {
    // 첫 번째 세트를 복제하여 두 번째 세트 생성
    originalItems.forEach((item) => {
      const clonedItem = item.cloneNode(true);
      worksGrid.appendChild(clonedItem);
    });

    // 두 번째 세트를 복제하여 세 번째 세트 생성 (완벽한 무한 루프)
    originalItems.forEach((item) => {
      const clonedItem = item.cloneNode(true);
      worksGrid.appendChild(clonedItem);
    });

    console.log(`Added ${originalItems.length * 2} cloned items for infinite loop`);
    console.log(`Total work items: ${worksGrid.querySelectorAll(".work-item").length}`);
  }
}

// Initialize DOM element references
function initializeElements() {
  console.log("=== Initializing Elements ===");

  mainPage = document.getElementById("mainPage");
  colonialismDetail = document.getElementById("colonialismDetail");
  soliloquyDetail = document.getElementById("soliloquyDetail");
  politicalnessDetail = document.getElementById("politicalnessDetail");
  date2017Detail = document.getElementById("date2017Detail");
  lookingForSomeoneDetail = document.getElementById("lookingForSomeoneDetail");

  console.log("mainPage found:", !!mainPage);
  console.log("colonialismDetail found:", !!colonialismDetail);
  console.log("soliloquyDetail found:", !!soliloquyDetail);
  console.log("politicalnessDetail found:", !!politicalnessDetail);
  console.log("date2017Detail found:", !!date2017Detail);
  console.log("lookingForSomeoneDetail found:", !!lookingForSomeoneDetail);

  // Check if elements exist in DOM
  if (mainPage) console.log("mainPage ID:", mainPage.id);
  if (colonialismDetail) console.log("colonialismDetail ID:", colonialismDetail.id);
  if (soliloquyDetail) console.log("soliloquyDetail ID:", soliloquyDetail.id);
  if (politicalnessDetail) console.log("politicalnessDetail ID:", politicalnessDetail.id);
  if (date2017Detail) console.log("date2017Detail ID:", date2017Detail.id);
  if (lookingForSomeoneDetail) console.log("lookingForSomeoneDetail ID:", lookingForSomeoneDetail.id);
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

  // Conveyor belt hover events (개선된 버전)
  setupConveyorBeltEvents();

  // Keyboard events
  setupKeyboardEvents();

  // Back button events
  setupBackButtonEvents();
}

// Setup work item click events
function setupWorkItemClickEvents() {
  console.log("Setting up work item click events...");

  // Get all work items (원본 + 복제된 아이템들)
  const allWorkItems = document.querySelectorAll(".work-item");
  console.log("Total work items found:", allWorkItems.length);

  allWorkItems.forEach((workItem, index) => {
    const img = workItem.querySelector("img");
    if (img) {
      console.log(`Work item ${index}: alt="${img.alt}"`);

      workItem.addEventListener("click", function () {
        console.log(`Work item ${index} clicked:`, img.alt);

        // Determine which detail page to show based on alt text
        if (img.alt === "Colonialism : The weight of sound") {
          console.log("Showing Colonialism detail");
          showDetail(colonialismDetail);
        } else if (img.alt === "Soliloquy") {
          console.log("Showing Soliloquy detail");
          showDetail(soliloquyDetail);
        } else if (img.alt === "Politicalness") {
          console.log("Showing Politicalness detail");
          showDetail(politicalnessDetail);
        } else if (img.alt === "12.09.2017") {
          console.log("Showing 12.09.2017 detail");
          showDetail(date2017Detail);
        } else if (img.alt === "Looking For Someone To Be") {
          console.log("Showing Looking For Someone To Be detail");
          showDetail(lookingForSomeoneDetail);
        } else {
          console.log("No matching detail page for:", img.alt);
        }
      });
    }
  });
}

// Setup conveyor belt hover events (개선된 버전)
function setupConveyorBeltEvents() {
  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) {
    console.log("Works grid not found for conveyor belt events");
    return;
  }

  console.log("=== Setting up improved conveyor belt events ===");

  // 마우스 이벤트 (데스크톱)
  worksGrid.addEventListener("mouseenter", function () {
    console.log("Mouse entered works grid - pausing animation");
    this.classList.add("paused");
  });

  worksGrid.addEventListener("mouseleave", function () {
    console.log("Mouse left works grid - resuming animation");
    this.classList.remove("paused");
  });

  // 포인터 이벤트 (더 넓은 호환성)
  worksGrid.addEventListener("pointerenter", function () {
    console.log("Pointer entered works grid - pausing animation");
    this.classList.add("paused");
  });

  worksGrid.addEventListener("pointerleave", function () {
    console.log("Pointer left works grid - resuming animation");
    this.classList.remove("paused");
  });

  // 터치 이벤트 (모바일/태블릿)
  worksGrid.addEventListener(
    "touchstart",
    function (e) {
      console.log("Touch started on works grid - pausing animation");
      this.classList.add("paused");
      // 터치 이벤트의 기본 동작 방지 (스크롤 등)
      e.preventDefault();
    },
    { passive: false }
  );

  worksGrid.addEventListener("touchend", function () {
    console.log("Touch ended on works grid - resuming animation");
    this.classList.remove("paused");
  });

  worksGrid.addEventListener("touchcancel", function () {
    console.log("Touch cancelled on works grid - resuming animation");
    this.classList.remove("paused");
  });

  // iOS Safari에서 터치 이벤트 최적화
  if ("ontouchstart" in window) {
    // 터치 디바이스에서 스크롤 성능 최적화
    worksGrid.style.webkitOverflowScrolling = "touch";
    worksGrid.style.overflowScrolling = "touch";
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

    // Listen for the last typing animation to complete
    if (activeElement) {
      activeElement.addEventListener("animationend", function () {
        console.log("Last typing animation completed, moving text up immediately");

        const aboutText = document.querySelector(".about-text");
        const worksSection = document.querySelector(".works-section");

        // Move text up immediately
        if (aboutText) {
          aboutText.classList.add("move-up");
        }

        // Fade in works immediately after text moves up
        if (worksSection) {
          worksSection.classList.add("fade-in");
        }
      });
    }
  });
}

// Consolidated show detail function
function showDetail(targetDetail) {
  console.log("=== showDetail function called ===");
  console.log("targetDetail:", targetDetail);
  console.log("mainPage:", mainPage);
  console.log("targetDetail.id:", targetDetail ? targetDetail.id : "undefined");

  if (!mainPage || !targetDetail) {
    console.error("ERROR: mainPage or targetDetail is missing!");
    console.error("mainPage exists:", !!mainPage);
    console.error("targetDetail exists:", !!targetDetail);
    return;
  }

  // First, hide any currently visible detail page
  const allDetailPages = [colonialismDetail, soliloquyDetail, politicalnessDetail, date2017Detail, lookingForSomeoneDetail];
  allDetailPages.forEach((detailPage) => {
    if (detailPage && detailPage.classList.contains("slide-in")) {
      console.log("Hiding currently visible detail page:", detailPage.id);
      detailPage.classList.remove("slide-in");
    }
  });

  console.log("✓ Adding slide-out class to mainPage");
  mainPage.classList.add("slide-out");

  // Use transitionend instead of setTimeout for precise timing (once: true로 중복 방지)
  mainPage.addEventListener(
    "transitionend",
    function handlerOnce(e) {
      console.log("✓ Transition ended for:", e.target);
      console.log("✓ Transition property:", e.propertyName);
      if (e.target === mainPage && e.propertyName === "transform") {
        console.log("✓ Main page transform transition completed");
        console.log("✓ Adding slide-in class to targetDetail:", targetDetail.id);
        targetDetail.classList.add("slide-in");
        console.log("✓ Detail page should now be visible");

        // Verify the class was added
        console.log("✓ targetDetail.classList.contains('slide-in'):", targetDetail.classList.contains("slide-in"));
        console.log("✓ targetDetail.style.transform:", targetDetail.style.transform);
        console.log("✓ targetDetail computed style transform:", window.getComputedStyle(targetDetail).transform);

        // Remove the listener after use (once: true로 자동 제거됨)
      }
    },
    { once: true }
  );

  // Fallback: if mainPage transform transition doesn't complete within 1 second, show detail anyway
  setTimeout(() => {
    if (mainPage.classList.contains("slide-out") && !targetDetail.classList.contains("slide-in")) {
      console.log("✓ Fallback: Adding slide-in class to targetDetail after timeout");
      targetDetail.classList.add("slide-in");
    }
  }, 1000);
}

// Go back function
function goBack() {
  console.log("=== goBack function called ===");

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

  // Find which detail page is currently visible
  let currentDetailPage = null;
  if (colonialismDetail && colonialismDetail.classList.contains("slide-in")) {
    currentDetailPage = colonialismDetail;
  } else if (soliloquyDetail && soliloquyDetail.classList.contains("slide-in")) {
    currentDetailPage = soliloquyDetail;
  } else if (politicalnessDetail && politicalnessDetail.classList.contains("slide-in")) {
    currentDetailPage = politicalnessDetail;
  } else if (date2017Detail && date2017Detail.classList.contains("slide-in")) {
    currentDetailPage = date2017Detail;
  } else if (lookingForSomeoneDetail && lookingForSomeoneDetail.classList.contains("slide-in")) {
    currentDetailPage = lookingForSomeoneDetail;
  }

  console.log("Current detail page:", currentDetailPage ? currentDetailPage.id : "none");

  if (currentDetailPage) {
    // Hide the current detail page first
    console.log("Hiding detail page:", currentDetailPage.id);
    currentDetailPage.classList.remove("slide-in");

    // Wait for detail page transition to complete, then show main page
    let transitionTimeout;

    const transitionHandler = function handlerOnce(e) {
      if (e.target === currentDetailPage) {
        console.log("Detail page transition ended, showing main page");
        clearTimeout(transitionTimeout);
        if (mainPage) {
          mainPage.classList.remove("slide-out");
        }
        // once: true로 자동 제거됨
      }
    };

    currentDetailPage.addEventListener("transitionend", transitionHandler, { once: true });

    // Fallback: if transitionend doesn't fire within 1 second, show main page anyway
    transitionTimeout = setTimeout(() => {
      console.log("Transition timeout - showing main page anyway");
      if (mainPage) {
        mainPage.classList.remove("slide-out");
      }
      // once: true로 자동 제거됨
    }, 1000);
  } else {
    // Fallback: if no detail page is visible, just show main page
    console.log("No detail page visible, showing main page directly");
    if (mainPage) {
      mainPage.classList.remove("slide-out");
    }
  }
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
