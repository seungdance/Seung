// Advanced Interactive Dual Portfolio with Reactive Animations

const container = document.querySelector(".split-container");
const sections = Array.from(container.querySelectorAll(".section"));

let sectionHeight = window.innerHeight;
let y1 = 0;
let y2 = sectionHeight;
let lastTimestamp = null;
const baseSpeed = 100; // 기본 속도 (px/sec)
let currentSpeed = baseSpeed; // 현재 속도
let isPaused = false;
let animationId = null;
let pauseStartTime = 0;
let pausedY1 = 0;
let pausedY2 = 0;

// 스와이프 속도 조절 변수
let speedBoost = 1; // 속도 배율
let speedDecayTimer = null; // 속도 감소 타이머

function setSectionPositions() {
  // iOS에서 viewport 높이 문제 해결
  if (isIOS) {
    // iOS Safari에서 정확한 viewport 높이 계산
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    sectionHeight = window.innerHeight;
  } else {
    sectionHeight = window.innerHeight;
  }

  // CSS에서 이미 height: 200vh로 설정되어 있으므로 여기서는 제거
  // container.style.height = sectionHeight * 2 + "px";
  sections[0].style.height = sectionHeight + "px";
  sections[1].style.height = sectionHeight + "px";
  // 두 섹션의 시작 위치
  y1 = 0;
  y2 = sectionHeight;
  sections[0].style.top = y1 + "px";
  sections[1].style.top = y2 + "px";
  container.style.transform = "translateY(0px)";

  // 애니메이션 변수 초기화
  lastTimestamp = null;
  pausedY1 = 0;
  pausedY2 = 0;
}

function animateConveyor(timestamp) {
  if (isPaused) {
    animationId = requestAnimationFrame(animateConveyor);
    return;
  }

  if (!lastTimestamp) lastTimestamp = timestamp;
  const delta = (timestamp - lastTimestamp) / 1000;
  lastTimestamp = timestamp;

  // 현재 속도 적용 (스와이프 부스트 포함)
  const finalSpeed = isMobile ? currentSpeed * 0.8 : currentSpeed;

  y1 -= finalSpeed * delta;
  y2 -= finalSpeed * delta;

  // 한 섹션이 완전히 위로 사라지면 즉시 아래로 내림
  if (y1 <= -sectionHeight) {
    y1 = y2 + sectionHeight;
  }
  if (y2 <= -sectionHeight) {
    y2 = y1 + sectionHeight;
  }

  sections[0].style.top = y1 + "px";
  sections[1].style.top = y2 + "px";

  animationId = requestAnimationFrame(animateConveyor);
}

// 모바일 디바이스 감지 (iOS 특별 처리)
const userAgent = navigator.userAgent;
const hasTouchScreen = navigator.maxTouchPoints > 0;
const isMobileByUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
const isMobileByWidth = window.innerWidth <= 768;
const isMobile = isMobileByUA || (hasTouchScreen && isMobileByWidth);
const isIOS = /iPad|iPhone|iPod/.test(userAgent);

// 디버깅을 위한 모바일 감지 정보 출력
console.log("User Agent:", userAgent);
console.log("hasTouchScreen:", hasTouchScreen);
console.log("isMobileByUA:", isMobileByUA);
console.log("isMobileByWidth:", isMobileByWidth);
console.log("최종 isMobile:", isMobile);
console.log("isIOS:", isIOS);

// 스와이프 감지 변수
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let touchStartTime = 0;
let touchEndTime = 0;
let minSwipeDistance = 30; // 최소 스와이프 거리 (더 민감하게)
let minSwipeDuration = 100; // 최소 스와이프 시간 (밀리초)

