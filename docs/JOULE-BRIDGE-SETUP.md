# Joule Bridge Setup Guide

## Overview

The Joule Bridge is a dedicated hardware device that enables **local-only** thermostat control using the HomeKit Accessory Protocol (HAP) over IP. It acts as a bridge between your web app and your HomeKit-compatible thermostat.

### Why Joule Bridge?

- **⚡ Latency**: Milliseconds instead of 2-5 seconds (critical for short cycle protection)
- **🔒 Reliability**: Works offline, no cloud dependencies
- **🛡️ Privacy**: All communication stays on your local network
- **📊 Granularity**: High refresh rates for precise control
- **🚫 No API Limits**: Ecobee shut down developer access? We don't need it.

## Architecture

```
┌─────────────┐         ┌──────────────┐         ┌──────────┐
│  Browser    │────────▶│  Nginx       │────────▶│  Ecobee  │
│  (Laptop)   │  HTTP   │  (Port 80)   │   HAP   │          │
└─────────────┘         └──────┬───────┘         └──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Joule Bridge       │
                    │  (Python, Port 8080)│
                    │  + React Dashboard  │
                    └─────────────────────┘
        All on Local Network (No Cloud Required)
```

**Architecture Options:**
- **Self-Hosted (Recommended)**: Dashboard runs on Bridge via Nginx. Everything local.
- **Cloud-Hosted**: Dashboard on Netlify, connects to Bridge API. Requires internet.

## Hardware Requirements

- **Joule Bridge device** (based on Raspberry Pi Zero 2 W or compatible)
- MicroSD card (8GB minimum, 16GB+ recommended, Class 10 or better)
- Power supply (5V, 2.5A minimum, official power supply recommended)
- Ethernet cable OR WiFi connection (WiFi built-in on most Bridge models)
- Computer with SD card reader (for initial setup)
- Ecobee thermostat with HomeKit support

## Installation

### Step 1: Flash the Bridge

**What you'll need:**
- Joule Bridge device
- MicroSD card (8GB minimum, 16GB+ recommended)
- Computer with SD card reader
- USB power supply (5V, 2.5A)

**Step-by-step instructions:**

