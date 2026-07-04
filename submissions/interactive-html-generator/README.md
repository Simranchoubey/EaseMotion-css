# Interactive HTML Code Generator

An interactive documentation playground for **EaseMotion CSS** that lets you configure Button and Card components visually and instantly generate copy-ready HTML markup.

Built for GSSoC Issue **#35327**.

## Project overview

This tool is a self-contained, zero-build-step playground. Adjust component options in the left panel, watch the live preview update in the center, and copy or download the generated HTML from the right panel.

Everything lives inside `submissions/interactive-html-generator/` and does **not** modify any core EaseMotion CSS library files.

## Folder structure

```
submissions/interactive-html-generator/
├── demo.html      # Playground markup and layout
├── style.css      # Documentation-style playground UI
├── script.js      # State, preview, and code generation logic
└── README.md      # Project documentation
```

## Features

- **Component selector** — Button or Card
- **Button options** — variant, size, loading, and disabled states
- **Motion controls** — hover animation, entrance animation, and delay
- **Live preview** — updates instantly on every change
- **Generated HTML** — formatted output inside `<pre><code>`
- **Copy HTML** — uses `navigator.clipboard.writeText()` with temporary “Copied!” feedback
- **Reset** — restores all options to defaults
- **Download** — saves `component.html` via `Blob` and `URL.createObjectURL()`
- **Responsive layout** — 3 columns on desktop, 2 on tablet, 1 on mobile
- **Accessible UI** — semantic HTML, labels, focus styles, and ARIA attributes

## Screenshots

<!-- Replace with actual screenshots after opening demo.html -->

| Desktop | Tablet | Mobile |
|---------|--------|--------|
| _Screenshot placeholder_ | _Screenshot placeholder_ | _Screenshot placeholder_ |

## How to run

No install step or build tool is required.

1. Open `submissions/interactive-html-generator/demo.html` in a modern browser.
2. Use the configuration panel to customize the component.
3. Copy or download the generated HTML.

The demo loads EaseMotion CSS from the repository root:

```html
<link rel="stylesheet" href="../../../easemotion.css" />
```

## Technologies used

- HTML5
- CSS3 (CSS Grid, custom properties, responsive design)
- Vanilla JavaScript (ES modules pattern avoided — single IIFE for direct `<script>` use)

## Example output

**Button**

```html
<button class="ease-btn ease-btn-primary ease-btn-lg ease-hover-lift ease-fade-in ease-delay-200">
    Click Me
</button>
```

**Card**

```html
<div class="ease-card ease-card-shadow ease-hover-lift ease-fade-in">
    <h3>Generated Component</h3>
    <p>This HTML was generated automatically.</p>
</div>
```

## Future improvements

- Add more EaseMotion components (Badge, Alert, Input, Modal)
- Syntax highlighting for generated HTML
- Shareable URLs with encoded configuration state
- Import/export presets as JSON
- Dark mode toggle for the playground chrome
- Local storage to remember the last used configuration

## License

Part of the [EaseMotion CSS](https://github.com/SAPTARSHI-coder/EaseMotion-css) repository.
