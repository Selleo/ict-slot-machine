# Slot machine

## Services setup

### /lib/systemd/system/kiosk-cursor.service

```conf
[Unit]
Description=Hide cursor
After=systemd-user-sessions.service

[Service]
ExecStart=/usr/bin/unclutter -idle 1
User=pi

[Install]
Alias=kiosk-cursor.service
```

### /lib/systemd/system/kiosk.service

```conf
[Unit]
Description=Kiosk
After=systemd-user-sessions.service
Requires=redis.service

[Service]
WorkingDirectory=/home/pi/projects/oab/
ExecStart=/home/pi/projects/oab/start.sh
LimitNOFILE=4096
IgnoreSIGPIPE=false
Type=simple

[Install]
Alias=kiosk.service
WantedBy=multi-user.target
```

Enable & start services:

```bash
systemctl --system daemon-reload # reload configs
systemctl enable kiosk
systemctl start kiosk
systemctl enable kiosk-cursor
systemctl start kiosk-cursor
```

### ~/.config/autostart/chromium.desktop

```
[Desktop Entry]
Version=1.0
Type=Application
Name=Kiosk
Exec=/usr/bin/chromium-browser --kiosk --incognito  http://localhost:3000
```

Reboot and check if services are working:
```bash
systemctl status kiosk
```