// 스와이프 애니메이션을 위한 별도 변수
let swipeAnimationId = null;
let isSwipeAnimating = false;

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", function () {
  setSectionPositions();

  // 버튼 이벤트 추가 (데스크탑 + 모바일)
  const buttons = document.querySelectorAll(".enter-btn");
  buttons.forEach((button) => {
    // 데스크탑 호버 이벤트
    button.addEventListener("mouseenter", pauseAnimation);
    button.addEventListener("mouseleave", startAnimation);

    // 모바일 터치 이벤트 (iOS 특별 처리)
    if (isMobile) {
      if (isIOS) {
        // iOS에서 터치 이벤트 최적화 (클릭 이벤트 보존)
        let touchStartTime = 0;

        button.addEventListener(
          "touchstart",
          function (e) {
            touchStartTime = Date.now();
            pauseAnimation();
          },
          { passive: true }
        );

        button.addEventListener(
          "touchend",
          function (e) {
            const touchDuration = Date.now() - touchStartTime;

            // 짧은 터치일 때만 애니메이션 재시작 (클릭으로 인식)
            if (touchDuration < 300) {
              startAnimation();
            }
          },
          { passive: true }
        );
      } else {
        // 안드로이드 등 다른 모바일
        button.addEventListener("touchstart", pauseAnimation);
        button.addEventListener("touchend", startAnimation);
      }
    }
  });

  // Add click event listeners for navigation buttons
  const choreographerBtn = document.getElementById("choreographer-btn");
  const developerBtn = document.getElementById("developer-btn");

  if (choreographerBtn) {
    choreographerBtn.addEventListener("click", () => {
      location.href = "choreographer.html";
    });
  }

  if (developerBtn) {
    developerBtn.addEventListener("click", () => {
      location.href = "webdev.html";
    });
  }

  // iOS에서 애니메이션 시작 (iOS 특별 처리)
  if (isIOS) {
    // iOS에서 더 긴 지연으로 안정성 확보
    setTimeout(() => {
      startAnimation();
    }, 1000);
  } else if (isMobile) {
    // 안드로이드 등 다른 모바일
    setTimeout(() => {
      startAnimation();
    }, 500);
  } else {
    // 데스크탑
    startAnimation();
  }

  // 전체 화면에 스와이프 이벤트 추가
  if (isMobile) {
    console.log("모바일 감지됨, 터치 스와이프 이벤트 등록 중...");

    document.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        console.log("터치 시작:", touchStartX, touchStartY);
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        touchEndTime = Date.now();
        console.log("터치 종료:", touchEndX, touchEndY);

        // 스와이프 감지 및 임펄스 기반 이동
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, touchStartTime, touchEndTime);
      },
      { passive: true }
    );

    console.log("터치 스와이프 이벤트 등록 완료");
  } else {
    console.log("데스크탑 감지됨, 마우스 드래그 스와이프 이벤트 등록 중...");

    // 데스크탑에서 마우스 드래그로 스와이프 기능
    let isMouseDown = false;

    document.addEventListener("mousedown", function (e) {
      isMouseDown = true;
      touchStartX = e.clientX;
      touchStartY = e.clientY;
      touchStartTime = Date.now();
      console.log("마우스 시작:", touchStartX, touchStartY);
    });

    document.addEventListener("mouseup", function (e) {
      if (isMouseDown) {
        isMouseDown = false;
        touchEndX = e.clientX;
        touchEndY = e.clientY;
        touchEndTime = Date.now();
        console.log("마우스 종료:", touchEndX, touchEndY);

        // 스와이프 감지 및 임펄스 기반 이동
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, touchStartTime, touchEndTime);
      }
    });

    document.addEventListener("mouseleave", function () {
      isMouseDown = false;
    });

    console.log("마우스 드래그 스와이프 이벤트 등록 완료");
  }
});

window.addEventListener("resize", () => {
  setSectionPositions();
});

