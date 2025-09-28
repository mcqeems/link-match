## Email notifications (Gmail SMTP)

This project can send email notifications when a user connects with another user. It uses Gmail SMTP via Nodemailer.

Environment variables required:

- GMAIL_USER: Your Gmail address (notifications sender)
- GMAIL_PASS: An App Password created in Google Account (2FA required)
- EMAIL_FROM (optional): Custom From header; defaults to GMAIL_USER
- BASE_URL: Base URL for generating links in emails (e.g. http://localhost:3000)

Steps to set up Gmail App Password:

1. Enable 2-Step Verification on your Google account.
2. Go to Security > App passwords.
3. Create a new App Password for "Mail" on "Other" or "Windows".
4. Copy the 16-character password and set it as GMAIL_PASS.

Server actions added:

- requestConnection(otherUserId: string): Sends a connection request email to the target user.
- createOrFindConversation(otherUserId: string): When a new conversation is created, it triggers a connection email to the other user.

Both actions run on the server and require the user to be authenticated.
