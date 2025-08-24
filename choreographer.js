"use strict";

// Choreographer Portfolio JavaScript
// All functionality moved from inline scripts for better security and maintainability
// iOS Safari 환경 최적화 및 works-grid 무한 루프 개선

// Immediate test to see if script is loading
console.log("=== choreographer.js loaded successfully ===");

// Global DOM Elements
let mainPage, aboutText, worksSection, worksGrid, homeIcon;
let colonialismDetail,
  soliloquyDetail,
  politicalnessDetail,
  date2017Detail,
  lookingForSomeoneDetail,
  anibodyDetail,
  cockroachKineticsDetail,
  kidsDetail,
  koerlichProtopianDetail,
  zusammenSindWirHierDetail,
  aboutMeDetail,
  bodyTunesDetail;
let currentDetailPage = null;
let allDetailPages = [];

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

  // 원본 아이템들을 복제하여 무한 루프 효과 생성
  const originalItems = Array.from(worksGrid.querySelectorAll(".work-item"));
  console.log(`Found ${originalItems.length} original work items`);

  if (originalItems.length > 0) {
    // 원본 아이템들을 복제하여 뒤에 추가 (총 2배로)
    originalItems.forEach((item) => {
      const clonedItem = item.cloneNode(true);
      worksGrid.appendChild(clonedItem);
    });

    console.log(`Added ${originalItems.length} cloned items for infinite loop`);
    console.log(`Total work items: ${worksGrid.querySelectorAll(".work-item").length}`);

    // 애니메이션 시작
    setTimeout(() => {
      if (worksGrid) {
        worksGrid.style.animation = "scroll 40s linear infinite";
        console.log("Animation started for infinite loop");
      }
    }, 100);
  }
}

// Initialize DOM element references
function initializeElements() {
  console.log("=== Initializing Elements ===");

  mainPage = document.getElementById("mainPage");
  aboutText = document.querySelector(".about-text");
  worksSection = document.querySelector(".works-section");
  worksGrid = document.querySelector(".works-grid");
  homeIcon = document.querySelector(".home-icon");

  // Detail pages
  colonialismDetail = document.getElementById("colonialismDetail");
  soliloquyDetail = document.getElementById("soliloquyDetail");
  politicalnessDetail = document.getElementById("politicalnessDetail");
  date2017Detail = document.getElementById("date2017Detail");
  lookingForSomeoneDetail = document.getElementById("lookingForSomeoneDetail");
  anibodyDetail = document.getElementById("anibodyDetail");
  cockroachKineticsDetail = document.getElementById("cockroachKineticsDetail");
  kidsDetail = document.getElementById("kidsDetail");
  koerlichProtopianDetail = document.getElementById("koerlichProtopianDetail");
  zusammenSindWirHierDetail = document.getElementById("zusammenSindWirHierDetail");
  aboutMeDetail = document.getElementById("aboutMeDetail");
  bodyTunesDetail = document.getElementById("bodyTunesDetail");

  // Add all detail pages to array
  allDetailPages = [
    colonialismDetail,
    soliloquyDetail,
    politicalnessDetail,
    date2017Detail,
    lookingForSomeoneDetail,
    anibodyDetail,
    cockroachKineticsDetail,
    kidsDetail,
    koerlichProtopianDetail,
    zusammenSindWirHierDetail,
    aboutMeDetail,
    bodyTunesDetail,
  ];

  console.log("mainPage found:", !!mainPage);
  console.log("colonialismDetail found:", !!colonialismDetail);
  console.log("soliloquyDetail found:", !!soliloquyDetail);
  console.log("politicalnessDetail found:", !!politicalnessDetail);
  console.log("date2017Detail found:", !!date2017Detail);
  console.log("lookingForSomeoneDetail found:", !!lookingForSomeoneDetail);
  console.log("anibodyDetail found:", !!anibodyDetail);
  console.log("cockroachKineticsDetail found:", !!cockroachKineticsDetail);
  console.log("kidsDetail found:", !!kidsDetail);
  console.log("koerlichProtopianDetail found:", !!koerlichProtopianDetail);
  console.log("zusammenSindWirHierDetail found:", !!zusammenSindWirHierDetail);
  console.log("aboutMeDetail found:", !!aboutMeDetail);
  console.log("bodyTunesDetail found:", !!bodyTunesDetail);

  // Check if elements exist in DOM
  if (mainPage) console.log("mainPage ID:", mainPage.id);
  if (colonialismDetail) console.log("colonialismDetail ID:", colonialismDetail.id);
  if (soliloquyDetail) console.log("soliloquyDetail ID:", soliloquyDetail.id);
  if (politicalnessDetail) console.log("politicalnessDetail ID:", politicalnessDetail.id);
  if (date2017Detail) console.log("date2017Detail ID:", date2017Detail.id);
  if (lookingForSomeoneDetail) console.log("lookingForSomeoneDetail ID:", lookingForSomeoneDetail.id);
  if (anibodyDetail) console.log("anibodyDetail ID:", anibodyDetail.id);
  if (cockroachKineticsDetail) console.log("cockroachKineticsDetail ID:", cockroachKineticsDetail.id);
  if (kidsDetail) console.log("kidsDetail ID:", kidsDetail.id);
  if (koerlichProtopianDetail) console.log("koerlichProtopianDetail ID:", koerlichProtopianDetail.id);
  if (zusammenSindWirHierDetail) console.log("zusammenSindWirHierDetail ID:", zusammenSindWirHierDetail.id);
  if (aboutMeDetail) console.log("aboutMeDetail ID:", aboutMeDetail.id);
  if (bodyTunesDetail) console.log("bodyTunesDetail ID:", bodyTunesDetail.id);
}

