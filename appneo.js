// appneo.js
// futaba.htm の「お絵かきする」ボタンから、このワークスペースの neo/dist を使って
// PaintBBS NEO をページ内起動するための補助スクリプトです。
(() => {
  "use strict";

  const APPNEO_ID = "appneo-root";
  const DEFAULT_APPLET_WIDTH = 400;
  const DEFAULT_APPLET_HEIGHT = 460;
  const DEFAULT_CANVAS_SIZE = 300;

  const state = {
    loading: null,
  };

  const getScriptBase = () => {
    const script = document.currentScript || [...document.scripts].find((s) => {
      return s.src && /(?:^|\/)appneo\.js(?:[?#].*)?$/.test(s.src);
    });

    if (script && script.src) {
      return new URL(".", script.src).href;
    }

    return new URL("./", location.href).href;
  };

  const APP_BASE = window.APPNEO_BASE || getScriptBase();
  const NEO_BASE = new URL("neo/dist/", APP_BASE).href;

  const toNumber = (value, fallback) => {
    const number = parseInt(value, 10);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  };

  const findOekakiButton = () => {
    const controls = [...document.querySelectorAll("input, button")];
    return controls.find((control) => {
      const label = control.value || control.textContent || "";
      return /お絵(?:か|描)きする/.test(label);
    });
  };

  const findSizeInputs = (button) => {
    const inputs = [...document.querySelectorAll("input")];
    const numberLikes = inputs.filter((input) => {
      const value = input.value || input.getAttribute("value") || "";
      return /^\d{2,4}$/.test(value);
    });

    const nearButton = button
      ? numberLikes
          .map((input) => ({
            input,
            distance: Math.abs(
              input.getBoundingClientRect().top - button.getBoundingClientRect().top,
            ),
          }))
          .sort((a, b) => a.distance - b.distance)
          .map((item) => item.input)
      : numberLikes;

    return {
      canvasWidth: nearButton[0],
      canvasHeight: nearButton[1],
    };
  };

  const getSizes = (button) => {
    const { canvasWidth, canvasHeight } = findSizeInputs(button);
    const width = toNumber(canvasWidth && canvasWidth.value, DEFAULT_CANVAS_SIZE);
    const height = toNumber(canvasHeight && canvasHeight.value, DEFAULT_CANVAS_SIZE);

    return {
      appletWidth: Math.max(width + 100, DEFAULT_APPLET_WIDTH),
      appletHeight: Math.max(height + 160, DEFAULT_APPLET_HEIGHT),
      canvasWidth: width,
      canvasHeight: height,
    };
  };

  const loadStyle = (href) => {
    const existing = [...document.styleSheets].some((sheet) => sheet.href === href);
    if (existing) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  };

  const loadScript = (src) => {
    if (window.Neo) return Promise.resolve();

    const existing = [...document.scripts].find((script) => script.src === src);
    if (existing) {
      return new Promise((resolve, reject) => {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
      });
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.charset = "UTF-8";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const ensureNeo = () => {
    if (!state.loading) {
      state.loading = Promise.all([
        loadStyle(new URL("neo.css", NEO_BASE).href),
        loadScript(new URL("neo.js", NEO_BASE).href),
      ]);
    }
    return state.loading;
  };

  const removeCurrentNeo = () => {
    const oldRoot = document.getElementById(APPNEO_ID);
    if (oldRoot) oldRoot.remove();

    const oldNeo = document.getElementById("NEO");
    if (oldNeo) oldNeo.remove();

    if (window.Neo) {
      Neo.painter = null;
      Neo.container = null;
      Neo.canvas = null;
      Neo.toolsWrapper = null;
      Neo.tools = null;
      Neo.center = null;
      Neo.applet = null;
      Neo.viewer = false;
      Neo.colorTips = [];
      Neo.toolTips = [];
      Neo.toolButtons = [];
      Neo.reserveControls = [];
    }
  };

  const createApplet = (sizes) => {
    const root = document.createElement("section");
    root.id = APPNEO_ID;
    root.style.margin = "12px auto";
    root.style.width = "fit-content";

    root.innerHTML = `
      <div id="appneo-appletdummy">
        <applet-dummy name="paintbbs" width="${sizes.appletWidth}" height="${sizes.appletHeight}">
          <param name="image_width" value="${sizes.canvasWidth}">
          <param name="image_height" value="${sizes.canvasHeight}">
          <param name="thumbnail_type" value="animation">
          <param name="neo_show_right_button" value="true">
          <param name="neo_disable_grid_touch_move" value="true">
          <param name="neo_disable_turn_original_glitch" value="true">
          <param name="neo_enable_zoom_out" value="true">
          <param name="neo_emulation_mode" value="2.04">
        </applet-dummy>
      </div>
    `;

    return root;
  };

  const startNeo = async (button) => {
    const sizes = getSizes(button);

    await ensureNeo();
    removeCurrentNeo();

    const root = createApplet(sizes);
    const anchor = button ? button.closest("form, table, center") : null;
    if (anchor) {
      anchor.insertAdjacentElement("afterend", root);
    } else {
      document.body.insertBefore(root, document.body.firstChild);
    }

    if (window.Neo && Neo.init()) {
      Neo.start();
      root.scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      root.textContent = "PaintBBS NEO の起動に失敗しました。";
    }
  };

  const bind = () => {
    if (!/^https:\/\/www\.2chan\.net\/[^/?#]+\/(?:futaba|\d+)\.htm$/.test(location.href)) {
      return;
    }

    const button = findOekakiButton();
    if (!button || button.dataset.appneoBound === "true") return;

    button.dataset.appneoBound = "true";
    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        startNeo(button).catch((error) => {
          console.error(error);
          alert("PaintBBS NEO の読み込みに失敗しました。\n" + error);
        });
      },
      true,
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
