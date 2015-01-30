(function(g) {
  var __bem_xjst = function(exports) {
     var $$mode = "", $$block = "", $$elem = "", $$elemMods = null, $$mods = null;

var __$ref = {};

function apply(ctx) {
    ctx = ctx || this;
    $$mods = ctx["mods"];
    $$elemMods = ctx["elemMods"];
    $$elem = ctx["elem"];
    $$block = ctx["block"];
    $$mode = ctx["_mode"];
    try {
        return applyc(ctx, __$ref);
    } catch (e) {
        e.xjstContext = ctx;
        throw e;
    }
}

exports.apply = apply;

function applyc(__$ctx, __$ref) {
    var cache;
    var __$r = __$g0(__$ctx, __$ref);
    if (__$r !== __$ref) return __$r;
}

[ function(exports, context) {
    var undef, BEM_ = {}, toString = Object.prototype.toString, slice = Array.prototype.slice, isArray = Array.isArray || function(obj) {
        return toString.call(obj) === "[object Array]";
    }, SHORT_TAGS = {
        area: 1,
        base: 1,
        br: 1,
        col: 1,
        command: 1,
        embed: 1,
        hr: 1,
        img: 1,
        input: 1,
        keygen: 1,
        link: 1,
        meta: 1,
        param: 1,
        source: 1,
        wbr: 1
    };
    (function(BEM, undefined) {
        var MOD_DELIM = "_", ELEM_DELIM = "__", NAME_PATTERN = "[a-zA-Z0-9-]+";
        function buildModPostfix(modName, modVal) {
            var res = MOD_DELIM + modName;
            if (modVal !== true) res += MOD_DELIM + modVal;
            return res;
        }
        function buildBlockClass(name, modName, modVal) {
            var res = name;
            if (modVal) res += buildModPostfix(modName, modVal);
            return res;
        }
        function buildElemClass(block, name, modName, modVal) {
            var res = buildBlockClass(block) + ELEM_DELIM + name;
            if (modVal) res += buildModPostfix(modName, modVal);
            return res;
        }
        BEM.INTERNAL = {
            NAME_PATTERN: NAME_PATTERN,
            MOD_DELIM: MOD_DELIM,
            ELEM_DELIM: ELEM_DELIM,
            buildModPostfix: buildModPostfix,
            buildClass: function(block, elem, modName, modVal) {
                var typeOfModName = typeof modName;
                if (typeOfModName === "string" || typeOfModName === "boolean") {
                    var typeOfModVal = typeof modVal;
                    if (typeOfModVal !== "string" && typeOfModVal !== "boolean") {
                        modVal = modName;
                        modName = elem;
                        elem = undef;
                    }
                } else if (typeOfModName !== "undefined") {
                    modName = undef;
                } else if (elem && typeof elem !== "string") {
                    elem = undef;
                }
                if (!(elem || modName)) {
                    return block;
                }
                return elem ? buildElemClass(block, elem, modName, modVal) : buildBlockClass(block, modName, modVal);
            },
            buildModsClasses: function(block, elem, mods) {
                var res = "";
                if (mods) {
                    var modName;
                    for (modName in mods) {
                        if (!mods.hasOwnProperty(modName)) continue;
                        var modVal = mods[modName];
                        if (!modVal && modVal !== 0) continue;
                        typeof modVal !== "boolean" && (modVal += "");
                        res += " " + (elem ? buildElemClass(block, elem, modName, modVal) : buildBlockClass(block, modName, modVal));
                    }
                }
                return res;
            },
            buildClasses: function(block, elem, mods) {
                var res = "";
                res += elem ? buildElemClass(block, elem) : buildBlockClass(block);
                res += this.buildModsClasses(block, elem, mods);
                return res;
            }
        };
    })(BEM_);
    var ts = {
        '"': "&quot;",
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;"
    }, f = function(t) {
        return ts[t] || t;
    };
    var buildEscape = function(r) {
        r = new RegExp(r, "g");
        return function(s) {
            return ("" + s).replace(r, f);
        };
    };
    context.BEMContext = BEMContext;
    function BEMContext(context, apply_) {
        this.ctx = typeof context === "undefined" ? "" : context;
        this.apply = apply_;
        this._str = "";
        var _this = this;
        this._buf = {
            push: function() {
                var chunks = slice.call(arguments).join("");
                _this._str += chunks;
            },
            join: function() {
                return this._str;
            }
        };
        this._ = this;
        this._start = true;
        this._mode = "";
        this._listLength = 0;
        this._notNewList = false;
        this.position = 0;
        this.block = undef;
        this.elem = undef;
        this.mods = undef;
        this.elemMods = undef;
    }
    BEMContext.prototype.isArray = isArray;
    BEMContext.prototype.isSimple = function isSimple(obj) {
        if (!obj || obj === true) return true;
        var t = typeof obj;
        return t === "string" || t === "number";
    };
    BEMContext.prototype.isShortTag = function isShortTag(t) {
        return SHORT_TAGS.hasOwnProperty(t);
    };
    BEMContext.prototype.extend = function extend(o1, o2) {
        if (!o1 || !o2) return o1 || o2;
        var res = {}, n;
        for (n in o1) o1.hasOwnProperty(n) && (res[n] = o1[n]);
        for (n in o2) o2.hasOwnProperty(n) && (res[n] = o2[n]);
        return res;
    };
    var cnt = 0, id = +new Date(), expando = "__" + id, get = function() {
        return "uniq" + id + ++cnt;
    };
    BEMContext.prototype.identify = function(obj, onlyGet) {
        if (!obj) return get();
        if (onlyGet || obj[expando]) {
            return obj[expando];
        } else {
            return obj[expando] = get();
        }
    };
    BEMContext.prototype.xmlEscape = buildEscape("[&<>]");
    BEMContext.prototype.attrEscape = buildEscape('["&<>]');
    BEMContext.prototype.BEM = BEM_;
    BEMContext.prototype.isFirst = function isFirst() {
        return this.position === 1;
    };
    BEMContext.prototype.isLast = function isLast() {
        return this.position === this._listLength;
    };
    BEMContext.prototype.generateId = function generateId() {
        return this.identify(this.ctx);
    };
    var oldApply = exports.apply;
    exports.apply = BEMContext.apply = function BEMContext_apply(context) {
        var ctx = new BEMContext(context || this, oldApply);
        ctx.apply();
        return ctx._str;
    };
    BEMContext.prototype.reapply = BEMContext.apply;
} ].forEach(function(fn) {
    fn(exports, this);
}, {
    recordExtensions: function(ctx) {
        ctx["__$a0"] = 0;
        ctx["_mode"] = undefined;
        ctx["ctx"] = undefined;
        ctx["_ieCommented"] = undefined;
        ctx["_str"] = undefined;
        ctx["block"] = undefined;
        ctx["elem"] = undefined;
        ctx["_notNewList"] = undefined;
        ctx["position"] = undefined;
        ctx["_listLength"] = undefined;
        ctx["_currBlock"] = undefined;
        ctx["mods"] = undefined;
        ctx["elemMods"] = undefined;
    },
    resetApplyNext: function(ctx) {
        ctx["__$a0"] = 0;
    }
});

function __$b30(__$ctx, __$ref) {
    var url__$3 = __$ctx.ctx.url;
    var __$r__$5;
    var __$l0__$6 = $$mode;
    $$mode = "";
    var __$l1__$7 = __$ctx.ctx;
    __$ctx.ctx = [ 6, 7, 8, 9 ].map(function(v) {
        return {
            elem: "css",
            url: url__$3 + ".ie" + v + ".css",
            ie: "IE " + v
        };
    });
    var __$r__$9;
    var __$l2__$10 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 2;
    __$r__$9 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l2__$10;
    __$r__$5 = __$r__$9;
    $$mode = __$l0__$6;
    __$ctx.ctx = __$l1__$7;
    return;
}

function __$b31(__$ctx, __$ref) {
    var ie__$11 = __$ctx.ctx.ie, hideRule__$12 = !ie__$11 ? [ "gt IE 9", "<!-->", "<!--" ] : ie__$11 === "!IE" ? [ ie__$11, "<!-->", "<!--" ] : [ ie__$11, "", "" ];
    var __$r__$14;
    var __$l0__$15 = $$mode;
    $$mode = "";
    var __$l3__$16 = __$ctx.ctx;
    var __$l1__$17 = __$l3__$16._ieCommented;
    __$l3__$16._ieCommented = true;
    var __$l2__$18 = __$ctx.ctx;
    __$ctx.ctx = [ "<!--[if " + hideRule__$12[0] + "]>" + hideRule__$12[1], __$ctx.ctx, hideRule__$12[2] + "<![endif]-->" ];
    __$r__$14 = applyc(__$ctx, __$ref);
    $$mode = __$l0__$15;
    __$l3__$16._ieCommented = __$l1__$17;
    __$ctx.ctx = __$l2__$18;
    return;
}

function __$b32(__$ctx, __$ref) {
    __$ctx._defPageApplied = true;
    var ctx__$25 = __$ctx.ctx;
    var __$r__$27;
    var __$l0__$28 = $$mode;
    $$mode = "";
    var __$l1__$29 = __$ctx.ctx;
    __$ctx.ctx = [ ctx__$25.doctype || "<!DOCTYPE html>", {
        tag: "html",
        cls: "ua_js_no",
        content: [ {
            elem: "head",
            content: [ {
                tag: "meta",
                attrs: {
                    charset: "utf-8"
                }
            }, {
                tag: "title",
                content: ctx__$25.title
            }, {
                block: "ua"
            }, ctx__$25.head, ctx__$25.styles, ctx__$25.favicon ? {
                elem: "favicon",
                url: ctx__$25.favicon
            } : "" ]
        }, ctx__$25 ]
    } ];
    var __$r__$31;
    var __$l2__$32 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 16;
    __$r__$31 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l2__$32;
    __$r__$27 = __$r__$31;
    $$mode = __$l0__$28;
    __$ctx.ctx = __$l1__$29;
    __$ctx._defPageApplied = false;
    return;
}

function __$b33(__$ctx, __$ref) {
    var BEM_INTERNAL__$33 = __$ctx.BEM.INTERNAL, ctx__$34 = __$ctx.ctx, isBEM__$35, tag__$36, res__$37;
    var __$r__$39;
    var __$l0__$40 = __$ctx._str;
    __$ctx._str = "";
    var vBlock__$41 = $$block;
    var __$r__$43;
    var __$l1__$44 = $$mode;
    $$mode = "tag";
    __$r__$43 = applyc(__$ctx, __$ref);
    $$mode = __$l1__$44;
    tag__$36 = __$r__$43;
    typeof tag__$36 !== "undefined" || (tag__$36 = ctx__$34.tag);
    typeof tag__$36 !== "undefined" || (tag__$36 = "div");
    if (tag__$36) {
        var jsParams__$45, js__$46;
        if (vBlock__$41 && ctx__$34.js !== false) {
            var __$r__$47;
            var __$l2__$48 = $$mode;
            $$mode = "js";
            __$r__$47 = applyc(__$ctx, __$ref);
            $$mode = __$l2__$48;
            js__$46 = __$r__$47;
            js__$46 = js__$46 ? __$ctx.extend(ctx__$34.js, js__$46 === true ? {} : js__$46) : ctx__$34.js === true ? {} : ctx__$34.js;
            js__$46 && ((jsParams__$45 = {})[BEM_INTERNAL__$33.buildClass(vBlock__$41, ctx__$34.elem)] = js__$46);
        }
        __$ctx._str += "<" + tag__$36;
        var __$r__$49;
        var __$l3__$50 = $$mode;
        $$mode = "bem";
        __$r__$49 = applyc(__$ctx, __$ref);
        $$mode = __$l3__$50;
        isBEM__$35 = __$r__$49;
        typeof isBEM__$35 !== "undefined" || (isBEM__$35 = typeof ctx__$34.bem !== "undefined" ? ctx__$34.bem : ctx__$34.block || ctx__$34.elem);
        var __$r__$52;
        var __$l4__$53 = $$mode;
        $$mode = "cls";
        __$r__$52 = applyc(__$ctx, __$ref);
        $$mode = __$l4__$53;
        var cls__$51 = __$r__$52;
        cls__$51 || (cls__$51 = ctx__$34.cls);
        var addJSInitClass__$54 = ctx__$34.block && jsParams__$45 && !ctx__$34.elem;
        if (isBEM__$35 || cls__$51) {
            __$ctx._str += ' class="';
            if (isBEM__$35) {
                __$ctx._str += BEM_INTERNAL__$33.buildClasses(vBlock__$41, ctx__$34.elem, ctx__$34.elemMods || ctx__$34.mods);
                var __$r__$56;
                var __$l5__$57 = $$mode;
                $$mode = "mix";
                __$r__$56 = applyc(__$ctx, __$ref);
                $$mode = __$l5__$57;
                var mix__$55 = __$r__$56;
                ctx__$34.mix && (mix__$55 = mix__$55 ? [].concat(mix__$55, ctx__$34.mix) : ctx__$34.mix);
                if (mix__$55) {
                    var visited__$58 = {}, visitedKey__$59 = function(block, elem) {
                        return (block || "") + "__" + (elem || "");
                    };
                    visited__$58[visitedKey__$59(vBlock__$41, $$elem)] = true;
                    __$ctx.isArray(mix__$55) || (mix__$55 = [ mix__$55 ]);
                    for (var i__$60 = 0; i__$60 < mix__$55.length; i__$60++) {
                        var mixItem__$61 = mix__$55[i__$60], hasItem__$62 = mixItem__$61.block || mixItem__$61.elem, mixBlock__$63 = mixItem__$61.block || mixItem__$61._block || $$block, mixElem__$64 = mixItem__$61.elem || mixItem__$61._elem || $$elem;
                        hasItem__$62 && (__$ctx._str += " ");
                        __$ctx._str += BEM_INTERNAL__$33[hasItem__$62 ? "buildClasses" : "buildModsClasses"](mixBlock__$63, mixItem__$61.elem || mixItem__$61._elem || (mixItem__$61.block ? undefined : $$elem), mixItem__$61.elemMods || mixItem__$61.mods);
                        if (mixItem__$61.js) {
                            (jsParams__$45 || (jsParams__$45 = {}))[BEM_INTERNAL__$33.buildClass(mixBlock__$63, mixItem__$61.elem)] = mixItem__$61.js === true ? {} : mixItem__$61.js;
                            addJSInitClass__$54 || (addJSInitClass__$54 = mixBlock__$63 && !mixItem__$61.elem);
                        }
                        if (hasItem__$62 && !visited__$58[visitedKey__$59(mixBlock__$63, mixElem__$64)]) {
                            visited__$58[visitedKey__$59(mixBlock__$63, mixElem__$64)] = true;
                            var __$r__$66;
                            var __$l6__$67 = $$mode;
                            $$mode = "mix";
                            var __$l7__$68 = $$block;
                            $$block = mixBlock__$63;
                            var __$l8__$69 = $$elem;
                            $$elem = mixElem__$64;
                            __$r__$66 = applyc(__$ctx, __$ref);
                            $$mode = __$l6__$67;
                            $$block = __$l7__$68;
                            $$elem = __$l8__$69;
                            var nestedMix__$65 = __$r__$66;
                            if (nestedMix__$65) {
                                for (var j__$70 = 0; j__$70 < nestedMix__$65.length; j__$70++) {
                                    var nestedItem__$71 = nestedMix__$65[j__$70];
                                    if (!nestedItem__$71.block && !nestedItem__$71.elem || !visited__$58[visitedKey__$59(nestedItem__$71.block, nestedItem__$71.elem)]) {
                                        nestedItem__$71._block = mixBlock__$63;
                                        nestedItem__$71._elem = mixElem__$64;
                                        mix__$55.splice(i__$60 + 1, 0, nestedItem__$71);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            cls__$51 && (__$ctx._str += isBEM__$35 ? " " + cls__$51 : cls__$51);
            __$ctx._str += addJSInitClass__$54 ? ' i-bem"' : '"';
        }
        if (isBEM__$35 && jsParams__$45) {
            __$ctx._str += ' data-bem="' + __$ctx.attrEscape(JSON.stringify(jsParams__$45)) + '"';
        }
        var __$r__$73;
        var __$l9__$74 = $$mode;
        $$mode = "attrs";
        __$r__$73 = applyc(__$ctx, __$ref);
        $$mode = __$l9__$74;
        var attrs__$72 = __$r__$73;
        attrs__$72 = __$ctx.extend(attrs__$72, ctx__$34.attrs);
        if (attrs__$72) {
            var name__$75, attr__$76;
            for (name__$75 in attrs__$72) {
                attr__$76 = attrs__$72[name__$75];
                if (typeof attr__$76 === "undefined") continue;
                __$ctx._str += " " + name__$75 + '="' + __$ctx.attrEscape(__$ctx.isSimple(attr__$76) ? attr__$76 : __$ctx.reapply(attr__$76)) + '"';
            }
        }
    }
    if (__$ctx.isShortTag(tag__$36)) {
        __$ctx._str += "/>";
    } else {
        tag__$36 && (__$ctx._str += ">");
        var __$r__$78;
        var __$l10__$79 = $$mode;
        $$mode = "content";
        __$r__$78 = applyc(__$ctx, __$ref);
        $$mode = __$l10__$79;
        var content__$77 = __$r__$78;
        if (content__$77 || content__$77 === 0) {
            isBEM__$35 = vBlock__$41 || $$elem;
            var __$r__$80;
            var __$l11__$81 = $$mode;
            $$mode = "";
            var __$l12__$82 = __$ctx._notNewList;
            __$ctx._notNewList = false;
            var __$l13__$83 = __$ctx.position;
            __$ctx.position = isBEM__$35 ? 1 : __$ctx.position;
            var __$l14__$84 = __$ctx._listLength;
            __$ctx._listLength = isBEM__$35 ? 1 : __$ctx._listLength;
            var __$l15__$85 = __$ctx.ctx;
            __$ctx.ctx = content__$77;
            __$r__$80 = applyc(__$ctx, __$ref);
            $$mode = __$l11__$81;
            __$ctx._notNewList = __$l12__$82;
            __$ctx.position = __$l13__$83;
            __$ctx._listLength = __$l14__$84;
            __$ctx.ctx = __$l15__$85;
        }
        tag__$36 && (__$ctx._str += "</" + tag__$36 + ">");
    }
    res__$37 = __$ctx._str;
    __$r__$39 = undefined;
    __$ctx._str = __$l0__$40;
    __$ctx._buf.push(res__$37);
    return;
}

function __$b36(__$ctx, __$ref) {
    var __$r__$87;
    var __$l0__$88 = $$mode;
    $$mode = "";
    var __$l1__$89 = __$ctx.ctx;
    __$ctx.ctx = __$ctx.ctx._value;
    var __$r__$91;
    var __$l2__$92 = __$ctx.__$a0;
    __$ctx.__$a0 = __$ctx.__$a0 | 32;
    __$r__$91 = applyc(__$ctx, __$ref);
    __$ctx.__$a0 = __$l2__$92;
    __$r__$87 = __$r__$91;
    $$mode = __$l0__$88;
    __$ctx.ctx = __$l1__$89;
    return;
}

function __$b37(__$ctx, __$ref) {
    __$ctx._listLength--;
    var ctx__$93 = __$ctx.ctx;
    if (ctx__$93 && ctx__$93 !== true || ctx__$93 === 0) {
        __$ctx._str += ctx__$93 + "";
    }
    return;
}

function __$b38(__$ctx, __$ref) {
    __$ctx._listLength--;
    return;
}

function __$b39(__$ctx, __$ref) {
    var ctx__$94 = __$ctx.ctx, len__$95 = ctx__$94.length, i__$96 = 0, prevPos__$97 = __$ctx.position, prevNotNewList__$98 = __$ctx._notNewList;
    if (prevNotNewList__$98) {
        __$ctx._listLength += len__$95 - 1;
    } else {
        __$ctx.position = 0;
        __$ctx._listLength = len__$95;
    }
    __$ctx._notNewList = true;
    while (i__$96 < len__$95) (function __$lb__$99() {
        var __$r__$100;
        var __$l0__$101 = __$ctx.ctx;
        __$ctx.ctx = ctx__$94[i__$96++];
        __$r__$100 = applyc(__$ctx, __$ref);
        __$ctx.ctx = __$l0__$101;
        return __$r__$100;
    })();
    prevNotNewList__$98 || (__$ctx.position = prevPos__$97);
    return;
}

function __$b40(__$ctx, __$ref) {
    __$ctx.ctx || (__$ctx.ctx = {});
    var vBlock__$102 = __$ctx.ctx.block, vElem__$103 = __$ctx.ctx.elem, block__$104 = __$ctx._currBlock || $$block;
    var __$r__$106;
    var __$l0__$107 = $$mode;
    $$mode = "default";
    var __$l1__$108 = $$block;
    $$block = vBlock__$102 || (vElem__$103 ? block__$104 : undefined);
    var __$l2__$109 = __$ctx._currBlock;
    __$ctx._currBlock = vBlock__$102 || vElem__$103 ? undefined : block__$104;
    var __$l3__$110 = $$elem;
    $$elem = vElem__$103;
    var __$l4__$111 = $$mods;
    $$mods = vBlock__$102 ? __$ctx.ctx.mods || (__$ctx.ctx.mods = {}) : $$mods;
    var __$l5__$112 = $$elemMods;
    $$elemMods = __$ctx.ctx.elemMods || {};
    $$block || $$elem ? __$ctx.position = (__$ctx.position || 0) + 1 : __$ctx._listLength--;
    applyc(__$ctx, __$ref);
    __$r__$106 = undefined;
    $$mode = __$l0__$107;
    $$block = __$l1__$108;
    __$ctx._currBlock = __$l2__$109;
    $$elem = __$l3__$110;
    $$mods = __$l4__$111;
    $$elemMods = __$l5__$112;
    return;
}

function __$g0(__$ctx, __$ref) {
    var __$t = $$mode;
    if (__$t === "content") {
        var __$t = $$block;
        if (__$t === "b-content") {
            if (!$$elem) {
                return "CONTENT HUY";
            }
        } else if (__$t === "ua") {
            var __$t = !$$elem;
            if (__$t) {
                if ((__$ctx.__$a0 & 1) === 0) {
                    return [ function __$lb__$0() {
                        var __$r__$1;
                        var __$l0__$2 = __$ctx.__$a0;
                        __$ctx.__$a0 = __$ctx.__$a0 | 1;
                        __$r__$1 = applyc(__$ctx, __$ref);
                        __$ctx.__$a0 = __$l0__$2;
                        return __$r__$1;
                    }(), "(function(d,n){", "d.documentElement.className+=", '" ua_svg_"+(d[n]&&d[n]("http://www.w3.org/2000/svg","svg").createSVGRect?"yes":"no");', '})(document,"createElementNS");' ];
                }
                return [ "(function(e,c){", 'e[c]=e[c].replace(/(ua_js_)no/g,"$1yes");', '})(document.documentElement,"className");' ];
            }
        } else if (__$t === "page") {
            if ($$elem === "head" && (__$ctx.__$a0 & 4) === 0) {
                return [ __$ctx.ctx["x-ua-compatible"] === false ? false : {
                    tag: "meta",
                    attrs: {
                        "http-equiv": "X-UA-Compatible",
                        content: __$ctx.ctx["x-ua-compatible"] || "IE=edge"
                    }
                }, function __$lb__$19() {
                    var __$r__$20;
                    var __$l0__$21 = __$ctx.__$a0;
                    __$ctx.__$a0 = __$ctx.__$a0 | 4;
                    __$r__$20 = applyc(__$ctx, __$ref);
                    __$ctx.__$a0 = __$l0__$21;
                    return __$r__$20;
                }() ];
            }
            if (!$$elem && (__$ctx.__$a0 & 8) === 0) {
                return [ function __$lb__$22() {
                    var __$r__$23;
                    var __$l0__$24 = __$ctx.__$a0;
                    __$ctx.__$a0 = __$ctx.__$a0 | 8;
                    __$r__$23 = applyc(__$ctx, __$ref);
                    __$ctx.__$a0 = __$l0__$24;
                    return __$r__$23;
                }(), __$ctx.ctx.scripts ];
            }
        }
        return __$ctx.ctx.content;
    } else if (__$t === "js") {
        return undefined;
    } else if (__$t === "attrs") {
        var __$t = $$block;
        if (__$t === "page") {
            var __$t = $$elem;
            if (__$t === "js") {
                if (__$ctx.ctx.url) {
                    return {
                        src: __$ctx.ctx.url
                    };
                }
            } else if (__$t === "css") {
                if (__$ctx.ctx.url) {
                    return {
                        rel: "stylesheet",
                        href: __$ctx.ctx.url
                    };
                }
            } else if (__$t === "favicon") {
                return {
                    rel: "shortcut icon",
                    href: __$ctx.ctx.url
                };
            }
        }
        return undefined;
    } else if (__$t === "tag") {
        var __$t = $$block;
        if (__$t === "ua") {
            if (!$$elem) {
                return "script";
            }
        } else if (__$t === "page") {
            var __$t = $$elem;
            if (__$t === "js") {
                return "script";
            } else if (__$t === "css") {
                if (__$ctx.ctx.url) {
                    return "link";
                }
                return "style";
            } else if (__$t === "head") {
                return "head";
            } else if (__$t === "favicon") {
                return "link";
            } else if (__$t === "link") {
                return "link";
            } else if (__$t === "meta") {
                return "meta";
            }
            if (!$$elem) {
                return "body";
            }
        }
        return undefined;
    } else if (__$t === "bem") {
        var __$t = $$block;
        if (__$t === "ua") {
            if (!$$elem) {
                return false;
            }
        } else if (__$t === "page") {
            var __$t = $$elem;
            if (__$t === "js") {
                return false;
            } else if (__$t === "css") {
                return false;
            } else if (__$t === "head") {
                return false;
            } else if (__$t === "favicon") {
                return false;
            } else if (__$t === "link") {
                return false;
            } else if (__$t === "meta") {
                return false;
            }
        }
        return undefined;
    } else if (__$t === "default") {
        var __$t = $$block;
        if (__$t === "page") {
            var __$t = $$elem;
            if (__$t === "css") {
                var __$t = !__$ctx.ctx._ieCommented;
                if (__$t) {
                    var __$t = __$ctx.ctx.hasOwnProperty("ie");
                    if (__$t) {
                        if (__$ctx.ctx.ie === true && (__$ctx.__$a0 & 2) === 0) {
                            var __$r = __$b30(__$ctx, __$ref);
                            if (__$r !== __$ref) return __$r;
                        }
                        var __$r = __$b31(__$ctx, __$ref);
                        if (__$r !== __$ref) return __$r;
                    }
                }
            }
            if (!$$elem && !__$ctx._defPageApplied && (__$ctx.__$a0 & 16) === 0) {
                var __$r = __$b32(__$ctx, __$ref);
                if (__$r !== __$ref) return __$r;
            }
        }
        var __$r = __$b33(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    } else if (__$t === "mix") {
        return undefined;
    } else if (__$t === "cls") {
        return undefined;
    } else if (__$t === "") {
        if (__$ctx.ctx && __$ctx.ctx._vow && (__$ctx.__$a0 & 32) === 0) {
            var __$r = __$b36(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (__$ctx.isSimple(__$ctx.ctx)) {
            var __$r = __$b37(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (!__$ctx.ctx) {
            var __$r = __$b38(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        if (__$ctx.isArray(__$ctx.ctx)) {
            var __$r = __$b39(__$ctx, __$ref);
            if (__$r !== __$ref) return __$r;
        }
        var __$r = __$b40(__$ctx, __$ref);
        if (__$r !== __$ref) return __$r;
    }
    return __$ref;
};
     return exports;
  }
  var defineAsGlobal = true;
  if(typeof exports === "object") {
    exports["BEMHTML"] = __bem_xjst({});
    defineAsGlobal = false;
  }
  if(typeof modules === "object") {
    modules.define("BEMHTML",
      function(provide) {
        provide(__bem_xjst({})) });
    defineAsGlobal = false;
  }
  defineAsGlobal && (g["BEMHTML"] = __bem_xjst({}));
})(this);