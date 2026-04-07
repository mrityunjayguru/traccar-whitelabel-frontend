import {
  clamp_exports,
  init_clamp
} from "./chunk-ZJQMBPXW.js";
import {
  deepmerge,
  formatMuiErrorMessage_exports,
  init_deepmerge,
  init_formatMuiErrorMessage
} from "./chunk-TKZJWH2Z.js";
import {
  _objectWithoutPropertiesLoose,
  init_objectWithoutPropertiesLoose
} from "./chunk-UMMRH3F5.js";
import {
  _extends,
  init_extends
} from "./chunk-WC4PTI5B.js";
import {
  blue_default,
  common_default,
  green_default,
  grey_default,
  init_blue,
  init_common,
  init_green,
  init_grey,
  init_lightBlue,
  init_orange,
  init_purple,
  init_red,
  lightBlue_default,
  orange_default,
  purple_default,
  red_default
} from "./chunk-EZ4FSJSI.js";
import {
  __commonJS,
  __esm,
  __toCommonJS,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/@babel/runtime/helpers/interopRequireDefault.js
var require_interopRequireDefault = __commonJS({
  "node_modules/@babel/runtime/helpers/interopRequireDefault.js"(exports, module) {
    function _interopRequireDefault(e) {
      return e && e.__esModule ? e : {
        "default": e
      };
    }
    module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;
  }
});

// node_modules/@mui/system/colorManipulator.js
var require_colorManipulator = __commonJS({
  "node_modules/@mui/system/colorManipulator.js"(exports) {
    "use strict";
    var _interopRequireDefault = require_interopRequireDefault();
    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.alpha = alpha;
    exports.blend = blend;
    exports.colorChannel = void 0;
    exports.darken = darken2;
    exports.decomposeColor = decomposeColor;
    exports.emphasize = emphasize;
    exports.getContrastRatio = getContrastRatio2;
    exports.getLuminance = getLuminance;
    exports.hexToRgb = hexToRgb;
    exports.hslToRgb = hslToRgb;
    exports.lighten = lighten2;
    exports.private_safeAlpha = private_safeAlpha;
    exports.private_safeColorChannel = void 0;
    exports.private_safeDarken = private_safeDarken;
    exports.private_safeEmphasize = private_safeEmphasize;
    exports.private_safeLighten = private_safeLighten;
    exports.recomposeColor = recomposeColor;
    exports.rgbToHex = rgbToHex;
    var _formatMuiErrorMessage2 = _interopRequireDefault((init_formatMuiErrorMessage(), __toCommonJS(formatMuiErrorMessage_exports)));
    var _clamp = _interopRequireDefault((init_clamp(), __toCommonJS(clamp_exports)));
    function clampWrapper(value, min = 0, max = 1) {
      if (true) {
        if (value < min || value > max) {
          console.error(`MUI: The value provided ${value} is out of range [${min}, ${max}].`);
        }
      }
      return (0, _clamp.default)(value, min, max);
    }
    function hexToRgb(color) {
      color = color.slice(1);
      const re = new RegExp(`.{1,${color.length >= 6 ? 2 : 1}}`, "g");
      let colors = color.match(re);
      if (colors && colors[0].length === 1) {
        colors = colors.map((n) => n + n);
      }
      return colors ? `rgb${colors.length === 4 ? "a" : ""}(${colors.map((n, index) => {
        return index < 3 ? parseInt(n, 16) : Math.round(parseInt(n, 16) / 255 * 1e3) / 1e3;
      }).join(", ")})` : "";
    }
    function intToHex(int) {
      const hex = int.toString(16);
      return hex.length === 1 ? `0${hex}` : hex;
    }
    function decomposeColor(color) {
      if (color.type) {
        return color;
      }
      if (color.charAt(0) === "#") {
        return decomposeColor(hexToRgb(color));
      }
      const marker = color.indexOf("(");
      const type = color.substring(0, marker);
      if (["rgb", "rgba", "hsl", "hsla", "color"].indexOf(type) === -1) {
        throw new Error(true ? `MUI: Unsupported \`${color}\` color.
The following formats are supported: #nnn, #nnnnnn, rgb(), rgba(), hsl(), hsla(), color().` : (0, _formatMuiErrorMessage2.default)(9, color));
      }
      let values = color.substring(marker + 1, color.length - 1);
      let colorSpace;
      if (type === "color") {
        values = values.split(" ");
        colorSpace = values.shift();
        if (values.length === 4 && values[3].charAt(0) === "/") {
          values[3] = values[3].slice(1);
        }
        if (["srgb", "display-p3", "a98-rgb", "prophoto-rgb", "rec-2020"].indexOf(colorSpace) === -1) {
          throw new Error(true ? `MUI: unsupported \`${colorSpace}\` color space.
The following color spaces are supported: srgb, display-p3, a98-rgb, prophoto-rgb, rec-2020.` : (0, _formatMuiErrorMessage2.default)(10, colorSpace));
        }
      } else {
        values = values.split(",");
      }
      values = values.map((value) => parseFloat(value));
      return {
        type,
        values,
        colorSpace
      };
    }
    var colorChannel = (color) => {
      const decomposedColor = decomposeColor(color);
      return decomposedColor.values.slice(0, 3).map((val, idx) => decomposedColor.type.indexOf("hsl") !== -1 && idx !== 0 ? `${val}%` : val).join(" ");
    };
    exports.colorChannel = colorChannel;
    var private_safeColorChannel = (color, warning) => {
      try {
        return colorChannel(color);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color;
      }
    };
    exports.private_safeColorChannel = private_safeColorChannel;
    function recomposeColor(color) {
      const {
        type,
        colorSpace
      } = color;
      let {
        values
      } = color;
      if (type.indexOf("rgb") !== -1) {
        values = values.map((n, i) => i < 3 ? parseInt(n, 10) : n);
      } else if (type.indexOf("hsl") !== -1) {
        values[1] = `${values[1]}%`;
        values[2] = `${values[2]}%`;
      }
      if (type.indexOf("color") !== -1) {
        values = `${colorSpace} ${values.join(" ")}`;
      } else {
        values = `${values.join(", ")}`;
      }
      return `${type}(${values})`;
    }
    function rgbToHex(color) {
      if (color.indexOf("#") === 0) {
        return color;
      }
      const {
        values
      } = decomposeColor(color);
      return `#${values.map((n, i) => intToHex(i === 3 ? Math.round(255 * n) : n)).join("")}`;
    }
    function hslToRgb(color) {
      color = decomposeColor(color);
      const {
        values
      } = color;
      const h = values[0];
      const s = values[1] / 100;
      const l = values[2] / 100;
      const a = s * Math.min(l, 1 - l);
      const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      let type = "rgb";
      const rgb = [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
      if (color.type === "hsla") {
        type += "a";
        rgb.push(values[3]);
      }
      return recomposeColor({
        type,
        values: rgb
      });
    }
    function getLuminance(color) {
      color = decomposeColor(color);
      let rgb = color.type === "hsl" || color.type === "hsla" ? decomposeColor(hslToRgb(color)).values : color.values;
      rgb = rgb.map((val) => {
        if (color.type !== "color") {
          val /= 255;
        }
        return val <= 0.03928 ? val / 12.92 : ((val + 0.055) / 1.055) ** 2.4;
      });
      return Number((0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]).toFixed(3));
    }
    function getContrastRatio2(foreground, background) {
      const lumA = getLuminance(foreground);
      const lumB = getLuminance(background);
      return (Math.max(lumA, lumB) + 0.05) / (Math.min(lumA, lumB) + 0.05);
    }
    function alpha(color, value) {
      color = decomposeColor(color);
      value = clampWrapper(value);
      if (color.type === "rgb" || color.type === "hsl") {
        color.type += "a";
      }
      if (color.type === "color") {
        color.values[3] = `/${value}`;
      } else {
        color.values[3] = value;
      }
      return recomposeColor(color);
    }
    function private_safeAlpha(color, value, warning) {
      try {
        return alpha(color, value);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color;
      }
    }
    function darken2(color, coefficient) {
      color = decomposeColor(color);
      coefficient = clampWrapper(coefficient);
      if (color.type.indexOf("hsl") !== -1) {
        color.values[2] *= 1 - coefficient;
      } else if (color.type.indexOf("rgb") !== -1 || color.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color.values[i] *= 1 - coefficient;
        }
      }
      return recomposeColor(color);
    }
    function private_safeDarken(color, coefficient, warning) {
      try {
        return darken2(color, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color;
      }
    }
    function lighten2(color, coefficient) {
      color = decomposeColor(color);
      coefficient = clampWrapper(coefficient);
      if (color.type.indexOf("hsl") !== -1) {
        color.values[2] += (100 - color.values[2]) * coefficient;
      } else if (color.type.indexOf("rgb") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color.values[i] += (255 - color.values[i]) * coefficient;
        }
      } else if (color.type.indexOf("color") !== -1) {
        for (let i = 0; i < 3; i += 1) {
          color.values[i] += (1 - color.values[i]) * coefficient;
        }
      }
      return recomposeColor(color);
    }
    function private_safeLighten(color, coefficient, warning) {
      try {
        return lighten2(color, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color;
      }
    }
    function emphasize(color, coefficient = 0.15) {
      return getLuminance(color) > 0.5 ? darken2(color, coefficient) : lighten2(color, coefficient);
    }
    function private_safeEmphasize(color, coefficient, warning) {
      try {
        return emphasize(color, coefficient);
      } catch (error) {
        if (warning && true) {
          console.warn(warning);
        }
        return color;
      }
    }
    function blend(background, overlay, opacity, gamma = 1) {
      const blendChannel = (b, o) => Math.round((b ** (1 / gamma) * (1 - opacity) + o ** (1 / gamma) * opacity) ** gamma);
      const backgroundColor = decomposeColor(background);
      const overlayColor = decomposeColor(overlay);
      const rgb = [blendChannel(backgroundColor.values[0], overlayColor.values[0]), blendChannel(backgroundColor.values[1], overlayColor.values[1]), blendChannel(backgroundColor.values[2], overlayColor.values[2])];
      return recomposeColor({
        type: "rgb",
        values: rgb
      });
    }
  }
});

// node_modules/@mui/material/styles/createPalette.js
function addLightOrDark(intent, direction, shade, tonalOffset) {
  const tonalOffsetLight = tonalOffset.light || tonalOffset;
  const tonalOffsetDark = tonalOffset.dark || tonalOffset * 1.5;
  if (!intent[direction]) {
    if (intent.hasOwnProperty(shade)) {
      intent[direction] = intent[shade];
    } else if (direction === "light") {
      intent.light = (0, import_colorManipulator.lighten)(intent.main, tonalOffsetLight);
    } else if (direction === "dark") {
      intent.dark = (0, import_colorManipulator.darken)(intent.main, tonalOffsetDark);
    }
  }
}
function getDefaultPrimary(mode = "light") {
  if (mode === "dark") {
    return {
      main: blue_default[200],
      light: blue_default[50],
      dark: blue_default[400]
    };
  }
  return {
    main: blue_default[700],
    light: blue_default[400],
    dark: blue_default[800]
  };
}
function getDefaultSecondary(mode = "light") {
  if (mode === "dark") {
    return {
      main: purple_default[200],
      light: purple_default[50],
      dark: purple_default[400]
    };
  }
  return {
    main: purple_default[500],
    light: purple_default[300],
    dark: purple_default[700]
  };
}
function getDefaultError(mode = "light") {
  if (mode === "dark") {
    return {
      main: red_default[500],
      light: red_default[300],
      dark: red_default[700]
    };
  }
  return {
    main: red_default[700],
    light: red_default[400],
    dark: red_default[800]
  };
}
function getDefaultInfo(mode = "light") {
  if (mode === "dark") {
    return {
      main: lightBlue_default[400],
      light: lightBlue_default[300],
      dark: lightBlue_default[700]
    };
  }
  return {
    main: lightBlue_default[700],
    light: lightBlue_default[500],
    dark: lightBlue_default[900]
  };
}
function getDefaultSuccess(mode = "light") {
  if (mode === "dark") {
    return {
      main: green_default[400],
      light: green_default[300],
      dark: green_default[700]
    };
  }
  return {
    main: green_default[800],
    light: green_default[500],
    dark: green_default[900]
  };
}
function getDefaultWarning(mode = "light") {
  if (mode === "dark") {
    return {
      main: orange_default[400],
      light: orange_default[300],
      dark: orange_default[700]
    };
  }
  return {
    main: "#ed6c02",
    // closest to orange[800] that pass 3:1.
    light: orange_default[500],
    dark: orange_default[900]
  };
}
function createPalette(palette) {
  const {
    mode = "light",
    contrastThreshold = 3,
    tonalOffset = 0.2
  } = palette, other = _objectWithoutPropertiesLoose(palette, _excluded);
  const primary = palette.primary || getDefaultPrimary(mode);
  const secondary = palette.secondary || getDefaultSecondary(mode);
  const error = palette.error || getDefaultError(mode);
  const info = palette.info || getDefaultInfo(mode);
  const success = palette.success || getDefaultSuccess(mode);
  const warning = palette.warning || getDefaultWarning(mode);
  function getContrastText(background) {
    const contrastText = (0, import_colorManipulator.getContrastRatio)(background, dark.text.primary) >= contrastThreshold ? dark.text.primary : light.text.primary;
    if (true) {
      const contrast = (0, import_colorManipulator.getContrastRatio)(background, contrastText);
      if (contrast < 3) {
        console.error([`MUI: The contrast ratio of ${contrast}:1 for ${contrastText} on ${background}`, "falls below the WCAG recommended absolute minimum contrast ratio of 3:1.", "https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast"].join("\n"));
      }
    }
    return contrastText;
  }
  const augmentColor = ({
    color,
    name,
    mainShade = 500,
    lightShade = 300,
    darkShade = 700
  }) => {
    color = _extends({}, color);
    if (!color.main && color[mainShade]) {
      color.main = color[mainShade];
    }
    if (!color.hasOwnProperty("main")) {
      throw new Error(true ? `MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.
The color object needs to have a \`main\` property or a \`${mainShade}\` property.` : formatMuiErrorMessage(11, name ? ` (${name})` : "", mainShade));
    }
    if (typeof color.main !== "string") {
      throw new Error(true ? `MUI: The color${name ? ` (${name})` : ""} provided to augmentColor(color) is invalid.
\`color.main\` should be a string, but \`${JSON.stringify(color.main)}\` was provided instead.

Did you intend to use one of the following approaches?

import { green } from "@mui/material/colors";

const theme1 = createTheme({ palette: {
  primary: green,
} });

const theme2 = createTheme({ palette: {
  primary: { main: green[500] },
} });` : formatMuiErrorMessage(12, name ? ` (${name})` : "", JSON.stringify(color.main)));
    }
    addLightOrDark(color, "light", lightShade, tonalOffset);
    addLightOrDark(color, "dark", darkShade, tonalOffset);
    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main);
    }
    return color;
  };
  const modes = {
    dark,
    light
  };
  if (true) {
    if (!modes[mode]) {
      console.error(`MUI: The palette mode \`${mode}\` is not supported.`);
    }
  }
  const paletteOutput = deepmerge(_extends({
    // A collection of common colors.
    common: _extends({}, common_default),
    // prevent mutable object.
    // The palette mode, can be light or dark.
    mode,
    // The colors used to represent primary interface elements for a user.
    primary: augmentColor({
      color: primary,
      name: "primary"
    }),
    // The colors used to represent secondary interface elements for a user.
    secondary: augmentColor({
      color: secondary,
      name: "secondary",
      mainShade: "A400",
      lightShade: "A200",
      darkShade: "A700"
    }),
    // The colors used to represent interface elements that the user should be made aware of.
    error: augmentColor({
      color: error,
      name: "error"
    }),
    // The colors used to represent potentially dangerous actions or important messages.
    warning: augmentColor({
      color: warning,
      name: "warning"
    }),
    // The colors used to present information to the user that is neutral and not necessarily important.
    info: augmentColor({
      color: info,
      name: "info"
    }),
    // The colors used to indicate the successful completion of an action that user triggered.
    success: augmentColor({
      color: success,
      name: "success"
    }),
    // The grey colors.
    grey: grey_default,
    // Used by `getContrastText()` to maximize the contrast between
    // the background and the text.
    contrastThreshold,
    // Takes a background color and returns the text color that maximizes the contrast.
    getContrastText,
    // Generate a rich color object.
    augmentColor,
    // Used by the functions below to shift a color's luminance by approximately
    // two indexes within its tonal palette.
    // E.g., shift from Red 500 to Red 300 or Red 700.
    tonalOffset
  }, modes[mode]), other);
  return paletteOutput;
}
var import_colorManipulator, _excluded, light, dark;
var init_createPalette = __esm({
  "node_modules/@mui/material/styles/createPalette.js"() {
    init_extends();
    init_objectWithoutPropertiesLoose();
    init_formatMuiErrorMessage();
    init_deepmerge();
    import_colorManipulator = __toESM(require_colorManipulator());
    init_common();
    init_grey();
    init_purple();
    init_red();
    init_orange();
    init_blue();
    init_lightBlue();
    init_green();
    _excluded = ["mode", "contrastThreshold", "tonalOffset"];
    light = {
      // The colors used to style the text.
      text: {
        // The most important text.
        primary: "rgba(0, 0, 0, 0.87)",
        // Secondary text.
        secondary: "rgba(0, 0, 0, 0.6)",
        // Disabled text have even lower visual prominence.
        disabled: "rgba(0, 0, 0, 0.38)"
      },
      // The color used to divide different elements.
      divider: "rgba(0, 0, 0, 0.12)",
      // The background colors used to style the surfaces.
      // Consistency between these values is important.
      background: {
        paper: common_default.white,
        default: common_default.white
      },
      // The colors used to style the action elements.
      action: {
        // The color of an active action like an icon button.
        active: "rgba(0, 0, 0, 0.54)",
        // The color of an hovered action.
        hover: "rgba(0, 0, 0, 0.04)",
        hoverOpacity: 0.04,
        // The color of a selected action.
        selected: "rgba(0, 0, 0, 0.08)",
        selectedOpacity: 0.08,
        // The color of a disabled action.
        disabled: "rgba(0, 0, 0, 0.26)",
        // The background color of a disabled action.
        disabledBackground: "rgba(0, 0, 0, 0.12)",
        disabledOpacity: 0.38,
        focus: "rgba(0, 0, 0, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.12
      }
    };
    dark = {
      text: {
        primary: common_default.white,
        secondary: "rgba(255, 255, 255, 0.7)",
        disabled: "rgba(255, 255, 255, 0.5)",
        icon: "rgba(255, 255, 255, 0.5)"
      },
      divider: "rgba(255, 255, 255, 0.12)",
      background: {
        paper: "#121212",
        default: "#121212"
      },
      action: {
        active: common_default.white,
        hover: "rgba(255, 255, 255, 0.08)",
        hoverOpacity: 0.08,
        selected: "rgba(255, 255, 255, 0.16)",
        selectedOpacity: 0.16,
        disabled: "rgba(255, 255, 255, 0.3)",
        disabledBackground: "rgba(255, 255, 255, 0.12)",
        disabledOpacity: 0.38,
        focus: "rgba(255, 255, 255, 0.12)",
        focusOpacity: 0.12,
        activatedOpacity: 0.24
      }
    };
  }
});

export {
  require_interopRequireDefault,
  require_colorManipulator,
  light,
  dark,
  createPalette,
  init_createPalette
};
//# sourceMappingURL=chunk-SVZPNLPT.js.map
