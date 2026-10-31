/* ============================================================
   SITE SETTINGS: the only part you should need to edit.
   ============================================================ */
const SITE = {
  steamUrl: "https://store.steampowered.com/app/5151180/",

  // When the buttons flip from "Wishlist / Join the Playtest" to "Buy".
  // "auto"      = flips by itself at releaseAt (below)
  // "prelaunch" = force the pre-launch buttons (use this if release slips)
  // "launched"  = force the launch buttons right now
  mode: "auto",
  releaseAt: "2026-11-06T10:00:00-08:00", // 10:00 AM Pacific, Steam's default release time
  price: "$3.99",

  // Trailer: paste the YouTube video ID (the part after "watch?v=") when it's ready.
  // Until then the page shows a looping clip (if loopVideo is set) or the fallback image.
  youtubeId: "",
  loopVideo: "", // e.g. "/assets/img/gameplay-loop.mp4"
};

/* ============================================================ */

(function () {
  const root = document.documentElement;

  // ---- launch switch ----
  const launched =
    SITE.mode === "launched" ||
    (SITE.mode === "auto" && Date.now() >= new Date(SITE.releaseAt).getTime());
  if (launched) root.classList.add("launched");

  document.querySelectorAll("[data-steam]").forEach((a) => (a.href = SITE.steamUrl));
  document.querySelectorAll("[data-pre][data-post]").forEach((el) => {
    el.textContent = (launched ? el.dataset.post : el.dataset.pre).replace("{price}", SITE.price);
  });

  // ---- trailer ----
  const frame = document.querySelector("[data-trailer]");
  if (frame) {
    if (SITE.youtubeId) {
      frame.innerHTML =
        '<iframe src="https://www.youtube-nocookie.com/embed/' +
        encodeURIComponent(SITE.youtubeId) +
        '?rel=0" title="A Maize in Mazes trailer" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
    } else if (SITE.loopVideo) {
      const poster = frame.querySelector("img");
      frame.innerHTML =
        '<video src="' + SITE.loopVideo + '" ' + (poster ? 'poster="' + poster.getAttribute("src") + '" ' : "") +
        'autoplay muted loop playsinline aria-label="Gameplay clip"></video><span class="video-badge">Trailer coming soon!</span>';
    }
  }

  // ---- googly eyes ----
  // data-mode="track": the pupil looks at the cursor.
  // data-mode="wild":  a loose googly pupil. Gravity pulls it down, and every mouse
  //                    move, scroll or tap knocks it in a random direction, so it
  //                    rattles off the rim and wobbles to a stop.
  const pupils = [...document.querySelectorAll(".pupil")];
  if (pupils.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const eyes = pupils.map((p) => ({
      el: p, mode: p.dataset.mode || "track",
      cx: +p.dataset.cx, cy: +p.dataset.cy, reach: +p.dataset.reach,
      x: +p.getAttribute("cx") - +p.dataset.cx, y: +p.getAttribute("cy") - +p.dataset.cy,
      vx: 0, vy: 0,
    }));
    const wild = eyes.filter((e) => e.mode === "wild");
    const place = (e) => { e.el.setAttribute("cx", e.cx + e.x); e.el.setAttribute("cy", e.cy + e.y); };

    let running = false, lastX = null, lastY = null;
    const step = () => {
      let moving = false;
      for (const e of wild) {
        e.vy += 0.35;                     // gravity: googly pupils sink
        e.vx *= 0.94; e.vy *= 0.94;       // air drag
        e.x += e.vx; e.y += e.vy;
        const d = Math.hypot(e.x, e.y);
        if (d > e.reach) {                // hit the plastic rim: bounce
          const nx = e.x / d, ny = e.y / d;
          e.x = nx * e.reach; e.y = ny * e.reach;
          const dot = e.vx * nx + e.vy * ny;
          if (dot > 0) { e.vx -= 1.6 * dot * nx; e.vy -= 1.6 * dot * ny; }
          e.vx *= 0.9; e.vy *= 0.9;       // rubbing on the rim
        }
        place(e);
        if (Math.abs(e.vx) + Math.abs(e.vy) > 0.05) moving = true;
      }
      running = moving;
      if (moving) requestAnimationFrame(step);
    };
    const kick = (strength) => {
      for (const e of wild) {
        const a = Math.random() * Math.PI * 2;
        e.vx += Math.cos(a) * strength; e.vy += Math.sin(a) * strength;
      }
      if (!running) { running = true; requestAnimationFrame(step); }
    };

    window.addEventListener("pointermove", (ev) => {
      for (const e of eyes) {
        if (e.mode !== "track") continue;
        const box = e.el.ownerSVGElement.getBoundingClientRect();
        const vb = e.el.ownerSVGElement.viewBox.baseVal;
        const ex = box.left + (e.cx / vb.width) * box.width;
        const ey = box.top + (e.cy / vb.height) * box.height;
        const ang = Math.atan2(ev.clientY - ey, ev.clientX - ex);
        const dist = Math.min(e.reach, Math.hypot(ev.clientX - ex, ev.clientY - ey) / 8);
        e.x = Math.cos(ang) * dist; e.y = Math.sin(ang) * dist; place(e);
      }
      const speed = lastX === null ? 0 : Math.hypot(ev.clientX - lastX, ev.clientY - lastY);
      lastX = ev.clientX; lastY = ev.clientY;
      if (speed > 2) kick(Math.min(speed * 0.06, 2.5));
    }, { passive: true });
    window.addEventListener("scroll", () => kick(1.2), { passive: true });
    window.addEventListener("pointerdown", () => kick(5));
    kick(0.5); // let it drop into place on page load
  }

  // ---- screenshot lightbox ----
  const lb = document.querySelector(".lightbox");
  if (lb) {
    const img = lb.querySelector("img");
    const close = () => { lb.classList.remove("open"); document.body.style.overflow = ""; };
    document.querySelectorAll("[data-full]").forEach((b) =>
      b.addEventListener("click", () => {
        img.src = b.dataset.full;
        img.alt = b.querySelector("img").alt;
        lb.classList.add("open");
        document.body.style.overflow = "hidden";
        lb.querySelector("button").focus();
      })
    );
    lb.addEventListener("click", (e) => { if (e.target !== img) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  // ---- footer year ----
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
