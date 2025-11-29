import React from 'react';

const SmartThermostatBuildGuide = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 prose prose-lg dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-6">🏠 Smart Thermostat Build Guide</h1>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Using Your eBay Parts with Web Serial API</h2>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">📦 Parts Compatibility Analysis</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">✅ What You Have (All Compatible!)</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Part</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Status</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Wall Mounted Mobile AC L-2008</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">✓ Perfect</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Your HVAC unit to control</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">DS18B20 USB Thermometer</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">✓ Perfect</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Works with Web Serial API</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">CH340 8CH USB Relay Module</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">✓ Perfect</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Already supported in codebase</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Onn. Surf 7" Tablet</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">✓ Perfect</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Android tablet for display</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">24VAC to 12VDC Converter</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">🛒 Needed</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Powers relay module</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">24VAC to 5VDC USB Converter</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">🛒 Needed</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Powers tablet via USB</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">USB Cables/Adapters</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">🛒 Needed</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">For connections</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Tablet Wall Mount</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">⭐ Nice to have</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">For mounting</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">🔧 Optional but Recommended</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>USB Hub</strong> - If connecting both relay + sensor to tablet</li>
          <li><strong>Wire nuts / electrical connectors</strong> - For safe wiring</li>
          <li><strong>18-22 AWG wire</strong> - For low-voltage connections</li>
          <li><strong>Electrical tape</strong> - For safety</li>
          <li><strong>14-16 AWG wire</strong> - For 120VAC connections</li>
          <li><strong>Multimeter</strong> - For testing connections</li>
        </ul>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">🔌 Complete Wiring Diagram</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Power Distribution Flow</h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto"><code>{`Furnace/AC Transformer (24VAC)
    │
    ├─→ 24VAC to 12VDC Converter ──→ Relay Module Power (12VDC)
    │
    └─→ 24VAC to 5VDC USB Converter ──→ Tablet USB-C (5VDC, 3A)`}</code></pre>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Control Wiring Layout</h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto"><code>{`Relay Module (CH340)          Wall AC Unit
