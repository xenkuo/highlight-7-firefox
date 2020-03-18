function main() {
  var enable;
  var rainbow;
  const rainbowColor = {
    red: "#ff8a80",
    orange: "#ffd180",
    yellow: "#ffff8d",
    green: "#b9f6ca",
    blue: "#80d8ff",
    indigo: "#8c9eff",
    purple: "#ea80fc"
  };

  function highlight(node, word, color) {
    if (node.parentElement.className === "HL-7") return false;

    const value = node.nodeValue;
    if (value.indexOf(word) === -1) return false;

    let forward = false;
    const parent = node.parentElement;
    const index = value.indexOf(word);
    if (index !== 0) {
      const before = document.createTextNode(value.substr(0, index));
      parent.insertBefore(before, node);
      forward = true;
    }

    const middle = document.createElement("span");
    middle.className = "HL-7";
    middle.style.backgroundColor = color;
    middle.style.borderRadius = "4px";
    middle.appendChild(
      document.createTextNode(value.substr(index, word.length))
    );
    parent.insertBefore(middle, node);

    if (value.length !== index + word.length) {
      const after = document.createTextNode(value.substr(index + word.length));
      parent.insertBefore(after, node);
    }

    parent.removeChild(node);

    return forward;
  }

  function hltWord(node, word, color) {
    if (Node.TEXT_NODE !== node.nodeType) {
      for (let i = 0; i < node.childNodes.length; i++) {
        if (hltWord(node.childNodes[i], word, color) === true) i++;
      }
    } else {
      return highlight(node, word, color);
    }
    return false;
  }

  function hltRainbow() {
    for (const key in rainbow) {
      if (rainbow[key] === "") continue;
      hltWord(document.body, rainbow[key], rainbowColor[key]);
    }
  }

  function dim(node, word) {
    if (node.nodeValue !== word) return;

    let content = "";
    const p = node.parentElement;
    const pp = p.parentElement;
    const pps = p.previousSibling;
    if (pps !== null && pps.className !== "HL-7" && pps.nodeType === 3) {
      content = pps.nodeValue;
      pp.removeChild(pps);
    }
    content += word;
    const pns = p.nextSibling;
    if (pns !== null && pns.className !== "HL-7" && pns.nodeType === 3) {
      content += pns.nodeValue;
      pp.removeChild(pns);
    }
    const newNode = document.createTextNode(content);
    pp.replaceChild(newNode, p);
  }

  function dimWord(node, word) {
    if (Node.TEXT_NODE !== node.nodeType) {
      for (let i = 0, len = node.childNodes.length; i < len; i++) {
        dimWord(node.childNodes[i], word);
        if (len > node.childNodes.length) {
          i--;
          len = node.childNodes.length;
        }
      }
    } else {
      dim(node, word);
    }
  }

  function dimRainbow() {
    for (const key in rainbow) {
      if (rainbow[key] === "") continue;
      dimWord(document.body, rainbow[key]);
    }
  }

  browser.storage.local
    .get({
      enable: false
    })
    .then(function(items) {
      enable = items.enable;
    })
    .catch(function(e) {
      console.error(e);
    });

  browser.storage.local
    .get({
      red: "",
      orange: "",
      yellow: "",
      green: "",
      blue: "",
      indigo: "",
      purple: ""
    })
    .then(items => {
      rainbow = items;
      if (enable === true) hltRainbow();
    })
    .catch(e => {
      console.error(e);
    });

  function enableProcess(newValue) {
    console.log("enable newVale: " + newValue);
    switch (newValue) {
      case true:
        enable = true;
        hltRainbow();
        break;
      case false:
        enable = false;
        dimRainbow();
        break;
      case undefined:
        enable = false;
        dimRainbow();
        for (const key in rainbow) {
          rainbow[key] = "";
        }
        break;
      default:
        break;
    }
  }

  function getColor() {
    const keys = Object.keys(rainbow);
    let color = "auto";
    for (const key of keys) {
      if (rainbow[key] === "") {
        color = key;
        break;
      }
    }
    if (color === "auto") {
      color = keys[new Date().getTime() % 7];
    }

    return color;
  }

  function setWord() {
    const word = window.top
      .getSelection()
      .toString()
      .trim();
    for (const key in rainbow) {
      if (rainbow[key] === word) return;
    }
    const color = getColor();

    browser.storage.local
      .set({
        [color]: word
      })
      .then(() => {
        console.log("auto color settle down");
      })
      .catch(e => {
        console.error(e);
      });
  }

  function autoProcess() {
    if (document.hidden === true) return;

    if (enable !== true) {
      browser.storage.local
        .set({
          enable: true
        })
        .then(() => {
          console.log("auto mode enabled");
          setWord();
        });
    } else {
      setWord();
    }
  }

  function storageChangeListener(changes, area) {
    if (area !== "local") return;

    // If there is enable key, we only process enable change
    if (changes.enable !== undefined) {
      enableProcess(changes.enable.newValue);
    } else if (changes.auto !== undefined) {
      autoProcess();
    } else if (enable === true) {
      for (const key in changes) {
        const oldValue = changes[key].oldValue || "";
        const newValue = changes[key].newValue || "";
        console.log(
          "key: " + key + " oldValue: " + oldValue + " newValue: " + newValue
        );

        if (oldValue !== "") dimWord(document.body, oldValue);
        if (newValue !== "") {
          hltWord(document.body, newValue, rainbowColor[key]);
          rainbow[key] = newValue;
        }
      }
    }
  }

  browser.storage.onChanged.addListener(storageChangeListener);
}

var running;
if (running === undefined) {
  main();
  running = true;
  console.log("first time run highlight.js on this page");
} else {
  console.log("try to run highlight.js again on same page");
}
