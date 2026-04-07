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

// node_modules/@mui/utils/esm/formatMuiErrorMessage/formatMuiErrorMessage.js
function formatMuiErrorMessage(code) {
  let url = "https://mui.com/production-error/?code=" + code;
  for (let i = 1; i < arguments.length; i += 1) {
    url += "&args[]=" + encodeURIComponent(arguments[i]);
  }
  return "Minified MUI error #" + code + "; visit " + url + " for the full message.";
}
var init_formatMuiErrorMessage = __esm({
  "node_modules/@mui/utils/esm/formatMuiErrorMessage/formatMuiErrorMessage.js"() {
  }
});

// node_modules/@mui/utils/esm/formatMuiErrorMessage/index.js
var formatMuiErrorMessage_exports = {};
__export(formatMuiErrorMessage_exports, {
  default: () => formatMuiErrorMessage
});
var init_formatMuiErrorMessage2 = __esm({
  "node_modules/@mui/utils/esm/formatMuiErrorMessage/index.js"() {
    init_formatMuiErrorMessage();
  }
});

// node_modules/@mui/utils/esm/deepmerge/deepmerge.js
function isPlainObject(item) {
  if (typeof item !== "object" || item === null) {
    return false;
  }
  const prototype = Object.getPrototypeOf(item);
  return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in item) && !(Symbol.iterator in item);
}
function deepClone(source) {
  if (React.isValidElement(source) || !isPlainObject(source)) {
    return source;
  }
  const output = {};
  Object.keys(source).forEach((key) => {
    output[key] = deepClone(source[key]);
  });
  return output;
}
function deepmerge(target, source, options = {
  clone: true
}) {
  const output = options.clone ? _extends({}, target) : target;
  if (isPlainObject(target) && isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      if (React.isValidElement(source[key])) {
        output[key] = source[key];
      } else if (isPlainObject(source[key]) && // Avoid prototype pollution
      Object.prototype.hasOwnProperty.call(target, key) && isPlainObject(target[key])) {
        output[key] = deepmerge(target[key], source[key], options);
      } else if (options.clone) {
        output[key] = isPlainObject(source[key]) ? deepClone(source[key]) : source[key];
      } else {
        output[key] = source[key];
      }
    });
  }
  return output;
}
var React;
var init_deepmerge = __esm({
  "node_modules/@mui/utils/esm/deepmerge/deepmerge.js"() {
    init_extends();
    React = __toESM(require_react());
  }
});

// node_modules/@mui/utils/esm/deepmerge/index.js
var deepmerge_exports = {};
__export(deepmerge_exports, {
  default: () => deepmerge,
  isPlainObject: () => isPlainObject
});
var init_deepmerge2 = __esm({
  "node_modules/@mui/utils/esm/deepmerge/index.js"() {
    init_deepmerge();
    init_deepmerge();
  }
});

export {
  formatMuiErrorMessage_exports,
  init_formatMuiErrorMessage2 as init_formatMuiErrorMessage,
  isPlainObject,
  deepmerge,
  deepmerge_exports,
  init_deepmerge2 as init_deepmerge
};
//# sourceMappingURL=chunk-TKZJWH2Z.js.map
