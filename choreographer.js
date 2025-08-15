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
  zusammenSindWirHierDetail;
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

      // 클릭 이벤트 (데스크톱)
      workItem.addEventListener("click", function (e) {
        // 드래그 중일 때는 클릭 이벤트 방지
        if (document.querySelector(".works-grid.dragging")) {
          console.log("Click prevented during dragging");
          return;
        }

        console.log(`Work item ${index} clicked:`, img.alt);
        handleWorkItemClick(img.alt);
      });

      // 터치 이벤트 (모바일) - 클릭과 스와이프 구분
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isSwiping = false;
      const swipeThreshold = 30; // 스와이프로 인식할 최소 거리
      const clickThreshold = 150; // 클릭으로 인식할 최대 시간 (ms)

      workItem.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        isSwiping = false;
      });

      workItem.addEventListener("touchmove", function (e) {
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

      workItem.addEventListener("touchend", function (e) {
        const touchDuration = Date.now() - touchStartTime;

        // 드래그 중일 때는 터치 이벤트 방지
        if (document.querySelector(".works-grid.dragging")) {
          console.log("Touch prevented during dragging");
          return;
        }

        // 짧은 터치이고 스와이프가 아닌 경우에만 클릭으로 처리
        if (touchDuration < clickThreshold && !isSwiping) {
          console.log(`Work item ${index} touched (click):`, img.alt);
          e.preventDefault(); // 기본 터치 동작 방지
          handleWorkItemClick(img.alt);
        }
      });
    }
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
  } else {
    console.log("No matching detail page for:", altText);
  }
}

