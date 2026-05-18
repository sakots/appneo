// appneo.js
// Starts PaintBBS NEO from a futaba drawing page.
(() => {
  "use strict";

  const APPNEO_VERSION = "v0.1.3";

  const APPNEO_ID = "appneo-root";
  const DEFAULT_APPLET_WIDTH = 400;
  const DEFAULT_APPLET_HEIGHT = 460;
  const DEFAULT_CANVAS_SIZE = 300;

  const state = {
    loading: null,
    fitManager: null,
    paletteManager: null,
  };

  const DEFAULT_PALETTES = [
    "2.5R,FF406C,F13E67,E33C62,D53A5D,C73858,B93653,AB344E,9D3249,8F3044,812E3F,732C3A,652A35,572830,49262B",
    "5R,FF4455,F14152,E33E4F,D53B4C,C73849,B93546,AB3243,9D2F40,8F2C3D,81293A,732637,652334,572031,491D2E",
    "7.5R,FF4B33,F24832,E54531,D84230,CB3F2F,BE3C2E,B1392D,A4362C,97332B,8A302A,7D2D29,702A28,632727,562426",
    "10R,FF7C31,F27630,E5702F,D86A2E,CB642D,BE5E2C,B1582B,A4522A,974C29,8A4628,7D4027,703A26,633425,562E24",
    "2.5YR,FF8B2C,F3822A,E77928,DB7026,CF6724,C35E22,B75520,AB4C1E,9F431C,933A1A,873118,7B2816,6F1F14,631612",
    "5YR,FFAE2B,F1A42A,E39A29,D59028,C78627,B97C26,AB7225,9D6824,8F5E23,815422,734A21,654020,57361F,492C1E",
    "7.5YR,FFB73C,F1AD39,E3A336,D59933,C78F30,B9852D,AB7B2A,9D7127,8F6724,815D21,73531E,65491B,573F18,493515",
    "10YR,FFBD28,F1B326,E3A924,D59F22,C79520,B98B1E,AB811C,9D771A,8F6D18,816316,735914,654F12,574516,493B0E",
    "2.5Y,FFDE34,F1D131,E3C42E,D5B72B,C7AA28,B99D25,AB9022,9D831F,8F761C,816919,735C16,654F13,574216,49350D",
    "5Y,FFE51D,F1D81C,E3CB1B,D5BE1A,C7B119,B9A418,AB9717,9D8A16,8F7D15,817014,736313,655612,574911,493C16",
    "7.5Y,FEE90C,F0DC0C,E2CF0C,D4C20C,C6B50C,B8A80C,AA9B0C,9C8E0C,8E810C,80740C,72670C,645A0C,564D0C,48400C",
    "10Y,F2EC4A,E4DF46,D6D242,C8C53E,BAB83A,ACAB36,9E9E32,90912E,82842A,747726,666A22,585D1E,4A501A,3C4316",
    "2.5GY,E2F10D,D5E30D,C8D50D,BBC70D,AEB90D,A1AB0D,949D0D,878F0D,7A810D,6D730D,60650D,53570D,46490D,393B0D",
    "5GY,D0F629,C4E828,B8DA27,ACCC26,A0BE25,94B024,88A223,7C9422,708621,647820,586A1F,4C5C1E,404E1D,34401C",
    "7.5GY,A1FF2C,98F12B,8FE32A,86D529,7DC728,74B927,6BAB26,629D25,598F24,508123,477322,3E6521,355720,2C491F",
    "10GY,16FF29,16F128,16E327,16D526,16C725,16B924,16AB23,169D22,168F21,168120,16731F,16651E,16571D,16491C",
    "2.5G,54FF9B,50F193,4CE38B,48D583,44C77B,40B973,3CAB6B,389D63,348F5B,308153,2C734B,286543,24573B,204933",
    "5G,59FFBD,55F1B3,51E3A9,4DD59F,49C795,45B98B,41AB81,3D9D77,398F6D,358163,317359,2D654F,295745,25493B",
    "7.5G,48FFC9,45F1BE,42E3B3,3FD5A8,3CC79D,39B992,36AB87,339D7C,308F71,2D8166,2A735B,276550,245745,21493A",
    "10G,33FFD4,31F1C8,2FE3BC,2DD5B0,2BC7A4,29B998,27AB8C,259D80,238F74,218168,1F735C,1D6550,1B5744,194938",
    "2.5BG,0FFFDF,0FF1D3,0FE3C7,0FD5BB,0FC7AF,0FB9A3,0FAB97,0F9D8B,0F8F7F,0F8173,0F7367,0F655B,0F574F,0F4943",
    "5BG,5AFEE3,55F0D6,50E2C9,4BD4BC,46C6AF,41B8A2,3CAA95,379C88,328E7B,2D806E,287261,236454,1E5647,19483A",
    "7.5BG,4FFDF6,4BEFE8,47E1DA,43D3CC,3FC5BE,3BB7B0,37A9A2,339B94,2F8D86,2B7F78,27716A,23635C,1F554E,1B4740",
    "10BG,42DEE4,3FD2D8,3CC6CC,39BAC0,36AEB4,33A2A8,30969C,2D8A90,2A7E84,277278,24666C,215A60,1E4E54,1B4248",
    "2.5B,45DDEE,42D1E1,3FC5D4,3CB9C7,39ADBA,36A1AD,3395A0,308993,2D7D86,2A7179,27656C,24595F,214D52,1E4145",
    "5B,50DBF9,4CCFEB,48C3DD,44B7CF,40ABC1,3C9FB3,3893A5,348797,307B89,2C6F7B,28636D,24575F,204B51,1C3F43",
    "7.5B,60D8FF,5BCCF1,56C0E3,51B4D5,4CA8C7,479CB9,4290AB,3D849D,38788F,336C81,2E6073,295465,244857,1F3C49",
    "10B,35BBF4,33B1E7,31A7DA,2F9DCD,2D93C0,2B89B3,297FA6,277599,256B8C,23617F,215772,1F4D65,1D4358,1B394B",
    "2.5PB,5EB7F8,59ADEB,54A3DE,4F99D1,4A8FC4,4585B7,407BAA,3B719D,366790,315D83,2C5376,274969,223F5C,1D354F",
    "5PB,1798FB,1790EE,1788E1,1780D4,1778C7,1770BA,1768AD,1760A0,175893,175086,174879,17406C,17385F,173052",
    "7.5PB,486AFF,4565F1,4260E3,3F5BD5,3C56C7,3951B9,364CAB,33479D,30428F,2D3D81,2A3873,273365,242E57,212949",
    "10PB,8756FF,8152F1,7B4EE3,754AD5,6F46C7,6942B9,633EAB,5D3A9D,57368F,513281,4B2E73,452A65,3F2657,392249",
    "2.5P,B773FE,AE6DF0,A567E2,9C61D4,935BC6,8A55B8,814FAA,78499C,6F438E,663D80,5D3772,543164,4B2B56,422548",
    "5P,CF64FE,C45FF0,B95AE2,AE55D4,A350C6,984BB8,8D46AA,82419C,773C8E,6C3780,613272,562D64,4B2856,402348",
    "7.5P,FD7CFF,EF76F1,E170E3,D36AD5,C564C7,B75EB9,A958AB,9B529D,8D4C8F,7F4681,714073,633A65,553457,472E49",
    "10P,FF58FF,F154F1,E350E3,D54CD5,C748C7,B944B9,AB40AB,9D3C9D,8F388F,813481,733073,652C65,572857,492449",
    "2.5RP,FF5BE0,F157D4,E353C8,D54FBC,C74BB0,B947A4,AB4398,9D3F8C,8F3B80,813774,733368,652F5C,572B50,492744",
    "5RP,FF64C0,F15FB6,E35AAC,D555A2,C75098,B94B8E,AB4684,9D417A,8F3C70,813766,73325C,652D52,572848,49233E",
    "7.5RP,FF6FAC,F16AA3,E3659A,D56091,C75B88,B9567F,AB5176,9D4C6D,8F4764,81425B,733D52,653849,573340,492E37",
    "10RP,FF6E97,F16990,E36489,D55F82,C75A7B,B95574,AB506D,9D4B66,8F465F,814158,733C51,65374A,573243,492D3C",
    "N,FFFFFF,EFEFEF,DFDFDF,CFCFCF,BFBFBF,AFAFAF,9F9F9F,8F8F8F,7F7F7F,6F6F6F,5F5F5F,4F4F4F,3F3F3F,2F2F2F",
    "Default,000000,FFFFFF,B47575,888888,FA9696,C096C0,FFB6FF,8080FF,25C7C9,E7E58D,E7962D,99CB7B,FCECE2,F9DDCF",
  ];

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
  const NEO_BASES = window.APPNEO_NEO_BASE
    ? [window.APPNEO_NEO_BASE]
    : [
        new URL("neo/dist/", APP_BASE).href,
        new URL("dist/", APP_BASE).href,
        APP_BASE,
      ];

  const toNumber = (value, fallback) => {
    const number = parseInt(value, 10);
    return Number.isFinite(number) && number > 0 ? number : fallback;
  };

  const findOekakiButton = () => {
    const controls = [...document.querySelectorAll("input, button, a")];
    return controls.find((control) => {
      const label = control.value || control.textContent || control.title || "";
      return /\u304a\u7d75(?:\u304b|\u63cf)\u304d\u3059\u308b/.test(label);
    });
  };

  const setOekakiButtonLabel = (button) => {
    if (!button) return;

    const label = "お絵かきする(APPNEO)";
    if ("value" in button) {
      button.value = label;
    } else {
      button.textContent = label;
    }
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

  const getBoardUrl = (filename, query = "") => {
    return filename + query;
  };

  const parsePaletteName = (entry, index) => {
    const match = String(entry).match(/^\s*([^,\n]+)/);
    return match ? match[1].trim() : `Palette ${index + 1}`;
  };

  const formatColors = (source) => {
    return (String(source).match(/#?[0-9a-fA-F]{6}\b/g) || [])
      .slice(0, 14)
      .map((color) => "#" + color.replace("#", "").toUpperCase())
      .join("\n");
  };

  const hex = (value) => {
    const number = Math.max(0, Math.min(255, parseInt(value, 10) || 0));
    return number.toString(16).padStart(2, "0").toUpperCase();
  };

  const getBright = (color) => {
    const r = parseInt(color.substring(1, 3), 16);
    const g = parseInt(color.substring(3, 5), 16);
    const b = parseInt(color.substring(5, 7), 16);
    return Math.max(r, g, b) < 128 ? "#FFFFFF" : "#000000";
  };

  const createOptions = (count, selectedIndex = -1) => {
    return Array.from({ length: count }, (_, index) => {
      return `<option${index === selectedIndex ? " selected" : ""}>${index + 1}</option>`;
    }).join("");
  };

  class AppNeoFitManager {
    constructor(sizes) {
      this.originalWidth = sizes.appletWidth;
      this.originalHeight = sizes.appletHeight;
      this.isExpanded = false;
      this.bindGlobals();
    }

    bindGlobals() {
      window.appFit = (mode) => {
        if (mode) this.compress();
        else this.expand();
      };
    }

    refreshTargets() {
      this.target = document.getElementById("neo-pageView");
      this.neoContainer = document.getElementById("neo-container");
      this.palette = document.getElementById("appneo-dyntools");
      this.fitExp = document.getElementById("appneo-fit-exp");
      this.fitComp = document.getElementById("appneo-fit-comp");
    }

    getClientWidth() {
      const client = document.compatMode && document.compatMode !== "BackCompat"
        ? document.documentElement
        : document.body;
      return client.clientWidth || window.innerWidth;
    }

    getClientHeight() {
      const client = document.compatMode && document.compatMode !== "BackCompat"
        ? document.documentElement
        : document.body;
      return client.clientHeight - 10;
    }

    getExpandedWidth() {
      this.refreshTargets();
      const paletteWidth = this.palette ? this.palette.getBoundingClientRect().width : 0;
      const availableWidth = this.getClientWidth() - paletteWidth - 48;
      return Math.max(this.originalWidth, Math.floor(availableWidth));
    }

    setAppletSize(width, height) {
      this.refreshTargets();
      const appletWidth = parseInt(width, 10);
      const appletHeight = parseInt(height, 10);

      if (window.Neo && Neo.config) {
        Neo.config.applet_width = appletWidth;
        Neo.config.applet_height = appletHeight;
      }

      if (this.target) {
        this.target.style.width = `${appletWidth}px`;
        this.target.style.height = `${appletHeight}px`;
      }

      if (this.neoContainer) {
        this.neoContainer.style.width = `${appletWidth}px`;
        this.neoContainer.style.height = `${appletHeight}px`;
      }
    }

    resetZoom() {
      if (window.Neo && Neo.painter) {
        Neo.painter.setZoom(1);
        Neo.resizeCanvas();
        Neo.painter.updateDestCanvas();
      }
    }

    expand() {
      if (this.isExpanded) return;

      const width = this.getExpandedWidth();
      const height = Math.max(this.originalHeight, this.getClientHeight());
      this.setAppletSize(width, height);

      if (this.fitExp) this.fitExp.style.display = "none";
      if (this.fitComp) this.fitComp.style.display = "block";
      this.isExpanded = true;
      this.resetZoom();
    }

    compress() {
      if (!this.isExpanded) return;

      this.setAppletSize(this.originalWidth, this.originalHeight);
      if (this.fitExp) this.fitExp.style.display = "block";
      if (this.fitComp) this.fitComp.style.display = "none";
      this.isExpanded = false;
      this.resetZoom();
    }
  }

  class AppNeoPaletteManager {
    constructor() {
      this.DynamicColor = 1;
      this.customP = 0;
      this.entries = DEFAULT_PALETTES.map((entry, index) => ({
        name: parsePaletteName(entry, index),
        colors: formatColors(entry),
      }));
      this.Palettes = [""].concat(this.entries.map((entry) => entry.colors));
      this.bindGlobals();
      this.syncOptions();
      this.PaletteListSetColor();
    }

    bindGlobals() {
      window.setPalette = this.setPalette.bind(this);
      window.PaletteSave = this.PaletteSave.bind(this);
      window.PaletteNew = this.PaletteNew.bind(this);
      window.PaletteRenew = this.PaletteRenew.bind(this);
      window.PaletteDel = this.PaletteDel.bind(this);
      window.P_Effect = this.P_Effect.bind(this);
      window.PaletteMatrixGet = this.PaletteMatrixGet.bind(this);
      window.PaletteMatrixSet = this.PaletteMatrixSet.bind(this);
      window.PaletteMatrixHelp = this.PaletteMatrixHelp.bind(this);
      window.GetPalette = this.GetPalette.bind(this);
      window.ChangeGrad = this.ChangeGrad.bind(this);
      window.Change_ = this.Change_.bind(this);
    }

    get select() {
      return document.Palette && document.Palette.select;
    }

    syncOptions() {
      const select = this.select;
      if (!select) return;

      while (select.options.length > 1) select.options[1] = null;
      this.entries.forEach((entry) => {
        select.options[select.options.length] = new Option(entry.name);
      });
      select.size = Math.min(select.options.length, 30);
    }

    async setPalette() {
      const select = this.select;
      if (!document.paintbbs || !select) return;

      const colors = this.Palettes[select.selectedIndex];
      if (colors) document.paintbbs.setColors(colors);
      await this.GetPalette();
    }

    async PaletteSave() {
      if (!document.paintbbs) return;
      this.Palettes[0] = String(await document.paintbbs.getColors());
      this.PaletteListSetColor();
    }

    async PaletteNew() {
      if (!document.paintbbs || !this.select) return;

      const colors = String(await document.paintbbs.getColors());
      const name = prompt("Palette name", "Palette " + ++this.customP);
      if (!name) {
        this.customP--;
        return;
      }

      this.Palettes.push(colors);
      this.select.options[this.select.length] = new Option(name);
      this.select.size = Math.min(this.select.length, 30);
      this.PaletteListSetColor();
    }

    async PaletteRenew() {
      if (!document.paintbbs || !this.select || this.select.selectedIndex < 0) return;
      this.Palettes[this.select.selectedIndex] = String(await document.paintbbs.getColors());
      this.PaletteListSetColor();
    }

    PaletteDel() {
      if (!this.select || this.select.selectedIndex <= 0) return;
      const index = this.select.selectedIndex;
      if (!confirm(this.select.options[index].text + " delete?")) return;
      this.select.options[index] = null;
      this.Palettes.splice(index, 1);
      this.select.size = Math.min(this.select.length, 30);
    }

    async P_Effect(value) {
      if (!document.paintbbs) return;

      const v = parseInt(value, 10);
      const invert = v === 255;
      const colors = String(await document.paintbbs.getColors()).split("\n");
      const next = colors.map((color) => {
        const r0 = parseInt(color.substring(1, 3), 16);
        const g0 = parseInt(color.substring(3, 5), 16);
        const b0 = parseInt(color.substring(5, 7), 16);
        const r = invert ? 255 - r0 : r0 + v;
        const g = invert ? 255 - g0 : g0 + v;
        const b = invert ? 255 - b0 : b0 + v;
        return `#${hex(r)}${hex(g)}${hex(b)}`;
      }).join("\n");

      document.paintbbs.setColors(next);
      this.PaletteListSetColor();
    }

    async PaletteMatrixGet() {
      if (!document.Palette) return;

      const mode = document.Palette.m_m.selectedIndex;
      const textarea = document.Palette.setr;
      if (mode === 1) {
        textarea.value = `!Palette\n${String(await document.paintbbs.getColors())}\n!Matrix`;
        return;
      }

      const select = this.select;
      const lines = [];
      for (let i = 0; i < this.Palettes.length; i++) {
        if (select.options[i] && this.Palettes[i]) {
          lines.push(`!${select.options[i].text}\n${this.Palettes[i]}`);
        }
      }
      textarea.value = `${lines.join("\n")}\n!Matrix`;
    }

    PaletteMatrixSet() {
      if (!document.Palette) return;

      const text = document.Palette.setr.value;
      const entries = text
        .split(/\n(?=!)/)
        .map((entry, index) => ({
          name: parsePaletteName(entry.replace(/^!/, ""), index),
          colors: formatColors(entry),
        }))
        .filter((entry) => entry.colors);

      if (!entries.length) {
        alert("No matrix data.");
        return;
      }

      if (document.Palette.m_m.selectedIndex === 1) {
        document.paintbbs.setColors(entries[0].colors);
        return;
      }

      if (document.Palette.m_m.selectedIndex !== 2) {
        this.Palettes = [this.Palettes[0] || ""];
        while (this.select.options.length > 1) this.select.options[1] = null;
      }

      entries.forEach((entry) => {
        if (entry.name === "Palette") {
          document.paintbbs.setColors(entry.colors);
        } else {
          this.Palettes.push(entry.colors);
          this.select.options[this.select.length] = new Option(entry.name);
        }
      });
      this.PaletteListSetColor();
    }

    PaletteMatrixHelp() {
      alert("PALETTE MATRIX\nPut !PaletteName followed by 14 #RRGGBB colors.\nGET exports palettes, SET imports them.");
    }

    async GetPalette() {
      if (!document.paintbbs || !document.grad) return;

      const colors = String(await document.paintbbs.getColors()).split("\n");
      const start = document.grad.p_st.selectedIndex;
      const end = document.grad.p_ed.selectedIndex;
      if (colors[start]) document.grad.pst.value = colors[start].substring(1);
      if (colors[end]) document.grad.ped.value = colors[end].substring(1);
      this.PaletteListSetColor();
    }

    Change_() {}

    ChangeGrad() {
      if (!document.grad || !document.paintbbs) return;

      const start = formatColors(document.grad.pst.value).split("\n")[0];
      const end = formatColors(document.grad.ped.value).split("\n")[0];
      if (!start || !end) return;

      const sr = parseInt(start.substring(1, 3), 16);
      const sg = parseInt(start.substring(3, 5), 16);
      const sb = parseInt(start.substring(5, 7), 16);
      const er = parseInt(end.substring(1, 3), 16);
      const eg = parseInt(end.substring(3, 5), 16);
      const eb = parseInt(end.substring(5, 7), 16);

      const colors = Array.from({ length: 14 }, (_, index) => {
        const ratio = index / 13;
        return `#${hex(sr + (er - sr) * ratio)}${hex(sg + (eg - sg) * ratio)}${hex(sb + (eb - sb) * ratio)}`;
      }).join("\n");

      document.paintbbs.setColors(colors);
      this.PaletteListSetColor();
    }

    PaletteListSetColor() {
      const select = this.select;
      if (!select) return;

      for (let i = 1; i < select.options.length; i++) {
        const colors = (this.Palettes[i] || "").split("\n");
        const background = colors[4] || colors.find(Boolean);
        if (!background) continue;
        select.options[i].style.background = background;
        select.options[i].style.color = getBright(background);
      }
    }
  }

  const loadStyle = (href) => {
    const existing = [...document.styleSheets].some((sheet) => sheet.href === href);
    if (existing) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = resolve;
      link.onerror = () => {
        link.remove();
        reject(new Error("Failed to load " + href));
      };
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
      script.onerror = () => {
        script.remove();
        reject(new Error("Failed to load " + src));
      };
      document.head.appendChild(script);
    });
  };

  const loadNeoFrom = async (base) => {
    await loadStyle(new URL("neo.css", base).href);
    await loadScript(new URL("neo.js", base).href);
    if (!window.Neo) throw new Error("Neo was not defined by " + base + "neo.js");
  };

  const ensureNeo = () => {
    if (!state.loading) {
      state.loading = (async () => {
        const errors = [];
        for (const base of NEO_BASES) {
          try {
            await loadNeoFrom(base);
            return;
          } catch (error) {
            errors.push(base + " : " + (error && error.message ? error.message : error));
          }
        }
        throw new Error("Could not load neo.js/neo.css.\n" + errors.join("\n"));
      })();
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

    state.fitManager = null;
    state.paletteManager = null;
  };

  const createPalettePanel = () => {
    return `
      <div class="appneo-palette" id="appneo-dyntools">
        <form name="Palette">
          <fieldset id="appneo-fit-exp">
            <legend>FIT!</legend>
            <input class="appneo-button" type="button" value="← FIT →" onclick="appFit(0)">
          </fieldset>
          <fieldset id="appneo-fit-comp" style="display:none;">
            <legend>FIT!</legend>
            <input class="appneo-button" type="button" value="→ FIT ←" onclick="appFit(1)">
          </fieldset>
          <fieldset>
            <legend>TOOL</legend>
            <input class="appneo-button" type="button" value="Left" onclick="Neo.setToolSide(true)">
            <input class="appneo-button" type="button" value="Right" onclick="Neo.setToolSide(false)">
            Stabilizer
            <select onchange="Neo.setStabilizeLevel(this.value)">
              <option value="0">0</option>
              <option value="1" selected>1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </fieldset>
          <fieldset>
            <legend>PALETTE</legend>
            <select class="appneo-select select-palette" name="select" size="13" onchange="setPalette()">
              <option>Temporary</option>
            </select><br>
            <input class="appneo-button" type="button" value="Save" onclick="PaletteSave()"><br>
            <input class="appneo-button" type="button" value="New" onclick="PaletteNew()">
            <input class="appneo-button" type="button" value="Update" onclick="PaletteRenew()">
            <input class="appneo-button" type="button" value="Delete" onclick="PaletteDel()"><br>
            <input class="appneo-button" type="button" value="Light+" onclick="P_Effect(10)">
            <input class="appneo-button" type="button" value="Light-" onclick="P_Effect(-10)">
            <input class="appneo-button" type="button" value="Invert" onclick="P_Effect(255)">
          </fieldset>
          <fieldset>
            <legend>MATRIX</legend>
            <select class="appneo-select" name="m_m">
              <option value="0">All</option>
              <option value="1">Current</option>
              <option value="2">Append</option>
            </select>
            <input type="button" class="appneo-button" value="GET" onclick="PaletteMatrixGet()">
            <input type="button" class="appneo-button" value="SET" onclick="PaletteMatrixSet()">
            <input type="button" class="appneo-button" value=" ? " onclick="PaletteMatrixHelp()"><br>
            <textarea class="appneo-textarea" name="setr" rows="2" cols="16" onmouseover="this.select()"></textarea>
          </fieldset>
        </form>
        <form name="grad">
          <fieldset>
            <legend>GRADATION</legend>
            <input type="button" class="appneo-button" value=" OK " onclick="ChangeGrad()">
            <br>
            <select class="appneo-select" name="p_st" onchange="GetPalette()">
              ${createOptions(14)}
            </select>
            <input class="appneo-text" type="text" name="pst" size="8" oninput="Change_()"><br>
            <select class="appneo-select" name="p_ed" onchange="GetPalette()">
              ${createOptions(14, 11)}
            </select>
            <input class="appneo-text" type="text" name="ped" size="8" oninput="Change_()">
          </fieldset>
        </form>
        <p class="appneo-credit">DynamicPalette &copy;NoraNeko</p>
      </div>
    `;
  };

  const createApplet = (sizes) => {
    const root = document.createElement("section");
    root.id = APPNEO_ID;
    root.style.margin = "12px auto";
    root.style.width = "fit-content";

    root.innerHTML = `
      <style>
        #${APPNEO_ID} .appneo-container {
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 12px;
        }
        #${APPNEO_ID} .appneo-stage {
          flex: 0 0 auto;
        }
        #${APPNEO_ID} .appneo-palette {
          flex: 0 0 auto;
          max-width: 190px;
          text-align: center;
          font-size: 12px;
        }
        #${APPNEO_ID} fieldset {
          margin: 0 0 6px;
          padding: 4px;
        }
        #${APPNEO_ID} .appneo-button {
          width: auto;
          min-width: 2.8em;
          margin: 1px;
          font-size: 12px;
        }
        #${APPNEO_ID} .appneo-select,
        #${APPNEO_ID} .appneo-text,
        #${APPNEO_ID} .appneo-textarea {
          max-width: 165px;
          font-size: 12px;
        }
        #${APPNEO_ID} .appneo-credit {
          margin: 4px 0 0;
          font-size: 11px;
        }
        #${APPNEO_ID} .select-palette {
          max-height: 300px;
          overflow-y: scroll;
        }
      </style>
      <p>appneo ${APPNEO_VERSION}</p>
      <div class="appneo-container">
        <div class="appneo-stage" id="appneo-appletdummy">
          <div id="appneo-status" style="margin:8px 0;color:#800;font-weight:bold;">Loading PaintBBS NEO...</div>
          <applet-dummy name="paintbbs" width="${sizes.appletWidth}" height="${sizes.appletHeight}">
            <param name="image_width" value="${sizes.canvasWidth}">
            <param name="image_height" value="${sizes.canvasHeight}">
            <param name="thumbnail_type" value="animation">
            <param name="neo_show_right_button" value="true">
            <param name="neo_disable_grid_touch_move" value="true">
            <param name="neo_disable_turn_original_glitch" value="true">
            <param name="neo_enable_zoom_out" value="true">
            <param name="neo_emulation_mode" value="2.04">
            <param name="url_save" value="${getBoardUrl("paintpost.php")}">
            <param name="url_exit" value="${getBoardUrl("futaba.php", "?mode=paintcom")}">
          </applet-dummy>
        </div>
        ${createPalettePanel()}
      </div>
    `;

    return root;
  };

  const setStatus = (message) => {
    const status = document.getElementById("appneo-status");
    if (status) status.textContent = message;
  };

  const startNeo = async (button, options = {}) => {
    const sizes = getSizes(button);
    removeCurrentNeo();

    const root = createApplet(sizes);
    const anchor = button ? button.closest("form, table, center") : null;
    if (anchor) {
      anchor.insertAdjacentElement("afterend", root);
    } else {
      document.body.insertBefore(root, document.body.firstChild);
    }

    setStatus("Loading PaintBBS NEO files...");
    await ensureNeo();
    setStatus("Initializing PaintBBS NEO...");

    if (window.Neo && Neo.init()) {
      Neo.start();
      state.fitManager = new AppNeoFitManager(sizes);
      state.paletteManager = new AppNeoPaletteManager();
      state.paletteManager.GetPalette();
      setStatus("");
      root.scrollIntoView({ block: "start", behavior: "smooth" });
    } else {
      setStatus("Failed to start PaintBBS NEO.");
    }
  };

  const bind = () => {
    window.appneoStart = () => startNeo(findOekakiButton());

    if (!/^https:\/\/.*\.2chan\.net\/[^/?#]+\/(?:futaba|\d+)\.htm(?:[?#].*)?$/.test(location.href)) {
      return;
    }

    const button = findOekakiButton();
    if (!button || button.dataset.appneoBound === "true") return;

    button.dataset.appneoBound = "true";
    setOekakiButtonLabel(button);
    button.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        startNeo(button).catch((error) => {
          console.error(error);
          alert("Failed to load PaintBBS NEO.\n" + error);
        });
      },
      true,
    );

    if (window.APPNEO_AUTO_START !== false) {
      startNeo(button).catch((error) => {
        console.error(error);
        alert("Failed to load PaintBBS NEO.\n" + error);
      });
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bind, { once: true });
  } else {
    bind();
  }
})();
