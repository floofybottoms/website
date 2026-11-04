/* ============================================================
   FEEDBACK FORMS SETTINGS: paste your two Web3Forms access keys here.
   Each key sends to the email address it was created with.
   ============================================================ */
const FORM_KEYS = {
  bug: "ca43cc37-d5ac-45a1-87cc-26d0a10160ef",      // key created with floofybottoms.support@gmail.com
  feedback: "b5b7103d-e8c9-4b83-91b9-9852f939f84f", // key created with amaizeinmazes@protonmail.com
};
/* ============================================================ */

(function () {
  const dialogs = {};
  document.querySelectorAll("dialog.form-dialog").forEach((d) => (dialogs[d.dataset.form] = d));

  // open buttons
  document.querySelectorAll("[data-open-form]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const d = dialogs[btn.dataset.openForm];
      if (!d) return;
      resetDialog(d);
      d.showModal();
      const first = d.querySelector("textarea, input:not([type=hidden]):not([type=checkbox])");
      if (first) first.focus();
    })
  );

  Object.values(dialogs).forEach((d) => {
    // close buttons and clicking the dark backdrop
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => d.close()));
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });

    const form = d.querySelector("form");
    const status = d.querySelector(".form-status");
    const sendBtn = form.querySelector("button[type=submit]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const key = FORM_KEYS[d.dataset.form];
      if (!key) {
        showStatus(status, "error", "This form isn't switched on yet. Please email us instead: floofybottoms.support@gmail.com");
        return;
      }
      const data = new FormData(form);
      if (data.get("botcheck")) return; // spam trap: real people never tick this hidden box
      data.append("access_key", key);
      const kind = data.get("feedback_type");
      data.append("subject", d.dataset.form === "bug"
        ? "🐛 Bug report: A Maize in Mazes"
        : "🌽 Feedback (" + (kind || "General") + "): A Maize in Mazes");
      data.append("from_name", "A Maize in Mazes website");
      data.append("page", location.href);

      sendBtn.disabled = true;
      sendBtn.textContent = "Sending…";
      showStatus(status, "", "");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success) {
          form.hidden = true;
          d.querySelector(".form-thanks").hidden = false;
        } else {
          throw new Error(json.message || "Send failed");
        }
      } catch (err) {
        showStatus(status, "error", "Hmm, that didn't send. Please try again, or email floofybottoms.support@gmail.com.");
      } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = sendBtn.dataset.label;
      }
    });
  });

  function resetDialog(d) {
    const form = d.querySelector("form");
    form.hidden = false;
    d.querySelector(".form-thanks").hidden = true;
    showStatus(d.querySelector(".form-status"), "", "");
  }
  function showStatus(el, type, msg) {
    el.className = "form-status" + (type ? " " + type : "");
    el.textContent = msg;
  }
})();