// Setup conveyor belt drag events (완전 재작성)
function setupConveyorBeltEvents() {
  const worksGrid = document.querySelector(".works-grid");
  if (!worksGrid) {
    console.log("Works grid not found for conveyor belt events");
    return;
  }

  console.log("=== Setting up improved drag functionality for conveyor belt ===");

  // 드래그 관련 변수
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let dragDistance = 0;
  let animationStartPosition = 0;
  let draggedElement = null;
  let baseDuration = 40; // 기본 애니메이션 지속 시간 (40초)

  // 모멘텀 계산을 위한 변수
  let lastDragTime = 0;
  let dragVelocity = 0;
  let animationFrameId = null;

  // 마우스 이벤트 (데스크탑)
  worksGrid.addEventListener("mousedown", function (e) {
    if (e.button !== 0) return; // 좌클릭만 처리

    console.log("Mouse down - starting drag");
    startDrag(e.clientX, e.clientY);
    e.preventDefault();
  });

  document.addEventListener("mousemove", function (e) {
    if (!isDragging) return;

    handleDrag(e.clientX, e.clientY);
    e.preventDefault();
  });

  document.addEventListener("mouseup", function (e) {
    if (!isDragging) return;

    console.log("Mouse up - ending drag");
    endDrag();
    e.preventDefault();
  });

  // 터치 이벤트 (모바일/태블릿)
  worksGrid.addEventListener(
    "touchstart",
    function (e) {
      if (e.touches.length !== 1) return; // 단일 터치만 처리

      console.log("Touch start - starting drag");
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      if (!isDragging) return;

      handleDrag(e.touches[0].clientX, e.touches[0].clientY);
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("touchend", function (e) {
    if (!isDragging) return;

    console.log("Touch end - ending drag");
    endDrag();
    e.preventDefault();
  });

  // 드래그 시작
  function startDrag(x, y) {
    isDragging = true;
    startX = x;
    startY = y;
    currentX = x;
    lastDragTime = performance.now();

    // 클릭된 위치에서 가장 가까운 work-item 찾기
    const clickedElement = document.elementFromPoint(x, y);
    const workItem = clickedElement ? clickedElement.closest(".work-item") : null;

    if (workItem) {
      draggedElement = workItem;
      // 드래그 중인 이미지에 시각적 효과 적용
      workItem.classList.add("dragging");
      console.log("Dragging image:", workItem.querySelector("img")?.alt || "Unknown");
    } else {
      draggedElement = worksGrid;
    }

    // 드래그 중일 때 애니메이션 일시정지
    worksGrid.classList.add("dragging");

    // CSS 애니메이션 일시정지 (완전히 중단하지 않음)
    worksGrid.style.animationPlayState = "paused";
    worksGrid.style.webkitAnimationPlayState = "paused";

    // 현재 애니메이션의 진행 상태를 정확히 파악하여 기준 위치 저장
    const computedStyle = window.getComputedStyle(worksGrid);
    const transform = computedStyle.transform;

    if (transform && transform !== "none") {
      // 이미 transform이 적용된 경우 (이전 드래그에서)
      const matrix = new DOMMatrix(transform);
      animationStartPosition = matrix.m41; // translateX 값
      console.log("Using existing transform position:", animationStartPosition);
    } else {
      // transform이 없는 경우 (애니메이션 진행 중)
      // 현재 애니메이션의 진행 상태를 계산
      const animationDuration = parseFloat(getComputedStyle(worksGrid).animationDuration) || baseDuration;
      const animationDelay = parseFloat(getComputedStyle(worksGrid).animationDelay) || 0;

      // 애니메이션이 시작된 후 경과한 시간 계산
      const currentTime = (performance.now() / 1000) % animationDuration;

      // 현재 애니메이션 진행률 (0~1)
      const progress = currentTime / animationDuration;

      // 전체 애니메이션 거리 (무한 루프를 위해 50%만큼 이동)
      const totalDistance = worksGrid.scrollWidth / 2;

      // 현재 애니메이션 위치 계산 (오른쪽에서 왼쪽으로 이동하므로 음수)
      animationStartPosition = -progress * totalDistance;

      console.log("Calculated animation position:", {
        currentTime,
        animationDuration,
        progress,
        totalDistance,
        animationStartPosition,
      });
    }

    console.log("Drag started at:", { x, y, animationStartPosition, draggedElement: draggedElement?.tagName });
  }

  // 드래그 처리 - requestAnimationFrame 사용
  function handleDrag(x, y) {
    if (!isDragging) return;

    const deltaX = x - startX;
    const deltaY = y - startY;

    // 수평 드래그만 처리 (수직 드래그는 무시)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      currentX = x;
      dragDistance = deltaX;

      // requestAnimationFrame을 사용해서 렌더링을 부드럽게 함
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        // 드래그 거리에 따라 컨베이어벨트 위치 조정
        const dragSensitivity = 1.0; // 드래그 민감도
        const newPosition = animationStartPosition + dragDistance * dragSensitivity;

        // transform: translateX(...)를 바로 업데이트하여 worksGrid와 draggedElement가 동시에 움직임
        worksGrid.style.transform = `translateX(${newPosition}px)`;

        // 드래그 중인 카드도 같은 거리만큼 이동하는 효과 (시각적 일관성)
        if (draggedElement && draggedElement.classList.contains("work-item")) {
          // 카드 자체는 transform을 적용하지 않고, worksGrid의 transform으로 자연스럽게 이동
          console.log("Dragging card with grid position:", newPosition);
        }
      });

      // 모멘텀 계산을 위한 속도 측정
      const currentTime = performance.now();
      const timeDelta = currentTime - lastDragTime;
      if (timeDelta > 0) {
        dragVelocity = deltaX / timeDelta; // px/ms
        lastDragTime = currentTime;
      }
    }
  }

  // 드래그 종료
  function endDrag() {
    if (!isDragging) return;

    isDragging = false;
    worksGrid.classList.remove("dragging");

    // requestAnimationFrame 정리
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }

    // 드래그 중이던 이미지에서 시각적 효과만 제거 (transform은 유지)
    if (draggedElement && draggedElement.classList.contains("work-item")) {
      draggedElement.classList.remove("dragging");
      console.log("Stopped dragging image:", draggedElement.querySelector("img")?.alt || "Unknown");
    }

    console.log("Drag ended:", { dragDistance, dragVelocity });

    // 모멘텀을 계산해서 컨베이어벨트를 다시 부드럽게 움직이게 함
    // 현재 translateX 위치를 유지하면서 애니메이션 재시작
    applyMomentum();

    // 변수 초기화
    dragDistance = 0;
    startX = 0;
    startY = 0;
    currentX = 0;
    draggedElement = null;
    dragVelocity = 0;
  }

  // 모멘텀 적용 함수
  function applyMomentum() {
    // 현재 드래그된 위치에서 애니메이션 재시작
    const currentTransform = worksGrid.style.transform;
    let currentPosition = 0;
    let progress = 0;
    const totalDistance = worksGrid.scrollWidth / 2; // 전체 애니메이션 거리 (50%)

    if (!currentTransform || currentTransform === "none") {
      // transform이 없거나 none일 때: 애니메이션 진행률을 animationDelay로 계산
      // getComputedStyle로 현재 animationDelay 값(초 단위)을 가져옴
      const computedStyle = window.getComputedStyle(worksGrid);
      let delay = 0;
      let delayStr = computedStyle.animationDelay || "0s";
      // animationDelay는 음수일 수 있음, s 단위 제거
      if (delayStr.endsWith("ms")) {
        delay = parseFloat(delayStr) / 1000;
      } else {
        delay = parseFloat(delayStr); // s 단위
      }
      // 음수 animationDelay는 실제로는 진행률을 앞으로 당긴 것
      // progress = (delay / baseDuration) % 1, normalize to 0~1
      progress = (delay / baseDuration) % 1;
      if (progress < 0) progress += 1;
      // epsilon offset 추가 (0.0001)로 0에 매우 가깝게 방지
      progress += 0.0001;
      // 0~1 사이로 보정
      progress = ((progress % 1) + 1) % 1;
      // currentPosition도 계산 (애니메이션 위치)
      currentPosition = -progress * totalDistance;
      console.log("No transform; calculated progress from animationDelay:", {
        delay,
        baseDuration,
        progress,
        totalDistance,
        currentPosition,
      });
    } else {
      // 이미 transform이 적용된 경우 (이전 드래그에서)
      currentPosition = parseFloat(currentTransform.replace("translateX(", "").replace("px)", "")) || 0;
      // 진행률 계산 (오른쪽 -> 왼쪽 이동이므로 음수 방향 처리)
      progress = (currentPosition / -totalDistance) % 1;
      if (progress < 0) progress += 1;
      // epsilon offset 추가
      progress += 0.0001;
      progress = ((progress % 1) + 1) % 1;
    }

    // 무한 루프를 위한 위치 보정
    // translateX가 원본 너비 이상 이동하면 0으로 보정
    const originalWidth = worksGrid.scrollWidth / 2; // 원본 아이템들의 총 너비
    if (Math.abs(currentPosition) >= originalWidth) {
      currentPosition = currentPosition % originalWidth;
      console.log("Position corrected for infinite loop:", currentPosition);
    }

    // 현재 위치를 유지하면서 애니메이션 재시작
    // transform을 제거하지 않고 현재 위치에서 애니메이션 시작
    const finalPosition = currentPosition;

    // CSS 애니메이션 재시작
    worksGrid.style.animation = "none";
    worksGrid.offsetHeight; // reflow

    worksGrid.style.animation = `scroll ${baseDuration}s linear infinite`;
    worksGrid.style.animationDelay = `-${progress * baseDuration}s`;

    // 애니메이션 재시작
    worksGrid.style.animationPlayState = "running";
    worksGrid.style.webkitAnimationPlayState = "running";

    // 현재 위치를 유지하기 위해 transform을 다시 설정
    // 애니메이션이 시작되면 자연스럽게 이어지도록 함
    setTimeout(() => {
      worksGrid.style.transform = `translateX(${finalPosition}px)`;
      console.log("Transform restored to maintain position:", finalPosition);
    }, 50);

    console.log("Animation restarted from current position:", {
      currentPosition: finalPosition,
      totalDistance,
      progress,
      animationDelay: worksGrid.style.animationDelay,
    });

    // 일정 시간 후 animationDelay를 0으로 리셋하여 자연스럽게 이어지게 함
    setTimeout(() => {
      worksGrid.style.animationDelay = "0s";
      console.log("Animation delay reset to 0s, animation continues smoothly");
    }, 3000);
  }

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
        (lookingForSomeoneDetail && lookingForSomeoneDetail.classList.contains("slide-in")) ||
        (cockroachKineticsDetail && cockroachKineticsDetail.classList.contains("slide-in")) ||
        (kidsDetail && kidsDetail.classList.contains("slide-in")))
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
  allDetailPages.forEach((detailPage) => {
    if (detailPage && detailPage.classList.contains("slide-in")) {
      console.log("Hiding currently visible detail page:", detailPage.id);
      detailPage.classList.remove("slide-in");
    }
  });

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