// 애니메이션 시작
function startAnimation() {
  if (isPaused) {
    isPaused = false;
    // 저장된 위치에서 시작
    y1 = pausedY1;
    y2 = pausedY2;
    // lastTimestamp를 현재 시간으로 설정하여 delta 계산 오류 방지
    lastTimestamp = performance.now();
    document.body.classList.remove("paused");
  }

  // 애니메이션이 실행 중이 아니면 시작
  if (!animationId) {
    // 애니메이션 시작 시 부드러운 속도 변화 적용
    if (speedBoost > 1) {
      // 부스트가 적용된 상태라면 점진적으로 원래 속도로 복원
      const currentBoost = speedBoost;
      const targetBoost = 1;
      const decayDuration = 2000; // 2초 동안 점진적 감소
      const startTime = performance.now();

      function gradualSpeedDecay(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / decayDuration, 1);

        // easeOutQuart 이징으로 부드러운 감속
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        speedBoost = currentBoost + (targetBoost - currentBoost) * easeProgress;
        currentSpeed = baseSpeed * speedBoost;

        if (progress < 1) {
          requestAnimationFrame(gradualSpeedDecay);
        } else {
          speedBoost = 1;
          currentSpeed = baseSpeed;
          console.log("속도 점진적 감소 완료 - 원래 속도로 복원");
        }
      }

      requestAnimationFrame(gradualSpeedDecay);
    }

    animationId = requestAnimationFrame(animateConveyor);
  }
}

// 스와이프 감지 및 임펄스 기반 이동
function handleSwipe(startX, startY, endX, endY, startTime, endTime) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const duration = endTime - startTime;

  console.log("스와이프 감지:", {
    startX,
    startY,
    endX,
    endY,
    deltaX,
    deltaY,
    distance,
    duration: duration + "ms",
  });

  // 최소 스와이프 거리 및 시간 확인
  if (distance < minSwipeDistance || duration < minSwipeDuration) {
    console.log("스와이프 조건 부족:", "거리:", distance, "<", minSwipeDistance, "시간:", duration, "<", minSwipeDuration);
    return;
  }

  // 스와이프 속도(임펄스) 계산 (거리/시간)
  const velocity = distance / duration; // px/ms
  console.log("스와이프 속도:", velocity.toFixed(2), "px/ms");

  // 스와이프 강도에 따른 속도 부스트 적용
  const boostMultiplier = Math.min(1 + velocity * 0.1, 2.5); // 최대 2.5배
  boostSpeed(boostMultiplier);

  // 스와이프 방향에 따른 컨베이어 벨트 이동 (직관적 방향)
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    // 수직 스와이프 (위/아래)
    if (deltaY > 0) {
      // 아래로 스와이프 - 컨베이어 벨트 아래로 이동 (내용이 위로 올라옴)
      const moveDistance = Math.min(distance * velocity * 2, 500); // 최대 500px
      console.log("아래로 스와이프 - 컨베이어 벨트 아래로", moveDistance.toFixed(0), "px 이동 (내용 위로)");
      moveConveyorBelt(moveDistance, "down");
    } else {
      // 위로 스와이프 - 컨베이어 벨트 위로 이동 (내용이 아래로 내려옴)
      const moveDistance = Math.min(distance * velocity * 2, 500);
      console.log("위로 스와이프 - 컨베이어 벨트 위로", moveDistance.toFixed(0), "px 이동 (내용 아래로)");
      moveConveyorBelt(moveDistance, "up");
    }
  } else {
    // 수평 스와이프 (좌/우)
    if (deltaX > 0) {
      // 오른쪽으로 스와이프 - 컨베이어 벨트 아래로 이동 (내용이 위로 올라옴)
      const moveDistance = Math.min(distance * velocity * 1.5, 400);
      console.log("오른쪽으로 스와이프 - 컨베이어 벨트 아래로", moveDistance.toFixed(0), "px 이동 (내용 위로)");
      moveConveyorBelt(moveDistance, "down");
    } else {
      // 왼쪽으로 스와이프 - 컨베이어 벨트 아래로 이동 (내용이 위로 올라옴)
      const moveDistance = Math.min(distance * velocity * 1.5, 400);
      console.log("왼쪽으로 스와이프 - 컨베이어 벨트 아래로", moveDistance.toFixed(0), "px 이동 (내용 위로)");
      moveConveyorBelt(moveDistance, "down");
    }
  }
}