// Setup all event listeners
function setupEventListeners() {
  // Home icon click event
  if (homeIcon) {
    homeIcon.addEventListener("click", function () {
      window.location.assign("index.html");
    });
  }

  // Work item click events
  setupWorkItemClickEvents();

  // Seung Hwan Lee name click event
  setupNameClickEvent();

  // 드래그 기능 제거됨 - 더 이상 필요하지 않음

  // Keyboard events
  setupKeyboardEvents();

  // Back button events
  setupBackButtonEvents();
}

// Setup Seung Hwan Lee name click event
function setupNameClickEvent() {
  const nameElement = document.getElementById("seungHwanLee");
  if (nameElement) {
    nameElement.addEventListener("click", function () {
      console.log("Seung Hwan Lee name clicked - showing About Me detail");
      showDetail(aboutMeDetail);
    });
  }
}

// Setup work item click events
function setupWorkItemClickEvents() {
  console.log("Setting up work item click events...");

  // View All Works 버튼 이벤트 설정
  setupViewAllButton();

  // 이벤트 위임을 사용하여 works-grid에 이벤트 설정
  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) {
    console.log("Works grid not found for event delegation");
    return;
  }

  // works-grid에 클릭 이벤트 위임 설정
  worksGrid.addEventListener("click", function (e) {
    // 클릭된 요소가 work-item인지 확인
    const workItem = e.target.closest(".work-item");
    if (!workItem) return;

    const img = workItem.querySelector("img");
    if (img) {
      console.log(`Work item clicked:`, img.alt);
      e.stopPropagation(); // 이벤트 버블링 방지
      handleWorkItemClick(img.alt);
    }
  });

  // 터치 이벤트 위임 설정 (모바일)
  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;
  let isSwiping = false;
  const swipeThreshold = 30; // 스와이프로 인식할 최소 거리
  const clickThreshold = 150; // 클릭으로 인식할 최대 시간 (ms)

  worksGrid.addEventListener("touchstart", function (e) {
    const workItem = e.target.closest(".work-item");
    if (!workItem) return;

    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
    isSwiping = false;
  });

  worksGrid.addEventListener("touchmove", function (e) {
    if (e.touches.length === 1) {
      const touchEndX = e.touches[0].clientX;
      const touchEndY = e.touches[0].clientY;

      const deltaX = Math.abs(touchEndX - touchStartX);
      const deltaY = Math.abs(touchEndY - touchStartY);

      // 수평 이동이 수직 이동보다 크고 임계값을 넘으면 스와이프로 인식
      if (deltaX > deltaY && deltaX > swipeThreshold) {
        isSwiping = true;
      }
    }
  });

  worksGrid.addEventListener("touchend", function (e) {
    const workItem = e.target.closest(".work-item");
    if (!workItem) return;

    const touchDuration = Date.now() - touchStartTime;

    // 짧은 터치이고 스와이프가 아닌 경우에만 클릭으로 처리
    if (touchDuration < clickThreshold && !isSwiping) {
      const img = workItem.querySelector("img");
      if (img) {
        console.log(`Work item touched (click):`, img.alt);
        e.preventDefault(); // 기본 터치 동작 방지
        e.stopPropagation(); // 이벤트 버블링 방지
        handleWorkItemClick(img.alt);
      }
    }
  });

  // 현재 존재하는 모든 work-item 요소들에 대한 디버깅 정보 출력
  const allWorkItems = document.querySelectorAll(".work-item");
  console.log("Total work items found:", allWorkItems.length);

  // 디버깅: 각 work-item의 구조 확인
  allWorkItems.forEach((item, index) => {
    console.log(`Work item ${index}:`, {
      element: item,
      hasImg: !!item.querySelector("img"),
      imgAlt: item.querySelector("img")?.alt,
      pointerEvents: window.getComputedStyle(item).pointerEvents,
      cursor: window.getComputedStyle(item).cursor,
    });
  });
}

