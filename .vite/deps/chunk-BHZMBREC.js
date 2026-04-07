import {
  init_formatMuiErrorMessage
} from "./chunk-TKZJWH2Z.js";
import {
  _extends,
  init_extends
} from "./chunk-WC4PTI5B.js";
import {
  require_react
} from "./chunk-W4EHDCLL.js";
import {
  __esm,
  __export,
  __toESM
} from "./chunk-EWTE5DHJ.js";

// node_modules/@mui/utils/esm/capitalize/capitalize.js
function capitalize(string) {
  if (typeof string !== "string") {
    throw new Error(true ? `MUI: \`capitalize(string)\` expects a string argument.` : formatMuiErrorMessage(7));
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
var init_capitalize = __esm({
  "node_modules/@mui/utils/esm/capitalize/capitalize.js"() {
    init_formatMuiErrorMessage();
  }
});

// node_modules/@mui/utils/esm/capitalize/index.js
var capitalize_exports = {};
__export(capitalize_exports, {
  default: () => capitalize
});
var init_capitalize2 = __esm({
  "node_modules/@mui/utils/esm/capitalize/index.js"() {
    init_capitalize();
  }
});

// node_modules/@mui/utils/esm/resolveProps/resolveProps.js
function resolveProps(defaultProps, props) {
  const output = _extends({}, props);
  Object.keys(defaultProps).forEach((propName) => {
    if (propName.toString().match(/^(components|slots)$/)) {
      output[propName] = _extends({}, defaultProps[propName], output[propName]);
    } else if (propName.toString().match(/^(componentsProps|slotProps)$/)) {
      const defaultSlotProps = defaultProps[propName] || {};
      const slotProps = props[propName];
      output[propName] = {};
      if (!slotProps || !Object.keys(slotProps)) {
        output[propName] = defaultSlotProps;
      } else if (!defaultSlotProps || !Object.keys(defaultSlotProps)) {
        output[propName] = slotProps;
      } else {
        output[propName] = _extends({}, slotProps);
        Object.keys(defaultSlotProps).forEach((slotPropName) => {
          output[propName][slotPropName] = resolveProps(defaultSlotProps[slotPropName], slotProps[slotPropName]);
        });
      }
    } else if (output[propName] === void 0) {
      output[propName] = defaultProps[propName];
    }
  });
  return output;
}
var init_resolveProps = __esm({
  "node_modules/@mui/utils/esm/resolveProps/resolveProps.js"() {
    init_extends();
  }
});

// node_modules/@mui/utils/esm/resolveProps/index.js
var init_resolveProps2 = __esm({
  "node_modules/@mui/utils/esm/resolveProps/index.js"() {
    init_resolveProps();
  }
});

// node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js
var React, useEnhancedEffect, useEnhancedEffect_default;
var init_useEnhancedEffect = __esm({
  "node_modules/@mui/utils/esm/useEnhancedEffect/useEnhancedEffect.js"() {
    "use client";
    React = __toESM(require_react());
    useEnhancedEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
    useEnhancedEffect_default = useEnhancedEffect;
  }
});

// node_modules/@mui/utils/esm/useEnhancedEffect/index.js
var init_useEnhancedEffect2 = __esm({
  "node_modules/@mui/utils/esm/useEnhancedEffect/index.js"() {
    init_useEnhancedEffect();
  }
});

export {
  capitalize,
  capitalize_exports,
  init_capitalize2 as init_capitalize,
  resolveProps,
  init_resolveProps2 as init_resolveProps,
  useEnhancedEffect_default,
  init_useEnhancedEffect2 as init_useEnhancedEffect
};
//# sourceMappingURL=chunk-BHZMBREC.js.map
