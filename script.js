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
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

// 스와이프 감지 변수
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
let minSwipeDistance = 50; // 최소 스와이프 거리

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
    document.addEventListener(
      "touchstart",
      function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      },
      { passive: true }
    );

    document.addEventListener(
      "touchend",
      function (e) {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;

        // 스와이프 감지 및 속도 조절
        handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
      },
      { passive: true }
    );
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
    animationId = requestAnimationFrame(animateConveyor);
  }
}

// 스와이프 감지 및 속도 조절
function handleSwipe(startX, startY, endX, endY) {
  const deltaX = endX - startX;
  const deltaY = endY - startY;
  const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

  // 최소 스와이프 거리 확인
  if (distance < minSwipeDistance) return;

  // 수직 스와이프 감지 (위/아래)
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    if (deltaY > 0) {
      // 아래로 스와이프 - 속도 증가
      boostSpeed(2.5); // 2.5배 속도
    } else {
      // 위로 스와이프 - 속도 감소
      boostSpeed(0.5); // 0.5배 속도
    }
  }
  // 수평 스와이프 감지 (좌/우)
  else if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      // 오른쪽으로 스와이프 - 속도 증가
      boostSpeed(2.0); // 2.0배 속도
    } else {
      // 왼쪽으로 스와이프 - 속도 증가
      boostSpeed(2.0); // 2.0배 속도
    }
  }
}

// 속도 부스트 함수
function boostSpeed(multiplier) {
  // 기존 타이머 클리어
  if (speedDecayTimer) {
    clearTimeout(speedDecayTimer);
  }

  // 속도 부스트 적용
  speedBoost = multiplier;
  currentSpeed = baseSpeed * speedBoost;

  // 3초 후 점진적으로 원래 속도로 복원
  speedDecayTimer = setTimeout(() => {
    speedBoost = 1;
    currentSpeed = baseSpeed;
  }, 3000);
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

// Typing animation (더 인상적인 문구)
const codeLines = ["I'm a Web Developer Seung! Nice to meet you!"];
const typingTarget = document.getElementById("typing-code");
const screenFrame = document.querySelector(".screen-frame");
const screenBody = document.querySelector(".screen-body");
if (typingTarget) {
  let line = 0,
    char = 0;
  function typeCode() {
    if (line < codeLines.length) {
      if (char <= codeLines[line].length) {
        typingTarget.textContent = codeLines.slice(0, line).join("\n") + (line > 0 ? "\n" : "") + codeLines[line].slice(0, char);
        char++;
        setTimeout(typeCode, 40);
      } else {
        char = 0;
        line++;
        setTimeout(typeCode, 700);
      }
    } else {
      // 무한 반복: 타이핑 완료 후 잠시 대기 후 다시 시작
      setTimeout(() => {
        line = 0;
        char = 0;
        setTimeout(typeCode, 1000);
      }, 2000);
    }
  }
  typeCode();
}
