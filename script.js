// Advanced Interactive Dual Portfolio with Reactive Animations

const container = document.querySelector(".split-container");
const sections = Array.from(container.querySelectorAll(".section"));

let sectionHeight = window.innerHeight;
let y1 = 0;
let y2 = sectionHeight;
let lastTimestamp = null;
const speed = 100; // px/sec
let isPaused = false;
let animationId = null;
let pauseStartTime = 0;
let pausedY1 = 0;
let pausedY2 = 0;

function setSectionPositions() {
  sectionHeight = window.innerHeight;
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

  y1 -= speed * delta;
  y2 -= speed * delta;

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

// DOM 로드 완료 후 초기화
document.addEventListener("DOMContentLoaded", function () {
  setSectionPositions();

  // 버튼 호버 이벤트 추가
  const buttons = document.querySelectorAll(".enter-btn");
  buttons.forEach((button) => {
    button.addEventListener("mouseenter", pauseAnimation);
    button.addEventListener("mouseleave", startAnimation);
  });

  // 애니메이션 시작
  startAnimation();
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

    if (!animationId) {
      animationId = requestAnimationFrame(animateConveyor);
    }
  }
}

// 애니메이션 일시정지
function pauseAnimation() {
  if (!isPaused) {
    isPaused = true;
    // 현재 위치 저장
    pausedY1 = y1;
    pausedY2 = y2;
    document.body.classList.add("paused");
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
