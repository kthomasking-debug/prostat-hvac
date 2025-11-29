# ProStat Bridge - HomeKit HAP Controller

Local-only thermostat control using HomeKit Accessory Protocol (HAP) over IP.

## Why HomeKit HAP?

- **Latency**: Milliseconds instead of 2-5 seconds (critical for short cycle protection)
- **Reliability**: Works offline, no cloud dependencies
- **Privacy**: All communication stays on your local network
- **Granularity**: High refresh rates for precise control

## Hardware Requirements

- Raspberry Pi Zero 2 W (recommended) or any Raspberry Pi
- Ethernet or WiFi connection
- Ecobee thermostat with HomeKit support

## Installation

### 1. Install Python Dependencies

```bash
cd prostat-bridge
pip3 install -r requirements.txt
```

### 2. Run the Service

```bash
python3 server.py
```

The service will start on `http://0.0.0.0:8080`

## Pairing Process

### Step 1: Enable HomeKit on Ecobee

1. On your Ecobee thermostat, go to: **Menu → Settings → HomeKit**
2. Select **"Enable Pairing"**
3. The thermostat will display:
   - A QR code
   - An 8-digit pairing code (format: XXX-XX-XXX)

### Step 2: Discover Device

From your web app or via API:

```bash
curl http://localhost:8080/api/discover
```

This will list all HomeKit devices on your network, including your Ecobee.

### Step 3: Pair with Device

```bash
curl -X POST http://localhost:8080/api/pair \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": "XX:XX:XX:XX:XX:XX",
    "pairing_code": "123-45-678"
  }'
```

Replace:

- `device_id` with the ID from the discover step
- `pairing_code` with the 8-digit code from your Ecobee

### Step 4: Verify Pairing

```bash
curl http://localhost:8080/api/paired
```

## API Endpoints

### Discover Devices

```
GET /api/discover
```

Returns list of HomeKit devices on the network.

### Pair with Device

```
POST /api/pair
Body: {
  "device_id": "XX:XX:XX:XX:XX:XX",
  "pairing_code": "123-45-678"
}
```

### Get Thermostat Status

```
GET /api/status?device_id=XX:XX:XX:XX:XX:XX
```

Returns current temperature, target temperature, mode, etc.

### Set Temperature

```
POST /api/set-temperature
Body: {
  "device_id": "XX:XX:XX:XX:XX:XX",
  "temperature": 72.0
}
```

### Set Mode

```
POST /api/set-mode
Body: {
  "device_id": "XX:XX:XX:XX:XX:XX",
  "mode": "heat"  // or "cool", "off", "auto"
}
```

### List Paired Devices

```
GET /api/paired
```

### Unpair Device

```
POST /api/unpair
Body: {
  "device_id": "XX:XX:XX:XX:XX:XX"
}
```

## Running as a Service

### systemd Service (Linux)

Create `/etc/systemd/system/prostat-bridge.service`:

```ini
[Unit]
Description=ProStat Bridge HomeKit Controller
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/prostat-bridge
ExecStart=/usr/bin/python3 /home/pi/prostat-bridge/server.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl enable prostat-bridge
sudo systemctl start prostat-bridge
sudo systemctl status prostat-bridge
```

## Troubleshooting

### Device Not Found

- Ensure Ecobee and Pi are on the same network
- Check that HomeKit is enabled on Ecobee
- Try restarting the discovery process

### Pairing Fails

- Verify the pairing code is correct (8 digits, format XXX-XX-XXX)
- Ensure the Ecobee is in pairing mode
- Check that no other HomeKit controller is already paired

### Connection Drops

- Check network connectivity
- Verify the Pi has a stable IP address (consider static IP)
- Check logs: `journalctl -u prostat-bridge -f`

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

All communication stays on your local network. No cloud, no APIs, no external dependencies.

## Security Notes

- The service runs on your local network only
- HomeKit uses end-to-end encryption
- Pairing requires physical access to the thermostat
- No data leaves your network

## Next Steps

1. Integrate with the React web app
2. Add automatic reconnection logic
3. Implement short cycle protection
4. Add scheduling and away mode
5. Create mobile app companion
