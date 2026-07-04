/**
 * Interactive HTML Code Generator — EaseMotion CSS
 * GSSoC Issue #35327
 *
 * Modular playground logic: state → classes → preview + formatted HTML.
 */

(function () {
  "use strict";

  /** @type {Record<string, string>} */
  const VARIANT_CLASS = {
    primary: "ease-btn-primary",
    secondary: "ease-btn-secondary",
    outline: "ease-btn-outline",
    ghost: "ease-btn-ghost",
  };

  /** @type {Record<string, string>} */
  const SIZE_CLASS = {
    sm: "ease-btn-sm",
    md: "",
    lg: "ease-btn-lg",
  };

  /** @type {Record<string, string>} */
  const HOVER_CLASS = {
    none: "",
    lift: "ease-hover-lift",
    scale: "ease-hover-scale",
    glow: "ease-hover-glow",
    rotate: "ease-hover-rotate",
  };

  /** @type {Record<string, string>} */
  const ENTRANCE_CLASS = {
    none: "",
    "fade-in": "ease-fade-in",
    "slide-up": "ease-slide-up",
    "zoom-in": "ease-zoom-in",
  };

  /** @type {Record<string, string>} */
  const DELAY_CLASS = {
    none: "",
    100: "ease-delay-100",
    200: "ease-delay-200",
    300: "ease-delay-300",
    500: "ease-delay-500",
  };

  const DEFAULT_STATE = {
    component: "button",
    variant: "primary",
    size: "md",
    hover: "none",
    animation: "none",
    delay: "none",
    loading: false,
    disabled: false,
  };

  /** @type {typeof DEFAULT_STATE} */
  let state = { ...DEFAULT_STATE };

  const form = document.getElementById("config-form");
  const previewRoot = document.getElementById("preview-root");
  const codeOutput = document.getElementById("code-output");
  const buttonOptions = document.getElementById("button-options");
  const copyBtn = document.getElementById("copy-btn");
  const downloadBtn = document.getElementById("download-btn");
  const resetBtn = document.getElementById("reset-btn");

  const COPY_LABEL = "Copy HTML";
  const COPIED_LABEL = "Copied!";
  let copyResetTimer = null;

  /**
   * Merge partial updates into the shared state object.
   * @param {Partial<typeof DEFAULT_STATE>} patch
   */
  function updateState(patch) {
    state = { ...state, ...patch };
    renderAll();
  }

  /**
   * Read current form values into state.
   */
  function syncStateFromForm() {
    if (!form) return;

    const formData = new FormData(form);

    updateState({
      component: formData.get("component") === "card" ? "card" : "button",
      variant: String(formData.get("variant") || DEFAULT_STATE.variant),
      size: String(formData.get("size") || DEFAULT_STATE.size),
      hover: String(formData.get("hover") || DEFAULT_STATE.hover),
      animation: String(formData.get("animation") || DEFAULT_STATE.animation),
      delay: String(formData.get("delay") || DEFAULT_STATE.delay),
      loading: formData.get("loading") === "on",
      disabled: formData.get("disabled") === "on",
    });
  }

  /**
   * Build shared motion classes for button and card.
   * @returns {string[]}
   */
  function getMotionClasses() {
    return [
      HOVER_CLASS[state.hover],
      ENTRANCE_CLASS[state.animation],
      DELAY_CLASS[state.delay],
    ].filter(Boolean);
  }

  /**
   * Generate EaseMotion class list for the active component.
   * @returns {string[]}
   */
  function generateClasses() {
    if (state.component === "card") {
      return ["ease-card", "ease-card-shadow", ...getMotionClasses()];
    }

    const classes = [
      "ease-btn",
      VARIANT_CLASS[state.variant],
      SIZE_CLASS[state.size],
      ...getMotionClasses(),
    ];

    if (state.loading) classes.push("ease-btn-loading");
    if (state.disabled) classes.push("ease-btn-disabled");

    return classes.filter(Boolean);
  }

  /**
   * @param {string[]} classes
   * @returns {string}
   */
  function formatClassAttribute(classes) {
    return classes.join(" ");
  }

  /**
   * @param {number} depth
   * @returns {string}
   */
  function indent(depth) {
    return "    ".repeat(depth);
  }

  /**
   * Build formatted HTML string from current state.
   * @returns {string}
   */
  function generateHTML() {
    const classAttr = formatClassAttribute(generateClasses());

    if (state.component === "card") {
      return [
        `<div class="${classAttr}">`,
        `${indent(1)}<h3>Generated Component</h3>`,
        `${indent(1)}<p>This HTML was generated automatically.</p>`,
        `</div>`,
      ].join("\n");
    }

    const attrs = [`class="${classAttr}"`];

    if (state.disabled) {
      attrs.push('disabled aria-disabled="true"');
    }

    if (state.loading) {
      attrs.push('aria-busy="true"');
    }

    return `<button ${attrs.join(" ")}>\n${indent(1)}Click Me\n</button>`;
  }

  /**
   * Replay entrance animation after preview updates.
   * @param {HTMLElement} element
   */
  function replayEntranceAnimation(element) {
    const animationClass = ENTRANCE_CLASS[state.animation];
    if (!animationClass) return;

    element.classList.remove(animationClass);
    void element.offsetWidth;
    element.classList.add(animationClass);
  }

  /**
   * Render the live preview in the center panel.
   */
  function renderPreview() {
    if (!previewRoot) return;

    previewRoot.replaceChildren();

    if (state.component === "card") {
      const card = document.createElement("div");
      card.className = formatClassAttribute(generateClasses());

      const heading = document.createElement("h3");
      heading.textContent = "Generated Component";

      const paragraph = document.createElement("p");
      paragraph.textContent = "This HTML was generated automatically.";

      card.append(heading, paragraph);
      previewRoot.append(card);
      replayEntranceAnimation(card);
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = formatClassAttribute(generateClasses());
    button.textContent = "Click Me";

    if (state.disabled) {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    }

    if (state.loading) {
      button.setAttribute("aria-busy", "true");
    }

    previewRoot.append(button);
    replayEntranceAnimation(button);
  }

  /**
   * Update generated code panel.
   */
  function updateCode() {
    if (!codeOutput) return;
    codeOutput.textContent = generateHTML();
  }

  /**
   * Toggle button-only controls when card is selected.
   */
  function syncButtonOptionsVisibility() {
    if (!buttonOptions) return;

    const isButton = state.component === "button";
    buttonOptions.classList.toggle("is-hidden", !isButton);
    buttonOptions.setAttribute("aria-hidden", String(!isButton));
  }

  /**
   * Re-render preview, code, and dependent UI.
   */
  function renderAll() {
    syncButtonOptionsVisibility();
    renderPreview();
    updateCode();
  }

  /**
   * Copy generated HTML to clipboard.
   */
  async function copyCode() {
    const html = generateHTML();

    try {
      await navigator.clipboard.writeText(html);
      showCopyFeedback(true);
    } catch {
      showCopyFeedback(false);
    }
  }

  /**
   * @param {boolean} success
   */
  function showCopyFeedback(success) {
    if (!copyBtn) return;

    if (copyResetTimer) {
      window.clearTimeout(copyResetTimer);
    }

    copyBtn.textContent = success ? COPIED_LABEL : "Copy failed";
    copyResetTimer = window.setTimeout(() => {
      copyBtn.textContent = COPY_LABEL;
    }, 2000);
  }

  /**
   * Download generated HTML as component.html.
   */
  function downloadHTML() {
    const html = [
      "<!DOCTYPE html>",
      '<html lang="en">',
      "<head>",
      '  <meta charset="UTF-8" />',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0" />',
      "  <title>Generated Component</title>",
      '  <link rel="stylesheet" href="easemotion.css" />',
      "</head>",
      "<body>",
      `  ${generateHTML().replace(/\n/g, "\n  ")}`,
      "</body>",
      "</html>",
    ].join("\n");

    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "component.html";
    link.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Reset all controls and state to defaults.
   */
  function resetControls() {
    if (!form) return;

    form.reset();

    const componentInput = form.querySelector('input[name="component"][value="button"]');
    const sizeInput = form.querySelector('#size option[value="md"]');

    if (componentInput instanceof HTMLInputElement) {
      componentInput.checked = true;
    }

    if (sizeInput instanceof HTMLOptionElement) {
      sizeInput.selected = true;
    }

    state = { ...DEFAULT_STATE };
    renderAll();
  }

  /**
   * Wire form and toolbar events.
   */
  function bindEvents() {
    if (form) {
      form.addEventListener("input", syncStateFromForm);
      form.addEventListener("change", syncStateFromForm);
    }

    copyBtn?.addEventListener("click", copyCode);
    downloadBtn?.addEventListener("click", downloadHTML);
    resetBtn?.addEventListener("click", resetControls);
  }

  /**
   * Boot the playground.
   */
  function init() {
    bindEvents();
    renderAll();
  }

  init();
})();
