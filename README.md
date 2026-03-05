# frappe_web_push

Native browser toast notifications for Frappe.

Installing this app will enable browser/OS-level toast notifications without the need for remote servers (like firebase or frappe-cloud).
Whenever a Frappe Notification Log is created (i.e assignments, mentions, shares, alerts, etc), a notification will be sent to the relevant user.

This app uses the browser Notification API instead of Frappe's existing WebSocket notifications which only display an in-app notification.