// 클릭 처리 함수
function handleWorkItemClick(altText) {
  console.log("Handling work item click for:", altText);

  // Determine which detail page to show based on alt text
  if (altText === "Colonialism : The weight of sound") {
    console.log("Showing Colonialism detail");
    showDetail(colonialismDetail);
  } else if (altText === "Soliloquy") {
    console.log("Showing Soliloquy detail");
    showDetail(soliloquyDetail);
  } else if (altText === "Politicalness") {
    console.log("Showing Politicalness detail");
    showDetail(politicalnessDetail);
  } else if (altText === "12.09.2017") {
    console.log("Showing 12.09.2017 detail");
    showDetail(date2017Detail);
  } else if (altText === "Looking For Someone To Be") {
    console.log("Showing Looking For Someone To Be detail");
    showDetail(lookingForSomeoneDetail);
  } else if (altText === "ANIBODY") {
    console.log("Showing ANIBODY detail");
    showDetail(anibodyDetail);
  } else if (altText === "Cockroach Kinetics") {
    console.log("Showing Cockroach Kinetics detail");
    showDetail(cockroachKineticsDetail);
  } else if (altText === "Kids") {
    console.log("Showing Kids detail");
    showDetail(kidsDetail);
  } else if (altText === "Köperlich Protopian") {
    console.log("Showing Köperlich Protopian detail");
    showDetail(koerlichProtopianDetail);
  } else if (altText === "Zusammen sind wir hier") {
    console.log("Showing Zusammen sind wir hier detail");
    showDetail(zusammenSindWirHierDetail);
  } else if (altText === "Body Tunes") {
    console.log("Showing Body Tunes detail");
    showDetail(bodyTunesDetail);
  } else if (altText === "About Me") {
    console.log("Showing About Me detail");
    showDetail(aboutMeDetail);
  } else {
    console.log("No matching detail page for:", altText);
  }
}