// 컨베이어 벨트 이동 함수 (임펄스 기반, 부드러운 애니메이션)
function moveConveyorBelt(distance, direction) {
  // 이미 스와이프 애니메이션 중이면 무시
  if (isSwipeAnimating) {
    console.log("이미 스와이프 애니메이션 중입니다.");
    return;
  }

  // 기존 애니메이션 상태 확인
  const wasAnimating = animationId !== null;

  // 스와이프 애니메이션 시작
  isSwipeAnimating = true;

  // 부드러운 이동을 위한 변수
  const startY1 = y1;
  const startY2 = y2;
  const targetY1 = direction === "up" ? y1 - distance : y1 + distance;
  const targetY2 = direction === "up" ? y2 - distance : y2 + distance;
  const animationDuration = 600; // 600ms로 단축하여 더 빠른 반응
  const startTime = performance.now();

  console.log("컨베이어 벨트 부드러운 이동 시작:", direction, distance.toFixed(0), "px");

  // 부드러운 이동 애니메이션
  function smoothMove(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / animationDuration, 1);

    // easeOutQuart 이징 함수 (부드러운 감속)
    const easeProgress = 1 - Math.pow(1 - progress, 4);

    // 현재 위치 계산
    y1 = startY1 + (targetY1 - startY1) * easeProgress;
    y2 = startY2 + (targetY2 - startY2) * easeProgress;

    // 경계 체크 및 조정
    if (y1 <= -sectionHeight) {
      y1 = y2 + sectionHeight;
    }
    if (y2 <= -sectionHeight) {
      y2 = y1 + sectionHeight;
    }
    if (y1 >= sectionHeight) {
      y1 = y2 - sectionHeight;
    }
    if (y2 >= sectionHeight) {
      y2 = y1 - sectionHeight;
    }

    // 애니메이션 계속 또는 완료
    if (progress < 1) {
      swipeAnimationId = requestAnimationFrame(smoothMove);
    } else {
      console.log("컨베이어 벨트 부드러운 이동 완료:", direction, distance.toFixed(0), "px");

      // 스와이프 애니메이션 완료
      isSwipeAnimating = false;
      swipeAnimationId = null;

      // 기존 애니메이션이 있었으면 즉시 재시작 (지연 없이)
      if (wasAnimating) {
        console.log("기존 애니메이션 즉시 재시작");
        // 애니메이션이 멈춰있으면 즉시 시작
        if (!animationId) {
          startAnimation();
        }
      }
    }
  }

  // 부드러운 이동 시작
  swipeAnimationId = requestAnimationFrame(smoothMove);
}

// 속도 부스트 함수 (기존 기능 유지)
function boostSpeed(multiplier) {
  console.log("속도 부스트 적용:", multiplier, "배");

  // 기존 타이머 클리어
  if (speedDecayTimer) {
    clearTimeout(speedDecayTimer);
    speedDecayTimer = null;
  }

  // 속도 부스트 적용
  speedBoost = multiplier;
  currentSpeed = baseSpeed * speedBoost;

  console.log("현재 속도:", currentSpeed, "px/sec (기본:", baseSpeed, "px/sec)");

  // 타이머 기반 감소 제거 - 이제 startAnimation에서 점진적으로 처리
}

// 애니메이션 일시정지
function pauseAnimation() {
  if (!isPaused) {
    isPaused = true;
    // 현재 위치 저장
    pausedY1 = y1;
    pausedY2 = y2;
    document.body.classList.add("paused");

    // iOS에서 터치 이벤트 최적화
    if (isIOS) {
      // iOS에서 더 긴 지연으로 안정성 확보
      setTimeout(() => {
        if (isPaused) {
          isPaused = false;
          startAnimation();
        }
      }, 2000);
    } else if (isMobile) {
      // 안드로이드 등 다른 모바일
      setTimeout(() => {
        if (isPaused) {
          isPaused = false;
          startAnimation();
        }
      }, 1000);
    }
  }
}