───────────────────          ──────────────
Relay 1 (NO)  ────→          Power Control
Relay 2 (NO)  ────→          (Reserved)
Relay 3 (NO)  ────→          (Reserved)
Common (C)    ────→          Common/Neutral`}</code></pre>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">USB Connection Tree</h3>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto"><code>{`Tablet (USB-C)
    │
    └─→ USB-C to USB-A OTG Adapter
            │
            └─→ USB Hub (recommended)
                    │
                    ├─→ USB-B to USB-A Cable ──→ Relay Module
                    │
                    └─→ USB-A Cable ──→ DS18B20 Thermometer`}</code></pre>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">📋 Step-by-Step Setup</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Power Supply Setup ⚡</h3>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">For Relay Module (12VDC)</h4>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Connect 24VAC to 12VDC converter</strong> to your furnace/AC transformer
            <ul className="list-disc pl-6 mt-1">
              <li><strong>Input:</strong> Connect to 24VAC transformer (R and C terminals)</li>
              <li><strong>Output:</strong> Connect to relay module's power terminals (+12V and GND)</li>
            </ul>
          </li>
          <li><strong>⚠️ Important:</strong> The relay module needs external power even when connected via USB!</li>
        </ol>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">For Tablet (5VDC USB)</h4>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Connect 24VAC to 5VDC USB converter</strong> to transformer
            <ul className="list-disc pl-6 mt-1">
              <li><strong>Input:</strong> Connect to 24VAC transformer (same R and C terminals)</li>
              <li><strong>Output:</strong> USB-C connector to tablet</li>
            </ul>
          </li>
          <li>This will power the tablet continuously (no battery needed!)</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: USB Connections 🔗</h3>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Option A: Direct Connection (One Device at a Time)</h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>Connect relay module <strong>OR</strong> temperature sensor (not both simultaneously)</li>
          <li>Use USB-C to USB-A OTG adapter</li>
          <li>Then USB-A to USB-B cable for relay, or USB-A cable for sensor</li>
        </ul>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Option B: USB Hub (⭐ Recommended)</h4>
        <ul className="list-disc pl-6 space-y-2">
          <li>Connect USB hub to tablet via OTG adapter</li>
          <li>Connect relay module to hub (USB-B to USB-A cable)</li>
          <li>Connect temperature sensor to hub (USB-A cable)</li>
        </ul>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 my-4">
          <p className="mb-0"><strong>💡 Tip:</strong> The Onn. Surf tablet may have limited USB OTG power. A powered USB hub is recommended if you experience issues.</p>
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: AC Unit Control Wiring 🔌</h3>
        
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-4">
          <p className="mb-0"><strong>⚠️ SAFETY FIRST</strong><br />Unplug AC unit before wiring!</p>
        </div>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Understanding Your AC Unit</h4>
        <p>The Wall-Mounted Mobile AC L-2008 has:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Power cord (120VAC)</li>
          <li>Control board</li>
          <li>Compressor</li>
          <li>Fan</li>
        </ul>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Option 1: Control Power to Entire Unit (Safest)</h4>
        <p><strong>How it works:</strong></p>
        <ol className="list-decimal pl-6 space-y-1">
          <li>Relay controls the AC's power supply</li>
          <li>Wire relay in series with the hot wire (120VAC)</li>
          <li>When relay closes → AC gets power → runs</li>
          <li>When relay opens → AC loses power → stops</li>
        </ol>
        
        <p><strong>Wiring Diagram:</strong></p>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto"><code>{`Wall Outlet (120VAC)
    │
    ├─ Hot Wire (Black) ──→ Relay 1 (NO terminal)
    │                           │
    │                           └─→ Hot Wire ──→ AC Unit
    │
    └─ Neutral Wire (White) ─────────────────→ AC Unit`}</code></pre>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 my-4">
          <p className="mb-0"><strong>⚠️ Critical Safety Checks</strong></p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Your relay module is rated for <strong>10A @ 250VAC</strong></li>
            <li>Check your AC unit's amperage rating (usually 5-15A)</li>
            <li><strong>If AC draws more than 10A, you MUST use a contactor (heavy-duty relay)</strong></li>
            <li>Find amperage on AC unit's label/nameplate</li>
          </ul>
        </div>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Option 2: Control via AC's Control Board (Advanced)</h4>
        <p>If the AC unit has low-voltage control terminals (like a furnace), you can control it directly. Check the AC unit's manual for control board access.</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 4: Temperature Sensor Placement 🌡️</h3>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Optimal Sensor Location</h4>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Mount DS18B20 sensor</strong> in a location that represents room temperature:
            <ul className="list-disc pl-6 mt-1 space-y-1">
              <li>✅ Away from direct sunlight</li>
              <li>✅ Away from AC vents</li>
              <li>✅ At average room height (4-5 feet)</li>
              <li>✅ Not near heat sources (lamps, computers, stoves)</li>
              <li>✅ Good air circulation</li>
            </ul>
          </li>
          <li><strong>Connect USB cable</strong> from sensor to tablet (via hub if using both devices)</li>
          <li><strong>Data format:</strong> Sensor sends temperature automatically every 10 seconds in ASCII format
            <ul className="list-disc pl-6 mt-1">
              <li>Example: <code>+25.3C</code> or <code>+77.5F</code></li>
            </ul>
          </li>
        </ol>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">💻 Software Configuration</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 1: Enable Web Serial API Support</h3>
        <p>Your codebase already supports this! Just ensure:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Tablet Browser:</strong> Use Chrome or Edge (Web Serial API support required)</li>
          <li><strong>Permissions:</strong> Grant serial port access when prompted</li>
          <li><strong>HTTPS:</strong> App must be served over HTTPS or localhost</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 2: Configure Relay Module</h3>
        <p>The CH340 relay module uses <strong>AT commands</strong>. Your codebase already supports this!</p>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">In Your React App:</h4>
        <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-x-auto"><code>{`import { getWebSerialRelay } from "../lib/webSerialRelay";

const relay = getWebSerialRelay();
await relay.connect();

