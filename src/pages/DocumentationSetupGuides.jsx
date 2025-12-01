import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ExternalLink,
  AlertCircle,
  Activity,
  Server,
  Crown,
} from 'lucide-react';

export default function DocumentationSetupGuides() {
  return (
    <div className="page-gradient-overlay min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-3">
            <div className="icon-container icon-container-gradient">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h1 className="heading-primary">
                Documentation & Setup Guides
              </h1>
              <p className="text-muted mt-1">
                Complete guides for setting up and configuring your Building Management System (BMS)
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-glass-lg animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-glass">
            {/* Legal Firewall Pitch - Prominent */}
            <Link
              to="/docs/LEGAL-FIREWALL-PITCH.md"
              className="p-4 glass-card border-red-500/30 hover:shadow-xl transition-all group col-span-full md:col-span-2 lg:col-span-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <h3 className="heading-tertiary group-hover:opacity-80">
                    Legal Firewall: How to "Lawyer-Proof" Your Project
                  </h3>
                </div>
                <ExternalLink className="w-5 h-5 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted mb-2">
                Essential reading for anyone building or selling HVAC/air quality automation systems. Learn how to avoid liability traps and market your product safely.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 glass-card border-red-500/30 text-high-contrast rounded">Legal</span>
                <span className="text-xs px-2 py-1 glass-card border-red-500/30 text-high-contrast rounded">Liability</span>
                <span className="text-xs px-2 py-1 glass-card border-red-500/30 text-high-contrast rounded">Marketing</span>
                <span className="text-xs px-2 py-1 glass-card border-red-500/30 text-high-contrast rounded">Safety</span>
              </div>
            </Link>
            
            {/* Wake Word Architecture - Important */}
            <Link
              to="/docs/WAKE-WORD-ARCHITECTURE.md"
              className="p-4 glass-card border-indigo-500/30 hover:shadow-xl transition-all group col-span-full md:col-span-2 lg:col-span-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <h3 className="heading-tertiary group-hover:opacity-80">
                    Wake Word Architecture: Browser Demo vs Production
                  </h3>
                </div>
                <ExternalLink className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted mb-2">
                Critical architectural decision: Why wake word detection belongs on the Raspberry Pi, not in the browser. 
                Explains browser limitations, licensing traps, and the production implementation plan.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 glass-card border-indigo-500/30 text-high-contrast rounded">Architecture</span>
                <span className="text-xs px-2 py-1 glass-card border-indigo-500/30 text-high-contrast rounded">Raspberry Pi</span>
                <span className="text-xs px-2 py-1 glass-card border-indigo-500/30 text-high-contrast rounded">Voice Control</span>
                <span className="text-xs px-2 py-1 glass-card border-indigo-500/30 text-high-contrast rounded">openWakeWord</span>
              </div>
            </Link>
            
            {/* Local LLM on Raspberry Pi */}
            <Link
              to="/docs/LOCAL-LLM-RASPBERRY-PI.md"
              className="p-4 glass-card border-emerald-500/30 hover:shadow-xl transition-all group col-span-full md:col-span-2 lg:col-span-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-emerald-500" />
                  <h3 className="heading-tertiary group-hover:opacity-80">
                    Running LLM Locally on Raspberry Pi
                  </h3>
                </div>
                <ExternalLink className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted mb-2">
                Replace Groq API with a local LLM running on your Raspberry Pi. Complete sovereignty, works offline, 
                unlimited queries, no API keys. Uses Ollama for easy setup.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 glass-card border-emerald-500/30 text-high-contrast rounded">Ollama</span>
                <span className="text-xs px-2 py-1 glass-card border-emerald-500/30 text-high-contrast rounded">Offline</span>
                <span className="text-xs px-2 py-1 glass-card border-emerald-500/30 text-high-contrast rounded">Sovereign</span>
                <span className="text-xs px-2 py-1 glass-card border-emerald-500/30 text-high-contrast rounded">No API Keys</span>
              </div>
            </Link>
            
            {/* Product Tiers */}
            <Link
              to="/docs/PRODUCT-TIERS.md"
              className="p-4 glass-card border-purple-500/30 hover:shadow-xl transition-all group col-span-full md:col-span-2 lg:col-span-3"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-purple-500" />
                  <h3 className="heading-tertiary group-hover:opacity-80">
                    Joule Product Tiers: Free, Monitor ($20), Bridge ($129)
                  </h3>
                </div>
                <ExternalLink className="w-5 h-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted mb-2">
                Complete product comparison: Free CSV Analyzer, Joule Monitor with automatic daily analysis ($20), 
                and Joule Bridge with Raspberry Pi hardware for complete local control ($129).
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs px-2 py-1 glass-card border-purple-500/30 text-high-contrast rounded">Free Tier</span>
                <span className="text-xs px-2 py-1 glass-card border-purple-500/30 text-high-contrast rounded">Monitor $20</span>
                <span className="text-xs px-2 py-1 glass-card border-purple-500/30 text-high-contrast rounded">Bridge $129</span>
                <span className="text-xs px-2 py-1 glass-card border-purple-500/30 text-high-contrast rounded">Pricing</span>
              </div>
            </Link>
            
            {/* Joule Bridge Setup */}
            <Link
              to="/docs/JOULE-BRIDGE-SETUP.md"
              className="p-4 glass-card border-blue-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Joule Bridge Setup
                </h3>
                <ExternalLink className="w-4 h-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Complete guide for setting up the Raspberry Pi bridge for local HomeKit control
              </p>
            </Link>
            
            {/* Asthma Shield Setup */}
            <Link
              to="/docs/ASTHMA-SHIELD-SETUP.md"
              className="p-4 glass-card border-green-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Asthma Shield BMS
                </h3>
                <ExternalLink className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Closed-loop Building Management System for automatic air quality control
              </p>
            </Link>
            
            {/* Blueair Integration */}
            <Link
              to="/docs/BLUEAIR-INTEGRATION.md"
              className="p-4 glass-card border-purple-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Blueair Integration
                </h3>
                <ExternalLink className="w-4 h-4 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Setup and configuration for Blueair air purifier control and interlock logic
              </p>
            </Link>
            
            {/* Dehumidifier Relay Wiring */}
            <Link
              to="/docs/DEHUMIDIFIER-RELAY-WIRING.md"
              className="p-4 glass-card border-orange-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Dehumidifier Relay Wiring
                </h3>
                <ExternalLink className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Complete wiring guide for connecting dehumidifier to CH340 relay module
              </p>
            </Link>
            
            {/* Dehumidifier Wiring Guide */}
            <Link
              to="/docs/DEHUMIDIFIER-WIRING-GUIDE.md"
              className="p-4 glass-card border-cyan-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Dehumidifier Wiring Guide
                </h3>
                <ExternalLink className="w-4 h-4 text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Internal wiring diagrams and component breakdown for dehumidifier units
              </p>
            </Link>
            
            {/* Smart Thermostat Build Guide */}
            <Link
              to="/docs/SMART_THERMOSTAT_BUILD_GUIDE.md"
              className="p-4 glass-card border-indigo-500/30 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="heading-tertiary group-hover:opacity-80">
                  Smart Thermostat Build Guide
                </h3>
                <ExternalLink className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-sm text-muted">
                Step-by-step guide for building your complete smart thermostat system
              </p>
            </Link>
          </div>
          
          {/* Additional Resources */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="heading-tertiary mb-3">
              Additional Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Link
                to="/thermostat-diagrams"
                className="flex items-center gap-2 text-sm text-blue-500 hover:opacity-80 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Wiring Diagrams & Templates</span>
              </Link>
              <Link
                to="/docs/CH340-RELAY-SETUP.md"
                className="flex items-center gap-2 text-sm text-blue-500 hover:opacity-80 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>CH340 Relay Module Setup</span>
              </Link>
              <Link
                to="/docs/USB-RELAY-OPTIONS.md"
                className="flex items-center gap-2 text-sm text-blue-500 hover:opacity-80 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>USB Relay Options</span>
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 text-sm text-blue-500 hover:opacity-80 transition-opacity"
              >
                <ExternalLink className="w-4 h-4" />
                <span>System Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

