#!/usr/bin/env node
             
const path = require('path');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const os = require('os');             
const n = path.join, p = path.relative;
const r = fs.createReadStream, t = fs.lstat, u = fs.readdir;
const v = stream.PassThrough;
const w = util.debuglog;
const x = (a, c = 0, d = !1) => {
  if (0 === c && !d) {
    return a;
  }
  a = a.split("\n", d ? c + 1 : void 0);
  return d ? a[a.length - 1] : a.slice(c).join("\n");
}, y = (a, c = !1) => x(a, 2 + (c ? 1 : 0)), B = a => {
  ({callee:{caller:a}} = a);
  return a;
};
const C = os.homedir;
const D = /\s+at.*(?:\(|\s)(.*)\)?/, E = /^(?:(?:(?:node|(?:internal\/[\w/]*|.*node_modules\/(?:IGNORED_MODULES)\/.*)?\w+)\.js:\d+:\d+)|native)/, F = C(), G = a => {
  const {pretty:c = !1, ignoredModules:d = ["pirates"]} = {}, e = d.join("|"), f = new RegExp(E.source.replace("IGNORED_MODULES", e));
  return a.replace(/\\/g, "/").split("\n").filter(b => {
    b = b.match(D);
    if (null === b || !b[1]) {
      return !0;
    }
    b = b[1];
    return b.includes(".app/Contents/Resources/electron.asar") || b.includes(".app/Contents/Resources/default_app.asar") ? !1 : !f.test(b);
  }).filter(b => b.trim()).map(b => c ? b.replace(D, (g, h) => g.replace(h, h.replace(F, "~"))) : b).join("\n");
};
function H(a, c, d = !1) {
  return function(e) {
    var f = B(arguments), {stack:b} = Error();
    const g = x(b, 2, !0), h = (b = e instanceof Error) ? e.message : e;
    f = [`Error: ${h}`, ...null !== f && a === f || d ? [c] : [g, c]].join("\n");
    f = G(f);
    return Object.assign(b ? e : Error(), {message:h, stack:f});
  };
}
;function I(a) {
  var {stack:c} = Error();
  const d = B(arguments);
  c = y(c, a);
  return H(d, c, a);
}
;async function J(a, c, d) {
  const e = I(!0);
  if ("function" != typeof a) {
    throw Error("Function must be passed.");
  }
  if (!a.length) {
    throw Error(`Function${a.name ? ` ${a.name}` : ""} does not accept any arguments.`);
  }
  return await new Promise((f, b) => {
    const g = (k, l) => k ? (k = e(k), b(k)) : f(d || l);
    let h = [g];
    Array.isArray(c) ? h = [...c, g] : 1 < Array.from(arguments).length && (h = [c, g]);
    a(...h);
  });
}
;async function K(a, c) {
  c = c.map(async d => {
    const e = n(a, d);
    return {lstat:await J(t, e), path:e, relativePath:d};
  });
  return await Promise.all(c);
}
const L = a => a.lstat.isDirectory(), M = a => !a.lstat.isDirectory();
async function N(a) {
  if (!a) {
    throw Error("Please specify a path to the directory");
  }
  const {ignore:c = []} = {};
  if (!(await J(t, a)).isDirectory()) {
    var d = Error("Path is not a directory");
    d.code = "ENOTDIR";
    throw d;
  }
  d = await J(u, a);
  var e = await K(a, d);
  d = e.filter(L);
  e = e.filter(M).reduce((f, b) => {
    var g = b.lstat.isDirectory() ? "Directory" : b.lstat.isFile() ? "File" : b.lstat.isSymbolicLink() ? "SymbolicLink" : void 0;
    return {...f, [b.relativePath]:{type:g}};
  }, {});
  d = await d.reduce(async(f, {path:b, relativePath:g}) => {
    const h = p(a, b);
    if (c.includes(h)) {
      return f;
    }
    f = await f;
    b = await N(b);
    return {...f, [g]:b};
  }, {});
  return {content:{...e, ...d}, type:"Directory"};
}
;const O = (a, c) => a.some(d => d == c), P = (a, c) => {
  const d = O(a, "index.md"), e = O(a, "footer.md"), f = ["index.md", "footer.md"];
  a = a.filter(b => !f.includes(b)).sort((b, g) => {
    b = b.localeCompare(g, void 0, {numeric:!0});
    return c ? -b : b;
  });
  return d && e ? ["index.md", ...a, "footer.md"] : d ? ["index.md", ...a] : e ? [...a, "footer.md"] : a;
};
const Q = w("pedantry"), T = async({stream:a, source:c, path:d = ".", content:e = {}, reverse:f = !1, separator:b, includeFilename:g, ignoreHidden:h}) => {
  var k = Object.keys(e);
  k = await P(k, f).reduce(async(l, m) => {
    l = await l;
    const {type:z, content:S} = e[m], A = n(d, m);
    let q;
    "File" == z ? h && m.startsWith(".") || (q = await R({stream:a, source:c, path:A, separator:b, includeFilename:g})) : "Directory" == z && (q = await T({stream:a, source:c, path:A, content:S, reverse:f, separator:b, includeFilename:g, ignoreHidden:h}));
    return l + q;
  }, 0);
  Q("dir %s size: %s B", d, k);
  return k;
}, R = async a => {
  const c = a.stream, d = a.path, e = a.separator, f = a.includeFilename, b = n(a.source, d);
  c.emit("file", d);
  e && !c.a && (f ? c.push({file:"separator", data:e}) : c.push(e));
  a = await new Promise((g, h) => {
    let k = 0;
    const l = r(b);
    l.on("data", m => {
      k += m.byteLength;
    }).on("error", m => {
      h(m);
    }).on("close", () => {
      g(k);
    });
    if (f) {
      l.on("data", m => {
        c.push({file:b, data:`${m}`});
      });
    } else {
      l.pipe(c, {end:!1});
    }
  });
  c.a = !1;
  Q("file %s :: %s B", b, a);
  return a;
};
class U extends v {
  constructor(a, c = {}) {
    const {reverse:d = !1, addNewLine:e = !1, addBlankLine:f = !1, includeFilename:b = !1, ignoreHidden:g = !1} = c;
    super({objectMode:b});
    let h;
    e ? h = "\n" : f && (h = "\n\n");
    this.a = !0;
    (async() => {
      let k;
      try {
        ({content:k} = await N(a));
      } catch (l) {
        this.emit("error", Error(l.message));
      }
      try {
        await T({stream:this, source:a, content:k, reverse:d, separator:h, includeFilename:b, ignoreHidden:g});
      } catch (l) {
        this.emit("error", l);
      } finally {
        this.end();
      }
    })();
  }
}
;module.exports = U;


//# sourceMappingURL=pedantry.js.map