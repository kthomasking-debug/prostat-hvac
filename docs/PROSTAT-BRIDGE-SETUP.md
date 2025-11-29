# ProStat Bridge Setup Guide

## Overview

The ProStat Bridge is a Raspberry Pi-based HomeKit controller that enables **local-only** thermostat control using the HomeKit Accessory Protocol (HAP) over IP.

### Why ProStat Bridge?

- **⚡ Latency**: Milliseconds instead of 2-5 seconds (critical for short cycle protection)
- **🔒 Reliability**: Works offline, no cloud dependencies
- **🛡️ Privacy**: All communication stays on your local network
- **📊 Granularity**: High refresh rates for precise control
- **🚫 No API Limits**: Ecobee shut down developer access? We don't need it.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│  Web App    │────────▶│  ProStat Pi  │────────▶│  Ecobee  │
│  (React)    │  HTTP   │  (Python)    │   HAP   │          │
└─────────────┘         └──────────────┘         └──────────┘
     │                          │
     │                          │
     └──────────────────────────┘
        Local Network Only
```

## Hardware Requirements

- **Raspberry Pi Zero 2 W** (recommended) or any Raspberry Pi
- MicroSD card (8GB minimum, 16GB+ recommended)
- Power supply (5V, 2.5A for Pi Zero 2 W)
- Ethernet cable OR WiFi connection
- Ecobee thermostat with HomeKit support

## Installation

### Step 1: Flash Raspberry Pi OS

1. Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
2. Flash Raspberry Pi OS Lite (64-bit) to your microSD card
3. Enable SSH: Create `ssh` file in boot partition
4. Configure WiFi (optional): Create `wpa_supplicant.conf` in boot partition

### Step 2: Initial Pi Setup

```bash
# SSH into your Pi
ssh pi@raspberrypi.local

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python and dependencies
sudo apt install -y python3 python3-pip python3-venv git

# Clone or copy ProStat Bridge files
cd ~
mkdir prostat-bridge
cd prostat-bridge
# Copy server.py and requirements.txt here
```

### Step 3: Install Python Dependencies

```bash
# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 4: Test the Service

```bash
# Run the service
python3 server.py
```

You should see:

```
Starting ProStat Bridge...
HomeKit controller initialized
ProStat Bridge listening on http://0.0.0.0:8080
```

### Step 5: Configure as System Service

Create `/etc/systemd/system/prostat-bridge.service`:

```ini
[Unit]
Description=ProStat Bridge HomeKit Controller
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/prostat-bridge
ExecStart=/home/pi/prostat-bridge/venv/bin/python3 /home/pi/prostat-bridge/server.py
Restart=always
RestartSec=10
Environment="PATH=/home/pi/prostat-bridge/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable prostat-bridge
sudo systemctl start prostat-bridge
sudo systemctl status prostat-bridge
```

## Pairing Process

### Step 1: Enable HomeKit on Ecobee

1. On your Ecobee thermostat, navigate to:
   - **Menu → Settings → HomeKit**
2. Select **"Enable Pairing"**
3. The thermostat will display:
   - A QR code
   - An 8-digit pairing code (format: `XXX-XX-XXX`)

### Step 2: Discover Device

From your web app or via API:

```bash
curl http://raspberrypi.local:8080/api/discover
```

Or from the web app Settings → ProStat Bridge → Discover Devices

This will list all HomeKit devices on your network, including your Ecobee.

### Step 3: Pair with Device

From the web app:

1. Go to **Settings → ProStat Bridge**
2. Click **"Discover Devices"**
3. Find your Ecobee in the list
4. Enter the 8-digit pairing code from your thermostat
5. Click **"Pair"**

Or via API:

```bash
curl -X POST http://raspberrypi.local:8080/api/pair \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "XX:XX:XX:XX:XX:XX",
    "pairing_code": "123-45-678"
  }'
```

### Step 4: Verify Pairing

```bash
curl http://raspberrypi.local:8080/api/paired
```

Or check in the web app - you should see your thermostat listed.

## Web App Configuration

### Set Bridge URL

