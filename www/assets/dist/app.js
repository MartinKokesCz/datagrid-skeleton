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
