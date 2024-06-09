# Slot machine

## Prerequisites

[asdf](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)

## Redis

https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

## Build

Run:

```
yarn build
```

And copy `dist/` to the Raspberry Pi.

## Services setup

### /lib/systemd/system/kiosk.service

```conf
[Unit]
Description=Kiosk
After=systemd-user-sessions.service
Requires=redis-server.service

[Service]
WorkingDirectory=/home/pi/projects/oab/
ExecStart=/home/pi/projects/oab/start.sh
LimitNOFILE=4096
IgnoreSIGPIPE=false
Type=simple
User=pi
Group=pi

[Install]
Alias=kiosk.service
WantedBy=multi-user.target
```

Enable & start services:

```bash
sudo systemctl --system daemon-reload # reload configs
sudo systemctl enable kiosk
sudo systemctl start kiosk
```

### ~/.config/autostart/chromium.desktop

```
[Desktop Entry]
Version=1.0
Type=Application
Name=Kiosk
Exec=bash -c "sleep 60 && /usr/bin/chromium-browser --kiosk --incognito http://localhost:8080"
```

Reboot and check if services are working:
```bash
systemctl status kiosk
```
