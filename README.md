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

Remember to change the configuration of the kiosk if you use above tutorial without a change of the service's name. You have to replace this line:

```
Requires=redis-server.service
```

With:

```
Requires=redis_6379.service
```

### Raspberry Pi 4

If you encounter this error using Raspberry Pi 4:

```
rpi_touchscreen_attiny 10-0045: Unknown Atmel firmware revision: 0xe1
```

You can try to add to `/boot/firmware/config.txt` this line:

```
dtparam=i2c_vc_baudrate=50000
```

It will change the baud rate of the display screen.