function setupViewAllButton() {
  console.log("=== Setting up View All Works button ===");

  const viewAllBtn = document.getElementById("viewAllBtn");
  const worksGrid = document.querySelector(".works-grid");
  const worksSection = document.querySelector(".works-section");

  console.log("Elements found:", {
    viewAllBtn: !!viewAllBtn,
    worksGrid: !!worksGrid,
    worksSection: !!worksSection,
  });

  if (!viewAllBtn || !worksGrid || !worksSection) {
    console.log("View All button, works grid, or works section not found");
    return;
  }

  let isCompactLayout = false;

  viewAllBtn.addEventListener("click", function () {
    console.log("View All Works button clicked, current state:", isCompactLayout);

    if (!isCompactLayout) {
      // 컴팩트 레이아웃으로 변경
      console.log("Switching to compact layout...");
      worksGrid.classList.add("compact-layout");
      worksSection.classList.add("compact-active");

      // 애니메이션 멈추기
      worksGrid.style.animation = "none";
      worksGrid.style.transform = "none";

      viewAllBtn.querySelector(".btn-text").textContent = "Back to Conveyor";
      viewAllBtn.querySelector("svg").innerHTML = `
        <path d="M2 8h20M2 12h20M2 16h20"/>
        <path d="M4 6l-2 2 2 2M20 6l2 2-2 2"/>
      `;
      isCompactLayout = true;
      console.log("Compact layout activated");
    } else {
      // 컨베이어 레이아웃으로 복귀
      console.log("Switching back to conveyor layout...");
      worksGrid.classList.remove("compact-layout");
      worksSection.classList.remove("compact-active");

      // 애니메이션 재시작
      worksGrid.style.animation = "scroll 40s linear infinite";
      worksGrid.style.transform = "";

      viewAllBtn.querySelector(".btn-text").textContent = "View All Works";
      viewAllBtn.querySelector("svg").innerHTML = `
        <path d="M3 3h18v18H3z"/>
        <path d="M9 9h6v6H9z"/>
      `;
      isCompactLayout = false;
      console.log("Conveyor layout restored");
    }
  });
}

// ---- helpers for fast-move handoff ----
function getCurrentTranslateX(el) {
  const tf = window.getComputedStyle(el).transform;
  if (!tf || tf === "none") return 0;
  try {
    return new DOMMatrix(tf).m41 || 0;
  } catch {
    return 0;
  }
}
function wrapPosition(pos, width) {
  // keep pos in (-width, 0]
  if (!width) return pos;
  while (pos <= -width) pos += width;
  while (pos > 0) pos -= width;
  return pos;
}
// 컨베이어벨트 빠른 이동 함수 - 카드들이 "촤라락" 넘어가는 느낌
function fastMoveConveyor(direction) {
  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) return;

  // Pause CSS animation while we do stepped movement
  worksGrid.style.animationPlayState = "paused";
  worksGrid.style.transition = "none";

  const originalWidth = worksGrid.scrollWidth / 2; // original set width
  let currentPosition = wrapPosition(getCurrentTranslateX(worksGrid), originalWidth);

  // measure one card width incl. margins
  const first = worksGrid.querySelector(".work-item");
  if (!first) return;
  const rect = first.getBoundingClientRect();
  const cs = window.getComputedStyle(first);
  const cardStep = rect.width + (parseFloat(cs.marginLeft) || 0) + (parseFloat(cs.marginRight) || 0);

  const steps = 6; // number of mini swipes
  const perStepMs = 90; // duration per mini swipe
  const jumpCards = 3; // total cards to fast-move
  const totalMove = (direction === "forward" ? -1 : 1) * (cardStep * jumpCards);

  const startPos = currentPosition;
  const stepDelta = totalMove / steps;
  let stepIndex = 0;

  function animateStepStart() {
    const s = performance.now();
    const from = currentPosition; // use wrapped current each step
    let to = wrapPosition(from + stepDelta, originalWidth);

    function frame(now) {
      const t = Math.min(1, (now - s) / perStepMs);
      const eased = 1 - (1 - t) * (1 - t); // easeOutQuad

      // interpolate with care across wrap boundary by using deltas in unwrapped space
      let interp;
      // compute shortest delta considering wrap
      let rawDelta = to - from;
      // if crossing the boundary, adjust delta so motion direction remains continuous
      if (direction === "forward" && rawDelta > 0) rawDelta -= originalWidth;
      if (direction === "backward" && rawDelta < 0) rawDelta += originalWidth;
      interp = wrapPosition(from + rawDelta * eased, originalWidth);

      worksGrid.style.transform = `translateX(${interp}px)`;
      currentPosition = interp;

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        stepIndex++;
        if (stepIndex < steps) {
          animateStepStart();
        } else {
          // hand off from currentPosition (wrapped)
          finishFastMove(currentPosition);
        }
      }
    }
    requestAnimationFrame(frame);
  }

  animateStepStart();
}

