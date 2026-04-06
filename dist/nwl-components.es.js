var Up = Object.defineProperty, kp = Object.defineProperties;
var Rp = Object.getOwnPropertyDescriptors;
var Nu = Object.getOwnPropertySymbols;
var Wl = Object.prototype.hasOwnProperty, Fl = Object.prototype.propertyIsEnumerable;
var Jo = (i, u, r) => u in i ? Up(i, u, { enumerable: !0, configurable: !0, writable: !0, value: r }) : i[u] = r, St = (i, u) => {
  for (var r in u || (u = {}))
    Wl.call(u, r) && Jo(i, r, u[r]);
  if (Nu)
    for (var r of Nu(u))
      Fl.call(u, r) && Jo(i, r, u[r]);
  return i;
}, _r = (i, u) => kp(i, Rp(u));
var Bl = (i, u) => {
  var r = {};
  for (var s in i)
    Wl.call(i, s) && u.indexOf(s) < 0 && (r[s] = i[s]);
  if (i != null && Nu)
    for (var s of Nu(i))
      u.indexOf(s) < 0 && Fl.call(i, s) && (r[s] = i[s]);
  return r;
};
var wn = (i, u, r) => (Jo(i, typeof u != "symbol" ? u + "" : u, r), r);
var Je = (i, u, r) => new Promise((s, l) => {
  var f = (v) => {
    try {
      p(r.next(v));
    } catch (g) {
      l(g);
    }
  }, d = (v) => {
    try {
      p(r.throw(v));
    } catch (g) {
      l(g);
    }
  }, p = (v) => v.done ? s(v.value) : Promise.resolve(v.value).then(f, d);
  p((r = r.apply(i, u)).next());
});
import { mergeModels as En, useModel as er, withDirectives as bn, openBlock as Y, createElementBlock as Q, mergeProps as Ns, vModelText as ps, reactive as vu, ref as it, watch as Sr, onMounted as Er, onUnmounted as Is, unref as G, createVNode as V, withKeys as Sn, createElementVNode as D, Fragment as Pt, renderList as ee, normalizeClass as ue, toDisplayString as ht, vShow as gi, renderSlot as Zt, getCurrentInstance as Pp, createCommentVNode as oe, createBlock as Qt, withCtx as q, createTextVNode as yt, inject as Ge, toRefs as Qp, computed as Lu, withModifiers as wr, h as Zp, normalizeStyle as zu, setBlockTracking as $l } from "vue";
let Gp = (i = 21) => crypto.getRandomValues(new Uint8Array(i)).reduce((u, r) => (r &= 63, r < 36 ? u += r.toString(36) : r < 62 ? u += (r - 26).toString(36).toUpperCase() : r > 62 ? u += "-" : u += "_", u), "");
const gt = (i, u) => {
  const r = i.__vccOpts || i;
  for (const [s, l] of u)
    r[s] = l;
  return r;
}, Wp = {
  __name: "TextInput",
  props: /* @__PURE__ */ En({
    placeholder: {
      type: String,
      default: ""
    },
    disabled: Boolean
  }, {
    modelValue: {
      type: String,
      default: ""
    },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ En(["update:modelValue"], ["update:modelValue"]),
  setup(i, { emit: u }) {
    const r = i, s = er(i, "modelValue"), l = u, f = (d) => {
      l("update:modelValue", d.target.value);
    };
    return (d, p) => bn((Y(), Q("input", Ns({ type: "text" }, r, {
      onInput: f,
      "onUpdate:modelValue": p[0] || (p[0] = (v) => s.value = v)
    }), null, 16)), [
      [ps, s.value]
    ]);
  }
}, pi = /* @__PURE__ */ gt(Wp, [["__scopeId", "data-v-4d629f4f"]]);
const Fp = ["aria-owns", "aria-expanded"], Bp = ["id"], $p = {
  key: 0,
  class: "loading"
}, Hp = ["onClick", "id", "aria-selected"], Vp = {
  __name: "Autocomplete",
  props: {
    items: {
      type: Array,
      default: () => []
    },
    isAsync: {
      type: Boolean,
      required: !1,
      default: !1
    },
    ariaLabel: {
      type: String,
      required: !0
    },
    defaultValue: {
      type: String,
      required: !1,
      default: ""
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    extraSelectArgs: {
      type: Array,
      default: () => []
    },
    extractResultText: {
      type: Function,
      default: (i) => i
    }
  },
  emits: ["input", "select"],
  setup(i, { emit: u }) {
    const r = i, s = vu({
      isOpen: !1,
      results: [],
      search: r.defaultValue,
      isLoading: !1,
      arrowCounter: 0,
      activedescendant: ""
    }), l = it(null);
    Sr(r.items, () => {
      s.results = r.items, s.isLoading = !1;
    });
    const f = u, d = () => {
      s.results = s.items.filter((x) => x.toLowerCase().indexOf(s.search.toLowerCase()) > -1);
    }, p = () => {
      f("input", s.search), s.isOpen = !0, r.isAsync ? s.isLoading = !0 : d();
    }, v = (x) => `result-item-${x}`, g = () => {
      s.activedescendant = v(s.arrowCounter);
    }, I = (x) => x === s.arrowCounter, T = (x) => (s.search = r.extractResultText(x), s.isOpen = !1, f("select", x, ...r.extraSelectArgs), !1), z = () => {
      s.isOpen && (s.arrowCounter = (s.arrowCounter + 1) % s.results.length, g());
    }, j = () => {
      s.isOpen && (s.arrowCounter = s.arrowCounter > 0 ? s.arrowCounter - 1 : s.results.length - 1, g());
    }, b = () => {
      T(s.results[s.arrowCounter]);
    }, R = (x) => {
      l.value.contains(x.target) || (s.isOpen = !1, s.arrowCounter = -1);
    }, _ = Gp();
    return Er(() => {
      document.addEventListener("click", R);
    }), Is(() => {
      document.removeEventListener("click", R);
    }), (x, K) => (Y(), Q("div", {
      ref_key: "root",
      ref: l,
      class: "autocomplete",
      role: "combobox",
      "aria-haspopup": "listbox",
      "aria-owns": `${G(_)}-autocomplete-results`,
      "aria-expanded": s.isOpen
    }, [
      V(pi, {
        onInput: p,
        modelValue: s.search,
        "onUpdate:modelValue": K[0] || (K[0] = (P) => s.search = P),
        onKeydown: [
          Sn(z, ["down"]),
          Sn(j, ["up"]),
          Sn(b, ["enter"])
        ],
        role: "searchbox",
        "aria-autocomplete": "list",
        "aria-controls": `${G(_)}-autocomplete-results`,
        "aria-label": i.ariaLabel,
        "aria-activedescendant": s.activedescendant,
        disabled: r.disabled
      }, null, 8, ["modelValue", "aria-controls", "aria-label", "aria-activedescendant", "disabled"]),
      bn(D("ul", {
        id: `${G(_)}-autocomplete-results`,
        class: "autocomplete-results",
        role: "listbox"
      }, [
        s.isLoading ? (Y(), Q("li", $p, " Loading results... ")) : (Y(!0), Q(Pt, { key: 1 }, ee(s.results, (P, lt) => (Y(), Q("li", {
          key: lt,
          onClick: (mt) => T(P),
          class: ue(["autocomplete-result", { "is-active": I(lt) }]),
          role: "option",
          id: v(lt),
          "aria-selected": I(lt)
        }, ht(r.extractResultText(P)), 11, Hp))), 128))
      ], 8, Bp), [
        [gi, s.isOpen]
      ])
    ], 8, Fp));
  }
}, Xp = /* @__PURE__ */ gt(Vp, [["__scopeId", "data-v-5d982740"]]);
const Kp = ["title", "disabled"], Jp = {
  __name: "Button",
  props: {
    className: {
      type: String,
      default: null
    },
    title: {
      type: String,
      default: null
    },
    disabled: Boolean,
    small: Boolean
  },
  setup(i) {
    const u = i, r = { small: u.small === !0 };
    return u.className !== null && (r[u.className] = !0), (s, l) => (Y(), Q("button", {
      title: i.title,
      disabled: i.disabled,
      class: ue(r)
    }, [
      Zt(s.$slots, "default", {}, void 0, !0)
    ], 8, Kp));
  }
}, Yt = /* @__PURE__ */ gt(Jp, [["__scopeId", "data-v-6942c6e7"]]);
const qp = ["value"], tI = {
  __name: "Select",
  props: {
    disabled: Boolean,
    modelValue: {
      type: String,
      required: !0
    }
  },
  emits: ["update:modelValue"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = (f) => {
      s("update:modelValue", f.target.value);
    };
    return (f, d) => (Y(), Q("select", Ns(r, {
      value: i.modelValue,
      onInput: l
    }), [
      Zt(f.$slots, "default", {}, void 0, !0)
    ], 16, qp));
  }
}, Hl = /* @__PURE__ */ gt(tI, [["__scopeId", "data-v-8ecfa0f7"]]);
const eI = {
  __name: "TextArea",
  props: /* @__PURE__ */ En({
    placeholder: {
      type: String,
      default: ""
    },
    disabled: Boolean
  }, {
    modelValue: {
      type: String,
      default: ""
    },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ En(["update:modelValue"], ["update:modelValue"]),
  setup(i, { emit: u }) {
    const r = i, s = er(i, "modelValue"), l = u, f = (d) => {
      l("update:modelValue", d.target.value);
    };
    return (d, p) => bn((Y(), Q("textarea", Ns(r, {
      onInput: f,
      "onUpdate:modelValue": p[0] || (p[0] = (v) => s.value = v)
    }), null, 16)), [
      [ps, s.value]
    ]);
  }
}, nI = /* @__PURE__ */ gt(eI, [["__scopeId", "data-v-7cd36e47"]]);
const rI = ["id"], iI = {
  __name: "Table",
  props: {
    id: String
  },
  setup(i) {
    const u = i;
    return (r, s) => (Y(), Q("table", {
      id: u.id
    }, [
      Zt(r.$slots, "default", {}, void 0, !0)
    ], 8, rI));
  }
}, Ii = /* @__PURE__ */ gt(iI, [["__scopeId", "data-v-5d6d3864"]]);
const uI = ["aria-checked"], oI = {
  __name: "Checkbox",
  props: {
    modelValue: Boolean
  },
  emits: ["update:modelValue", "change"],
  setup(i, { emit: u }) {
    const r = u, s = i, l = it(s.modelValue);
    typeof s.modelValue == "string" && (l.value, s.modelValue);
    const f = (d) => {
      d != null && d !== " " || (l.value = !l.value, r("change", l.value), r("update:modelValue", l.value));
    };
    return (d, p) => (Y(), Q("span", {
      role: "checkbox",
      "aria-checked": l.value,
      onClick: p[0] || (p[0] = (v) => f()),
      onKeydown: p[1] || (p[1] = (v) => f(v.key)),
      tabindex: "0",
      "aria-label": "label"
    }, null, 40, uI));
  }
}, sI = /* @__PURE__ */ gt(oI, [["__scopeId", "data-v-f2341197"]]);
const aI = { class: "tabs" }, lI = ["onClick"], cI = {
  __name: "Tabs",
  setup(i) {
    const u = it(0), s = Pp().vnode.children.default(), l = {
      render: () => s[u.value]
    }, f = (d) => {
      u.value = d;
    };
    return (d, p) => (Y(), Q("div", aI, [
      D("ul", null, [
        (Y(!0), Q(Pt, null, ee(G(s), (v, g) => (Y(), Q(Pt, null, [
          v && v.props ? (Y(), Q("li", {
            key: v.props.title,
            onClick: (I) => f(g),
            class: ue({ selected: g == u.value })
          }, ht(v.props.title), 11, lI)) : oe("", !0)
        ], 64))), 256))
      ]),
      oe("", !0),
      (Y(), Qt(l, { key: u.value }))
    ]));
  }
}, Pz = /* @__PURE__ */ gt(cI, [["__scopeId", "data-v-9e8a7527"]]);
const MI = { class: "content" }, fI = {
  __name: "Tab",
  props: {
    title: {
      type: String,
      required: !0
    }
  },
  setup(i) {
    return (u, r) => (Y(), Q("div", MI, [
      Zt(u.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Qz = /* @__PURE__ */ gt(fI, [["__scopeId", "data-v-41512210"]]);
const gI = { class: "dialog" }, dI = { class: "contents" }, NI = { class: "scrollable" }, pI = ["onBlur"], II = { class: "actions" }, hI = {
  __name: "ImportFilesDialog",
  props: {
    files: {
      type: Array,
      required: !0
    }
  },
  setup(i) {
    const r = it(i.files);
    return (s, l) => (Y(), Q("div", gI, [
      D("div", dI, [
        D("div", NI, [
          D("table", null, [
            l[2] || (l[2] = D("thead", null, [
              D("tr", null, [
                D("th", null, "URL"),
                D("th", null, "Name")
              ])
            ], -1)),
            D("tbody", null, [
              (Y(!0), Q(Pt, null, ee(r.value, (f) => (Y(), Q("tr", {
                key: f.source
              }, [
                D("td", {
                  contentEditable: "true",
                  onBlur: (d) => f.source = d.currentTarget.textContent
                }, ht(f.source), 41, pI),
                D("td", null, ht(f.name), 1)
              ]))), 128))
            ])
          ])
        ]),
        D("div", II, [
          V(Yt, {
            "class-name": "push-button",
            onClick: l[0] || (l[0] = (f) => s.$emit("import", r.value))
          }, {
            default: q(() => l[3] || (l[3] = [
              yt(" Import ")
            ])),
            _: 1
          }),
          V(Yt, {
            "class-name": "push-button",
            onClick: l[1] || (l[1] = (f) => s.$emit("cancel"))
          }, {
            default: q(() => l[4] || (l[4] = [
              yt(" Cancel ")
            ])),
            _: 1
          })
        ])
      ])
    ]));
  }
}, TI = /* @__PURE__ */ gt(hI, [["__scopeId", "data-v-7a3b05ec"]]);
const yI = {}, mI = { class: "container" }, zI = { class: "side" }, AI = { class: "content" };
function DI(i, u) {
  return Y(), Q("div", mI, [
    D("div", zI, [
      Zt(i.$slots, "side", {}, void 0, !0)
    ]),
    D("div", AI, [
      Zt(i.$slots, "content", {}, void 0, !0)
    ])
  ]);
}
const Ic = /* @__PURE__ */ gt(yI, [["render", DI], ["__scopeId", "data-v-4b92cc95"]]);
const jI = { class: "wrapper" }, vI = ["onClick"], LI = ["value"], _I = ["value"], CI = { class: "actions" }, xI = {
  __name: "PureAnnotations",
  props: {
    annotations: {
      type: Array,
      required: !0
    }
  },
  emits: [
    "addAnnotation",
    "removeAnnotations",
    "updateAnnotation"
  ],
  setup(i, { emit: u }) {
    const { fetchLabelSets: r, annotationTypes: s } = Ge("config"), l = i, f = u, d = vu([]);
    (() => Je(this, null, function* () {
      d.push(...yield r());
    }))();
    const v = it(null), g = (R, _) => {
      v.value = _;
    }, I = (R, _) => {
      f("updateAnnotation", R, St(St({}, l.annotations[R]), _));
    }, T = (R, _) => {
      const x = l.annotations.indexOf(R);
      x < 0 || I(x, { name: _ });
    }, z = (R, _) => {
      const x = l.annotations.indexOf(R);
      if (x < 0)
        return;
      const K = { type: _ };
      _ === "text" ? K.values = "" : d.every((P) => P.source !== l.annotations[x].values) && (K.values = d[0].source), I(x, K);
    }, j = (R, _) => {
      const x = l.annotations.indexOf(R);
      x < 0 || I(x, { values: _ });
    }, b = (R, _) => {
      const x = l.annotations.indexOf(R);
      x < 0 || I(x, { display: _ });
    };
    return (R, _) => (Y(), Q("div", jI, [
      _[5] || (_[5] = D("h2", null, "Annotations", -1)),
      V(Ii, { id: "annotations" }, {
        default: q(() => [
          _[2] || (_[2] = D("thead", null, [
            D("tr", null, [
              D("th", null, "Name"),
              D("th", null, "Type"),
              D("th", null, "Value"),
              D("th", null, "Display")
            ])
          ], -1)),
          D("tbody", null, [
            (Y(!0), Q(Pt, null, ee(i.annotations, (x, K) => (Y(), Q("tr", {
              key: K,
              class: ue({ selected: v.value === K }),
              onClick: (P) => g(P, K)
            }, [
              D("td", null, [
                V(pi, {
                  modelValue: x.name,
                  "onUpdate:modelValue": (P) => x.name = P,
                  placeholder: "Enter annotation name",
                  onBlur: (P) => T(x, P.target.value),
                  onKeyup: Sn((P) => T(x, P.target.value), ["enter"])
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur", "onKeyup"])
              ]),
              D("td", null, [
                V(Hl, {
                  modelValue: x.type,
                  "onUpdate:modelValue": (P) => x.type = P,
                  onChange: (P) => z(x, P.target.value)
                }, {
                  default: q(() => [
                    (Y(!0), Q(Pt, null, ee(G(s), (P) => (Y(), Q("option", {
                      key: `${x.name}${P}`,
                      value: P
                    }, ht(P), 9, LI))), 128))
                  ]),
                  _: 2
                }, 1032, ["modelValue", "onUpdate:modelValue", "onChange"])
              ]),
              D("td", null, [
                x.type !== "text" ? (Y(), Qt(Hl, {
                  key: 0,
                  modelValue: x.values,
                  "onUpdate:modelValue": (P) => x.values = P,
                  onChange: (P) => j(x, P.target.value)
                }, {
                  default: q(() => [
                    (Y(!0), Q(Pt, null, ee(d, (P) => (Y(), Q("option", {
                      value: P.source,
                      key: `${x.name}${P.source}`
                    }, ht(P.name), 9, _I))), 128))
                  ]),
                  _: 2
                }, 1032, ["modelValue", "onUpdate:modelValue", "onChange"])) : oe("", !0)
              ]),
              D("td", null, [
                V(sI, {
                  modelValue: x.display,
                  "onUpdate:modelValue": (P) => x.display = P,
                  onChange: (P) => b(x, P)
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onChange"])
              ])
            ], 10, vI))), 128))
          ])
        ]),
        _: 1
      }),
      D("div", CI, [
        V(Yt, {
          small: !0,
          onClick: _[0] || (_[0] = (x) => R.$emit("addAnnotation")),
          title: "Add annotation"
        }, {
          default: q(() => _[3] || (_[3] = [
            yt(" + ")
          ])),
          _: 1
        }),
        V(Yt, {
          small: !0,
          onClick: _[1] || (_[1] = (x) => R.$emit("removeAnnotations", [v.value])),
          title: "Remove selected annotations",
          disabled: v.value == null
        }, {
          default: q(() => _[4] || (_[4] = [
            yt(" - ")
          ])),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, wI = /* @__PURE__ */ gt(xI, [["__scopeId", "data-v-99e79309"]]);
var ai = typeof globalThis != "undefined" ? globalThis : typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : {};
function OI(i) {
  return i && i.__esModule && Object.prototype.hasOwnProperty.call(i, "default") ? i.default : i;
}
var Au = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
Au.exports;
(function(i, u) {
  (function() {
    var r, s = "4.17.21", l = 200, f = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", d = "Expected a function", p = "Invalid `variable` option passed into `_.template`", v = "__lodash_hash_undefined__", g = 500, I = "__lodash_placeholder__", T = 1, z = 2, j = 4, b = 1, R = 2, _ = 1, x = 2, K = 4, P = 8, lt = 16, mt = 32, ct = 64, dt = 128, Vt = 256, ut = 512, zt = 30, Nn = "...", Yn = 800, ae = 16, ur = 1, Yr = 2, Ur = 3, qe = 1 / 0, We = 9007199254740991, Eu = 17976931348623157e292, Un = 0 / 0, Ae = 4294967295, kr = Ae - 1, Et = Ae >>> 1, hi = [
      ["ary", dt],
      ["bind", _],
      ["bindKey", x],
      ["curry", P],
      ["curryRight", lt],
      ["flip", ut],
      ["partial", mt],
      ["partialRight", ct],
      ["rearg", Vt]
    ], Dt = "[object Arguments]", kn = "[object Array]", Lt = "[object AsyncFunction]", be = "[object Boolean]", tn = "[object Date]", Ti = "[object DOMException]", pn = "[object Error]", Rn = "[object Function]", Rr = "[object GeneratorFunction]", Gt = "[object Map]", en = "[object Number]", nn = "[object Null]", de = "[object Object]", or = "[object Promise]", In = "[object Proxy]", Fe = "[object RegExp]", Xt = "[object Set]", hn = "[object String]", Pn = "[object Symbol]", bu = "[object Undefined]", rn = "[object WeakMap]", Qn = "[object WeakSet]", De = "[object ArrayBuffer]", Ne = "[object DataView]", sr = "[object Float32Array]", ar = "[object Float64Array]", lr = "[object Int8Array]", Zn = "[object Int16Array]", cr = "[object Int32Array]", Tn = "[object Uint8Array]", yn = "[object Uint8ClampedArray]", pe = "[object Uint16Array]", Be = "[object Uint32Array]", Pr = /\b__p \+= '';/g, Qr = /\b(__p \+=) '' \+/g, Yu = /(__e\(.*?\)|\b__t\)) \+\n'';/g, $e = /&(?:amp|lt|gt|quot|#39);/g, yi = /[&<>"']/g, Uu = RegExp($e.source), bt = RegExp(yi.source), mn = /<%-([\s\S]+?)%>/g, ku = /<%([\s\S]+?)%>/g, Zr = /<%=([\s\S]+?)%>/g, Gr = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, mi = /^\w*$/, zi = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, Wr = /[\\^$.*+?()[\]{}|]/g, Mr = RegExp(Wr.source), Gn = /^\s+/, Ru = /\s/, le = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, fr = /\{\n\/\* \[wrapped with (.+)\] \*/, Ai = /,? & /, Di = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, Fr = /[()=,{}\[\]\/\s]/, Wn = /\\(\\)?/g, Ye = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, Br = /\w*$/, ji = /^[-+]0x[0-9a-f]+$/i, vi = /^0b[01]+$/i, Li = /^\[object .+?Constructor\]$/, Pu = /^0o[0-7]+$/i, F = /^(?:0|[1-9]\d*)$/, y = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, E = /($^)/, U = /['\n\r\u2028\u2029\\]/g, st = "\\ud800-\\udfff", Kt = "\\u0300-\\u036f", Wt = "\\ufe20-\\ufe2f", Ut = "\\u20d0-\\u20ff", He = Kt + Wt + Ut, Ct = "\\u2700-\\u27bf", gr = "a-z\\xdf-\\xf6\\xf8-\\xff", _i = "\\xac\\xb1\\xd7\\xf7", ms = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", Ec = "\\u2000-\\u206f", bc = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", zs = "A-Z\\xc0-\\xd6\\xd8-\\xde", As = "\\ufe0e\\ufe0f", Ds = _i + ms + Ec + bc, Qu = "['’]", Yc = "[" + st + "]", js = "[" + Ds + "]", Ci = "[" + He + "]", vs = "\\d+", Uc = "[" + Ct + "]", Ls = "[" + gr + "]", _s = "[^" + st + Ds + vs + Ct + gr + zs + "]", Zu = "\\ud83c[\\udffb-\\udfff]", kc = "(?:" + Ci + "|" + Zu + ")", Cs = "[^" + st + "]", Gu = "(?:\\ud83c[\\udde6-\\uddff]){2}", Wu = "[\\ud800-\\udbff][\\udc00-\\udfff]", dr = "[" + zs + "]", xs = "\\u200d", ws = "(?:" + Ls + "|" + _s + ")", Rc = "(?:" + dr + "|" + _s + ")", Os = "(?:" + Qu + "(?:d|ll|m|re|s|t|ve))?", Ss = "(?:" + Qu + "(?:D|LL|M|RE|S|T|VE))?", Es = kc + "?", bs = "[" + As + "]?", Pc = "(?:" + xs + "(?:" + [Cs, Gu, Wu].join("|") + ")" + bs + Es + ")*", Qc = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", Zc = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", Ys = bs + Es + Pc, Gc = "(?:" + [Uc, Gu, Wu].join("|") + ")" + Ys, Wc = "(?:" + [Cs + Ci + "?", Ci, Gu, Wu, Yc].join("|") + ")", Fc = RegExp(Qu, "g"), Bc = RegExp(Ci, "g"), Fu = RegExp(Zu + "(?=" + Zu + ")|" + Wc + Ys, "g"), $c = RegExp([
      dr + "?" + Ls + "+" + Os + "(?=" + [js, dr, "$"].join("|") + ")",
      Rc + "+" + Ss + "(?=" + [js, dr + ws, "$"].join("|") + ")",
      dr + "?" + ws + "+" + Os,
      dr + "+" + Ss,
      Zc,
      Qc,
      vs,
      Gc
    ].join("|"), "g"), Hc = RegExp("[" + xs + st + He + As + "]"), Vc = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, Xc = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ], Kc = -1, jt = {};
    jt[sr] = jt[ar] = jt[lr] = jt[Zn] = jt[cr] = jt[Tn] = jt[yn] = jt[pe] = jt[Be] = !0, jt[Dt] = jt[kn] = jt[De] = jt[be] = jt[Ne] = jt[tn] = jt[pn] = jt[Rn] = jt[Gt] = jt[en] = jt[de] = jt[Fe] = jt[Xt] = jt[hn] = jt[rn] = !1;
    var At = {};
    At[Dt] = At[kn] = At[De] = At[Ne] = At[be] = At[tn] = At[sr] = At[ar] = At[lr] = At[Zn] = At[cr] = At[Gt] = At[en] = At[de] = At[Fe] = At[Xt] = At[hn] = At[Pn] = At[Tn] = At[yn] = At[pe] = At[Be] = !0, At[pn] = At[Rn] = At[rn] = !1;
    var Jc = {
      // Latin-1 Supplement block.
      À: "A",
      Á: "A",
      Â: "A",
      Ã: "A",
      Ä: "A",
      Å: "A",
      à: "a",
      á: "a",
      â: "a",
      ã: "a",
      ä: "a",
      å: "a",
      Ç: "C",
      ç: "c",
      Ð: "D",
      ð: "d",
      È: "E",
      É: "E",
      Ê: "E",
      Ë: "E",
      è: "e",
      é: "e",
      ê: "e",
      ë: "e",
      Ì: "I",
      Í: "I",
      Î: "I",
      Ï: "I",
      ì: "i",
      í: "i",
      î: "i",
      ï: "i",
      Ñ: "N",
      ñ: "n",
      Ò: "O",
      Ó: "O",
      Ô: "O",
      Õ: "O",
      Ö: "O",
      Ø: "O",
      ò: "o",
      ó: "o",
      ô: "o",
      õ: "o",
      ö: "o",
      ø: "o",
      Ù: "U",
      Ú: "U",
      Û: "U",
      Ü: "U",
      ù: "u",
      ú: "u",
      û: "u",
      ü: "u",
      Ý: "Y",
      ý: "y",
      ÿ: "y",
      Æ: "Ae",
      æ: "ae",
      Þ: "Th",
      þ: "th",
      ß: "ss",
      // Latin Extended-A block.
      Ā: "A",
      Ă: "A",
      Ą: "A",
      ā: "a",
      ă: "a",
      ą: "a",
      Ć: "C",
      Ĉ: "C",
      Ċ: "C",
      Č: "C",
      ć: "c",
      ĉ: "c",
      ċ: "c",
      č: "c",
      Ď: "D",
      Đ: "D",
      ď: "d",
      đ: "d",
      Ē: "E",
      Ĕ: "E",
      Ė: "E",
      Ę: "E",
      Ě: "E",
      ē: "e",
      ĕ: "e",
      ė: "e",
      ę: "e",
      ě: "e",
      Ĝ: "G",
      Ğ: "G",
      Ġ: "G",
      Ģ: "G",
      ĝ: "g",
      ğ: "g",
      ġ: "g",
      ģ: "g",
      Ĥ: "H",
      Ħ: "H",
      ĥ: "h",
      ħ: "h",
      Ĩ: "I",
      Ī: "I",
      Ĭ: "I",
      Į: "I",
      İ: "I",
      ĩ: "i",
      ī: "i",
      ĭ: "i",
      į: "i",
      ı: "i",
      Ĵ: "J",
      ĵ: "j",
      Ķ: "K",
      ķ: "k",
      ĸ: "k",
      Ĺ: "L",
      Ļ: "L",
      Ľ: "L",
      Ŀ: "L",
      Ł: "L",
      ĺ: "l",
      ļ: "l",
      ľ: "l",
      ŀ: "l",
      ł: "l",
      Ń: "N",
      Ņ: "N",
      Ň: "N",
      Ŋ: "N",
      ń: "n",
      ņ: "n",
      ň: "n",
      ŋ: "n",
      Ō: "O",
      Ŏ: "O",
      Ő: "O",
      ō: "o",
      ŏ: "o",
      ő: "o",
      Ŕ: "R",
      Ŗ: "R",
      Ř: "R",
      ŕ: "r",
      ŗ: "r",
      ř: "r",
      Ś: "S",
      Ŝ: "S",
      Ş: "S",
      Š: "S",
      ś: "s",
      ŝ: "s",
      ş: "s",
      š: "s",
      Ţ: "T",
      Ť: "T",
      Ŧ: "T",
      ţ: "t",
      ť: "t",
      ŧ: "t",
      Ũ: "U",
      Ū: "U",
      Ŭ: "U",
      Ů: "U",
      Ű: "U",
      Ų: "U",
      ũ: "u",
      ū: "u",
      ŭ: "u",
      ů: "u",
      ű: "u",
      ų: "u",
      Ŵ: "W",
      ŵ: "w",
      Ŷ: "Y",
      ŷ: "y",
      Ÿ: "Y",
      Ź: "Z",
      Ż: "Z",
      Ž: "Z",
      ź: "z",
      ż: "z",
      ž: "z",
      Ĳ: "IJ",
      ĳ: "ij",
      Œ: "Oe",
      œ: "oe",
      ŉ: "'n",
      ſ: "s"
    }, qc = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }, tM = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    }, eM = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    }, nM = parseFloat, rM = parseInt, Us = typeof ai == "object" && ai && ai.Object === Object && ai, iM = typeof self == "object" && self && self.Object === Object && self, Bt = Us || iM || Function("return this")(), Bu = u && !u.nodeType && u, Fn = Bu && !0 && i && !i.nodeType && i, ks = Fn && Fn.exports === Bu, $u = ks && Us.process, je = function() {
      try {
        var m = Fn && Fn.require && Fn.require("util").types;
        return m || $u && $u.binding && $u.binding("util");
      } catch (C) {
      }
    }(), Rs = je && je.isArrayBuffer, Ps = je && je.isDate, Qs = je && je.isMap, Zs = je && je.isRegExp, Gs = je && je.isSet, Ws = je && je.isTypedArray;
    function Ie(m, C, L) {
      switch (L.length) {
        case 0:
          return m.call(C);
        case 1:
          return m.call(C, L[0]);
        case 2:
          return m.call(C, L[0], L[1]);
        case 3:
          return m.call(C, L[0], L[1], L[2]);
      }
      return m.apply(C, L);
    }
    function uM(m, C, L, Z) {
      for (var X = -1, Nt = m == null ? 0 : m.length; ++X < Nt; ) {
        var kt = m[X];
        C(Z, kt, L(kt), m);
      }
      return Z;
    }
    function ve(m, C) {
      for (var L = -1, Z = m == null ? 0 : m.length; ++L < Z && C(m[L], L, m) !== !1; )
        ;
      return m;
    }
    function oM(m, C) {
      for (var L = m == null ? 0 : m.length; L-- && C(m[L], L, m) !== !1; )
        ;
      return m;
    }
    function Fs(m, C) {
      for (var L = -1, Z = m == null ? 0 : m.length; ++L < Z; )
        if (!C(m[L], L, m))
          return !1;
      return !0;
    }
    function zn(m, C) {
      for (var L = -1, Z = m == null ? 0 : m.length, X = 0, Nt = []; ++L < Z; ) {
        var kt = m[L];
        C(kt, L, m) && (Nt[X++] = kt);
      }
      return Nt;
    }
    function xi(m, C) {
      var L = m == null ? 0 : m.length;
      return !!L && Nr(m, C, 0) > -1;
    }
    function Hu(m, C, L) {
      for (var Z = -1, X = m == null ? 0 : m.length; ++Z < X; )
        if (L(C, m[Z]))
          return !0;
      return !1;
    }
    function vt(m, C) {
      for (var L = -1, Z = m == null ? 0 : m.length, X = Array(Z); ++L < Z; )
        X[L] = C(m[L], L, m);
      return X;
    }
    function An(m, C) {
      for (var L = -1, Z = C.length, X = m.length; ++L < Z; )
        m[X + L] = C[L];
      return m;
    }
    function Vu(m, C, L, Z) {
      var X = -1, Nt = m == null ? 0 : m.length;
      for (Z && Nt && (L = m[++X]); ++X < Nt; )
        L = C(L, m[X], X, m);
      return L;
    }
    function sM(m, C, L, Z) {
      var X = m == null ? 0 : m.length;
      for (Z && X && (L = m[--X]); X--; )
        L = C(L, m[X], X, m);
      return L;
    }
    function Xu(m, C) {
      for (var L = -1, Z = m == null ? 0 : m.length; ++L < Z; )
        if (C(m[L], L, m))
          return !0;
      return !1;
    }
    var aM = Ku("length");
    function lM(m) {
      return m.split("");
    }
    function cM(m) {
      return m.match(Di) || [];
    }
    function Bs(m, C, L) {
      var Z;
      return L(m, function(X, Nt, kt) {
        if (C(X, Nt, kt))
          return Z = Nt, !1;
      }), Z;
    }
    function wi(m, C, L, Z) {
      for (var X = m.length, Nt = L + (Z ? 1 : -1); Z ? Nt-- : ++Nt < X; )
        if (C(m[Nt], Nt, m))
          return Nt;
      return -1;
    }
    function Nr(m, C, L) {
      return C === C ? zM(m, C, L) : wi(m, $s, L);
    }
    function MM(m, C, L, Z) {
      for (var X = L - 1, Nt = m.length; ++X < Nt; )
        if (Z(m[X], C))
          return X;
      return -1;
    }
    function $s(m) {
      return m !== m;
    }
    function Hs(m, C) {
      var L = m == null ? 0 : m.length;
      return L ? qu(m, C) / L : Un;
    }
    function Ku(m) {
      return function(C) {
        return C == null ? r : C[m];
      };
    }
    function Ju(m) {
      return function(C) {
        return m == null ? r : m[C];
      };
    }
    function Vs(m, C, L, Z, X) {
      return X(m, function(Nt, kt, Tt) {
        L = Z ? (Z = !1, Nt) : C(L, Nt, kt, Tt);
      }), L;
    }
    function fM(m, C) {
      var L = m.length;
      for (m.sort(C); L--; )
        m[L] = m[L].value;
      return m;
    }
    function qu(m, C) {
      for (var L, Z = -1, X = m.length; ++Z < X; ) {
        var Nt = C(m[Z]);
        Nt !== r && (L = L === r ? Nt : L + Nt);
      }
      return L;
    }
    function to(m, C) {
      for (var L = -1, Z = Array(m); ++L < m; )
        Z[L] = C(L);
      return Z;
    }
    function gM(m, C) {
      return vt(C, function(L) {
        return [L, m[L]];
      });
    }
    function Xs(m) {
      return m && m.slice(0, ta(m) + 1).replace(Gn, "");
    }
    function he(m) {
      return function(C) {
        return m(C);
      };
    }
    function eo(m, C) {
      return vt(C, function(L) {
        return m[L];
      });
    }
    function $r(m, C) {
      return m.has(C);
    }
    function Ks(m, C) {
      for (var L = -1, Z = m.length; ++L < Z && Nr(C, m[L], 0) > -1; )
        ;
      return L;
    }
    function Js(m, C) {
      for (var L = m.length; L-- && Nr(C, m[L], 0) > -1; )
        ;
      return L;
    }
    function dM(m, C) {
      for (var L = m.length, Z = 0; L--; )
        m[L] === C && ++Z;
      return Z;
    }
    var NM = Ju(Jc), pM = Ju(qc);
    function IM(m) {
      return "\\" + eM[m];
    }
    function hM(m, C) {
      return m == null ? r : m[C];
    }
    function pr(m) {
      return Hc.test(m);
    }
    function TM(m) {
      return Vc.test(m);
    }
    function yM(m) {
      for (var C, L = []; !(C = m.next()).done; )
        L.push(C.value);
      return L;
    }
    function no(m) {
      var C = -1, L = Array(m.size);
      return m.forEach(function(Z, X) {
        L[++C] = [X, Z];
      }), L;
    }
    function qs(m, C) {
      return function(L) {
        return m(C(L));
      };
    }
    function Dn(m, C) {
      for (var L = -1, Z = m.length, X = 0, Nt = []; ++L < Z; ) {
        var kt = m[L];
        (kt === C || kt === I) && (m[L] = I, Nt[X++] = L);
      }
      return Nt;
    }
    function Oi(m) {
      var C = -1, L = Array(m.size);
      return m.forEach(function(Z) {
        L[++C] = Z;
      }), L;
    }
    function mM(m) {
      var C = -1, L = Array(m.size);
      return m.forEach(function(Z) {
        L[++C] = [Z, Z];
      }), L;
    }
    function zM(m, C, L) {
      for (var Z = L - 1, X = m.length; ++Z < X; )
        if (m[Z] === C)
          return Z;
      return -1;
    }
    function AM(m, C, L) {
      for (var Z = L + 1; Z--; )
        if (m[Z] === C)
          return Z;
      return Z;
    }
    function Ir(m) {
      return pr(m) ? jM(m) : aM(m);
    }
    function Ue(m) {
      return pr(m) ? vM(m) : lM(m);
    }
    function ta(m) {
      for (var C = m.length; C-- && Ru.test(m.charAt(C)); )
        ;
      return C;
    }
    var DM = Ju(tM);
    function jM(m) {
      for (var C = Fu.lastIndex = 0; Fu.test(m); )
        ++C;
      return C;
    }
    function vM(m) {
      return m.match(Fu) || [];
    }
    function LM(m) {
      return m.match($c) || [];
    }
    var _M = function m(C) {
      C = C == null ? Bt : hr.defaults(Bt.Object(), C, hr.pick(Bt, Xc));
      var L = C.Array, Z = C.Date, X = C.Error, Nt = C.Function, kt = C.Math, Tt = C.Object, ro = C.RegExp, CM = C.String, Le = C.TypeError, Si = L.prototype, xM = Nt.prototype, Tr = Tt.prototype, Ei = C["__core-js_shared__"], bi = xM.toString, It = Tr.hasOwnProperty, wM = 0, ea = function() {
        var t = /[^.]+$/.exec(Ei && Ei.keys && Ei.keys.IE_PROTO || "");
        return t ? "Symbol(src)_1." + t : "";
      }(), Yi = Tr.toString, OM = bi.call(Tt), SM = Bt._, EM = ro(
        "^" + bi.call(It).replace(Wr, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
      ), Ui = ks ? C.Buffer : r, jn = C.Symbol, ki = C.Uint8Array, na = Ui ? Ui.allocUnsafe : r, Ri = qs(Tt.getPrototypeOf, Tt), ra = Tt.create, ia = Tr.propertyIsEnumerable, Pi = Si.splice, ua = jn ? jn.isConcatSpreadable : r, Hr = jn ? jn.iterator : r, Bn = jn ? jn.toStringTag : r, Qi = function() {
        try {
          var t = Kn(Tt, "defineProperty");
          return t({}, "", {}), t;
        } catch (e) {
        }
      }(), bM = C.clearTimeout !== Bt.clearTimeout && C.clearTimeout, YM = Z && Z.now !== Bt.Date.now && Z.now, UM = C.setTimeout !== Bt.setTimeout && C.setTimeout, Zi = kt.ceil, Gi = kt.floor, io = Tt.getOwnPropertySymbols, kM = Ui ? Ui.isBuffer : r, oa = C.isFinite, RM = Si.join, PM = qs(Tt.keys, Tt), Rt = kt.max, Jt = kt.min, QM = Z.now, ZM = C.parseInt, sa = kt.random, GM = Si.reverse, uo = Kn(C, "DataView"), Vr = Kn(C, "Map"), oo = Kn(C, "Promise"), yr = Kn(C, "Set"), Xr = Kn(C, "WeakMap"), Kr = Kn(Tt, "create"), Wi = Xr && new Xr(), mr = {}, WM = Jn(uo), FM = Jn(Vr), BM = Jn(oo), $M = Jn(yr), HM = Jn(Xr), Fi = jn ? jn.prototype : r, Jr = Fi ? Fi.valueOf : r, aa = Fi ? Fi.toString : r;
      function c(t) {
        if (xt(t) && !J(t) && !(t instanceof at)) {
          if (t instanceof _e)
            return t;
          if (It.call(t, "__wrapped__"))
            return ll(t);
        }
        return new _e(t);
      }
      var zr = function() {
        function t() {
        }
        return function(e) {
          if (!_t(e))
            return {};
          if (ra)
            return ra(e);
          t.prototype = e;
          var n = new t();
          return t.prototype = r, n;
        };
      }();
      function Bi() {
      }
      function _e(t, e) {
        this.__wrapped__ = t, this.__actions__ = [], this.__chain__ = !!e, this.__index__ = 0, this.__values__ = r;
      }
      c.templateSettings = {
        /**
         * Used to detect `data` property values to be HTML-escaped.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        escape: mn,
        /**
         * Used to detect code to be evaluated.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        evaluate: ku,
        /**
         * Used to detect `data` property values to inject.
         *
         * @memberOf _.templateSettings
         * @type {RegExp}
         */
        interpolate: Zr,
        /**
         * Used to reference the data object in the template text.
         *
         * @memberOf _.templateSettings
         * @type {string}
         */
        variable: "",
        /**
         * Used to import variables into the compiled template.
         *
         * @memberOf _.templateSettings
         * @type {Object}
         */
        imports: {
          /**
           * A reference to the `lodash` function.
           *
           * @memberOf _.templateSettings.imports
           * @type {Function}
           */
          _: c
        }
      }, c.prototype = Bi.prototype, c.prototype.constructor = c, _e.prototype = zr(Bi.prototype), _e.prototype.constructor = _e;
      function at(t) {
        this.__wrapped__ = t, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = Ae, this.__views__ = [];
      }
      function VM() {
        var t = new at(this.__wrapped__);
        return t.__actions__ = ce(this.__actions__), t.__dir__ = this.__dir__, t.__filtered__ = this.__filtered__, t.__iteratees__ = ce(this.__iteratees__), t.__takeCount__ = this.__takeCount__, t.__views__ = ce(this.__views__), t;
      }
      function XM() {
        if (this.__filtered__) {
          var t = new at(this);
          t.__dir__ = -1, t.__filtered__ = !0;
        } else
          t = this.clone(), t.__dir__ *= -1;
        return t;
      }
      function KM() {
        var t = this.__wrapped__.value(), e = this.__dir__, n = J(t), o = e < 0, a = n ? t.length : 0, M = cg(0, a, this.__views__), N = M.start, h = M.end, A = h - N, w = o ? h : N - 1, O = this.__iteratees__, S = O.length, k = 0, W = Jt(A, this.__takeCount__);
        if (!n || !o && a == A && W == A)
          return Oa(t, this.__actions__);
        var $ = [];
        t:
          for (; A-- && k < W; ) {
            w += e;
            for (var et = -1, H = t[w]; ++et < S; ) {
              var ot = O[et], Mt = ot.iteratee, me = ot.type, ie = Mt(H);
              if (me == Yr)
                H = ie;
              else if (!ie) {
                if (me == ur)
                  continue t;
                break t;
              }
            }
            $[k++] = H;
          }
        return $;
      }
      at.prototype = zr(Bi.prototype), at.prototype.constructor = at;
      function $n(t) {
        var e = -1, n = t == null ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var o = t[e];
          this.set(o[0], o[1]);
        }
      }
      function JM() {
        this.__data__ = Kr ? Kr(null) : {}, this.size = 0;
      }
      function qM(t) {
        var e = this.has(t) && delete this.__data__[t];
        return this.size -= e ? 1 : 0, e;
      }
      function tf(t) {
        var e = this.__data__;
        if (Kr) {
          var n = e[t];
          return n === v ? r : n;
        }
        return It.call(e, t) ? e[t] : r;
      }
      function ef(t) {
        var e = this.__data__;
        return Kr ? e[t] !== r : It.call(e, t);
      }
      function nf(t, e) {
        var n = this.__data__;
        return this.size += this.has(t) ? 0 : 1, n[t] = Kr && e === r ? v : e, this;
      }
      $n.prototype.clear = JM, $n.prototype.delete = qM, $n.prototype.get = tf, $n.prototype.has = ef, $n.prototype.set = nf;
      function un(t) {
        var e = -1, n = t == null ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var o = t[e];
          this.set(o[0], o[1]);
        }
      }
      function rf() {
        this.__data__ = [], this.size = 0;
      }
      function uf(t) {
        var e = this.__data__, n = $i(e, t);
        if (n < 0)
          return !1;
        var o = e.length - 1;
        return n == o ? e.pop() : Pi.call(e, n, 1), --this.size, !0;
      }
      function of(t) {
        var e = this.__data__, n = $i(e, t);
        return n < 0 ? r : e[n][1];
      }
      function sf(t) {
        return $i(this.__data__, t) > -1;
      }
      function af(t, e) {
        var n = this.__data__, o = $i(n, t);
        return o < 0 ? (++this.size, n.push([t, e])) : n[o][1] = e, this;
      }
      un.prototype.clear = rf, un.prototype.delete = uf, un.prototype.get = of, un.prototype.has = sf, un.prototype.set = af;
      function on(t) {
        var e = -1, n = t == null ? 0 : t.length;
        for (this.clear(); ++e < n; ) {
          var o = t[e];
          this.set(o[0], o[1]);
        }
      }
      function lf() {
        this.size = 0, this.__data__ = {
          hash: new $n(),
          map: new (Vr || un)(),
          string: new $n()
        };
      }
      function cf(t) {
        var e = uu(this, t).delete(t);
        return this.size -= e ? 1 : 0, e;
      }
      function Mf(t) {
        return uu(this, t).get(t);
      }
      function ff(t) {
        return uu(this, t).has(t);
      }
      function gf(t, e) {
        var n = uu(this, t), o = n.size;
        return n.set(t, e), this.size += n.size == o ? 0 : 1, this;
      }
      on.prototype.clear = lf, on.prototype.delete = cf, on.prototype.get = Mf, on.prototype.has = ff, on.prototype.set = gf;
      function Hn(t) {
        var e = -1, n = t == null ? 0 : t.length;
        for (this.__data__ = new on(); ++e < n; )
          this.add(t[e]);
      }
      function df(t) {
        return this.__data__.set(t, v), this;
      }
      function Nf(t) {
        return this.__data__.has(t);
      }
      Hn.prototype.add = Hn.prototype.push = df, Hn.prototype.has = Nf;
      function ke(t) {
        var e = this.__data__ = new un(t);
        this.size = e.size;
      }
      function pf() {
        this.__data__ = new un(), this.size = 0;
      }
      function If(t) {
        var e = this.__data__, n = e.delete(t);
        return this.size = e.size, n;
      }
      function hf(t) {
        return this.__data__.get(t);
      }
      function Tf(t) {
        return this.__data__.has(t);
      }
      function yf(t, e) {
        var n = this.__data__;
        if (n instanceof un) {
          var o = n.__data__;
          if (!Vr || o.length < l - 1)
            return o.push([t, e]), this.size = ++n.size, this;
          n = this.__data__ = new on(o);
        }
        return n.set(t, e), this.size = n.size, this;
      }
      ke.prototype.clear = pf, ke.prototype.delete = If, ke.prototype.get = hf, ke.prototype.has = Tf, ke.prototype.set = yf;
      function la(t, e) {
        var n = J(t), o = !n && qn(t), a = !n && !o && xn(t), M = !n && !o && !a && vr(t), N = n || o || a || M, h = N ? to(t.length, CM) : [], A = h.length;
        for (var w in t)
          (e || It.call(t, w)) && !(N && // Safari 9 has enumerable `arguments.length` in strict mode.
          (w == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
          a && (w == "offset" || w == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
          M && (w == "buffer" || w == "byteLength" || w == "byteOffset") || // Skip index properties.
          cn(w, A))) && h.push(w);
        return h;
      }
      function ca(t) {
        var e = t.length;
        return e ? t[ho(0, e - 1)] : r;
      }
      function mf(t, e) {
        return ou(ce(t), Vn(e, 0, t.length));
      }
      function zf(t) {
        return ou(ce(t));
      }
      function so(t, e, n) {
        (n !== r && !Re(t[e], n) || n === r && !(e in t)) && sn(t, e, n);
      }
      function qr(t, e, n) {
        var o = t[e];
        (!(It.call(t, e) && Re(o, n)) || n === r && !(e in t)) && sn(t, e, n);
      }
      function $i(t, e) {
        for (var n = t.length; n--; )
          if (Re(t[n][0], e))
            return n;
        return -1;
      }
      function Af(t, e, n, o) {
        return vn(t, function(a, M, N) {
          e(o, a, n(a), N);
        }), o;
      }
      function Ma(t, e) {
        return t && Xe(e, Ft(e), t);
      }
      function Df(t, e) {
        return t && Xe(e, fe(e), t);
      }
      function sn(t, e, n) {
        e == "__proto__" && Qi ? Qi(t, e, {
          configurable: !0,
          enumerable: !0,
          value: n,
          writable: !0
        }) : t[e] = n;
      }
      function ao(t, e) {
        for (var n = -1, o = e.length, a = L(o), M = t == null; ++n < o; )
          a[n] = M ? r : Go(t, e[n]);
        return a;
      }
      function Vn(t, e, n) {
        return t === t && (n !== r && (t = t <= n ? t : n), e !== r && (t = t >= e ? t : e)), t;
      }
      function Ce(t, e, n, o, a, M) {
        var N, h = e & T, A = e & z, w = e & j;
        if (n && (N = a ? n(t, o, a, M) : n(t)), N !== r)
          return N;
        if (!_t(t))
          return t;
        var O = J(t);
        if (O) {
          if (N = fg(t), !h)
            return ce(t, N);
        } else {
          var S = qt(t), k = S == Rn || S == Rr;
          if (xn(t))
            return ba(t, h);
          if (S == de || S == Dt || k && !a) {
            if (N = A || k ? {} : tl(t), !h)
              return A ? eg(t, Df(N, t)) : tg(t, Ma(N, t));
          } else {
            if (!At[S])
              return a ? t : {};
            N = gg(t, S, h);
          }
        }
        M || (M = new ke());
        var W = M.get(t);
        if (W)
          return W;
        M.set(t, N), Cl(t) ? t.forEach(function(H) {
          N.add(Ce(H, e, n, H, t, M));
        }) : Ll(t) && t.forEach(function(H, ot) {
          N.set(ot, Ce(H, e, n, ot, t, M));
        });
        var $ = w ? A ? Co : _o : A ? fe : Ft, et = O ? r : $(t);
        return ve(et || t, function(H, ot) {
          et && (ot = H, H = t[ot]), qr(N, ot, Ce(H, e, n, ot, t, M));
        }), N;
      }
      function jf(t) {
        var e = Ft(t);
        return function(n) {
          return fa(n, t, e);
        };
      }
      function fa(t, e, n) {
        var o = n.length;
        if (t == null)
          return !o;
        for (t = Tt(t); o--; ) {
          var a = n[o], M = e[a], N = t[a];
          if (N === r && !(a in t) || !M(N))
            return !1;
        }
        return !0;
      }
      function ga(t, e, n) {
        if (typeof t != "function")
          throw new Le(d);
        return oi(function() {
          t.apply(r, n);
        }, e);
      }
      function ti(t, e, n, o) {
        var a = -1, M = xi, N = !0, h = t.length, A = [], w = e.length;
        if (!h)
          return A;
        n && (e = vt(e, he(n))), o ? (M = Hu, N = !1) : e.length >= l && (M = $r, N = !1, e = new Hn(e));
        t:
          for (; ++a < h; ) {
            var O = t[a], S = n == null ? O : n(O);
            if (O = o || O !== 0 ? O : 0, N && S === S) {
              for (var k = w; k--; )
                if (e[k] === S)
                  continue t;
              A.push(O);
            } else
              M(e, S, o) || A.push(O);
          }
        return A;
      }
      var vn = Pa(Ve), da = Pa(co, !0);
      function vf(t, e) {
        var n = !0;
        return vn(t, function(o, a, M) {
          return n = !!e(o, a, M), n;
        }), n;
      }
      function Hi(t, e, n) {
        for (var o = -1, a = t.length; ++o < a; ) {
          var M = t[o], N = e(M);
          if (N != null && (h === r ? N === N && !ye(N) : n(N, h)))
            var h = N, A = M;
        }
        return A;
      }
      function Lf(t, e, n, o) {
        var a = t.length;
        for (n = tt(n), n < 0 && (n = -n > a ? 0 : a + n), o = o === r || o > a ? a : tt(o), o < 0 && (o += a), o = n > o ? 0 : wl(o); n < o; )
          t[n++] = e;
        return t;
      }
      function Na(t, e) {
        var n = [];
        return vn(t, function(o, a, M) {
          e(o, a, M) && n.push(o);
        }), n;
      }
      function $t(t, e, n, o, a) {
        var M = -1, N = t.length;
        for (n || (n = Ng), a || (a = []); ++M < N; ) {
          var h = t[M];
          e > 0 && n(h) ? e > 1 ? $t(h, e - 1, n, o, a) : An(a, h) : o || (a[a.length] = h);
        }
        return a;
      }
      var lo = Qa(), pa = Qa(!0);
      function Ve(t, e) {
        return t && lo(t, e, Ft);
      }
      function co(t, e) {
        return t && pa(t, e, Ft);
      }
      function Vi(t, e) {
        return zn(e, function(n) {
          return Mn(t[n]);
        });
      }
      function Xn(t, e) {
        e = _n(e, t);
        for (var n = 0, o = e.length; t != null && n < o; )
          t = t[Ke(e[n++])];
        return n && n == o ? t : r;
      }
      function Ia(t, e, n) {
        var o = e(t);
        return J(t) ? o : An(o, n(t));
      }
      function ne(t) {
        return t == null ? t === r ? bu : nn : Bn && Bn in Tt(t) ? lg(t) : zg(t);
      }
      function Mo(t, e) {
        return t > e;
      }
      function _f(t, e) {
        return t != null && It.call(t, e);
      }
      function Cf(t, e) {
        return t != null && e in Tt(t);
      }
      function xf(t, e, n) {
        return t >= Jt(e, n) && t < Rt(e, n);
      }
      function fo(t, e, n) {
        for (var o = n ? Hu : xi, a = t[0].length, M = t.length, N = M, h = L(M), A = 1 / 0, w = []; N--; ) {
          var O = t[N];
          N && e && (O = vt(O, he(e))), A = Jt(O.length, A), h[N] = !n && (e || a >= 120 && O.length >= 120) ? new Hn(N && O) : r;
        }
        O = t[0];
        var S = -1, k = h[0];
        t:
          for (; ++S < a && w.length < A; ) {
            var W = O[S], $ = e ? e(W) : W;
            if (W = n || W !== 0 ? W : 0, !(k ? $r(k, $) : o(w, $, n))) {
              for (N = M; --N; ) {
                var et = h[N];
                if (!(et ? $r(et, $) : o(t[N], $, n)))
                  continue t;
              }
              k && k.push($), w.push(W);
            }
          }
        return w;
      }
      function wf(t, e, n, o) {
        return Ve(t, function(a, M, N) {
          e(o, n(a), M, N);
        }), o;
      }
      function ei(t, e, n) {
        e = _n(e, t), t = il(t, e);
        var o = t == null ? t : t[Ke(we(e))];
        return o == null ? r : Ie(o, t, n);
      }
      function ha(t) {
        return xt(t) && ne(t) == Dt;
      }
      function Of(t) {
        return xt(t) && ne(t) == De;
      }
      function Sf(t) {
        return xt(t) && ne(t) == tn;
      }
      function ni(t, e, n, o, a) {
        return t === e ? !0 : t == null || e == null || !xt(t) && !xt(e) ? t !== t && e !== e : Ef(t, e, n, o, ni, a);
      }
      function Ef(t, e, n, o, a, M) {
        var N = J(t), h = J(e), A = N ? kn : qt(t), w = h ? kn : qt(e);
        A = A == Dt ? de : A, w = w == Dt ? de : w;
        var O = A == de, S = w == de, k = A == w;
        if (k && xn(t)) {
          if (!xn(e))
            return !1;
          N = !0, O = !1;
        }
        if (k && !O)
          return M || (M = new ke()), N || vr(t) ? Ka(t, e, n, o, a, M) : sg(t, e, A, n, o, a, M);
        if (!(n & b)) {
          var W = O && It.call(t, "__wrapped__"), $ = S && It.call(e, "__wrapped__");
          if (W || $) {
            var et = W ? t.value() : t, H = $ ? e.value() : e;
            return M || (M = new ke()), a(et, H, n, o, M);
          }
        }
        return k ? (M || (M = new ke()), ag(t, e, n, o, a, M)) : !1;
      }
      function bf(t) {
        return xt(t) && qt(t) == Gt;
      }
      function go(t, e, n, o) {
        var a = n.length, M = a, N = !o;
        if (t == null)
          return !M;
        for (t = Tt(t); a--; ) {
          var h = n[a];
          if (N && h[2] ? h[1] !== t[h[0]] : !(h[0] in t))
            return !1;
        }
        for (; ++a < M; ) {
          h = n[a];
          var A = h[0], w = t[A], O = h[1];
          if (N && h[2]) {
            if (w === r && !(A in t))
              return !1;
          } else {
            var S = new ke();
            if (o)
              var k = o(w, O, A, t, e, S);
            if (!(k === r ? ni(O, w, b | R, o, S) : k))
              return !1;
          }
        }
        return !0;
      }
      function Ta(t) {
        if (!_t(t) || Ig(t))
          return !1;
        var e = Mn(t) ? EM : Li;
        return e.test(Jn(t));
      }
      function Yf(t) {
        return xt(t) && ne(t) == Fe;
      }
      function Uf(t) {
        return xt(t) && qt(t) == Xt;
      }
      function kf(t) {
        return xt(t) && fu(t.length) && !!jt[ne(t)];
      }
      function ya(t) {
        return typeof t == "function" ? t : t == null ? ge : typeof t == "object" ? J(t) ? Aa(t[0], t[1]) : za(t) : Zl(t);
      }
      function No(t) {
        if (!ui(t))
          return PM(t);
        var e = [];
        for (var n in Tt(t))
          It.call(t, n) && n != "constructor" && e.push(n);
        return e;
      }
      function Rf(t) {
        if (!_t(t))
          return mg(t);
        var e = ui(t), n = [];
        for (var o in t)
          o == "constructor" && (e || !It.call(t, o)) || n.push(o);
        return n;
      }
      function po(t, e) {
        return t < e;
      }
      function ma(t, e) {
        var n = -1, o = Me(t) ? L(t.length) : [];
        return vn(t, function(a, M, N) {
          o[++n] = e(a, M, N);
        }), o;
      }
      function za(t) {
        var e = wo(t);
        return e.length == 1 && e[0][2] ? nl(e[0][0], e[0][1]) : function(n) {
          return n === t || go(n, t, e);
        };
      }
      function Aa(t, e) {
        return So(t) && el(e) ? nl(Ke(t), e) : function(n) {
          var o = Go(n, t);
          return o === r && o === e ? Wo(n, t) : ni(e, o, b | R);
        };
      }
      function Xi(t, e, n, o, a) {
        t !== e && lo(e, function(M, N) {
          if (a || (a = new ke()), _t(M))
            Pf(t, e, N, n, Xi, o, a);
          else {
            var h = o ? o(bo(t, N), M, N + "", t, e, a) : r;
            h === r && (h = M), so(t, N, h);
          }
        }, fe);
      }
      function Pf(t, e, n, o, a, M, N) {
        var h = bo(t, n), A = bo(e, n), w = N.get(A);
        if (w) {
          so(t, n, w);
          return;
        }
        var O = M ? M(h, A, n + "", t, e, N) : r, S = O === r;
        if (S) {
          var k = J(A), W = !k && xn(A), $ = !k && !W && vr(A);
          O = A, k || W || $ ? J(h) ? O = h : wt(h) ? O = ce(h) : W ? (S = !1, O = ba(A, !0)) : $ ? (S = !1, O = Ya(A, !0)) : O = [] : si(A) || qn(A) ? (O = h, qn(h) ? O = Ol(h) : (!_t(h) || Mn(h)) && (O = tl(A))) : S = !1;
        }
        S && (N.set(A, O), a(O, A, o, M, N), N.delete(A)), so(t, n, O);
      }
      function Da(t, e) {
        var n = t.length;
        if (n)
          return e += e < 0 ? n : 0, cn(e, n) ? t[e] : r;
      }
      function ja(t, e, n) {
        e.length ? e = vt(e, function(M) {
          return J(M) ? function(N) {
            return Xn(N, M.length === 1 ? M[0] : M);
          } : M;
        }) : e = [ge];
        var o = -1;
        e = vt(e, he(B()));
        var a = ma(t, function(M, N, h) {
          var A = vt(e, function(w) {
            return w(M);
          });
          return { criteria: A, index: ++o, value: M };
        });
        return fM(a, function(M, N) {
          return qf(M, N, n);
        });
      }
      function Qf(t, e) {
        return va(t, e, function(n, o) {
          return Wo(t, o);
        });
      }
      function va(t, e, n) {
        for (var o = -1, a = e.length, M = {}; ++o < a; ) {
          var N = e[o], h = Xn(t, N);
          n(h, N) && ri(M, _n(N, t), h);
        }
        return M;
      }
      function Zf(t) {
        return function(e) {
          return Xn(e, t);
        };
      }
      function Io(t, e, n, o) {
        var a = o ? MM : Nr, M = -1, N = e.length, h = t;
        for (t === e && (e = ce(e)), n && (h = vt(t, he(n))); ++M < N; )
          for (var A = 0, w = e[M], O = n ? n(w) : w; (A = a(h, O, A, o)) > -1; )
            h !== t && Pi.call(h, A, 1), Pi.call(t, A, 1);
        return t;
      }
      function La(t, e) {
        for (var n = t ? e.length : 0, o = n - 1; n--; ) {
          var a = e[n];
          if (n == o || a !== M) {
            var M = a;
            cn(a) ? Pi.call(t, a, 1) : mo(t, a);
          }
        }
        return t;
      }
      function ho(t, e) {
        return t + Gi(sa() * (e - t + 1));
      }
      function Gf(t, e, n, o) {
        for (var a = -1, M = Rt(Zi((e - t) / (n || 1)), 0), N = L(M); M--; )
          N[o ? M : ++a] = t, t += n;
        return N;
      }
      function To(t, e) {
        var n = "";
        if (!t || e < 1 || e > We)
          return n;
        do
          e % 2 && (n += t), e = Gi(e / 2), e && (t += t);
        while (e);
        return n;
      }
      function rt(t, e) {
        return Yo(rl(t, e, ge), t + "");
      }
      function Wf(t) {
        return ca(Lr(t));
      }
      function Ff(t, e) {
        var n = Lr(t);
        return ou(n, Vn(e, 0, n.length));
      }
      function ri(t, e, n, o) {
        if (!_t(t))
          return t;
        e = _n(e, t);
        for (var a = -1, M = e.length, N = M - 1, h = t; h != null && ++a < M; ) {
          var A = Ke(e[a]), w = n;
          if (A === "__proto__" || A === "constructor" || A === "prototype")
            return t;
          if (a != N) {
            var O = h[A];
            w = o ? o(O, A, h) : r, w === r && (w = _t(O) ? O : cn(e[a + 1]) ? [] : {});
          }
          qr(h, A, w), h = h[A];
        }
        return t;
      }
      var _a = Wi ? function(t, e) {
        return Wi.set(t, e), t;
      } : ge, Bf = Qi ? function(t, e) {
        return Qi(t, "toString", {
          configurable: !0,
          enumerable: !1,
          value: Bo(e),
          writable: !0
        });
      } : ge;
      function $f(t) {
        return ou(Lr(t));
      }
      function xe(t, e, n) {
        var o = -1, a = t.length;
        e < 0 && (e = -e > a ? 0 : a + e), n = n > a ? a : n, n < 0 && (n += a), a = e > n ? 0 : n - e >>> 0, e >>>= 0;
        for (var M = L(a); ++o < a; )
          M[o] = t[o + e];
        return M;
      }
      function Hf(t, e) {
        var n;
        return vn(t, function(o, a, M) {
          return n = e(o, a, M), !n;
        }), !!n;
      }
      function Ki(t, e, n) {
        var o = 0, a = t == null ? o : t.length;
        if (typeof e == "number" && e === e && a <= Et) {
          for (; o < a; ) {
            var M = o + a >>> 1, N = t[M];
            N !== null && !ye(N) && (n ? N <= e : N < e) ? o = M + 1 : a = M;
          }
          return a;
        }
        return yo(t, e, ge, n);
      }
      function yo(t, e, n, o) {
        var a = 0, M = t == null ? 0 : t.length;
        if (M === 0)
          return 0;
        e = n(e);
        for (var N = e !== e, h = e === null, A = ye(e), w = e === r; a < M; ) {
          var O = Gi((a + M) / 2), S = n(t[O]), k = S !== r, W = S === null, $ = S === S, et = ye(S);
          if (N)
            var H = o || $;
          else
            w ? H = $ && (o || k) : h ? H = $ && k && (o || !W) : A ? H = $ && k && !W && (o || !et) : W || et ? H = !1 : H = o ? S <= e : S < e;
          H ? a = O + 1 : M = O;
        }
        return Jt(M, kr);
      }
      function Ca(t, e) {
        for (var n = -1, o = t.length, a = 0, M = []; ++n < o; ) {
          var N = t[n], h = e ? e(N) : N;
          if (!n || !Re(h, A)) {
            var A = h;
            M[a++] = N === 0 ? 0 : N;
          }
        }
        return M;
      }
      function xa(t) {
        return typeof t == "number" ? t : ye(t) ? Un : +t;
      }
      function Te(t) {
        if (typeof t == "string")
          return t;
        if (J(t))
          return vt(t, Te) + "";
        if (ye(t))
          return aa ? aa.call(t) : "";
        var e = t + "";
        return e == "0" && 1 / t == -qe ? "-0" : e;
      }
      function Ln(t, e, n) {
        var o = -1, a = xi, M = t.length, N = !0, h = [], A = h;
        if (n)
          N = !1, a = Hu;
        else if (M >= l) {
          var w = e ? null : ug(t);
          if (w)
            return Oi(w);
          N = !1, a = $r, A = new Hn();
        } else
          A = e ? [] : h;
        t:
          for (; ++o < M; ) {
            var O = t[o], S = e ? e(O) : O;
            if (O = n || O !== 0 ? O : 0, N && S === S) {
              for (var k = A.length; k--; )
                if (A[k] === S)
                  continue t;
              e && A.push(S), h.push(O);
            } else
              a(A, S, n) || (A !== h && A.push(S), h.push(O));
          }
        return h;
      }
      function mo(t, e) {
        return e = _n(e, t), t = il(t, e), t == null || delete t[Ke(we(e))];
      }
      function wa(t, e, n, o) {
        return ri(t, e, n(Xn(t, e)), o);
      }
      function Ji(t, e, n, o) {
        for (var a = t.length, M = o ? a : -1; (o ? M-- : ++M < a) && e(t[M], M, t); )
          ;
        return n ? xe(t, o ? 0 : M, o ? M + 1 : a) : xe(t, o ? M + 1 : 0, o ? a : M);
      }
      function Oa(t, e) {
        var n = t;
        return n instanceof at && (n = n.value()), Vu(e, function(o, a) {
          return a.func.apply(a.thisArg, An([o], a.args));
        }, n);
      }
      function zo(t, e, n) {
        var o = t.length;
        if (o < 2)
          return o ? Ln(t[0]) : [];
        for (var a = -1, M = L(o); ++a < o; )
          for (var N = t[a], h = -1; ++h < o; )
            h != a && (M[a] = ti(M[a] || N, t[h], e, n));
        return Ln($t(M, 1), e, n);
      }
      function Sa(t, e, n) {
        for (var o = -1, a = t.length, M = e.length, N = {}; ++o < a; ) {
          var h = o < M ? e[o] : r;
          n(N, t[o], h);
        }
        return N;
      }
      function Ao(t) {
        return wt(t) ? t : [];
      }
      function Do(t) {
        return typeof t == "function" ? t : ge;
      }
      function _n(t, e) {
        return J(t) ? t : So(t, e) ? [t] : al(pt(t));
      }
      var Vf = rt;
      function Cn(t, e, n) {
        var o = t.length;
        return n = n === r ? o : n, !e && n >= o ? t : xe(t, e, n);
      }
      var Ea = bM || function(t) {
        return Bt.clearTimeout(t);
      };
      function ba(t, e) {
        if (e)
          return t.slice();
        var n = t.length, o = na ? na(n) : new t.constructor(n);
        return t.copy(o), o;
      }
      function jo(t) {
        var e = new t.constructor(t.byteLength);
        return new ki(e).set(new ki(t)), e;
      }
      function Xf(t, e) {
        var n = e ? jo(t.buffer) : t.buffer;
        return new t.constructor(n, t.byteOffset, t.byteLength);
      }
      function Kf(t) {
        var e = new t.constructor(t.source, Br.exec(t));
        return e.lastIndex = t.lastIndex, e;
      }
      function Jf(t) {
        return Jr ? Tt(Jr.call(t)) : {};
      }
      function Ya(t, e) {
        var n = e ? jo(t.buffer) : t.buffer;
        return new t.constructor(n, t.byteOffset, t.length);
      }
      function Ua(t, e) {
        if (t !== e) {
          var n = t !== r, o = t === null, a = t === t, M = ye(t), N = e !== r, h = e === null, A = e === e, w = ye(e);
          if (!h && !w && !M && t > e || M && N && A && !h && !w || o && N && A || !n && A || !a)
            return 1;
          if (!o && !M && !w && t < e || w && n && a && !o && !M || h && n && a || !N && a || !A)
            return -1;
        }
        return 0;
      }
      function qf(t, e, n) {
        for (var o = -1, a = t.criteria, M = e.criteria, N = a.length, h = n.length; ++o < N; ) {
          var A = Ua(a[o], M[o]);
          if (A) {
            if (o >= h)
              return A;
            var w = n[o];
            return A * (w == "desc" ? -1 : 1);
          }
        }
        return t.index - e.index;
      }
      function ka(t, e, n, o) {
        for (var a = -1, M = t.length, N = n.length, h = -1, A = e.length, w = Rt(M - N, 0), O = L(A + w), S = !o; ++h < A; )
          O[h] = e[h];
        for (; ++a < N; )
          (S || a < M) && (O[n[a]] = t[a]);
        for (; w--; )
          O[h++] = t[a++];
        return O;
      }
      function Ra(t, e, n, o) {
        for (var a = -1, M = t.length, N = -1, h = n.length, A = -1, w = e.length, O = Rt(M - h, 0), S = L(O + w), k = !o; ++a < O; )
          S[a] = t[a];
        for (var W = a; ++A < w; )
          S[W + A] = e[A];
        for (; ++N < h; )
          (k || a < M) && (S[W + n[N]] = t[a++]);
        return S;
      }
      function ce(t, e) {
        var n = -1, o = t.length;
        for (e || (e = L(o)); ++n < o; )
          e[n] = t[n];
        return e;
      }
      function Xe(t, e, n, o) {
        var a = !n;
        n || (n = {});
        for (var M = -1, N = e.length; ++M < N; ) {
          var h = e[M], A = o ? o(n[h], t[h], h, n, t) : r;
          A === r && (A = t[h]), a ? sn(n, h, A) : qr(n, h, A);
        }
        return n;
      }
      function tg(t, e) {
        return Xe(t, Oo(t), e);
      }
      function eg(t, e) {
        return Xe(t, Ja(t), e);
      }
      function qi(t, e) {
        return function(n, o) {
          var a = J(n) ? uM : Af, M = e ? e() : {};
          return a(n, t, B(o, 2), M);
        };
      }
      function Ar(t) {
        return rt(function(e, n) {
          var o = -1, a = n.length, M = a > 1 ? n[a - 1] : r, N = a > 2 ? n[2] : r;
          for (M = t.length > 3 && typeof M == "function" ? (a--, M) : r, N && re(n[0], n[1], N) && (M = a < 3 ? r : M, a = 1), e = Tt(e); ++o < a; ) {
            var h = n[o];
            h && t(e, h, o, M);
          }
          return e;
        });
      }
      function Pa(t, e) {
        return function(n, o) {
          if (n == null)
            return n;
          if (!Me(n))
            return t(n, o);
          for (var a = n.length, M = e ? a : -1, N = Tt(n); (e ? M-- : ++M < a) && o(N[M], M, N) !== !1; )
            ;
          return n;
        };
      }
      function Qa(t) {
        return function(e, n, o) {
          for (var a = -1, M = Tt(e), N = o(e), h = N.length; h--; ) {
            var A = N[t ? h : ++a];
            if (n(M[A], A, M) === !1)
              break;
          }
          return e;
        };
      }
      function ng(t, e, n) {
        var o = e & _, a = ii(t);
        function M() {
          var N = this && this !== Bt && this instanceof M ? a : t;
          return N.apply(o ? n : this, arguments);
        }
        return M;
      }
      function Za(t) {
        return function(e) {
          e = pt(e);
          var n = pr(e) ? Ue(e) : r, o = n ? n[0] : e.charAt(0), a = n ? Cn(n, 1).join("") : e.slice(1);
          return o[t]() + a;
        };
      }
      function Dr(t) {
        return function(e) {
          return Vu(Pl(Rl(e).replace(Fc, "")), t, "");
        };
      }
      function ii(t) {
        return function() {
          var e = arguments;
          switch (e.length) {
            case 0:
              return new t();
            case 1:
              return new t(e[0]);
            case 2:
              return new t(e[0], e[1]);
            case 3:
              return new t(e[0], e[1], e[2]);
            case 4:
              return new t(e[0], e[1], e[2], e[3]);
            case 5:
              return new t(e[0], e[1], e[2], e[3], e[4]);
            case 6:
              return new t(e[0], e[1], e[2], e[3], e[4], e[5]);
            case 7:
              return new t(e[0], e[1], e[2], e[3], e[4], e[5], e[6]);
          }
          var n = zr(t.prototype), o = t.apply(n, e);
          return _t(o) ? o : n;
        };
      }
      function rg(t, e, n) {
        var o = ii(t);
        function a() {
          for (var M = arguments.length, N = L(M), h = M, A = jr(a); h--; )
            N[h] = arguments[h];
          var w = M < 3 && N[0] !== A && N[M - 1] !== A ? [] : Dn(N, A);
          if (M -= w.length, M < n)
            return $a(
              t,
              e,
              tu,
              a.placeholder,
              r,
              N,
              w,
              r,
              r,
              n - M
            );
          var O = this && this !== Bt && this instanceof a ? o : t;
          return Ie(O, this, N);
        }
        return a;
      }
      function Ga(t) {
        return function(e, n, o) {
          var a = Tt(e);
          if (!Me(e)) {
            var M = B(n, 3);
            e = Ft(e), n = function(h) {
              return M(a[h], h, a);
            };
          }
          var N = t(e, n, o);
          return N > -1 ? a[M ? e[N] : N] : r;
        };
      }
      function Wa(t) {
        return ln(function(e) {
          var n = e.length, o = n, a = _e.prototype.thru;
          for (t && e.reverse(); o--; ) {
            var M = e[o];
            if (typeof M != "function")
              throw new Le(d);
            if (a && !N && iu(M) == "wrapper")
              var N = new _e([], !0);
          }
          for (o = N ? o : n; ++o < n; ) {
            M = e[o];
            var h = iu(M), A = h == "wrapper" ? xo(M) : r;
            A && Eo(A[0]) && A[1] == (dt | P | mt | Vt) && !A[4].length && A[9] == 1 ? N = N[iu(A[0])].apply(N, A[3]) : N = M.length == 1 && Eo(M) ? N[h]() : N.thru(M);
          }
          return function() {
            var w = arguments, O = w[0];
            if (N && w.length == 1 && J(O))
              return N.plant(O).value();
            for (var S = 0, k = n ? e[S].apply(this, w) : O; ++S < n; )
              k = e[S].call(this, k);
            return k;
          };
        });
      }
      function tu(t, e, n, o, a, M, N, h, A, w) {
        var O = e & dt, S = e & _, k = e & x, W = e & (P | lt), $ = e & ut, et = k ? r : ii(t);
        function H() {
          for (var ot = arguments.length, Mt = L(ot), me = ot; me--; )
            Mt[me] = arguments[me];
          if (W)
            var ie = jr(H), ze = dM(Mt, ie);
          if (o && (Mt = ka(Mt, o, a, W)), M && (Mt = Ra(Mt, M, N, W)), ot -= ze, W && ot < w) {
            var Ot = Dn(Mt, ie);
            return $a(
              t,
              e,
              tu,
              H.placeholder,
              n,
              Mt,
              Ot,
              h,
              A,
              w - ot
            );
          }
          var Pe = S ? n : this, gn = k ? Pe[t] : t;
          return ot = Mt.length, h ? Mt = Ag(Mt, h) : $ && ot > 1 && Mt.reverse(), O && A < ot && (Mt.length = A), this && this !== Bt && this instanceof H && (gn = et || ii(gn)), gn.apply(Pe, Mt);
        }
        return H;
      }
      function Fa(t, e) {
        return function(n, o) {
          return wf(n, t, e(o), {});
        };
      }
      function eu(t, e) {
        return function(n, o) {
          var a;
          if (n === r && o === r)
            return e;
          if (n !== r && (a = n), o !== r) {
            if (a === r)
              return o;
            typeof n == "string" || typeof o == "string" ? (n = Te(n), o = Te(o)) : (n = xa(n), o = xa(o)), a = t(n, o);
          }
          return a;
        };
      }
      function vo(t) {
        return ln(function(e) {
          return e = vt(e, he(B())), rt(function(n) {
            var o = this;
            return t(e, function(a) {
              return Ie(a, o, n);
            });
          });
        });
      }
      function nu(t, e) {
        e = e === r ? " " : Te(e);
        var n = e.length;
        if (n < 2)
          return n ? To(e, t) : e;
        var o = To(e, Zi(t / Ir(e)));
        return pr(e) ? Cn(Ue(o), 0, t).join("") : o.slice(0, t);
      }
      function ig(t, e, n, o) {
        var a = e & _, M = ii(t);
        function N() {
          for (var h = -1, A = arguments.length, w = -1, O = o.length, S = L(O + A), k = this && this !== Bt && this instanceof N ? M : t; ++w < O; )
            S[w] = o[w];
          for (; A--; )
            S[w++] = arguments[++h];
          return Ie(k, a ? n : this, S);
        }
        return N;
      }
      function Ba(t) {
        return function(e, n, o) {
          return o && typeof o != "number" && re(e, n, o) && (n = o = r), e = fn(e), n === r ? (n = e, e = 0) : n = fn(n), o = o === r ? e < n ? 1 : -1 : fn(o), Gf(e, n, o, t);
        };
      }
      function ru(t) {
        return function(e, n) {
          return typeof e == "string" && typeof n == "string" || (e = Oe(e), n = Oe(n)), t(e, n);
        };
      }
      function $a(t, e, n, o, a, M, N, h, A, w) {
        var O = e & P, S = O ? N : r, k = O ? r : N, W = O ? M : r, $ = O ? r : M;
        e |= O ? mt : ct, e &= ~(O ? ct : mt), e & K || (e &= ~(_ | x));
        var et = [
          t,
          e,
          a,
          W,
          S,
          $,
          k,
          h,
          A,
          w
        ], H = n.apply(r, et);
        return Eo(t) && ul(H, et), H.placeholder = o, ol(H, t, e);
      }
      function Lo(t) {
        var e = kt[t];
        return function(n, o) {
          if (n = Oe(n), o = o == null ? 0 : Jt(tt(o), 292), o && oa(n)) {
            var a = (pt(n) + "e").split("e"), M = e(a[0] + "e" + (+a[1] + o));
            return a = (pt(M) + "e").split("e"), +(a[0] + "e" + (+a[1] - o));
          }
          return e(n);
        };
      }
      var ug = yr && 1 / Oi(new yr([, -0]))[1] == qe ? function(t) {
        return new yr(t);
      } : Vo;
      function Ha(t) {
        return function(e) {
          var n = qt(e);
          return n == Gt ? no(e) : n == Xt ? mM(e) : gM(e, t(e));
        };
      }
      function an(t, e, n, o, a, M, N, h) {
        var A = e & x;
        if (!A && typeof t != "function")
          throw new Le(d);
        var w = o ? o.length : 0;
        if (w || (e &= ~(mt | ct), o = a = r), N = N === r ? N : Rt(tt(N), 0), h = h === r ? h : tt(h), w -= a ? a.length : 0, e & ct) {
          var O = o, S = a;
          o = a = r;
        }
        var k = A ? r : xo(t), W = [
          t,
          e,
          n,
          o,
          a,
          O,
          S,
          M,
          N,
          h
        ];
        if (k && yg(W, k), t = W[0], e = W[1], n = W[2], o = W[3], a = W[4], h = W[9] = W[9] === r ? A ? 0 : t.length : Rt(W[9] - w, 0), !h && e & (P | lt) && (e &= ~(P | lt)), !e || e == _)
          var $ = ng(t, e, n);
        else
          e == P || e == lt ? $ = rg(t, e, h) : (e == mt || e == (_ | mt)) && !a.length ? $ = ig(t, e, n, o) : $ = tu.apply(r, W);
        var et = k ? _a : ul;
        return ol(et($, W), t, e);
      }
      function Va(t, e, n, o) {
        return t === r || Re(t, Tr[n]) && !It.call(o, n) ? e : t;
      }
      function Xa(t, e, n, o, a, M) {
        return _t(t) && _t(e) && (M.set(e, t), Xi(t, e, r, Xa, M), M.delete(e)), t;
      }
      function og(t) {
        return si(t) ? r : t;
      }
      function Ka(t, e, n, o, a, M) {
        var N = n & b, h = t.length, A = e.length;
        if (h != A && !(N && A > h))
          return !1;
        var w = M.get(t), O = M.get(e);
        if (w && O)
          return w == e && O == t;
        var S = -1, k = !0, W = n & R ? new Hn() : r;
        for (M.set(t, e), M.set(e, t); ++S < h; ) {
          var $ = t[S], et = e[S];
          if (o)
            var H = N ? o(et, $, S, e, t, M) : o($, et, S, t, e, M);
          if (H !== r) {
            if (H)
              continue;
            k = !1;
            break;
          }
          if (W) {
            if (!Xu(e, function(ot, Mt) {
              if (!$r(W, Mt) && ($ === ot || a($, ot, n, o, M)))
                return W.push(Mt);
            })) {
              k = !1;
              break;
            }
          } else if (!($ === et || a($, et, n, o, M))) {
            k = !1;
            break;
          }
        }
        return M.delete(t), M.delete(e), k;
      }
      function sg(t, e, n, o, a, M, N) {
        switch (n) {
          case Ne:
            if (t.byteLength != e.byteLength || t.byteOffset != e.byteOffset)
              return !1;
            t = t.buffer, e = e.buffer;
          case De:
            return !(t.byteLength != e.byteLength || !M(new ki(t), new ki(e)));
          case be:
          case tn:
          case en:
            return Re(+t, +e);
          case pn:
            return t.name == e.name && t.message == e.message;
          case Fe:
          case hn:
            return t == e + "";
          case Gt:
            var h = no;
          case Xt:
            var A = o & b;
            if (h || (h = Oi), t.size != e.size && !A)
              return !1;
            var w = N.get(t);
            if (w)
              return w == e;
            o |= R, N.set(t, e);
            var O = Ka(h(t), h(e), o, a, M, N);
            return N.delete(t), O;
          case Pn:
            if (Jr)
              return Jr.call(t) == Jr.call(e);
        }
        return !1;
      }
      function ag(t, e, n, o, a, M) {
        var N = n & b, h = _o(t), A = h.length, w = _o(e), O = w.length;
        if (A != O && !N)
          return !1;
        for (var S = A; S--; ) {
          var k = h[S];
          if (!(N ? k in e : It.call(e, k)))
            return !1;
        }
        var W = M.get(t), $ = M.get(e);
        if (W && $)
          return W == e && $ == t;
        var et = !0;
        M.set(t, e), M.set(e, t);
        for (var H = N; ++S < A; ) {
          k = h[S];
          var ot = t[k], Mt = e[k];
          if (o)
            var me = N ? o(Mt, ot, k, e, t, M) : o(ot, Mt, k, t, e, M);
          if (!(me === r ? ot === Mt || a(ot, Mt, n, o, M) : me)) {
            et = !1;
            break;
          }
          H || (H = k == "constructor");
        }
        if (et && !H) {
          var ie = t.constructor, ze = e.constructor;
          ie != ze && "constructor" in t && "constructor" in e && !(typeof ie == "function" && ie instanceof ie && typeof ze == "function" && ze instanceof ze) && (et = !1);
        }
        return M.delete(t), M.delete(e), et;
      }
      function ln(t) {
        return Yo(rl(t, r, fl), t + "");
      }
      function _o(t) {
        return Ia(t, Ft, Oo);
      }
      function Co(t) {
        return Ia(t, fe, Ja);
      }
      var xo = Wi ? function(t) {
        return Wi.get(t);
      } : Vo;
      function iu(t) {
        for (var e = t.name + "", n = mr[e], o = It.call(mr, e) ? n.length : 0; o--; ) {
          var a = n[o], M = a.func;
          if (M == null || M == t)
            return a.name;
        }
        return e;
      }
      function jr(t) {
        var e = It.call(c, "placeholder") ? c : t;
        return e.placeholder;
      }
      function B() {
        var t = c.iteratee || $o;
        return t = t === $o ? ya : t, arguments.length ? t(arguments[0], arguments[1]) : t;
      }
      function uu(t, e) {
        var n = t.__data__;
        return pg(e) ? n[typeof e == "string" ? "string" : "hash"] : n.map;
      }
      function wo(t) {
        for (var e = Ft(t), n = e.length; n--; ) {
          var o = e[n], a = t[o];
          e[n] = [o, a, el(a)];
        }
        return e;
      }
      function Kn(t, e) {
        var n = hM(t, e);
        return Ta(n) ? n : r;
      }
      function lg(t) {
        var e = It.call(t, Bn), n = t[Bn];
        try {
          t[Bn] = r;
          var o = !0;
        } catch (M) {
        }
        var a = Yi.call(t);
        return o && (e ? t[Bn] = n : delete t[Bn]), a;
      }
      var Oo = io ? function(t) {
        return t == null ? [] : (t = Tt(t), zn(io(t), function(e) {
          return ia.call(t, e);
        }));
      } : Xo, Ja = io ? function(t) {
        for (var e = []; t; )
          An(e, Oo(t)), t = Ri(t);
        return e;
      } : Xo, qt = ne;
      (uo && qt(new uo(new ArrayBuffer(1))) != Ne || Vr && qt(new Vr()) != Gt || oo && qt(oo.resolve()) != or || yr && qt(new yr()) != Xt || Xr && qt(new Xr()) != rn) && (qt = function(t) {
        var e = ne(t), n = e == de ? t.constructor : r, o = n ? Jn(n) : "";
        if (o)
          switch (o) {
            case WM:
              return Ne;
            case FM:
              return Gt;
            case BM:
              return or;
            case $M:
              return Xt;
            case HM:
              return rn;
          }
        return e;
      });
      function cg(t, e, n) {
        for (var o = -1, a = n.length; ++o < a; ) {
          var M = n[o], N = M.size;
          switch (M.type) {
            case "drop":
              t += N;
              break;
            case "dropRight":
              e -= N;
              break;
            case "take":
              e = Jt(e, t + N);
              break;
            case "takeRight":
              t = Rt(t, e - N);
              break;
          }
        }
        return { start: t, end: e };
      }
      function Mg(t) {
        var e = t.match(fr);
        return e ? e[1].split(Ai) : [];
      }
      function qa(t, e, n) {
        e = _n(e, t);
        for (var o = -1, a = e.length, M = !1; ++o < a; ) {
          var N = Ke(e[o]);
          if (!(M = t != null && n(t, N)))
            break;
          t = t[N];
        }
        return M || ++o != a ? M : (a = t == null ? 0 : t.length, !!a && fu(a) && cn(N, a) && (J(t) || qn(t)));
      }
      function fg(t) {
        var e = t.length, n = new t.constructor(e);
        return e && typeof t[0] == "string" && It.call(t, "index") && (n.index = t.index, n.input = t.input), n;
      }
      function tl(t) {
        return typeof t.constructor == "function" && !ui(t) ? zr(Ri(t)) : {};
      }
      function gg(t, e, n) {
        var o = t.constructor;
        switch (e) {
          case De:
            return jo(t);
          case be:
          case tn:
            return new o(+t);
          case Ne:
            return Xf(t, n);
          case sr:
          case ar:
          case lr:
          case Zn:
          case cr:
          case Tn:
          case yn:
          case pe:
          case Be:
            return Ya(t, n);
          case Gt:
            return new o();
          case en:
          case hn:
            return new o(t);
          case Fe:
            return Kf(t);
          case Xt:
            return new o();
          case Pn:
            return Jf(t);
        }
      }
      function dg(t, e) {
        var n = e.length;
        if (!n)
          return t;
        var o = n - 1;
        return e[o] = (n > 1 ? "& " : "") + e[o], e = e.join(n > 2 ? ", " : " "), t.replace(le, `{
/* [wrapped with ` + e + `] */
`);
      }
      function Ng(t) {
        return J(t) || qn(t) || !!(ua && t && t[ua]);
      }
      function cn(t, e) {
        var n = typeof t;
        return e = e == null ? We : e, !!e && (n == "number" || n != "symbol" && F.test(t)) && t > -1 && t % 1 == 0 && t < e;
      }
      function re(t, e, n) {
        if (!_t(n))
          return !1;
        var o = typeof e;
        return (o == "number" ? Me(n) && cn(e, n.length) : o == "string" && e in n) ? Re(n[e], t) : !1;
      }
      function So(t, e) {
        if (J(t))
          return !1;
        var n = typeof t;
        return n == "number" || n == "symbol" || n == "boolean" || t == null || ye(t) ? !0 : mi.test(t) || !Gr.test(t) || e != null && t in Tt(e);
      }
      function pg(t) {
        var e = typeof t;
        return e == "string" || e == "number" || e == "symbol" || e == "boolean" ? t !== "__proto__" : t === null;
      }
      function Eo(t) {
        var e = iu(t), n = c[e];
        if (typeof n != "function" || !(e in at.prototype))
          return !1;
        if (t === n)
          return !0;
        var o = xo(n);
        return !!o && t === o[0];
      }
      function Ig(t) {
        return !!ea && ea in t;
      }
      var hg = Ei ? Mn : Ko;
      function ui(t) {
        var e = t && t.constructor, n = typeof e == "function" && e.prototype || Tr;
        return t === n;
      }
      function el(t) {
        return t === t && !_t(t);
      }
      function nl(t, e) {
        return function(n) {
          return n == null ? !1 : n[t] === e && (e !== r || t in Tt(n));
        };
      }
      function Tg(t) {
        var e = cu(t, function(o) {
          return n.size === g && n.clear(), o;
        }), n = e.cache;
        return e;
      }
      function yg(t, e) {
        var n = t[1], o = e[1], a = n | o, M = a < (_ | x | dt), N = o == dt && n == P || o == dt && n == Vt && t[7].length <= e[8] || o == (dt | Vt) && e[7].length <= e[8] && n == P;
        if (!(M || N))
          return t;
        o & _ && (t[2] = e[2], a |= n & _ ? 0 : K);
        var h = e[3];
        if (h) {
          var A = t[3];
          t[3] = A ? ka(A, h, e[4]) : h, t[4] = A ? Dn(t[3], I) : e[4];
        }
        return h = e[5], h && (A = t[5], t[5] = A ? Ra(A, h, e[6]) : h, t[6] = A ? Dn(t[5], I) : e[6]), h = e[7], h && (t[7] = h), o & dt && (t[8] = t[8] == null ? e[8] : Jt(t[8], e[8])), t[9] == null && (t[9] = e[9]), t[0] = e[0], t[1] = a, t;
      }
      function mg(t) {
        var e = [];
        if (t != null)
          for (var n in Tt(t))
            e.push(n);
        return e;
      }
      function zg(t) {
        return Yi.call(t);
      }
      function rl(t, e, n) {
        return e = Rt(e === r ? t.length - 1 : e, 0), function() {
          for (var o = arguments, a = -1, M = Rt(o.length - e, 0), N = L(M); ++a < M; )
            N[a] = o[e + a];
          a = -1;
          for (var h = L(e + 1); ++a < e; )
            h[a] = o[a];
          return h[e] = n(N), Ie(t, this, h);
        };
      }
      function il(t, e) {
        return e.length < 2 ? t : Xn(t, xe(e, 0, -1));
      }
      function Ag(t, e) {
        for (var n = t.length, o = Jt(e.length, n), a = ce(t); o--; ) {
          var M = e[o];
          t[o] = cn(M, n) ? a[M] : r;
        }
        return t;
      }
      function bo(t, e) {
        if (!(e === "constructor" && typeof t[e] == "function") && e != "__proto__")
          return t[e];
      }
      var ul = sl(_a), oi = UM || function(t, e) {
        return Bt.setTimeout(t, e);
      }, Yo = sl(Bf);
      function ol(t, e, n) {
        var o = e + "";
        return Yo(t, dg(o, Dg(Mg(o), n)));
      }
      function sl(t) {
        var e = 0, n = 0;
        return function() {
          var o = QM(), a = ae - (o - n);
          if (n = o, a > 0) {
            if (++e >= Yn)
              return arguments[0];
          } else
            e = 0;
          return t.apply(r, arguments);
        };
      }
      function ou(t, e) {
        var n = -1, o = t.length, a = o - 1;
        for (e = e === r ? o : e; ++n < e; ) {
          var M = ho(n, a), N = t[M];
          t[M] = t[n], t[n] = N;
        }
        return t.length = e, t;
      }
      var al = Tg(function(t) {
        var e = [];
        return t.charCodeAt(0) === 46 && e.push(""), t.replace(zi, function(n, o, a, M) {
          e.push(a ? M.replace(Wn, "$1") : o || n);
        }), e;
      });
      function Ke(t) {
        if (typeof t == "string" || ye(t))
          return t;
        var e = t + "";
        return e == "0" && 1 / t == -qe ? "-0" : e;
      }
      function Jn(t) {
        if (t != null) {
          try {
            return bi.call(t);
          } catch (e) {
          }
          try {
            return t + "";
          } catch (e) {
          }
        }
        return "";
      }
      function Dg(t, e) {
        return ve(hi, function(n) {
          var o = "_." + n[0];
          e & n[1] && !xi(t, o) && t.push(o);
        }), t.sort();
      }
      function ll(t) {
        if (t instanceof at)
          return t.clone();
        var e = new _e(t.__wrapped__, t.__chain__);
        return e.__actions__ = ce(t.__actions__), e.__index__ = t.__index__, e.__values__ = t.__values__, e;
      }
      function jg(t, e, n) {
        (n ? re(t, e, n) : e === r) ? e = 1 : e = Rt(tt(e), 0);
        var o = t == null ? 0 : t.length;
        if (!o || e < 1)
          return [];
        for (var a = 0, M = 0, N = L(Zi(o / e)); a < o; )
          N[M++] = xe(t, a, a += e);
        return N;
      }
      function vg(t) {
        for (var e = -1, n = t == null ? 0 : t.length, o = 0, a = []; ++e < n; ) {
          var M = t[e];
          M && (a[o++] = M);
        }
        return a;
      }
      function Lg() {
        var t = arguments.length;
        if (!t)
          return [];
        for (var e = L(t - 1), n = arguments[0], o = t; o--; )
          e[o - 1] = arguments[o];
        return An(J(n) ? ce(n) : [n], $t(e, 1));
      }
      var _g = rt(function(t, e) {
        return wt(t) ? ti(t, $t(e, 1, wt, !0)) : [];
      }), Cg = rt(function(t, e) {
        var n = we(e);
        return wt(n) && (n = r), wt(t) ? ti(t, $t(e, 1, wt, !0), B(n, 2)) : [];
      }), xg = rt(function(t, e) {
        var n = we(e);
        return wt(n) && (n = r), wt(t) ? ti(t, $t(e, 1, wt, !0), r, n) : [];
      });
      function wg(t, e, n) {
        var o = t == null ? 0 : t.length;
        return o ? (e = n || e === r ? 1 : tt(e), xe(t, e < 0 ? 0 : e, o)) : [];
      }
      function Og(t, e, n) {
        var o = t == null ? 0 : t.length;
        return o ? (e = n || e === r ? 1 : tt(e), e = o - e, xe(t, 0, e < 0 ? 0 : e)) : [];
      }
      function Sg(t, e) {
        return t && t.length ? Ji(t, B(e, 3), !0, !0) : [];
      }
      function Eg(t, e) {
        return t && t.length ? Ji(t, B(e, 3), !0) : [];
      }
      function bg(t, e, n, o) {
        var a = t == null ? 0 : t.length;
        return a ? (n && typeof n != "number" && re(t, e, n) && (n = 0, o = a), Lf(t, e, n, o)) : [];
      }
      function cl(t, e, n) {
        var o = t == null ? 0 : t.length;
        if (!o)
          return -1;
        var a = n == null ? 0 : tt(n);
        return a < 0 && (a = Rt(o + a, 0)), wi(t, B(e, 3), a);
      }
      function Ml(t, e, n) {
        var o = t == null ? 0 : t.length;
        if (!o)
          return -1;
        var a = o - 1;
        return n !== r && (a = tt(n), a = n < 0 ? Rt(o + a, 0) : Jt(a, o - 1)), wi(t, B(e, 3), a, !0);
      }
      function fl(t) {
        var e = t == null ? 0 : t.length;
        return e ? $t(t, 1) : [];
      }
      function Yg(t) {
        var e = t == null ? 0 : t.length;
        return e ? $t(t, qe) : [];
      }
      function Ug(t, e) {
        var n = t == null ? 0 : t.length;
        return n ? (e = e === r ? 1 : tt(e), $t(t, e)) : [];
      }
      function kg(t) {
        for (var e = -1, n = t == null ? 0 : t.length, o = {}; ++e < n; ) {
          var a = t[e];
          o[a[0]] = a[1];
        }
        return o;
      }
      function gl(t) {
        return t && t.length ? t[0] : r;
      }
      function Rg(t, e, n) {
        var o = t == null ? 0 : t.length;
        if (!o)
          return -1;
        var a = n == null ? 0 : tt(n);
        return a < 0 && (a = Rt(o + a, 0)), Nr(t, e, a);
      }
      function Pg(t) {
        var e = t == null ? 0 : t.length;
        return e ? xe(t, 0, -1) : [];
      }
      var Qg = rt(function(t) {
        var e = vt(t, Ao);
        return e.length && e[0] === t[0] ? fo(e) : [];
      }), Zg = rt(function(t) {
        var e = we(t), n = vt(t, Ao);
        return e === we(n) ? e = r : n.pop(), n.length && n[0] === t[0] ? fo(n, B(e, 2)) : [];
      }), Gg = rt(function(t) {
        var e = we(t), n = vt(t, Ao);
        return e = typeof e == "function" ? e : r, e && n.pop(), n.length && n[0] === t[0] ? fo(n, r, e) : [];
      });
      function Wg(t, e) {
        return t == null ? "" : RM.call(t, e);
      }
      function we(t) {
        var e = t == null ? 0 : t.length;
        return e ? t[e - 1] : r;
      }
      function Fg(t, e, n) {
        var o = t == null ? 0 : t.length;
        if (!o)
          return -1;
        var a = o;
        return n !== r && (a = tt(n), a = a < 0 ? Rt(o + a, 0) : Jt(a, o - 1)), e === e ? AM(t, e, a) : wi(t, $s, a, !0);
      }
      function Bg(t, e) {
        return t && t.length ? Da(t, tt(e)) : r;
      }
      var $g = rt(dl);
      function dl(t, e) {
        return t && t.length && e && e.length ? Io(t, e) : t;
      }
      function Hg(t, e, n) {
        return t && t.length && e && e.length ? Io(t, e, B(n, 2)) : t;
      }
      function Vg(t, e, n) {
        return t && t.length && e && e.length ? Io(t, e, r, n) : t;
      }
      var Xg = ln(function(t, e) {
        var n = t == null ? 0 : t.length, o = ao(t, e);
        return La(t, vt(e, function(a) {
          return cn(a, n) ? +a : a;
        }).sort(Ua)), o;
      });
      function Kg(t, e) {
        var n = [];
        if (!(t && t.length))
          return n;
        var o = -1, a = [], M = t.length;
        for (e = B(e, 3); ++o < M; ) {
          var N = t[o];
          e(N, o, t) && (n.push(N), a.push(o));
        }
        return La(t, a), n;
      }
      function Uo(t) {
        return t == null ? t : GM.call(t);
      }
      function Jg(t, e, n) {
        var o = t == null ? 0 : t.length;
        return o ? (n && typeof n != "number" && re(t, e, n) ? (e = 0, n = o) : (e = e == null ? 0 : tt(e), n = n === r ? o : tt(n)), xe(t, e, n)) : [];
      }
      function qg(t, e) {
        return Ki(t, e);
      }
      function td(t, e, n) {
        return yo(t, e, B(n, 2));
      }
      function ed(t, e) {
        var n = t == null ? 0 : t.length;
        if (n) {
          var o = Ki(t, e);
          if (o < n && Re(t[o], e))
            return o;
        }
        return -1;
      }
      function nd(t, e) {
        return Ki(t, e, !0);
      }
      function rd(t, e, n) {
        return yo(t, e, B(n, 2), !0);
      }
      function id(t, e) {
        var n = t == null ? 0 : t.length;
        if (n) {
          var o = Ki(t, e, !0) - 1;
          if (Re(t[o], e))
            return o;
        }
        return -1;
      }
      function ud(t) {
        return t && t.length ? Ca(t) : [];
      }
      function od(t, e) {
        return t && t.length ? Ca(t, B(e, 2)) : [];
      }
      function sd(t) {
        var e = t == null ? 0 : t.length;
        return e ? xe(t, 1, e) : [];
      }
      function ad(t, e, n) {
        return t && t.length ? (e = n || e === r ? 1 : tt(e), xe(t, 0, e < 0 ? 0 : e)) : [];
      }
      function ld(t, e, n) {
        var o = t == null ? 0 : t.length;
        return o ? (e = n || e === r ? 1 : tt(e), e = o - e, xe(t, e < 0 ? 0 : e, o)) : [];
      }
      function cd(t, e) {
        return t && t.length ? Ji(t, B(e, 3), !1, !0) : [];
      }
      function Md(t, e) {
        return t && t.length ? Ji(t, B(e, 3)) : [];
      }
      var fd = rt(function(t) {
        return Ln($t(t, 1, wt, !0));
      }), gd = rt(function(t) {
        var e = we(t);
        return wt(e) && (e = r), Ln($t(t, 1, wt, !0), B(e, 2));
      }), dd = rt(function(t) {
        var e = we(t);
        return e = typeof e == "function" ? e : r, Ln($t(t, 1, wt, !0), r, e);
      });
      function Nd(t) {
        return t && t.length ? Ln(t) : [];
      }
      function pd(t, e) {
        return t && t.length ? Ln(t, B(e, 2)) : [];
      }
      function Id(t, e) {
        return e = typeof e == "function" ? e : r, t && t.length ? Ln(t, r, e) : [];
      }
      function ko(t) {
        if (!(t && t.length))
          return [];
        var e = 0;
        return t = zn(t, function(n) {
          if (wt(n))
            return e = Rt(n.length, e), !0;
        }), to(e, function(n) {
          return vt(t, Ku(n));
        });
      }
      function Nl(t, e) {
        if (!(t && t.length))
          return [];
        var n = ko(t);
        return e == null ? n : vt(n, function(o) {
          return Ie(e, r, o);
        });
      }
      var hd = rt(function(t, e) {
        return wt(t) ? ti(t, e) : [];
      }), Td = rt(function(t) {
        return zo(zn(t, wt));
      }), yd = rt(function(t) {
        var e = we(t);
        return wt(e) && (e = r), zo(zn(t, wt), B(e, 2));
      }), md = rt(function(t) {
        var e = we(t);
        return e = typeof e == "function" ? e : r, zo(zn(t, wt), r, e);
      }), zd = rt(ko);
      function Ad(t, e) {
        return Sa(t || [], e || [], qr);
      }
      function Dd(t, e) {
        return Sa(t || [], e || [], ri);
      }
      var jd = rt(function(t) {
        var e = t.length, n = e > 1 ? t[e - 1] : r;
        return n = typeof n == "function" ? (t.pop(), n) : r, Nl(t, n);
      });
      function pl(t) {
        var e = c(t);
        return e.__chain__ = !0, e;
      }
      function vd(t, e) {
        return e(t), t;
      }
      function su(t, e) {
        return e(t);
      }
      var Ld = ln(function(t) {
        var e = t.length, n = e ? t[0] : 0, o = this.__wrapped__, a = function(M) {
          return ao(M, t);
        };
        return e > 1 || this.__actions__.length || !(o instanceof at) || !cn(n) ? this.thru(a) : (o = o.slice(n, +n + (e ? 1 : 0)), o.__actions__.push({
          func: su,
          args: [a],
          thisArg: r
        }), new _e(o, this.__chain__).thru(function(M) {
          return e && !M.length && M.push(r), M;
        }));
      });
      function _d() {
        return pl(this);
      }
      function Cd() {
        return new _e(this.value(), this.__chain__);
      }
      function xd() {
        this.__values__ === r && (this.__values__ = xl(this.value()));
        var t = this.__index__ >= this.__values__.length, e = t ? r : this.__values__[this.__index__++];
        return { done: t, value: e };
      }
      function wd() {
        return this;
      }
      function Od(t) {
        for (var e, n = this; n instanceof Bi; ) {
          var o = ll(n);
          o.__index__ = 0, o.__values__ = r, e ? a.__wrapped__ = o : e = o;
          var a = o;
          n = n.__wrapped__;
        }
        return a.__wrapped__ = t, e;
      }
      function Sd() {
        var t = this.__wrapped__;
        if (t instanceof at) {
          var e = t;
          return this.__actions__.length && (e = new at(this)), e = e.reverse(), e.__actions__.push({
            func: su,
            args: [Uo],
            thisArg: r
          }), new _e(e, this.__chain__);
        }
        return this.thru(Uo);
      }
      function Ed() {
        return Oa(this.__wrapped__, this.__actions__);
      }
      var bd = qi(function(t, e, n) {
        It.call(t, n) ? ++t[n] : sn(t, n, 1);
      });
      function Yd(t, e, n) {
        var o = J(t) ? Fs : vf;
        return n && re(t, e, n) && (e = r), o(t, B(e, 3));
      }
      function Ud(t, e) {
        var n = J(t) ? zn : Na;
        return n(t, B(e, 3));
      }
      var kd = Ga(cl), Rd = Ga(Ml);
      function Pd(t, e) {
        return $t(au(t, e), 1);
      }
      function Qd(t, e) {
        return $t(au(t, e), qe);
      }
      function Zd(t, e, n) {
        return n = n === r ? 1 : tt(n), $t(au(t, e), n);
      }
      function Il(t, e) {
        var n = J(t) ? ve : vn;
        return n(t, B(e, 3));
      }
      function hl(t, e) {
        var n = J(t) ? oM : da;
        return n(t, B(e, 3));
      }
      var Gd = qi(function(t, e, n) {
        It.call(t, n) ? t[n].push(e) : sn(t, n, [e]);
      });
      function Wd(t, e, n, o) {
        t = Me(t) ? t : Lr(t), n = n && !o ? tt(n) : 0;
        var a = t.length;
        return n < 0 && (n = Rt(a + n, 0)), gu(t) ? n <= a && t.indexOf(e, n) > -1 : !!a && Nr(t, e, n) > -1;
      }
      var Fd = rt(function(t, e, n) {
        var o = -1, a = typeof e == "function", M = Me(t) ? L(t.length) : [];
        return vn(t, function(N) {
          M[++o] = a ? Ie(e, N, n) : ei(N, e, n);
        }), M;
      }), Bd = qi(function(t, e, n) {
        sn(t, n, e);
      });
      function au(t, e) {
        var n = J(t) ? vt : ma;
        return n(t, B(e, 3));
      }
      function $d(t, e, n, o) {
        return t == null ? [] : (J(e) || (e = e == null ? [] : [e]), n = o ? r : n, J(n) || (n = n == null ? [] : [n]), ja(t, e, n));
      }
      var Hd = qi(function(t, e, n) {
        t[n ? 0 : 1].push(e);
      }, function() {
        return [[], []];
      });
      function Vd(t, e, n) {
        var o = J(t) ? Vu : Vs, a = arguments.length < 3;
        return o(t, B(e, 4), n, a, vn);
      }
      function Xd(t, e, n) {
        var o = J(t) ? sM : Vs, a = arguments.length < 3;
        return o(t, B(e, 4), n, a, da);
      }
      function Kd(t, e) {
        var n = J(t) ? zn : Na;
        return n(t, Mu(B(e, 3)));
      }
      function Jd(t) {
        var e = J(t) ? ca : Wf;
        return e(t);
      }
      function qd(t, e, n) {
        (n ? re(t, e, n) : e === r) ? e = 1 : e = tt(e);
        var o = J(t) ? mf : Ff;
        return o(t, e);
      }
      function tN(t) {
        var e = J(t) ? zf : $f;
        return e(t);
      }
      function eN(t) {
        if (t == null)
          return 0;
        if (Me(t))
          return gu(t) ? Ir(t) : t.length;
        var e = qt(t);
        return e == Gt || e == Xt ? t.size : No(t).length;
      }
      function nN(t, e, n) {
        var o = J(t) ? Xu : Hf;
        return n && re(t, e, n) && (e = r), o(t, B(e, 3));
      }
      var rN = rt(function(t, e) {
        if (t == null)
          return [];
        var n = e.length;
        return n > 1 && re(t, e[0], e[1]) ? e = [] : n > 2 && re(e[0], e[1], e[2]) && (e = [e[0]]), ja(t, $t(e, 1), []);
      }), lu = YM || function() {
        return Bt.Date.now();
      };
      function iN(t, e) {
        if (typeof e != "function")
          throw new Le(d);
        return t = tt(t), function() {
          if (--t < 1)
            return e.apply(this, arguments);
        };
      }
      function Tl(t, e, n) {
        return e = n ? r : e, e = t && e == null ? t.length : e, an(t, dt, r, r, r, r, e);
      }
      function yl(t, e) {
        var n;
        if (typeof e != "function")
          throw new Le(d);
        return t = tt(t), function() {
          return --t > 0 && (n = e.apply(this, arguments)), t <= 1 && (e = r), n;
        };
      }
      var Ro = rt(function(t, e, n) {
        var o = _;
        if (n.length) {
          var a = Dn(n, jr(Ro));
          o |= mt;
        }
        return an(t, o, e, n, a);
      }), ml = rt(function(t, e, n) {
        var o = _ | x;
        if (n.length) {
          var a = Dn(n, jr(ml));
          o |= mt;
        }
        return an(e, o, t, n, a);
      });
      function zl(t, e, n) {
        e = n ? r : e;
        var o = an(t, P, r, r, r, r, r, e);
        return o.placeholder = zl.placeholder, o;
      }
      function Al(t, e, n) {
        e = n ? r : e;
        var o = an(t, lt, r, r, r, r, r, e);
        return o.placeholder = Al.placeholder, o;
      }
      function Dl(t, e, n) {
        var o, a, M, N, h, A, w = 0, O = !1, S = !1, k = !0;
        if (typeof t != "function")
          throw new Le(d);
        e = Oe(e) || 0, _t(n) && (O = !!n.leading, S = "maxWait" in n, M = S ? Rt(Oe(n.maxWait) || 0, e) : M, k = "trailing" in n ? !!n.trailing : k);
        function W(Ot) {
          var Pe = o, gn = a;
          return o = a = r, w = Ot, N = t.apply(gn, Pe), N;
        }
        function $(Ot) {
          return w = Ot, h = oi(ot, e), O ? W(Ot) : N;
        }
        function et(Ot) {
          var Pe = Ot - A, gn = Ot - w, Gl = e - Pe;
          return S ? Jt(Gl, M - gn) : Gl;
        }
        function H(Ot) {
          var Pe = Ot - A, gn = Ot - w;
          return A === r || Pe >= e || Pe < 0 || S && gn >= M;
        }
        function ot() {
          var Ot = lu();
          if (H(Ot))
            return Mt(Ot);
          h = oi(ot, et(Ot));
        }
        function Mt(Ot) {
          return h = r, k && o ? W(Ot) : (o = a = r, N);
        }
        function me() {
          h !== r && Ea(h), w = 0, o = A = a = h = r;
        }
        function ie() {
          return h === r ? N : Mt(lu());
        }
        function ze() {
          var Ot = lu(), Pe = H(Ot);
          if (o = arguments, a = this, A = Ot, Pe) {
            if (h === r)
              return $(A);
            if (S)
              return Ea(h), h = oi(ot, e), W(A);
          }
          return h === r && (h = oi(ot, e)), N;
        }
        return ze.cancel = me, ze.flush = ie, ze;
      }
      var uN = rt(function(t, e) {
        return ga(t, 1, e);
      }), oN = rt(function(t, e, n) {
        return ga(t, Oe(e) || 0, n);
      });
      function sN(t) {
        return an(t, ut);
      }
      function cu(t, e) {
        if (typeof t != "function" || e != null && typeof e != "function")
          throw new Le(d);
        var n = function() {
          var o = arguments, a = e ? e.apply(this, o) : o[0], M = n.cache;
          if (M.has(a))
            return M.get(a);
          var N = t.apply(this, o);
          return n.cache = M.set(a, N) || M, N;
        };
        return n.cache = new (cu.Cache || on)(), n;
      }
      cu.Cache = on;
      function Mu(t) {
        if (typeof t != "function")
          throw new Le(d);
        return function() {
          var e = arguments;
          switch (e.length) {
            case 0:
              return !t.call(this);
            case 1:
              return !t.call(this, e[0]);
            case 2:
              return !t.call(this, e[0], e[1]);
            case 3:
              return !t.call(this, e[0], e[1], e[2]);
          }
          return !t.apply(this, e);
        };
      }
      function aN(t) {
        return yl(2, t);
      }
      var lN = Vf(function(t, e) {
        e = e.length == 1 && J(e[0]) ? vt(e[0], he(B())) : vt($t(e, 1), he(B()));
        var n = e.length;
        return rt(function(o) {
          for (var a = -1, M = Jt(o.length, n); ++a < M; )
            o[a] = e[a].call(this, o[a]);
          return Ie(t, this, o);
        });
      }), Po = rt(function(t, e) {
        var n = Dn(e, jr(Po));
        return an(t, mt, r, e, n);
      }), jl = rt(function(t, e) {
        var n = Dn(e, jr(jl));
        return an(t, ct, r, e, n);
      }), cN = ln(function(t, e) {
        return an(t, Vt, r, r, r, e);
      });
      function MN(t, e) {
        if (typeof t != "function")
          throw new Le(d);
        return e = e === r ? e : tt(e), rt(t, e);
      }
      function fN(t, e) {
        if (typeof t != "function")
          throw new Le(d);
        return e = e == null ? 0 : Rt(tt(e), 0), rt(function(n) {
          var o = n[e], a = Cn(n, 0, e);
          return o && An(a, o), Ie(t, this, a);
        });
      }
      function gN(t, e, n) {
        var o = !0, a = !0;
        if (typeof t != "function")
          throw new Le(d);
        return _t(n) && (o = "leading" in n ? !!n.leading : o, a = "trailing" in n ? !!n.trailing : a), Dl(t, e, {
          leading: o,
          maxWait: e,
          trailing: a
        });
      }
      function dN(t) {
        return Tl(t, 1);
      }
      function NN(t, e) {
        return Po(Do(e), t);
      }
      function pN() {
        if (!arguments.length)
          return [];
        var t = arguments[0];
        return J(t) ? t : [t];
      }
      function IN(t) {
        return Ce(t, j);
      }
      function hN(t, e) {
        return e = typeof e == "function" ? e : r, Ce(t, j, e);
      }
      function TN(t) {
        return Ce(t, T | j);
      }
      function yN(t, e) {
        return e = typeof e == "function" ? e : r, Ce(t, T | j, e);
      }
      function mN(t, e) {
        return e == null || fa(t, e, Ft(e));
      }
      function Re(t, e) {
        return t === e || t !== t && e !== e;
      }
      var zN = ru(Mo), AN = ru(function(t, e) {
        return t >= e;
      }), qn = ha(function() {
        return arguments;
      }()) ? ha : function(t) {
        return xt(t) && It.call(t, "callee") && !ia.call(t, "callee");
      }, J = L.isArray, DN = Rs ? he(Rs) : Of;
      function Me(t) {
        return t != null && fu(t.length) && !Mn(t);
      }
      function wt(t) {
        return xt(t) && Me(t);
      }
      function jN(t) {
        return t === !0 || t === !1 || xt(t) && ne(t) == be;
      }
      var xn = kM || Ko, vN = Ps ? he(Ps) : Sf;
      function LN(t) {
        return xt(t) && t.nodeType === 1 && !si(t);
      }
      function _N(t) {
        if (t == null)
          return !0;
        if (Me(t) && (J(t) || typeof t == "string" || typeof t.splice == "function" || xn(t) || vr(t) || qn(t)))
          return !t.length;
        var e = qt(t);
        if (e == Gt || e == Xt)
          return !t.size;
        if (ui(t))
          return !No(t).length;
        for (var n in t)
          if (It.call(t, n))
            return !1;
        return !0;
      }
      function CN(t, e) {
        return ni(t, e);
      }
      function xN(t, e, n) {
        n = typeof n == "function" ? n : r;
        var o = n ? n(t, e) : r;
        return o === r ? ni(t, e, r, n) : !!o;
      }
      function Qo(t) {
        if (!xt(t))
          return !1;
        var e = ne(t);
        return e == pn || e == Ti || typeof t.message == "string" && typeof t.name == "string" && !si(t);
      }
      function wN(t) {
        return typeof t == "number" && oa(t);
      }
      function Mn(t) {
        if (!_t(t))
          return !1;
        var e = ne(t);
        return e == Rn || e == Rr || e == Lt || e == In;
      }
      function vl(t) {
        return typeof t == "number" && t == tt(t);
      }
      function fu(t) {
        return typeof t == "number" && t > -1 && t % 1 == 0 && t <= We;
      }
      function _t(t) {
        var e = typeof t;
        return t != null && (e == "object" || e == "function");
      }
      function xt(t) {
        return t != null && typeof t == "object";
      }
      var Ll = Qs ? he(Qs) : bf;
      function ON(t, e) {
        return t === e || go(t, e, wo(e));
      }
      function SN(t, e, n) {
        return n = typeof n == "function" ? n : r, go(t, e, wo(e), n);
      }
      function EN(t) {
        return _l(t) && t != +t;
      }
      function bN(t) {
        if (hg(t))
          throw new X(f);
        return Ta(t);
      }
      function YN(t) {
        return t === null;
      }
      function UN(t) {
        return t == null;
      }
      function _l(t) {
        return typeof t == "number" || xt(t) && ne(t) == en;
      }
      function si(t) {
        if (!xt(t) || ne(t) != de)
          return !1;
        var e = Ri(t);
        if (e === null)
          return !0;
        var n = It.call(e, "constructor") && e.constructor;
        return typeof n == "function" && n instanceof n && bi.call(n) == OM;
      }
      var Zo = Zs ? he(Zs) : Yf;
      function kN(t) {
        return vl(t) && t >= -We && t <= We;
      }
      var Cl = Gs ? he(Gs) : Uf;
      function gu(t) {
        return typeof t == "string" || !J(t) && xt(t) && ne(t) == hn;
      }
      function ye(t) {
        return typeof t == "symbol" || xt(t) && ne(t) == Pn;
      }
      var vr = Ws ? he(Ws) : kf;
      function RN(t) {
        return t === r;
      }
      function PN(t) {
        return xt(t) && qt(t) == rn;
      }
      function QN(t) {
        return xt(t) && ne(t) == Qn;
      }
      var ZN = ru(po), GN = ru(function(t, e) {
        return t <= e;
      });
      function xl(t) {
        if (!t)
          return [];
        if (Me(t))
          return gu(t) ? Ue(t) : ce(t);
        if (Hr && t[Hr])
          return yM(t[Hr]());
        var e = qt(t), n = e == Gt ? no : e == Xt ? Oi : Lr;
        return n(t);
      }
      function fn(t) {
        if (!t)
          return t === 0 ? t : 0;
        if (t = Oe(t), t === qe || t === -qe) {
          var e = t < 0 ? -1 : 1;
          return e * Eu;
        }
        return t === t ? t : 0;
      }
      function tt(t) {
        var e = fn(t), n = e % 1;
        return e === e ? n ? e - n : e : 0;
      }
      function wl(t) {
        return t ? Vn(tt(t), 0, Ae) : 0;
      }
      function Oe(t) {
        if (typeof t == "number")
          return t;
        if (ye(t))
          return Un;
        if (_t(t)) {
          var e = typeof t.valueOf == "function" ? t.valueOf() : t;
          t = _t(e) ? e + "" : e;
        }
        if (typeof t != "string")
          return t === 0 ? t : +t;
        t = Xs(t);
        var n = vi.test(t);
        return n || Pu.test(t) ? rM(t.slice(2), n ? 2 : 8) : ji.test(t) ? Un : +t;
      }
      function Ol(t) {
        return Xe(t, fe(t));
      }
      function WN(t) {
        return t ? Vn(tt(t), -We, We) : t === 0 ? t : 0;
      }
      function pt(t) {
        return t == null ? "" : Te(t);
      }
      var FN = Ar(function(t, e) {
        if (ui(e) || Me(e)) {
          Xe(e, Ft(e), t);
          return;
        }
        for (var n in e)
          It.call(e, n) && qr(t, n, e[n]);
      }), Sl = Ar(function(t, e) {
        Xe(e, fe(e), t);
      }), du = Ar(function(t, e, n, o) {
        Xe(e, fe(e), t, o);
      }), BN = Ar(function(t, e, n, o) {
        Xe(e, Ft(e), t, o);
      }), $N = ln(ao);
      function HN(t, e) {
        var n = zr(t);
        return e == null ? n : Ma(n, e);
      }
      var VN = rt(function(t, e) {
        t = Tt(t);
        var n = -1, o = e.length, a = o > 2 ? e[2] : r;
        for (a && re(e[0], e[1], a) && (o = 1); ++n < o; )
          for (var M = e[n], N = fe(M), h = -1, A = N.length; ++h < A; ) {
            var w = N[h], O = t[w];
            (O === r || Re(O, Tr[w]) && !It.call(t, w)) && (t[w] = M[w]);
          }
        return t;
      }), XN = rt(function(t) {
        return t.push(r, Xa), Ie(El, r, t);
      });
      function KN(t, e) {
        return Bs(t, B(e, 3), Ve);
      }
      function JN(t, e) {
        return Bs(t, B(e, 3), co);
      }
      function qN(t, e) {
        return t == null ? t : lo(t, B(e, 3), fe);
      }
      function t0(t, e) {
        return t == null ? t : pa(t, B(e, 3), fe);
      }
      function e0(t, e) {
        return t && Ve(t, B(e, 3));
      }
      function n0(t, e) {
        return t && co(t, B(e, 3));
      }
      function r0(t) {
        return t == null ? [] : Vi(t, Ft(t));
      }
      function i0(t) {
        return t == null ? [] : Vi(t, fe(t));
      }
      function Go(t, e, n) {
        var o = t == null ? r : Xn(t, e);
        return o === r ? n : o;
      }
      function u0(t, e) {
        return t != null && qa(t, e, _f);
      }
      function Wo(t, e) {
        return t != null && qa(t, e, Cf);
      }
      var o0 = Fa(function(t, e, n) {
        e != null && typeof e.toString != "function" && (e = Yi.call(e)), t[e] = n;
      }, Bo(ge)), s0 = Fa(function(t, e, n) {
        e != null && typeof e.toString != "function" && (e = Yi.call(e)), It.call(t, e) ? t[e].push(n) : t[e] = [n];
      }, B), a0 = rt(ei);
      function Ft(t) {
        return Me(t) ? la(t) : No(t);
      }
      function fe(t) {
        return Me(t) ? la(t, !0) : Rf(t);
      }
      function l0(t, e) {
        var n = {};
        return e = B(e, 3), Ve(t, function(o, a, M) {
          sn(n, e(o, a, M), o);
        }), n;
      }
      function c0(t, e) {
        var n = {};
        return e = B(e, 3), Ve(t, function(o, a, M) {
          sn(n, a, e(o, a, M));
        }), n;
      }
      var M0 = Ar(function(t, e, n) {
        Xi(t, e, n);
      }), El = Ar(function(t, e, n, o) {
        Xi(t, e, n, o);
      }), f0 = ln(function(t, e) {
        var n = {};
        if (t == null)
          return n;
        var o = !1;
        e = vt(e, function(M) {
          return M = _n(M, t), o || (o = M.length > 1), M;
        }), Xe(t, Co(t), n), o && (n = Ce(n, T | z | j, og));
        for (var a = e.length; a--; )
          mo(n, e[a]);
        return n;
      });
      function g0(t, e) {
        return bl(t, Mu(B(e)));
      }
      var d0 = ln(function(t, e) {
        return t == null ? {} : Qf(t, e);
      });
      function bl(t, e) {
        if (t == null)
          return {};
        var n = vt(Co(t), function(o) {
          return [o];
        });
        return e = B(e), va(t, n, function(o, a) {
          return e(o, a[0]);
        });
      }
      function N0(t, e, n) {
        e = _n(e, t);
        var o = -1, a = e.length;
        for (a || (a = 1, t = r); ++o < a; ) {
          var M = t == null ? r : t[Ke(e[o])];
          M === r && (o = a, M = n), t = Mn(M) ? M.call(t) : M;
        }
        return t;
      }
      function p0(t, e, n) {
        return t == null ? t : ri(t, e, n);
      }
      function I0(t, e, n, o) {
        return o = typeof o == "function" ? o : r, t == null ? t : ri(t, e, n, o);
      }
      var Yl = Ha(Ft), Ul = Ha(fe);
      function h0(t, e, n) {
        var o = J(t), a = o || xn(t) || vr(t);
        if (e = B(e, 4), n == null) {
          var M = t && t.constructor;
          a ? n = o ? new M() : [] : _t(t) ? n = Mn(M) ? zr(Ri(t)) : {} : n = {};
        }
        return (a ? ve : Ve)(t, function(N, h, A) {
          return e(n, N, h, A);
        }), n;
      }
      function T0(t, e) {
        return t == null ? !0 : mo(t, e);
      }
      function y0(t, e, n) {
        return t == null ? t : wa(t, e, Do(n));
      }
      function m0(t, e, n, o) {
        return o = typeof o == "function" ? o : r, t == null ? t : wa(t, e, Do(n), o);
      }
      function Lr(t) {
        return t == null ? [] : eo(t, Ft(t));
      }
      function z0(t) {
        return t == null ? [] : eo(t, fe(t));
      }
      function A0(t, e, n) {
        return n === r && (n = e, e = r), n !== r && (n = Oe(n), n = n === n ? n : 0), e !== r && (e = Oe(e), e = e === e ? e : 0), Vn(Oe(t), e, n);
      }
      function D0(t, e, n) {
        return e = fn(e), n === r ? (n = e, e = 0) : n = fn(n), t = Oe(t), xf(t, e, n);
      }
      function j0(t, e, n) {
        if (n && typeof n != "boolean" && re(t, e, n) && (e = n = r), n === r && (typeof e == "boolean" ? (n = e, e = r) : typeof t == "boolean" && (n = t, t = r)), t === r && e === r ? (t = 0, e = 1) : (t = fn(t), e === r ? (e = t, t = 0) : e = fn(e)), t > e) {
          var o = t;
          t = e, e = o;
        }
        if (n || t % 1 || e % 1) {
          var a = sa();
          return Jt(t + a * (e - t + nM("1e-" + ((a + "").length - 1))), e);
        }
        return ho(t, e);
      }
      var v0 = Dr(function(t, e, n) {
        return e = e.toLowerCase(), t + (n ? kl(e) : e);
      });
      function kl(t) {
        return Fo(pt(t).toLowerCase());
      }
      function Rl(t) {
        return t = pt(t), t && t.replace(y, NM).replace(Bc, "");
      }
      function L0(t, e, n) {
        t = pt(t), e = Te(e);
        var o = t.length;
        n = n === r ? o : Vn(tt(n), 0, o);
        var a = n;
        return n -= e.length, n >= 0 && t.slice(n, a) == e;
      }
      function _0(t) {
        return t = pt(t), t && bt.test(t) ? t.replace(yi, pM) : t;
      }
      function C0(t) {
        return t = pt(t), t && Mr.test(t) ? t.replace(Wr, "\\$&") : t;
      }
      var x0 = Dr(function(t, e, n) {
        return t + (n ? "-" : "") + e.toLowerCase();
      }), w0 = Dr(function(t, e, n) {
        return t + (n ? " " : "") + e.toLowerCase();
      }), O0 = Za("toLowerCase");
      function S0(t, e, n) {
        t = pt(t), e = tt(e);
        var o = e ? Ir(t) : 0;
        if (!e || o >= e)
          return t;
        var a = (e - o) / 2;
        return nu(Gi(a), n) + t + nu(Zi(a), n);
      }
      function E0(t, e, n) {
        t = pt(t), e = tt(e);
        var o = e ? Ir(t) : 0;
        return e && o < e ? t + nu(e - o, n) : t;
      }
      function b0(t, e, n) {
        t = pt(t), e = tt(e);
        var o = e ? Ir(t) : 0;
        return e && o < e ? nu(e - o, n) + t : t;
      }
      function Y0(t, e, n) {
        return n || e == null ? e = 0 : e && (e = +e), ZM(pt(t).replace(Gn, ""), e || 0);
      }
      function U0(t, e, n) {
        return (n ? re(t, e, n) : e === r) ? e = 1 : e = tt(e), To(pt(t), e);
      }
      function k0() {
        var t = arguments, e = pt(t[0]);
        return t.length < 3 ? e : e.replace(t[1], t[2]);
      }
      var R0 = Dr(function(t, e, n) {
        return t + (n ? "_" : "") + e.toLowerCase();
      });
      function P0(t, e, n) {
        return n && typeof n != "number" && re(t, e, n) && (e = n = r), n = n === r ? Ae : n >>> 0, n ? (t = pt(t), t && (typeof e == "string" || e != null && !Zo(e)) && (e = Te(e), !e && pr(t)) ? Cn(Ue(t), 0, n) : t.split(e, n)) : [];
      }
      var Q0 = Dr(function(t, e, n) {
        return t + (n ? " " : "") + Fo(e);
      });
      function Z0(t, e, n) {
        return t = pt(t), n = n == null ? 0 : Vn(tt(n), 0, t.length), e = Te(e), t.slice(n, n + e.length) == e;
      }
      function G0(t, e, n) {
        var o = c.templateSettings;
        n && re(t, e, n) && (e = r), t = pt(t), e = du({}, e, o, Va);
        var a = du({}, e.imports, o.imports, Va), M = Ft(a), N = eo(a, M), h, A, w = 0, O = e.interpolate || E, S = "__p += '", k = ro(
          (e.escape || E).source + "|" + O.source + "|" + (O === Zr ? Ye : E).source + "|" + (e.evaluate || E).source + "|$",
          "g"
        ), W = "//# sourceURL=" + (It.call(e, "sourceURL") ? (e.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++Kc + "]") + `
`;
        t.replace(k, function(H, ot, Mt, me, ie, ze) {
          return Mt || (Mt = me), S += t.slice(w, ze).replace(U, IM), ot && (h = !0, S += `' +
__e(` + ot + `) +
'`), ie && (A = !0, S += `';
` + ie + `;
__p += '`), Mt && (S += `' +
((__t = (` + Mt + `)) == null ? '' : __t) +
'`), w = ze + H.length, H;
        }), S += `';
`;
        var $ = It.call(e, "variable") && e.variable;
        if (!$)
          S = `with (obj) {
` + S + `
}
`;
        else if (Fr.test($))
          throw new X(p);
        S = (A ? S.replace(Pr, "") : S).replace(Qr, "$1").replace(Yu, "$1;"), S = "function(" + ($ || "obj") + `) {
` + ($ ? "" : `obj || (obj = {});
`) + "var __t, __p = ''" + (h ? ", __e = _.escape" : "") + (A ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + S + `return __p
}`;
        var et = Ql(function() {
          return Nt(M, W + "return " + S).apply(r, N);
        });
        if (et.source = S, Qo(et))
          throw et;
        return et;
      }
      function W0(t) {
        return pt(t).toLowerCase();
      }
      function F0(t) {
        return pt(t).toUpperCase();
      }
      function B0(t, e, n) {
        if (t = pt(t), t && (n || e === r))
          return Xs(t);
        if (!t || !(e = Te(e)))
          return t;
        var o = Ue(t), a = Ue(e), M = Ks(o, a), N = Js(o, a) + 1;
        return Cn(o, M, N).join("");
      }
      function $0(t, e, n) {
        if (t = pt(t), t && (n || e === r))
          return t.slice(0, ta(t) + 1);
        if (!t || !(e = Te(e)))
          return t;
        var o = Ue(t), a = Js(o, Ue(e)) + 1;
        return Cn(o, 0, a).join("");
      }
      function H0(t, e, n) {
        if (t = pt(t), t && (n || e === r))
          return t.replace(Gn, "");
        if (!t || !(e = Te(e)))
          return t;
        var o = Ue(t), a = Ks(o, Ue(e));
        return Cn(o, a).join("");
      }
      function V0(t, e) {
        var n = zt, o = Nn;
        if (_t(e)) {
          var a = "separator" in e ? e.separator : a;
          n = "length" in e ? tt(e.length) : n, o = "omission" in e ? Te(e.omission) : o;
        }
        t = pt(t);
        var M = t.length;
        if (pr(t)) {
          var N = Ue(t);
          M = N.length;
        }
        if (n >= M)
          return t;
        var h = n - Ir(o);
        if (h < 1)
          return o;
        var A = N ? Cn(N, 0, h).join("") : t.slice(0, h);
        if (a === r)
          return A + o;
        if (N && (h += A.length - h), Zo(a)) {
          if (t.slice(h).search(a)) {
            var w, O = A;
            for (a.global || (a = ro(a.source, pt(Br.exec(a)) + "g")), a.lastIndex = 0; w = a.exec(O); )
              var S = w.index;
            A = A.slice(0, S === r ? h : S);
          }
        } else if (t.indexOf(Te(a), h) != h) {
          var k = A.lastIndexOf(a);
          k > -1 && (A = A.slice(0, k));
        }
        return A + o;
      }
      function X0(t) {
        return t = pt(t), t && Uu.test(t) ? t.replace($e, DM) : t;
      }
      var K0 = Dr(function(t, e, n) {
        return t + (n ? " " : "") + e.toUpperCase();
      }), Fo = Za("toUpperCase");
      function Pl(t, e, n) {
        return t = pt(t), e = n ? r : e, e === r ? TM(t) ? LM(t) : cM(t) : t.match(e) || [];
      }
      var Ql = rt(function(t, e) {
        try {
          return Ie(t, r, e);
        } catch (n) {
          return Qo(n) ? n : new X(n);
        }
      }), J0 = ln(function(t, e) {
        return ve(e, function(n) {
          n = Ke(n), sn(t, n, Ro(t[n], t));
        }), t;
      });
      function q0(t) {
        var e = t == null ? 0 : t.length, n = B();
        return t = e ? vt(t, function(o) {
          if (typeof o[1] != "function")
            throw new Le(d);
          return [n(o[0]), o[1]];
        }) : [], rt(function(o) {
          for (var a = -1; ++a < e; ) {
            var M = t[a];
            if (Ie(M[0], this, o))
              return Ie(M[1], this, o);
          }
        });
      }
      function tp(t) {
        return jf(Ce(t, T));
      }
      function Bo(t) {
        return function() {
          return t;
        };
      }
      function ep(t, e) {
        return t == null || t !== t ? e : t;
      }
      var np = Wa(), rp = Wa(!0);
      function ge(t) {
        return t;
      }
      function $o(t) {
        return ya(typeof t == "function" ? t : Ce(t, T));
      }
      function ip(t) {
        return za(Ce(t, T));
      }
      function up(t, e) {
        return Aa(t, Ce(e, T));
      }
      var op = rt(function(t, e) {
        return function(n) {
          return ei(n, t, e);
        };
      }), sp = rt(function(t, e) {
        return function(n) {
          return ei(t, n, e);
        };
      });
      function Ho(t, e, n) {
        var o = Ft(e), a = Vi(e, o);
        n == null && !(_t(e) && (a.length || !o.length)) && (n = e, e = t, t = this, a = Vi(e, Ft(e)));
        var M = !(_t(n) && "chain" in n) || !!n.chain, N = Mn(t);
        return ve(a, function(h) {
          var A = e[h];
          t[h] = A, N && (t.prototype[h] = function() {
            var w = this.__chain__;
            if (M || w) {
              var O = t(this.__wrapped__), S = O.__actions__ = ce(this.__actions__);
              return S.push({ func: A, args: arguments, thisArg: t }), O.__chain__ = w, O;
            }
            return A.apply(t, An([this.value()], arguments));
          });
        }), t;
      }
      function ap() {
        return Bt._ === this && (Bt._ = SM), this;
      }
      function Vo() {
      }
      function lp(t) {
        return t = tt(t), rt(function(e) {
          return Da(e, t);
        });
      }
      var cp = vo(vt), Mp = vo(Fs), fp = vo(Xu);
      function Zl(t) {
        return So(t) ? Ku(Ke(t)) : Zf(t);
      }
      function gp(t) {
        return function(e) {
          return t == null ? r : Xn(t, e);
        };
      }
      var dp = Ba(), Np = Ba(!0);
      function Xo() {
        return [];
      }
      function Ko() {
        return !1;
      }
      function pp() {
        return {};
      }
      function Ip() {
        return "";
      }
      function hp() {
        return !0;
      }
      function Tp(t, e) {
        if (t = tt(t), t < 1 || t > We)
          return [];
        var n = Ae, o = Jt(t, Ae);
        e = B(e), t -= Ae;
        for (var a = to(o, e); ++n < t; )
          e(n);
        return a;
      }
      function yp(t) {
        return J(t) ? vt(t, Ke) : ye(t) ? [t] : ce(al(pt(t)));
      }
      function mp(t) {
        var e = ++wM;
        return pt(t) + e;
      }
      var zp = eu(function(t, e) {
        return t + e;
      }, 0), Ap = Lo("ceil"), Dp = eu(function(t, e) {
        return t / e;
      }, 1), jp = Lo("floor");
      function vp(t) {
        return t && t.length ? Hi(t, ge, Mo) : r;
      }
      function Lp(t, e) {
        return t && t.length ? Hi(t, B(e, 2), Mo) : r;
      }
      function _p(t) {
        return Hs(t, ge);
      }
      function Cp(t, e) {
        return Hs(t, B(e, 2));
      }
      function xp(t) {
        return t && t.length ? Hi(t, ge, po) : r;
      }
      function wp(t, e) {
        return t && t.length ? Hi(t, B(e, 2), po) : r;
      }
      var Op = eu(function(t, e) {
        return t * e;
      }, 1), Sp = Lo("round"), Ep = eu(function(t, e) {
        return t - e;
      }, 0);
      function bp(t) {
        return t && t.length ? qu(t, ge) : 0;
      }
      function Yp(t, e) {
        return t && t.length ? qu(t, B(e, 2)) : 0;
      }
      return c.after = iN, c.ary = Tl, c.assign = FN, c.assignIn = Sl, c.assignInWith = du, c.assignWith = BN, c.at = $N, c.before = yl, c.bind = Ro, c.bindAll = J0, c.bindKey = ml, c.castArray = pN, c.chain = pl, c.chunk = jg, c.compact = vg, c.concat = Lg, c.cond = q0, c.conforms = tp, c.constant = Bo, c.countBy = bd, c.create = HN, c.curry = zl, c.curryRight = Al, c.debounce = Dl, c.defaults = VN, c.defaultsDeep = XN, c.defer = uN, c.delay = oN, c.difference = _g, c.differenceBy = Cg, c.differenceWith = xg, c.drop = wg, c.dropRight = Og, c.dropRightWhile = Sg, c.dropWhile = Eg, c.fill = bg, c.filter = Ud, c.flatMap = Pd, c.flatMapDeep = Qd, c.flatMapDepth = Zd, c.flatten = fl, c.flattenDeep = Yg, c.flattenDepth = Ug, c.flip = sN, c.flow = np, c.flowRight = rp, c.fromPairs = kg, c.functions = r0, c.functionsIn = i0, c.groupBy = Gd, c.initial = Pg, c.intersection = Qg, c.intersectionBy = Zg, c.intersectionWith = Gg, c.invert = o0, c.invertBy = s0, c.invokeMap = Fd, c.iteratee = $o, c.keyBy = Bd, c.keys = Ft, c.keysIn = fe, c.map = au, c.mapKeys = l0, c.mapValues = c0, c.matches = ip, c.matchesProperty = up, c.memoize = cu, c.merge = M0, c.mergeWith = El, c.method = op, c.methodOf = sp, c.mixin = Ho, c.negate = Mu, c.nthArg = lp, c.omit = f0, c.omitBy = g0, c.once = aN, c.orderBy = $d, c.over = cp, c.overArgs = lN, c.overEvery = Mp, c.overSome = fp, c.partial = Po, c.partialRight = jl, c.partition = Hd, c.pick = d0, c.pickBy = bl, c.property = Zl, c.propertyOf = gp, c.pull = $g, c.pullAll = dl, c.pullAllBy = Hg, c.pullAllWith = Vg, c.pullAt = Xg, c.range = dp, c.rangeRight = Np, c.rearg = cN, c.reject = Kd, c.remove = Kg, c.rest = MN, c.reverse = Uo, c.sampleSize = qd, c.set = p0, c.setWith = I0, c.shuffle = tN, c.slice = Jg, c.sortBy = rN, c.sortedUniq = ud, c.sortedUniqBy = od, c.split = P0, c.spread = fN, c.tail = sd, c.take = ad, c.takeRight = ld, c.takeRightWhile = cd, c.takeWhile = Md, c.tap = vd, c.throttle = gN, c.thru = su, c.toArray = xl, c.toPairs = Yl, c.toPairsIn = Ul, c.toPath = yp, c.toPlainObject = Ol, c.transform = h0, c.unary = dN, c.union = fd, c.unionBy = gd, c.unionWith = dd, c.uniq = Nd, c.uniqBy = pd, c.uniqWith = Id, c.unset = T0, c.unzip = ko, c.unzipWith = Nl, c.update = y0, c.updateWith = m0, c.values = Lr, c.valuesIn = z0, c.without = hd, c.words = Pl, c.wrap = NN, c.xor = Td, c.xorBy = yd, c.xorWith = md, c.zip = zd, c.zipObject = Ad, c.zipObjectDeep = Dd, c.zipWith = jd, c.entries = Yl, c.entriesIn = Ul, c.extend = Sl, c.extendWith = du, Ho(c, c), c.add = zp, c.attempt = Ql, c.camelCase = v0, c.capitalize = kl, c.ceil = Ap, c.clamp = A0, c.clone = IN, c.cloneDeep = TN, c.cloneDeepWith = yN, c.cloneWith = hN, c.conformsTo = mN, c.deburr = Rl, c.defaultTo = ep, c.divide = Dp, c.endsWith = L0, c.eq = Re, c.escape = _0, c.escapeRegExp = C0, c.every = Yd, c.find = kd, c.findIndex = cl, c.findKey = KN, c.findLast = Rd, c.findLastIndex = Ml, c.findLastKey = JN, c.floor = jp, c.forEach = Il, c.forEachRight = hl, c.forIn = qN, c.forInRight = t0, c.forOwn = e0, c.forOwnRight = n0, c.get = Go, c.gt = zN, c.gte = AN, c.has = u0, c.hasIn = Wo, c.head = gl, c.identity = ge, c.includes = Wd, c.indexOf = Rg, c.inRange = D0, c.invoke = a0, c.isArguments = qn, c.isArray = J, c.isArrayBuffer = DN, c.isArrayLike = Me, c.isArrayLikeObject = wt, c.isBoolean = jN, c.isBuffer = xn, c.isDate = vN, c.isElement = LN, c.isEmpty = _N, c.isEqual = CN, c.isEqualWith = xN, c.isError = Qo, c.isFinite = wN, c.isFunction = Mn, c.isInteger = vl, c.isLength = fu, c.isMap = Ll, c.isMatch = ON, c.isMatchWith = SN, c.isNaN = EN, c.isNative = bN, c.isNil = UN, c.isNull = YN, c.isNumber = _l, c.isObject = _t, c.isObjectLike = xt, c.isPlainObject = si, c.isRegExp = Zo, c.isSafeInteger = kN, c.isSet = Cl, c.isString = gu, c.isSymbol = ye, c.isTypedArray = vr, c.isUndefined = RN, c.isWeakMap = PN, c.isWeakSet = QN, c.join = Wg, c.kebabCase = x0, c.last = we, c.lastIndexOf = Fg, c.lowerCase = w0, c.lowerFirst = O0, c.lt = ZN, c.lte = GN, c.max = vp, c.maxBy = Lp, c.mean = _p, c.meanBy = Cp, c.min = xp, c.minBy = wp, c.stubArray = Xo, c.stubFalse = Ko, c.stubObject = pp, c.stubString = Ip, c.stubTrue = hp, c.multiply = Op, c.nth = Bg, c.noConflict = ap, c.noop = Vo, c.now = lu, c.pad = S0, c.padEnd = E0, c.padStart = b0, c.parseInt = Y0, c.random = j0, c.reduce = Vd, c.reduceRight = Xd, c.repeat = U0, c.replace = k0, c.result = N0, c.round = Sp, c.runInContext = m, c.sample = Jd, c.size = eN, c.snakeCase = R0, c.some = nN, c.sortedIndex = qg, c.sortedIndexBy = td, c.sortedIndexOf = ed, c.sortedLastIndex = nd, c.sortedLastIndexBy = rd, c.sortedLastIndexOf = id, c.startCase = Q0, c.startsWith = Z0, c.subtract = Ep, c.sum = bp, c.sumBy = Yp, c.template = G0, c.times = Tp, c.toFinite = fn, c.toInteger = tt, c.toLength = wl, c.toLower = W0, c.toNumber = Oe, c.toSafeInteger = WN, c.toString = pt, c.toUpper = F0, c.trim = B0, c.trimEnd = $0, c.trimStart = H0, c.truncate = V0, c.unescape = X0, c.uniqueId = mp, c.upperCase = K0, c.upperFirst = Fo, c.each = Il, c.eachRight = hl, c.first = gl, Ho(c, function() {
        var t = {};
        return Ve(c, function(e, n) {
          It.call(c.prototype, n) || (t[n] = e);
        }), t;
      }(), { chain: !1 }), c.VERSION = s, ve(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(t) {
        c[t].placeholder = c;
      }), ve(["drop", "take"], function(t, e) {
        at.prototype[t] = function(n) {
          n = n === r ? 1 : Rt(tt(n), 0);
          var o = this.__filtered__ && !e ? new at(this) : this.clone();
          return o.__filtered__ ? o.__takeCount__ = Jt(n, o.__takeCount__) : o.__views__.push({
            size: Jt(n, Ae),
            type: t + (o.__dir__ < 0 ? "Right" : "")
          }), o;
        }, at.prototype[t + "Right"] = function(n) {
          return this.reverse()[t](n).reverse();
        };
      }), ve(["filter", "map", "takeWhile"], function(t, e) {
        var n = e + 1, o = n == ur || n == Ur;
        at.prototype[t] = function(a) {
          var M = this.clone();
          return M.__iteratees__.push({
            iteratee: B(a, 3),
            type: n
          }), M.__filtered__ = M.__filtered__ || o, M;
        };
      }), ve(["head", "last"], function(t, e) {
        var n = "take" + (e ? "Right" : "");
        at.prototype[t] = function() {
          return this[n](1).value()[0];
        };
      }), ve(["initial", "tail"], function(t, e) {
        var n = "drop" + (e ? "" : "Right");
        at.prototype[t] = function() {
          return this.__filtered__ ? new at(this) : this[n](1);
        };
      }), at.prototype.compact = function() {
        return this.filter(ge);
      }, at.prototype.find = function(t) {
        return this.filter(t).head();
      }, at.prototype.findLast = function(t) {
        return this.reverse().find(t);
      }, at.prototype.invokeMap = rt(function(t, e) {
        return typeof t == "function" ? new at(this) : this.map(function(n) {
          return ei(n, t, e);
        });
      }), at.prototype.reject = function(t) {
        return this.filter(Mu(B(t)));
      }, at.prototype.slice = function(t, e) {
        t = tt(t);
        var n = this;
        return n.__filtered__ && (t > 0 || e < 0) ? new at(n) : (t < 0 ? n = n.takeRight(-t) : t && (n = n.drop(t)), e !== r && (e = tt(e), n = e < 0 ? n.dropRight(-e) : n.take(e - t)), n);
      }, at.prototype.takeRightWhile = function(t) {
        return this.reverse().takeWhile(t).reverse();
      }, at.prototype.toArray = function() {
        return this.take(Ae);
      }, Ve(at.prototype, function(t, e) {
        var n = /^(?:filter|find|map|reject)|While$/.test(e), o = /^(?:head|last)$/.test(e), a = c[o ? "take" + (e == "last" ? "Right" : "") : e], M = o || /^find/.test(e);
        a && (c.prototype[e] = function() {
          var N = this.__wrapped__, h = o ? [1] : arguments, A = N instanceof at, w = h[0], O = A || J(N), S = function(ot) {
            var Mt = a.apply(c, An([ot], h));
            return o && k ? Mt[0] : Mt;
          };
          O && n && typeof w == "function" && w.length != 1 && (A = O = !1);
          var k = this.__chain__, W = !!this.__actions__.length, $ = M && !k, et = A && !W;
          if (!M && O) {
            N = et ? N : new at(this);
            var H = t.apply(N, h);
            return H.__actions__.push({ func: su, args: [S], thisArg: r }), new _e(H, k);
          }
          return $ && et ? t.apply(this, h) : (H = this.thru(S), $ ? o ? H.value()[0] : H.value() : H);
        });
      }), ve(["pop", "push", "shift", "sort", "splice", "unshift"], function(t) {
        var e = Si[t], n = /^(?:push|sort|unshift)$/.test(t) ? "tap" : "thru", o = /^(?:pop|shift)$/.test(t);
        c.prototype[t] = function() {
          var a = arguments;
          if (o && !this.__chain__) {
            var M = this.value();
            return e.apply(J(M) ? M : [], a);
          }
          return this[n](function(N) {
            return e.apply(J(N) ? N : [], a);
          });
        };
      }), Ve(at.prototype, function(t, e) {
        var n = c[e];
        if (n) {
          var o = n.name + "";
          It.call(mr, o) || (mr[o] = []), mr[o].push({ name: e, func: n });
        }
      }), mr[tu(r, x).name] = [{
        name: "wrapper",
        func: r
      }], at.prototype.clone = VM, at.prototype.reverse = XM, at.prototype.value = KM, c.prototype.at = Ld, c.prototype.chain = _d, c.prototype.commit = Cd, c.prototype.next = xd, c.prototype.plant = Od, c.prototype.reverse = Sd, c.prototype.toJSON = c.prototype.valueOf = c.prototype.value = Ed, c.prototype.first = c.prototype.head, Hr && (c.prototype[Hr] = wd), c;
    }, hr = _M();
    Fn ? ((Fn.exports = hr)._ = hr, Bu._ = hr) : Bt._ = hr;
  }).call(ai);
})(Au, Au.exports);
var SI = Au.exports;
class EI {
  constructor(u) {
    this.baseURL = u;
  }
  // eslint-disable-next-line class-methods-use-this
  transformProjectFiles(u) {
    return SI.get(u, "files.list") !== null ? _r(St({}, u), {
      files: _r(St({}, u.files), {
        list: u.files.list.map((r) => {
          if (typeof r == "string") {
            const s = r.lastIndexOf("/");
            return {
              source: r,
              name: s > 0 ? r.substring(s + 1) : ""
            };
          }
          return r;
        })
      })
    }) : u;
  }
  fetch(u) {
    return Je(this, null, function* () {
      return this.transformProjectFiles(
        yield (yield fetch(`${this.baseURL}/project/json/${u}`)).json()
      );
    });
  }
  save(u) {
    return Je(this, null, function* () {
      return (yield fetch(`${this.baseURL}/project/json/${u.shortname}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: u
        })
      })).json();
    });
  }
  delete(u) {
    return Je(this, null, function* () {
      return (yield fetch(`${this.baseURL}/project/json/${u}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      })).json();
    });
  }
}
const ft = vu({
  project: null,
  loading: !0
});
function rr() {
  const { baseURL: i, usernameField: u } = Ge("config"), r = new EI(i), s = (x) => {
    ft.project = r.transformProjectFiles(x);
  }, l = (x) => Je(this, null, function* () {
    ft.loading = !0, ft.project = yield r.fetch(x), ft.loading = !1;
  }), f = (x) => r.save(x), d = (x) => r.delete(x), p = (x) => {
    ft.project && (ft.project = St(St({}, ft.project), x));
  }, v = () => {
    ft.project && ft.project.collaborators.list.push({
      [u]: "",
      name: "",
      access: { collaborators: "none", annotations: "none", files: "none" }
    });
  }, g = (x, K) => {
    if (!ft.project)
      return;
    const P = ft.project.collaborators.list[x];
    ft.project.collaborators.list[x] = St(St({}, P), K);
  }, I = (x) => {
    ft.project && (ft.project.collaborators.list = ft.project.collaborators.list.filter(
      (K) => !x.includes(
        ft.project.collaborators.list.indexOf(K)
      )
    ));
  }, T = () => {
    ft.project && ft.project.annotations.list.push({
      type: "text",
      name: "",
      values: "",
      display: !0
    });
  }, z = (x, K) => {
    if (!ft.project)
      return;
    const P = ft.project.annotations.list[x];
    ft.project.annotations.list[x] = St(St({}, P), K);
  }, j = (x) => {
    ft.project && (ft.project.annotations.list = ft.project.annotations.list.filter(
      (K) => !x.includes(
        ft.project.annotations.list.indexOf(K)
      )
    ));
  }, b = () => {
    ft.project && ft.project.files.list.push({
      source: "",
      name: ""
    });
  }, R = (x, K) => {
    if (!ft.project)
      return;
    const P = ft.project.files.list[x];
    ft.project.files.list[x] = St(St({}, P), K);
  }, _ = (x) => {
    ft.project && (ft.project.files.list = ft.project.files.list.filter(
      (K) => !x.includes(ft.project.files.list.indexOf(K))
    ));
  };
  return _r(St({}, Qp(ft)), {
    setProject: s,
    fetchProject: l,
    saveProject: f,
    deleteProject: d,
    updateProject: p,
    addCollaborator: v,
    updateCollaborator: g,
    removeCollaborators: I,
    addAnnotation: T,
    updateAnnotation: z,
    removeAnnotations: j,
    addFile: b,
    updateFile: R,
    removeFiles: _
  });
}
const bI = {
  __name: "Annotations",
  setup(i) {
    const {
      project: u,
      addAnnotation: r,
      updateAnnotation: s,
      removeAnnotations: l
    } = rr();
    return u.value && u.value.annotations && u.value.annotations.list && u.value.annotations.list.length === 0 && r(), (f, d) => G(u) && G(u).annotations ? (Y(), Qt(wI, {
      key: 0,
      annotations: G(u).annotations.list,
      onAddAnnotation: G(r),
      onRemoveAnnotations: G(l),
      onUpdateAnnotation: G(s)
    }, null, 8, ["annotations", "onAddAnnotation", "onRemoveAnnotations", "onUpdateAnnotation"])) : oe("", !0);
  }
};
var YI = typeof global == "object" && global && global.Object === Object && global;
const UI = YI;
var kI = typeof self == "object" && self && self.Object === Object && self, RI = UI || kI || Function("return this")();
const _u = RI;
var PI = _u.Symbol;
const Or = PI;
var hc = Object.prototype, QI = hc.hasOwnProperty, ZI = hc.toString, li = Or ? Or.toStringTag : void 0;
function GI(i) {
  var u = QI.call(i, li), r = i[li];
  try {
    i[li] = void 0;
    var s = !0;
  } catch (f) {
  }
  var l = ZI.call(i);
  return s && (u ? i[li] = r : delete i[li]), l;
}
var WI = Object.prototype, FI = WI.toString;
function BI(i) {
  return FI.call(i);
}
var $I = "[object Null]", HI = "[object Undefined]", Vl = Or ? Or.toStringTag : void 0;
function Tc(i) {
  return i == null ? i === void 0 ? HI : $I : Vl && Vl in Object(i) ? GI(i) : BI(i);
}
function VI(i) {
  return i != null && typeof i == "object";
}
var XI = "[object Symbol]";
function Cu(i) {
  return typeof i == "symbol" || VI(i) && Tc(i) == XI;
}
function KI(i, u) {
  for (var r = -1, s = i == null ? 0 : i.length, l = Array(s); ++r < s; )
    l[r] = u(i[r], r, i);
  return l;
}
var JI = Array.isArray;
const hs = JI;
var qI = 1 / 0, Xl = Or ? Or.prototype : void 0, Kl = Xl ? Xl.toString : void 0;
function yc(i) {
  if (typeof i == "string")
    return i;
  if (hs(i))
    return KI(i, yc) + "";
  if (Cu(i))
    return Kl ? Kl.call(i) : "";
  var u = i + "";
  return u == "0" && 1 / i == -qI ? "-0" : u;
}
var th = /\s/;
function eh(i) {
  for (var u = i.length; u-- && th.test(i.charAt(u)); )
    ;
  return u;
}
var nh = /^\s+/;
function rh(i) {
  return i && i.slice(0, eh(i) + 1).replace(nh, "");
}
function di(i) {
  var u = typeof i;
  return i != null && (u == "object" || u == "function");
}
var Jl = 0 / 0, ih = /^[-+]0x[0-9a-f]+$/i, uh = /^0b[01]+$/i, oh = /^0o[0-7]+$/i, sh = parseInt;
function ql(i) {
  if (typeof i == "number")
    return i;
  if (Cu(i))
    return Jl;
  if (di(i)) {
    var u = typeof i.valueOf == "function" ? i.valueOf() : i;
    i = di(u) ? u + "" : u;
  }
  if (typeof i != "string")
    return i === 0 ? i : +i;
  i = rh(i);
  var r = uh.test(i);
  return r || oh.test(i) ? sh(i.slice(2), r ? 2 : 8) : ih.test(i) ? Jl : +i;
}
var ah = "[object AsyncFunction]", lh = "[object Function]", ch = "[object GeneratorFunction]", Mh = "[object Proxy]";
function fh(i) {
  if (!di(i))
    return !1;
  var u = Tc(i);
  return u == lh || u == ch || u == ah || u == Mh;
}
var gh = _u["__core-js_shared__"];
const qo = gh;
var tc = function() {
  var i = /[^.]+$/.exec(qo && qo.keys && qo.keys.IE_PROTO || "");
  return i ? "Symbol(src)_1." + i : "";
}();
function dh(i) {
  return !!tc && tc in i;
}
var Nh = Function.prototype, ph = Nh.toString;
function Ih(i) {
  if (i != null) {
    try {
      return ph.call(i);
    } catch (u) {
    }
    try {
      return i + "";
    } catch (u) {
    }
  }
  return "";
}
var hh = /[\\^$.*+?()[\]{}|]/g, Th = /^\[object .+?Constructor\]$/, yh = Function.prototype, mh = Object.prototype, zh = yh.toString, Ah = mh.hasOwnProperty, Dh = RegExp(
  "^" + zh.call(Ah).replace(hh, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function jh(i) {
  if (!di(i) || dh(i))
    return !1;
  var u = fh(i) ? Dh : Th;
  return u.test(Ih(i));
}
function vh(i, u) {
  return i == null ? void 0 : i[u];
}
function mc(i, u) {
  var r = vh(i, u);
  return jh(r) ? r : void 0;
}
function Lh(i, u) {
  return i === u || i !== i && u !== u;
}
var _h = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, Ch = /^\w*$/;
function xh(i, u) {
  if (hs(i))
    return !1;
  var r = typeof i;
  return r == "number" || r == "symbol" || r == "boolean" || i == null || Cu(i) ? !0 : Ch.test(i) || !_h.test(i) || u != null && i in Object(u);
}
var wh = mc(Object, "create");
const Ni = wh;
function Oh() {
  this.__data__ = Ni ? Ni(null) : {}, this.size = 0;
}
function Sh(i) {
  var u = this.has(i) && delete this.__data__[i];
  return this.size -= u ? 1 : 0, u;
}
var Eh = "__lodash_hash_undefined__", bh = Object.prototype, Yh = bh.hasOwnProperty;
function Uh(i) {
  var u = this.__data__;
  if (Ni) {
    var r = u[i];
    return r === Eh ? void 0 : r;
  }
  return Yh.call(u, i) ? u[i] : void 0;
}
var kh = Object.prototype, Rh = kh.hasOwnProperty;
function Ph(i) {
  var u = this.__data__;
  return Ni ? u[i] !== void 0 : Rh.call(u, i);
}
var Qh = "__lodash_hash_undefined__";
function Zh(i, u) {
  var r = this.__data__;
  return this.size += this.has(i) ? 0 : 1, r[i] = Ni && u === void 0 ? Qh : u, this;
}
function nr(i) {
  var u = -1, r = i == null ? 0 : i.length;
  for (this.clear(); ++u < r; ) {
    var s = i[u];
    this.set(s[0], s[1]);
  }
}
nr.prototype.clear = Oh;
nr.prototype.delete = Sh;
nr.prototype.get = Uh;
nr.prototype.has = Ph;
nr.prototype.set = Zh;
function Gh() {
  this.__data__ = [], this.size = 0;
}
function xu(i, u) {
  for (var r = i.length; r--; )
    if (Lh(i[r][0], u))
      return r;
  return -1;
}
var Wh = Array.prototype, Fh = Wh.splice;
function Bh(i) {
  var u = this.__data__, r = xu(u, i);
  if (r < 0)
    return !1;
  var s = u.length - 1;
  return r == s ? u.pop() : Fh.call(u, r, 1), --this.size, !0;
}
function $h(i) {
  var u = this.__data__, r = xu(u, i);
  return r < 0 ? void 0 : u[r][1];
}
function Hh(i) {
  return xu(this.__data__, i) > -1;
}
function Vh(i, u) {
  var r = this.__data__, s = xu(r, i);
  return s < 0 ? (++this.size, r.push([i, u])) : r[s][1] = u, this;
}
function br(i) {
  var u = -1, r = i == null ? 0 : i.length;
  for (this.clear(); ++u < r; ) {
    var s = i[u];
    this.set(s[0], s[1]);
  }
}
br.prototype.clear = Gh;
br.prototype.delete = Bh;
br.prototype.get = $h;
br.prototype.has = Hh;
br.prototype.set = Vh;
var Xh = mc(_u, "Map");
const Kh = Xh;
function Jh() {
  this.size = 0, this.__data__ = {
    hash: new nr(),
    map: new (Kh || br)(),
    string: new nr()
  };
}
function qh(i) {
  var u = typeof i;
  return u == "string" || u == "number" || u == "symbol" || u == "boolean" ? i !== "__proto__" : i === null;
}
function wu(i, u) {
  var r = i.__data__;
  return qh(u) ? r[typeof u == "string" ? "string" : "hash"] : r.map;
}
function tT(i) {
  var u = wu(this, i).delete(i);
  return this.size -= u ? 1 : 0, u;
}
function eT(i) {
  return wu(this, i).get(i);
}
function nT(i) {
  return wu(this, i).has(i);
}
function rT(i, u) {
  var r = wu(this, i), s = r.size;
  return r.set(i, u), this.size += r.size == s ? 0 : 1, this;
}
function ir(i) {
  var u = -1, r = i == null ? 0 : i.length;
  for (this.clear(); ++u < r; ) {
    var s = i[u];
    this.set(s[0], s[1]);
  }
}
ir.prototype.clear = Jh;
ir.prototype.delete = tT;
ir.prototype.get = eT;
ir.prototype.has = nT;
ir.prototype.set = rT;
var iT = "Expected a function";
function Ts(i, u) {
  if (typeof i != "function" || u != null && typeof u != "function")
    throw new TypeError(iT);
  var r = function() {
    var s = arguments, l = u ? u.apply(this, s) : s[0], f = r.cache;
    if (f.has(l))
      return f.get(l);
    var d = i.apply(this, s);
    return r.cache = f.set(l, d) || f, d;
  };
  return r.cache = new (Ts.Cache || ir)(), r;
}
Ts.Cache = ir;
var uT = 500;
function oT(i) {
  var u = Ts(i, function(s) {
    return r.size === uT && r.clear(), s;
  }), r = u.cache;
  return u;
}
var sT = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, aT = /\\(\\)?/g, lT = oT(function(i) {
  var u = [];
  return i.charCodeAt(0) === 46 && u.push(""), i.replace(sT, function(r, s, l, f) {
    u.push(l ? f.replace(aT, "$1") : s || r);
  }), u;
});
const cT = lT;
function MT(i) {
  return i == null ? "" : yc(i);
}
function fT(i, u) {
  return hs(i) ? i : xh(i, u) ? [i] : cT(MT(i));
}
var gT = 1 / 0;
function dT(i) {
  if (typeof i == "string" || Cu(i))
    return i;
  var u = i + "";
  return u == "0" && 1 / i == -gT ? "-0" : u;
}
function NT(i, u) {
  u = fT(u, i);
  for (var r = 0, s = u.length; i != null && r < s; )
    i = i[dT(u[r++])];
  return r && r == s ? i : void 0;
}
function zc(i, u, r) {
  var s = i == null ? void 0 : NT(i, u);
  return s === void 0 ? r : s;
}
var pT = function() {
  return _u.Date.now();
};
const ts = pT;
var IT = "Expected a function", hT = Math.max, TT = Math.min;
function yT(i, u, r) {
  var s, l, f, d, p, v, g = 0, I = !1, T = !1, z = !0;
  if (typeof i != "function")
    throw new TypeError(IT);
  u = ql(u) || 0, di(r) && (I = !!r.leading, T = "maxWait" in r, f = T ? hT(ql(r.maxWait) || 0, u) : f, z = "trailing" in r ? !!r.trailing : z);
  function j(ct) {
    var dt = s, Vt = l;
    return s = l = void 0, g = ct, d = i.apply(Vt, dt), d;
  }
  function b(ct) {
    return g = ct, p = setTimeout(x, u), I ? j(ct) : d;
  }
  function R(ct) {
    var dt = ct - v, Vt = ct - g, ut = u - dt;
    return T ? TT(ut, f - Vt) : ut;
  }
  function _(ct) {
    var dt = ct - v, Vt = ct - g;
    return v === void 0 || dt >= u || dt < 0 || T && Vt >= f;
  }
  function x() {
    var ct = ts();
    if (_(ct))
      return K(ct);
    p = setTimeout(x, R(ct));
  }
  function K(ct) {
    return p = void 0, z && s ? j(ct) : (s = l = void 0, d);
  }
  function P() {
    p !== void 0 && clearTimeout(p), g = 0, s = v = l = p = void 0;
  }
  function lt() {
    return p === void 0 ? d : K(ts());
  }
  function mt() {
    var ct = ts(), dt = _(ct);
    if (s = arguments, l = this, v = ct, dt) {
      if (p === void 0)
        return b(v);
      if (T)
        return clearTimeout(p), p = setTimeout(x, u), j(v);
    }
    return p === void 0 && (p = setTimeout(x, u)), d;
  }
  return mt.cancel = P, mt.flush = lt, mt;
}
const mT = ["data-level"], zT = ["disabled", "title"], AT = ["disabled", "title"], DT = ["disabled", "title"], jT = ["disabled", "title"], vT = {
  __name: "Access",
  props: {
    collaborator: Object,
    type: String,
    readonly: {
      type: Boolean,
      default: !1
    }
  },
  emits: ["updateAccess"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = (f) => {
      r.readonly || s("updateAccess", r.collaborator, r.type, f);
    };
    return (f, d) => (Y(), Q("div", {
      class: "access",
      "data-level": ["none", "view", "edit", "add", "remove"].indexOf(
        i.collaborator.access[i.type]
      )
    }, [
      D("button", {
        small: !0,
        onClick: d[0] || (d[0] = (p) => l(1)),
        class: "view",
        disabled: i.readonly,
        title: `view ${i.type}`
      }, null, 8, zT),
      D("button", {
        small: !0,
        onClick: d[1] || (d[1] = (p) => l(2)),
        class: "edit",
        disabled: i.readonly,
        title: `edit ${i.type}`
      }, null, 8, AT),
      D("button", {
        small: !0,
        onClick: d[2] || (d[2] = (p) => l(3)),
        class: "add",
        disabled: i.readonly,
        title: `add ${i.type}`
      }, null, 8, DT),
      D("button", {
        small: !0,
        onClick: d[3] || (d[3] = (p) => l(4)),
        class: "remove",
        disabled: i.readonly,
        title: `remove ${i.type}`
      }, null, 8, jT)
    ], 8, mT));
  }
}, es = /* @__PURE__ */ gt(vT, [["__scopeId", "data-v-0ca6667d"]]), te = class te {
  constructor(u) {
    wn(this, "numericalLevel", 0);
    const r = te.values.indexOf(u);
    this.numericalLevel = Math.max(0, r);
  }
  static fromInt(u) {
    return new te(this.values[u]);
  }
  toInt() {
    return this.numericalLevel;
  }
  toString() {
    return te.values[this.numericalLevel];
  }
  isGreaterThan(u) {
    return this.toInt() > u.toInt();
  }
  isGreaterThanOrEqualTo(u) {
    return this.toInt() >= u.toInt();
  }
  isLesserThan(u) {
    return this.toInt() < u.toInt();
  }
  isLesserThanOrEqualTo(u) {
    return this.toInt() <= u.toInt();
  }
  isEqualTo(u) {
    return this.toInt() === u.toInt();
  }
};
wn(te, "values", ["none", "view", "edit", "add", "remove"]), wn(te, "NONE", new te("none")), wn(te, "VIEW", new te("view")), wn(te, "EDIT", new te("edit")), wn(te, "ADD", new te("add")), wn(te, "REMOVE", new te("remove"));
let Du = te;
const LT = { class: "wrapper" }, _T = ["onClick"], CT = { style: { position: "relative" } }, xT = { class: "actions" }, wT = {
  __name: "PureCollaborators",
  props: {
    collaborators: {
      type: Array,
      required: !0
    },
    usersFound: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "addCollaborator",
    "removeCollaborators",
    "updateCollaborator",
    "searchUsers"
  ],
  setup(i, { emit: u }) {
    const r = i, s = u, { usernameField: l } = Ge("config"), f = yT((z) => {
      s("searchUsers", z);
    }, 300), d = it(null), p = (z, j) => {
      d.value = j;
    }, v = (z, j) => {
      s("updateCollaborator", z, St(St({}, r.collaborators[z]), j));
    }, g = (z, j, b) => {
      const R = r.collaborators.indexOf(z);
      if (R < 0)
        return;
      const _ = new Du(
        r.collaborators[R].access[j]
      ).toInt();
      let x = b;
      _ === x && (x -= 1), v(R, {
        access: _r(St({}, r.collaborators[R].access), {
          [j]: Du.fromInt(x).toString()
        })
      });
    }, I = (z, j) => {
      const b = r.collaborators.indexOf(z);
      b < 0 || v(b, { name: j });
    }, T = (z, j) => {
      v(j, {
        [l]: z[l],
        userID: z[l],
        name: z.name
      });
    };
    return (z, j) => (Y(), Q("div", LT, [
      j[5] || (j[5] = D("h2", null, "Access", -1)),
      V(Ii, { id: "access" }, {
        default: q(() => [
          j[2] || (j[2] = D("thead", null, [
            D("tr", null, [
              D("th", null, "User Name"),
              D("th", null, "Name"),
              D("th", null, "Collaborators"),
              D("th", null, "Annotations"),
              D("th", null, "Files")
            ])
          ], -1)),
          D("tbody", null, [
            (Y(!0), Q(Pt, null, ee(i.collaborators, (b, R) => (Y(), Q("tr", {
              key: b.userID,
              class: ue({ selected: d.value === R }),
              onClick: (_) => p(_, R)
            }, [
              D("td", CT, [
                V(Xp, {
                  onInput: G(f),
                  onSelect: T,
                  items: r.usersFound,
                  "is-async": !0,
                  "extra-select-args": [r.collaborators.indexOf(b)],
                  "default-value": b[G(l)] || b.userID,
                  disabled: b[G(l)] === "anyone",
                  "extract-result-text": (_) => _[G(l)],
                  "aria-label": "Search by username"
                }, null, 8, ["onInput", "items", "extra-select-args", "default-value", "disabled", "extract-result-text"])
              ]),
              D("td", null, [
                V(pi, {
                  modelValue: b.name,
                  "onUpdate:modelValue": (_) => b.name = _,
                  placeholder: "User Name",
                  disabled: b[G(l)] === "anyone",
                  onBlur: (_) => I(b, _.target.value),
                  onKeyup: Sn((_) => I(b, _.target.value), ["enter"])
                }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "onBlur", "onKeyup"])
              ]),
              D("td", null, [
                V(es, {
                  type: "collaborators",
                  collaborator: b,
                  onUpdateAccess: g
                }, null, 8, ["collaborator"])
              ]),
              D("td", null, [
                V(es, {
                  type: "annotations",
                  collaborator: b,
                  onUpdateAccess: g
                }, null, 8, ["collaborator"])
              ]),
              D("td", null, [
                V(es, {
                  type: "files",
                  collaborator: b,
                  onUpdateAccess: g
                }, null, 8, ["collaborator"])
              ])
            ], 10, _T))), 128))
          ])
        ]),
        _: 1
      }),
      D("div", xT, [
        V(Yt, {
          small: !0,
          onClick: j[0] || (j[0] = (b) => z.$emit("addCollaborator")),
          title: "Add collaborator"
        }, {
          default: q(() => j[3] || (j[3] = [
            yt(" + ")
          ])),
          _: 1
        }),
        V(Yt, {
          small: !0,
          onClick: j[1] || (j[1] = (b) => {
            z.$emit("removeCollaborators", [d.value]), d.value = null;
          }),
          title: "Remove selected collaborators",
          disabled: d.value == null || i.collaborators[d.value].username === "anyone" || i.collaborators[d.value].userID === "anyone"
        }, {
          default: q(() => j[4] || (j[4] = [
            yt(" - ")
          ])),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, OT = /* @__PURE__ */ gt(wT, [["__scopeId", "data-v-4809f467"]]), pu = vu([]);
function ST() {
  const { userSearchURL: i } = Ge("config");
  return {
    usersFound: pu,
    fetchUsers: (r) => Je(this, null, function* () {
      pu.splice(0, pu.length);
      const s = yield (yield fetch(`${i}${r}`)).json();
      pu.push(...s);
    })
  };
}
const ET = {
  __name: "Collaborators",
  setup(i) {
    const {
      project: u,
      addCollaborator: r,
      updateCollaborator: s,
      removeCollaborators: l
    } = rr(), {
      usersFound: f,
      fetchUsers: d
    } = ST();
    return (p, v) => G(u) && G(u).collaborators ? (Y(), Qt(OT, {
      key: 0,
      collaborators: G(u).collaborators.list,
      "users-found": G(f),
      onAddCollaborator: G(r),
      onRemoveCollaborators: G(l),
      onUpdateCollaborator: G(s),
      onSearchUsers: G(d)
    }, null, 8, ["collaborators", "users-found", "onAddCollaborator", "onRemoveCollaborators", "onUpdateCollaborator", "onSearchUsers"])) : oe("", !0);
  }
}, bT = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MzguNTMzIDQzOC41MzMiIGhlaWdodD0iNDM4LjUzMyIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgd2lkdGg9IjQzOC41MzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiIgdHJhbnNmb3JtPSJtYXRyaXgoLjcxMTE2MTExIDAgMCAuNzExMTYxMTEgODEuMDg2NzE2IDI1LjY3MTMwNykiPjxwYXRoIGQ9Im0xMTQuMDA2MzYgMTgzLjM5MzI5aDQ4LjExNTQ2djkxLjIwODljMCAyLjQxOTQzLjc1NjY2IDQuNDA0MTcgMi4yNTg2IDUuOTU5NjUgMS40OTU3OCAxLjU1MDk1IDMuNDE5MDggMi4zMzA1IDUuNzU1OCAyLjMzMDVoNDguMTI0MjFjMi4zMzg0OSAwIDQuMjYwODktLjc3OTU1IDUuNzY0NTktMi4zMzA1IDEuNTA0NTYtMS41NTYzOCAyLjI1NTk2LTMuNTQwMjIgMi4yNTU5Ni01Ljk1OTY1di05MS4yMDUyN2g0OC4xMjA3MWMzLjY3NDUyIDAgNi4xODE1My0xLjcyODgxIDcuNTE5MzItNS4xODEgMS4zMzc3OS0zLjI4NjExLjc0OTY2LTYuMzA0NTEtMS43NTQ3My05LjA3MTUybC04MC4xOTk0My04Mi45MTE0OTNjLTEuODM5ODctMS41NTI3NTktMy43NTk2NS0yLjMyOTU5Ni01Ljc2NDU3LTIuMzI5NTk2LTIuMDAyMyAwLTMuOTI0Ny43NzY4MzctNS43NjYzMyAyLjMyOTU5NmwtNzkuOTQ4MzggODIuNjUwMTMzYy0xLjY2OTU5IDIuMDcxODUtMi41MDI2MyA0LjE1Mjc4LTIuNTAyNjMgNi4yMTgyOSAwIDIuNDE1ODEuNzUwNTMgNC40MDQxNyAyLjI1ODYxIDUuOTYyMzcgMS41MDAxOCAxLjU1MzY3IDMuNDIyNTcgMi4zMjk1OSA1Ljc2MjgxIDIuMzI5NTl6Ii8+PHBhdGggZD0ibTM2LjIzNTI0NCAzMTkuMjQ3Mzl2ODUuMDUxNDRoMzE2LjEzMjgxNnYtODUuMDUxNDRoLTM2LjkwODkydjQ4LjE0MjUyaC0yNDIuMzE0OTcydi00OC4xNDI1MnoiLz48L2c+PC9zdmc+", YT = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MzguNTMzIDQzOC41MzMiIGhlaWdodD0iNDM4LjUzMyIgdmlld0JveD0iMCAwIDQzOC41MzMgNDM4LjUzMyIgd2lkdGg9IjQzOC41MzMiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTE2Mi4xNjM2MSAxNTYuMDk5OTRoMzQuMjE3ODR2LTY0Ljg2NDIzMWMwLTEuNzIwNi41MzgxMS0zLjEzMjA3IDEuNjA2MjMtNC4yMzgyNyAxLjA2Mzc0LTEuMTAyOTcgMi40MzE1MS0xLjY1NzM2IDQuMDkzMy0xLjY1NzM2aDM0LjIyNDA3YzEuNjYzMDQgMCAzLjAzMDE3LjU1NDM5IDQuMDk5NTUgMS42NTczNiAxLjA2OTk4IDEuMTA2ODQgMS42MDQzNSAyLjUxNzY3IDEuNjA0MzUgNC4yMzgyN3Y2NC44NjE2NTFoMzQuMjIxNThjMi42MTMxNyAwIDQuMzk2MDYgMS4yMjk0NiA1LjM0NzQ0IDMuNjg0NTIuOTUxMzkgMi4zMzY5Ni41MzMxMyA0LjQ4MzUyLTEuMjQ3ODkgNi40NTEzMWwtNTcuMDM0NzIgNTguOTYzNDNjLTEuMzA4NDQgMS4xMDQyNi0yLjY3MzcxIDEuNjU2NzItNC4wOTk1MyAxLjY1NjcyLTEuNDIzOTYgMC0yLjc5MTEtLjU1MjQ2LTQuMTAwNzktMS42NTY3MmwtNTYuODU2MTgtNTguNzc3NTZjLTEuMTg3MzUtMS40NzM0Mi0xLjc3OTc4LTIuOTUzMjktMS43Nzk3OC00LjQyMjIgMC0xLjcxODAzLjUzMzc1LTMuMTMyMDggMS42MDYyNC00LjI0MDIxIDEuMDY2ODctMS4xMDQ5MSAyLjQzNC0xLjY1NjcxIDQuMDk4MjktMS42NTY3MXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJtMTA2Ljg1NTgxIDI1Mi43MDc2NHY2MC40ODUyN2gyMjQuODIxMzd2LTYwLjQ4NTI3aC0yNi4yNDgxOXYzNC4yMzcwOGgtMTcyLjMyNDk5di0zNC4yMzcwOHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
const UT = { class: "wrapper" }, kT = ["onClick"], RT = ["onBlur", "onKeyup"], PT = { class: "actions" }, QT = {
  __name: "PureFiles",
  props: {
    files: {
      type: Array,
      required: !0
    }
  },
  emits: [
    "addFile",
    "removeFiles",
    "updateFile",
    "importCsv",
    "downloadCsv"
  ],
  setup(i, { emit: u }) {
    const r = i, s = u, l = (g, I) => {
      s("updateFile", g, St(St({}, r.files[g]), I));
    }, f = it(null), d = (g, I) => {
      f.value = I;
    }, p = (g, I) => {
      const T = r.files.indexOf(g);
      T < 0 || l(T, { name: I });
    }, v = (g, I) => {
      const T = r.files.indexOf(g);
      T < 0 || l(T, { source: I });
    };
    return (g, I) => (Y(), Q("div", UT, [
      I[9] || (I[9] = D("h2", null, "Files", -1)),
      V(Ii, { id: "files" }, {
        default: q(() => [
          I[4] || (I[4] = D("thead", null, [
            D("tr", null, [
              D("th", null, "URL"),
              D("th", null, "Name")
            ])
          ], -1)),
          D("tbody", null, [
            (Y(!0), Q(Pt, null, ee(i.files, (T, z) => (Y(), Q("tr", {
              key: T.source,
              class: ue({ selected: f.value === z }),
              onClick: (j) => d(j, z)
            }, [
              D("td", null, [
                D("span", {
                  contenteditable: "true",
                  placeholder: "File URL",
                  onBlur: (j) => v(T, j.currentTarget.textContent),
                  onKeyup: Sn((j) => v(T, j.currentTarget.textContent), ["enter"])
                }, ht(T.source), 41, RT)
              ]),
              D("td", null, [
                V(pi, {
                  modelValue: T.name,
                  "onUpdate:modelValue": (j) => T.name = j,
                  placeholder: "File Name",
                  onBlur: (j) => p(T, j.target.value),
                  onKeyup: Sn((j) => p(T, j.target.value), ["enter"])
                }, null, 8, ["modelValue", "onUpdate:modelValue", "onBlur", "onKeyup"])
              ])
            ], 10, kT))), 128))
          ])
        ]),
        _: 1
      }),
      D("div", PT, [
        V(Yt, {
          small: !0,
          onClick: I[0] || (I[0] = (T) => g.$emit("importCsv")),
          title: "Upload CSV"
        }, {
          default: q(() => I[5] || (I[5] = [
            D("img", {
              src: bT,
              alt: "Import CSV"
            }, null, -1)
          ])),
          _: 1
        }),
        V(Yt, {
          small: !0,
          onClick: I[1] || (I[1] = (T) => g.$emit("downloadCsv")),
          title: "Download CSV"
        }, {
          default: q(() => I[6] || (I[6] = [
            D("img", {
              src: YT,
              alt: "Download CSV"
            }, null, -1)
          ])),
          _: 1
        }),
        V(Yt, {
          small: !0,
          onClick: I[2] || (I[2] = (T) => g.$emit("addFile")),
          title: "Add file"
        }, {
          default: q(() => I[7] || (I[7] = [
            yt(" + ")
          ])),
          _: 1
        }),
        V(Yt, {
          small: !0,
          onClick: I[3] || (I[3] = (T) => g.$emit("removeFiles", [f.value])),
          title: "Remove selected files",
          disabled: f.value == null
        }, {
          default: q(() => I[8] || (I[8] = [
            yt(" - ")
          ])),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, ZT = /* @__PURE__ */ gt(QT, [["__scopeId", "data-v-d1f2b340"]]), GT = {
  __name: "Files",
  setup(i) {
    const { project: u, addFile: r, updateFile: s, removeFiles: l } = rr(), f = it(!1), d = it([]), p = () => {
      const I = document.createElement("input");
      I.type = "file", I.setAttribute("id", "importFilesInput"), I.style.display = "none", document.querySelector("body").appendChild(I), I.onchange = function() {
        const [T] = this.files, z = new FileReader();
        z.onload = function(j) {
          document.querySelector("body").removeChild(I);
          const { result: b } = j.target, R = b.split(`
`);
          d.value = R.map((_) => {
            const [x, K] = _.split(/[ ]*,[ ]*/);
            return { source: x, name: K };
          }), f.value = !0;
        }, z.readAsText(T);
      }, I.click();
    }, v = () => {
      const I = prompt("File name", `${u.value.shortname}`);
      if (I == null)
        return;
      const T = u.value.files.list.map((b) => `${b.source},${b.name}`).join(`
`), z = "data:text/ascii;charset=utf-8," + encodeURIComponent(T), j = document.createElement("a");
      j.href = z, j.download = I + ".csv", document.body.appendChild(j), j.click(), document.body.removeChild(j);
    };
    function g(I) {
      I.forEach((T) => {
        if (T.source.length < 10) {
          console.log("Too short to be an url:", T.source);
          return;
        }
        const z = u.value.files.list.find(
          (j) => j.source === T.source
        );
        z != null ? z.name === "" && (z.name = T.name) : u.value.files.list.push(T);
      }), f.value = !1;
    }
    return (I, T) => (Y(), Q(Pt, null, [
      f.value ? (Y(), Qt(TI, {
        key: 0,
        files: d.value,
        onImport: g,
        onCancel: T[0] || (T[0] = (z) => f.value = !1)
      }, null, 8, ["files"])) : oe("", !0),
      G(u) && G(u).files ? (Y(), Qt(ZT, {
        key: 1,
        files: G(u).files.list,
        onAddFile: G(r),
        onRemoveFiles: G(l),
        onUpdateFile: G(s),
        onImportCsv: p,
        onDownloadCsv: v
      }, null, 8, ["files", "onAddFile", "onRemoveFiles", "onUpdateFile"])) : oe("", !0)
    ], 64));
  }
};
function dn(i, u, r) {
  return parseInt(i.substr(u, r), 16);
}
function Ac(i) {
  return i |= 0, i < 0 ? "00" : i < 16 ? "0" + i.toString(16) : i < 256 ? i.toString(16) : "ff";
}
function ns(i, u, r) {
  return r = r < 0 ? r + 6 : r > 6 ? r - 6 : r, Ac(255 * (r < 1 ? i + (u - i) * r : r < 3 ? u : r < 4 ? i + (u - i) * (4 - r) : i));
}
function WT(i) {
  if (/^#[0-9a-f]{3,8}$/i.test(i)) {
    let u;
    const r = i.length;
    if (r < 6) {
      const s = i[1], l = i[2], f = i[3], d = i[4] || "";
      u = "#" + s + s + l + l + f + f + d + d;
    }
    return (r == 7 || r > 8) && (u = i), u;
  }
}
function ec(i) {
  const u = dn(i, 7, 2);
  let r;
  if (isNaN(u))
    r = i;
  else {
    const s = dn(i, 1, 2), l = dn(i, 3, 2), f = dn(i, 5, 2);
    r = "rgba(" + s + "," + l + "," + f + "," + (u / 255).toFixed(2) + ")";
  }
  return r;
}
function FT(i, u, r) {
  let s;
  if (u == 0) {
    const l = Ac(r * 255);
    s = l + l + l;
  } else {
    const l = r <= 0.5 ? r * (u + 1) : r + u - r * u, f = r * 2 - l;
    s = ns(f, l, i * 6 + 2) + ns(f, l, i * 6) + ns(f, l, i * 6 - 2);
  }
  return "#" + s;
}
function ci(i, u, r) {
  const s = [0.55, 0.5, 0.5, 0.46, 0.6, 0.55, 0.55], l = s[i * 6 + 0.5 | 0];
  return r = r < 0.5 ? r * l * 2 : l + (r - 0.5) * (1 - l) * 2, FT(i, u, r);
}
const BT = typeof window != "undefined" ? window : typeof self != "undefined" ? self : typeof global != "undefined" ? global : {}, nc = {
  V: "jdenticon_config",
  n: "config"
};
var $T = {};
function HT(i, u) {
  const r = typeof i == "object" && i || $T[
    nc.n
    /*MODULE*/
  ] || BT[
    nc.V
    /*GLOBAL*/
  ] || {}, s = r.lightness || {}, l = r.saturation || {}, f = "color" in l ? l.color : l, d = l.grayscale, p = r.backColor, v = r.padding;
  function g(T, z) {
    let j = s[T];
    return j && j.length > 1 || (j = z), function(b) {
      return b = j[0] + b * (j[1] - j[0]), b < 0 ? 0 : b > 1 ? 1 : b;
    };
  }
  function I(T) {
    const z = r.hues;
    let j;
    return z && z.length > 0 && (j = z[0 | 0.999 * T * z.length]), typeof j == "number" ? (
      // A hue was specified. We need to convert the hue from
      // degrees on any turn - e.g. 746° is a perfectly valid hue -
      // to turns in the range [0, 1).
      (j / 360 % 1 + 1) % 1
    ) : (
      // No hue configured => use original hue
      T
    );
  }
  return {
    W: I,
    o: typeof f == "number" ? f : 0.5,
    D: typeof d == "number" ? d : 0,
    p: g("color", [0.4, 0.8]),
    F: g("grayscale", [0.3, 0.9]),
    G: WT(p),
    X: typeof i == "number" ? i : typeof v == "number" ? v : u
  };
}
class Iu {
  /**
   * @param {number} x 
   * @param {number} y 
   */
  constructor(u, r) {
    this.x = u, this.y = r;
  }
}
class Dc {
  /**
   * @param {number} x The x-coordinate of the upper left corner of the transformed rectangle.
   * @param {number} y The y-coordinate of the upper left corner of the transformed rectangle.
   * @param {number} size The size of the transformed rectangle.
   * @param {number} rotation Rotation specified as 0 = 0 rad, 1 = 0.5π rad, 2 = π rad, 3 = 1.5π rad
   */
  constructor(u, r, s, l) {
    this.q = u, this.t = r, this.H = s, this.Y = l;
  }
  /**
   * Transforms the specified point based on the translation and rotation specification for this Transform.
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   * @param {number=} w The width of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
   * @param {number=} h The height of the transformed rectangle. If greater than 0, this will ensure the returned point is of the upper left corner of the transformed rectangle.
   */
  I(u, r, s, l) {
    const f = this.q + this.H, d = this.t + this.H, p = this.Y;
    return p === 1 ? new Iu(f - r - (l || 0), this.t + u) : p === 2 ? new Iu(f - u - (s || 0), d - r - (l || 0)) : p === 3 ? new Iu(this.q + r, d - u - (s || 0)) : new Iu(this.q + u, this.t + r);
  }
}
const VT = new Dc(0, 0, 0, 0);
class XT {
  /**
   * @param {Renderer} renderer 
   */
  constructor(u) {
    this.J = u, this.u = VT;
  }
  /**
   * Adds a polygon to the underlying renderer.
   * @param {Array<number>} points The points of the polygon clockwise on the format [ x0, y0, x1, y1, ..., xn, yn ]
   * @param {boolean=} invert Specifies if the polygon will be inverted.
   */
  g(u, r) {
    const s = r ? -2 : 2, l = [];
    for (let f = r ? u.length - 2 : 0; f < u.length && f >= 0; f += s)
      l.push(this.u.I(u[f], u[f + 1]));
    this.J.g(l);
  }
  /**
   * Adds a polygon to the underlying renderer.
   * Source: http://stackoverflow.com/a/2173084
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the entire ellipse.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the entire ellipse.
   * @param {number} size The size of the ellipse.
   * @param {boolean=} invert Specifies if the ellipse will be inverted.
   */
  h(u, r, s, l) {
    const f = this.u.I(u, r, s, s);
    this.J.h(f, s, l);
  }
  /**
   * Adds a rectangle to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle.
   * @param {number} w The width of the rectangle.
   * @param {number} h The height of the rectangle.
   * @param {boolean=} invert Specifies if the rectangle will be inverted.
   */
  i(u, r, s, l, f) {
    this.g([
      u,
      r,
      u + s,
      r,
      u + s,
      r + l,
      u,
      r + l
    ], f);
  }
  /**
   * Adds a right triangle to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the triangle.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the triangle.
   * @param {number} w The width of the triangle.
   * @param {number} h The height of the triangle.
   * @param {number} r The rotation of the triangle (clockwise). 0 = right corner of the triangle in the lower left corner of the bounding rectangle.
   * @param {boolean=} invert Specifies if the triangle will be inverted.
   */
  j(u, r, s, l, f, d) {
    const p = [
      u + s,
      r,
      u + s,
      r + l,
      u,
      r + l,
      u,
      r
    ];
    p.splice((f || 0) % 4 * 2, 2), this.g(p, d);
  }
  /**
   * Adds a rhombus to the underlying renderer.
   * @param {number} x The x-coordinate of the upper left corner of the rectangle holding the rhombus.
   * @param {number} y The y-coordinate of the upper left corner of the rectangle holding the rhombus.
   * @param {number} w The width of the rhombus.
   * @param {number} h The height of the rhombus.
   * @param {boolean=} invert Specifies if the rhombus will be inverted.
   */
  K(u, r, s, l, f) {
    this.g([
      u + s / 2,
      r,
      u + s,
      r + l / 2,
      u + s / 2,
      r + l,
      u,
      r + l / 2
    ], f);
  }
}
function KT(i, u, r, s) {
  i = i % 14;
  let l, f, d, p, v, g;
  i ? i == 1 ? (d = 0 | r * 0.5, p = 0 | r * 0.8, u.j(r - d, 0, d, p, 2)) : i == 2 ? (d = 0 | r / 3, u.i(d, d, r - d, r - d)) : i == 3 ? (v = r * 0.1, // Use fixed outer border widths in small icons to ensure the border is drawn
  g = r < 6 ? 1 : r < 8 ? 2 : 0 | r * 0.25, v = v > 1 ? 0 | v : (
    // large icon => truncate decimals
    v > 0.5 ? 1 : (
      // medium size icon => fixed width
      v
    )
  ), // small icon => anti-aliased border
  u.i(g, g, r - v - g, r - v - g)) : i == 4 ? (f = 0 | r * 0.15, d = 0 | r * 0.5, u.h(r - d - f, r - d - f, d)) : i == 5 ? (v = r * 0.1, g = v * 4, // Align edge to nearest pixel in large icons
  g > 3 && (g = 0 | g), u.i(0, 0, r, r), u.g([
    g,
    g,
    r - v,
    g,
    g + (r - g - v) / 2,
    r - v
  ], !0)) : i == 6 ? u.g([
    0,
    0,
    r,
    0,
    r,
    r * 0.7,
    r * 0.4,
    r * 0.4,
    r * 0.7,
    r,
    0,
    r
  ]) : i == 7 ? u.j(r / 2, r / 2, r / 2, r / 2, 3) : i == 8 ? (u.i(0, 0, r, r / 2), u.i(0, r / 2, r / 2, r / 2), u.j(r / 2, r / 2, r / 2, r / 2, 1)) : i == 9 ? (v = r * 0.14, // Use fixed outer border widths in small icons to ensure the border is drawn
  g = r < 4 ? 1 : r < 6 ? 2 : 0 | r * 0.35, v = r < 8 ? v : (
    // small icon => anti-aliased border
    0 | v
  ), // large icon => truncate decimals
  u.i(0, 0, r, r), u.i(g, g, r - g - v, r - g - v, !0)) : i == 10 ? (v = r * 0.12, g = v * 3, u.i(0, 0, r, r), u.h(g, g, r - v - g, !0)) : i == 11 ? u.j(r / 2, r / 2, r / 2, r / 2, 3) : i == 12 ? (f = r * 0.25, u.i(0, 0, r, r), u.K(f, f, r - f, r - f, !0)) : (
    // 13
    !s && (f = r * 0.4, d = r * 1.2, u.h(f, f, d))
  ) : (l = r * 0.42, u.g([
    0,
    0,
    r,
    0,
    r,
    r - l * 2,
    r - l,
    r,
    0,
    r
  ]));
}
function rc(i, u, r) {
  i = i % 4;
  let s;
  i ? i == 1 ? u.j(0, r / 2, r, r / 2, 0) : i == 2 ? u.K(0, 0, r, r) : (
    // 3
    (s = r / 6, u.h(s, s, r - 2 * s))
  ) : u.j(0, 0, r, r, 0);
}
function JT(i, u) {
  return i = u.W(i), [
    // Dark gray
    ci(i, u.D, u.F(0)),
    // Mid color
    ci(i, u.o, u.p(0.5)),
    // Light gray
    ci(i, u.D, u.F(1)),
    // Light color
    ci(i, u.o, u.p(1)),
    // Dark color
    ci(i, u.o, u.p(0))
  ];
}
function qT(i, u, r) {
  const s = HT(r, 0.08);
  s.G && i.m(
    s.G
    /*backColor*/
  );
  let l = i.k;
  const f = 0.5 + l * s.X | 0;
  l -= f * 2;
  const d = new XT(i), p = 0 | l / 4, v = 0 | f + l / 2 - p * 2, g = 0 | f + l / 2 - p * 2;
  function I(_, x, K, P, lt) {
    const mt = dn(u, K, 1);
    let ct = P ? dn(u, P, 1) : 0;
    i.L(z[j[_]]);
    for (let dt = 0; dt < lt.length; dt++)
      d.u = new Dc(v + lt[dt][0] * p, g + lt[dt][1] * p, p, ct++ % 4), x(mt, d, p, dt);
    i.M();
  }
  const T = dn(u, -7) / 268435455, z = JT(T, s), j = [];
  let b;
  function R(_) {
    if (_.indexOf(b) >= 0) {
      for (let x = 0; x < _.length; x++)
        if (j.indexOf(_[x]) >= 0)
          return !0;
    }
  }
  for (let _ = 0; _ < 3; _++)
    b = dn(u, 8 + _, 1) % z.length, (R([0, 4]) || // Disallow dark gray and dark color combo
    R([2, 3])) && (b = 1), j.push(b);
  I(0, rc, 2, 3, [[1, 0], [2, 0], [2, 3], [1, 3], [0, 1], [3, 1], [3, 2], [0, 2]]), I(1, rc, 4, 5, [[0, 0], [3, 0], [3, 3], [0, 3]]), I(2, KT, 1, null, [[1, 1], [2, 1], [2, 2], [1, 2]]), i.finish();
}
function ty(i) {
  var s = 0, l = 0, f = encodeURI(i) + "%80", d = [], p, v = [], g = 1732584193, I = 4023233417, T = ~g, z = ~I, j = 3285377520, b = [g, I, T, z, j], R = 0, _ = "";
  function x(K, P) {
    return K << P | K >>> 32 - P;
  }
  for (; s < f.length; l++)
    d[l >> 2] = d[l >> 2] | (f[s] == "%" ? parseInt(f.substring(s + 1, s += 3), 16) : f.charCodeAt(s++)) << (3 - (l & 3)) * 8;
  for (p = ((l + 7 >> 6) + 1) * 16, d[p - 1] = l * 8 - 8; R < p; R += 16) {
    for (s = 0; s < 80; s++)
      l = x(g, 5) + j + // Ch
      (s < 20 ? (I & T ^ ~I & z) + 1518500249 : (
        // Parity
        s < 40 ? (I ^ T ^ z) + 1859775393 : (
          // Maj
          s < 60 ? (I & T ^ I & z ^ T & z) + 2400959708 : (
            // Parity
            (I ^ T ^ z) + 3395469782
          )
        )
      )) + (v[s] = s < 16 ? d[R + s] | 0 : x(v[s - 3] ^ v[s - 8] ^ v[s - 14] ^ v[s - 16], 1)), j = z, z = T, T = x(I, 30), I = g, g = l;
    b[0] = g = b[0] + g | 0, b[1] = I = b[1] + I | 0, b[2] = T = b[2] + T | 0, b[3] = z = b[3] + z | 0, b[4] = j = b[4] + j | 0;
  }
  for (s = 0; s < 40; s++)
    _ += // Get word (2^3 half-bytes per word)
    (b[s >> 3] >>> // Append half-bytes in reverse order
    (7 - (s & 7)) * 4 & 15).toString(16);
  return _;
}
function ic(i) {
  return /^[0-9a-f]{11,}$/i.test(i) && i;
}
function uc(i) {
  return ty(i == null ? "" : "" + i);
}
class ey {
  /**
   * @param {number=} iconSize
   */
  constructor(u, r) {
    const s = u.canvas, l = s.width, f = s.height;
    u.save(), r || (r = Math.min(l, f), u.translate(
      (l - r) / 2 | 0,
      (f - r) / 2 | 0
    )), this.l = u, this.k = r, u.clearRect(0, 0, r, r);
  }
  /**
   * Fills the background with the specified color.
   * @param {string} fillColor  Fill color on the format #rrggbb[aa].
   */
  m(u) {
    const r = this.l, s = this.k;
    r.fillStyle = ec(u), r.fillRect(0, 0, s, s);
  }
  /**
   * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
   * @param {string} fillColor Fill color on format #rrggbb[aa].
   */
  L(u) {
    const r = this.l;
    r.fillStyle = ec(u), r.beginPath();
  }
  /**
   * Marks the end of the currently drawn shape. This causes the queued paths to be rendered on the canvas.
   */
  M() {
    this.l.fill();
  }
  /**
   * Adds a polygon to the rendering queue.
   * @param points An array of Point objects.
   */
  g(u) {
    const r = this.l;
    r.moveTo(u[0].x, u[0].y);
    for (let s = 1; s < u.length; s++)
      r.lineTo(u[s].x, u[s].y);
    r.closePath();
  }
  /**
   * Adds a circle to the rendering queue.
   * @param {Point} point The upper left corner of the circle bounding box.
   * @param {number} diameter The diameter of the circle.
   * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
   */
  h(u, r, s) {
    const l = this.l, f = r / 2;
    l.moveTo(u.x + f, u.y + f), l.arc(u.x + f, u.y + f, f, 0, Math.PI * 2, s), l.closePath();
  }
  /**
   * Called when the icon has been completely drawn.
   */
  finish() {
    this.l.restore();
  }
}
const jc = 1, ny = 2, rs = {
  Z: "data-jdenticon-hash",
  N: "data-jdenticon-value"
}, ry = "jdenticonRendered", oc = (
  /** @type {!Function} */
  typeof document != "undefined" && document.querySelectorAll.bind(document)
);
function iy(i) {
  if (i) {
    const u = i.tagName;
    if (/^svg$/i.test(u))
      return jc;
    if (/^canvas$/i.test(u) && "getContext" in i)
      return ny;
  }
}
function Cr(i) {
  return (i * 10 + 0.5 | 0) / 10;
}
class uy {
  constructor() {
    this.v = "";
  }
  /**
   * Adds a polygon with the current fill color to the SVG path.
   * @param points An array of Point objects.
   */
  g(u) {
    let r = "";
    for (let s = 0; s < u.length; s++)
      r += (s ? "L" : "M") + Cr(u[s].x) + " " + Cr(u[s].y);
    this.v += r + "Z";
  }
  /**
   * Adds a circle with the current fill color to the SVG path.
   * @param {Point} point The upper left corner of the circle bounding box.
   * @param {number} diameter The diameter of the circle.
   * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
   */
  h(u, r, s) {
    const l = s ? 0 : 1, f = Cr(r / 2), d = Cr(r), p = "a" + f + "," + f + " 0 1," + l + " ";
    this.v += "M" + Cr(u.x) + " " + Cr(u.y + r / 2) + p + d + ",0" + p + -d + ",0";
  }
}
class oy {
  /**
   * @param {SvgElement|SvgWriter} target 
   */
  constructor(u) {
    this.A, this.B = {}, this.O = u, this.k = u.k;
  }
  /**
   * Fills the background with the specified color.
   * @param {string} fillColor  Fill color on the format #rrggbb[aa].
   */
  m(u) {
    const r = /^(#......)(..)?/.exec(u), s = r[2] ? dn(r[2], 0) / 255 : 1;
    this.O.m(r[1], s);
  }
  /**
   * Marks the beginning of a new shape of the specified color. Should be ended with a call to endShape.
   * @param {string} color Fill color on format #xxxxxx.
   */
  L(u) {
    this.A = this.B[u] || (this.B[u] = new uy());
  }
  /**
   * Marks the end of the currently drawn shape.
   */
  M() {
  }
  /**
   * Adds a polygon with the current fill color to the SVG.
   * @param points An array of Point objects.
   */
  g(u) {
    this.A.g(u);
  }
  /**
   * Adds a circle with the current fill color to the SVG.
   * @param {Point} point The upper left corner of the circle bounding box.
   * @param {number} diameter The diameter of the circle.
   * @param {boolean} counterClockwise True if the circle is drawn counter-clockwise (will result in a hole if rendered on a clockwise path).
   */
  h(u, r, s) {
    this.A.h(u, r, s);
  }
  /**
   * Called when the icon has been completely drawn.
   */
  finish() {
    const u = this.B;
    for (let r in u)
      u.hasOwnProperty(r) && this.O.P(
        r,
        u[r].v
        /*dataString*/
      );
  }
}
const fi = {
  R: "http://www.w3.org/2000/svg",
  S: "width",
  T: "height"
};
function sc(i, u, ...r) {
  const s = document.createElementNS(fi.R, u);
  for (let l = 0; l + 1 < r.length; l += 2)
    s.setAttribute(
      /** @type {string} */
      r[l],
      /** @type {string} */
      r[l + 1]
    );
  i.appendChild(s);
}
class sy {
  /**
   * @param {Element} element - Target element
   */
  constructor(u) {
    const r = this.k = Math.min(
      Number(u.getAttribute(
        fi.S
        /*WIDTH*/
      )) || 100,
      Number(u.getAttribute(
        fi.T
        /*HEIGHT*/
      )) || 100
    );
    for (this.U = u; u.firstChild; )
      u.removeChild(u.firstChild);
    u.setAttribute("viewBox", "0 0 " + r + " " + r), u.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
  /**
   * Fills the background with the specified color.
   * @param {string} fillColor  Fill color on the format #rrggbb.
   * @param {number} opacity  Opacity in the range [0.0, 1.0].
   */
  m(u, r) {
    r && sc(
      this.U,
      "rect",
      fi.S,
      "100%",
      fi.T,
      "100%",
      "fill",
      u,
      "opacity",
      r
    );
  }
  /**
   * Appends a path to the SVG element.
   * @param {string} color Fill color on format #xxxxxx.
   * @param {string} dataString The SVG path data string.
   */
  P(u, r) {
    sc(
      this.U,
      "path",
      "fill",
      u,
      "d",
      r
    );
  }
}
function ay(i, u, r) {
  vc(i, u, r, function(s, l) {
    if (l)
      return l == jc ? new oy(new sy(s)) : new ey(
        /** @type {HTMLCanvasElement} */
        s.getContext("2d")
      );
  });
}
function vc(i, u, r, s) {
  if (typeof i == "string") {
    if (oc) {
      const d = oc(i);
      for (let p = 0; p < d.length; p++)
        vc(d[p], u, r, s);
    }
    return;
  }
  const l = (
    // 1. Explicit valid hash
    ic(u) || // 2. Explicit value (`!= null` catches both null and undefined)
    u != null && uc(u) || // 3. `data-jdenticon-hash` attribute
    ic(i.getAttribute(
      rs.Z
      /*HASH*/
    )) || // 4. `data-jdenticon-value` attribute. 
    // We want to treat an empty attribute as an empty value. 
    // Some browsers return empty string even if the attribute 
    // is not specified, so use hasAttribute to determine if 
    // the attribute is specified.
    i.hasAttribute(
      rs.N
      /*VALUE*/
    ) && uc(i.getAttribute(
      rs.N
      /*VALUE*/
    ))
  );
  if (!l)
    return;
  const f = s(i, iy(i));
  f && (qT(f, l, r), i[ry] = !0);
}
var Lc = { exports: {} }, _c = { exports: {} };
(function() {
  var i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", u = {
    // Bit-wise rotation left
    rotl: function(r, s) {
      return r << s | r >>> 32 - s;
    },
    // Bit-wise rotation right
    rotr: function(r, s) {
      return r << 32 - s | r >>> s;
    },
    // Swap big-endian to little-endian and vice versa
    endian: function(r) {
      if (r.constructor == Number)
        return u.rotl(r, 8) & 16711935 | u.rotl(r, 24) & 4278255360;
      for (var s = 0; s < r.length; s++)
        r[s] = u.endian(r[s]);
      return r;
    },
    // Generate an array of any length of random bytes
    randomBytes: function(r) {
      for (var s = []; r > 0; r--)
        s.push(Math.floor(Math.random() * 256));
      return s;
    },
    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(r) {
      for (var s = [], l = 0, f = 0; l < r.length; l++, f += 8)
        s[f >>> 5] |= r[l] << 24 - f % 32;
      return s;
    },
    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(r) {
      for (var s = [], l = 0; l < r.length * 32; l += 8)
        s.push(r[l >>> 5] >>> 24 - l % 32 & 255);
      return s;
    },
    // Convert a byte array to a hex string
    bytesToHex: function(r) {
      for (var s = [], l = 0; l < r.length; l++)
        s.push((r[l] >>> 4).toString(16)), s.push((r[l] & 15).toString(16));
      return s.join("");
    },
    // Convert a hex string to a byte array
    hexToBytes: function(r) {
      for (var s = [], l = 0; l < r.length; l += 2)
        s.push(parseInt(r.substr(l, 2), 16));
      return s;
    },
    // Convert a byte array to a base-64 string
    bytesToBase64: function(r) {
      for (var s = [], l = 0; l < r.length; l += 3)
        for (var f = r[l] << 16 | r[l + 1] << 8 | r[l + 2], d = 0; d < 4; d++)
          l * 8 + d * 6 <= r.length * 8 ? s.push(i.charAt(f >>> 6 * (3 - d) & 63)) : s.push("=");
      return s.join("");
    },
    // Convert a base-64 string to a byte array
    base64ToBytes: function(r) {
      r = r.replace(/[^A-Z0-9+\/]/ig, "");
      for (var s = [], l = 0, f = 0; l < r.length; f = ++l % 4)
        f != 0 && s.push((i.indexOf(r.charAt(l - 1)) & Math.pow(2, -2 * f + 8) - 1) << f * 2 | i.indexOf(r.charAt(l)) >>> 6 - f * 2);
      return s;
    }
  };
  _c.exports = u;
})();
var ly = _c.exports, Ms = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(i) {
      return Ms.bin.stringToBytes(unescape(encodeURIComponent(i)));
    },
    // Convert a byte array to a string
    bytesToString: function(i) {
      return decodeURIComponent(escape(Ms.bin.bytesToString(i)));
    }
  },
  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(i) {
      for (var u = [], r = 0; r < i.length; r++)
        u.push(i.charCodeAt(r) & 255);
      return u;
    },
    // Convert a byte array to a string
    bytesToString: function(i) {
      for (var u = [], r = 0; r < i.length; r++)
        u.push(String.fromCharCode(i[r]));
      return u.join("");
    }
  }
}, ac = Ms;
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
var cy = function(i) {
  return i != null && (Cc(i) || My(i) || !!i._isBuffer);
};
function Cc(i) {
  return !!i.constructor && typeof i.constructor.isBuffer == "function" && i.constructor.isBuffer(i);
}
function My(i) {
  return typeof i.readFloatLE == "function" && typeof i.slice == "function" && Cc(i.slice(0, 0));
}
(function() {
  var i = ly, u = ac.utf8, r = cy, s = ac.bin, l = function(f, d) {
    f.constructor == String ? d && d.encoding === "binary" ? f = s.stringToBytes(f) : f = u.stringToBytes(f) : r(f) ? f = Array.prototype.slice.call(f, 0) : !Array.isArray(f) && f.constructor !== Uint8Array && (f = f.toString());
    for (var p = i.bytesToWords(f), v = f.length * 8, g = 1732584193, I = -271733879, T = -1732584194, z = 271733878, j = 0; j < p.length; j++)
      p[j] = (p[j] << 8 | p[j] >>> 24) & 16711935 | (p[j] << 24 | p[j] >>> 8) & 4278255360;
    p[v >>> 5] |= 128 << v % 32, p[(v + 64 >>> 9 << 4) + 14] = v;
    for (var b = l._ff, R = l._gg, _ = l._hh, x = l._ii, j = 0; j < p.length; j += 16) {
      var K = g, P = I, lt = T, mt = z;
      g = b(g, I, T, z, p[j + 0], 7, -680876936), z = b(z, g, I, T, p[j + 1], 12, -389564586), T = b(T, z, g, I, p[j + 2], 17, 606105819), I = b(I, T, z, g, p[j + 3], 22, -1044525330), g = b(g, I, T, z, p[j + 4], 7, -176418897), z = b(z, g, I, T, p[j + 5], 12, 1200080426), T = b(T, z, g, I, p[j + 6], 17, -1473231341), I = b(I, T, z, g, p[j + 7], 22, -45705983), g = b(g, I, T, z, p[j + 8], 7, 1770035416), z = b(z, g, I, T, p[j + 9], 12, -1958414417), T = b(T, z, g, I, p[j + 10], 17, -42063), I = b(I, T, z, g, p[j + 11], 22, -1990404162), g = b(g, I, T, z, p[j + 12], 7, 1804603682), z = b(z, g, I, T, p[j + 13], 12, -40341101), T = b(T, z, g, I, p[j + 14], 17, -1502002290), I = b(I, T, z, g, p[j + 15], 22, 1236535329), g = R(g, I, T, z, p[j + 1], 5, -165796510), z = R(z, g, I, T, p[j + 6], 9, -1069501632), T = R(T, z, g, I, p[j + 11], 14, 643717713), I = R(I, T, z, g, p[j + 0], 20, -373897302), g = R(g, I, T, z, p[j + 5], 5, -701558691), z = R(z, g, I, T, p[j + 10], 9, 38016083), T = R(T, z, g, I, p[j + 15], 14, -660478335), I = R(I, T, z, g, p[j + 4], 20, -405537848), g = R(g, I, T, z, p[j + 9], 5, 568446438), z = R(z, g, I, T, p[j + 14], 9, -1019803690), T = R(T, z, g, I, p[j + 3], 14, -187363961), I = R(I, T, z, g, p[j + 8], 20, 1163531501), g = R(g, I, T, z, p[j + 13], 5, -1444681467), z = R(z, g, I, T, p[j + 2], 9, -51403784), T = R(T, z, g, I, p[j + 7], 14, 1735328473), I = R(I, T, z, g, p[j + 12], 20, -1926607734), g = _(g, I, T, z, p[j + 5], 4, -378558), z = _(z, g, I, T, p[j + 8], 11, -2022574463), T = _(T, z, g, I, p[j + 11], 16, 1839030562), I = _(I, T, z, g, p[j + 14], 23, -35309556), g = _(g, I, T, z, p[j + 1], 4, -1530992060), z = _(z, g, I, T, p[j + 4], 11, 1272893353), T = _(T, z, g, I, p[j + 7], 16, -155497632), I = _(I, T, z, g, p[j + 10], 23, -1094730640), g = _(g, I, T, z, p[j + 13], 4, 681279174), z = _(z, g, I, T, p[j + 0], 11, -358537222), T = _(T, z, g, I, p[j + 3], 16, -722521979), I = _(I, T, z, g, p[j + 6], 23, 76029189), g = _(g, I, T, z, p[j + 9], 4, -640364487), z = _(z, g, I, T, p[j + 12], 11, -421815835), T = _(T, z, g, I, p[j + 15], 16, 530742520), I = _(I, T, z, g, p[j + 2], 23, -995338651), g = x(g, I, T, z, p[j + 0], 6, -198630844), z = x(z, g, I, T, p[j + 7], 10, 1126891415), T = x(T, z, g, I, p[j + 14], 15, -1416354905), I = x(I, T, z, g, p[j + 5], 21, -57434055), g = x(g, I, T, z, p[j + 12], 6, 1700485571), z = x(z, g, I, T, p[j + 3], 10, -1894986606), T = x(T, z, g, I, p[j + 10], 15, -1051523), I = x(I, T, z, g, p[j + 1], 21, -2054922799), g = x(g, I, T, z, p[j + 8], 6, 1873313359), z = x(z, g, I, T, p[j + 15], 10, -30611744), T = x(T, z, g, I, p[j + 6], 15, -1560198380), I = x(I, T, z, g, p[j + 13], 21, 1309151649), g = x(g, I, T, z, p[j + 4], 6, -145523070), z = x(z, g, I, T, p[j + 11], 10, -1120210379), T = x(T, z, g, I, p[j + 2], 15, 718787259), I = x(I, T, z, g, p[j + 9], 21, -343485551), g = g + K >>> 0, I = I + P >>> 0, T = T + lt >>> 0, z = z + mt >>> 0;
    }
    return i.endian([g, I, T, z]);
  };
  l._ff = function(f, d, p, v, g, I, T) {
    var z = f + (d & p | ~d & v) + (g >>> 0) + T;
    return (z << I | z >>> 32 - I) + d;
  }, l._gg = function(f, d, p, v, g, I, T) {
    var z = f + (d & v | p & ~v) + (g >>> 0) + T;
    return (z << I | z >>> 32 - I) + d;
  }, l._hh = function(f, d, p, v, g, I, T) {
    var z = f + (d ^ p ^ v) + (g >>> 0) + T;
    return (z << I | z >>> 32 - I) + d;
  }, l._ii = function(f, d, p, v, g, I, T) {
    var z = f + (p ^ (d | ~v)) + (g >>> 0) + T;
    return (z << I | z >>> 32 - I) + d;
  }, l._blocksize = 16, l._digestsize = 16, Lc.exports = function(f, d) {
    if (f == null)
      throw new Error("Illegal argument " + f);
    var p = i.wordsToBytes(l(f, d));
    return d && d.asBytes ? p : d && d.asString ? s.bytesToString(p) : i.bytesToHex(p);
  };
})();
var fy = Lc.exports;
const gy = /* @__PURE__ */ OI(fy);
const dy = { class: "image" }, Ny = ["href"], py = { class: "description" }, Iy = ["href"], hy = ["href"], Ty = { id: "numCollaborators" }, yy = { id: "numAnnotations" }, my = { id: "numFiles" }, zy = ["textContent"], Ay = { class: "actions" }, Dy = {
  __name: "ProjectInfo",
  setup(i) {
    const { project: u, saveProject: r, deleteProject: s } = rr(), { baseURL: l } = Ge("config"), f = it(!1), d = it(""), p = () => Je(this, null, function* () {
      f.value = !0;
      const R = yield r(u.value);
      R.success ? d.value = R.message : R.error && (d.value = R.error), setTimeout(() => {
        f.value = !1;
      }, 5e3), setTimeout(() => {
        d.value = "";
      }, 5500);
    }), v = () => Je(this, null, function* () {
      if (!confirm(
        "Are you sure you want to delete project " + u.value.shortname + "? This operation cannot be undone."
      ))
        return;
      (yield s(u.value.shortname)).success ? (d.value = "Successfully deleted", setTimeout(function() {
        window.location.assign("/");
      }, 2e3)) : d.value = "Unable to delete project";
    }), g = () => {
      window.location.assign(`/project/${u.value.shortname}`);
    }, I = it(null), T = it(null), z = Lu(() => `<iframe src="${l}/project/${u.value ? u.value.shortname : null}/embed" allowfullscreen width="600" height="600" frameBorder="0" />`), j = () => {
      I.value.showModal();
    }, b = () => {
      navigator.clipboard.writeText(z.value), I.value.close();
    };
    return Er(() => {
      ay(
        document.getElementById("jdenticon"),
        gy(u.value.shortname)
      );
    }), (R, _) => (Y(), Q(Pt, null, [
      D("div", dy, [
        D("a", {
          href: `/project/${G(u).shortname}`
        }, _[2] || (_[2] = [
          D("svg", {
            id: "jdenticon",
            width: "100%",
            height: "100%"
          }, null, -1)
        ]), 8, Ny)
      ]),
      D("div", py, [
        D("a", {
          href: `/project/${G(u).shortname}`
        }, [
          D("h1", null, ht(G(u).shortname), 1)
        ], 8, Iy),
        V(pi, {
          modelValue: G(u).url,
          "onUpdate:modelValue": _[0] || (_[0] = (x) => G(u).url = x),
          placeholder: "Enter a project website"
        }, null, 8, ["modelValue"]),
        D("p", null, [
          _[3] || (_[3] = yt(" by ")),
          D("a", {
            href: `/user/${G(u).owner}`
          }, ht(G(u).owner), 9, hy)
        ]),
        V(nI, {
          modelValue: G(u).description,
          "onUpdate:modelValue": _[1] || (_[1] = (x) => G(u).description = x),
          placeholder: "Enter a project description"
        }, null, 8, ["modelValue"]),
        D("p", null, [
          D("span", Ty, ht(G(u).collaborators.list.length), 1),
          _[4] || (_[4] = yt(" Collaborators "))
        ]),
        D("p", null, [
          D("span", yy, ht(G(u).annotations.list.length), 1),
          _[5] || (_[5] = yt(" Annotations "))
        ]),
        D("p", null, [
          D("span", my, ht(G(u).files.list.length), 1),
          _[6] || (_[6] = yt(" Data Files "))
        ]),
        D("dialog", {
          ref_key: "embedDialog",
          ref: I,
          class: "embedDialog"
        }, [
          D("form", null, [
            D("label", null, [
              _[7] || (_[7] = yt(" Embed code: ")),
              D("textarea", {
                textContent: ht(z.value),
                ref_key: "embedCodeTextarea",
                ref: T
              }, null, 8, zy)
            ]),
            D("div", null, [
              V(Yt, {
                "class-name": "push-button",
                value: "cancel",
                formmethod: "dialog"
              }, {
                default: q(() => _[8] || (_[8] = [
                  yt(" Cancel ")
                ])),
                _: 1
              }),
              V(Yt, {
                "class-name": "push-button",
                onClick: wr(b, ["prevent"]),
                value: "default"
              }, {
                default: q(() => _[9] || (_[9] = [
                  yt(" Copy ")
                ])),
                _: 1
              })
            ])
          ])
        ], 512),
        D("div", Ay, [
          V(Yt, {
            "class-name": "push-button",
            onClick: p
          }, {
            default: q(() => _[10] || (_[10] = [
              yt(" Save Changes ")
            ])),
            _: 1
          }),
          V(Yt, {
            "class-name": "push-button",
            onClick: v
          }, {
            default: q(() => _[11] || (_[11] = [
              yt(" Delete Project ")
            ])),
            _: 1
          }),
          V(Yt, {
            "class-name": "push-button",
            onClick: g
          }, {
            default: q(() => _[12] || (_[12] = [
              yt(" Go to Project ")
            ])),
            _: 1
          }),
          V(Yt, {
            "class-name": "push-button",
            onClick: j
          }, {
            default: q(() => _[13] || (_[13] = [
              yt(" Embed Project ")
            ])),
            _: 1
          }),
          D("p", {
            id: "saveFeedback",
            class: ue({ disappear: !f.value })
          }, ht(d.value), 3)
        ])
      ])
    ], 64));
  }
}, jy = /* @__PURE__ */ gt(Dy, [["__scopeId", "data-v-5a2127d2"]]);
const vy = { class: "content" }, Ly = {
  __name: "Settings",
  setup(i) {
    return (u, r) => (Y(), Qt(Ic, null, {
      side: q(() => [
        V(jy)
      ]),
      content: q(() => [
        D("div", vy, [
          V(ET),
          V(bI),
          V(GT)
        ])
      ]),
      _: 1
    }));
  }
}, _y = /* @__PURE__ */ gt(Ly, [["__scopeId", "data-v-7a9a6818"]]);
const Cy = {}, xy = { class: "app" };
function wy(i, u) {
  return Y(), Q("div", xy, [
    Zt(i.$slots, "default")
  ]);
}
const Ou = /* @__PURE__ */ gt(Cy, [["render", wy]]), Oy = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MDEuOTk0IDQwMS45OTQiIGhlaWdodD0iNDAxLjk5NCIgdmlld0JveD0iMCAwIDQwMS45OTQgNDAxLjk5NCIgd2lkdGg9IjQwMS45OTQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iNTAiPjxwYXRoIGQ9Im00MDIuMDMyMjEgMjAxLjg0ODY4aC00MDAuMjkwNjIyOCIvPjxwYXRoIGQ9Im0yMDIuNzAwMzYgMi44NTE2ODA4djQwMC4yOTA2MTkyIi8+PC9nPjwvc3ZnPg==", Sy = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1MzYiIHdpZHRoPSIxNTM2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xMDI0IDc2OGMwLTcwLjY2NjY3LTI1LTEzMS03NS0xODFzLTExMC4zMzMzMy03NS0xODEtNzUtMTMxIDI1LTE4MSA3NS03NSAxMTAuMzMzMzMtNzUgMTgxIDI1IDEzMSA3NSAxODEgMTEwLjMzMzMzIDc1IDE4MSA3NSAxMzEtMjUgMTgxLTc1IDc1LTExMC4zMzMzMyA3NS0xODF6bTUxMi0xMDl2MjIyYzAgOC0yLjY2NjcgMTUuNjY2NjctOCAyM3MtMTIgMTEuNjY2NjctMjAgMTNsLTI5NS4xMzE3LTEwLjc1MDAzYy0xMi42NjY3IDM2LTI3LjcwNjEgNjQuMjkzODYtNDEuMDM5NCA4OC45NjA1MyAyMy4zMzMzIDMzLjMzMzMgMTcxLjE3MTEgMTIwLjEyMjggMjE5LjE3MTEgMTc4Ljc4OTUgNi42NjY3IDggMTAgMTYuMzMzMyAxMCAyNXMtMyAxNi4zMzMzLTkgMjNjLTE4IDI0LjY2NjctNTEgNjAuNjY2Ny05OSAxMDhzLTc5LjMzMzMgNzEtOTQgNzFjLTggMC0xNi42NjY3LTMtMjYtOWwtMTkxLjAyNjM1LTIxOC4xMzE2Yy0yOS4zMzMzIDE1LjMzMzMtNjUuNzg1MSAzMi4wNzg5LTk3LjExODQzIDQyLjA3ODktMTAuNjY2NjcgOTAuNjY2NyAzOC44MTE0NSAyNTguNzE5NCAzMC4xNDQ3OCAyOTIuMDUyNy00LjY2NjY3IDE4LjY2NjctMTYuNjY2NjcgMjgtMzYgMjhoLTIyMmMtOS4zMzMzMyAwLTE3LjUtMi44MzMzLTI0LjUtOC41cy0xMC44MzMzMy0xMi44MzMzLTExLjUtMjEuNWwyMC45NDc0LTI5Mi4wOTIyYy0zMi42NjY2Ny0xMC42NjY2LTg5LjE3OTg0LTQ3LjQ3MzctMTE2LjUxMzE3LTYxLjQ3MzdsLTE2My40MzQyMyAyMzkuNTY1OXMtMTYuMTQ4MzggOS4zMDUzLTI1IDljLTkuMDk4OTItLjMxMzgtMTcuMzM4ODItNC4wMDk5LTI1LTExLTgzLjY4MDkxLTc2LjM1MTItMTM5LTEzMi0xNjUtMTY4LTQuNjY2NjctNi42NjY3LTctMTQuMzMzMy03LTIzIDAtOCAyLjY2NjY3LTE1LjY2NjcgOC0yMyA3MC4xMDAwOC02Ni43MDYyIDE1Mi41NDMyNy0xMjkuODc0MiAyMTkuMjEwNi0xOTYuMTQ0NzgtMTgtMzMuMzMzMzMtMjMuNTA4NzctNTguMTc1NDMtMzIuODQyMS05MC44NDIxbC0zMDUuMzY4NSAyMy45ODY4OGMtOC42NjY2NjctMS4zMzMzMy0xNS42NjY2NjctNS41LTIxLTEyLjUtNS4zMzMzMzMzLTctOC0xNC44MzMzMy04LTIzLjV2LTIyMmMwLTggMi42NjY2NjY3LTE1LjY2NjY3IDgtMjMgNS4zMzMzMzMtNy4zMzMzMyAxMS42NjY2NjctMTEuNjY2NjcgMTktMTNsMzE2LjUyNjQgNDEuMzQyMTVjOS4zMzMzMy0zMC42NjY2NyAyNi40MTIyOC03NS42MDk2MiA0My4wNzg5NS0xMDYuMjc2MzItMjYuNjY2NjctMzguMDAwMDMtMTk2LjkzODY4LTEzOS4wNjU4My0yNDEuNjA1MzUtMTkzLjA2NTgzLTYuNjY2NjctOC0xMC0xNi0xMC0yNCAwLTYuNjY2NyAzLTE0LjMzMzMgOS0yMyAxNy4zMzMzMy0yNCA1MC4xNjY2Ny01OS44MzMzIDk4LjUtMTA3LjVzNzkuODMzMzMtNzEuNSA5NC41LTcxLjVjOC42NjY2NyAwIDE3LjMzMzMzIDMuMzMzMyAyNiAxMGwxODAuODI4OTggMjM5LjU2NTljMjkuMzMzMzMtMTUuMzMzMyA5NC4zMzc3NC00NC4zMTU4IDEyNS42NzEwNy01NC4zMTU4LTcuNjg4Ni04Ni41ODc4LTU3LjE2NjcyLTI2OC45MTY4LTQ4LjUwMDA1LTMwMi4yNTAxIDQuNjY2NjctMTguNjY2NyAxNi42NjY2Ny0yOCAzNi0yOGgyMjJjOS4zMzMzMyAwIDE3LjUgMi44MzMzIDI0LjUgOC41czEwLjgzMzMzIDEyLjgzMzMgMTEuNSAyMS41bC0zNS4yMjM3MyAyOTYuMTcxMWMzMi42NjY2NyAxMC42NjY3IDk5LjM3NzI1IDM5LjMxNTggMTI2LjcxMDUzIDUzLjMxNThsMTY4LjUxMzItMjM1LjQ4NjljNi02IDE0LTkgMjQtOSA4LjY2NjcgMCAxNyAzLjMzMzMgMjUgMTAgODYgNzkuMzMzMyAxNDEgMTM2IDE2NSAxNzAgNC42NjY3IDUuMzMzMyA3IDEyLjY2NjcgNyAyMiAwIDgtMi42NjY3IDE1LjY2NjctOCAyMy01Ni44MTEzIDQ5LjEyNjUtMTQzLjEzNDQgMTI0LjE0OC0yMTcuMTcxMSAxOTAuMDI2MzUgMTcuMzMzMyAzMy4zMzMzIDMxIDc0LjE1NzkgNDEgMTA2LjE1NzlsMjk1LjE3MTEtMzMuMTg0MjVjOC42NjY3IDEuMzMzMzMgMTUuNjY2NyA1LjUgMjEgMTIuNXM4IDE0LjgzMzMzIDggMjMuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=", Ey = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0NzUuMDg0IDQ3NS4wODQiIGhlaWdodD0iNDc1LjA4NCIgdmlld0JveD0iMCAwIDQ3NS4wODQgNDc1LjA4NCIgd2lkdGg9IjQ3NS4wODQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTQ2NC41MjQgNDEyLjg0Ni05Ny45MjktOTcuOTI1YzIzLjYtMzQuMDY4IDM1LjQwNi03Mi4wNDcgMzUuNDA2LTExMy45MTcgMC0yNy4yMTgtNS4yODQtNTMuMjQ5LTE1Ljg1Mi03OC4wODctMTAuNTYxLTI0Ljg0Mi0yNC44MzgtNDYuMjU0LTQyLjgyNS02NC4yNDFzLTM5LjM5Ni0zMi4yNjQtNjQuMjMzLTQyLjgyNmMtMjQuODQ1LTEwLjU2NS01MC44NzQtMTUuODQ3LTc4LjA5Mi0xNS44NDctMjcuMjE2IDAtNTMuMjQ3IDUuMjgyLTc4LjA4NSAxNS44NDctMjQuODQyIDEwLjU2Mi00Ni4yNTQgMjQuODM5LTY0LjI0MSA0Mi44MjYtMTcuOTg5IDE3Ljk4Ny0zMi4yNjQgMzkuNDAzLTQyLjgyNyA2NC4yNDEtMTAuNTY0IDI0Ljg0MS0xNS44NDYgNTAuODY5LTE1Ljg0NiA3OC4wODcgMCAyNy4yMTYgNS4yODIgNTMuMjM4IDE1Ljg0NiA3OC4wODMgMTAuNTYyIDI0LjgzOCAyNC44MzggNDYuMjQ3IDQyLjgyNyA2NC4yMzQgMTcuOTg3IDE3Ljk5MyAzOS40MDMgMzIuMjY0IDY0LjI0MSA0Mi44MzIgMjQuODQxIDEwLjU2MyA1MC44NjkgMTUuODQ0IDc4LjA4NSAxNS44NDQgNDEuODc5IDAgNzkuODUyLTExLjgwNyAxMTMuOTIyLTM1LjQwNWw5Ny45MjkgOTcuNjQxYzYuODUyIDcuMjMxIDE1LjQwNiAxMC44NDkgMjUuNjkzIDEwLjg0OSA5Ljg5NyAwIDE4LjQ2Ny0zLjYxNyAyNS42OTQtMTAuODQ5IDcuMjMtNy4yMyAxMC44NDgtMTUuNzk2IDEwLjg0OC0yNS42OTMuMDAzLTEwLjA4Mi0zLjUxOC0xOC42NTEtMTAuNTYxLTI1LjY5NHptLTE0OS45OTc2Ni0xMDguMzc2OTNjLTI1LjAyOSAyNS4wMzEtNzIuMjY4MzUgNDcuMjcyMjgtMTA3LjQ3NTA4IDQ2LjYwNzgxLTUzLjMzMDYxLTEuMDA2NTMtNzIuMjgzMzUtMTAuNDIyNzItMTA5LjQ4NDE0LTM4LjU1NTU0LTI2LjA4NjY2Mi0xOS43Mjc4NS00NC41OTE3MzEtNjcuMjI1NDEtNDcuNjExMzMyLTEwNi40NjQ1NC0yLjcwMTc4OC0zNS4xMDkyIDExLjE3OTQ4NC03NS43MzM3NyAzOS41NTkwNjUtMTA1LjQ1OCAzNi43MzI3NDctMzguNDczMTc0IDY4LjI3NzU1Ny00Ni42OTgzMzEgMTEwLjQ5MDY3Ny00OC42MTc4NzYgNDQuMjY5OC0yLjAxMzA2OCA4NC40NTUxNCAxOC41NTg2OTggMTA5LjQ4ODE0IDQzLjU4NTE5NiAyNS4wMzMgMjUuMDI2NSA0My4wMTA2NiA2OC4yNjEyNSA0MS41NzQxNCAxMDMuNDQ0OTQtMi4wMTMwNyA0OS4zMDQ0OC0xMS41MTI0NyA4MC40MjcwMS0zNi41NDE0NyAxMDUuNDU4MDF6IiBmaWxsPSIjZmZmIi8+PC9zdmc+", by = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAzNjUuNDQyIDM2NS40NDIiIGhlaWdodD0iMzY1LjQ0MiIgdmlld0JveD0iMCAwIDM2NS40NDIgMzY1LjQ0MiIgd2lkdGg9IjM2NS40NDIiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTYyLjA0ODM0IDI4My42MzU4NmgzMi4yMTQzNTV2NDAuMzA3NjJoLTMyLjIxNDM1NXptMzEuMjYyMjA3LTIzLjMyNzY0aC0zMC4zMTAwNTl2LTI0LjQzODQ3cTAtMTYuMDI3ODQgNC40NDMzNi0yNi4zNDI3OCA0LjQ0MzM1OS0xMC4zMTQ5NCAxOC43MjU1ODYtMjMuOTYyNGwxNC4yODIyMjYtMTQuMTIzNTNxOS4wNDU0MS04LjQxMDY1IDEzLjAxMjctMTUuODY5MTQgNC4xMjU5Ny03LjQ1ODUgNC4xMjU5Ny0xNS4yMzQzOCAwLTE0LjEyMzUzLTEwLjQ3MzYzLTIyLjg1MTU2LTEwLjMxNDk0Mi04LjcyODAzLTI3LjQ1MzYxNC04LjcyODAzLTEyLjUzNjYyMSAwLTI2LjgxODg0OCA1LjU1NDItMTQuMTIzNTM1IDUuNTU0Mi0yOS41MTY2MDEgMTYuMTg2NTJ2LTI5LjgzMzk4cTE0LjkxNjk5Mi05LjA0NTQxMSAzMC4xNTEzNjctMTMuNDg4NzcxIDE1LjM5MzA2Ni00LjQ0MzM1OSAzMS43MzgyODEtNC40NDMzNTkgMjkuMTk5MjE1IDAgNDYuODEzOTY1IDE1LjM5MzA2NiAxNy43NzM0NCAxNS4zOTMwNjQgMTcuNzczNDQgNDAuNjI1MDA0IDAgMTIuMDYwNTQtNS43MTI4OSAyMy4wMTAyNS01LjcxMjg5IDEwLjc5MTAyLTE5Ljk5NTEyIDI0LjQzODQ4bC0xMy45NjQ4NCAxMy42NDc0NnEtNy40NTg1IDcuNDU4NDktMTAuNjMyMzI4IDExLjc0MzE2LTMuMDE1MTM3IDQuMTI1OTgtNC4yODQ2NjggOC4wOTMyNi0uOTUyMTQ5IDMuMzMyNTItMS40MjgyMjMgOC4wOTMyNy0uNDc2MDc0IDQuNzYwNzQtLjQ3NjA3NCAxMy4wMTI2OXoiIGZpbGw9IiNmZmYiIHRyYW5zZm9ybT0ibWF0cml4KDEuNTgwNTAxNCAwIDAgMS41MTI2NTM1IDUyLjQxODI1MiAtMTI0LjY3MDU5KSIvPjwvc3ZnPg==", Yy = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MDEuOTk0IDQwMS45OTQiIGhlaWdodD0iNDAxLjk5NCIgdmlld0JveD0iMCAwIDQwMS45OTQgNDAxLjk5NCIgd2lkdGg9IjQwMS45OTQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0iI2ZmZiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLS42ODQxMDcgLTIuNjg1NTQ5KSI+PHBhdGggZD0ibTM5Ny43MTUxOSAyMTYuOTk4MzNjLTMuMTYyMTctMy4xNzE4LTcuMjU5NTYtNy4wNDEwOC0xMS41OTkwOS03LjA5MjY2bC01Ni4wODEyNi0uNjY2Nzd2LTUzLjU1NzExbDQwLjM0OTExLTQxLjU0MjgyYzUuMDU1MDQtNy40MTMyNiA4LjE5ODI4LTEwLjg0NTUxIDkuMTQxMjEtMTkuNDMxMjE3LjQ3MzYtNC4zMTIxNjMtLjE3NTQ0LTEyLjgwNzcyNi0zLjM0NTQ4LTE1Ljk4MDQwMS0zLjE2OTE2LTMuMTcwOTIxLTkuNzU0NjktNS42OTkzMjMtMTQuMDk0NTQtNS42OTkzMjMtNC4zMzk4NCAwLTE1LjczMDc3IDIuODg2MzQyLTIyLjkwMDQ5IDEwLjM5MDMyN2wtNDAuNjgyNDkgMzYuMzQ2ODE0LTE4OS42MzY3MyAxLjAwMDE0LTQ2LjMxNDY5Mi00Mi45ODA5MDVjLTMuMTcxODAzLTMuMTcwOTIxLTEzLjU5MzQ0Ni02LjA4OTg4NS0xNy45MzMzMDUtNi4wODk4ODUtNC4zNDI0NzIgMC0xMS4wOTY5NTggMi45MTk4NDctMTQuMjY4NzUgNi4wODk4ODUtMy4xNzE4MDMgMy4xNzE4MDQtNi4xOTU1ODIgNy45MzM3MzctNi40MjMyOCAxMi4yNjU4NS0uMzMzMzcyIDYuMzQyNzU5LS40MTU2OTIgMTEuMDk4NzI1IDMuNzU2MjQ5IDE3LjkzNTkyNWw0NS45ODEzMDcgNDYuOTgxNDZ2NDcuOTM3MDZsLTU1Ljc0Nzg4MyAxLjAwMDE0Yy04LjA1Mjk3OC4xNDQ0Ni0xMi43NjIxMDkzIDYuNTg3OS0xNC45MzI4ODExIDExLjQyNjU5LTIuODM4NDIwMyA1LjE2OTQ1LTEuNDI0MzQzNyAxNS4yNjM4Ni0xLjQyNDM0MzcgMTkuNjAwMTkgMCA0LjMzOTg2IDEuNTg2MzM3MiA2LjQzMzE2IDQuNzU4MTI5MiA5LjU5OTcgMy4xNzA5MjA2IDMuMTcxNzkgNi45MjU4NjQ2IDQuNzYyNTEgMTEuMjY1NzEyNiA0Ljc2MjUxaDU2LjA4MTI2NmMwIDI2LjY5OTQuNTA4Mzk0IDQxLjIzNzQ0IDEwLjE4Nzc2OSA2MC4yNjEybC00NS41NzA5MzIgNDkuODMwOTdjLTkuODM5NTM1IDkuNjc1MjMtNy43OTkxODggMTcuNTU1MjYtNy41NDc1MTcgMjEuOTc1NzcuMjQ5MDQ2IDQuNDE3MDMgNC45NjAzMiAxMy4xMzIzMiA4LjEzMjExMiAxNi4xNDAxMyAzLjE3MTc5MiAyLjY3MDIgNi43NTgzNyA0LjAwODM3IDEwLjc2NDExMyA0LjAwODM3IDQuNjczOTUzIDAgMTUuMzQ2NDA3LTEuNzQ1OTUgMjQuMDIwNjM2LTEyLjI1ODA2bDQwLjE0Nzc5LTQwLjQ5MjQ1LTIuNTc2NjMtLjgyMjc4YzIuMzM2MSAyLjE3Mzg2IDUuOTYzODkgNC44NzkxNiAxMC44OTAzOSA4LjEzMjUxIDQuOTI1NjMgMy4yNTMzNCAyLjg4OTE0IDQuNjIzNDYgOC45NzkzMSA3Ljg4NTU3IDYuMDk0NTQgMy4yNTMzNSAxMC40NjcyNiA2LjM3MjkgMTAuNDY3MjYgNi4zNzI5cy00My4wMjI4Ny0xNjkuNTIxMTMtOS4wNzcwNy0yMDUuMTIyOWwxMzguMTI2OC42NjY3NmMzNy4xOTcxOSAzNi4xNDkyNy01LjgxODkyIDIwMy42Mzg1OC01LjgxODkyIDIwMy42Mzg1OCA3Ljc0MTM0LTQuMDA0MTkgMTQuMTQzOTgtMTAuNDk0OTUgMjAuMzU3MzEtMTUuNDg0MzYgMS42NzQwNS0xLjMzODE2IDEuOTIyNjUtMS4wODg1NCAyLjc1NjU3LTEuOTE5ODRsNDguOTA4NjkgNDYuOTg2NjFjMy4xNTM1IDMuMDI5NiAxMi43NTkyMSAyLjQyMjcyIDE3LjI2NjU0IDIuNDIyNzIgNC41MDgyMSAwIDguMjIyNjEtMS42MjI2NyAxMS4yNzE4NS00Ljc1NjM4IDMuMTIzODctMy4yMTAzOCA1LjcyNzM5LTcuNjExMSA2LjA4NzI4LTExLjkzNTk4LjMzMzM4LTQuMDA2NDcuNzQyMDktMTIuNzk2MDEtMi40MjAxLTE1LjkzMzAxbC01Mi43NDQ5NS01Mi4zMjQ1N2MxMS4xODUwNC0xOS44NjI5NyAxMy40NDE1OC0zNS43MzEzMiAxMy40NDE1OC02NC4yNzA0N2w1Ni40MTQ2Ni0uMzMzMzdjNC4zMzk3Ny0uMDI1NyA4LjA5OTE4LTQuMjU0MjUgMTEuMjY1NzItNy40MjYwNSAzLjE2OTE2LTMuMTY5MTcgNC43NjMzNy02LjkyNTg3IDQuNzYzMzctMTEuMjY1NzEgMC00LjMzODk3LTEuMjU5OTYtMTMuMDk4OTktNC40NDE0LTE2LjI3MTY2eiIvPjxwYXRoIGQ9Im0yNTguNTY0NjIgMjkuMjFjLTE1LjYwNDY5LTE1LjYwNDY4OC0zNC41MDgzMi0yMy40MTAwOTc0LTU2LjcwNzM5LTIzLjQxMDA5NzQtMjIuMjAyNTggMC00MS4xMDA5NSA3LjgwNTQwOTQtNTYuNzA4MjYgMjMuNDEwMDk3NC0xNS42MDQ2OCAxNS42MDY0MzEtMjMuNDA1NyAzNC41MDkxODctMjMuNDA1NyA1Ni43MDczNzdoMTYwLjIyNjE3YzAtMjIuMTk0NjgzLTcuODAwMTUtNDEuMTAwOTQ2LTIzLjQwNDgyLTU2LjcwNzM3N3oiLz48L2c+PHJlY3QgaGVpZ2h0PSIyMjMuNDc2NTMiIHJ5PSIuNTQ5ODMzIiB3aWR0aD0iNDEuNDg5MzE1IiB4PSIxODAuMTI3MjMiIHk9IjE2My41NzM1NSIvPjwvZz48L3N2Zz4=", Uy = "data:image/svg+xml;base64,PHN2ZyBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCA0MDEuOTk0IDQwMS45OTQiIGhlaWdodD0iNDAxLjk5NCIgdmlld0JveD0iMCAwIDQwMS45OTQgNDAxLjk5NCIgd2lkdGg9IjQwMS45OTQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0ibTEyNi4xMDQzOSAzODguNDI2NzNjLTI3LjE4NTM0NS0xMS4xMDQ5Ny00OC45NzEwMDktMjUuOTg2OTMtNzAuMDQ2MDg2LTQ3Ljg0ODk3LTY2LjI1NDI3Ni02OC43MjgzMi03NS4wNTg0NTMtMTcyLjMzOTIyLTIxLjQ1Mzk1MS0yNTIuNDc4MjIyIDEwLjE1MDYzMS0xNS4xNzUyNDQgMzcuOTA3NjY3LTQyLjkzMjI3IDUzLjA4Mjg5My01My4wODI5MDMgMjIuOTEyNDU0LTE1LjMyNTk5NiA0OS4wMjQzOTQtMjYuMjQ3NzYxIDc1LjE2MDA1NC0zMS40MzY5NzY4IDE4Ljg5NDg5LTMuNzUxNTcwMDYgNTcuNTYzODItMy43NTE1NzAwNiA3Ni40NTg3MSAwIDYwLjk5NDgxIDEyLjExMDQ3NDggMTE0LjUwNDk5IDUzLjExMjIyODggMTQyLjczMTggMTA5LjM2NzEwMTggMTYuOTQ5NjYgMzMuNzgwMDMgMjQuMDA5MTEgNzguNTY1NzcgMTguMzg0NTEgMTE2LjYzMjktNi42NDQ4NCA0NC45NzIwOS0yNC45NDQxOSA4MS4yMjk5Ny01Ny40NTk0IDExMy44NDg2Mi0yMS43Nzg1NiAyMS44NDc4NS00NS42NTcxMyAzNy40NDEwMi03MS44NjMzOCA0Ni45MjgyLTEwLjkyNDAxIDMuOTU0NjctMTcuMzk3MjggMi43OTA5MS0xOC43NjExNS0zLjM3MjkzLS40MzgtMS45Nzk1LTEuMDAwMzEtMTkuNTQ0NS0xLjI0OTYtMzkuMDMzMy0uNDI1MzItMzMuMjUzMjgtLjY4MDQyLTM1Ljk0MDAxLTQuMTQ0NzgtNDMuNjUyNTctMi4wMzAzNC00LjUyMDEzLTQuNjc2ODgtOS4wMzYxNy01Ljg4MTIxLTEwLjAzNTY3LTMuNDQxNjMtMi44NTYzLTIuNTgyMDEtNC41ODEzMiAyLjI4Mjk3LTQuNTgxMzIgNy43MDA1MyAwIDI4Ljg5NTQ5LTYuMTE2NzUgNDAuODk2NDYtMTEuODAyNTMgMTMuMzk2MS02LjM0Njc3IDI3LjA5MDYxLTE5LjIyMDYyIDMzLjgwODItMzEuNzgyMjYgNy4xOTcwMi0xMy40NTgxNSAxMC43NjkxNy0zMC4yOTAyNSAxMC45NzA1OC01MS42OTM3OC4yMDg0NS0yMi4xNTIzOS0yLjgzMjEyLTMzLjMwOTExLTEzLjI0MDY4LTQ4LjU4MzgyLTYuMjY0NTEtOS4xOTMyOC02LjI3MzY1LTkuMjI5MDgtNC4zNzM0My0xNy4xNTAwMSAyLjI1MzY2LTkuMzk0MzUgMS4xNjE2OS0yOS4wODE3MTQtMi4xMTkxNC0zOC4yMDY0NzFsLTIuMjY0OTgtNi4yOTk0MTktOC40ODM0OC4xMzY5MTJjLTEwLjAwNzk2LjE2MTQ5Mi0yMS45OTgyNiA0LjUzMjk0OC0zNi42MTY5MyAxMy4zNDk4NzVsLTEwLjU4NDYyIDYuMzgzOTAzLTEyLjEzODAxLTIuODQ3MTNjLTE2LjY3Mjg1LTMuOTEwNzc3LTU4Ljg2NTIyLTMuOTU1MzIxLTc2LjQyMDUxLS4wODA4bC0xMi4zMTIzNSAyLjcxNzQ4LTEwLjQxMDI4LTYuMjc4NzQ3Yy0xNC41MzA3MS04Ljc2Mzc4NS0yNi40NjczMS0xMy4wODQwODQtMzYuNTk0MDUtMTMuMjQ0NjQxbC04LjYzNDk0Ny0uMTM2ODk4LTIuMTI5NTc1IDYuMjk5NDE5Yy0zLjEzMzQ4OSA5LjI2OTA4MS00LjE2MzA1MSAyOC45ODgxMjctMS45ODcxMTkgMzguMDU4NTA3IDEuODUyODQxIDcuNzIzNDMgMS44MTU3NTYgNy44Njg4OC00LjM3MjU0NCAxNy4xNDk5OC0xMC41MzEwMDkgMTUuNzk0MjUtMTMuNDk4ODk3IDI2LjY5NzY2LTEzLjI2NDY2NiA0OC43MzE4MS4yMjY5MzEgMjEuMzQ4NyAzLjgwNzgyOSAzOC4xNjQzMyAxMS4wMDgyMzUgNTEuNjkzNzggNi4yODkxNzEgMTEuODE3MjcgMjEuMzI5OTU2IDI2LjA2NzY3IDMzLjk4NDE5NiAzMi4xOTgzMiAxMC43MTQyNyA1LjE5MDc4IDMyLjg2ODUgMTEuMzU1MDMgNDAuODgzMjIgMTEuMzc1NDQgNS4yODU1My4wMTQyIDUuMzIyNzEuNDg1NjguNTM2MiA2LjgwOTI0LTIuMDg3MDYgMi43NTcyNS00LjgwNTQzIDguNTU2NjEtNi4wNDA4NCAxMi44ODc0NS0yLjEwNDc3IDcuMzc4NDgtMi43MzM0OSA4LjA0OTUtOS45ODUzMyAxMC42NTc0My0xNy4zNTQ1OCA2LjI0MTEtMzYuODI3ODIuMzE2MTMtNDYuODUxNzQ4LTE0LjI1NTI3LTEyLjI4MjQzNC0xNy44NTQ0My0yMy4wMjk4NjUtMjUuNTM2ODktMzUuNzI1MTM1LTI1LjUzNjg5LTguODk0OTkyIDAtMTAuMDY2OTk2IDMuODAzNDQtMi45ODY2NDIgOS42OTIzNiAxMi4zMTM1NTUgMTAuMjQxNSAxNy42MTM4MjUgMTYuNjI3MjEgMjIuODY4MDEgMjcuNTUxMDggNi42NTc2NDYgMTMuODQxODQgMTIuNjYzODI4IDIwLjE5MDY4IDI0LjIzNzE5NSAyNS42MTk5NiA3LjgyNTU3IDMuNjcxMTEgMTAuNDc2MDEgNC4wNjAzMSAyNy4xNzU4IDMuOTkwNTFsMTguNTA0NTEtLjA3NzJ2MTkuODU1N2MwIDEzLjQ2MDI0LS42MzQwOCAyMC42ODU4LTEuOTY4NTYgMjIuNDMyODEtMy42NTk5NSA0Ljc5MTI5LTkuMjc4OTMgNC41NzUxLTIyLjYwODQyLS44Njk5MXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
const ky = { id: "menu" }, Ry = ["href"], Py = ["href"], Qy = ["href"], Zy = ["href"], Gy = ["href"], Wy = { class: "login" }, Fy = { key: 0 }, By = ["href"], $y = {
  key: 1,
  href: "/auth/github"
}, Hy = {
  __name: "Nav",
  setup(i) {
    const { githubURL: u, issuesURL: r, searchURL: s, docURL: l } = Ge("config"), f = Ge("user"), d = Ge("displaySettings", !1), { project: p } = rr();
    return (v, g) => (Y(), Q("nav", ky, [
      g[8] || (g[8] = D("a", { href: "/project/new" }, [
        D("img", {
          class: "button",
          title: "add project",
          alt: "add project",
          src: Oy
        })
      ], -1)),
      G(d) && G(p) != null ? (Y(), Q("a", {
        key: 0,
        href: `/project/${G(p).shortname}/settings`
      }, g[0] || (g[0] = [
        D("img", {
          class: "button",
          title: "settings",
          alt: "settings",
          src: Sy
        }, null, -1)
      ]), 8, Ry)) : oe("", !0),
      D("a", {
        href: G(s),
        target: "_blank"
      }, g[1] || (g[1] = [
        D("img", {
          class: "button",
          title: "search",
          alt: "search",
          src: Ey
        }, null, -1)
      ]), 8, Py),
      D("a", { href: G(l) }, g[2] || (g[2] = [
        D("img", {
          class: "button",
          title: "documentation",
          alt: "documentation",
          src: by
        }, null, -1)
      ]), 8, Qy),
      D("a", {
        href: G(r),
        target: "_blank"
      }, g[3] || (g[3] = [
        D("img", {
          class: "button",
          title: "report a bug",
          alt: "report a bug",
          src: Yy
        }, null, -1)
      ]), 8, Zy),
      D("a", {
        href: G(u),
        target: "_blank"
      }, g[4] || (g[4] = [
        D("img", {
          class: "button",
          title: "join our github project",
          alt: "join our github project",
          style: { width: "15px", height: "15px" },
          src: Uy
        }, null, -1)
      ]), 8, Gy),
      D("div", Wy, [
        G(f) != null && G(f).username !== "anyone" ? (Y(), Q("span", Fy, [
          D("a", {
            href: `/user/${G(f).username}`
          }, ht(G(f).username), 9, By),
          g[5] || (g[5] = yt(" (")),
          g[6] || (g[6] = D("a", { href: "/logout" }, "Log Out", -1)),
          g[7] || (g[7] = yt(") "))
        ])) : (Y(), Q("a", $y, "Log in with GitHub"))
      ])
    ]));
  }
}, Vy = /* @__PURE__ */ gt(Hy, [["__scopeId", "data-v-7afdcfcd"]]);
const Xy = {
  class: "logo",
  href: "/"
}, Ky = ["src", "alt"], Jy = {
  __name: "Header",
  setup(i) {
    const { logoURL: u, siteName: r } = Ge("config");
    return (s, l) => (Y(), Q("header", null, [
      D("a", Xy, [
        D("img", {
          src: G(u),
          alt: G(r)
        }, null, 8, Ky)
      ]),
      Zt(s.$slots, "default", {}, void 0, !0),
      V(Vy)
    ]));
  }
}, Su = /* @__PURE__ */ gt(Jy, [["__scopeId", "data-v-bd2de315"]]), qy = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjI3MiIgd2lkdGg9IjI3Ni4yNzM0NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMTQwLjI4MTI1IDBjLTYzLjI3ODEyMyAwLTExNi4zMTM1MDkgNDMuMjg0OTg2LTEzMS41IDEwMS44MTI1aDcuMjE4NzUgNXYzLjMxMjVjLjYwNDAxLS40MDU3NyAxLjExNzU2LS45NTcxOSAxLjc1LTEuMzEyNWguMDMxMjVjMS4wOTMxOC0uNjA3MzEgMi4yMzY1NTctMS4xNDAwNCAzLjQwNjI1LTEuNTkzNzVzMi4zODkwMTgtLjgyMzcxIDMuNjI1LTEuMTI1YzIuNDcxOTY1LS42MDI1OSA1LjA0Mjk3LS45MDYyMiA3LjcxODc1LS45MDYyNSAyLjE2ODEwMy4wMDAwMiA0LjI3NDQ0My4xOTA2NSA2LjI4MTI1LjU2MjVzMy45MjExNzEuOTQzMTUgNS43MTg3NSAxLjY4NzUgMy40OTA4MyAxLjY2Mzc0IDUuMDMxMjUgMi43ODEyNSAyLjkyMDkyIDIuNDE0OSA0LjE1NjI1IDMuOTA2MjVoLjAzMTI1Yy4wMDU1NS4wMDY2OC0uMDA1NTUuMDI0NTcgMCAuMDMxMjUgMS4yMzM4MDIgMS40ODYyOSAyLjI5Njk4OSAzLjExMzg1IDMuMTg3NSA0Ljg3NXMxLjYxNzA0OSAzLjY2OTk3IDIuMTg3NSA1LjY4NzUuOTc2MzggNC4xNTA4MiAxLjI1IDYuNDA2MjUuNDA2MjMgNC42MTg5MS40MDYyNSA3LjA5Mzc1djQwLjE4NzUgNWgtNS0xMC45Mzc1LTV2LTUtMzkuODQzNzVjLS4wMDAwMi0yLjgyNzQtLjI3NTMzNy01LjExMDEtLjc1LTYuOTM3NXMtMS4xNDg2Ny0zLjE5OTQ4LTEuODc1LTQuMTI1Yy0uNzI5NTA1LS45Mjk0OS0xLjUzOTI1Ni0xLjU5OTU3LTIuNjU2MjUtMi4wNjI1cy0yLjU0MTIzLS43MTg3My00LjQ2ODc1LS43MTg3NWMtMS4yMTE0MDguMDAwMDEtMi4yODEzMjguMDg2MDgtMy4yODEyNS4yNXMtMS45MjA1NjMuNDE4ODctMi43NS43NS0xLjU4MTI5Ny43NDgzNi0yLjI4MTI1IDEuMjUtMS4zNTcyOCAxLjA3NDU0LTEuOTY4NzUgMS43NWMtLjYxMjM2LjY3NjQ1LTEuMTUyNzU4IDEuNDMyMDctMS42MjUgMi4yNXMtLjg2NDAyNiAxLjcwMDYxLTEuMTg3NSAyLjY4NzUtLjU4Mzk0MiAyLjA2NjY3LS43NSAzLjI1LS4yNTAwMDcgMi40Njc3Ny0uMjUgMy44NzV2MzcuNjI1IDVoLTUtNC45MDYyNWMxNy44MzAzNjIgNTQuMzI0NzggNjguODk4ODI1IDkzLjU5Mzc1IDEyOS4xODc1IDkzLjU5Mzc1IDYwLjI5NjcxIDAgMTExLjQxODMyLTM5LjI0NDA0IDEyOS4yNDIxOS05My41ODAwOGgtNC4wMTE3Mi0xMS4yNWMtOS4wNjQxMiAwLTE2LjE4ODY0LTEuNDMxNjUtMjAuOTY4NzUtNi4wOTM3NXYtLjAzMTI1aC0uMDMxMjVjLTQuNzY4MS00LjcwOTIyLTYuMjgxMjYtMTEuODQyNjUtNi4yODEyNS0yMC44MTI1di0zMS4xNTYyNWgtMy4wMzEyNS01di01LTguNS01aDUgMy4wMzEyNXYtMTMuOTM3NDk4LTVoNSAxMSA1djUgMTMuOTM3NDk4aDE3LjUzMTI1IDV2NSA4LjUgNWgtNS0xNy41MzEyNXYzMS4xNTYyNWMtLjAwMDAyIDQuMTkzNjcuOTMxMjQgNi42MzE3Mi45MDQzIDYuOTYyODkuMzkxMjUuMTE4MDQgMi4xMTI1My44MTgzNyA1LjM3Njk1LjgxODM2aDExLjI1IDV2NSA5LjE1NjI1IDEuODU5MzhjMy43NDYxNy0xMi40MzcxNiA1Ljc2OTUzLTI1LjYyMTAzIDUuNzY5NTMtMzkuMjc5MyAwLTc1LjExMDcyOS02MC44ODkyNy0xMzYtMTM2LTEzNnptMTMwLjIzMDQ3IDE3NS4yNzkzYy0uMzE3IDEuMDUyNDItLjY0NjY0IDIuMDk5MTItLjk4ODI4IDMuMTQwNjJoLjk4ODI4em0tMTY0LjQwNjI1LTc1LjA3ODEzYzEwLjQ5OTY1LjAwMDA3IDE5LjI5ODAzIDIuODQ1OSAyNS4yMTg3NSA5LjA2MjUgNS45MjQ0NiA2LjIyMDgyIDguNTMxMTcgMTUuMjI0MDggOC41MzEyNSAyNi4xNTYyNXYzOCA1aC01LTEwLjk2ODc1LTV2LTIuOTM3NWMtLjY2NjA0LjQyNzY0LTEuMzI4MS44ODM0Ni0yLjAzMTI1IDEuMjVsLS4wMzEyNS4wMzEyNWMtNC41OTcxNSAyLjM0NzQ1LTkuOTU2NTggMy40MDYyNS0xNS45Mzc1IDMuNDA2MjUtNy43NTA0NTEgMC0xNC42NTI4MjEtMi4zMjU4LTE5LjcxODc1MS03LjA5Mzc1aC0uMDMxMjVsLS4wMzEyNS0uMDMxMjVjLTUuMDA3ODctNC44MDk1Mi03LjUzMTI2LTExLjUzNzIxLTcuNTMxMjUtMTktLjAwMDAxLTguNjA1MzggMy4yMTQzOC0xNi4xNzIyMiA5LjQ2ODc1LTIwLjkzNzUgNi4yOTk4Ni00Ljc2MjA3IDE0LjkwOTgxLTYuNzE4NzEgMjUuNTAwMDAxLTYuNzE4NzVoOS43MTg3NWMtLjUwMzY1LTEuNTUwODktMS4yNjY1LTIuODM2MDYtMi41MzEyNS0zLjg3NWwtLjAzMTI1LS4wMzEyNWgtLjAzMTI1Yy0yLjE0ODg5LTEuODEyMjUtNS40NzI2Ni0yLjk5OTk1LTEwLjY4NzUtMy0zLjQwNzQuMDAwMDUtNi43MDI4NjEuNDA5MTQtOS45MDYyNTEgMS4yMTg3NS0zLjE5NTAyLjgwNzU4LTYuMjQ3MTkgMi4wMjkwMS05LjIxODc1IDMuNjU2MjVsLTcuNDA2MjUgNC4wMzEyNXYtOC40Mzc1LTEwLjA5Mzc1LTMuNDM3NWwzLjE4NzUtMS4yNWM0LjIxOTAzLTEuNjI5MDcgOC4zODA1NC0yLjg0MDUgMTIuNDM3NS0zLjY1NjI1LjAyMTgxLS4wMDQzOS4wNDA2OS0uMDI2ODkuMDYyNS0uMDMxMjV2LjAzMTI1YzQuMDU3MjQtLjg1MDAxIDguMDQ5NDkxLTEuMzEyNDMgMTEuOTY4NzUxLTEuMzEyNXptNzQuNzE4NzUgMGMxMC40OTk2NS4wMDAwNyAxOS4yOTgwMiAyLjg0NTg5IDI1LjIxODc1IDkuMDYyNSA1LjkyNDQ1IDYuMjIwODIgOC40OTk5NCAxNS4yMjQwNyA4LjUgMjYuMTU2MjV2MzggNWgtNS0xMC45Mzc1LTV2LTIuOTM3NWMtLjY3MDM3LjQzMS0xLjMyMzI1Ljg4MDkzLTIuMDMxMjUgMS4yNWgtLjAzMTI1di4wMzEyNWMtNC41OTcxNSAyLjM0NzQ1LTkuOTg3ODQgMy40MDYyNS0xNS45Njg3NSAzLjQwNjI1LTcuNzUwNDUgMC0xNC42NTI4Mi0yLjMyNTgtMTkuNzE4NzUtNy4wOTM3NWwtLjAzMTI1LS4wMzEyNWMtNS4wMDc4Ny00LjgwOTUyLTcuNTMxMjYtMTEuNTM3MjEtNy41MzEyNS0xOS0uMDAwMDEtOC42MDUzOCAzLjE4MzEzLTE2LjE3MjIyIDkuNDM3NS0yMC45Mzc1aC4wMzEyNWM2LjI5OTg2LTQuNzYyMDcgMTQuOTA5OC02LjcxODcxIDI1LjUtNi43MTg3NWg5LjY4NzVjLS41MDM2OC0xLjU1MDUzLTEuMjY2Ny0yLjgzNjIzLTIuNTMxMjUtMy44NzV2LS4wMzEyNWgtLjAzMTI1Yy0yLjE0ODkxLTEuODEyMjYtNS40NzI2NS0yLjk5OTk1LTEwLjY4NzUtMy0zLjQwNzQuMDAwMDUtNi43MDI4Ni40MDkxNC05LjkwNjI1IDEuMjE4NzUtMy4xOTUwMi44MDc1OC02LjI3ODQ0IDIuMDI5MDEtOS4yNSAzLjY1NjI1bC03LjM3NSA0LjAzMTI1di04LjQzNzUtMTAuMDkzNzUtMy40Mzc1bDMuMTg3NS0xLjI1YzQuMjQxNzItMS42Mzc4MiA4LjM5MDgzLTIuODcxODUgMTIuNDY4NzUtMy42ODc1di4wMzEyNWM0LjA2Nzc5LS44NTQyNiA4LjA3MDg0LTEuMzEyNDMgMTItMS4zMTI1em0tNjcuODEyNSA0NC43NWMtOC40NjEzNC4wMDAwMy0xNC4wMzMzMDEgMS4yNTc0LTE1LjgxMjUwMSAyLjMxMjUtMS44OTMyOCAxLjEyMjc2LTIuNjg3NTIgMi4zNTA2Mi0yLjY4NzUgNi4wNjI1LS4wMDAwMSAyLjc3NTUxLjY1MDM1IDQuMTgyMDkgMi4xMjUgNS41MzEyNS4wMTE2OC4wMTA2OS4wMTk0Ni4wMjA1Ny4wMzEyNS4wMzEyNSAxLjUxNDM2IDEuMzE0NDQgMy42MDI4MzEgMi4wOTM3NiA3LjEyNTAwMSAyLjA5Mzc1IDQuODkwMjcuMDAwMDEgOC4wMjA0NC0xLjQxNTM0IDEwLjc4MTI1LTQuNjU2MjUgMi4zOTE4OC0yLjgwMzQzIDMuNzc2MzctNi40ODYwNSA0LjE1NjI1LTExLjM3NXptNzQuNzE4NzUgMGMtOC40NjEzNC4wMDAwMy0xNC4wNjQ1NSAxLjI1NzQtMTUuODQzNzUgMi4zMTI1LTEuODkzMjggMS4xMjI3Ni0yLjY1NjI3IDIuMzUwNjItMi42NTYyNSA2LjA2MjUtLjAwMDAxIDIuNzk3NDkuNjU2ODEgNC4yMDM2NSAyLjE1NjI1IDUuNTYyNSAxLjUxMjk1IDEuMzA0NTIgMy42MTc4OSAyLjA5Mzc2IDcuMTI1IDIuMDkzNzUgNC44OTAyNy4wMDAwMSA3Ljk4OTE5LTEuNDE1MzQgMTAuNzUtNC42NTYyNSAyLjM5MTg4LTIuODAzNDMgMy44MDc2Mi02LjQ4NjA1IDQuMTg3NS0xMS4zNzV6IiBmaWxsPSIjZmZmIi8+PC9zdmc+";
const tm = {};
function em(i, u) {
  return Y(), Q("footer", null, u[0] || (u[0] = [
    D("p", null, [
      D("a", {
        target: "_blank",
        href: "http://neuroanatomy.github.io"
      }, [
        D("img", {
          alt: "Neuroanatomy",
          src: qy
        })
      ]),
      D("a", {
        target: "_blank",
        href: "http://neuroanatomy.github.io"
      }, " groupe de neuroanatomie appliquée et théorique ")
    ], -1)
  ]));
}
const ys = /* @__PURE__ */ gt(tm, [["render", em], ["__scopeId", "data-v-8d355fbb"]]), Zz = {
  __name: "SettingsPage",
  props: {
    project: {
      type: Object,
      required: !0
    },
    files: {
      type: Object,
      required: !1,
      default: null
    }
  },
  setup(i) {
    const u = i, { setProject: r, updateProject: s } = rr();
    r(u.project), u.files !== null && Sr(u.files, (p) => s({ files: { list: p } }));
    const l = it(u.project.name), f = it(null);
    Er(() => {
      f.value && (f.value.textContent = l.value || "");
    });
    const d = (p) => {
      l.value = p.currentTarget.textContent, s({ name: l.value });
    };
    return (p, v) => (Y(), Qt(Ou, null, {
      default: q(() => [
        V(Su, null, {
          default: q(() => [
            D("span", {
              ref_key: "titleRef",
              ref: f,
              contenteditable: "true",
              onInput: d,
              placeholder: "Enter a project name",
              class: ue({ title: !0, empty: !l.value || l.value.trim().length === 0 })
            }, null, 34)
          ]),
          _: 1
        }),
        D("main", null, [
          i.project != null ? (Y(), Qt(_y, { key: 0 })) : oe("", !0)
        ]),
        V(ys)
      ]),
      _: 1
    }));
  }
}, nm = { class: "title" }, rm = { id: "userImage" }, im = ["src"], um = { id: "userDescription" }, Gz = {
  __name: "UserPage",
  props: {
    user: {
      type: Object,
      required: !0
    }
  },
  setup(i) {
    const { usernameField: u } = Ge("config");
    return (r, s) => (Y(), Qt(Ou, null, {
      default: q(() => [
        V(Su, null, {
          default: q(() => [
            D("span", nm, ht(i.user[G(u)]), 1)
          ]),
          _: 1
        }),
        D("main", null, [
          V(Ic, null, {
            side: q(() => [
              D("div", rm, [
                D("img", {
                  alt: "user avatar",
                  src: i.user.avatarURL,
                  style: { width: "100%" }
                }, null, 8, im)
              ]),
              D("div", um, [
                D("h1", null, ht(i.user.name), 1),
                D("h2", null, ht(i.user[G(u)]), 1),
                D("p", null, "Joined " + ht(new Date(i.user.joined).toDateString()), 1),
                Zt(r.$slots, "side")
              ])
            ]),
            content: q(() => [
              Zt(r.$slots, "content")
            ]),
            _: 3
          })
        ]),
        V(ys)
      ]),
      _: 3
    }));
  }
};
const om = { class: "title" }, sm = { class: "container" }, am = { class: "inner" }, lm = { class: "warning" }, cm = ["href"], Mm = { class: "warning" }, fm = { class: "actions" }, gm = {
  __name: "NewProjectPage",
  props: {
    onKeyDown: {
      type: Function,
      required: !0
    },
    validInput: Boolean,
    existingProject: Boolean
  },
  setup(i) {
    const { siteName: u } = Ge("config"), r = (f) => {
      location.pathname = `/project/${f}/settings`;
    }, s = () => location.assign("/"), l = it(null);
    return (f, d) => (Y(), Qt(Ou, null, {
      default: q(() => {
        var p, v;
        return [
          V(Su, null, {
            default: q(() => [
              D("span", om, ht(G(u)), 1)
            ]),
            _: 1
          }),
          D("main", null, [
            D("div", sm, [
              D("div", am, [
                d[4] || (d[4] = D("h1", null, "Create a new project", -1)),
                D("p", null, [
                  Zt(f.$slots, "default", {}, void 0, !0)
                ]),
                D("input", {
                  class: "input",
                  type: "text",
                  ref_key: "inputEl",
                  ref: l,
                  onInput: d[0] || (d[0] = (...g) => i.onKeyDown && i.onKeyDown(...g)),
                  placeholder: "Enter the project short name"
                }, null, 544),
                bn(D("div", lm, [
                  d[2] || (d[2] = yt(" The project ")),
                  D("a", {
                    href: `/project/${(p = l.value) == null ? void 0 : p.value}`
                  }, [
                    D("strong", null, ht((v = l.value) == null ? void 0 : v.value), 1)
                  ], 8, cm),
                  d[3] || (d[3] = yt(" already exists "))
                ], 512), [
                  [gi, i.existingProject]
                ]),
                bn(D("div", Mm, " This name is not allowed. Project short names can only contain letters and numbers ", 512), [
                  [gi, !i.validInput]
                ])
              ]),
              D("div", fm, [
                V(Yt, {
                  disabled: !i.validInput || i.existingProject,
                  onClick: d[1] || (d[1] = (g) => {
                    var I;
                    return r((I = l.value) == null ? void 0 : I.value);
                  }),
                  class: "push-button"
                }, {
                  default: q(() => d[5] || (d[5] = [
                    yt(" Create Project ")
                  ])),
                  _: 1
                }, 8, ["disabled"]),
                V(Yt, {
                  class: "push-button",
                  onClick: s
                }, {
                  default: q(() => d[6] || (d[6] = [
                    yt(" Cancel ")
                  ])),
                  _: 1
                })
              ])
            ])
          ]),
          V(ys)
        ];
      }),
      _: 3
    }));
  }
}, Wz = /* @__PURE__ */ gt(gm, [["__scopeId", "data-v-afc42b7f"]]), xc = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjE3OTIiCiAgIGhlaWdodD0iMTc5MiIKICAgdmlld0JveD0iMCAwIDE3OTIgMTc5MiIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImNhcmV0LXNxdWFyZS1vLXJpZ2h0LnN2ZyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhMTAiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3N2Zyt4bWw8L2RjOmZvcm1hdD4KICAgICAgICA8ZGM6dHlwZQogICAgICAgICAgIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiIC8+CiAgICAgICAgPGRjOnRpdGxlPjwvZGM6dGl0bGU+CiAgICAgIDwvY2M6V29yaz4KICAgIDwvcmRmOlJERj4KICA8L21ldGFkYXRhPgogIDxkZWZzCiAgICAgaWQ9ImRlZnM4IiAvPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBvYmplY3R0b2xlcmFuY2U9IjEwIgogICAgIGdyaWR0b2xlcmFuY2U9IjEwIgogICAgIGd1aWRldG9sZXJhbmNlPSIxMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTc4NSIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDgyIgogICAgIGlkPSJuYW1lZHZpZXc2IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIwLjM3ODExMjc5IgogICAgIGlua3NjYXBlOmN4PSIxMjExLjA4MzUiCiAgICAgaW5rc2NhcGU6Y3k9IjkyMi4xOTM2NCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iNDYiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPgogIDxnCiAgICAgaWQ9Imc0MjEwIgogICAgIHRyYW5zZm9ybT0ibWF0cml4KC0wLjkzODAxNDUzLDAsMCwtMC44NzI1ODU0MiwxNzM2LjQ2MSwxNjc3LjgzNjUpIj4KICAgIDxwYXRoCiAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9InNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzIgogICAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIKICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjEiCiAgICAgICBpZD0icGF0aDQiCiAgICAgICBkPSJtIDE1MjEuNDk5NCwxNTE2LjQxMjkgLTMuODM0MiwtMTI0NS43OTQyOSBjIC0wLjAyNywtOC42NjY2MyAtMy4xNjY3LC0xNi4xNjY2NyAtOS41LC0yMi41IC02LjMzMzMsLTYuMzMzMzMgLTEzLjgzMzQsLTkuNDc2MTggLTIyLjUsLTkuNSBsIC04MDIuOTIxNDIsLTIuMjA3MDggYyAtOC42NjY2MywtMC4wMjM4IC0xOC4wNTk1NywxLjcyNzUzIC0yNC4zOTI5LDguMDYwODYgLTYuMzMzMzMsNi4zMzMzMyAtNy41ODA3Niw0LjIwMDEzIC03LjYwNzEsMjMuOTM5MTQgbCAtMS42NjYsMTI0OC43NzU4NyBjIC0wLjAxMTYsOC42NjY4IDMuMTY2NjcsMTYuMTY2NyA5LjUsMjIuNSA2LjMzMzMzLDYuMzMzMyAxMy44MzMzMiw5LjUwODMgMjIuNSw5LjUgbCA4MDguNDIxNjIsLTAuNzc0NSBjIDguNjY2NiwtMC4wMSAxNi4xNjY3LC0zLjE2NjcgMjIuNSwtOS41IDYuMzMzMywtNi4zMzMzIDkuNTI2NywtMTMuODMzNCA5LjUsLTIyLjUgeiBNIDE2NjQsNDE2IGwgMCw5NjAgYyAwLDc5LjMzMzMgLTI4LjE2NjcsMTQ3LjE2NjcgLTg0LjUsMjAzLjUgLTU2LjMzMzMsNTYuMzMzMyAtMTI0LjE2NjcsODQuNSAtMjAzLjUsODQuNSBsIC05NjAsMCBjIC03OS4zMzMzMywwIC0xNDcuMTY2NjcsLTI4LjE2NjcgLTIwMy41LC04NC41IEMgMTU2LjE2NjY3LDE1MjMuMTY2NyAxMjgsMTQ1NS4zMzMzIDEyOCwxMzc2IGwgMCwtOTYwIEMgMTI4LDMzNi42NjY2NyAxNTYuMTY2NjcsMjY4LjgzMzMzIDIxMi41LDIxMi41IDI2OC44MzMzMywxNTYuMTY2NjcgMzM2LjY2NjY3LDEyOCA0MTYsMTI4IGwgOTYwLDAgYyA3OS4zMzMzLDAgMTQ3LjE2NjcsMjguMTY2NjcgMjAzLjUsODQuNSA1Ni4zMzMzLDU2LjMzMzMzIDg0LjUsMTI0LjE2NjY3IDg0LjUsMjAzLjUgeiIgLz4KICA8L2c+Cjwvc3ZnPgo=", dm = {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "splitpanes",
  emits: ["ready", "resize", "resized", "pane-click", "pane-maximize", "pane-add", "pane-remove", "splitter-click"],
  props: {
    horizontal: { type: Boolean },
    pushOtherPanes: { type: Boolean, default: !0 },
    dblClickSplitter: { type: Boolean, default: !0 },
    rtl: { type: Boolean, default: !1 },
    // Right to left direction.
    firstSplitter: { type: Boolean }
  },
  provide() {
    return {
      requestUpdate: this.requestUpdate,
      onPaneAdd: this.onPaneAdd,
      onPaneRemove: this.onPaneRemove,
      onPaneClick: this.onPaneClick
    };
  },
  data: () => ({
    container: null,
    ready: !1,
    panes: [],
    touch: {
      mouseDown: !1,
      dragging: !1,
      activeSplitter: null
    },
    splitterTaps: {
      // Used to detect double click on touch devices.
      splitter: null,
      timeoutId: null
    }
  }),
  computed: {
    panesCount() {
      return this.panes.length;
    },
    // Indexed panes by `uid` of Pane components for fast lookup.
    // Every time a pane is destroyed this index is recomputed.
    indexedPanes() {
      return this.panes.reduce((i, u) => (i[u.id] = u) && i, {});
    }
  },
  methods: {
    updatePaneComponents() {
      this.panes.forEach((i) => {
        i.update && i.update({
          // Panes are indexed by Pane component uid, as they might be inserted at different index.
          [this.horizontal ? "height" : "width"]: `${this.indexedPanes[i.id].size}%`
        });
      });
    },
    bindEvents() {
      document.addEventListener("mousemove", this.onMouseMove, { passive: !1 }), document.addEventListener("mouseup", this.onMouseUp), "ontouchstart" in window && (document.addEventListener("touchmove", this.onMouseMove, { passive: !1 }), document.addEventListener("touchend", this.onMouseUp));
    },
    unbindEvents() {
      document.removeEventListener("mousemove", this.onMouseMove, { passive: !1 }), document.removeEventListener("mouseup", this.onMouseUp), "ontouchstart" in window && (document.removeEventListener("touchmove", this.onMouseMove, { passive: !1 }), document.removeEventListener("touchend", this.onMouseUp));
    },
    onMouseDown(i, u) {
      this.bindEvents(), this.touch.mouseDown = !0, this.touch.activeSplitter = u;
    },
    onMouseMove(i) {
      this.touch.mouseDown && (i.preventDefault(), this.touch.dragging = !0, this.calculatePanesSize(this.getCurrentMouseDrag(i)), this.$emit("resize", this.panes.map((u) => ({ min: u.min, max: u.max, size: u.size }))));
    },
    onMouseUp() {
      this.touch.dragging && this.$emit("resized", this.panes.map((i) => ({ min: i.min, max: i.max, size: i.size }))), this.touch.mouseDown = !1, setTimeout(() => {
        this.touch.dragging = !1, this.unbindEvents();
      }, 100);
    },
    // If touch device, detect double tap manually (2 taps separated by less than 500ms).
    onSplitterClick(i, u) {
      "ontouchstart" in window && (i.preventDefault(), this.dblClickSplitter && (this.splitterTaps.splitter === u ? (clearTimeout(this.splitterTaps.timeoutId), this.splitterTaps.timeoutId = null, this.onSplitterDblClick(i, u), this.splitterTaps.splitter = null) : (this.splitterTaps.splitter = u, this.splitterTaps.timeoutId = setTimeout(() => {
        this.splitterTaps.splitter = null;
      }, 500)))), this.touch.dragging || this.$emit("splitter-click", this.panes[u]);
    },
    // On splitter dbl click or dbl tap maximize this pane.
    onSplitterDblClick(i, u) {
      let r = 0;
      this.panes = this.panes.map((s, l) => (s.size = l === u ? s.max : s.min, l !== u && (r += s.min), s)), this.panes[u].size -= r, this.$emit("pane-maximize", this.panes[u]), this.$emit("resized", this.panes.map((s) => ({ min: s.min, max: s.max, size: s.size })));
    },
    onPaneClick(i, u) {
      this.$emit("pane-click", this.indexedPanes[u]);
    },
    // Get the cursor position relative to the splitpane container.
    getCurrentMouseDrag(i) {
      const u = this.container.getBoundingClientRect(), { clientX: r, clientY: s } = "ontouchstart" in window && i.touches ? i.touches[0] : i;
      return {
        x: r - u.left,
        y: s - u.top
      };
    },
    // Returns the drag percentage of the splitter relative to the container (ranging from 0 to 100%).
    getCurrentDragPercentage(i) {
      i = i[this.horizontal ? "y" : "x"];
      const u = this.container[this.horizontal ? "clientHeight" : "clientWidth"];
      return this.rtl && !this.horizontal && (i = u - i), i * 100 / u;
    },
    calculatePanesSize(i) {
      const u = this.touch.activeSplitter;
      let r = {
        prevPanesSize: this.sumPrevPanesSize(u),
        nextPanesSize: this.sumNextPanesSize(u),
        prevReachedMinPanes: 0,
        nextReachedMinPanes: 0
      };
      const s = 0 + (this.pushOtherPanes ? 0 : r.prevPanesSize), l = 100 - (this.pushOtherPanes ? 0 : r.nextPanesSize), f = Math.max(Math.min(this.getCurrentDragPercentage(i), l), s);
      let d = [u, u + 1], p = this.panes[d[0]] || null, v = this.panes[d[1]] || null;
      const g = p.max < 100 && f >= p.max + r.prevPanesSize, I = v.max < 100 && f <= 100 - (v.max + this.sumNextPanesSize(u + 1));
      if (g || I) {
        g ? (p.size = p.max, v.size = Math.max(100 - p.max - r.prevPanesSize - r.nextPanesSize, 0)) : (p.size = Math.max(100 - v.max - r.prevPanesSize - this.sumNextPanesSize(u + 1), 0), v.size = v.max);
        return;
      }
      if (this.pushOtherPanes) {
        const T = this.doPushOtherPanes(r, f);
        if (!T)
          return;
        ({ sums: r, panesToResize: d } = T), p = this.panes[d[0]] || null, v = this.panes[d[1]] || null;
      }
      p !== null && (p.size = Math.min(Math.max(f - r.prevPanesSize - r.prevReachedMinPanes, p.min), p.max)), v !== null && (v.size = Math.min(Math.max(100 - f - r.nextPanesSize - r.nextReachedMinPanes, v.min), v.max));
    },
    doPushOtherPanes(i, u) {
      const r = this.touch.activeSplitter, s = [r, r + 1];
      return u < i.prevPanesSize + this.panes[s[0]].min && (s[0] = this.findPrevExpandedPane(r).index, i.prevReachedMinPanes = 0, s[0] < r && this.panes.forEach((l, f) => {
        f > s[0] && f <= r && (l.size = l.min, i.prevReachedMinPanes += l.min);
      }), i.prevPanesSize = this.sumPrevPanesSize(s[0]), s[0] === void 0) ? (i.prevReachedMinPanes = 0, this.panes[0].size = this.panes[0].min, this.panes.forEach((l, f) => {
        f > 0 && f <= r && (l.size = l.min, i.prevReachedMinPanes += l.min);
      }), this.panes[s[1]].size = 100 - i.prevReachedMinPanes - this.panes[0].min - i.prevPanesSize - i.nextPanesSize, null) : u > 100 - i.nextPanesSize - this.panes[s[1]].min && (s[1] = this.findNextExpandedPane(r).index, i.nextReachedMinPanes = 0, s[1] > r + 1 && this.panes.forEach((l, f) => {
        f > r && f < s[1] && (l.size = l.min, i.nextReachedMinPanes += l.min);
      }), i.nextPanesSize = this.sumNextPanesSize(s[1] - 1), s[1] === void 0) ? (i.nextReachedMinPanes = 0, this.panes[this.panesCount - 1].size = this.panes[this.panesCount - 1].min, this.panes.forEach((l, f) => {
        f < this.panesCount - 1 && f >= r + 1 && (l.size = l.min, i.nextReachedMinPanes += l.min);
      }), this.panes[s[0]].size = 100 - i.prevPanesSize - i.nextReachedMinPanes - this.panes[this.panesCount - 1].min - i.nextPanesSize, null) : { sums: i, panesToResize: s };
    },
    sumPrevPanesSize(i) {
      return this.panes.reduce((u, r, s) => u + (s < i ? r.size : 0), 0);
    },
    sumNextPanesSize(i) {
      return this.panes.reduce((u, r, s) => u + (s > i + 1 ? r.size : 0), 0);
    },
    // Return the previous pane from siblings which has a size (width for vert or height for horz) of more than 0.
    findPrevExpandedPane(i) {
      return [...this.panes].reverse().find((u) => u.index < i && u.size > u.min) || {};
    },
    // Return the next pane from siblings which has a size (width for vert or height for horz) of more than 0.
    findNextExpandedPane(i) {
      return this.panes.find((u) => u.index > i + 1 && u.size > u.min) || {};
    },
    checkSplitpanesNodes() {
      Array.from(this.container.children).forEach((i) => {
        const u = i.classList.contains("splitpanes__pane"), r = i.classList.contains("splitpanes__splitter");
        !u && !r && (i.parentNode.removeChild(i), console.warn("Splitpanes: Only <pane> elements are allowed at the root of <splitpanes>. One of your DOM nodes was removed."));
      });
    },
    addSplitter(i, u, r = !1) {
      const s = i - 1, l = document.createElement("div");
      l.classList.add("splitpanes__splitter"), r || (l.onmousedown = (f) => this.onMouseDown(f, s), typeof window < "u" && "ontouchstart" in window && (l.ontouchstart = (f) => this.onMouseDown(f, s)), l.onclick = (f) => this.onSplitterClick(f, s + 1)), this.dblClickSplitter && (l.ondblclick = (f) => this.onSplitterDblClick(f, s + 1)), u.parentNode.insertBefore(l, u);
    },
    removeSplitter(i) {
      i.onmousedown = void 0, i.onclick = void 0, i.ondblclick = void 0, i.parentNode.removeChild(i);
    },
    redoSplitters() {
      const i = Array.from(this.container.children);
      i.forEach((r) => {
        r.className.includes("splitpanes__splitter") && this.removeSplitter(r);
      });
      let u = 0;
      i.forEach((r) => {
        r.className.includes("splitpanes__pane") && (!u && this.firstSplitter ? this.addSplitter(u, r, !0) : u && this.addSplitter(u, r), u++);
      });
    },
    // Called by Pane component on programmatic resize.
    requestUpdate(r) {
      var s = r, { target: i } = s, u = Bl(s, ["target"]);
      const l = this.indexedPanes[i._.uid];
      Object.entries(u).forEach(([f, d]) => l[f] = d);
    },
    onPaneAdd(i) {
      let u = -1;
      Array.from(i.$el.parentNode.children).some((l) => (l.className.includes("splitpanes__pane") && u++, l === i.$el));
      const r = parseFloat(i.minSize), s = parseFloat(i.maxSize);
      this.panes.splice(u, 0, {
        id: i._.uid,
        index: u,
        min: isNaN(r) ? 0 : r,
        max: isNaN(s) ? 100 : s,
        size: i.size === null ? null : parseFloat(i.size),
        givenSize: i.size,
        update: i.update
      }), this.panes.forEach((l, f) => l.index = f), this.ready && this.$nextTick(() => {
        this.redoSplitters(), this.resetPaneSizes({ addedPane: this.panes[u] }), this.$emit("pane-add", { index: u, panes: this.panes.map((l) => ({ min: l.min, max: l.max, size: l.size })) });
      });
    },
    onPaneRemove(i) {
      const u = this.panes.findIndex((s) => s.id === i._.uid), r = this.panes.splice(u, 1)[0];
      this.panes.forEach((s, l) => s.index = l), this.$nextTick(() => {
        this.redoSplitters(), this.resetPaneSizes({ removedPane: _r(St({}, r), { index: u }) }), this.$emit("pane-remove", { removed: r, panes: this.panes.map((s) => ({ min: s.min, max: s.max, size: s.size })) });
      });
    },
    resetPaneSizes(i = {}) {
      !i.addedPane && !i.removedPane ? this.initialPanesSizing() : this.panes.some((u) => u.givenSize !== null || u.min || u.max < 100) ? this.equalizeAfterAddOrRemove(i) : this.equalize(), this.ready && this.$emit("resized", this.panes.map((u) => ({ min: u.min, max: u.max, size: u.size })));
    },
    equalize() {
      const i = 100 / this.panesCount;
      let u = 0;
      const r = [], s = [];
      this.panes.forEach((l) => {
        l.size = Math.max(Math.min(i, l.max), l.min), u -= l.size, l.size >= l.max && r.push(l.id), l.size <= l.min && s.push(l.id);
      }), u > 0.1 && this.readjustSizes(u, r, s);
    },
    initialPanesSizing() {
      let i = 100;
      const u = [], r = [];
      let s = 0;
      this.panes.forEach((f) => {
        i -= f.size, f.size !== null && s++, f.size >= f.max && u.push(f.id), f.size <= f.min && r.push(f.id);
      });
      let l = 100;
      i > 0.1 && (this.panes.forEach((f) => {
        f.size === null && (f.size = Math.max(Math.min(i / (this.panesCount - s), f.max), f.min)), l -= f.size;
      }), l > 0.1 && this.readjustSizes(i, u, r));
    },
    equalizeAfterAddOrRemove({ addedPane: i, removedPane: u } = {}) {
      let r = 100 / this.panesCount, s = 0;
      const l = [], f = [];
      i && i.givenSize !== null && (r = (100 - i.givenSize) / (this.panesCount - 1)), this.panes.forEach((d) => {
        s -= d.size, d.size >= d.max && l.push(d.id), d.size <= d.min && f.push(d.id);
      }), !(Math.abs(s) < 0.1) && (this.panes.forEach((d) => {
        i && i.givenSize !== null && i.id === d.id || (d.size = Math.max(Math.min(r, d.max), d.min)), s -= d.size, d.size >= d.max && l.push(d.id), d.size <= d.min && f.push(d.id);
      }), s > 0.1 && this.readjustSizes(s, l, f));
    },
    /* recalculatePaneSizes ({ addedPane, removedPane } = {}) {
          let leftToAllocate = 100
          let equalSpaceToAllocate = leftToAllocate / this.panesCount
          let ungrowable = []
          let unshrinkable = []
    
          // When adding a pane with no size, apply min-size if defined otherwise divide another pane
          // (next or prev) in 2.
          // if (addedPane && addedPane.size === null) {
          //   if (addedPane.min) addedPane.size = addedPane.min
          //   else {
          //     const paneToDivide = this.panes[addedPane.index + 1] || this.panes[addedPane.index - 1]
          //     if (paneToDivide) {
          //       // @todo: Dividing that pane in 2 could be incorrect if becoming lower than its min size.
          //       addedPane.size = paneToDivide.size / 2
          //       paneToDivide.size /= 2
          //     }
          //   }
          // }
    
          this.panes.forEach((pane, i) => {
            // Added pane - reduce the size of the next pane.
            if (addedPane && addedPane.index + 1 === i) {
              pane.size = Math.max(Math.min(100 - this.sumPrevPanesSize(i) - this.sumNextPanesSize(i + 1), pane.max), pane.min)
              // @todo: if could not allocate correctly, try to allocate in the next pane straight away,
              // then still do the second loop if not correct.
            }
    
            // Removed pane - increase the size of the next pane.
            else if (removedPane && removedPane.index === i) {
              pane.size = Math.max(Math.min(100 - this.sumPrevPanesSize(i) - this.sumNextPanesSize(i + 1), pane.max), pane.min)
              // @todo: if could not allocate correctly, try to allocate in the next pane straight away,
              // then still do the second loop if not correct.
            }
    
            // Initial load and on demand recalculation.
            else if (!addedPane && !removedPane && pane.size === null) {
              pane.size = Math.max(Math.min(equalSpaceToAllocate, pane.max), pane.min)
            }
    
            leftToAllocate -= pane.size
    
            if (pane.size >= pane.max) ungrowable.push(pane.id)
            if (pane.size <= pane.min) unshrinkable.push(pane.id)
          })
    
          // Do one more loop to adjust sizes if still wrong.
          // > 0.1: Prevent maths rounding issues due to bytes.
          if (Math.abs(leftToAllocate) > 0.1) this.readjustSizes(leftToAllocate, ungrowable, unshrinkable)
        }, */
    // Second loop to adjust sizes now that we know more about the panes constraints.
    readjustSizes(i, u, r) {
      let s;
      i > 0 ? s = i / (this.panesCount - u.length) : s = i / (this.panesCount - r.length), this.panes.forEach((l, f) => {
        if (i > 0 && !u.includes(l.id)) {
          const d = Math.max(Math.min(l.size + s, l.max), l.min), p = d - l.size;
          i -= p, l.size = d;
        } else if (!r.includes(l.id)) {
          const d = Math.max(Math.min(l.size + s, l.max), l.min), p = d - l.size;
          i -= p, l.size = d;
        }
        l.update({
          [this.horizontal ? "height" : "width"]: `${this.indexedPanes[l.id].size}%`
        });
      }), Math.abs(i) > 0.1 && this.$nextTick(() => {
        this.ready && console.warn("Splitpanes: Could not resize panes correctly due to their constraints.");
      });
    }
    /* distributeEmptySpace () {
          let growablePanes = []
          let collapsedPanesCount = 0
          let growableAmount = 0 // Total of how much the current panes can grow to fill blank space.
          let spaceToDistribute = 100 - this.panes.reduce((sum, pane) => (sum += pane.size) && sum, 0)
          // Do a first loop to determine if we can distribute the new blank space between all the
          // expandedPanes, without expanding the collapsed ones.
          this.panes.forEach(pane => {
            if (pane.size < pane.max) growablePanes.push(pane)
    
            if (!pane.size) collapsedPanesCount++
            else growableAmount += pane.max - pane.size
          })
    
          // If the blank space to distribute is too great for the expanded panes, also expand collapsed ones.
          let expandCollapsedPanes = growableAmount < spaceToDistribute
    
          // New space to distribute equally.
          let growablePanesCount = (growablePanes.length - (expandCollapsedPanes ? 0 : collapsedPanesCount))
          let equalSpaceToDistribute = spaceToDistribute / growablePanesCount
          // if (growablePanesCount === 1) equalSpace = 100 / this.panesCount
          let spaceLeftToDistribute = spaceToDistribute
    
          // Now add the equalSpaceToDistribute to each pane size accordingly.
          growablePanes.forEach(pane => {
            if (pane.size < pane.max && (pane.size || (!pane.size && expandCollapsedPanes))) {
              const newSize = Math.min(pane.size + equalSpaceToDistribute, pane.max)
              let allocatedSpace = (newSize - pane.size)
              spaceLeftToDistribute -= allocatedSpace
              pane.size = newSize
              // If the equalSpaceToDistribute is not fully added to the current pane, distribute the remainder
              // to the next panes.
              // Also fix decimal issue due to bites - E.g. calculating 8.33 and getting 8.3299999999999
              if (equalSpaceToDistribute - allocatedSpace > 0.1) equalSpaceToDistribute = spaceLeftToDistribute / (--growablePanesCount)
            }
          })
    
          /* Disabled otherwise will show up on hot reload.
          // if there is still space to allocate show warning message.
          if (this.panesCount && ~~spaceLeftToDistribute) {
            // eslint-disable-next-line no-console
            console.warn('Splitpanes: Could not distribute all the empty space between panes due to their constraints.')
          } *\/
    
          this.$emit('resized', this.panes.map(pane => ({ min: pane.min, max: pane.max, size: pane.size })))
        } */
  },
  watch: {
    panes: {
      // Every time a pane is updated, update the panes accordingly.
      deep: !0,
      immediate: !1,
      handler() {
        this.updatePaneComponents();
      }
    },
    horizontal() {
      this.updatePaneComponents();
    },
    firstSplitter() {
      this.redoSplitters();
    },
    dblClickSplitter(i) {
      [...this.container.querySelectorAll(".splitpanes__splitter")].forEach((u, r) => {
        u.ondblclick = i ? (s) => this.onSplitterDblClick(s, r) : void 0;
      });
    }
  },
  beforeUnmount() {
    this.ready = !1;
  },
  mounted() {
    this.container = this.$refs.container, this.checkSplitpanesNodes(), this.redoSplitters(), this.resetPaneSizes(), this.$emit("ready"), this.ready = !0;
  },
  render() {
    return Zp(
      "div",
      {
        ref: "container",
        class: [
          "splitpanes",
          `splitpanes--${this.horizontal ? "horizontal" : "vertical"}`,
          {
            "splitpanes--dragging": this.touch.dragging
          }
        ]
      },
      this.$slots.default()
    );
  }
}, Nm = (i, u) => {
  const r = i.__vccOpts || i;
  for (const [s, l] of u)
    r[s] = l;
  return r;
}, pm = {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "pane",
  inject: ["requestUpdate", "onPaneAdd", "onPaneRemove", "onPaneClick"],
  props: {
    size: { type: [Number, String], default: null },
    minSize: { type: [Number, String], default: 0 },
    maxSize: { type: [Number, String], default: 100 }
  },
  data: () => ({
    style: {}
  }),
  mounted() {
    this.onPaneAdd(this);
  },
  beforeUnmount() {
    this.onPaneRemove(this);
  },
  methods: {
    // Called from the splitpanes component.
    update(i) {
      this.style = i;
    }
  },
  computed: {
    sizeNumber() {
      return this.size || this.size === 0 ? parseFloat(this.size) : null;
    },
    minSizeNumber() {
      return parseFloat(this.minSize);
    },
    maxSizeNumber() {
      return parseFloat(this.maxSize);
    }
  },
  watch: {
    sizeNumber(i) {
      this.requestUpdate({ target: this, size: i });
    },
    minSizeNumber(i) {
      this.requestUpdate({ target: this, min: i });
    },
    maxSizeNumber(i) {
      this.requestUpdate({ target: this, max: i });
    }
  }
};
function Im(i, u, r, s, l, f) {
  return Y(), Q("div", {
    class: "splitpanes__pane",
    onClick: u[0] || (u[0] = (d) => f.onPaneClick(d, i._.uid)),
    style: zu(i.style)
  }, [
    Zt(i.$slots, "default")
  ], 4);
}
const lc = /* @__PURE__ */ Nm(pm, [["render", Im]]);
const hm = { class: "title" }, Tm = { class: "left-header" }, ym = { class: "leftContent" }, mm = {
  __name: "ProjectPage",
  props: {
    project: {
      type: Object,
      required: !0
    },
    fullscreen: Boolean
  },
  emits: ["resize", "layoutChange"],
  setup(i, { emit: u }) {
    const r = it(!0), s = it(40), l = it(60), f = i, { setProject: d } = rr();
    d(f.project);
    const p = u;
    return (v, g) => (Y(), Qt(Ou, null, {
      default: q(() => [
        i.fullscreen ? oe("", !0) : (Y(), Qt(Su, { key: 0 }, {
          default: q(() => [
            D("span", hm, ht(i.project.title), 1)
          ]),
          _: 1
        })),
        D("main", null, [
          D("div", {
            class: ue(["editor", { fullscreen: i.fullscreen }])
          }, [
            V(G(dm), {
              horizontal: !r.value,
              class: ue({ vertical: r.value, horizontal: !r.value }),
              onResize: g[1] || (g[1] = (I) => p("resize", I))
            }, {
              default: q(() => [
                i.fullscreen ? oe("", !0) : (Y(), Qt(G(lc), {
                  key: 0,
                  class: "left",
                  size: s.value
                }, {
                  default: q(() => [
                    D("div", Tm, [
                      D("button", {
                        onClick: g[0] || (g[0] = (I) => {
                          r.value = !r.value, s.value = 40, l.value = 60, p("layoutChange", r.value);
                        })
                      }, g[2] || (g[2] = [
                        D("img", {
                          src: xc,
                          alt: ""
                        }, null, -1)
                      ]))
                    ]),
                    D("div", ym, [
                      Zt(v.$slots, "left", {}, void 0, !0)
                    ])
                  ]),
                  _: 3
                }, 8, ["size"])),
                V(G(lc), {
                  class: "right",
                  size: "rightSize"
                }, {
                  default: q(() => [
                    Zt(v.$slots, "right", {}, void 0, !0)
                  ]),
                  _: 3
                })
              ]),
              _: 3
            }, 8, ["horizontal", "class"])
          ], 2)
        ])
      ]),
      _: 3
    }));
  }
}, Fz = /* @__PURE__ */ gt(mm, [["__scopeId", "data-v-ddd9a313"]]);
/*! @license DOMPurify 2.5.8 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.5.8/LICENSE */
function On(i) {
  "@babel/helpers - typeof";
  return On = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(u) {
    return typeof u;
  } : function(u) {
    return u && typeof Symbol == "function" && u.constructor === Symbol && u !== Symbol.prototype ? "symbol" : typeof u;
  }, On(i);
}
function fs(i, u) {
  return fs = Object.setPrototypeOf || function(s, l) {
    return s.__proto__ = l, s;
  }, fs(i, u);
}
function zm() {
  if (typeof Reflect == "undefined" || !Reflect.construct || Reflect.construct.sham)
    return !1;
  if (typeof Proxy == "function")
    return !0;
  try {
    return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
    })), !0;
  } catch (i) {
    return !1;
  }
}
function yu(i, u, r) {
  return zm() ? yu = Reflect.construct : yu = function(l, f, d) {
    var p = [null];
    p.push.apply(p, f);
    var v = Function.bind.apply(l, p), g = new v();
    return d && fs(g, d.prototype), g;
  }, yu.apply(null, arguments);
}
function Ze(i) {
  return Am(i) || Dm(i) || jm(i) || vm();
}
function Am(i) {
  if (Array.isArray(i))
    return gs(i);
}
function Dm(i) {
  if (typeof Symbol != "undefined" && i[Symbol.iterator] != null || i["@@iterator"] != null)
    return Array.from(i);
}
function jm(i, u) {
  if (i) {
    if (typeof i == "string")
      return gs(i, u);
    var r = Object.prototype.toString.call(i).slice(8, -1);
    if (r === "Object" && i.constructor && (r = i.constructor.name), r === "Map" || r === "Set")
      return Array.from(i);
    if (r === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))
      return gs(i, u);
  }
}
function gs(i, u) {
  (u == null || u > i.length) && (u = i.length);
  for (var r = 0, s = new Array(u); r < u; r++)
    s[r] = i[r];
  return s;
}
function vm() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
var Lm = Object.hasOwnProperty, cc = Object.setPrototypeOf, _m = Object.isFrozen, Cm = Object.getPrototypeOf, xm = Object.getOwnPropertyDescriptor, se = Object.freeze, Se = Object.seal, wm = Object.create, wc = typeof Reflect != "undefined" && Reflect, ju = wc.apply, ds = wc.construct;
ju || (ju = function(u, r, s) {
  return u.apply(r, s);
});
se || (se = function(u) {
  return u;
});
Se || (Se = function(u) {
  return u;
});
ds || (ds = function(u, r) {
  return yu(u, Ze(r));
});
var Om = Ee(Array.prototype.forEach), Mc = Ee(Array.prototype.pop), Mi = Ee(Array.prototype.push), mu = Ee(String.prototype.toLowerCase), is = Ee(String.prototype.toString), fc = Ee(String.prototype.match), Qe = Ee(String.prototype.replace), Sm = Ee(String.prototype.indexOf), Em = Ee(String.prototype.trim), Ht = Ee(RegExp.prototype.test), us = bm(TypeError);
function Ee(i) {
  return function(u) {
    for (var r = arguments.length, s = new Array(r > 1 ? r - 1 : 0), l = 1; l < r; l++)
      s[l - 1] = arguments[l];
    return ju(i, u, s);
  };
}
function bm(i) {
  return function() {
    for (var u = arguments.length, r = new Array(u), s = 0; s < u; s++)
      r[s] = arguments[s];
    return ds(i, r);
  };
}
function nt(i, u, r) {
  var s;
  r = (s = r) !== null && s !== void 0 ? s : mu, cc && cc(i, null);
  for (var l = u.length; l--; ) {
    var f = u[l];
    if (typeof f == "string") {
      var d = r(f);
      d !== f && (_m(u) || (u[l] = d), f = d);
    }
    i[f] = !0;
  }
  return i;
}
function tr(i) {
  var u = wm(null), r;
  for (r in i)
    ju(Lm, i, [r]) === !0 && (u[r] = i[r]);
  return u;
}
function hu(i, u) {
  for (; i !== null; ) {
    var r = xm(i, u);
    if (r) {
      if (r.get)
        return Ee(r.get);
      if (typeof r.value == "function")
        return Ee(r.value);
    }
    i = Cm(i);
  }
  function s(l) {
    return console.warn("fallback value for", l), null;
  }
  return s;
}
var gc = se(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), os = se(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), ss = se(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Ym = se(["animate", "color-profile", "cursor", "discard", "fedropshadow", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), as = se(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]), Um = se(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), dc = se(["#text"]), Nc = se(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns", "slot"]), ls = se(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), pc = se(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), Tu = se(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), km = Se(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Rm = Se(/<%[\w\W]*|[\w\W]*%>/gm), Pm = Se(/\${[\w\W]*}/gm), Qm = Se(/^data-[\-\w.\u00B7-\uFFFF]+$/), Zm = Se(/^aria-[\-\w]+$/), Gm = Se(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Wm = Se(/^(?:\w+script|data):/i), Fm = Se(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), Bm = Se(/^html$/i), $m = Se(/^[a-z][.\w]*(-[.\w]+)+$/i), Hm = function() {
  return typeof window == "undefined" ? null : window;
}, Vm = function(u, r) {
  if (On(u) !== "object" || typeof u.createPolicy != "function")
    return null;
  var s = null, l = "data-tt-policy-suffix";
  r.currentScript && r.currentScript.hasAttribute(l) && (s = r.currentScript.getAttribute(l));
  var f = "dompurify" + (s ? "#" + s : "");
  try {
    return u.createPolicy(f, {
      createHTML: function(p) {
        return p;
      },
      createScriptURL: function(p) {
        return p;
      }
    });
  } catch (d) {
    return console.warn("TrustedTypes policy " + f + " could not be created."), null;
  }
};
function Oc() {
  var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Hm(), u = function(y) {
    return Oc(y);
  };
  if (u.version = "2.5.8", u.removed = [], !i || !i.document || i.document.nodeType !== 9)
    return u.isSupported = !1, u;
  var r = i.document, s = i.document, l = i.DocumentFragment, f = i.HTMLTemplateElement, d = i.Node, p = i.Element, v = i.NodeFilter, g = i.NamedNodeMap, I = g === void 0 ? i.NamedNodeMap || i.MozNamedAttrMap : g, T = i.HTMLFormElement, z = i.DOMParser, j = i.trustedTypes, b = p.prototype, R = hu(b, "cloneNode"), _ = hu(b, "nextSibling"), x = hu(b, "childNodes"), K = hu(b, "parentNode");
  if (typeof f == "function") {
    var P = s.createElement("template");
    P.content && P.content.ownerDocument && (s = P.content.ownerDocument);
  }
  var lt = Vm(j, r), mt = lt ? lt.createHTML("") : "", ct = s, dt = ct.implementation, Vt = ct.createNodeIterator, ut = ct.createDocumentFragment, zt = ct.getElementsByTagName, Nn = r.importNode, Yn = {};
  try {
    Yn = tr(s).documentMode ? s.documentMode : {};
  } catch (F) {
  }
  var ae = {};
  u.isSupported = typeof K == "function" && dt && dt.createHTMLDocument !== void 0 && Yn !== 9;
  var ur = km, Yr = Rm, Ur = Pm, qe = Qm, We = Zm, Eu = Wm, Un = Fm, Ae = $m, kr = Gm, Et = null, hi = nt({}, [].concat(Ze(gc), Ze(os), Ze(ss), Ze(as), Ze(dc))), Dt = null, kn = nt({}, [].concat(Ze(Nc), Ze(ls), Ze(pc), Ze(Tu))), Lt = Object.seal(Object.create(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), be = null, tn = null, Ti = !0, pn = !0, Rn = !1, Rr = !0, Gt = !1, en = !0, nn = !1, de = !1, or = !1, In = !1, Fe = !1, Xt = !1, hn = !0, Pn = !1, bu = "user-content-", rn = !0, Qn = !1, De = {}, Ne = null, sr = nt({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]), ar = null, lr = nt({}, ["audio", "video", "img", "source", "image", "track"]), Zn = null, cr = nt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Tn = "http://www.w3.org/1998/Math/MathML", yn = "http://www.w3.org/2000/svg", pe = "http://www.w3.org/1999/xhtml", Be = pe, Pr = !1, Qr = null, Yu = nt({}, [Tn, yn, pe], is), $e, yi = ["application/xhtml+xml", "text/html"], Uu = "text/html", bt, mn = null, ku = s.createElement("form"), Zr = function(y) {
    return y instanceof RegExp || y instanceof Function;
  }, Gr = function(y) {
    mn && mn === y || ((!y || On(y) !== "object") && (y = {}), y = tr(y), $e = // eslint-disable-next-line unicorn/prefer-includes
    yi.indexOf(y.PARSER_MEDIA_TYPE) === -1 ? $e = Uu : $e = y.PARSER_MEDIA_TYPE, bt = $e === "application/xhtml+xml" ? is : mu, Et = "ALLOWED_TAGS" in y ? nt({}, y.ALLOWED_TAGS, bt) : hi, Dt = "ALLOWED_ATTR" in y ? nt({}, y.ALLOWED_ATTR, bt) : kn, Qr = "ALLOWED_NAMESPACES" in y ? nt({}, y.ALLOWED_NAMESPACES, is) : Yu, Zn = "ADD_URI_SAFE_ATTR" in y ? nt(
      tr(cr),
      // eslint-disable-line indent
      y.ADD_URI_SAFE_ATTR,
      // eslint-disable-line indent
      bt
      // eslint-disable-line indent
    ) : cr, ar = "ADD_DATA_URI_TAGS" in y ? nt(
      tr(lr),
      // eslint-disable-line indent
      y.ADD_DATA_URI_TAGS,
      // eslint-disable-line indent
      bt
      // eslint-disable-line indent
    ) : lr, Ne = "FORBID_CONTENTS" in y ? nt({}, y.FORBID_CONTENTS, bt) : sr, be = "FORBID_TAGS" in y ? nt({}, y.FORBID_TAGS, bt) : {}, tn = "FORBID_ATTR" in y ? nt({}, y.FORBID_ATTR, bt) : {}, De = "USE_PROFILES" in y ? y.USE_PROFILES : !1, Ti = y.ALLOW_ARIA_ATTR !== !1, pn = y.ALLOW_DATA_ATTR !== !1, Rn = y.ALLOW_UNKNOWN_PROTOCOLS || !1, Rr = y.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Gt = y.SAFE_FOR_TEMPLATES || !1, en = y.SAFE_FOR_XML !== !1, nn = y.WHOLE_DOCUMENT || !1, In = y.RETURN_DOM || !1, Fe = y.RETURN_DOM_FRAGMENT || !1, Xt = y.RETURN_TRUSTED_TYPE || !1, or = y.FORCE_BODY || !1, hn = y.SANITIZE_DOM !== !1, Pn = y.SANITIZE_NAMED_PROPS || !1, rn = y.KEEP_CONTENT !== !1, Qn = y.IN_PLACE || !1, kr = y.ALLOWED_URI_REGEXP || kr, Be = y.NAMESPACE || pe, Lt = y.CUSTOM_ELEMENT_HANDLING || {}, y.CUSTOM_ELEMENT_HANDLING && Zr(y.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (Lt.tagNameCheck = y.CUSTOM_ELEMENT_HANDLING.tagNameCheck), y.CUSTOM_ELEMENT_HANDLING && Zr(y.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (Lt.attributeNameCheck = y.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), y.CUSTOM_ELEMENT_HANDLING && typeof y.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (Lt.allowCustomizedBuiltInElements = y.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), Gt && (pn = !1), Fe && (In = !0), De && (Et = nt({}, Ze(dc)), Dt = [], De.html === !0 && (nt(Et, gc), nt(Dt, Nc)), De.svg === !0 && (nt(Et, os), nt(Dt, ls), nt(Dt, Tu)), De.svgFilters === !0 && (nt(Et, ss), nt(Dt, ls), nt(Dt, Tu)), De.mathMl === !0 && (nt(Et, as), nt(Dt, pc), nt(Dt, Tu))), y.ADD_TAGS && (Et === hi && (Et = tr(Et)), nt(Et, y.ADD_TAGS, bt)), y.ADD_ATTR && (Dt === kn && (Dt = tr(Dt)), nt(Dt, y.ADD_ATTR, bt)), y.ADD_URI_SAFE_ATTR && nt(Zn, y.ADD_URI_SAFE_ATTR, bt), y.FORBID_CONTENTS && (Ne === sr && (Ne = tr(Ne)), nt(Ne, y.FORBID_CONTENTS, bt)), rn && (Et["#text"] = !0), nn && nt(Et, ["html", "head", "body"]), Et.table && (nt(Et, ["tbody"]), delete be.tbody), se && se(y), mn = y);
  }, mi = nt({}, ["mi", "mo", "mn", "ms", "mtext"]), zi = nt({}, ["annotation-xml"]), Wr = nt({}, ["title", "style", "font", "a", "script"]), Mr = nt({}, os);
  nt(Mr, ss), nt(Mr, Ym);
  var Gn = nt({}, as);
  nt(Gn, Um);
  var Ru = function(y) {
    var E = K(y);
    (!E || !E.tagName) && (E = {
      namespaceURI: Be,
      tagName: "template"
    });
    var U = mu(y.tagName), st = mu(E.tagName);
    return Qr[y.namespaceURI] ? y.namespaceURI === yn ? E.namespaceURI === pe ? U === "svg" : E.namespaceURI === Tn ? U === "svg" && (st === "annotation-xml" || mi[st]) : !!Mr[U] : y.namespaceURI === Tn ? E.namespaceURI === pe ? U === "math" : E.namespaceURI === yn ? U === "math" && zi[st] : !!Gn[U] : y.namespaceURI === pe ? E.namespaceURI === yn && !zi[st] || E.namespaceURI === Tn && !mi[st] ? !1 : !Gn[U] && (Wr[U] || !Mr[U]) : !!($e === "application/xhtml+xml" && Qr[y.namespaceURI]) : !1;
  }, le = function(y) {
    Mi(u.removed, {
      element: y
    });
    try {
      y.parentNode.removeChild(y);
    } catch (E) {
      try {
        y.outerHTML = mt;
      } catch (U) {
        y.remove();
      }
    }
  }, fr = function(y, E) {
    try {
      Mi(u.removed, {
        attribute: E.getAttributeNode(y),
        from: E
      });
    } catch (U) {
      Mi(u.removed, {
        attribute: null,
        from: E
      });
    }
    if (E.removeAttribute(y), y === "is" && !Dt[y])
      if (In || Fe)
        try {
          le(E);
        } catch (U) {
        }
      else
        try {
          E.setAttribute(y, "");
        } catch (U) {
        }
  }, Ai = function(y) {
    var E, U;
    if (or)
      y = "<remove></remove>" + y;
    else {
      var st = fc(y, /^[\r\n\t ]+/);
      U = st && st[0];
    }
    $e === "application/xhtml+xml" && Be === pe && (y = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + y + "</body></html>");
    var Kt = lt ? lt.createHTML(y) : y;
    if (Be === pe)
      try {
        E = new z().parseFromString(Kt, $e);
      } catch (Ut) {
      }
    if (!E || !E.documentElement) {
      E = dt.createDocument(Be, "template", null);
      try {
        E.documentElement.innerHTML = Pr ? mt : Kt;
      } catch (Ut) {
      }
    }
    var Wt = E.body || E.documentElement;
    return y && U && Wt.insertBefore(s.createTextNode(U), Wt.childNodes[0] || null), Be === pe ? zt.call(E, nn ? "html" : "body")[0] : nn ? E.documentElement : Wt;
  }, Di = function(y) {
    return Vt.call(
      y.ownerDocument || y,
      y,
      // eslint-disable-next-line no-bitwise
      v.SHOW_ELEMENT | v.SHOW_COMMENT | v.SHOW_TEXT | v.SHOW_PROCESSING_INSTRUCTION | v.SHOW_CDATA_SECTION,
      null,
      !1
    );
  }, Fr = function(y) {
    return y instanceof T && (typeof y.nodeName != "string" || typeof y.textContent != "string" || typeof y.removeChild != "function" || !(y.attributes instanceof I) || typeof y.removeAttribute != "function" || typeof y.setAttribute != "function" || typeof y.namespaceURI != "string" || typeof y.insertBefore != "function" || typeof y.hasChildNodes != "function");
  }, Wn = function(y) {
    return On(d) === "object" ? y instanceof d : y && On(y) === "object" && typeof y.nodeType == "number" && typeof y.nodeName == "string";
  }, Ye = function(y, E, U) {
    ae[y] && Om(ae[y], function(st) {
      st.call(u, E, U, mn);
    });
  }, Br = function(y) {
    var E;
    if (Ye("beforeSanitizeElements", y, null), Fr(y) || Ht(/[\u0080-\uFFFF]/, y.nodeName))
      return le(y), !0;
    var U = bt(y.nodeName);
    if (Ye("uponSanitizeElement", y, {
      tagName: U,
      allowedTags: Et
    }), y.hasChildNodes() && !Wn(y.firstElementChild) && (!Wn(y.content) || !Wn(y.content.firstElementChild)) && Ht(/<[/\w]/g, y.innerHTML) && Ht(/<[/\w]/g, y.textContent) || U === "select" && Ht(/<template/i, y.innerHTML) || y.nodeType === 7 || en && y.nodeType === 8 && Ht(/<[/\w]/g, y.data))
      return le(y), !0;
    if (!Et[U] || be[U]) {
      if (!be[U] && vi(U) && (Lt.tagNameCheck instanceof RegExp && Ht(Lt.tagNameCheck, U) || Lt.tagNameCheck instanceof Function && Lt.tagNameCheck(U)))
        return !1;
      if (rn && !Ne[U]) {
        var st = K(y) || y.parentNode, Kt = x(y) || y.childNodes;
        if (Kt && st)
          for (var Wt = Kt.length, Ut = Wt - 1; Ut >= 0; --Ut) {
            var He = R(Kt[Ut], !0);
            He.__removalCount = (y.__removalCount || 0) + 1, st.insertBefore(He, _(y));
          }
      }
      return le(y), !0;
    }
    return y instanceof p && !Ru(y) || (U === "noscript" || U === "noembed" || U === "noframes") && Ht(/<\/no(script|embed|frames)/i, y.innerHTML) ? (le(y), !0) : (Gt && y.nodeType === 3 && (E = y.textContent, E = Qe(E, ur, " "), E = Qe(E, Yr, " "), E = Qe(E, Ur, " "), y.textContent !== E && (Mi(u.removed, {
      element: y.cloneNode()
    }), y.textContent = E)), Ye("afterSanitizeElements", y, null), !1);
  }, ji = function(y, E, U) {
    if (hn && (E === "id" || E === "name") && (U in s || U in ku))
      return !1;
    if (!(pn && !tn[E] && Ht(qe, E))) {
      if (!(Ti && Ht(We, E))) {
        if (!Dt[E] || tn[E]) {
          if (
            // First condition does a very basic check if a) it's basically a valid custom element tagname AND
            // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
            !(vi(y) && (Lt.tagNameCheck instanceof RegExp && Ht(Lt.tagNameCheck, y) || Lt.tagNameCheck instanceof Function && Lt.tagNameCheck(y)) && (Lt.attributeNameCheck instanceof RegExp && Ht(Lt.attributeNameCheck, E) || Lt.attributeNameCheck instanceof Function && Lt.attributeNameCheck(E)) || // Alternative, second condition checks if it's an `is`-attribute, AND
            // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
            E === "is" && Lt.allowCustomizedBuiltInElements && (Lt.tagNameCheck instanceof RegExp && Ht(Lt.tagNameCheck, U) || Lt.tagNameCheck instanceof Function && Lt.tagNameCheck(U)))
          )
            return !1;
        } else if (!Zn[E]) {
          if (!Ht(kr, Qe(U, Un, ""))) {
            if (!((E === "src" || E === "xlink:href" || E === "href") && y !== "script" && Sm(U, "data:") === 0 && ar[y])) {
              if (!(Rn && !Ht(Eu, Qe(U, Un, "")))) {
                if (U)
                  return !1;
              }
            }
          }
        }
      }
    }
    return !0;
  }, vi = function(y) {
    return y !== "annotation-xml" && fc(y, Ae);
  }, Li = function(y) {
    var E, U, st, Kt;
    Ye("beforeSanitizeAttributes", y, null);
    var Wt = y.attributes;
    if (!(!Wt || Fr(y))) {
      var Ut = {
        attrName: "",
        attrValue: "",
        keepAttr: !0,
        allowedAttributes: Dt
      };
      for (Kt = Wt.length; Kt--; ) {
        E = Wt[Kt];
        var He = E, Ct = He.name, gr = He.namespaceURI;
        if (U = Ct === "value" ? E.value : Em(E.value), st = bt(Ct), Ut.attrName = st, Ut.attrValue = U, Ut.keepAttr = !0, Ut.forceKeepAttr = void 0, Ye("uponSanitizeAttribute", y, Ut), U = Ut.attrValue, !Ut.forceKeepAttr && (fr(Ct, y), !!Ut.keepAttr)) {
          if (!Rr && Ht(/\/>/i, U)) {
            fr(Ct, y);
            continue;
          }
          Gt && (U = Qe(U, ur, " "), U = Qe(U, Yr, " "), U = Qe(U, Ur, " "));
          var _i = bt(y.nodeName);
          if (ji(_i, st, U)) {
            if (Pn && (st === "id" || st === "name") && (fr(Ct, y), U = bu + U), en && Ht(/((--!?|])>)|<\/(style|title)/i, U)) {
              fr(Ct, y);
              continue;
            }
            if (lt && On(j) === "object" && typeof j.getAttributeType == "function" && !gr)
              switch (j.getAttributeType(_i, st)) {
                case "TrustedHTML": {
                  U = lt.createHTML(U);
                  break;
                }
                case "TrustedScriptURL": {
                  U = lt.createScriptURL(U);
                  break;
                }
              }
            try {
              gr ? y.setAttributeNS(gr, Ct, U) : y.setAttribute(Ct, U), Fr(y) ? le(y) : Mc(u.removed);
            } catch (ms) {
            }
          }
        }
      }
      Ye("afterSanitizeAttributes", y, null);
    }
  }, Pu = function F(y) {
    var E, U = Di(y);
    for (Ye("beforeSanitizeShadowDOM", y, null); E = U.nextNode(); )
      Ye("uponSanitizeShadowNode", E, null), Br(E), Li(E), E.content instanceof l && F(E.content);
    Ye("afterSanitizeShadowDOM", y, null);
  };
  return u.sanitize = function(F) {
    var y = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, E, U, st, Kt, Wt;
    if (Pr = !F, Pr && (F = "<!-->"), typeof F != "string" && !Wn(F))
      if (typeof F.toString == "function") {
        if (F = F.toString(), typeof F != "string")
          throw us("dirty is not a string, aborting");
      } else
        throw us("toString is not a function");
    if (!u.isSupported) {
      if (On(i.toStaticHTML) === "object" || typeof i.toStaticHTML == "function") {
        if (typeof F == "string")
          return i.toStaticHTML(F);
        if (Wn(F))
          return i.toStaticHTML(F.outerHTML);
      }
      return F;
    }
    if (de || Gr(y), u.removed = [], typeof F == "string" && (Qn = !1), Qn) {
      if (F.nodeName) {
        var Ut = bt(F.nodeName);
        if (!Et[Ut] || be[Ut])
          throw us("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (F instanceof d)
      E = Ai("<!---->"), U = E.ownerDocument.importNode(F, !0), U.nodeType === 1 && U.nodeName === "BODY" || U.nodeName === "HTML" ? E = U : E.appendChild(U);
    else {
      if (!In && !Gt && !nn && // eslint-disable-next-line unicorn/prefer-includes
      F.indexOf("<") === -1)
        return lt && Xt ? lt.createHTML(F) : F;
      if (E = Ai(F), !E)
        return In ? null : Xt ? mt : "";
    }
    E && or && le(E.firstChild);
    for (var He = Di(Qn ? F : E); st = He.nextNode(); )
      st.nodeType === 3 && st === Kt || (Br(st), Li(st), st.content instanceof l && Pu(st.content), Kt = st);
    if (Kt = null, Qn)
      return F;
    if (In) {
      if (Fe)
        for (Wt = ut.call(E.ownerDocument); E.firstChild; )
          Wt.appendChild(E.firstChild);
      else
        Wt = E;
      return (Dt.shadowroot || Dt.shadowrootmod) && (Wt = Nn.call(r, Wt, !0)), Wt;
    }
    var Ct = nn ? E.outerHTML : E.innerHTML;
    return nn && Et["!doctype"] && E.ownerDocument && E.ownerDocument.doctype && E.ownerDocument.doctype.name && Ht(Bm, E.ownerDocument.doctype.name) && (Ct = "<!DOCTYPE " + E.ownerDocument.doctype.name + `>
` + Ct), Gt && (Ct = Qe(Ct, ur, " "), Ct = Qe(Ct, Yr, " "), Ct = Qe(Ct, Ur, " ")), lt && Xt ? lt.createHTML(Ct) : Ct;
  }, u.setConfig = function(F) {
    Gr(F), de = !0;
  }, u.clearConfig = function() {
    mn = null, de = !1;
  }, u.isValidAttribute = function(F, y, E) {
    mn || Gr({});
    var U = bt(F), st = bt(y);
    return ji(U, st, E);
  }, u.addHook = function(F, y) {
    typeof y == "function" && (ae[F] = ae[F] || [], Mi(ae[F], y));
  }, u.removeHook = function(F) {
    if (ae[F])
      return Mc(ae[F]);
  }, u.removeHooks = function(F) {
    ae[F] && (ae[F] = []);
  }, u.removeAllHooks = function() {
    ae = {};
  }, u;
}
var Xm = Oc();
const Km = {
  __name: "AnnotationCell",
  props: {
    value: {
      type: String,
      default: ""
    },
    index: {
      type: Number,
      required: !0
    },
    selector: {
      type: [String, Array],
      required: !0
    },
    linkPrefix: {
      type: String,
      default: ""
    }
  },
  emits: ["valueChange"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = !(typeof r.value == "string" && r.value.startsWith("http")), f = Lu(() => {
      const p = Xm.sanitize(r.value);
      return p.startsWith("http") ? `<a href="${r.linkPrefix ? `${r.linkPrefix}${p}` : p}">${p.substring(p.lastIndexOf("/"))}</a>` : p;
    }), d = it(null);
    return Sr(f, () => {
      document.activeElement !== d.value && (d.value.innerHTML = f.value);
    }), (p, v) => v[0] || ($l(-1, !0), (v[0] = D("td", {
      ref_key: "root",
      ref: d,
      contenteditable: l,
      innerHTML: f.value,
      value: f.value,
      class: "noEmpty",
      onInput: (g) => {
        s("valueChange", [g.currentTarget.textContent, i.index, i.selector]);
      }
    }, null, 40, ["innerHTML", "value", "onInput"])).cacheIndex = 0, $l(1), v[0]);
  }
}, Jm = /* @__PURE__ */ gt(Km, [["__scopeId", "data-v-86f1f581"]]);
const qm = {
  __name: "ButtonsGroup",
  props: {
    fullWidth: { type: Boolean, default: !1 }
  },
  setup(i) {
    return (u, r) => (Y(), Q("div", {
      class: ue({ group: !0, "full-width": i.fullWidth })
    }, [
      Zt(u.$slots, "default", {}, void 0, !0)
    ], 2));
  }
}, Bz = /* @__PURE__ */ gt(qm, [["__scopeId", "data-v-20db627e"]]), tz = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjE3OTIiCiAgIGhlaWdodD0iMTc5MiIKICAgdmlld0JveD0iMCAwIDE3OTIgMTc5MiIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImJhcnMuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGUgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczgiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxMzY3IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjkxMiIKICAgICBpZD0ibmFtZWR2aWV3NiIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMC4yNjU1NDczIgogICAgIGlua3NjYXBlOmN4PSIyMDMuNDY5OTEiCiAgICAgaW5rc2NhcGU6Y3k9Ijg5NiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iNCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMjMiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MSIKICAgICBkPSJtIDI1Ny44MjY2Myw1MTQuNDU0NDggcSAwLC0xMS40OTA3OSAyNy4wNjUzOCwtMTkuODg3OSAyNy4wNjUzOCwtOC4zOTcxMSA2NC4xMDIyMywtOC4zOTcxMSBsIDEwOTQuMDExNTYsMCBxIDM3LjAzNjgsMCA2NC4xMDIyLDguMzk3MSAyNy4wNjU0LDguMzk3MTEgMjcuMDY1NCwxOS44ODc5IGwgMCw1Ni41NzAwMSBxIDAsMTEuNDkwNzkgLTI3LjA2NTQsMTkuODg3OSAtMjcuMDY1NCw4LjM5NzExIC02NC4xMDIyLDguMzk3MTEgbCAtMTA5NC4wMTE1NiwwIHEgLTM3LjAzNjg1LDAgLTY0LjEwMjIzLC04LjM5NzExIC0yNy4wNjUzOCwtOC4zOTcxMSAtMjcuMDY1MzgsLTE5Ljg4NzkgbCAwLC01Ni41NzAwMSB6IgogICAgIGlkPSJwYXRoNC01IgogICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiIC8+CiAgPHBhdGgKICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxIgogICAgIGQ9Im0gMjU3LjgyNjYzLDEyMjguNTA3NCBxIDAsLTExLjQ5MDggMjcuMDY1MzgsLTE5Ljg4NzkgMjcuMDY1MzgsLTguMzk3MSA2NC4xMDIyMywtOC4zOTcxIGwgMTA5NC4wMTE1NiwwIHEgMzcuMDM2OCwwIDY0LjEwMjIsOC4zOTcxIDI3LjA2NTQsOC4zOTcxIDI3LjA2NTQsMTkuODg3OSBsIDAsNTYuNTcgcSAwLDExLjQ5MDggLTI3LjA2NTQsMTkuODg3OSAtMjcuMDY1NCw4LjM5NzEgLTY0LjEwMjIsOC4zOTcxIGwgLTEwOTQuMDExNTUsMCBxIC0zNy4wMzY4NCwwIC02NC4xMDIyMywtOC4zOTcxIC0yNy4wNjUzOCwtOC4zOTcxIC0yNy4wNjUzOCwtMTkuODg3OSBsIDAsLTU2LjU3IHoiCiAgICAgaWQ9InBhdGg0LTUtOCIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MSIKICAgICBkPSJtIDI1Ny44MjY2Niw4NzEuNDgwOTkgcSAwLC0xMS40OTA3OSAyNy4wNjUzOCwtMTkuODg3ODkgMjcuMDY1NCwtOC4zOTcxMiA2NC4xMDIyMywtOC4zOTcxMiBsIDEwOTQuMDExNDMsMCBxIDM3LjAzNjcsMCA2NC4xMDIyLDguMzk3MTEgMjcuMDY1NCw4LjM5NzExIDI3LjA2NTQsMTkuODg3ODkgbCAwLDU2LjU3MDAyIHEgMCwxMS40OTA4IC0yNy4wNjU0LDE5Ljg4NzkgLTI3LjA2NTUsOC4zOTcxIC02NC4xMDIyLDguMzk3MSBsIC0xMDk0LjAxMTQyLDAgcSAtMzcuMDM2ODQsMCAtNjQuMTAyMjQsLTguMzk3MSAtMjcuMDY1MzgsLTguMzk3MSAtMjcuMDY1MzgsLTE5Ljg4NzkgbCAwLC01Ni41NzAwMiB6IgogICAgIGlkPSJwYXRoNC01LTciCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KPC9zdmc+Cg==", Sc = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9InRpbWVzLWNpcmNsZS5zdmciCiAgIHdpZHRoPSIxNTM2IgogICBoZWlnaHQ9IjE1MzYiPgogIDxtZXRhZGF0YQogICAgIGlkPSJtZXRhZGF0YTEwIj4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzOCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBncmlkdG9sZXJhbmNlPSIxMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE0MjEiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iOTI3IgogICAgIGlkPSJuYW1lZHZpZXc2IgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBmaXQtbWFyZ2luLXRvcD0iMCIKICAgICBmaXQtbWFyZ2luLWxlZnQ9IjAiCiAgICAgZml0LW1hcmdpbi1yaWdodD0iMCIKICAgICBmaXQtbWFyZ2luLWJvdHRvbT0iMCIKICAgICBpbmtzY2FwZTp6b29tPSIwLjI0OTgzNTc4IgogICAgIGlua3NjYXBlOmN4PSI2MDMuNjk5NjYiCiAgICAgaW5rc2NhcGU6Y3k9IjcxNy41NzkzMiIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMyIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iOTQiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMCIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmcyIiAvPgogIDxjaXJjbGUKICAgICBzdHlsZT0ib3BhY2l0eToxO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6NDkuMjI0MDcxNTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6My4yNzU5MDAxMztzdHJva2Utb3BhY2l0eTowIgogICAgIGlkPSJwYXRoNDE2MyIKICAgICBjeD0iNzcxLjM2ODc3IgogICAgIGN5PSI3NjkuNTgwMDgiCiAgICAgcj0iNzQxLjQ0Mjk5IiAvPgogIDxwYXRoCiAgICAgc3R5bGU9ImZpbGw6IzAwMDAwMDtmaWxsLW9wYWNpdHk6MSIKICAgICBkPSJtIDQ3Ni41NDc5Miw0MjUuOTcxNzEgcSAxMC4wNjYyMywtMTAuMDMxMTUgMzAuODMzODcsLTMuOTAzMTQgMjAuNzY3NjUsNi4xMjggMzkuMTIwMzEsMjQuNTQ0ODQgbCA1NDIuMTA5NCw1NDQuMDA0OTkgcSAxOC4zNTI2LDE4LjQxNjggMjQuNDA4MSwzOS4yMDU3IDYuMDU1NSwyMC43ODg5IC00LjAxMDcsMzAuODIwMSBsIC00OS41NTY4LDQ5LjM4NDEgcSAtMTAuMDY2MiwxMC4wMzExIC0zMC44MzM5LDMuOTAzMSAtMjAuNzY3NiwtNi4xMjggLTM5LjEyMDMsLTI0LjU0NDggTCA0NDcuMzg4NTQsNTQ1LjM4MTYgcSAtMTguMzUyNjYsLTE4LjQxNjg0IC0yNC40MDgxNCwtMzkuMjA1NzQgLTYuMDU1NDgsLTIwLjc4ODkxIDQuMDEwNzUsLTMwLjgyMDA2IGwgNDkuNTU2NzgsLTQ5LjM4NDEgeiIKICAgICBpZD0icGF0aDQiCiAgICAgaW5rc2NhcGU6Y29ubmVjdG9yLWN1cnZhdHVyZT0iMCIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjEiCiAgICAgZD0ibSAxMTEwLjAyODMsNDc2LjU0NzkxIHEgMTAuMDMxMSwxMC4wNjYyMiAzLjkwMzEsMzAuODMzODcgLTYuMTI4LDIwLjc2NzY1IC0yNC41NDQ4LDM5LjEyMDMxIEwgNTQ1LjM4MTU5LDEwODguNjExNSBxIC0xOC40MTY4MywxOC4zNTI2IC0zOS4yMDU3NCwyNC40MDgxIC0yMC43ODg5LDYuMDU1NSAtMzAuODIwMDUsLTQuMDEwNyBsIC00OS4zODQwOSwtNDkuNTU2OCBxIC0xMC4wMzExNSwtMTAuMDY2MiAtMy45MDMxNiwtMzAuODMzOSA2LjEyODAyLC0yMC43Njc2IDI0LjU0NDg1LC0zOS4xMjAzIEwgOTkwLjYxODQxLDQ0Ny4zODg1MyBxIDE4LjQxNjc5LC0xOC4zNTI2NiAzOS4yMDU2OSwtMjQuNDA4MTUgMjAuNzg5LC02LjA1NTQ3IDMwLjgyMDEsNC4wMTA3NiBsIDQ5LjM4NDEsNDkuNTU2NzggeiIKICAgICBpZD0icGF0aDQtNiIKICAgICBpbmtzY2FwZTpjb25uZWN0b3ItY3VydmF0dXJlPSIwIiAvPgo8L3N2Zz4K", ez = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgd2lkdGg9IjE3OTIiCiAgIGhlaWdodD0iMTc5MiIKICAgdmlld0JveD0iMCAwIDE3OTIgMTc5MiIKICAgaWQ9InN2ZzIiCiAgIHZlcnNpb249IjEuMSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMC45MSByMTM3MjUiCiAgIHNvZGlwb2RpOmRvY25hbWU9ImNhcmV0LXNxdWFyZS1vLWxlZnQuc3ZnIj4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGExMCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgogICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcHVybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgICA8ZGM6dGl0bGU+PC9kYzp0aXRsZT4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBpZD0iZGVmczgiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxNzg1IgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwODIiCiAgICAgaWQ9Im5hbWVkdmlldzYiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb209IjAuMzc4MTEyNzkiCiAgICAgaW5rc2NhcGU6Y3g9IjEyMTEuMDgzNSIKICAgICBpbmtzY2FwZTpjeT0iOTIyLjE5MzY0IgogICAgIGlua3NjYXBlOndpbmRvdy14PSI0IgogICAgIGlua3NjYXBlOndpbmRvdy15PSI0NiIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzIiIC8+CiAgPGcKICAgICBpZD0iZzQyMTAiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC45MzgwMTQ1MywwLDAsMC44NzI1ODU0Miw1NS41Mzg5ODEsMTE0LjE2MzQ2KSI+CiAgICA8cGF0aAogICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3NzcyIKICAgICAgIGlua3NjYXBlOmNvbm5lY3Rvci1jdXJ2YXR1cmU9IjAiCiAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxIgogICAgICAgaWQ9InBhdGg0IgogICAgICAgZD0ibSAxNTIxLjQ5OTQsMTUxNi40MTI5IC0zLjgzNDIsLTEyNDUuNzk0MjkgYyAtMC4wMjcsLTguNjY2NjMgLTMuMTY2NywtMTYuMTY2NjcgLTkuNSwtMjIuNSAtNi4zMzMzLC02LjMzMzMzIC0xMy44MzM0LC05LjQ3NjE4IC0yMi41LC05LjUgbCAtODAyLjkyMTQyLC0yLjIwNzA4IGMgLTguNjY2NjMsLTAuMDIzOCAtMTguMDU5NTcsMS43Mjc1MyAtMjQuMzkyOSw4LjA2MDg2IC02LjMzMzMzLDYuMzMzMzMgLTcuNTgwNzYsNC4yMDAxMyAtNy42MDcxLDIzLjkzOTE0IGwgLTEuNjY2LDEyNDguNzc1ODcgYyAtMC4wMTE2LDguNjY2OCAzLjE2NjY3LDE2LjE2NjcgOS41LDIyLjUgNi4zMzMzMyw2LjMzMzMgMTMuODMzMzIsOS41MDgzIDIyLjUsOS41IGwgODA4LjQyMTYyLC0wLjc3NDUgYyA4LjY2NjYsLTAuMDEgMTYuMTY2NywtMy4xNjY3IDIyLjUsLTkuNSA2LjMzMzMsLTYuMzMzMyA5LjUyNjcsLTEzLjgzMzQgOS41LC0yMi41IHogTSAxNjY0LDQxNiBsIDAsOTYwIGMgMCw3OS4zMzMzIC0yOC4xNjY3LDE0Ny4xNjY3IC04NC41LDIwMy41IC01Ni4zMzMzLDU2LjMzMzMgLTEyNC4xNjY3LDg0LjUgLTIwMy41LDg0LjUgbCAtOTYwLDAgYyAtNzkuMzMzMzMsMCAtMTQ3LjE2NjY3LC0yOC4xNjY3IC0yMDMuNSwtODQuNSBDIDE1Ni4xNjY2NywxNTIzLjE2NjcgMTI4LDE0NTUuMzMzMyAxMjgsMTM3NiBsIDAsLTk2MCBDIDEyOCwzMzYuNjY2NjcgMTU2LjE2NjY3LDI2OC44MzMzMyAyMTIuNSwyMTIuNSAyNjguODMzMzMsMTU2LjE2NjY3IDMzNi42NjY2NywxMjggNDE2LDEyOCBsIDk2MCwwIGMgNzkuMzMzMywwIDE0Ny4xNjY3LDI4LjE2NjY3IDIwMy41LDg0LjUgNTYuMzMzMyw1Ni4zMzMzMyA4NC41LDEyNC4xNjY2NyA4NC41LDIwMy41IHoiIC8+CiAgPC9nPgo8L3N2Zz4K";
const nz = { class: "content-wrapper" }, rz = { class: "palette" }, iz = { class: "title" }, uz = { class: "content" }, xr = 5, oz = {
  __name: "Editor",
  props: {
    title: { type: String, default: "" },
    toolsMinHeight: { type: String, default: null }
  },
  setup(i) {
    const u = it(!1), r = it(!1), s = it(null), l = it({ top: 0, left: 0 }), f = it({ left: 0, top: 0 }), d = it(!0), p = it("275px"), v = it("275px"), g = it({}), I = it(null), T = it({ width: 0, height: 0 }), z = it(!1), j = (ut) => {
      const zt = s.value.getBoundingClientRect();
      f.value = {
        left: ut.clientX - zt.left,
        top: ut.clientY - zt.top
      }, u.value = !0;
    }, b = (ut) => {
      ut.touches.length === 1 && (j(ut.touches[0]), ut.preventDefault());
    }, R = () => {
      u.value = !1;
    }, _ = () => {
      u.value = !1, r.value = !1, g.value = I.value.querySelector(".tools").getBoundingClientRect();
    }, x = (ut) => {
      r.value = !0, g.value = I.value.querySelector(".tools").getBoundingClientRect(), ut.preventDefault();
    }, K = (ut) => {
      ut.touches.length === 1 && (x(ut), ut.preventDefault());
    }, P = () => {
      u.value = !1, l.value = { left: 0, top: 0 };
    }, lt = () => {
      u.value = !1, l.value = { left: 1 / 0, top: 0 };
    }, mt = () => {
      d.value = !1, parseInt(l.value.left) > T.value.width / 2 - g.value.width / 2 ? lt() : P();
    }, ct = Lu(() => {
      const ut = Math.max(
        xr,
        Math.min(
          T.value.width - g.value.width - xr,
          l.value.left
        )
      ), zt = Math.max(
        xr,
        Math.min(
          T.value.height - g.value.height - xr,
          l.value.top
        )
      );
      return {
        left: `${ut}px`,
        top: `${zt}px`
      };
    }), dt = (ut) => {
      if (u.value) {
        T.value = I.value.getBoundingClientRect();
        const zt = Math.min(
          T.value.width - g.value.width - xr,
          ut.clientX - T.value.left - f.value.left
        ), Nn = Math.min(
          T.value.height - g.value.height - xr,
          ut.clientY - T.value.top - f.value.top
        );
        return l.value = { left: zt, top: Nn }, !0;
      }
      if (r.value) {
        const zt = g.value.left + g.value.width, Nn = g.value.top + g.value.height, Yn = ut.clientX - zt, ae = ut.clientY - Nn;
        return p.value = parseInt(g.value.width + Yn) + "px", v.value = parseInt(g.value.height + ae) + "px", z.value = g.value.width + Yn > 520, !0;
      }
      return !1;
    }, Vt = (ut) => {
      if (ut.touches) {
        if (ut.touches.length !== 1)
          return;
        dt(ut.touches[0]) && ut.preventDefault();
      }
    };
    return Er(() => {
      document.addEventListener("mousemove", dt), document.addEventListener("touchmove", Vt, { passive: !1 }), document.addEventListener("mouseup", _), P(), requestAnimationFrame(() => {
        g.value = I.value.querySelector(".tools").getBoundingClientRect(), v.value = g.value.top + g.value.height;
      }), new ResizeObserver(() => {
        requestAnimationFrame(() => {
          var zt;
          T.value = (zt = I.value) == null ? void 0 : zt.getBoundingClientRect();
        });
      }).observe(I.value), T.value = I.value.getBoundingClientRect();
    }), Is(() => {
      document.removeEventListener("touchmove", Vt), document.removeEventListener("mousemove", dt), document.removeEventListener("mouseup", _);
    }), (ut, zt) => (Y(), Q("div", {
      class: "area",
      ref_key: "area",
      ref: I
    }, [
      D("div", nz, [
        Zt(ut.$slots, "content", {}, void 0, !0)
      ]),
      D("div", {
        ref_key: "tools",
        ref: s,
        class: "tools",
        style: zu(St({}, ct.value))
      }, [
        bn(D("button", {
          class: "show-tools",
          onClick: zt[0] || (zt[0] = (Nn) => d.value = !0)
        }, zt[1] || (zt[1] = [
          D("img", {
            src: tz,
            alt: "show tools"
          }, null, -1)
        ]), 512), [
          [gi, !d.value]
        ]),
        bn(D("div", {
          class: ue(["resizable", { "resizable--two-cols": z.value }]),
          style: zu({ width: p.value, height: v.value, minHeight: i.toolsMinHeight || "fit-content" })
        }, [
          D("div", {
            class: "resizable-handle",
            onMousedown: x,
            onTouchstart: K,
            onTouchend: _
          }, null, 32),
          D("div", rz, [
            D("div", {
              class: "header",
              onMousedown: j,
              onTouchstart: b,
              onTouchend: R
            }, [
              D("button", {
                class: "toggle",
                onClick: mt,
                onTouchstart: wr(mt, ["stop"])
              }, zt[2] || (zt[2] = [
                D("img", {
                  src: Sc,
                  alt: "hide tools"
                }, null, -1)
              ]), 32),
              D("span", iz, ht(i.title), 1),
              D("button", {
                class: "left",
                onMousedown: wr(P, ["stop"]),
                onTouchstart: wr(P, ["stop"])
              }, zt[3] || (zt[3] = [
                D("img", {
                  src: ez,
                  alt: "place tools left"
                }, null, -1)
              ]), 32),
              D("button", {
                class: "right",
                onMousedown: wr(lt, ["stop"]),
                onTouchstart: wr(lt, ["stop"])
              }, zt[4] || (zt[4] = [
                D("img", {
                  src: xc,
                  alt: "place tools right"
                }, null, -1)
              ]), 32)
            ], 32),
            D("div", uz, [
              Zt(ut.$slots, "tools", {}, void 0, !0)
            ])
          ])
        ], 6), [
          [gi, d.value]
        ])
      ], 4)
    ], 512));
  }
}, $z = /* @__PURE__ */ gt(oz, [["__scopeId", "data-v-077f5783"]]);
const sz = { class: "range-slider" }, az = ["max", "value"], lz = {
  __name: "RangeSlider",
  props: {
    max: {
      type: Number,
      required: !0
    },
    modelValue: {
      type: Number,
      default: 0
    },
    displayButtons: {
      type: Boolean,
      default: !0
    }
  },
  emits: ["update:modelValue"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = Lu({
      get: () => r.modelValue,
      set: (v) => s("update:modelValue", v)
    }), f = (v) => {
      l.value = parseInt(v.target.value);
    }, d = () => {
      const v = (l.value || r.modelValue) + 1;
      l.value = Math.min(v, r.max);
    }, p = () => {
      const v = (l.value || r.modelValue) - 1;
      l.value = Math.max(v, 0);
    };
    return (v, g) => (Y(), Q("div", sz, [
      i.displayButtons ? (Y(), Qt(Yt, {
        key: 0,
        small: "",
        onClick: p
      }, {
        default: q(() => g[0] || (g[0] = [
          yt(" - ")
        ])),
        _: 1
      })) : oe("", !0),
      D("input", {
        type: "range",
        min: "0",
        max: i.max,
        value: l.value,
        step: "1",
        onInput: f
      }, null, 40, az),
      i.displayButtons ? (Y(), Qt(Yt, {
        key: 1,
        small: "",
        onClick: d
      }, {
        default: q(() => g[1] || (g[1] = [
          yt(" + ")
        ])),
        _: 1
      })) : oe("", !0)
    ]));
  }
}, cs = /* @__PURE__ */ gt(lz, [["__scopeId", "data-v-f57d2e12"]]);
const cz = {
  __name: "Row",
  props: {
    centered: Boolean
  },
  setup(i) {
    const r = { centered: i.centered === !0 };
    return (s, l) => (Y(), Q("div", {
      class: ue(["row", r])
    }, [
      Zt(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Hz = /* @__PURE__ */ gt(cz, [["__scopeId", "data-v-167de82f"]]);
const Mz = {}, fz = { class: "col" };
function gz(i, u) {
  return Y(), Q("div", fz, [
    Zt(i.$slots, "default", {}, void 0, !0)
  ]);
}
const Vz = /* @__PURE__ */ gt(Mz, [["render", gz], ["__scopeId", "data-v-bb84c296"]]);
const dz = ["onClick"], Nz = {
  __name: "TextAnnotations",
  props: /* @__PURE__ */ En({
    files: {
      type: Object,
      required: !0
    },
    extractKeys: {
      type: Function,
      required: !0
    },
    linkPrefix: {
      type: String,
      default: ""
    },
    selected: {
      type: Number,
      default: 0
    }
  }, {
    selectedIndex: {
      type: Number,
      default: null
    },
    selectedIndexModifiers: {}
  }),
  emits: /* @__PURE__ */ En(["valueChange", "selectFile"], ["update:selectedIndex"]),
  setup(i, { emit: u }) {
    const r = i, s = er(i, "selectedIndex"), l = u, f = it(r.extractKeys(r.files));
    return Sr(r, () => {
      f.value = r.extractKeys(r.files);
    }), (d, p) => (Y(), Qt(Ii, { id: "annotations" }, {
      default: q(() => [
        D("thead", null, [
          D("tr", null, [
            (Y(!0), Q(Pt, null, ee(f.value, ([v]) => (Y(), Q("th", { key: v }, ht(v), 1))), 128))
          ])
        ]),
        D("tbody", null, [
          (Y(!0), Q(Pt, null, ee(i.files, (v, g) => (Y(), Q("tr", {
            class: ue({ selected: g === s.value }),
            onClick: (I) => {
              l("selectFile", v), s.value = g;
            },
            key: `file_${g}`
          }, [
            (Y(!0), Q(Pt, null, ee(f.value, ([I, T]) => (Y(), Qt(Jm, {
              key: `${I}_${g}`,
              value: G(zc)(v, T),
              selector: T,
              index: g,
              "link-prefix": i.linkPrefix,
              onValueChange: p[0] || (p[0] = (z) => l("valueChange", ...z))
            }, null, 8, ["value", "selector", "index", "link-prefix"]))), 128))
          ], 10, dz))), 128))
        ])
      ]),
      _: 1
    }));
  }
}, Xz = /* @__PURE__ */ gt(Nz, [["__scopeId", "data-v-d9684222"]]);
const pz = ["onClick"], Iz = {
  __name: "VolumeAnnotations",
  props: {
    annotations: {
      type: Array,
      required: !0
    },
    extractKeys: {
      type: Function,
      required: !1
    }
  },
  emits: ["selectAnnotation"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = it(r.extractKeys(r.annotations)), f = it(0);
    return Sr(r, () => {
      l.value = r.extractKeys(r.annotations), f.value = 0;
    }), (d, p) => (Y(), Qt(Ii, { id: "volAnnotations" }, {
      default: q(() => [
        D("thead", null, [
          D("tr", null, [
            (Y(!0), Q(Pt, null, ee(l.value, ([v]) => (Y(), Q("th", { key: v }, ht(v), 1))), 128))
          ])
        ]),
        D("tbody", null, [
          (Y(!0), Q(Pt, null, ee(i.annotations, (v, g) => (Y(), Q("tr", {
            class: ue({ selected: g === f.value }),
            onClick: (I) => {
              s("selectAnnotation", v), f.value = g;
            },
            key: `annotation_${g}`
          }, [
            (Y(!0), Q(Pt, null, ee(l.value, ([I, T]) => (Y(), Q("td", {
              key: `${I}_${g}`
            }, ht(G(zc)(v, T)), 1))), 128))
          ], 10, pz))), 128))
        ])
      ]),
      _: 1
    }));
  }
}, Kz = /* @__PURE__ */ gt(Iz, [["__scopeId", "data-v-ead05540"]]);
const hz = { id: "labels-name" }, Tz = { class: "label-list" }, yz = ["onClick"], mz = { class: "label-name" }, zz = { key: 0 }, Az = {
  __name: "OntologySelector",
  props: /* @__PURE__ */ En({
    ontology: {
      type: Object,
      required: !1,
      default: null
    },
    open: Boolean
  }, {
    opacity: { type: Number, default: null },
    opacityModifiers: {}
  }),
  emits: /* @__PURE__ */ En(["labelClick", "onClose"], ["update:opacity"]),
  setup(i, { emit: u }) {
    const r = u, s = er(i, "opacity"), l = it(!1), f = it(null), d = it({ x: 0, y: 0 }), p = (I) => {
      l.value = !0;
      const { top: T, left: z, width: j, height: b } = f.value.getBoundingClientRect();
      d.value.x = I.clientX - z - j / 2, d.value.y = I.clientY - T - b / 2;
    }, v = () => {
      l.value = !1;
    }, g = (I) => {
      l.value && (f.value.style.left = I.clientX - d.value.x + "px", f.value.style.top = I.clientY - d.value.y + "px");
    };
    return Er(() => {
      document.addEventListener("mousemove", g);
    }), Is(() => {
      document.removeEventListener("mousemove", g);
    }), (I, T) => i.ontology != null && i.open ? (Y(), Q("div", {
      key: 0,
      class: "labelset",
      ref_key: "labelsetRef",
      ref: f,
      onMouseup: v
    }, [
      D("div", {
        class: "header",
        onMousedown: p
      }, [
        D("img", {
          class: "close",
          alt: "close",
          src: Sc,
          onClick: T[0] || (T[0] = (z) => r("onClose"))
        })
      ], 32),
      T[4] || (T[4] = D("h3", null, "Label Set", -1)),
      D("span", hz, ht(i.ontology.name), 1),
      T[5] || (T[5] = D("h3", null, "Labels", -1)),
      D("ul", Tz, [
        (Y(!0), Q(Pt, null, ee(i.ontology.labels, (z, j) => (Y(), Q("li", {
          key: z.name,
          onClick: (b) => r("labelClick", j)
        }, [
          D("div", {
            class: "label-color",
            style: zu(`background-color: rgb(${z.color[0]}, ${z.color[1]}, ${z.color[2]});`)
          }, null, 4),
          D("span", mz, ht(z.name), 1)
        ], 8, yz))), 128))
      ]),
      s.value !== null ? (Y(), Q("div", zz, [
        T[2] || (T[2] = D("b", null, "Opacity", -1)),
        T[3] || (T[3] = D("br", null, null, -1)),
        bn(D("input", {
          id: "labels-opacity",
          type: "range",
          min: "0",
          max: "1",
          step: "0.01",
          "onUpdate:modelValue": T[1] || (T[1] = (z) => s.value = z)
        }, null, 512), [
          [
            ps,
            s.value,
            void 0,
            { number: !0 }
          ]
        ])
      ])) : oe("", !0)
    ], 544)) : oe("", !0);
  }
}, Jz = /* @__PURE__ */ gt(Az, [["__scopeId", "data-v-b8ea1a9a"]]);
const Dz = { class: "chat" }, jz = { class: "overlay" }, vz = { class: "notifications" }, Lz = ["innerHTML"], _z = {
  __name: "Chat",
  props: {
    notification: {
      type: String,
      default: ""
    },
    receivedMessages: {
      type: Array,
      default: () => []
    }
  },
  emits: ["sendMessage"],
  setup(i, { emit: u }) {
    const r = i, s = u, l = it(null);
    Sr(r.receivedMessages, () => {
      setTimeout(() => {
        l.value.scrollTop = l.value.scrollHeight;
      }, 100);
    });
    const f = (d) => {
      s("sendMessage", d.target.value), d.target.value = "";
    };
    return (d, p) => (Y(), Q("div", Dz, [
      D("div", jz, [
        D("div", vz, ht(i.notification), 1),
        D("ul", {
          class: "messages",
          ref_key: "messagesRef",
          ref: l
        }, [
          (Y(!0), Q(Pt, null, ee(i.receivedMessages, (v, g) => (Y(), Q("li", { key: g }, [
            D("span", { innerHTML: v }, null, 8, Lz)
          ]))), 128))
        ], 512),
        D("input", {
          type: "text",
          onKeyup: Sn(f, ["enter"])
        }, null, 32)
      ])
    ]));
  }
}, qz = /* @__PURE__ */ gt(_z, [["__scopeId", "data-v-9173539f"]]), Cz = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE1MzYiIHdpZHRoPSIxNTM2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48bGluZWFyR3JhZGllbnQgaWQ9ImEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoLjg3MDcxMjEgMCAwIC44NzQyMTU5OCAtMTQ0My4wOTc5IC0xNDQzLjk0MTMpIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9Ii01OTkuNDQ3ODEiIHgyPSIxMTcxLjU0NTIiIHkxPSI3NTcuMDAxODMiIHkyPSI3NjIuODM3NjUiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0iI2ZmZiIvPjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI2ZmZiIgc3RvcC1vcGFjaXR5PSIwIi8+PC9saW5lYXJHcmFkaWVudD48ZWxsaXBzZSBjeD0iLTc3Mi42NjcxMSIgY3k9Ii03NjkuMDI1NyIgcng9IjY1NC43NDgyOSIgcnk9IjY1Ny4zODMwNiIgc3R5bGU9InN0cm9rZTojZmZmO3N0cm9rZS13aWR0aDo5MC43NDg7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1kYXNob2Zmc2V0OjMuMjc1OTtmaWxsOnVybCgjYSkiIHRyYW5zZm9ybT0ic2NhbGUoLTEpIi8+PC9zdmc+", xz = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiIHdpZHRoPSIxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im0xNDcyIDg5NnEwLTExNy00NS41LTIyMy41dC0xMjMtMTg0LTE4NC0xMjMtMjIzLjUtNDUuNS0yMjMuNSA0NS41LTE4NCAxMjMtMTIzIDE4NC00NS41IDIyMy41IDQ1LjUgMjIzLjUgMTIzIDE4NCAxODQgMTIzIDIyMy41IDQ1LjUgMjIzLjUtNDUuNSAxODQtMTIzIDEyMy0xODQgNDUuNS0yMjMuNXptMjc2IDI3N3EtNCAxNS0yMCAyMGwtMjkyIDk2djMwNnEwIDE2LTEzIDI2LTE1IDEwLTI5IDRsLTI5Mi05NC0xODAgMjQ4cS0xMCAxMy0yNiAxM3QtMjYtMTNsLTE4MC0yNDgtMjkyIDk0cS0xNCA2LTI5LTQtMTMtMTAtMTMtMjZ2LTMwNmwtMjkyLTk2cS0xNi01LTIwLTIwLTUtMTcgNC0yOWwxODAtMjQ4LTE4MC0yNDhxLTktMTMtNC0yOSA0LTE1IDIwLTIwbDI5Mi05NnYtMzA2cTAtMTYgMTMtMjYgMTUtMTAgMjktNGwyOTIgOTQgMTgwLTI0OHE5LTEyIDI2LTEydDI2IDEybDE4MCAyNDggMjkyLTk0cTE0LTYgMjkgNCAxMyAxMCAxMyAyNnYzMDZsMjkyIDk2cTE2IDUgMjAgMjAgNSAxNi00IDI5bC0xODAgMjQ4IDE4MCAyNDhxOSAxMiA0IDI5eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==", wz = "data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9IjE3OTIiIHZpZXdCb3g9IjAgMCAxNzkyIDE3OTIiIHdpZHRoPSIxNzkyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Im05MDQuMzU0NzIgMTUyOC4yNzczLTcuODc2OS0xMjYxLjA5Mzk2Yy0xNDguNzk0OTggMC0yMjcuNjczNTEgMjcuMDI1MTgtMzI0LjAwMTk2IDgzLjE4Mzk5LTk1LjAwNzI0IDU1LjM4ODU1LTE3NC4yNjE4OCAxNDIuMTg0NjctMjI4LjgzMTg4IDIzNy42NjQ0Mi00Ny4wNzYzMyA4Mi4zNjgyNi03NC4wNjU4OCAxNzkuMzExNjktNzYuNDYwNjUgMjc0LjE1MzU0LTIuODQwMDYgMTEyLjQ3NjgyIDIxLjI2MDMzIDIyOS45ODczMSA3NC4xNTM1NSAzMjkuMjkxOTEgNTMuMDk1NDcgOTkuNjg0MyAxMzUuOTMyMiAxODguMDkyNCAyMzIuNzcwMzQgMjQ2LjIxNyA5Ny44NzE3NyA1OC43NDUgMjMxLjU4MDgzIDkwLjU4MzEgMzMwLjI0NzUgOTAuNTgzMXptNzU5LjY0NTI4LTYzMi4yNzczYzAgMTM5LjMzMzMtMzQuMzMzMyAyNjcuODMzMy0xMDMgMzg1LjVzLTE2MS44MzMzIDIxMC44MzMzLTI3OS41IDI3OS41LTI0Ni4xNjY3IDEwMy0zODUuNSAxMDNjLTEzOS4zMzMzMyAwLTI2Ny44MzMzMy0zNC4zMzMzLTM4NS41LTEwM3MtMjEwLjgzMzMzLTE2MS44MzMzLTI3OS41LTI3OS41LTEwMy0yNDYuMTY2Ny0xMDMtMzg1LjVjMC0xMzkuMzMzMzMgMzQuMzMzMzMtMjY3LjgzMzMzIDEwMy0zODUuNXMxNjEuODMzMzMtMjEwLjgzMzMzIDI3OS41LTI3OS41IDI0Ni4xNjY2Ny0xMDMgMzg1LjUtMTAzYzEzOS4zMzMzIDAgMjY3LjgzMzMgMzQuMzMzMzMgMzg1LjUgMTAzczIxMC44MzMzIDE2MS44MzMzMyAyNzkuNSAyNzkuNSAxMDMgMjQ2LjE2NjY3IDEwMyAzODUuNXoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=";
const Oz = { class: "adjust-settings" }, Sz = { class: "setting" }, Ez = { class: "setting" }, bz = { class: "setting" }, Yz = {
  __name: "AdjustSettings",
  props: {
    alpha: { type: Number, default: 0 },
    alphaModifiers: {},
    brightness: { type: Number, default: 0 },
    brightnessModifiers: {},
    contrast: { type: Number, default: 0 },
    contrastModifiers: {}
  },
  emits: ["update:alpha", "update:brightness", "update:contrast"],
  setup(i) {
    const u = er(i, "alpha"), r = er(i, "brightness"), s = er(i, "contrast");
    return (l, f) => (Y(), Q("div", Oz, [
      D("div", Sz, [
        f[3] || (f[3] = D("img", {
          src: Cz,
          class: "icon"
        }, null, -1)),
        V(cs, {
          max: 100,
          modelValue: u.value,
          "onUpdate:modelValue": f[0] || (f[0] = (d) => u.value = d),
          "display-buttons": !1
        }, null, 8, ["modelValue"])
      ]),
      D("div", Ez, [
        f[4] || (f[4] = D("img", {
          src: xz,
          class: "icon"
        }, null, -1)),
        V(cs, {
          max: 100,
          modelValue: r.value,
          "onUpdate:modelValue": f[1] || (f[1] = (d) => r.value = d),
          "display-buttons": !1
        }, null, 8, ["modelValue"])
      ]),
      D("div", bz, [
        f[5] || (f[5] = D("img", {
          src: wz,
          class: "icon"
        }, null, -1)),
        V(cs, {
          max: 100,
          modelValue: s.value,
          "onUpdate:modelValue": f[2] || (f[2] = (d) => s.value = d),
          "display-buttons": !1
        }, null, 8, ["modelValue"])
      ])
    ]));
  }
}, tA = /* @__PURE__ */ gt(Yz, [["__scopeId", "data-v-a300c20a"]]);
const Uz = { id: "logScript" }, eA = {
  __name: "ScriptConsole",
  setup(i) {
    const u = (r) => new Promise((s, l) => {
      if (document.querySelector(`script[src="${r}"]`) !== null) {
        s();
        return;
      }
      const f = document.createElement("script");
      f.src = r, f.onload = s, f.onerror = l, document.body.appendChild(f);
    });
    return Er(() => Je(this, null, function* () {
      yield Promise.all([
        u("https://unpkg.com/codeflask/build/codeflask.min.js"),
        u("https://cdn.jsdelivr.net/gh/r03ert0/consolita.js@v0.1.1/consolita.js")
      ]), window.Consolita.init("#logScript");
    })), (r, s) => (Y(), Q("div", Uz));
  }
};
export {
  es as Access,
  tA as AdjustSettings,
  Jm as AnnotationCell,
  bI as Annotations,
  Xp as Autocomplete,
  Yt as Button,
  Bz as ButtonsGroup,
  qz as Chat,
  sI as Checkbox,
  Vz as Col,
  ET as Collaborators,
  $z as Editor,
  GT as Files,
  ys as Footer,
  Su as Header,
  TI as ImportFilesDialog,
  Vy as Nav,
  Wz as NewProjectPage,
  Jz as OntologySelector,
  jy as ProjectInfo,
  Fz as ProjectPage,
  wI as PureAnnotations,
  OT as PureCollaborators,
  ZT as PureFiles,
  cs as RangeSlider,
  Hz as Row,
  eA as ScriptConsole,
  Hl as Select,
  _y as Settings,
  Zz as SettingsPage,
  Qz as Tab,
  Ii as Table,
  Pz as Tabs,
  Xz as TextAnnotations,
  nI as TextArea,
  pi as TextInput,
  Gz as UserPage,
  Kz as VolumeAnnotations,
  Ou as Wrapper
};