// Use 'at' command format for CH340 modules
await relay.toggleTerminal("W", true, "at"); // Turn on Heat
await relay.toggleTerminal("Y", true, "at"); // Turn on Cool
await relay.toggleTerminal("G", true, "at"); // Turn on Fan`}</code></pre>
        
        <h4 className="text-lg font-semibold mt-4 mb-2">Relay Mapping:</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Relay</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Terminal</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Function</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Relay 1</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">W</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Heat/AC Power Control</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Active</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Relay 2</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Y</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Cool (Reserved)</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Future use</td>
              </tr>
              <tr>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Relay 3</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">G</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Fan (Reserved)</td>
                <td className="border border-gray-300 dark:border-gray-600 px-4 py-2">Future use</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Step 3: Configure Temperature Sensor</h3>
        <p>The DS18B20 USB thermometer works automatically with Web Serial API:</p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Connect via serial port</li>
          <li>Read incoming data stream</li>
          <li>Parse ASCII temperature format (<code>+XX.XC</code>)</li>
          <li>Update display every 10 seconds</li>
        </ol>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">🧪 Testing Procedure</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Test 1: USB Connections ✓</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Connect relay module to tablet</li>
          <li>Open Chrome/Edge on tablet</li>
          <li>Navigate to your app</li>
          <li>Go to "Contactor Demo" or "Short Cycle Test" page</li>
          <li>Click "Connect Relay"</li>
          <li>Grant serial port permission</li>
          <li>Verify connection status shows "Connected"</li>
        </ol>
        <p><strong>Expected result:</strong> ✅ Connection established, no errors</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Test 2: Relay Control ✓</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>With relay connected, toggle relays on/off via app</li>
          <li><strong>Listen for relay clicks</strong> (mechanical relays make an audible click)</li>
          <li><strong>Check LED indicators</strong> on relay module (if present)</li>
          <li>Use multimeter to verify relay contacts are closing (continuity test)</li>
        </ol>
        <p><strong>Expected result:</strong> ✅ Audible clicks, LED changes, continuity when closed</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Test 3: Temperature Sensor ✓</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Connect DS18B20 sensor to tablet</li>
          <li>Open serial port to sensor in app</li>
          <li>Wait 10 seconds for first reading</li>
          <li>Verify temperature data appears (format: <code>+25.3C</code>)</li>
          <li>Compare with known good room thermometer</li>
        </ol>
        <p><strong>Expected result:</strong> ✅ Readings appear, within ±1°C of reference</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Test 4: AC Unit Control ✓</h3>
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-4">
          <p className="mb-0"><strong>⚠️ SAFETY: Have someone watch the AC unit during testing!</strong></p>
        </div>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Wire relay to AC power</strong> (see Step 3 above)</li>
          <li><strong>Set AC unit's built-in thermostat to coldest</strong> (or bypass it)</li>
          <li><strong>Connect relay module</strong> to tablet</li>
          <li><strong>Turn on relay</strong> via app</li>
          <li><strong>Verify AC unit starts</strong> (listen for compressor and fan)</li>
          <li><strong>Turn off relay</strong> via app</li>
          <li><strong>Verify AC unit stops</strong></li>
        </ol>
        <p><strong>Expected result:</strong> ✅ AC responds immediately to relay commands</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Test 5: Full Thermostat Control ✓</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Connect both relay and sensor</strong> to tablet (via USB hub)</li>
          <li><strong>Set target temperature</strong> in app (e.g., 72°F)</li>
          <li><strong>Set differential</strong> (e.g., 2°F)</li>
          <li><strong>Let system run automatically:</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>When room temp &gt; target + differential → AC turns on</li>
              <li>When room temp &lt; target - differential → AC turns off</li>
            </ul>
          </li>
          <li><strong>Monitor for 30 minutes</strong> to verify proper cycling</li>
        </ol>
        <p><strong>Expected result:</strong> ✅ Automatic temperature control, proper cycling</p>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">⚠️ Important Safety Notes</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Electrical Safety 🔒</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Always unplug AC unit</strong> before wiring</li>
          <li><strong>Use proper wire gauge:</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>18-22 AWG for low voltage (24V)</li>
              <li>14-16 AWG for 120VAC</li>
            </ul>
          </li>
          <li><strong>Use wire nuts</strong> for connections (don't just twist wires)</li>
          <li><strong>Wrap connections in electrical tape</strong> for safety</li>
          <li><strong>Test with multimeter</strong> before powering on</li>
          <li><strong>Check relay rating</strong> (10A max) vs AC unit amperage</li>
          <li><strong>Use strain relief</strong> on all connections</li>
          <li><strong>Keep water away</strong> from all electrical connections</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Power Considerations ⚡</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Relay module needs external power</strong> (12VDC from converter)</li>
          <li><strong>Tablet needs power</strong> (5VDC USB from converter)</li>
          <li><strong>Both converters need 24VAC input</strong> (from furnace/AC transformer)</li>
          <li><strong>If transformer can't handle load</strong>, use separate 24VAC transformer</li>
          <li><strong>Calculate total load:</strong>
            <ul className="list-disc pl-6 mt-1">
              <li>Relay module: ~500mA @ 12V = 6W</li>
              <li>Tablet: ~2A @ 5V = 10W</li>
              <li>Total: ~16W from 24VAC transformer</li>
            </ul>
          </li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">AC Unit Compatibility 🔍</h3>
        <h4 className="text-lg font-semibold mt-4 mb-2">Wall-Mounted Mobile AC L-2008 Specifications</h4>
        <p><strong>You must verify:</strong></p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Unit's power rating (watts/amperage) - check nameplate</li>
          <li>Relay can handle the load (10A @ 250VAC max)</li>
          <li><strong>If unit draws more than 10A, you MUST use a contactor</strong></li>
        </ul>
        <p><strong>Typical AC unit ratings:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Small (5,000 BTU): 4-5A</li>
          <li>Medium (8,000 BTU): 7-8A</li>
          <li>Large (12,000 BTU): 10-12A ⚠️ May need contactor</li>
        </ul>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">🔧 Troubleshooting</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Relay Module Not Detected</h3>
        <p><strong>Symptoms:</strong> Tablet doesn't see relay module</p>
        <p><strong>Solutions:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>✓ Check USB cable connections (try reseating)</li>
          <li>✓ Try different USB cable (cable may be data-only)</li>
          <li>✓ Check USB OTG is enabled in tablet settings</li>
          <li>✓ Try connecting to computer first to verify module works</li>
          <li>✓ Check relay module has external power (12VDC)</li>
          <li>✓ Verify CH340 drivers (usually automatic on Android)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Temperature Sensor Not Reading</h3>
        <p><strong>Symptoms:</strong> No temperature data</p>
        <p><strong>Solutions:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>✓ Wait 10 seconds (sensor updates every 10s)</li>
          <li>✓ Check USB connection</li>
          <li>✓ Verify baud rate is 9600</li>
          <li>✓ Check sensor is sending data (use serial monitor app)</li>
          <li>✓ Try different USB port</li>
          <li>✓ Verify sensor has power (LED should be on)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">AC Unit Not Responding</h3>
        <p><strong>Symptoms:</strong> Relay clicks but AC doesn't start</p>
        <p><strong>Solutions:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>✓ Check wiring connections (loose wire?)</li>
          <li>✓ Verify relay contacts are closing (use multimeter)</li>
          <li>✓ Check AC unit's built-in thermostat (set to coldest)</li>
          <li>✓ Verify AC unit has power (check outlet with lamp)</li>
          <li>✓ Check relay rating vs AC unit amperage</li>
          <li>✓ Test AC unit directly (bypass relay temporarily)</li>
          <li>✓ Check for tripped circuit breaker</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Tablet Power Issues</h3>
        <p><strong>Symptoms:</strong> Tablet battery drains or won't charge</p>
        <p><strong>Solutions:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>✓ Verify 24VAC to 5VDC converter is working (measure output)</li>
          <li>✓ Check converter output (should be 5V, 3A minimum)</li>
          <li>✓ Try different USB-C cable (must support power delivery)</li>
          <li>✓ Check tablet charging port for damage or debris</li>
          <li>✓ Use powered USB hub if needed</li>
          <li>✓ Verify converter can supply enough current (3A minimum)</li>
        </ul>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">✅ Final Checklist</h2>
        <h3 className="text-xl font-semibold mt-6 mb-3">Before Powering On:</h3>
        <ul className="list-none space-y-2">
          <li>☐ All wiring connections secure and tight</li>
          <li>☐ Wire nuts properly installed on all splices</li>
          <li>☐ Electrical tape on all connections</li>
          <li>☐ Relay module has external power (12VDC)</li>
          <li>☐ Tablet has power (5VDC USB)</li>
          <li>☐ USB connections secure</li>
          <li>☐ AC unit unplugged during wiring</li>
          <li>☐ Multimeter tested all connections</li>
          <li>☐ Relay rating checked vs AC amperage</li>
          <li>☐ Temperature sensor mounted properly</li>
          <li>☐ Software configured for AT commands</li>
          <li>☐ Browser permissions granted</li>
          <li>☐ No exposed bare wires</li>
          <li>☐ Strain relief on all cables</li>
        </ul>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">🎯 Next Steps</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 1: Component Testing (1-2 hours)</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Complete wiring following this guide</li>
          <li>Test each component individually</li>
          <li>Verify all connections with multimeter</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 2: Integration Testing (1-2 hours)</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Test full system integration</li>
          <li>Calibrate temperature sensor (compare with known good thermometer)</li>
          <li>Verify relay control of AC unit</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 3: Tuning & Monitoring (24-48 hours)</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Tune thermostat settings (differential, min on/off times)</li>
          <li>Monitor for 24-48 hours to verify stability</li>
          <li>Check for short cycling issues</li>
          <li>Optimize temperature differential</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Phase 4: Optimization (ongoing)</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Fine-tune temperature settings based on comfort</li>
          <li>Monitor energy usage</li>
          <li>Add additional sensors if needed</li>
          <li>Implement scheduling features</li>
        </ol>
        
        <hr className="my-8" />
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">📚 Additional Resources</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Documentation Files</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li><code>docs/CH340-RELAY-SETUP.md</code> - Detailed relay module setup</li>
          <li><code>docs/USB-TEMPERATURE-HUMIDITY-SENSORS.md</code> - Sensor configuration</li>
          <li><code>docs/WINDOW-AC-TESTING.md</code> - AC unit testing procedures</li>
          <li><code>scripts/relay-server.js</code> - Backend relay control script</li>
          <li><code>src/lib/webSerialRelay.js</code> - Web Serial API implementation</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Helpful Links</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Web Serial API Documentation</li>
          <li>CH340 Driver Downloads</li>
          <li>DS18B20 Datasheet</li>
          <li>HVAC Wiring Standards</li>
        </ul>
        
        <hr className="my-8" />
        
        <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 my-4">
          <h2 className="text-2xl font-semibold mt-0 mb-2">🎉 You're Ready to Build!</h2>
          <p>All your parts are compatible and the software already supports them. Follow this guide step-by-step, and you'll have a working smart thermostat!</p>
          
          <h3 className="text-xl font-semibold mt-4 mb-2">Safety Reminder 🚨</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Work safely with electricity</li>
            <li>When in doubt, consult a licensed electrician</li>
            <li>Never work on live circuits</li>
            <li>Use proper tools and safety equipment</li>
          </ul>
          <p className="mt-4"><strong>Questions?</strong> Check the troubleshooting section or review the additional documentation files.</p>
        </div>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-8 pt-4 border-t border-gray-300 dark:border-gray-600">
          <p><strong>Document Version:</strong> 2.0</p>
          <p><strong>Last Updated:</strong> 2025</p>
          <p><strong>Compatibility:</strong> Web Serial API, CH340 Relay, DS18B20 Sensor</p>
        </div>
      </div>
    </div>
  );
};

export default SmartThermostatBuildGuide;

