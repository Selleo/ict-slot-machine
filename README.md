# Slot machine

## Prerequisites

[asdf](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf)

## Redis

https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-linux/

## Build

Run:

```
pnpm build
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

### Raspberry Pi 5
Currently you can't install Redis from apt repository because it's compiled for the systems that have a different page size than Raspberry Pi OS has (16 kB).

You have to install Redis from sourse:
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-from-source/

And configure it properly:
https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/#install-redis-properly
