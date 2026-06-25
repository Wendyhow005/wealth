/* ============================================================
   Sterling & Vale Advisory — script.js
   Vanilla JS: nav, scroll animations, carousel, form AJAX.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 1. Navbar: scrolled state + mobile toggle ---------- */
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");

  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    // Close the mobile menu after clicking any link
    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------- 2. Scroll-in animations (IntersectionObserver) ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 3. Testimonials carousel ---------- */
  var track = document.getElementById("carousel-track");
  if (track) {
    var slides = Array.prototype.slice.call(track.children);
    var prevBtn = document.getElementById("prev");
    var nextBtn = document.getElementById("next");
    var dotsWrap = document.getElementById("dots");
    var index = 0;
    var timer = null;
    var DELAY = 6000;

    // Build dots
    var dots = slides.map(function (_, i) {
      var d = document.createElement("button");
      d.className = "dot";
      d.setAttribute("role", "tab");
      d.setAttribute("aria-label", "Go to testimonial " + (i + 1));
      d.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(d);
      return d;
    });

    function update() {
      track.style.transform = "translateX(" + (-index * 100) + "%)";
      dots.forEach(function (d, i) {
        d.setAttribute("aria-selected", String(i === index));
      });
    }
    function go(i) { index = (i + slides.length) % slides.length; update(); }
    function next() { go(index + 1); }
    function prev() { go(index - 1); }

    function start() { timer = window.setInterval(next, DELAY); }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // Pause on hover / focus
    var carousel = track.closest(".carousel");
    if (carousel) {
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      carousel.addEventListener("focusin", stop);
      carousel.addEventListener("focusout", start);
    }

    update();
    if (!reduceMotion) start();
  }

  /* ---------- 4. Enquiry form + FormSubmit AJAX ---------- */
  // REPLACE_WITH_YOUR_EMAIL — change the address below to receive enquiries.
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/wendy.how@redbeaconam.com";
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var form = document.getElementById("enquiry-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var submitBtn = document.getElementById("submit-btn");
    var successEl = document.getElementById("form-success");

    function showError(id, msg) {
      var input = document.getElementById(id);
      var errEl = document.getElementById(id + "-error");
      if (errEl) errEl.textContent = msg;
      if (input) input.setAttribute("aria-invalid", "true");
    }
    function clearError(id) {
      var input = document.getElementById(id);
      var errEl = document.getElementById(id + "-error");
      if (errEl) errEl.textContent = "";
      if (input) input.removeAttribute("aria-invalid");
    }

    function validate() {
      var ok = true;
      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();

      clearError("name"); clearError("email"); clearError("message");

      if (!name) { showError("name", "Please enter your full name."); ok = false; }
      if (!email) { showError("email", "Please enter your email."); ok = false; }
      else if (!EMAIL_RE.test(email)) { showError("email", "Please enter a valid email address."); ok = false; }
      if (!message) { showError("message", "Please add a short message."); ok = false; }

      return ok;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.classList.remove("error");

      // Honeypot tripped → silently pretend success (likely a bot)
      if (form._honey && form._honey.value) { return; }

      if (!validate()) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.classList.add("error");
        return;
      }

      var payload = {
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        interest: form.interest.value,
        message: form.message.value.trim(),
        _subject: "New Wealth Blueprint request — Sterling & Vale website",
        _template: "table",
        _captcha: "false"
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          if (!res.ok) throw new Error("Network response was not ok (" + res.status + ")");
          return res.json();
        })
        .then(function () {
          // Success: hide the form, show the friendly message
          form.hidden = true;
          if (successEl) successEl.hidden = false;
          form.reset();
        })
        .catch(function () {
          statusEl.textContent = "Something went wrong. Please try again, or email us directly.";
          statusEl.classList.add("error");
          submitBtn.disabled = false;
          submitBtn.innerHTML = "Claim my free Blueprint &rarr;";
        });
    });
  }

  /* ---------- 5. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
