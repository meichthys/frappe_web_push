/**
 * Frappe Web Push — Native Browser Toast Notifications
 *
 * Uses the browser Notification API (window.Notification) to show OS-level
 * toast notifications whenever a Frappe Notification Log is created for the
 * current user.
 *
 * How it works:
 *  1. On desk load, request Notification permission from the user (once).
 *  2. Listen for the "browser_notification" realtime event published by the
 *     server-side hook in frappe_web_push.api.notify.
 *  3. Call new Notification(title, options) to show the native OS toast.
 *  4. Clicking the toast focuses the Frappe tab and navigates to the document.
 */

(function () {
  "use strict";

  if (typeof window === "undefined" || !("Notification" in window)) {
    // Browser does not support the Notification API
    return;
  }

  function init() {
    if (
      !frappe ||
      !frappe.session ||
      !frappe.session.user ||
      frappe.session.user === "Guest"
    ) {
      return;
    }

    requestPermission();
    listenForNotifications();
  }

  // ---------------------------------------------------------------------------
  // Permission
  // ---------------------------------------------------------------------------

  function requestPermission() {
    if (Notification.permission === "granted" || Notification.permission === "denied") {
      return; // Already decided
    }

    // Only prompt if the user has interacted with the page to avoid auto-blocked prompts
    var prompted = false;

    function prompt() {
      if (prompted) return;
      prompted = true;
      Notification.requestPermission().catch(function () {});
    }

    document.addEventListener("click", prompt, { once: true });
    document.addEventListener("keydown", prompt, { once: true });
  }

  // ---------------------------------------------------------------------------
  // Realtime listener
  // ---------------------------------------------------------------------------

  function listenForNotifications() {
    // frappe.realtime is available after the desk bundle initialises
    if (!frappe.realtime) {
      return;
    }

    frappe.realtime.on("browser_notification", function (data) {
      showNotification(data);
    });
  }

  // ---------------------------------------------------------------------------
  // Show native toast
  // ---------------------------------------------------------------------------

  function showNotification(data) {
    if (Notification.permission !== "granted") return;
    if (!data || !data.body) return;

    var title = data.title || "Frappe";
    var options = {
      body: data.body,
      icon: "/assets/frappe/images/frappe-favicon.svg",
      badge: "/assets/frappe/images/frappe-favicon.svg",
      tag: data.url || "frappe-notification", // deduplicate same-url notifications
      renotify: true,
    };

    var notification = new Notification(title, options);

    notification.onclick = function () {
      window.focus();
      if (data.url) {
        window.location.href = data.url;
      }
      notification.close();
    };
  }

  // ---------------------------------------------------------------------------
  // Boot: wait for Frappe desk to be ready
  // ---------------------------------------------------------------------------

  if (typeof frappe !== "undefined" && frappe.ready) {
    frappe.ready(init);
  } else {
    // Fallback for cases where this script loads before the frappe global
    var attempts = 0;
    var interval = setInterval(function () {
      attempts++;
      if (
        typeof frappe !== "undefined" &&
        frappe.session &&
        frappe.session.user &&
        frappe.session.user !== "Guest"
      ) {
        clearInterval(interval);
        init();
      } else if (attempts > 40) {
        clearInterval(interval);
      }
    }, 250);
  }
})();
