# frappe_web_push

Native browser toast notifications for Frappe.

Installing this app will enable browser/OS-level toast notifications without the need for remote servers (like firebase or frappe-cloud).
Whenever a Frappe Notification Log is created (i.e assignments, mentions, shares, alerts, etc), a notification will be sent to the relevant user.

This app uses the browser Notification API instead of Frappe's existing WebSocket notifications which only display an in-app notification.

In order for the notifications to work, the recipient user must be logged in with their browser open. Notifications are not queued, so missed notifications will not be delivered when the user loggs in.

# Installation

```bash
# Pull the app
bench get-app https://github.com/meichthys/frappe_web_push.git

# Install the app
bench install-app frappe_web_push
```

Test notification by creating a `ToDo` and assigning it to another user who is logged in and has their browser open.