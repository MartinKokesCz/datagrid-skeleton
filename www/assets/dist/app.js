var finishFlash = function() {
  if ($(".flash").length > 0) {
    setTimeout(
      function() {
        $(".flash").remove();
      },
      4e3
    );
  }
};
if (typeof naja !== "undefined") {
  let FlashesExtension = function(naja2) {
    naja2.addEventListener("complete", finishFlash);
    return this;
  };
  var FlashesExtension2 = FlashesExtension;
  naja.registerExtension(FlashesExtension);
} else {
  $.nette.ext("flashes", {
    complete: function() {
      finishFlash();
    }
  });
}
finishFlash();
function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
function lastItemOf(arr) {
  return arr[arr.length - 1];
}
function pushUnique(arr, ...items) {
  items.forEach((item) => {
    if (arr.includes(item)) {
      return;
    }
    arr.push(item);
  });
  return arr;
}
function stringToArray(str, separator) {
  return str ? str.split(separator) : [];
}
function isInRange(testVal, min, max) {
  const minOK = min === void 0 || testVal >= min;
  const maxOK = max === void 0 || testVal <= max;
  return minOK && maxOK;
}
function limitToRange(val, min, max) {
  if (val < min) {
    return min;
  }
  if (val > max) {
    return max;
  }
  return val;
}
function createTagRepeat(tagName, repeat, attributes = {}, index = 0, html = "") {
  const openTagSrc = Object.keys(attributes).reduce((src, attr) => {
    let val = attributes[attr];
    if (typeof val === "function") {
      val = val(index);
    }
    return `${src} ${attr}="${val}"`;
  }, tagName);
  html += `<${openTagSrc}></${tagName}>`;
  const next = index + 1;
  return next < repeat ? createTagRepeat(tagName, repeat, attributes, next, html) : html;
}
function optimizeTemplateHTML(html) {
  return html.replace(/>\s+/g, ">").replace(/\s+</, "<");
}
function stripTime(timeValue) {
  return new Date(timeValue).setHours(0, 0, 0, 0);
}
function today() {
  return new Date().setHours(0, 0, 0, 0);
}
function dateValue(...args) {
  switch (args.length) {
    case 0:
      return today();
    case 1:
      return stripTime(args[0]);
  }
  const newDate = new Date(0);
  newDate.setFullYear(...args);
  return newDate.setHours(0, 0, 0, 0);
}
function addDays(date, amount) {
  const newDate = new Date(date);
  return newDate.setDate(newDate.getDate() + amount);
}
function addWeeks(date, amount) {
  return addDays(date, amount * 7);
}
function addMonths(date, amount) {
  const newDate = new Date(date);
  const monthsToSet = newDate.getMonth() + amount;
  let expectedMonth = monthsToSet % 12;
  if (expectedMonth < 0) {
    expectedMonth += 12;
  }
  const time = newDate.setMonth(monthsToSet);
  return newDate.getMonth() !== expectedMonth ? newDate.setDate(0) : time;
}
function addYears(date, amount) {
  const newDate = new Date(date);
  const expectedMonth = newDate.getMonth();
  const time = newDate.setFullYear(newDate.getFullYear() + amount);
  return expectedMonth === 1 && newDate.getMonth() === 2 ? newDate.setDate(0) : time;
}
function dayDiff(day, from) {
  return (day - from + 7) % 7;
}
function dayOfTheWeekOf(baseDate, dayOfWeek, weekStart = 0) {
  const baseDay = new Date(baseDate).getDay();
  return addDays(baseDate, dayDiff(dayOfWeek, weekStart) - dayDiff(baseDay, weekStart));
}
function getWeek(date) {
  const thuOfTheWeek = dayOfTheWeekOf(date, 4, 1);
  const firstThu = dayOfTheWeekOf(new Date(thuOfTheWeek).setMonth(0, 4), 4, 1);
  return Math.round((thuOfTheWeek - firstThu) / 6048e5) + 1;
}
function startOfYearPeriod(date, years) {
  const year = new Date(date).getFullYear();
  return Math.floor(year / years) * years;
}
function regularizeDate(date, timeSpan, useLastDate) {
  if (timeSpan !== 1 && timeSpan !== 2) {
    return date;
  }
  const newDate = new Date(date);
  if (timeSpan === 1) {
    useLastDate ? newDate.setMonth(newDate.getMonth() + 1, 0) : newDate.setDate(1);
  } else {
    useLastDate ? newDate.setFullYear(newDate.getFullYear() + 1, 0, 0) : newDate.setMonth(0, 1);
  }
  return newDate.setHours(0, 0, 0, 0);
}
const reFormatTokens = /dd?|DD?|mm?|MM?|yy?(?:yy)?/;
const reNonDateParts = /[\s!-/:-@[-`{-~年月日]+/;
let knownFormats = {};
const parseFns = {
  y(date, year) {
    return new Date(date).setFullYear(parseInt(year, 10));
  },
  m(date, month, locale) {
    const newDate = new Date(date);
    let monthIndex = parseInt(month, 10) - 1;
    if (isNaN(monthIndex)) {
      if (!month) {
        return NaN;
      }
      const monthName = month.toLowerCase();
      const compareNames = (name) => name.toLowerCase().startsWith(monthName);
      monthIndex = locale.monthsShort.findIndex(compareNames);
      if (monthIndex < 0) {
        monthIndex = locale.months.findIndex(compareNames);
      }
      if (monthIndex < 0) {
        return NaN;
      }
    }
    newDate.setMonth(monthIndex);
    return newDate.getMonth() !== normalizeMonth(monthIndex) ? newDate.setDate(0) : newDate.getTime();
  },
  d(date, day) {
    return new Date(date).setDate(parseInt(day, 10));
  }
};
const formatFns = {
  d(date) {
    return date.getDate();
  },
  dd(date) {
    return padZero(date.getDate(), 2);
  },
  D(date, locale) {
    return locale.daysShort[date.getDay()];
  },
  DD(date, locale) {
    return locale.days[date.getDay()];
  },
  m(date) {
    return date.getMonth() + 1;
  },
  mm(date) {
    return padZero(date.getMonth() + 1, 2);
  },
  M(date, locale) {
    return locale.monthsShort[date.getMonth()];
  },
  MM(date, locale) {
    return locale.months[date.getMonth()];
  },
  y(date) {
    return date.getFullYear();
  },
  yy(date) {
    return padZero(date.getFullYear(), 2).slice(-2);
  },
  yyyy(date) {
    return padZero(date.getFullYear(), 4);
  }
};
function normalizeMonth(monthIndex) {
  return monthIndex > -1 ? monthIndex % 12 : normalizeMonth(monthIndex + 12);
}
function padZero(num, length) {
  return num.toString().padStart(length, "0");
}
function parseFormatString(format) {
  if (typeof format !== "string") {
    throw new Error("Invalid date format.");
  }
  if (format in knownFormats) {
    return knownFormats[format];
  }
  const separators = format.split(reFormatTokens);
  const parts = format.match(new RegExp(reFormatTokens, "g"));
  if (separators.length === 0 || !parts) {
    throw new Error("Invalid date format.");
  }
  const partFormatters = parts.map((token) => formatFns[token]);
  const partParserKeys = Object.keys(parseFns).reduce((keys, key) => {
    const token = parts.find((part) => part[0] !== "D" && part[0].toLowerCase() === key);
    if (token) {
      keys.push(key);
    }
    return keys;
  }, []);
  return knownFormats[format] = {
    parser(dateStr, locale) {
      const dateParts = dateStr.split(reNonDateParts).reduce((dtParts, part, index) => {
        if (part.length > 0 && parts[index]) {
          const token = parts[index][0];
          if (token === "M") {
            dtParts.m = part;
          } else if (token !== "D") {
            dtParts[token] = part;
          }
        }
        return dtParts;
      }, {});
      return partParserKeys.reduce((origDate, key) => {
        const newDate = parseFns[key](origDate, dateParts[key], locale);
        return isNaN(newDate) ? origDate : newDate;
      }, today());
    },
    formatter(date, locale) {
      let dateStr = partFormatters.reduce((str, fn, index) => {
        return str += `${separators[index]}${fn(date, locale)}`;
      }, "");
      return dateStr += lastItemOf(separators);
    }
  };
}
function parseDate(dateStr, format, locale) {
  if (dateStr instanceof Date || typeof dateStr === "number") {
    const date = stripTime(dateStr);
    return isNaN(date) ? void 0 : date;
  }
  if (!dateStr) {
    return void 0;
  }
  if (dateStr === "today") {
    return today();
  }
  if (format && format.toValue) {
    const date = format.toValue(dateStr, format, locale);
    return isNaN(date) ? void 0 : stripTime(date);
  }
  return parseFormatString(format).parser(dateStr, locale);
}
function formatDate(date, format, locale) {
  if (isNaN(date) || !date && date !== 0) {
    return "";
  }
  const dateObj = typeof date === "number" ? new Date(date) : date;
  if (format.toDisplay) {
    return format.toDisplay(dateObj, format, locale);
  }
  return parseFormatString(format).formatter(dateObj, locale);
}
const range = document.createRange();
function parseHTML(html) {
  return range.createContextualFragment(html);
}
function getParent(el) {
  return el.parentElement || (el.parentNode instanceof ShadowRoot ? el.parentNode.host : void 0);
}
function isActiveElement(el) {
  return el.getRootNode().activeElement === el;
}
function hideElement(el) {
  if (el.style.display === "none") {
    return;
  }
  if (el.style.display) {
    el.dataset.styleDisplay = el.style.display;
  }
  el.style.display = "none";
}
function showElement(el) {
  if (el.style.display !== "none") {
    return;
  }
  if (el.dataset.styleDisplay) {
    el.style.display = el.dataset.styleDisplay;
    delete el.dataset.styleDisplay;
  } else {
    el.style.display = "";
  }
}
function emptyChildNodes(el) {
  if (el.firstChild) {
    el.removeChild(el.firstChild);
    emptyChildNodes(el);
  }
}
function replaceChildNodes(el, newChildNodes) {
  emptyChildNodes(el);
  if (newChildNodes instanceof DocumentFragment) {
    el.appendChild(newChildNodes);
  } else if (typeof newChildNodes === "string") {
    el.appendChild(parseHTML(newChildNodes));
  } else if (typeof newChildNodes.forEach === "function") {
    newChildNodes.forEach((node) => {
      el.appendChild(node);
    });
  }
}
const listenerRegistry = /* @__PURE__ */ new WeakMap();
const { addEventListener, removeEventListener } = EventTarget.prototype;
function registerListeners(keyObj, listeners) {
  let registered = listenerRegistry.get(keyObj);
  if (!registered) {
    registered = [];
    listenerRegistry.set(keyObj, registered);
  }
  listeners.forEach((listener) => {
    addEventListener.call(...listener);
    registered.push(listener);
  });
}
function unregisterListeners(keyObj) {
  let listeners = listenerRegistry.get(keyObj);
  if (!listeners) {
    return;
  }
  listeners.forEach((listener) => {
    removeEventListener.call(...listener);
  });
  listenerRegistry.delete(keyObj);
}
if (!Event.prototype.composedPath) {
  const getComposedPath = (node, path = []) => {
    path.push(node);
    let parent;
    if (node.parentNode) {
      parent = node.parentNode;
    } else if (node.host) {
      parent = node.host;
    } else if (node.defaultView) {
      parent = node.defaultView;
    }
    return parent ? getComposedPath(parent, path) : path;
  };
  Event.prototype.composedPath = function() {
    return getComposedPath(this.target);
  };
}
function findFromPath(path, criteria, currentTarget) {
  const [node, ...rest] = path;
  if (criteria(node)) {
    return node;
  }
  if (node === currentTarget || node.tagName === "HTML" || rest.length === 0) {
    return;
  }
  return findFromPath(rest, criteria, currentTarget);
}
function findElementInEventPath(ev, selector) {
  const criteria = typeof selector === "function" ? selector : (el) => el instanceof Element && el.matches(selector);
  return findFromPath(ev.composedPath(), criteria, ev.currentTarget);
}
const locales = {
  en: {
    days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    today: "Today",
    clear: "Clear",
    titleFormat: "MM y"
  }
};
const defaultOptions = {
  autohide: false,
  beforeShowDay: null,
  beforeShowDecade: null,
  beforeShowMonth: null,
  beforeShowYear: null,
  calendarWeeks: false,
  clearBtn: false,
  dateDelimiter: ",",
  datesDisabled: [],
  daysOfWeekDisabled: [],
  daysOfWeekHighlighted: [],
  defaultViewDate: void 0,
  disableTouchKeyboard: false,
  format: "mm/dd/yyyy",
  language: "en",
  maxDate: null,
  maxNumberOfDates: 1,
  maxView: 3,
  minDate: null,
  nextArrow: "\xBB",
  orientation: "auto",
  pickLevel: 0,
  prevArrow: "\xAB",
  showDaysOfWeek: true,
  showOnClick: true,
  showOnFocus: true,
  startView: 0,
  title: "",
  todayBtn: false,
  todayBtnMode: 0,
  todayHighlight: false,
  updateOnBlur: true,
  weekStart: 0
};
const {
  language: defaultLang,
  format: defaultFormat,
  weekStart: defaultWeekStart
} = defaultOptions;
function sanitizeDOW(dow, day) {
  return dow.length < 6 && day >= 0 && day < 7 ? pushUnique(dow, day) : dow;
}
function calcEndOfWeek(startOfWeek) {
  return (startOfWeek + 6) % 7;
}
function validateDate(value, format, locale, origValue) {
  const date = parseDate(value, format, locale);
  return date !== void 0 ? date : origValue;
}
function validateViewId(value, origValue, max = 3) {
  const viewId = parseInt(value, 10);
  return viewId >= 0 && viewId <= max ? viewId : origValue;
}
function processOptions(options, datepicker) {
  const inOpts = Object.assign({}, options);
  const config = {};
  const locales2 = datepicker.constructor.locales;
  const rangeSideIndex = datepicker.rangeSideIndex;
  let {
    format,
    language,
    locale,
    maxDate,
    maxView,
    minDate,
    pickLevel,
    startView,
    weekStart
  } = datepicker.config || {};
  if (inOpts.language) {
    let lang;
    if (inOpts.language !== language) {
      if (locales2[inOpts.language]) {
        lang = inOpts.language;
      } else {
        lang = inOpts.language.split("-")[0];
        if (locales2[lang] === void 0) {
          lang = false;
        }
      }
    }
    delete inOpts.language;
    if (lang) {
      language = config.language = lang;
      const origLocale = locale || locales2[defaultLang];
      locale = Object.assign({
        format: defaultFormat,
        weekStart: defaultWeekStart
      }, locales2[defaultLang]);
      if (language !== defaultLang) {
        Object.assign(locale, locales2[language]);
      }
      config.locale = locale;
      if (format === origLocale.format) {
        format = config.format = locale.format;
      }
      if (weekStart === origLocale.weekStart) {
        weekStart = config.weekStart = locale.weekStart;
        config.weekEnd = calcEndOfWeek(locale.weekStart);
      }
    }
  }
  if (inOpts.format) {
    const hasToDisplay = typeof inOpts.format.toDisplay === "function";
    const hasToValue = typeof inOpts.format.toValue === "function";
    const validFormatString = reFormatTokens.test(inOpts.format);
    if (hasToDisplay && hasToValue || validFormatString) {
      format = config.format = inOpts.format;
    }
    delete inOpts.format;
  }
  let newPickLevel = pickLevel;
  if (inOpts.pickLevel !== void 0) {
    newPickLevel = validateViewId(inOpts.pickLevel, 2);
    delete inOpts.pickLevel;
  }
  if (newPickLevel !== pickLevel) {
    if (newPickLevel > pickLevel) {
      if (inOpts.minDate === void 0) {
        inOpts.minDate = minDate;
      }
      if (inOpts.maxDate === void 0) {
        inOpts.maxDate = maxDate;
      }
    }
    if (!inOpts.datesDisabled) {
      inOpts.datesDisabled = [];
    }
    pickLevel = config.pickLevel = newPickLevel;
  }
  let minDt = minDate;
  let maxDt = maxDate;
  if (inOpts.minDate !== void 0) {
    const defaultMinDt = dateValue(0, 0, 1);
    minDt = inOpts.minDate === null ? defaultMinDt : validateDate(inOpts.minDate, format, locale, minDt);
    if (minDt !== defaultMinDt) {
      minDt = regularizeDate(minDt, pickLevel, false);
    }
    delete inOpts.minDate;
  }
  if (inOpts.maxDate !== void 0) {
    maxDt = inOpts.maxDate === null ? void 0 : validateDate(inOpts.maxDate, format, locale, maxDt);
    if (maxDt !== void 0) {
      maxDt = regularizeDate(maxDt, pickLevel, true);
    }
    delete inOpts.maxDate;
  }
  if (maxDt < minDt) {
    minDate = config.minDate = maxDt;
    maxDate = config.maxDate = minDt;
  } else {
    if (minDate !== minDt) {
      minDate = config.minDate = minDt;
    }
    if (maxDate !== maxDt) {
      maxDate = config.maxDate = maxDt;
    }
  }
  if (inOpts.datesDisabled) {
    config.datesDisabled = inOpts.datesDisabled.reduce((dates, dt) => {
      const date = parseDate(dt, format, locale);
      return date !== void 0 ? pushUnique(dates, regularizeDate(date, pickLevel, rangeSideIndex)) : dates;
    }, []);
    delete inOpts.datesDisabled;
  }
  if (inOpts.defaultViewDate !== void 0) {
    const viewDate = parseDate(inOpts.defaultViewDate, format, locale);
    if (viewDate !== void 0) {
      config.defaultViewDate = viewDate;
    }
    delete inOpts.defaultViewDate;
  }
  if (inOpts.weekStart !== void 0) {
    const wkStart = Number(inOpts.weekStart) % 7;
    if (!isNaN(wkStart)) {
      weekStart = config.weekStart = wkStart;
      config.weekEnd = calcEndOfWeek(wkStart);
    }
    delete inOpts.weekStart;
  }
  if (inOpts.daysOfWeekDisabled) {
    config.daysOfWeekDisabled = inOpts.daysOfWeekDisabled.reduce(sanitizeDOW, []);
    delete inOpts.daysOfWeekDisabled;
  }
  if (inOpts.daysOfWeekHighlighted) {
    config.daysOfWeekHighlighted = inOpts.daysOfWeekHighlighted.reduce(sanitizeDOW, []);
    delete inOpts.daysOfWeekHighlighted;
  }
  if (inOpts.maxNumberOfDates !== void 0) {
    const maxNumberOfDates = parseInt(inOpts.maxNumberOfDates, 10);
    if (maxNumberOfDates >= 0) {
      config.maxNumberOfDates = maxNumberOfDates;
      config.multidate = maxNumberOfDates !== 1;
    }
    delete inOpts.maxNumberOfDates;
  }
  if (inOpts.dateDelimiter) {
    config.dateDelimiter = String(inOpts.dateDelimiter);
    delete inOpts.dateDelimiter;
  }
  let newMaxView = maxView;
  if (inOpts.maxView !== void 0) {
    newMaxView = validateViewId(inOpts.maxView, maxView);
    delete inOpts.maxView;
  }
  newMaxView = pickLevel > newMaxView ? pickLevel : newMaxView;
  if (newMaxView !== maxView) {
    maxView = config.maxView = newMaxView;
  }
  let newStartView = startView;
  if (inOpts.startView !== void 0) {
    newStartView = validateViewId(inOpts.startView, newStartView);
    delete inOpts.startView;
  }
  if (newStartView < pickLevel) {
    newStartView = pickLevel;
  } else if (newStartView > maxView) {
    newStartView = maxView;
  }
  if (newStartView !== startView) {
    config.startView = newStartView;
  }
  if (inOpts.prevArrow) {
    const prevArrow = parseHTML(inOpts.prevArrow);
    if (prevArrow.childNodes.length > 0) {
      config.prevArrow = prevArrow.childNodes;
    }
    delete inOpts.prevArrow;
  }
  if (inOpts.nextArrow) {
    const nextArrow = parseHTML(inOpts.nextArrow);
    if (nextArrow.childNodes.length > 0) {
      config.nextArrow = nextArrow.childNodes;
    }
    delete inOpts.nextArrow;
  }
  if (inOpts.disableTouchKeyboard !== void 0) {
    config.disableTouchKeyboard = "ontouchstart" in document && !!inOpts.disableTouchKeyboard;
    delete inOpts.disableTouchKeyboard;
  }
  if (inOpts.orientation) {
    const orientation = inOpts.orientation.toLowerCase().split(/\s+/g);
    config.orientation = {
      x: orientation.find((x) => x === "left" || x === "right") || "auto",
      y: orientation.find((y2) => y2 === "top" || y2 === "bottom") || "auto"
    };
    delete inOpts.orientation;
  }
  if (inOpts.todayBtnMode !== void 0) {
    switch (inOpts.todayBtnMode) {
      case 0:
      case 1:
        config.todayBtnMode = inOpts.todayBtnMode;
    }
    delete inOpts.todayBtnMode;
  }
  Object.keys(inOpts).forEach((key) => {
    if (inOpts[key] !== void 0 && hasProperty(defaultOptions, key)) {
      config[key] = inOpts[key];
    }
  });
  return config;
}
const pickerTemplate = optimizeTemplateHTML(`<div class="datepicker">
  <div class="datepicker-picker">
    <div class="datepicker-header">
      <div class="datepicker-title"></div>
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% prev-btn"></button>
        <button type="button" class="%buttonClass% view-switch"></button>
        <button type="button" class="%buttonClass% next-btn"></button>
      </div>
    </div>
    <div class="datepicker-main"></div>
    <div class="datepicker-footer">
      <div class="datepicker-controls">
        <button type="button" class="%buttonClass% today-btn"></button>
        <button type="button" class="%buttonClass% clear-btn"></button>
      </div>
    </div>
  </div>
</div>`);
const daysTemplate = optimizeTemplateHTML(`<div class="days">
  <div class="days-of-week">${createTagRepeat("span", 7, { class: "dow" })}</div>
  <div class="datepicker-grid">${createTagRepeat("span", 42)}</div>
</div>`);
const calendarWeeksTemplate = optimizeTemplateHTML(`<div class="calendar-weeks">
  <div class="days-of-week"><span class="dow"></span></div>
  <div class="weeks">${createTagRepeat("span", 6, { class: "week" })}</div>
</div>`);
class View {
  constructor(picker, config) {
    Object.assign(this, config, {
      picker,
      element: parseHTML(`<div class="datepicker-view"></div>`).firstChild,
      selected: []
    });
    this.init(this.picker.datepicker.config);
  }
  init(options) {
    if (options.pickLevel !== void 0) {
      this.isMinView = this.id === options.pickLevel;
    }
    this.setOptions(options);
    this.updateFocus();
    this.updateSelection();
  }
  performBeforeHook(el, current, timeValue) {
    let result = this.beforeShow(new Date(timeValue));
    switch (typeof result) {
      case "boolean":
        result = { enabled: result };
        break;
      case "string":
        result = { classes: result };
    }
    if (result) {
      if (result.enabled === false) {
        el.classList.add("disabled");
        pushUnique(this.disabled, current);
      }
      if (result.classes) {
        const extraClasses = result.classes.split(/\s+/);
        el.classList.add(...extraClasses);
        if (extraClasses.includes("disabled")) {
          pushUnique(this.disabled, current);
        }
      }
      if (result.content) {
        replaceChildNodes(el, result.content);
      }
    }
  }
}
class DaysView extends View {
  constructor(picker) {
    super(picker, {
      id: 0,
      name: "days",
      cellClass: "day"
    });
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      const inner = parseHTML(daysTemplate).firstChild;
      this.dow = inner.firstChild;
      this.grid = inner.lastChild;
      this.element.appendChild(inner);
    }
    super.init(options);
  }
  setOptions(options) {
    let updateDOW;
    if (hasProperty(options, "minDate")) {
      this.minDate = options.minDate;
    }
    if (hasProperty(options, "maxDate")) {
      this.maxDate = options.maxDate;
    }
    if (options.datesDisabled) {
      this.datesDisabled = options.datesDisabled;
    }
    if (options.daysOfWeekDisabled) {
      this.daysOfWeekDisabled = options.daysOfWeekDisabled;
      updateDOW = true;
    }
    if (options.daysOfWeekHighlighted) {
      this.daysOfWeekHighlighted = options.daysOfWeekHighlighted;
    }
    if (options.todayHighlight !== void 0) {
      this.todayHighlight = options.todayHighlight;
    }
    if (options.weekStart !== void 0) {
      this.weekStart = options.weekStart;
      this.weekEnd = options.weekEnd;
      updateDOW = true;
    }
    if (options.locale) {
      const locale = this.locale = options.locale;
      this.dayNames = locale.daysMin;
      this.switchLabelFormat = locale.titleFormat;
      updateDOW = true;
    }
    if (options.beforeShowDay !== void 0) {
      this.beforeShow = typeof options.beforeShowDay === "function" ? options.beforeShowDay : void 0;
    }
    if (options.calendarWeeks !== void 0) {
      if (options.calendarWeeks && !this.calendarWeeks) {
        const weeksElem = parseHTML(calendarWeeksTemplate).firstChild;
        this.calendarWeeks = {
          element: weeksElem,
          dow: weeksElem.firstChild,
          weeks: weeksElem.lastChild
        };
        this.element.insertBefore(weeksElem, this.element.firstChild);
      } else if (this.calendarWeeks && !options.calendarWeeks) {
        this.element.removeChild(this.calendarWeeks.element);
        this.calendarWeeks = null;
      }
    }
    if (options.showDaysOfWeek !== void 0) {
      if (options.showDaysOfWeek) {
        showElement(this.dow);
        if (this.calendarWeeks) {
          showElement(this.calendarWeeks.dow);
        }
      } else {
        hideElement(this.dow);
        if (this.calendarWeeks) {
          hideElement(this.calendarWeeks.dow);
        }
      }
    }
    if (updateDOW) {
      Array.from(this.dow.children).forEach((el, index) => {
        const dow = (this.weekStart + index) % 7;
        el.textContent = this.dayNames[dow];
        el.className = this.daysOfWeekDisabled.includes(dow) ? "dow disabled" : "dow";
      });
    }
  }
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    const viewYear = viewDate.getFullYear();
    const viewMonth = viewDate.getMonth();
    const firstOfMonth = dateValue(viewYear, viewMonth, 1);
    const start = dayOfTheWeekOf(firstOfMonth, this.weekStart, this.weekStart);
    this.first = firstOfMonth;
    this.last = dateValue(viewYear, viewMonth + 1, 0);
    this.start = start;
    this.focused = this.picker.viewDate;
  }
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates;
    if (rangepicker) {
      this.range = rangepicker.dates;
    }
  }
  render() {
    this.today = this.todayHighlight ? today() : void 0;
    this.disabled = [...this.datesDisabled];
    const switchLabel = formatDate(this.focused, this.switchLabelFormat, this.locale);
    this.picker.setViewSwitchLabel(switchLabel);
    this.picker.setPrevBtnDisabled(this.first <= this.minDate);
    this.picker.setNextBtnDisabled(this.last >= this.maxDate);
    if (this.calendarWeeks) {
      const startOfWeek = dayOfTheWeekOf(this.first, 1, 1);
      Array.from(this.calendarWeeks.weeks.children).forEach((el, index) => {
        el.textContent = getWeek(addWeeks(startOfWeek, index));
      });
    }
    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      const current = addDays(this.start, index);
      const date = new Date(current);
      const day = date.getDay();
      el.className = `datepicker-cell ${this.cellClass}`;
      el.dataset.date = current;
      el.textContent = date.getDate();
      if (current < this.first) {
        classList.add("prev");
      } else if (current > this.last) {
        classList.add("next");
      }
      if (this.today === current) {
        classList.add("today");
      }
      if (current < this.minDate || current > this.maxDate || this.disabled.includes(current)) {
        classList.add("disabled");
      }
      if (this.daysOfWeekDisabled.includes(day)) {
        classList.add("disabled");
        pushUnique(this.disabled, current);
      }
      if (this.daysOfWeekHighlighted.includes(day)) {
        classList.add("highlighted");
      }
      if (this.range) {
        const [rangeStart, rangeEnd] = this.range;
        if (current > rangeStart && current < rangeEnd) {
          classList.add("range");
        }
        if (current === rangeStart) {
          classList.add("range-start");
        }
        if (current === rangeEnd) {
          classList.add("range-end");
        }
      }
      if (this.selected.includes(current)) {
        classList.add("selected");
      }
      if (current === this.focused) {
        classList.add("focused");
      }
      if (this.beforeShow) {
        this.performBeforeHook(el, current, current);
      }
    });
  }
  refresh() {
    const [rangeStart, rangeEnd] = this.range || [];
    this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((el) => {
      el.classList.remove("range", "range-start", "range-end", "selected", "focused");
    });
    Array.from(this.grid.children).forEach((el) => {
      const current = Number(el.dataset.date);
      const classList = el.classList;
      if (current > rangeStart && current < rangeEnd) {
        classList.add("range");
      }
      if (current === rangeStart) {
        classList.add("range-start");
      }
      if (current === rangeEnd) {
        classList.add("range-end");
      }
      if (this.selected.includes(current)) {
        classList.add("selected");
      }
      if (current === this.focused) {
        classList.add("focused");
      }
    });
  }
  refreshFocus() {
    const index = Math.round((this.focused - this.start) / 864e5);
    this.grid.querySelectorAll(".focused").forEach((el) => {
      el.classList.remove("focused");
    });
    this.grid.children[index].classList.add("focused");
  }
}
function computeMonthRange(range2, thisYear) {
  if (!range2 || !range2[0] || !range2[1]) {
    return;
  }
  const [[startY, startM], [endY, endM]] = range2;
  if (startY > thisYear || endY < thisYear) {
    return;
  }
  return [
    startY === thisYear ? startM : -1,
    endY === thisYear ? endM : 12
  ];
}
class MonthsView extends View {
  constructor(picker) {
    super(picker, {
      id: 1,
      name: "months",
      cellClass: "month"
    });
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      this.grid = this.element;
      this.element.classList.add("months", "datepicker-grid");
      this.grid.appendChild(parseHTML(createTagRepeat("span", 12, { "data-month": (ix) => ix })));
    }
    super.init(options);
  }
  setOptions(options) {
    if (options.locale) {
      this.monthNames = options.locale.monthsShort;
    }
    if (hasProperty(options, "minDate")) {
      if (options.minDate === void 0) {
        this.minYear = this.minMonth = this.minDate = void 0;
      } else {
        const minDateObj = new Date(options.minDate);
        this.minYear = minDateObj.getFullYear();
        this.minMonth = minDateObj.getMonth();
        this.minDate = minDateObj.setDate(1);
      }
    }
    if (hasProperty(options, "maxDate")) {
      if (options.maxDate === void 0) {
        this.maxYear = this.maxMonth = this.maxDate = void 0;
      } else {
        const maxDateObj = new Date(options.maxDate);
        this.maxYear = maxDateObj.getFullYear();
        this.maxMonth = maxDateObj.getMonth();
        this.maxDate = dateValue(this.maxYear, this.maxMonth + 1, 0);
      }
    }
    if (this.isMinView) {
      if (options.datesDisabled) {
        this.datesDisabled = options.datesDisabled;
      }
    } else {
      this.datesDisabled = [];
    }
    if (options.beforeShowMonth !== void 0) {
      this.beforeShow = typeof options.beforeShowMonth === "function" ? options.beforeShowMonth : void 0;
    }
  }
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    this.year = viewDate.getFullYear();
    this.focused = viewDate.getMonth();
  }
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates.reduce((selected, timeValue) => {
      const date = new Date(timeValue);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (selected[year] === void 0) {
        selected[year] = [month];
      } else {
        pushUnique(selected[year], month);
      }
      return selected;
    }, {});
    if (rangepicker && rangepicker.dates) {
      this.range = rangepicker.dates.map((timeValue) => {
        const date = new Date(timeValue);
        return isNaN(date) ? void 0 : [date.getFullYear(), date.getMonth()];
      });
    }
  }
  render() {
    this.disabled = this.datesDisabled.reduce((arr, disabled) => {
      const dt = new Date(disabled);
      if (this.year === dt.getFullYear()) {
        arr.push(dt.getMonth());
      }
      return arr;
    }, []);
    this.picker.setViewSwitchLabel(this.year);
    this.picker.setPrevBtnDisabled(this.year <= this.minYear);
    this.picker.setNextBtnDisabled(this.year >= this.maxYear);
    const selected = this.selected[this.year] || [];
    const yrOutOfRange = this.year < this.minYear || this.year > this.maxYear;
    const isMinYear = this.year === this.minYear;
    const isMaxYear = this.year === this.maxYear;
    const range2 = computeMonthRange(this.range, this.year);
    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      const date = dateValue(this.year, index, 1);
      el.className = `datepicker-cell ${this.cellClass}`;
      if (this.isMinView) {
        el.dataset.date = date;
      }
      el.textContent = this.monthNames[index];
      if (yrOutOfRange || isMinYear && index < this.minMonth || isMaxYear && index > this.maxMonth || this.disabled.includes(index)) {
        classList.add("disabled");
      }
      if (range2) {
        const [rangeStart, rangeEnd] = range2;
        if (index > rangeStart && index < rangeEnd) {
          classList.add("range");
        }
        if (index === rangeStart) {
          classList.add("range-start");
        }
        if (index === rangeEnd) {
          classList.add("range-end");
        }
      }
      if (selected.includes(index)) {
        classList.add("selected");
      }
      if (index === this.focused) {
        classList.add("focused");
      }
      if (this.beforeShow) {
        this.performBeforeHook(el, index, date);
      }
    });
  }
  refresh() {
    const selected = this.selected[this.year] || [];
    const [rangeStart, rangeEnd] = computeMonthRange(this.range, this.year) || [];
    this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((el) => {
      el.classList.remove("range", "range-start", "range-end", "selected", "focused");
    });
    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      if (index > rangeStart && index < rangeEnd) {
        classList.add("range");
      }
      if (index === rangeStart) {
        classList.add("range-start");
      }
      if (index === rangeEnd) {
        classList.add("range-end");
      }
      if (selected.includes(index)) {
        classList.add("selected");
      }
      if (index === this.focused) {
        classList.add("focused");
      }
    });
  }
  refreshFocus() {
    this.grid.querySelectorAll(".focused").forEach((el) => {
      el.classList.remove("focused");
    });
    this.grid.children[this.focused].classList.add("focused");
  }
}
function toTitleCase(word) {
  return [...word].reduce((str, ch, ix) => str += ix ? ch : ch.toUpperCase(), "");
}
class YearsView extends View {
  constructor(picker, config) {
    super(picker, config);
  }
  init(options, onConstruction = true) {
    if (onConstruction) {
      this.navStep = this.step * 10;
      this.beforeShowOption = `beforeShow${toTitleCase(this.cellClass)}`;
      this.grid = this.element;
      this.element.classList.add(this.name, "datepicker-grid");
      this.grid.appendChild(parseHTML(createTagRepeat("span", 12)));
    }
    super.init(options);
  }
  setOptions(options) {
    if (hasProperty(options, "minDate")) {
      if (options.minDate === void 0) {
        this.minYear = this.minDate = void 0;
      } else {
        this.minYear = startOfYearPeriod(options.minDate, this.step);
        this.minDate = dateValue(this.minYear, 0, 1);
      }
    }
    if (hasProperty(options, "maxDate")) {
      if (options.maxDate === void 0) {
        this.maxYear = this.maxDate = void 0;
      } else {
        this.maxYear = startOfYearPeriod(options.maxDate, this.step);
        this.maxDate = dateValue(this.maxYear, 11, 31);
      }
    }
    if (this.isMinView) {
      if (options.datesDisabled) {
        this.datesDisabled = options.datesDisabled;
      }
    } else {
      this.datesDisabled = [];
    }
    if (options[this.beforeShowOption] !== void 0) {
      const beforeShow = options[this.beforeShowOption];
      this.beforeShow = typeof beforeShow === "function" ? beforeShow : void 0;
    }
  }
  updateFocus() {
    const viewDate = new Date(this.picker.viewDate);
    const first = startOfYearPeriod(viewDate, this.navStep);
    const last = first + 9 * this.step;
    this.first = first;
    this.last = last;
    this.start = first - this.step;
    this.focused = startOfYearPeriod(viewDate, this.step);
  }
  updateSelection() {
    const { dates, rangepicker } = this.picker.datepicker;
    this.selected = dates.reduce((years, timeValue) => {
      return pushUnique(years, startOfYearPeriod(timeValue, this.step));
    }, []);
    if (rangepicker && rangepicker.dates) {
      this.range = rangepicker.dates.map((timeValue) => {
        if (timeValue !== void 0) {
          return startOfYearPeriod(timeValue, this.step);
        }
      });
    }
  }
  render() {
    this.disabled = this.datesDisabled.map((disabled) => new Date(disabled).getFullYear());
    this.picker.setViewSwitchLabel(`${this.first}-${this.last}`);
    this.picker.setPrevBtnDisabled(this.first <= this.minYear);
    this.picker.setNextBtnDisabled(this.last >= this.maxYear);
    Array.from(this.grid.children).forEach((el, index) => {
      const classList = el.classList;
      const current = this.start + index * this.step;
      const date = dateValue(current, 0, 1);
      el.className = `datepicker-cell ${this.cellClass}`;
      if (this.isMinView) {
        el.dataset.date = date;
      }
      el.textContent = el.dataset.year = current;
      if (index === 0) {
        classList.add("prev");
      } else if (index === 11) {
        classList.add("next");
      }
      if (current < this.minYear || current > this.maxYear || this.disabled.includes(current)) {
        classList.add("disabled");
      }
      if (this.range) {
        const [rangeStart, rangeEnd] = this.range;
        if (current > rangeStart && current < rangeEnd) {
          classList.add("range");
        }
        if (current === rangeStart) {
          classList.add("range-start");
        }
        if (current === rangeEnd) {
          classList.add("range-end");
        }
      }
      if (this.selected.includes(current)) {
        classList.add("selected");
      }
      if (current === this.focused) {
        classList.add("focused");
      }
      if (this.beforeShow) {
        this.performBeforeHook(el, current, date);
      }
    });
  }
  refresh() {
    const [rangeStart, rangeEnd] = this.range || [];
    this.grid.querySelectorAll(".range, .range-start, .range-end, .selected, .focused").forEach((el) => {
      el.classList.remove("range", "range-start", "range-end", "selected", "focused");
    });
    Array.from(this.grid.children).forEach((el) => {
      const current = Number(el.textContent);
      const classList = el.classList;
      if (current > rangeStart && current < rangeEnd) {
        classList.add("range");
      }
      if (current === rangeStart) {
        classList.add("range-start");
      }
      if (current === rangeEnd) {
        classList.add("range-end");
      }
      if (this.selected.includes(current)) {
        classList.add("selected");
      }
      if (current === this.focused) {
        classList.add("focused");
      }
    });
  }
  refreshFocus() {
    const index = Math.round((this.focused - this.start) / this.step);
    this.grid.querySelectorAll(".focused").forEach((el) => {
      el.classList.remove("focused");
    });
    this.grid.children[index].classList.add("focused");
  }
}
function triggerDatepickerEvent(datepicker, type) {
  const detail = {
    date: datepicker.getDate(),
    viewDate: new Date(datepicker.picker.viewDate),
    viewId: datepicker.picker.currentView.id,
    datepicker
  };
  datepicker.element.dispatchEvent(new CustomEvent(type, { detail }));
}
function goToPrevOrNext(datepicker, direction) {
  const { minDate, maxDate } = datepicker.config;
  const { currentView, viewDate } = datepicker.picker;
  let newViewDate;
  switch (currentView.id) {
    case 0:
      newViewDate = addMonths(viewDate, direction);
      break;
    case 1:
      newViewDate = addYears(viewDate, direction);
      break;
    default:
      newViewDate = addYears(viewDate, direction * currentView.navStep);
  }
  newViewDate = limitToRange(newViewDate, minDate, maxDate);
  datepicker.picker.changeFocus(newViewDate).render();
}
function switchView(datepicker) {
  const viewId = datepicker.picker.currentView.id;
  if (viewId === datepicker.config.maxView) {
    return;
  }
  datepicker.picker.changeView(viewId + 1).render();
}
function unfocus(datepicker) {
  if (datepicker.config.updateOnBlur) {
    datepicker.update({ revert: true });
  } else {
    datepicker.refresh("input");
  }
  datepicker.hide();
}
function goToSelectedMonthOrYear(datepicker, selection) {
  const picker = datepicker.picker;
  const viewDate = new Date(picker.viewDate);
  const viewId = picker.currentView.id;
  const newDate = viewId === 1 ? addMonths(viewDate, selection - viewDate.getMonth()) : addYears(viewDate, selection - viewDate.getFullYear());
  picker.changeFocus(newDate).changeView(viewId - 1).render();
}
function onClickTodayBtn(datepicker) {
  const picker = datepicker.picker;
  const currentDate = today();
  if (datepicker.config.todayBtnMode === 1) {
    if (datepicker.config.autohide) {
      datepicker.setDate(currentDate);
      return;
    }
    datepicker.setDate(currentDate, { render: false });
    picker.update();
  }
  if (picker.viewDate !== currentDate) {
    picker.changeFocus(currentDate);
  }
  picker.changeView(0).render();
}
function onClickClearBtn(datepicker) {
  datepicker.setDate({ clear: true });
}
function onClickViewSwitch(datepicker) {
  switchView(datepicker);
}
function onClickPrevBtn(datepicker) {
  goToPrevOrNext(datepicker, -1);
}
function onClickNextBtn(datepicker) {
  goToPrevOrNext(datepicker, 1);
}
function onClickView(datepicker, ev) {
  const target = findElementInEventPath(ev, ".datepicker-cell");
  if (!target || target.classList.contains("disabled")) {
    return;
  }
  const { id, isMinView } = datepicker.picker.currentView;
  if (isMinView) {
    datepicker.setDate(Number(target.dataset.date));
  } else if (id === 1) {
    goToSelectedMonthOrYear(datepicker, Number(target.dataset.month));
  } else {
    goToSelectedMonthOrYear(datepicker, Number(target.dataset.year));
  }
}
function onMousedownPicker(ev) {
  ev.preventDefault();
}
const orientClasses = ["left", "top", "right", "bottom"].reduce((obj, key) => {
  obj[key] = `datepicker-orient-${key}`;
  return obj;
}, {});
const toPx = (num) => num ? `${num}px` : num;
function processPickerOptions(picker, options) {
  if (options.title !== void 0) {
    if (options.title) {
      picker.controls.title.textContent = options.title;
      showElement(picker.controls.title);
    } else {
      picker.controls.title.textContent = "";
      hideElement(picker.controls.title);
    }
  }
  if (options.prevArrow) {
    const prevBtn = picker.controls.prevBtn;
    emptyChildNodes(prevBtn);
    options.prevArrow.forEach((node) => {
      prevBtn.appendChild(node.cloneNode(true));
    });
  }
  if (options.nextArrow) {
    const nextBtn = picker.controls.nextBtn;
    emptyChildNodes(nextBtn);
    options.nextArrow.forEach((node) => {
      nextBtn.appendChild(node.cloneNode(true));
    });
  }
  if (options.locale) {
    picker.controls.todayBtn.textContent = options.locale.today;
    picker.controls.clearBtn.textContent = options.locale.clear;
  }
  if (options.todayBtn !== void 0) {
    if (options.todayBtn) {
      showElement(picker.controls.todayBtn);
    } else {
      hideElement(picker.controls.todayBtn);
    }
  }
  if (hasProperty(options, "minDate") || hasProperty(options, "maxDate")) {
    const { minDate, maxDate } = picker.datepicker.config;
    picker.controls.todayBtn.disabled = !isInRange(today(), minDate, maxDate);
  }
  if (options.clearBtn !== void 0) {
    if (options.clearBtn) {
      showElement(picker.controls.clearBtn);
    } else {
      hideElement(picker.controls.clearBtn);
    }
  }
}
function computeResetViewDate(datepicker) {
  const { dates, config } = datepicker;
  const viewDate = dates.length > 0 ? lastItemOf(dates) : config.defaultViewDate;
  return limitToRange(viewDate, config.minDate, config.maxDate);
}
function setViewDate(picker, newDate) {
  const oldViewDate = new Date(picker.viewDate);
  const newViewDate = new Date(newDate);
  const { id, year, first, last } = picker.currentView;
  const viewYear = newViewDate.getFullYear();
  picker.viewDate = newDate;
  if (viewYear !== oldViewDate.getFullYear()) {
    triggerDatepickerEvent(picker.datepicker, "changeYear");
  }
  if (newViewDate.getMonth() !== oldViewDate.getMonth()) {
    triggerDatepickerEvent(picker.datepicker, "changeMonth");
  }
  switch (id) {
    case 0:
      return newDate < first || newDate > last;
    case 1:
      return viewYear !== year;
    default:
      return viewYear < first || viewYear > last;
  }
}
function getTextDirection(el) {
  return window.getComputedStyle(el).direction;
}
function findScrollParents(el) {
  const parent = getParent(el);
  if (parent === document.body || !parent) {
    return;
  }
  return window.getComputedStyle(parent).overflow !== "visible" ? parent : findScrollParents(parent);
}
class Picker {
  constructor(datepicker) {
    const { config } = this.datepicker = datepicker;
    const template = pickerTemplate.replace(/%buttonClass%/g, config.buttonClass);
    const element = this.element = parseHTML(template).firstChild;
    const [header, main, footer] = element.firstChild.children;
    const title = header.firstElementChild;
    const [prevBtn, viewSwitch, nextBtn] = header.lastElementChild.children;
    const [todayBtn, clearBtn] = footer.firstChild.children;
    const controls = {
      title,
      prevBtn,
      viewSwitch,
      nextBtn,
      todayBtn,
      clearBtn
    };
    this.main = main;
    this.controls = controls;
    const elementClass = datepicker.inline ? "inline" : "dropdown";
    element.classList.add(`datepicker-${elementClass}`);
    processPickerOptions(this, config);
    this.viewDate = computeResetViewDate(datepicker);
    registerListeners(datepicker, [
      [element, "mousedown", onMousedownPicker],
      [main, "click", onClickView.bind(null, datepicker)],
      [controls.viewSwitch, "click", onClickViewSwitch.bind(null, datepicker)],
      [controls.prevBtn, "click", onClickPrevBtn.bind(null, datepicker)],
      [controls.nextBtn, "click", onClickNextBtn.bind(null, datepicker)],
      [controls.todayBtn, "click", onClickTodayBtn.bind(null, datepicker)],
      [controls.clearBtn, "click", onClickClearBtn.bind(null, datepicker)]
    ]);
    this.views = [
      new DaysView(this),
      new MonthsView(this),
      new YearsView(this, { id: 2, name: "years", cellClass: "year", step: 1 }),
      new YearsView(this, { id: 3, name: "decades", cellClass: "decade", step: 10 })
    ];
    this.currentView = this.views[config.startView];
    this.currentView.render();
    this.main.appendChild(this.currentView.element);
    if (config.container) {
      config.container.appendChild(this.element);
    } else {
      datepicker.inputField.after(this.element);
    }
  }
  setOptions(options) {
    processPickerOptions(this, options);
    this.views.forEach((view) => {
      view.init(options, false);
    });
    this.currentView.render();
  }
  detach() {
    this.element.remove();
  }
  show() {
    if (this.active) {
      return;
    }
    const { datepicker, element } = this;
    if (datepicker.inline) {
      element.classList.add("active");
    } else {
      const inputDirection = getTextDirection(datepicker.inputField);
      if (inputDirection !== getTextDirection(getParent(element))) {
        element.dir = inputDirection;
      } else if (element.dir) {
        element.removeAttribute("dir");
      }
      element.style.visiblity = "hidden";
      element.classList.add("active");
      this.place();
      element.style.visiblity = "";
      if (datepicker.config.disableTouchKeyboard) {
        datepicker.inputField.blur();
      }
    }
    this.active = true;
    triggerDatepickerEvent(datepicker, "show");
  }
  hide() {
    if (!this.active) {
      return;
    }
    this.datepicker.exitEditMode();
    this.element.classList.remove("active");
    this.active = false;
    triggerDatepickerEvent(this.datepicker, "hide");
  }
  place() {
    const { classList, offsetParent, style: style2 } = this.element;
    const { config, inputField } = this.datepicker;
    const {
      width: calendarWidth,
      height: calendarHeight
    } = this.element.getBoundingClientRect();
    const {
      left: inputLeft,
      top: inputTop,
      right: inputRight,
      bottom: inputBottom,
      width: inputWidth,
      height: inputHeight
    } = inputField.getBoundingClientRect();
    let { x: orientX, y: orientY } = config.orientation;
    let left = inputLeft;
    let top = inputTop;
    if (offsetParent === document.body || !offsetParent) {
      left += window.scrollX;
      top += window.scrollY;
    } else {
      const offsetParentRect = offsetParent.getBoundingClientRect();
      left -= offsetParentRect.left - offsetParent.scrollLeft;
      top -= offsetParentRect.top - offsetParent.scrollTop;
    }
    const scrollParent = findScrollParents(inputField);
    let scrollAreaLeft = 0;
    let scrollAreaTop = 0;
    let {
      clientWidth: scrollAreaRight,
      clientHeight: scrollAreaBottom
    } = document.documentElement;
    if (scrollParent) {
      const scrollParentRect = scrollParent.getBoundingClientRect();
      if (scrollParentRect.top > 0) {
        scrollAreaTop = scrollParentRect.top;
      }
      if (scrollParentRect.left > 0) {
        scrollAreaLeft = scrollParentRect.left;
      }
      if (scrollParentRect.right < scrollAreaRight) {
        scrollAreaRight = scrollParentRect.right;
      }
      if (scrollParentRect.bottom < scrollAreaBottom) {
        scrollAreaBottom = scrollParentRect.bottom;
      }
    }
    let adjustment = 0;
    if (orientX === "auto") {
      if (inputLeft < scrollAreaLeft) {
        orientX = "left";
        adjustment = scrollAreaLeft - inputLeft;
      } else if (inputLeft + calendarWidth > scrollAreaRight) {
        orientX = "right";
        if (scrollAreaRight < inputRight) {
          adjustment = scrollAreaRight - inputRight;
        }
      } else if (getTextDirection(inputField) === "rtl") {
        orientX = inputRight - calendarWidth < scrollAreaLeft ? "left" : "right";
      } else {
        orientX = "left";
      }
    }
    if (orientX === "right") {
      left += inputWidth - calendarWidth;
    }
    left += adjustment;
    if (orientY === "auto") {
      if (inputTop - calendarHeight > scrollAreaTop) {
        orientY = inputBottom + calendarHeight > scrollAreaBottom ? "top" : "bottom";
      } else {
        orientY = "bottom";
      }
    }
    if (orientY === "top") {
      top -= calendarHeight;
    } else {
      top += inputHeight;
    }
    classList.remove(...Object.values(orientClasses));
    classList.add(orientClasses[orientX], orientClasses[orientY]);
    style2.left = toPx(left);
    style2.top = toPx(top);
  }
  setViewSwitchLabel(labelText) {
    this.controls.viewSwitch.textContent = labelText;
  }
  setPrevBtnDisabled(disabled) {
    this.controls.prevBtn.disabled = disabled;
  }
  setNextBtnDisabled(disabled) {
    this.controls.nextBtn.disabled = disabled;
  }
  changeView(viewId) {
    const oldView = this.currentView;
    const newView = this.views[viewId];
    if (newView.id !== oldView.id) {
      this.currentView = newView;
      this._renderMethod = "render";
      triggerDatepickerEvent(this.datepicker, "changeView");
      this.main.replaceChild(newView.element, oldView.element);
    }
    return this;
  }
  changeFocus(newViewDate) {
    this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refreshFocus";
    this.views.forEach((view) => {
      view.updateFocus();
    });
    return this;
  }
  update() {
    const newViewDate = computeResetViewDate(this.datepicker);
    this._renderMethod = setViewDate(this, newViewDate) ? "render" : "refresh";
    this.views.forEach((view) => {
      view.updateFocus();
      view.updateSelection();
    });
    return this;
  }
  render(quickRender = true) {
    const renderMethod = quickRender && this._renderMethod || "render";
    delete this._renderMethod;
    this.currentView[renderMethod]();
  }
}
function findNextAvailableOne(date, addFn, increase, testFn, min, max) {
  if (!isInRange(date, min, max)) {
    return;
  }
  if (testFn(date)) {
    const newDate = addFn(date, increase);
    return findNextAvailableOne(newDate, addFn, increase, testFn, min, max);
  }
  return date;
}
function moveByArrowKey(datepicker, ev, direction, vertical) {
  const picker = datepicker.picker;
  const currentView = picker.currentView;
  const step = currentView.step || 1;
  let viewDate = picker.viewDate;
  let addFn;
  let testFn;
  switch (currentView.id) {
    case 0:
      if (vertical) {
        viewDate = addDays(viewDate, direction * 7);
      } else if (ev.ctrlKey || ev.metaKey) {
        viewDate = addYears(viewDate, direction);
      } else {
        viewDate = addDays(viewDate, direction);
      }
      addFn = addDays;
      testFn = (date) => currentView.disabled.includes(date);
      break;
    case 1:
      viewDate = addMonths(viewDate, vertical ? direction * 4 : direction);
      addFn = addMonths;
      testFn = (date) => {
        const dt = new Date(date);
        const { year, disabled } = currentView;
        return dt.getFullYear() === year && disabled.includes(dt.getMonth());
      };
      break;
    default:
      viewDate = addYears(viewDate, direction * (vertical ? 4 : 1) * step);
      addFn = addYears;
      testFn = (date) => currentView.disabled.includes(startOfYearPeriod(date, step));
  }
  viewDate = findNextAvailableOne(
    viewDate,
    addFn,
    direction < 0 ? -step : step,
    testFn,
    currentView.minDate,
    currentView.maxDate
  );
  if (viewDate !== void 0) {
    picker.changeFocus(viewDate).render();
  }
}
function onKeydown(datepicker, ev) {
  const key = ev.key;
  if (key === "Tab") {
    unfocus(datepicker);
    return;
  }
  const picker = datepicker.picker;
  const { id, isMinView } = picker.currentView;
  if (!picker.active) {
    if (key === "ArrowDown") {
      picker.show();
    } else {
      if (key === "Enter") {
        datepicker.update();
      } else if (key === "Escape") {
        picker.show();
      }
      return;
    }
  } else if (datepicker.editMode) {
    if (key === "Enter") {
      datepicker.exitEditMode({ update: true, autohide: datepicker.config.autohide });
    } else if (key === "Escape") {
      picker.hide();
    }
    return;
  } else {
    if (key === "ArrowLeft") {
      if (ev.ctrlKey || ev.metaKey) {
        goToPrevOrNext(datepicker, -1);
      } else if (ev.shiftKey) {
        datepicker.enterEditMode();
        return;
      } else {
        moveByArrowKey(datepicker, ev, -1, false);
      }
    } else if (key === "ArrowRight") {
      if (ev.ctrlKey || ev.metaKey) {
        goToPrevOrNext(datepicker, 1);
      } else if (ev.shiftKey) {
        datepicker.enterEditMode();
        return;
      } else {
        moveByArrowKey(datepicker, ev, 1, false);
      }
    } else if (key === "ArrowUp") {
      if (ev.ctrlKey || ev.metaKey) {
        switchView(datepicker);
      } else if (ev.shiftKey) {
        datepicker.enterEditMode();
        return;
      } else {
        moveByArrowKey(datepicker, ev, -1, true);
      }
    } else if (key === "ArrowDown") {
      if (ev.shiftKey && !ev.ctrlKey && !ev.metaKey) {
        datepicker.enterEditMode();
        return;
      }
      moveByArrowKey(datepicker, ev, 1, true);
    } else if (key === "Enter") {
      if (isMinView) {
        datepicker.setDate(picker.viewDate);
        return;
      }
      picker.changeView(id - 1).render();
    } else {
      if (key === "Escape") {
        picker.hide();
      } else if (key === "Backspace" || key === "Delete" || key.length === 1 && !ev.ctrlKey && !ev.metaKey) {
        datepicker.enterEditMode();
      }
      return;
    }
  }
  ev.preventDefault();
}
function onFocus(datepicker) {
  if (datepicker.config.showOnFocus && !datepicker._showing) {
    datepicker.show();
  }
}
function onMousedown(datepicker, ev) {
  const el = ev.target;
  if (datepicker.picker.active || datepicker.config.showOnClick) {
    el._active = isActiveElement(el);
    el._clicking = setTimeout(() => {
      delete el._active;
      delete el._clicking;
    }, 2e3);
  }
}
function onClickInput(datepicker, ev) {
  const el = ev.target;
  if (!el._clicking) {
    return;
  }
  clearTimeout(el._clicking);
  delete el._clicking;
  if (el._active) {
    datepicker.enterEditMode();
  }
  delete el._active;
  if (datepicker.config.showOnClick) {
    datepicker.show();
  }
}
function onPaste(datepicker, ev) {
  if (ev.clipboardData.types.includes("text/plain")) {
    datepicker.enterEditMode();
  }
}
function onClickOutside(datepicker, ev) {
  const { element, picker } = datepicker;
  if (!picker.active && !isActiveElement(element)) {
    return;
  }
  const pickerElem = picker.element;
  if (findElementInEventPath(ev, (el) => el === element || el === pickerElem)) {
    return;
  }
  unfocus(datepicker);
}
function stringifyDates(dates, config) {
  return dates.map((dt) => formatDate(dt, config.format, config.locale)).join(config.dateDelimiter);
}
function processInputDates(datepicker, inputDates, clear = false) {
  const { config, dates: origDates, rangeSideIndex } = datepicker;
  if (inputDates.length === 0) {
    return clear ? [] : void 0;
  }
  let newDates = inputDates.reduce((dates, dt) => {
    let date = parseDate(dt, config.format, config.locale);
    if (date === void 0) {
      return dates;
    }
    date = regularizeDate(date, config.pickLevel, rangeSideIndex);
    if (isInRange(date, config.minDate, config.maxDate) && !dates.includes(date) && !config.datesDisabled.includes(date) && (config.pickLevel > 0 || !config.daysOfWeekDisabled.includes(new Date(date).getDay()))) {
      dates.push(date);
    }
    return dates;
  }, []);
  if (newDates.length === 0) {
    return;
  }
  if (config.multidate && !clear) {
    newDates = newDates.reduce((dates, date) => {
      if (!origDates.includes(date)) {
        dates.push(date);
      }
      return dates;
    }, origDates.filter((date) => !newDates.includes(date)));
  }
  return config.maxNumberOfDates && newDates.length > config.maxNumberOfDates ? newDates.slice(config.maxNumberOfDates * -1) : newDates;
}
function refreshUI(datepicker, mode = 3, quickRender = true) {
  const { config, picker, inputField } = datepicker;
  if (mode & 2) {
    const newView = picker.active ? config.pickLevel : config.startView;
    picker.update().changeView(newView).render(quickRender);
  }
  if (mode & 1 && inputField) {
    inputField.value = stringifyDates(datepicker.dates, config);
  }
}
function setDate(datepicker, inputDates, options) {
  let { clear, render, autohide, revert } = options;
  if (render === void 0) {
    render = true;
  }
  if (!render) {
    autohide = false;
  } else if (autohide === void 0) {
    autohide = datepicker.config.autohide;
  }
  const newDates = processInputDates(datepicker, inputDates, clear);
  if (!newDates && !revert) {
    return;
  }
  if (newDates && newDates.toString() !== datepicker.dates.toString()) {
    datepicker.dates = newDates;
    refreshUI(datepicker, render ? 3 : 1);
    triggerDatepickerEvent(datepicker, "changeDate");
  } else {
    refreshUI(datepicker, 1);
  }
  if (autohide) {
    datepicker.hide();
  }
}
class Datepicker {
  constructor(element, options = {}, rangepicker = void 0) {
    element.datepicker = this;
    this.element = element;
    const config = this.config = Object.assign({
      buttonClass: options.buttonClass && String(options.buttonClass) || "button",
      container: null,
      defaultViewDate: today(),
      maxDate: void 0,
      minDate: void 0
    }, processOptions(defaultOptions, this));
    const inline = this.inline = element.tagName !== "INPUT";
    let inputField;
    if (inline) {
      config.container = element;
    } else {
      if (options.container) {
        config.container = options.container instanceof HTMLElement ? options.container : document.querySelector(options.container);
      }
      inputField = this.inputField = element;
      inputField.classList.add("datepicker-input");
    }
    if (rangepicker) {
      const index = rangepicker.inputs.indexOf(inputField);
      const datepickers = rangepicker.datepickers;
      if (index < 0 || index > 1 || !Array.isArray(datepickers)) {
        throw Error("Invalid rangepicker object.");
      }
      datepickers[index] = this;
      Object.defineProperty(this, "rangepicker", {
        get() {
          return rangepicker;
        }
      });
      Object.defineProperty(this, "rangeSideIndex", {
        get() {
          return index;
        }
      });
    }
    this._options = options;
    Object.assign(config, processOptions(options, this));
    let initialDates;
    if (inline) {
      initialDates = stringToArray(element.dataset.date, config.dateDelimiter);
      delete element.dataset.date;
    } else {
      initialDates = stringToArray(inputField.value, config.dateDelimiter);
    }
    this.dates = [];
    const inputDateValues = processInputDates(this, initialDates);
    if (inputDateValues && inputDateValues.length > 0) {
      this.dates = inputDateValues;
    }
    if (inputField) {
      inputField.value = stringifyDates(this.dates, config);
    }
    const picker = this.picker = new Picker(this);
    if (inline) {
      this.show();
    } else {
      const onMousedownDocument = onClickOutside.bind(null, this);
      const listeners = [
        [inputField, "keydown", onKeydown.bind(null, this)],
        [inputField, "focus", onFocus.bind(null, this)],
        [inputField, "mousedown", onMousedown.bind(null, this)],
        [inputField, "click", onClickInput.bind(null, this)],
        [inputField, "paste", onPaste.bind(null, this)],
        [document, "mousedown", onMousedownDocument],
        [document, "touchstart", onMousedownDocument],
        [window, "resize", picker.place.bind(picker)]
      ];
      registerListeners(this, listeners);
    }
  }
  static formatDate(date, format, lang) {
    return formatDate(date, format, lang && locales[lang] || locales.en);
  }
  static parseDate(dateStr, format, lang) {
    return parseDate(dateStr, format, lang && locales[lang] || locales.en);
  }
  static get locales() {
    return locales;
  }
  get active() {
    return !!(this.picker && this.picker.active);
  }
  get pickerElement() {
    return this.picker ? this.picker.element : void 0;
  }
  setOptions(options) {
    const picker = this.picker;
    const newOptions = processOptions(options, this);
    Object.assign(this._options, options);
    Object.assign(this.config, newOptions);
    picker.setOptions(newOptions);
    refreshUI(this, 3);
  }
  show() {
    if (this.inputField) {
      if (this.inputField.disabled) {
        return;
      }
      if (!isActiveElement(this.inputField) && !this.config.disableTouchKeyboard) {
        this._showing = true;
        this.inputField.focus();
        delete this._showing;
      }
    }
    this.picker.show();
  }
  hide() {
    if (this.inline) {
      return;
    }
    this.picker.hide();
    this.picker.update().changeView(this.config.startView).render();
  }
  destroy() {
    this.hide();
    unregisterListeners(this);
    this.picker.detach();
    if (!this.inline) {
      this.inputField.classList.remove("datepicker-input");
    }
    delete this.element.datepicker;
    return this;
  }
  getDate(format = void 0) {
    const callback = format ? (date) => formatDate(date, format, this.config.locale) : (date) => new Date(date);
    if (this.config.multidate) {
      return this.dates.map(callback);
    }
    if (this.dates.length > 0) {
      return callback(this.dates[0]);
    }
  }
  setDate(...args) {
    const dates = [...args];
    const opts = {};
    const lastArg = lastItemOf(args);
    if (typeof lastArg === "object" && !Array.isArray(lastArg) && !(lastArg instanceof Date) && lastArg) {
      Object.assign(opts, dates.pop());
    }
    const inputDates = Array.isArray(dates[0]) ? dates[0] : dates;
    setDate(this, inputDates, opts);
  }
  update(options = void 0) {
    if (this.inline) {
      return;
    }
    const opts = Object.assign(options || {}, { clear: true, render: true });
    const inputDates = stringToArray(this.inputField.value, this.config.dateDelimiter);
    setDate(this, inputDates, opts);
  }
  refresh(target = void 0, forceRender = false) {
    if (target && typeof target !== "string") {
      forceRender = target;
      target = void 0;
    }
    let mode;
    if (target === "picker") {
      mode = 2;
    } else if (target === "input") {
      mode = 1;
    } else {
      mode = 3;
    }
    refreshUI(this, mode, !forceRender);
  }
  enterEditMode() {
    if (this.inline || !this.picker.active || this.editMode) {
      return;
    }
    this.editMode = true;
    this.inputField.classList.add("in-edit");
  }
  exitEditMode(options = void 0) {
    if (this.inline || !this.editMode) {
      return;
    }
    const opts = Object.assign({ update: false }, options);
    delete this.editMode;
    this.inputField.classList.remove("in-edit");
    if (opts.update) {
      this.update(opts);
    }
  }
}
document.onreadystatechange = function() {
  if (document.readyState === "interactive" || document.readyState === "complete") {
    const e = document.querySelector('input[data-exec="datepicker"]');
    e != null && new Datepicker(e, {});
  } else
    throw "document.readyState unsupported value";
};
var q = function() {
  this.name = "datagrid-confirm", this.initialize = function(t2) {
    t2.uiHandler.addEventListener("interaction", function(e) {
      var i = e.detail.element.dataset.datagridConfirm;
      typeof i < "u" && (confirm(i) || e.preventDefault());
    }.bind(this));
  };
};
naja.registerExtension(new q());
$(document).on("click", "[data-datagrid-confirm]:not(.ajax)", function(t2) {
  if (!confirm($(t2.target).closest("a").attr("data-datagrid-confirm")))
    return t2.stopPropagation(), t2.preventDefault();
});
var h = function(t2, e) {
  var i = e.init, r = e.success, a = e.before, n = e.complete, d = e.interaction, l = function(s2, g) {
    return this.name = g, this.initialize = function(c) {
      i && c.addEventListener("init", function(o) {
        i(o.detail.defaultOptions);
      }), r && c.addEventListener("success", function(o) {
        r(o.detail.payload, o.detail.options);
      }), c.uiHandler.addEventListener("interaction", function(o) {
        o.detail.options.nette = {
          el: $(o.detail.element)
        }, d && (d(o.detail.options) || o.preventDefault());
      }), a && c.addEventListener("before", function(o) {
        a(o.detail.request, o.detail.options) || o.preventDefault();
      }), n && c.addEventListener("complete", function(o) {
        n(o.detail.request, o.detail.options);
      });
    }, this;
  };
  naja.registerExtension(new l(null, t2));
}, E = function(t2) {
  var e = t2.type || "GET", i = t2.data || null;
  naja.makeRequest(e, t2.url, i, {}).then(t2.success).catch(t2.error);
}, w = function(t2) {
  return naja.uiHandler.submitForm(t2.get(0));
}, y, S, M, T, k, C, L = [].indexOf || function(t2) {
  for (var e = 0, i = this.length; e < i; e++)
    if (e in this && this[e] === t2)
      return e;
  return -1;
};
$(document).on("change", "select[data-autosubmit-per-page]", function() {
  var t2;
  return t2 = $(this).parent().find("input[type=submit]"), t2.length === 0 && (t2 = $(this).parent().find("button[type=submit]")), t2.click();
}).on("change", "select[data-autosubmit]", function() {
  return w($(this).closest("form").first());
}).on("change", "input[data-autosubmit][data-autosubmit-change]", function(t2) {
  var e;
  return t2.which || t2.keyCode, clearTimeout(window.datagrid_autosubmit_timer), e = $(this), window.datagrid_autosubmit_timer = setTimeout(function(i) {
    return function() {
      return w(e.closest("form").first());
    };
  }(), 200);
}).on("keyup", "input[data-autosubmit]", function(t2) {
  var e, i;
  if (i = t2.which || t2.keyCode || 0, !(i !== 13 && (i >= 9 && i <= 40 || i >= 112 && i <= 123)))
    return clearTimeout(window.datagrid_autosubmit_timer), e = $(this), window.datagrid_autosubmit_timer = setTimeout(function(r) {
      return function() {
        return w(e.closest("form").first());
      };
    }(), 200);
}).on("keydown", ".datagrid-inline-edit input", function(t2) {
  var e;
  if (e = t2.which || t2.keyCode || 0, e === 13)
    return t2.stopPropagation(), t2.preventDefault(), $(this).closest("tr").find('.col-action-inline-edit [name="inline_edit[submit]"]').click();
});
$(document).on("keydown", "input[data-datagrid-manualsubmit]", function(t2) {
  var e;
  if (e = t2.which || t2.keyCode || 0, e === 13)
    return t2.stopPropagation(), t2.preventDefault(), w($(this).closest("form").first());
});
C = function(t2) {
  var e, i;
  if (L.call(t2, i) >= 0)
    return t2.path;
  for (i = [], e = t2.target; e !== document.body && e !== null; )
    i.push(e), e = e.parentNode;
  return i;
};
M = function() {
  var t2;
  return t2 = null, document.addEventListener("click", function(e) {
    var i, r, a, n, d, l, f, s2, g, c, o, u, p, m, v, x, b, A, _;
    for (v = C(e), d = 0, u = v.length; d < u; d++)
      if (a = v[d], $(a).is(".col-checkbox") && t2 && e.shiftKey) {
        if (r = $(a).closest("tr"), c = t2.closest("tr"), o = c.closest("tbody"), i = o.find("tr").toArray(), r.index() > c.index() ? _ = i.slice(c.index(), r.index()) : r.index() < c.index() && (_ = i.slice(r.index() + 1, c.index())), !_)
          return;
        for (s2 = 0, p = _.length; s2 < p; s2++)
          A = _[s2], f = $(A).find(".col-checkbox input[type=checkbox]")[0], f && (f.checked = true, l = window.navigator.userAgent.indexOf("MSIE "), l ? (n = document.createEvent("Event"), n.initEvent("change", true, true)) : n = new Event("change", {
            bubbles: true
          }), f.dispatchEvent(n));
      }
    for (x = C(e), b = [], g = 0, m = x.length; g < m; g++)
      a = x[g], $(a).is(".col-checkbox") ? b.push(t2 = $(a)) : b.push(void 0);
    return b;
  });
};
M();
document.addEventListener("change", function(t2) {
  var e, i, r, a, n, d, l, f, s2, g, c, o, u;
  if (n = t2.target.getAttribute("data-check"), n && (i = document.querySelectorAll("input[data-check-all-" + n + "]:checked"), o = document.querySelector(".datagrid-" + n + ' select[name="group_action[group_action]"]'), e = document.querySelectorAll(".datagrid-" + n + ' .row-group-actions *[type="submit"]'), r = document.querySelector(".datagrid-" + n + " .datagrid-selected-rows-count"), i.length ? (e && e.forEach(function(p) {
    p.disabled = false;
  }), o && (o.disabled = false), u = document.querySelectorAll("input[data-check-all-" + n + "]").length, r && (r.innerHTML = i.length + "/" + u)) : (e && e.forEach(function(p) {
    p.disabled = true;
  }), o && (o.disabled = true, o.value = ""), r && (r.innerHTML = "")), l = window.navigator.userAgent.indexOf("MSIE "), l ? (a = document.createEvent("Event"), a.initEvent("change", true, true)) : a = new Event("change", {
    bubbles: true
  }), o && o.dispatchEvent(a)), n = t2.target.getAttribute("data-check-all"), n) {
    for (s2 = document.querySelectorAll("input[type=checkbox][data-check-all-" + n + "]"), c = [], d = 0, g = s2.length; d < g; d++)
      f = s2[d], f.checked = t2.target.checked, l = window.navigator.userAgent.indexOf("MSIE "), l ? (a = document.createEvent("Event"), a.initEvent("change", true, true)) : a = new Event("change", {
        bubbles: true
      }), c.push(f.dispatchEvent(a));
    return c;
  }
});
window.datagridSerializeUrl = function(t2, e) {
  var i = [];
  for (var r in t2)
    if (t2.hasOwnProperty(r)) {
      var a = e ? e + "[" + r + "]" : r, n = t2[r];
      if (n !== null && n !== "")
        if (typeof n == "object") {
          var d = window.datagridSerializeUrl(n, a);
          d && i.push(d);
        } else
          i.push(encodeURIComponent(a) + "=" + encodeURIComponent(n));
    }
  return i.join("&");
};
T = function() {
  if (!(typeof $.fn.sortable > "u"))
    return $(".datagrid [data-sortable]").sortable({
      handle: ".handle-sort",
      items: "tr",
      axis: "y",
      update: function(t2, e) {
        var i, r, a, n, d, l, f;
        return l = e.item.closest("tr[data-id]"), a = l.data("id"), d = null, n = null, l.prev().length && (d = l.prev().data("id")), l.next().length && (n = l.next().data("id")), f = $(this).data("sortable-url"), r = {}, i = l.closest(".datagrid").find("tbody").attr("data-sortable-parent-path"), r[(i + "-item_id").replace(/^-/, "")] = a, d !== null && (r[(i + "-prev_id").replace(/^-/, "")] = d), n !== null && (r[(i + "-next_id").replace(/^-/, "")] = n), E({
          type: "GET",
          url: f,
          data: r,
          error: function(s2, g, c) {
            return alert(s2.statusText);
          }
        });
      },
      helper: function(t2, e) {
        return e.children().each(function() {
          return $(this).width($(this).width());
        }), e;
      }
    });
};
$(function() {
  return T();
});
typeof k > "u" && (k = function() {
  if (!(typeof $(".datagrid-tree-item-children").sortable > "u"))
    return $(".datagrid-tree-item-children").sortable({
      handle: ".handle-sort",
      items: ".datagrid-tree-item:not(.datagrid-tree-header)",
      toleranceElement: "> .datagrid-tree-item-content",
      connectWith: ".datagrid-tree-item-children",
      update: function(t2, e) {
        var i, r, a, n, d, l, f, s2, g;
        if ($(".toggle-tree-to-delete").remove(), s2 = e.item.closest(".datagrid-tree-item[data-id]"), a = s2.data("id"), f = null, n = null, l = null, s2.prev().length && (f = s2.prev().data("id")), s2.next().length && (n = s2.next().data("id")), d = s2.parent().closest(".datagrid-tree-item"), d.length && (d.find(".datagrid-tree-item-children").first().css({
          display: "block"
        }), d.addClass("has-children"), l = d.data("id")), g = $(this).data("sortable-url"), !!g)
          return d.find("[data-toggle-tree]").first().removeClass("hidden"), i = s2.closest(".datagrid-tree").attr("data-sortable-parent-path"), r = {}, r[(i + "-item_id").replace(/^-/, "")] = a, f !== null && (r[(i + "-prev_id").replace(/^-/, "")] = f), n !== null && (r[(i + "-next_id").replace(/^-/, "")] = n), r[(i + "-parent_id").replace(/^-/, "")] = l, E({
            type: "GET",
            url: g,
            data: r,
            error: function(c, o, u) {
              if (u !== "abort")
                return alert(c.statusText);
            }
          });
      },
      stop: function(t2, e) {
        return $(".toggle-tree-to-delete").removeClass("toggle-tree-to-delete");
      },
      start: function(t2, e) {
        var i;
        if (i = e.item.parent().closest(".datagrid-tree-item"), i.length && i.find(".datagrid-tree-item").length === 2)
          return i.find("[data-toggle-tree]").addClass("toggle-tree-to-delete");
      }
    });
});
$(function() {
  return k();
});
h("datagrid.happy", {
  success: function() {
    var t2, e, i, r, a, n, d, l, f, s2, g, c, o, u;
    for (window.happy && window.happy.reset(), d = $(".datagrid"), u = [], l = 0, c = d.length; l < c; l++) {
      for (n = d[l], r = n.classList, i = "", g = 0, o = r.length; g < o; g++)
        t2 = r[g], i = i + "." + t2;
      e = document.querySelectorAll(i + " input[data-check]:checked"), e.length === 1 && e[0].getAttribute("name") === "toggle-all" ? (s2 = document.querySelector(i + " input[name=toggle-all]"), s2 ? (s2.checked = false, f = window.navigator.userAgent.indexOf("MSIE "), f ? (a = document.createEvent("Event"), a.initEvent("change", true, true)) : a = new Event("change", {
        bubbles: true
      }), u.push(s2.dispatchEvent(a))) : u.push(void 0)) : u.push(void 0);
    }
    return u;
  }
});
h("datagrid.sortable", {
  success: function() {
    return T();
  }
});
h("datagrid.forms", {
  success: function() {
    return $(".datagrid").find("form").each(function() {
      return window.Nette.initForm(this);
    });
  }
});
h("datagrid.url", {
  success: function(t2) {
    var e, i, r, a;
    if (t2._datagrid_url && window.history.replaceState && (e = window.location.protocol + "//" + window.location.host, i = window.location.pathname, r = window.datagridSerializeUrl(t2.state).replace(/&+$/gm, ""), r ? a = e + i + "?" + r.replace(/\&*$/, "") : a = e + i, a += window.location.hash, window.location.href !== a))
      return window.history.replaceState({
        path: a
      }, "", a);
  }
});
h("datagrid.sort", {
  success: function(t2) {
    var e, i, r, a;
    if (t2._datagrid_sort) {
      r = t2._datagrid_sort, a = [];
      for (i in r)
        e = r[i], a.push($("#datagrid-sort-" + i).attr("href", e));
      return a;
    }
  }
});
h("datargid.item_detail", {
  start: function(t2, e) {
    var i, r, a;
    if (e.nette && e.nette.el.attr("data-toggle-detail")) {
      if (i = e.nette.el.attr("data-toggle-detail"), a = e.nette.el.attr("data-toggle-detail-grid-fullname"), r = $(".item-detail-" + a + "-id-" + i), r.hasClass("loaded"))
        return r.find(".item-detail-content").length ? (r.hasClass("toggled") ? r.find(".item-detail-content").slideToggle("fast", function(n) {
          return function() {
            return r.toggleClass("toggled");
          };
        }()) : (r.toggleClass("toggled"), r.find(".item-detail-content").slideToggle("fast")), false) : (r.removeClass("toggled"), true);
      r.addClass("loaded");
    }
    return true;
  },
  success: function(t2) {
    var e, i, r;
    if (t2._datagrid_toggle_detail && t2._datagrid_name)
      return e = t2._datagrid_toggle_detail, r = t2._datagrid_name, i = $(".item-detail-" + r + "-id-" + e), i.toggleClass("toggled"), i.find(".item-detail-content").slideToggle("fast");
  }
});
h("datagrid.tree", {
  before: function(t2, e) {
    var i;
    return e.nette && e.nette.el.attr("data-toggle-tree") && (e.nette.el.toggleClass("toggle-rotate"), i = e.nette.el.closest(".datagrid-tree-item").find(".datagrid-tree-item-children").first(), i.hasClass("loaded")) ? (i.slideToggle("fast"), false) : true;
  },
  success: function(t2) {
    var e, i, r, a, n, d, l;
    if (t2._datagrid_tree) {
      r = t2._datagrid_tree, e = $('.datagrid-tree-item[data-id="' + r + '"]').find(".datagrid-tree-item-children").first(), e.addClass("loaded"), n = t2.snippets;
      for (a in n)
        d = n[a], i = $(d), l = $('<div class="datagrid-tree-item" id="' + a + '">'), l.attr("data-id", i.attr("data-id")), l.append(i), i.data("has-children") && l.addClass("has-children"), e.append(l);
      e.addClass("loaded"), e.slideToggle("fast"), naja.load();
    }
    return k();
  }
});
$(document).on("click", "[data-datagrid-editable-url]", function(t2) {
  var e, i, r, a, n, d, l, f, s2, g, c, o;
  if (a = $(this), t2.target.tagName.toLowerCase() !== "a" && !a.hasClass("datagrid-inline-edit") && !a.hasClass("editing")) {
    a.addClass("editing"), n = a.html().trim().replace("<br>", `
`), a.attr("data-datagrid-editable-value") ? o = a.data("datagrid-editable-value") : o = n, a.data("originalValue", n), a.data("valueToEdit", o), a.data("datagrid-editable-type") === "textarea" ? (s2 = $("<textarea>" + o + "</textarea>"), f = parseInt(a.css("padding").replace(/[^-\d\.]/g, ""), 10), d = a.outerHeight(), g = Math.round(parseFloat(a.css("line-height"))), l = (d - 2 * f) / g, s2.attr("rows", Math.round(l))) : a.data("datagrid-editable-type") === "select" ? (s2 = $(a.data("datagrid-editable-element")), s2.find("option[value='" + o + "']").prop("selected", true)) : (s2 = $('<input type="' + a.data("datagrid-editable-type") + '">'), s2.val(o)), r = a.data("datagrid-editable-attrs");
    for (e in r)
      i = r[e], s2.attr(e, i);
    return a.removeClass("edited"), a.html(s2), c = function(u, p) {
      var m;
      return m = p.val(), m !== u.data("valueToEdit") ? E({
        url: u.data("datagrid-editable-url"),
        data: {
          value: m
        },
        type: "POST",
        success: function(v) {
          return u.data("datagrid-editable-type") === "select" ? u.html(s2.find("option[value='" + m + "']").html()) : (v._datagrid_editable_new_value && (m = v._datagrid_editable_new_value), u.html(m)), u.addClass("edited");
        },
        error: function() {
          return u.html(u.data("originalValue")), u.addClass("edited-error");
        }
      }) : u.html(u.data("originalValue")), setTimeout(function() {
        return u.removeClass("editing");
      }, 1200);
    }, a.find("input,textarea,select").focus().on("blur", function() {
      return c(a, $(this));
    }).on("keydown", function(u) {
      if (a.data("datagrid-editable-type") !== "textarea" && u.which === 13)
        return u.stopPropagation(), u.preventDefault(), c(a, $(this));
      if (u.which === 27)
        return u.stopPropagation(), u.preventDefault(), a.removeClass("editing"), a.html(a.data("originalValue"));
    }), a.find("select").on("change", function() {
      return c(a, $(this));
    });
  }
});
h("datagrid.after_inline_edit", {
  success: function(t2) {
    var e = $(".datagrid-" + t2._datagrid_name);
    if (t2._datagrid_inline_edited)
      return e.find("tr[data-id=" + t2._datagrid_inline_edited + "] > td").addClass("edited"), e.find(".datagrid-inline-edit-trigger").removeClass("hidden");
    if (t2._datagrid_inline_edit_cancel)
      return e.find(".datagrid-inline-edit-trigger").removeClass("hidden");
  }
});
$(document).on("mouseup", "[data-datagrid-cancel-inline-add]", function(t2) {
  var e = t2.which || t2.keyCode || 0;
  if (e === 1)
    return t2.stopPropagation(), t2.preventDefault(), $(".datagrid-row-inline-add").addClass("datagrid-row-inline-add-hidden");
});
h("datagrid-toggle-inline-add", {
  success: function(t2) {
    var e = $(".datagrid-" + t2._datagrid_name);
    if (t2._datagrid_inline_adding) {
      var i = e.find(".datagrid-row-inline-add");
      i.hasClass("datagrid-row-inline-add-hidden") && i.removeClass("datagrid-row-inline-add-hidden"), i.find("input:not([readonly]),textarea:not([readonly])").first().focus();
    }
  }
});
y = function() {
  var t2 = $(".selectpicker").first();
  if ($.fn.selectpicker)
    return $.fn.selectpicker.defaults = {
      countSelectedText: t2.data("i18n-selected"),
      iconBase: "",
      tickIcon: t2.data("selected-icon-check")
    };
};
$(function() {
  return y();
});
S = function() {
  var t2;
  if (!!$.fn.selectpicker)
    return t2 = $("[data-datagrid-multiselect-id]"), t2.each(function() {
      var e;
      if ($(this).hasClass("selectpicker"))
        return $(this).removeAttr("id"), e = $(this).data("datagrid-multiselect-id"), $(this).on("loaded.bs.select", function(i) {
          return $(this).parent().attr("style", "display:none;"), $(this).parent().find(".hidden").removeClass("hidden").addClass("btn-default btn-secondary");
        }), $(this).on("rendered.bs.select", function(i) {
          return $(this).parent().attr("id", e);
        });
    });
};
$(function() {
  return S();
});
h("datagrid.fitlerMultiSelect", {
  success: function() {
    if (y(), $.fn.selectpicker)
      return $(".selectpicker").selectpicker({
        iconBase: "fa"
      });
  }
});
h("datagrid.groupActionMultiSelect", {
  success: function() {
    return S();
  }
});
h("datagrid.inline-editing", {
  success: function(t2) {
    var e;
    if (t2._datagrid_inline_editing)
      return e = $(".datagrid-" + t2._datagrid_name), e.find(".datagrid-inline-edit-trigger").addClass("hidden");
  }
});
h("datagrid.redraw-item", {
  success: function(t2) {
    var e;
    if (t2._datagrid_redraw_item_class)
      return e = $("tr[data-id=" + t2._datagrid_redraw_item_id + "]"), e.attr("class", t2._datagrid_redraw_item_class);
  }
});
h("datagrid.reset-filter-by-column", {
  success: function(t2) {
    var e, i, r, a, n, d;
    if (!!t2._datagrid_name && (e = $(".datagrid-" + t2._datagrid_name), e.find("[data-datagrid-reset-filter-by-column]").addClass("hidden"), t2.non_empty_filters && t2.non_empty_filters.length)) {
      for (d = t2.non_empty_filters, r = 0, n = d.length; r < n; r++)
        a = d[r], e.find("[data-datagrid-reset-filter-by-column=" + a + "]").removeClass("hidden");
      return i = e.find(".reset-filter").attr("href"), e.find("[data-datagrid-reset-filter-by-column]").each(function() {
        var l;
        return a = $(this).attr("data-datagrid-reset-filter-by-column"), l = i.replace("do=" + t2._datagrid_name + "-resetFilter", "do=" + t2._datagrid_name + "-resetColumnFilter"), l += "&" + t2._datagrid_name + "-key=" + a, $(this).attr("href", l);
      });
    }
  }
});
var t = function() {
  var e = document.querySelector(".datagrid");
  if (e !== null)
    return naja.makeRequest("GET", e.getAttribute("data-refresh-state"), null, {
      history: "replace"
    });
};
document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", t) : t();
var s = function() {
  this.name = "datagrid-spinners", this.initialize = function(l) {
    l.uiHandler.addEventListener("interaction", function(i) {
      this.element = i.detail.element;
    }.bind(this)), l.addEventListener("before", function(i) {
      if (i.detail.options.nette) {
        let e = this.element, t2 = document.createElement("div");
        t2.classList.add("ublaboo-spinner"), t2.classList.add("ublaboo-spinner-small"), t2.append(
          document.createElement("i"),
          document.createElement("i"),
          document.createElement("i"),
          document.createElement("i")
        );
        let n = function(o) {
          let a = o.closest(".row-grid-bottom").querySelector(".col-per-page");
          a && a.prepend(t2);
        };
        if (e.isEqualNode(document.querySelector('.datagrid [name="group_action[submit]"]')))
          e.after(t2);
        else if ("toggleDetail" in e.dataset) {
          let o = i.detail.options.nette.el.attr("data-toggle-detail"), a = i.detail.options.nette.el.attr("data-toggle-detail-grid-fullname");
          $(".item-detail-" + a + "-id-" + o).hasClass("loaded") || e.classList.add("ublaboo-spinner-icon");
        } else
          (e.classList.contains("datagrid-paginator-button") || e.isEqualNode(document.querySelector(".datagrid .datagrid-per-page-submit")) || e.isEqualNode(document.querySelector(".datagrid .reset-filter"))) && n(e);
      }
    }.bind(this)), l.addEventListener("complete", function(i) {
      if (typeof i.detail.response < "u") {
        const e = document.getElementsByClassName("ublaboo-spinner");
        for (; e.length > 0; )
          e[0].remove();
        const t2 = document.getElementsByClassName("ublaboo-spinner-icon");
        for (let n = 0; n < t2.length; n++)
          t2[n].classList.remove("ublaboo-spinner-icon");
      }
    });
  };
};
naja.registerExtension(new s());
const style = "";
