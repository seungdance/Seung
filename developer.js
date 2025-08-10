// Developer page functionality - Externalized from inline JavaScript

function changeLanguage(lang) {
  // 모든 언어 콘텐츠 숨기기
  document.querySelectorAll(".language-content").forEach((content) => {
    content.classList.remove("active");
  });

  // 모든 언어 버튼 비활성화
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // 선택된 언어 콘텐츠 표시
  document.getElementById(lang).classList.add("active");

  // 선택된 언어 버튼 활성화
  event.target.classList.add("active");

  // 현재 언어 표시 업데이트
  document.getElementById("current-lang").textContent = event.target.textContent;

  // HTML lang 속성 업데이트
  document.documentElement.lang = lang;

  // 드롭다운 닫기
  document.querySelector(".language-dropdown").classList.remove("show");
}

function toggleDropdown() {
  const dropdown = document.querySelector(".language-dropdown");
  dropdown.classList.toggle("show");
}

function contactUs(lang) {
  let message = "";

  if (lang === "ko") {
    message =
      "웹사이트 제작 문의를 위해 다음 연락처로 연락해 주세요:\n\n📧 Email: your-email@example.com\n📱 Phone: +49 XXX XXX XXX\n\n또는 소셜 미디어를 통해 연락해 주세요!";
  } else if (lang === "en") {
    message =
      "Please contact us at the following for website development inquiries:\n\n📧 Email: your-email@example.com\n📱 Phone: +49 XXX XXX XXX\n\nOr contact us through social media!";
  } else if (lang === "de") {
    message =
      "Bitte kontaktieren Sie uns unter folgenden Kontaktdaten für Website-Entwicklungsanfragen:\n\n📧 Email: your-email@example.com\n📱 Telefon: +49 XXX XXX XXX\n\nOder kontaktieren Sie uns über soziale Medien!";
  }

  alert(message);
}

// 페이지 로드 시 초기화
document.addEventListener("DOMContentLoaded", function () {
  // 언어 토글 버튼 이벤트
  const langToggleBtn = document.getElementById("lang-toggle-btn");
  if (langToggleBtn) {
    langToggleBtn.addEventListener("click", toggleDropdown);
  }

  // 언어 선택 이벤트
  document.querySelectorAll(".dropdown-item").forEach((item) => {
    item.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      changeLanguage(lang);
    });
  });

  // 연락처 버튼 이벤트
  document.querySelectorAll(".contact-button").forEach((button) => {
    button.addEventListener("click", function () {
      const lang = this.getAttribute("data-lang");
      contactUs(lang);
    });
  });

  // 기본 언어 설정
  changeLanguage("en");

  // 드롭다운 외부 클릭 시 닫기
  document.addEventListener("click", function (event) {
    const languageToggle = document.querySelector(".language-toggle");
    const dropdown = document.querySelector(".language-dropdown");

    if (!languageToggle.contains(event.target)) {
      dropdown.classList.remove("show");
    }
  });
});