// 빠른 이동 완료 후 애니메이션 재시작 함수
function finishFastMove(finalPosition) {
  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) return;

  const originalWidth = worksGrid.scrollWidth / 2;
  const BASE_DURATION = 40; // keep in sync with CSS

  const wrapped = wrapPosition(finalPosition, originalWidth);
  // progress 0..1 where 0 == start (translateX(0)), forward motion is negative X
  let progress = -wrapped / originalWidth;
  progress = ((progress % 1) + 1) % 1; // normalize to [0,1)

  // restart CSS animation exactly at this progress without visible jump
  worksGrid.style.animation = "none";
  // keep inline transform for this frame so visual matches the target offset
  // then re-enable animation with a negative delay so it continues from here
  // use reflow to apply the reset
  void worksGrid.offsetHeight;
  worksGrid.style.animation = `scroll ${BASE_DURATION}s linear infinite`;
  worksGrid.style.animationDelay = `-${progress * BASE_DURATION}s`;
  worksGrid.style.animationPlayState = "running";

  // clear inline transform on the next frame so animation fully drives transform
  requestAnimationFrame(() => {
    worksGrid.style.transform = "";
  });
}

// 드래그 기능 제거됨 - 더 이상 필요하지 않음

// Setup keyboard events
function setupKeyboardEvents() {
  document.addEventListener("keydown", function (event) {
    if (
      event.key === "Escape" &&
      ((colonialismDetail && colonialismDetail.classList.contains("slide-in")) ||
        (soliloquyDetail && soliloquyDetail.classList.contains("slide-in")) ||
        (politicalnessDetail && politicalnessDetail.classList.contains("slide-in")) ||
        (date2017Detail && date2017Detail.classList.contains("slide-in")) ||
        (lookingForSomeoneDetail && lookingForSomeoneDetail.classList.contains("slide-in")) ||
        (cockroachKineticsDetail && cockroachKineticsDetail.classList.contains("slide-in")) ||
        (kidsDetail && kidsDetail.classList.contains("slide-in")) ||
        (aboutMeDetail && aboutMeDetail.classList.contains("slide-in")))
    ) {
      goBack();
    }

    // 화살표 키 기능 제거됨
  });
}

