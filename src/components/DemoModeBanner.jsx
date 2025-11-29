import React from 'react';
import { AlertCircle, X, Wifi } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Demo Mode Banner
 * Shows when app is in demo mode (no Ecobee connection)
 */
export default function DemoModeBanner({ onDismiss, dismissed = false }) {
  if (dismissed) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-2.5 mb-4 rounded-r-lg shadow-sm">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-0.5">
            Viewing Demo Data
          </h3>
          <p className="text-xs text-blue-800 dark:text-blue-300 mb-1.5">
            Connect your Ecobee thermostat to see real-time stats and control your HVAC system.
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/config"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
            >
              <Wifi className="w-3 h-3" />
              Connect Ecobee
            </Link>
            <button
              onClick={onDismiss}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-xs font-medium"
            >
              Dismiss
            </button>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors flex-shrink-0"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

