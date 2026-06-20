# Deploying socialstudios.in

The site is a static Vite/React build served by nginx. Three scripts:

| Script | When | Command |
|--------|------|---------|
| `setup-server.sh` | Once, first time | `sudo bash deploy/setup-server.sh` |
| `enable-ssl.sh` | Once, after DNS is pointed | `sudo bash deploy/enable-ssl.sh` |
| `update.sh` | Every time you ship changes | `sudo bash deploy/update.sh` |

## First-time deploy

1. **On the server**, clone the repo and run setup:
   ```bash
   sudo git clone https://github.com/2026Pacewalk/social-studio-website.git /var/www/social-studio
   cd /var/www/social-studio
   sudo bash deploy/setup-server.sh
   ```
   The site is now live over HTTP. Verify with `curl -I http://socialstudios.in`.

2. **Point DNS** at your domain registrar (where you bought socialstudios.in):
   | Type | Name | Value |
   |------|------|-------|
   | A | `@`   | `<your server's public IP>` |
   | A | `www` | `<your server's public IP>` |

   Wait for it to propagate (usually minutes, up to a few hours).

3. **Enable HTTPS** once DNS resolves to the server:
   ```bash
   sudo bash deploy/enable-ssl.sh
   ```

## Shipping future updates

```bash
cd /var/www/social-studio
sudo bash deploy/update.sh
```