// Setup typing animation
function setupTypingAnimation() {
  console.log("=== Setting up typing animation ===");

  // DOM이 준비되면 즉시 타이핑 애니메이션 시작
  function startTypingAnimation() {
    console.log("Starting typing animation...");

    // Each typing animation element selection
    const nameElement = document.querySelector(".typing-animation");
    const leadElement = document.querySelector(".typing-animation-lead");
    const activeElement = document.querySelector(".typing-animation-active");

    console.log("Typing elements found:", {
      name: !!nameElement,
      lead: !!leadElement,
      active: !!activeElement,
    });

    // Listen for the last typing animation to complete
    if (activeElement) {
      activeElement.addEventListener("animationend", function () {
        console.log("Last typing animation completed, moving text up immediately");

        const aboutText = document.querySelector(".about-text");
        const worksSection = document.querySelector(".works-section");

        // Move text up immediately
        if (aboutText) {
          aboutText.classList.add("move-up");
          console.log("✓ Text moved up");
        }

        // Fade in works immediately after text moves up
        if (worksSection) {
          worksSection.classList.add("fade-in");
          console.log("✓ Works section faded in");
        } else {
          console.error("❌ Works section not found!");
        }

        // Add continuous animation to the name after typing is complete
        const nameElement = document.getElementById("seungHwanLee");
        if (nameElement) {
          setTimeout(() => {
            nameElement.classList.add("animated");
          }, 500); // 타이핑 완료 후 0.5초 뒤에 애니메이션 시작
        }
      });

      console.log("✓ Animation end listener added to active element");
    } else {
      console.error("❌ Active element not found, falling back to timeout");
      // Fallback: 만약 activeElement를 찾을 수 없다면 3초 후에 강제로 실행
      setTimeout(() => {
        console.log("Fallback: Forcing animation completion after 3 seconds");
        const aboutText = document.querySelector(".about-text");
        const worksSection = document.querySelector(".works-section");

        if (aboutText) {
          aboutText.classList.add("move-up");
          console.log("✓ Text moved up (fallback)");
        }

        if (worksSection) {
          worksSection.classList.add("fade-in");
          console.log("✓ Works section faded in (fallback)");
        }
      }, 3000);
    }
  }

  // DOM이 준비되면 즉시 시작
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startTypingAnimation);
  } else {
    startTypingAnimation();
  }

  // 백업으로 window.load도 설정
  window.addEventListener("load", function () {
    console.log("Window load event fired, checking if animation needs to be triggered");

    // 만약 아직 애니메이션이 시작되지 않았다면 강제로 시작
    const worksSection = document.querySelector(".works-section");
    if (worksSection && !worksSection.classList.contains("fade-in")) {
      console.log("Forcing animation completion on window load");
      const aboutText = document.querySelector(".about-text");

      if (aboutText && !aboutText.classList.contains("move-up")) {
        aboutText.classList.add("move-up");
      }

      worksSection.classList.add("fade-in");
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
  allDetailPages.forEach((detailPage) => {
    if (detailPage && detailPage.classList.contains("slide-in")) {
      console.log("Hiding currently visible detail page:", detailPage.id);
      detailPage.classList.remove("slide-in");
    }
  });

  // Hide home icon when showing detail page
  const homeIcon = document.querySelector(".home-icon");
  if (homeIcon) {
    homeIcon.classList.add("hidden");
  }

  console.log("✓ Hiding main page immediately");
  mainPage.classList.add("slide-out");

  console.log("✓ Showing detail page immediately");
  targetDetail.classList.add("slide-in");
  console.log("✓ Detail page should now be visible");

  // Verify the class was added
  console.log("✓ targetDetail.classList.contains('slide-in'):", targetDetail.classList.contains("slide-in"));
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

  // Show home icon when going back to main page
  const homeIcon = document.querySelector(".home-icon");
  if (homeIcon) {
    homeIcon.classList.remove("hidden");
  }

  // Find which detail page is currently visible
  currentDetailPage = null;
  allDetailPages.forEach((detailPage) => {
    if (detailPage && detailPage.classList.contains("slide-in")) {
      currentDetailPage = detailPage;
    }
  });

  console.log("Current detail page:", currentDetailPage ? currentDetailPage.id : "none");

  if (currentDetailPage) {
    // Hide the current detail page first
    console.log("Hiding detail page:", currentDetailPage.id);
    currentDetailPage.classList.remove("slide-in");

    // Show main page immediately
    console.log("Showing main page immediately");
    if (mainPage) {
      mainPage.classList.remove("slide-out");
    }
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