1. Go to **Settings → ProStat Bridge**
2. Enter your Pi's IP address or hostname:
   - `http://raspberrypi.local:8080` (if mDNS works)
   - `http://192.168.1.100:8080` (use your Pi's IP)
3. Click **"Save"**

The web app will automatically detect and use ProStat Bridge when available.

## Troubleshooting

### Device Not Found

**Symptoms**: Discovery returns empty list

**Solutions**:

- Ensure Ecobee and Pi are on the same network
- Check that HomeKit is enabled on Ecobee
- Verify mDNS/Bonjour is working: `avahi-browse -a`
- Try restarting the discovery process
- Check firewall: `sudo ufw allow 8080`

### Pairing Fails

**Symptoms**: Pairing request returns error

**Solutions**:

- Verify the pairing code is correct (8 digits, format XXX-XX-XXX)
- Ensure the Ecobee is in pairing mode (code displayed)
- Check that no other HomeKit controller is already paired
- Try unpairing from Apple Home first (if applicable)
- Check logs: `journalctl -u prostat-bridge -f`

### Connection Drops

**Symptoms**: Status requests fail, device appears disconnected

**Solutions**:

- Check network connectivity: `ping ecobee-ip`
- Verify the Pi has a stable IP address (consider static IP)
- Check logs: `journalctl -u prostat-bridge -f`
- Restart service: `sudo systemctl restart prostat-bridge`
- Verify pairing is still valid: `curl http://localhost:8080/api/paired`

### Service Won't Start

**Symptoms**: `systemctl status` shows failed

**Solutions**:

- Check logs: `journalctl -u prostat-bridge -n 50`
- Verify Python path in service file
- Check virtual environment is activated correctly
- Verify dependencies: `pip list | grep aiohomekit`
- Test manually: `python3 server.py`

### Web App Can't Connect

**Symptoms**: Web app shows "Bridge not available"

**Solutions**:

- Verify Pi is running: `ssh pi@raspberrypi.local`
- Check service is running: `sudo systemctl status prostat-bridge`
- Test health endpoint: `curl http://raspberrypi.local:8080/health`
- Verify URL in web app settings
- Check CORS is enabled (should be automatic)
- Check firewall on Pi: `sudo ufw status`

## Advanced Configuration

### Static IP Address

To ensure your Pi always has the same IP:

1. Edit `/etc/dhcpcd.conf`:

   ```
   interface wlan0
   static ip_address=192.168.1.100/24
   static routers=192.168.1.1
   static domain_name_servers=192.168.1.1 8.8.8.8
   ```

2. Reboot: `sudo reboot`

### Custom Port

Edit `server.py` and change:

```python
site = web.TCPSite(runner, '0.0.0.0', 8080)  # Change 8080 to your port
```

### Multiple Thermostats

The bridge supports multiple paired devices. Use `device_id` parameter in API calls to target specific thermostats.

## Security Notes

- ✅ Service runs on local network only (0.0.0.0 means all interfaces, but stays on LAN)
- ✅ HomeKit uses end-to-end encryption
- ✅ Pairing requires physical access to thermostat
- ✅ No data leaves your network
- ⚠️ Consider adding authentication for production use
- ⚠️ Use HTTPS in production (requires reverse proxy)

## Next Steps

1. ✅ Pair your Ecobee
2. ✅ Configure web app to use ProStat Bridge
3. ✅ Test temperature control
4. ✅ Test mode changes (heat/cool/off)
5. ✅ Implement short cycle protection
6. ✅ Add scheduling and away mode
7. ✅ Create mobile app companion

## Support

For issues or questions:

- Check logs: `journalctl -u prostat-bridge -f`
- Review this guide
- Check GitHub issues (if applicable)
- Test API endpoints directly with `curl`

## Migration from Ecobee Cloud API

If you were using the Ecobee Cloud API:

1. **Unpair from Ecobee Cloud** (optional, but recommended)
2. **Set up ProStat Bridge** (this guide)
3. **Pair via HomeKit** (pairing process above)
4. **Update web app settings** to use ProStat Bridge URL

The web app will automatically prefer ProStat Bridge over Ecobee Cloud API when both are available.
