(() => {
  const screens = Array.from(document.querySelectorAll(".screen"));
  const progressLabel = document.getElementById("progress-label");
  const progressFill = document.getElementById("progress-fill");
  const answerNote = document.getElementById("answer-note");
  const playMessage = document.getElementById("play-message");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentScreen = 1;
  let selectedAnswer = "";
  let isTransitioning = false;

  function showScreen(screenNumber, immediate = false) {
    if (
      screenNumber < 1 ||
      screenNumber > screens.length ||
      (isTransitioning && !immediate)
    ) {
      return;
    }

    const previousScreen = screens[currentScreen - 1];
    const nextScreen = screens[screenNumber - 1];
    const shouldAnimate = !immediate && screenNumber !== currentScreen;

    currentScreen = screenNumber;

    if (shouldAnimate) {
      isTransitioning = true;
      document.querySelector(".screens").classList.add("is-transitioning");
      previousScreen.hidden = false;
      nextScreen.hidden = false;
      previousScreen.classList.remove("is-active", "is-entering");
      previousScreen.classList.add("is-leaving");
      nextScreen.classList.remove("is-leaving");
      nextScreen.classList.add("is-active", "is-entering");
    } else {
      document.querySelector(".screens").classList.remove("is-transitioning");
      screens.forEach((screen, index) => {
        const isCurrent = index + 1 === currentScreen;
        screen.hidden = !isCurrent;
        screen.classList.toggle("is-active", isCurrent);
        screen.classList.remove("is-entering", "is-leaving");
      });
    }

    screens.forEach((screen, index) => {
      screen.setAttribute("aria-hidden", String(index + 1 !== currentScreen));
    });

    progressLabel.textContent = `${currentScreen} / ${screens.length}`;
    progressFill.style.width = `${(currentScreen / screens.length) * 100}%`;
    document.querySelector(".progress").setAttribute(
      "aria-label",
      `Экран ${currentScreen} из ${screens.length}`
    );
    window.scrollTo({ top: 0, behavior: "auto" });

    if (shouldAnimate) {
      const transitionDuration = reducedMotion.matches ? 520 : 900;
      window.setTimeout(() => {
        previousScreen.hidden = true;
        previousScreen.classList.remove("is-leaving");
        nextScreen.classList.remove("is-entering");
        document.querySelector(".screens").classList.remove("is-transitioning");
        isTransitioning = false;
      }, transitionDuration);
    }
  }

  document.querySelectorAll("[data-go]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(Number(button.dataset.go));
    });
  });

  document.querySelectorAll("[data-back]").forEach((button) => {
    button.addEventListener("click", () => {
      showScreen(currentScreen - 1);
    });
  });

  document.querySelector(".brand").addEventListener("click", (event) => {
    event.preventDefault();
    showScreen(1);
  });

  document.querySelectorAll(".choice-button").forEach((button) => {
    button.addEventListener("click", () => {
      selectedAnswer = button.dataset.answer;
      document.querySelectorAll(".choice-button").forEach((choice) => {
        const isSelected = choice === button;
        choice.classList.toggle("is-selected", isSelected);
        choice.setAttribute("aria-pressed", String(isSelected));
      });
      answerNote.textContent = `Хорошо. Пусть сегодня будет ${selectedAnswer.toLowerCase()}.`;
    });
  });

  document.querySelectorAll(".gift-card").forEach((gift) => {
    gift.addEventListener("click", () => {
      const isOpen = gift.classList.toggle("is-open");
      gift.setAttribute("aria-expanded", String(isOpen));
    });
  });

  document.querySelectorAll(".play-action").forEach((action) => {
    action.addEventListener("click", () => {
      playMessage.textContent = action.dataset.message;

      if (reducedMotion.matches) {
        return;
      }

      const burst = document.createElement("span");
      burst.className = "heart-burst";
      burst.setAttribute("aria-hidden", "true");
      burst.textContent = action.dataset.message.includes("Обнимашки") ? "✦" : "♡";
      action.append(burst);
      window.setTimeout(() => burst.remove(), 800);
    });
  });

  showScreen(currentScreen, true);
})();