1. **Download the imaging software:**
   - Download [Raspberry Pi Imager](https://www.raspberrypi.com/software/) for your computer (Windows, Mac, or Linux)
   - Install and launch the application

2. **Select the operating system:**
   - Click "Choose OS"
   - Select "Raspberry Pi OS (other)"
   - Choose "Raspberry Pi OS Lite (64-bit)" - this is the recommended version (no desktop GUI, smaller footprint)

3. **Select your storage:**
   - Insert your microSD card into your computer's card reader
   - Click "Choose Storage"
   - Select your microSD card from the list
   - ⚠️ **Warning**: Make sure you select the correct drive! All data will be erased.

4. **Configure settings (click the gear icon):**
   - **Enable SSH**: Check "Enable SSH" and set a password (write this down!)
   - **Set username and password**: 
     - Username: `pi` (or your preferred username)
     - Password: Choose a strong password (write this down!)
   - **Configure WiFi** (if using WiFi instead of Ethernet):
     - Check "Configure wireless LAN"
     - Enter your WiFi network name (SSID)
     - Enter your WiFi password
     - Select your country from the dropdown
   - **Set locale settings**:
     - Timezone: Select your timezone
     - Keyboard layout: Select your keyboard layout
   - Click "Save" to apply settings

5. **Flash the image:**
   - Click "Write" to begin flashing
   - Confirm the warning (this will erase all data on the SD card)
   - Wait for the process to complete (5-10 minutes depending on SD card speed)
   - You'll see "Write successful" when finished

6. **Eject the SD card safely:**
   - On Windows: Right-click the drive → Eject
   - On Mac: Drag the drive to Trash
   - On Linux: Unmount the drive before removing

7. **Insert SD card into Bridge:**
   - Power off the Bridge (if it was on)
   - Insert the microSD card into the Bridge's SD card slot
   - Connect the power supply
   - The Bridge will boot automatically (LED indicators will show activity)

### Step 2: Initial Bridge Setup

**Connect to your Bridge:**

**Option A: Using SSH (Recommended)**
1. Find your Bridge's IP address:
   - Check your router's admin page for connected devices
   - Or use network scanner: `nmap -sn 192.168.1.0/24` (replace with your network range)
   - Or try: `raspberrypi.local` (if mDNS works on your network)

2. Open a terminal/command prompt and connect:
   ```bash
   ssh pi@raspberrypi.local
   # Or use the IP address:
   # ssh pi@192.168.1.100
   ```
   - Enter the password you set during imaging
   - First connection: Type "yes" to accept the host key fingerprint

**Option B: Using Ethernet (if WiFi didn't work)**
1. Connect an Ethernet cable from your Bridge to your router
2. Wait 30 seconds for the Bridge to get an IP address
3. Check your router's admin page for the Bridge's IP address
4. Connect via SSH as shown above

**Initial system setup:**

```bash
# Once connected via SSH, update the system
sudo apt update && sudo apt upgrade -y

# This may take 5-15 minutes depending on your internet speed
# Answer "Y" if prompted to continue

# Install Python and required dependencies
sudo apt install -y python3 python3-pip python3-venv git curl

# Verify Python installation
python3 --version
# Should show Python 3.x.x

# Create directory for Joule Bridge software
cd ~
mkdir joule-bridge
cd joule-bridge

# You'll need to copy server.py and requirements.txt here
# Options:
# 1. Use SCP from your computer: scp server.py requirements.txt pi@raspberrypi.local:~/joule-bridge/
# 2. Use git: git clone <repository-url>
# 3. Create the files directly using nano: nano server.py
```

### Step 3: Install Python Dependencies

```bash
# Make sure you're in the joule-bridge directory
cd ~/joule-bridge

# Create a virtual environment (recommended for isolation)
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# You should see (venv) in your prompt now

# Upgrade pip to latest version
pip install --upgrade pip

# Install all required dependencies
pip install -r requirements.txt

# This may take a few minutes
# Common dependencies include:
# - aiohttp (web server)
# - aiohomekit (HomeKit protocol)
# - zeroconf (mDNS discovery)

# Verify installation
pip list
# You should see all packages listed
```

### Step 4: Test the Service

**Before running as a service, test it manually:**

```bash
# Make sure you're in the joule-bridge directory
cd ~/joule-bridge

# Make sure virtual environment is activated
source venv/bin/activate

# Run the service manually
python3 server.py
```

**Expected output:**
```
Starting Joule Bridge...
HomeKit controller initialized
Joule Bridge listening on http://0.0.0.0:8080
```

**Test the service:**
- Open a new terminal/SSH session (keep the first one running)
- Test the health endpoint from the Bridge:
  ```bash
  curl http://localhost:8080/health
  ```
- You should see a response indicating the service is running

**Verify network access:**
- From your laptop/computer on the same network, open a web browser
- Visit: `http://raspberrypi.local:8080/health` (or use the Bridge's IP address)
- You should see a response indicating the service is reachable on your network
- This confirms the Bridge is accessible from your web app

**If you see errors:**
- Check that all dependencies are installed: `pip list`
- Verify Python version: `python3 --version` (should be 3.7+)
- Check the error messages and review the troubleshooting section below

**Stop the test:**
- Press `Ctrl+C` in the terminal where server.py is running
- We'll set it up as a service next so it runs automatically

### Step 5: Configure as System Service

**Create the systemd service file:**

```bash
# Create the service file
sudo nano /etc/systemd/system/joule-bridge.service
```

**Copy and paste this configuration:**
```ini
[Unit]
Description=Joule Bridge HomeKit Controller
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/joule-bridge
ExecStart=/home/pi/joule-bridge/venv/bin/python3 /home/pi/joule-bridge/server.py
Restart=always
RestartSec=10
Environment="PATH=/home/pi/joule-bridge/venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"

[Install]
WantedBy=multi-user.target
```

**Save and exit:**
- Press `Ctrl+X` to exit
- Press `Y` to confirm save
- Press `Enter` to confirm filename

**Enable and start the service:**

```bash
# Reload systemd to recognize the new service
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable joule-bridge

# Start the service now
sudo systemctl start joule-bridge

# Check the status
sudo systemctl status joule-bridge
```

**Expected status output:**
- Should show "active (running)" in green
- Should show the service is enabled

**View logs:**
```bash
# View recent logs
sudo journalctl -u joule-bridge -n 50

# Follow logs in real-time
sudo journalctl -u joule-bridge -f
```

**If the service fails to start:**
- Check logs: `sudo journalctl -u joule-bridge -n 50`
- Verify file paths in the service file match your setup
- Make sure the virtual environment path is correct
- Test manually first (Step 4) to identify any errors

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

Or from the web app Settings → Joule Bridge → Discover Devices

This will list all HomeKit devices on your network, including your Ecobee.

### Step 3: Pair with Device

From the web app:

1. Go to **Settings → Joule Bridge**
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

### Option 1: Self-Host Dashboard on Bridge (Recommended)

**Why self-host?**
- ⚡ Instant speed (local network)
- 🔒 Complete privacy (no cloud)
- 🛡️ Works offline
- 🎯 No mixed content issues (everything on same network)

**Setup:**
1. Follow the [Self-Hosting Guide](SELF-HOSTING-NGINX.md) to install Nginx on your Bridge
2. Deploy the dashboard: `npm run deploy:pi`
3. Access at: `http://joule.local` (or your Bridge's IP)

### Option 2: Use Netlify (Cloud Hosting)

If you prefer cloud hosting for the dashboard:

1. Go to **Settings → Joule Bridge**
2. Enter your Bridge's IP address or hostname:
   - `http://raspberrypi.local:8080` (if mDNS works)
   - `http://192.168.1.100:8080` (use your Bridge's IP)
3. Click **"Save"**

The web app will automatically detect and use Joule Bridge when available.

**Note:** Self-hosting on the Bridge is recommended for the best experience and aligns with the "Sovereign / No Cloud" philosophy.

## Troubleshooting

### Device Not Found

**Symptoms**: Discovery returns empty list

**Solutions**:

- Ensure Ecobee and Bridge are on the same network
- Check that HomeKit is enabled on Ecobee
- Verify mDNS/Bonjour is working: `avahi-browse -a`
- Try restarting the discovery process
- Check firewall: `sudo ufw allow 8080`

### Pairing Fails

**Symptoms**: Pairing request returns error

**⚠️ CRITICAL: Unpair from Apple Home First**

**If your Ecobee is already paired to Apple HomeKit (on your iPhone), you MUST unpair it first. HomeKit devices can only have one controller at a time.**

**To unpair from Apple Home:**
1. Open the **Home** app on your iPhone/iPad
2. Find your Ecobee thermostat
3. Long-press the device → **Settings** → Scroll down → **Remove Accessory**
4. Confirm removal
5. Wait 30 seconds, then try pairing with Joule Bridge again

**Other Solutions**:

- Verify the pairing code is correct (8 digits, format XXX-XX-XXX)
- Ensure the Ecobee is in pairing mode (code displayed on thermostat screen)
- Check that no other HomeKit controller is already paired
- Check logs: `journalctl -u joule-bridge -f`
- Try rebooting the Bridge: `sudo systemctl restart joule-bridge`

### Connection Drops

**Symptoms**: Status requests fail, device appears disconnected

**Solutions**:

- Check network connectivity: `ping ecobee-ip`
- Verify the Bridge has a stable IP address (consider static IP)
- Check logs: `journalctl -u joule-bridge -f`
- Restart service: `sudo systemctl restart joule-bridge`
- Verify pairing is still valid: `curl http://localhost:8080/api/paired`

### Service Won't Start

**Symptoms**: `systemctl status` shows failed

**Solutions**:

- Check logs: `journalctl -u joule-bridge -n 50`
- Verify Python path in service file
- Check virtual environment is activated correctly
- Verify dependencies: `pip list | grep aiohomekit`
- Test manually: `python3 server.py`

### Web App Can't Connect

**Symptoms**: Web app shows "Bridge not available"

**Solutions**:

- Verify Bridge is running: `ssh pi@raspberrypi.local`
- Check service is running: `sudo systemctl status joule-bridge`
- Test health endpoint: `curl http://raspberrypi.local:8080/health`
- Verify URL in web app settings
- Check CORS is enabled (should be automatic)
- Check firewall on Bridge: `sudo ufw status`

## Advanced Configuration

### Static IP Address

To ensure your Bridge always has the same IP:

**Option 1: Router DHCP Reservation (Recommended - Easiest)**

1. Log into your router's admin interface (usually `192.168.1.1` or `192.168.0.1`)
2. Find "DHCP Reservations" or "Static IP Assignment"
3. Find your Bridge in the connected devices list (look for hostname `raspberrypi` or MAC address)
4. Assign a static IP address (e.g., `192.168.1.100`)
5. Save and reboot your Bridge: `sudo reboot`

**Option 2: NetworkManager (Raspberry Pi OS Bookworm 2024+)**

If you're running Raspberry Pi OS Bookworm (2024 or later), use NetworkManager:

1. Use the graphical tool: `sudo nmtui`
2. Or use command line: `nmcli connection modify "Wired connection 1" ipv4.addresses 192.168.1.100/24`
3. Reboot: `sudo reboot`

**Option 3: Legacy Method (Pre-Bookworm)**

For older Raspberry Pi OS versions (Bullseye and earlier):

1. Edit `/etc/dhcpcd.conf`:
   ```
   interface wlan0
   static ip_address=192.168.1.100/24
   static routers=192.168.1.1
   static domain_name_servers=192.168.1.1 8.8.8.8
   ```
2. Reboot: `sudo reboot`

**Note:** Router DHCP reservation (Option 1) is the safest method and works regardless of OS version. It's recommended for most users.

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
2. ✅ Configure web app to use Joule Bridge
3. ✅ Test temperature control
4. ✅ Test mode changes (heat/cool/off)
5. ✅ Implement short cycle protection
6. ✅ Add scheduling and away mode
7. ✅ Create mobile app companion

## Support

For issues or questions:

- Check logs: `journalctl -u joule-bridge -f`
- Review this guide
- Check GitHub issues (if applicable)
- Test API endpoints directly with `curl`

## Migration from Ecobee Cloud API

If you were using the Ecobee Cloud API:

1. **Unpair from Ecobee Cloud** (optional, but recommended)
2. **Set up Joule Bridge** (this guide)
3. **Pair via HomeKit** (pairing process above)
4. **Update web app settings** to use Joule Bridge URL

The web app will automatically prefer Joule Bridge over Ecobee Cloud API when both are available.
