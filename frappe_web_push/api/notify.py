"""
frappe_web_push.api.notify
~~~~~~~~~~~~~~~~~~~~~~~~~~
doc_events hook that publishes a realtime event containing the full
Notification Log payload so the browser can show a native OS toast via the
Web Notification API (no service worker / VAPID / push server required).
"""

import frappe


def send_browser_notification(doc, method=None):
    """Called after a Notification Log is inserted.

    Publishes a ``browser_notification`` realtime event to the recipient's
    browser session.  The front-end (web_push_init.js) listens for this event
    and calls ``new Notification(...)`` to show a native OS toast.
    """
    if not doc.for_user:
        return

    site_url = frappe.utils.get_url()

    if doc.link:
        # Some alerts (e.g. Prepared Report) set an explicit link instead of a document reference
        url = doc.link if doc.link.startswith("http") else f"{site_url}{doc.link}"
    elif doc.document_type and doc.document_name:
        url = f"{site_url}/app/{frappe.utils.slug(doc.document_type)}/{doc.document_name}"
    else:
        url = f"{site_url}/app/notification-log"

    frappe.publish_realtime(
        event="browser_notification",
        message={
            "title": doc.email_header or _notification_type_label(doc.type),
            "body": frappe.utils.strip_html(doc.subject or ""),
            "url": url,
            "type": doc.type or "Alert",
        },
        user=doc.for_user,
        after_commit=True,
    )


def _notification_type_label(notification_type: str) -> str:
    labels = {
        "Mention": "New Mention",
        "Assignment": "New Assignment",
        "Share": "Document Shared",
        "Alert": "Notification",
        "Energy Point": "Energy Points",
        "": "Notification",
    }
    return labels.get(notification_type, "Notification")
