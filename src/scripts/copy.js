// Shared copy-to-clipboard wiring for code panels.
// Buttons carry data-copy="<target-id>"; the target element's innerText is copied.
// Feedback is a temporary "已复制" label state - no toast, no new hues.

export function initCopyButtons(root = document) {
  const buttons = root.querySelectorAll("[data-copy]");
  buttons.forEach((btn) => {
    if (btn.dataset.copyInit === "true") return;
    btn.dataset.copyInit = "true";
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-copy");
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      const text = target.innerText.replace(/\n{3,}/g, "\n\n").trim();
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        ok = false;
      }
      if (!ok) {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
        ta.remove();
      }
      const label = btn.querySelector("[data-copy-label]");
      const original = label ? label.textContent : "";
      if (label) label.textContent = ok ? "已复制" : "复制失败";
      if (ok) btn.setAttribute("data-copied", "true");
      window.setTimeout(() => {
        if (label) label.textContent = original;
        btn.removeAttribute("data-copied");
      }, 1600);
    });
  });
}
