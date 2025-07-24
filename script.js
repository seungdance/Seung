// Advanced Interactive Dual Portfolio with Reactive Animations

const container = document.querySelector(".split-container");
const sections = Array.from(container.querySelectorAll(".section"));

let sectionHeight = window.innerHeight;
let y1 = 0;
let y2 = sectionHeight;
let lastTimestamp = null;
const speed = 100; // px/sec

function setSectionPositions() {
  sectionHeight = window.innerHeight;
  container.style.height = sectionHeight * 2 + "px";
  sections[0].style.height = sectionHeight + "px";
  sections[1].style.height = sectionHeight + "px";
  // 두 섹션의 시작 위치
  y1 = 0;
  y2 = sectionHeight;
  sections[0].style.top = y1 + "px";
  sections[1].style.top = y2 + "px";
  container.style.transform = "translateY(0px)";
}

function animateConveyor(timestamp) {
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

  requestAnimationFrame(animateConveyor);
}

setSectionPositions();
window.addEventListener("resize", () => {
  setSectionPositions();
});
requestAnimationFrame(animateConveyor);

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
      // 모든 텍스트가 다 나오면 모니터 크기를 텍스트에 맞게 늘림
      setTimeout(() => {
        if (screenFrame && screenBody && typingTarget) {
          // 텍스트 높이 측정
          typingTarget.style.height = "auto";
          screenBody.style.height = "auto";
          screenFrame.style.height = "auto";
          // 최소 높이 보장
          const minH = 140;
          const codeH = typingTarget.scrollHeight + 36; // header 포함
          if (codeH > minH) {
            screenFrame.style.height = codeH + "px";
            screenBody.style.height = codeH - 28 + "px";
          }
        }
      }, 200);
      // 무한 반복: 크기 원복 후 다시 시작
      setTimeout(() => {
        if (screenFrame && screenBody) {
          screenFrame.style.height = "";
          screenBody.style.height = "";
        }
        line = 0;
        char = 0;
        setTimeout(typeCode, 1000);
      }, 2000);
    }
  }
  typeCode();
}
