import { Uri } from "https://www.unpkg.com/@i-xi-dev/url@3.1.11/esm/mod.js";
// https://cdn.skypack.dev/@i-xi-dev/url@3.1.11

const i1 = document.getElementById("i1");
const o0 = document.getElementById("o0");
const o1 = document.getElementById("o1");
const o2 = document.getElementById("o2");
const o3 = document.getElementById("o3");
const o4 = document.getElementById("o4");
const o5 = document.getElementById("o5");
const o6 = document.getElementById("o6");
const o7 = document.getElementById("o7");
const o8 = document.getElementById("o8");
const o9 = document.getElementById("o9");
const o10 = document.getElementById("o10");

function _clear() {
  o0.value = "";
  o1.value = "";
  o2.value = "";
  o3.value = "";
  o4.value = "";
  o5.value = "";
  o6.value = "";
  o7.value = "";
  o8.value = "";
  o9.value = "";
  o10.value = "";
}

i1.addEventListener("input", () => {
  _clear();
  try {
    const url = Uri.Absolute.fromString(i1.value);
    o0.value = url.toString();
    o1.value = url.scheme;
    o2.value = url.rawHost;
    o3.value = url.host;
    const port = url.port;
    o4.value = Number.isSafeInteger(port) ? port.toString(10) : "";
    o5.value = url.rawPath;
    const path = url.path;
    if (path.length > 0) {//if (path.join("") !== url.rawPath) {
      path.forEach((s) => {
        const se = document.createElement("span");
        se.textContent = s;
        o6.appendChild(se);
      });
    }
    o7.value = url.rawQuery;
    const qParams = url.query;
    if (qParams.length > 0) {
      qParams.forEach(([k, v]) => {
        const pe = document.createElement("span");
        pe.textContent = k;
        const pve = document.createElement("span");
        pve.textContent = v;
        pe.appendChild(pve);
        o8.appendChild(pe);
      });
    }
    o9.value = url.rawFragment;
    o10.value = url.fragment;
  }
  catch {
    //
  }

}, {passive:true});

document.querySelector("*.progress").hidden = true;
