# Deploying socialstudios.in

A static Vite/React frontend (served by nginx) **plus** a Node + SQLite API
(systemd service, proxied by nginx at `/api`). The admin panel lives at `/admin`.

| Script | When | Command |
|--------|------|---------|
| `setup-server.sh` | Once, first time | `sudo bash deploy/setup-server.sh` |
| `setup-api.sh` | Once, after setup-server | `sudo bash deploy/setup-api.sh` |
| `enable-cloudflare-ssl.sh` | Once, after DNS is pointed | `sudo bash deploy/enable-cloudflare-ssl.sh` |
| `update.sh` | Every time you ship changes | `sudo bash deploy/update.sh` |

## First-time deploy

1. **Clone + build the site and configure nginx** (adds the `/api` proxy):
   ```bash
   sudo git clone https://github.com/2026Pacewalk/social-studio-website.git /var/www/social-studio
   cd /var/www/social-studio
   sudo bash deploy/setup-server.sh
   ```

2. **Start the API** (installs deps, creates `server/.env`, runs it as a service):
   ```bash
   sudo bash deploy/setup-api.sh
   ```
   This prints your **admin login** (email + a generated password). Save it and
   change the password after first sign-in at `https://socialstudios.in/admin`.

3. **HTTPS** (Cloudflare Origin Certificate — also adds the `/api` proxy to the
   HTTPS block):
   ```bash
   sudo bash deploy/enable-cloudflare-ssl.sh
   ```

## Admin panel

- URL: `https://socialstudios.in/admin`
- Manages: **Leads**, **Portfolio**, **Testimonials**, **Users** (roles: admin/editor).
- The public site reads portfolio + testimonials from the API and posts contact
  enquiries to it (stored as leads + optional email alert).

## Lead alert emails (optional)

Edit `server/.env` and fill the `SMTP_*` values (for Zoho: `smtp.zoho.in`, port
`465`, your full email as user, an **app password** as pass), then:
```bash
sudo systemctl restart social-studios-api
```
Leave SMTP blank to disable emails — leads are still saved to the dashboard.

## Useful commands

```bash
sudo systemctl status social-studios-api      # service status
sudo journalctl -u social-studios-api -n 50    # API logs
curl -s http://127.0.0.1:4000/api/health       # health check
```

## Shipping future updates

```bash
cd /var/www/social-studio && sudo bash deploy/update.sh
```

The SQLite database (`server/data/`), uploaded images (`server/uploads/`), and
`server/.env` are git-ignored and persist across updates.