// Typing animation (한 번에 완성되게 수정)
const codeLines = ["Nice to meet you!", "I'm Web Developer Seung!"];
const typingTarget = document.getElementById("typing-code");
const screenFrame = document.querySelector(".screen-frame");
const screenBody = document.querySelector(".screen-body");
if (typingTarget) {
  let line = 0;

  function typeCode() {
    // 처음부터 바로 전체 텍스트를 2줄로 표시
    typingTarget.textContent = codeLines.join("\n");

    // 2초 대기 후 다시 시작
    setTimeout(() => {
      typeCode();
    }, 2000);
  }

  // 즉시 시작
  typeCode();
}

// Impressum and Datenschutz handling
document.addEventListener("DOMContentLoaded", function () {
  const impressumLink = document.getElementById("impressumLinkIndex");
  const impressumSection = document.getElementById("impressum");
  const impressumClose = document.getElementById("impressumClose");

  const datenschutzLink = document.getElementById("datenschutzLinkIndex");
  const datenschutzSection = document.getElementById("datenschutz");
  const datenschutzClose = document.getElementById("datenschutzClose");

  // Function to close any open section
  function closeAllSections() {
    if (impressumSection) impressumSection.style.display = "none";
    if (datenschutzSection) datenschutzSection.style.display = "none";
    document.body.style.overflow = "";
  }

  // Language switching function
  function switchLanguage(sectionId, lang) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Hide all language contents
    const allContents = section.querySelectorAll(".lang-content");
    allContents.forEach(content => {
      content.style.display = "none";
    });

    // Show selected language content
    const selectedContent = section.querySelector(`.lang-content[data-lang="${lang}"]`);
    if (selectedContent) {
      selectedContent.style.display = "block";
    }

    // Update active button
    const buttons = section.querySelectorAll(`.lang-btn[data-section="${sectionId}"]`);
    buttons.forEach(btn => {
      if (btn.dataset.lang === lang) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });
  }

  // Language button handlers
  document.querySelectorAll(".lang-btn").forEach(btn => {
    btn.addEventListener("click", function() {
      const lang = this.dataset.lang;
      const section = this.dataset.section;
      switchLanguage(section, lang);
    });
  });

  // Impressum link handler
  if (impressumLink && impressumSection) {
    impressumLink.addEventListener("click", function (e) {
      e.preventDefault();
      closeAllSections();
      impressumSection.style.display = "flex";
      document.body.style.overflow = "hidden";
      // Reset to German on open
      switchLanguage("impressum", "de");
    });
  }

  // Datenschutz link handler
  if (datenschutzLink && datenschutzSection) {
    datenschutzLink.addEventListener("click", function (e) {
      e.preventDefault();
      closeAllSections();
      datenschutzSection.style.display = "flex";
      document.body.style.overflow = "hidden";
      // Reset to German on open
      switchLanguage("datenschutz", "de");
    });
  }

  // Close buttons
  if (impressumClose) {
    impressumClose.addEventListener("click", closeAllSections);
  }

  if (datenschutzClose) {
    datenschutzClose.addEventListener("click", closeAllSections);
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      closeAllSections();
    }
  });

  // Check for hash in URL
  if (window.location.hash === "#impressum" && impressumSection) {
    impressumSection.style.display = "flex";
    document.body.style.overflow = "hidden";
    switchLanguage("impressum", "de");
  } else if (window.location.hash === "#datenschutz" && datenschutzSection) {
    datenschutzSection.style.display = "flex";
    document.body.style.overflow = "hidden";
    switchLanguage("datenschutz", "de");
  }
});
