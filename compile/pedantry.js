#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const os = require('os');             
const {join:p} = path;
const {createReadStream:q, lstat:t, readdir:u} = fs;
const {PassThrough:v} = stream;
const {debuglog:w} = util;
const x = (a, b = 0, d = !1) => {
  if (0 === b && !d) {
    return a;
  }
  a = a.split("\n", d ? b + 1 : void 0);
  return d ? a[a.length - 1] : a.slice(b).join("\n");
}, y = (a, b = !1) => x(a, 2 + (b ? 1 : 0)), z = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const {homedir:A} = os;
const C = /\s+at.*(?:\(|\s)(.*)\)?/, D = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, E = A(), F = a => {
  const {pretty:b = !1, ignoredModules:d = ["pirates"]} = {}, e = d.join("|"), f = new RegExp(D.source.replace("IGNORED_MODULES", e));
  return a.replace(/\\/g, "/").split("\n").filter(c => {
    c = c.match(C);
    if (null === c || !c[1]) {
      return !0;
    }
    c = c[1];
    return c.includes(".app/Contents/Resources/electron.asar") || c.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(c);
  }).filter(c => c.trim()).map(c => b ? c.replace(C, (h, g) => h.replace(g, g.replace(E, "~"))) : c).join("\n");
};
function G(a, b, d = !1) {
  return function(e) {
    var f = z(arguments), {stack:c} = Error();
    const h = x(c, 2, !0), g = (c = e instanceof Error) ? e.message : e;
    f = [`Error: ${g}`, ...null !== f && a === f || d ? [b] : [h, b]].join("\n");
    f = F(f);
    return Object.assign(c ? e : Error(), {message:g, stack:f});
  };
}
;function H(a) {
  var {stack:b} = Error();
  const d = z(arguments);
  b = y(b, a);
  return G(d, b, a);
}
;function I(a, b) {
  if (b > a - 2) {
    throw Error("Function does not accept that many arguments.");
  }
}
async function J(a, b, d) {
  const e = H(!0);
  if ("function" !== typeof a) {
    throw Error("Function must be passed.");
  }
  const {length:f} = a;
  if (!f) {
    throw Error("Function does not accept any arguments.");
  }
  return await new Promise((c, h) => {
    const g = (k, m) => k ? (k = e(k), h(k)) : c(d || m);
    let l = [g];
    Array.isArray(b) ? (b.forEach((k, m) => {
      I(f, m);
    }), l = [...b, g]) : 1 < Array.from(arguments).length && (I(f, 0), l = [b, g]);
    a(...l);
  });
}
;async function K(a, b) {
  b = b.map(async d => {
    const e = p(a, d);
    return {lstat:await J(t, e), path:e, relativePath:d};
  });
  return await Promise.all(b);
}
const L = a => a.lstat.isDirectory(), M = a => !a.lstat.isDirectory();
async function N(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  if (!(await J(t, a)).isDirectory()) {
    throw a = Error("Path is not a directory"), a.code = "ENOTDIR", a;
  }
  var b = await J(u, a);
  b = await K(a, b);
  a = b.filter(L);
  b = b.filter(M).reduce((d, e) => {
    var f = e.lstat.isDirectory() ? "Directory" : e.lstat.isFile() ? "File" : e.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...d, [e.relativePath]:{type:f}};
  }, {});
  a = await a.reduce(async(d, {path:e, relativePath:f}) => {
    d = await d;
    e = await N(e);
    return {...d, [f]:e};
  }, {});
  return {content:{...b, ...a}, type:"Directory"};
}
;const O = (a, b) => a.some(d => d == b), P = (a, b) => {
  const d = O(a, "index.md"), e = O(a, "footer.md"), f = ["index.md", "footer.md"];
  a = a.filter(c => !f.includes(c)).sort((c, h) => {
    c = c.localeCompare(h, void 0, {numeric:!0});
    return b ? -c : c;
  });
  return d && e ? ["index.md", ...a, "footer.md"] : d ? ["index.md", ...a] : e ? [...a, "footer.md"] : a;
};
const Q = w("pedantry"), T = async({stream:a, source:b, path:d = ".", content:e = {}, reverse:f = !1, separator:c, includeFilename:h, ignoreHidden:g}) => {
  var l = Object.keys(e);
  l = await P(l, f).reduce(async(k, m) => {
    k = await k;
    const {type:n, content:S} = e[m], B = p(d, m);
    let r;
    "File" == n ? g && m.startsWith(".") || (r = await R({stream:a, source:b, path:B, separator:c, includeFilename:h})) : "Directory" == n && (r = await T({stream:a, source:b, path:B, content:S, reverse:f, separator:c, includeFilename:h, ignoreHidden:g}));
    return k + r;
  }, 0);
  Q("dir %s size: %s B", d, l);
  return l;
}, R = async a => {
  const {stream:b, source:d, path:e, separator:f, includeFilename:c} = a, h = p(d, e);
  b.emit("file", e);
  f && !b.a && (c ? b.push({file:"separator", data:f}) : b.push(f));
  a = await new Promise((g, l) => {
    let k = 0;
    const m = q(h);
    m.on("data", n => {
      k += n.byteLength;
    }).on("error", n => {
      l(n);
    }).on("close", () => {
      g(k);
    });
    if (c) {
      m.on("data", n => {
        b.push({file:h, data:`${n}`});
      });
    } else {
      m.pipe(b, {end:!1});
    }
  });
  b.a = !1;
  Q("file %s :: %s B", h, a);
  return a;
};
class U extends v {
  constructor(a, b = {}) {
    const {reverse:d = !1, addNewLine:e = !1, addBlankLine:f = !1, includeFilename:c = !1, ignoreHidden:h = !1} = b;
    super({objectMode:c});
    let g;
    e ? g = "\n" : f && (g = "\n\n");
    this.a = !0;
    (async() => {
      let l;
      try {
        ({content:l} = await N(a));
      } catch (k) {
        this.emit("error", Error(k.message));
      }
      try {
        await T({stream:this, source:a, content:l, reverse:d, separator:g, includeFilename:c, ignoreHidden:h});
      } catch (k) {
        this.emit("error", k);
      } finally {
        this.end();
      }
    })();
  }
}
;module.exports = U;


//# sourceMappingURL=pedantry.js.map