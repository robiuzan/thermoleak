/**
 * A small TypeScript data scanner: finds `export const NAME ... = [` and walks it, string- and
 * comment-aware, so `]` inside a Hebrew sentence or a nested `bullets: [...]` never ends a row.
 *
 * Dependency-free on purpose: a site's image gate copies this file verbatim, so the site and the
 * toolkit read one list with one scanner.
 */

export const KEY_RE = /^\s*(?:([A-Za-z_$][\w$]*)|"([^"]*)"|'([^']*)')\s*:\s*/;

/** Index of the closing quote of the string that opens at `i`. */
export function skipString(text, i) {
  const q = text[i];
  for (let j = i + 1; j < text.length; j++) {
    if (text[j] === "\\") {
      j++;
      continue;
    }
    if (text[j] === q) return j;
  }
  return text.length;
}

/** Index of the bracket that closes the one opening at `start`, or -1. */
export function matchClose(text, start) {
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    const c = text[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(text, i);
      continue;
    }
    if (c === "/" && text[i + 1] === "/") {
      const nl = text.indexOf("\n", i);
      if (nl < 0) return -1;
      i = nl;
      continue;
    }
    if (c === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      if (end < 0) return -1;
      i = end + 1;
      continue;
    }
    if (c === "[" || c === "{" || c === "(") depth++;
    else if (c === "]" || c === "}" || c === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** The source of `export const NAME[: Type] = [ ... ]`, brackets included, or null. */
export function tsArray(text, constName) {
  const re = new RegExp(`export\\s+const\\s+${constName}\\b[^=]*=\\s*\\[`);
  const m = re.exec(text);
  if (!m) return null;
  const open = m.index + m[0].length - 1;
  const close = matchClose(text, open);
  return close < 0 ? null : text.slice(open, close + 1);
}

/** The top-level `{ ... }` objects of an array source. */
export function topLevelObjects(arraySrc) {
  const out = [];
  for (let i = 1; i < arraySrc.length - 1; i++) {
    const c = arraySrc[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(arraySrc, i);
      continue;
    }
    if (c === "/" && arraySrc[i + 1] === "/") {
      const nl = arraySrc.indexOf("\n", i);
      i = nl < 0 ? arraySrc.length : nl;
      continue;
    }
    if (c === "/" && arraySrc[i + 1] === "*") {
      const end = arraySrc.indexOf("*/", i + 2);
      i = end < 0 ? arraySrc.length : end + 1;
      continue;
    }
    if (c === "{") {
      const end = matchClose(arraySrc, i);
      if (end < 0) break;
      out.push(arraySrc.slice(i, end + 1));
      i = end;
    }
  }
  return out;
}

const unquote = (s) => s.replace(/\\(.)/g, (_, ch) => (ch === "n" ? "\n" : ch));

/** The string-valued top-level properties of one `{ ... }` object literal. */
export function objectStrings(objSrc) {
  const out = {};
  const n = objSrc.length - 1;
  let i = 1;
  while (i < n) {
    const m = KEY_RE.exec(objSrc.slice(i, i + 200));
    if (!m) {
      const c = objSrc[i];
      if (c === '"' || c === "'" || c === "`") i = skipString(objSrc, i);
      i++;
      continue;
    }
    const key = m[1] ?? m[2] ?? m[3];
    i += m[0].length;
    const c = objSrc[i];
    if (c === '"' || c === "'" || c === "`") {
      const end = skipString(objSrc, i);
      if (!(key in out)) out[key] = unquote(objSrc.slice(i + 1, end));
      i = end + 1;
    }
    while (i < n) {
      const d = objSrc[i];
      if (d === '"' || d === "'" || d === "`") {
        i = skipString(objSrc, i) + 1;
        continue;
      }
      if (d === "[" || d === "{" || d === "(") {
        const e = matchClose(objSrc, i);
        i = (e < 0 ? n : e) + 1;
        continue;
      }
      if (d === ",") {
        i++;
        break;
      }
      i++;
    }
  }
  return out;
}
