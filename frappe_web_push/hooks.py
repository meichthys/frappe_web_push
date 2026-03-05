app_name = "frappe_web_push"
app_title = "Frappe Web Push"
app_publisher = "Frappe"
app_description = "Native browser toast notifications for Frappe using the Notification API"
app_email = "developers@frappe.io"
app_license = "MIT"
required_apps = ["frappe"]

# Include on every desk page
app_include_js = ["/assets/frappe_web_push/js/web_push_init.js"]

# Hook into Notification Log: publish a rich realtime event for native notifications
doc_events = {
    "Notification Log": {
        "after_insert": "frappe_web_push.api.notify.send_browser_notification",
    }
}
