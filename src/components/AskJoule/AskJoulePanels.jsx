import React from "react";
import PreferencePanel from "../PreferencePanel";
import LocationSettings from "../LocationSettings";
import { SuggestedQuestions } from "../AskJouleEnhancements";

export const AskJoulePanels = ({
  showPersonalization,
  showCommandHelp,
  showAudit,
  auditLog,
  onSuggestionClick
}) => {
  if (!showPersonalization && !showCommandHelp && !showAudit) return null;

  return (
    <div className="mt-3 space-y-4 border-t border-gray-200 dark:border-gray-700 pt-3">
      {/* Personalization Settings */}
      {showPersonalization && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="space-y-3">
            <PreferencePanel />
            <LocationSettings />
          </div>
        </div>
      )}

      {/* Command Help */}
      {showCommandHelp && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <SuggestedQuestions onSelectQuestion={onSuggestionClick} />
        </div>
      )}

      {/* Audit Log */}
      {showAudit && (
        <div className="animate-in slide-in-from-top-2 fade-in duration-200">
          <h3 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
            Recent Activity
          </h3>
          <div className="max-h-60 overflow-y-auto bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-2 space-y-2">
            {auditLog && auditLog.length > 0 ? (
              auditLog.slice().reverse().map((entry, i) => (
                <div key={i} className="text-xs border-b border-gray-200 dark:border-gray-700 last:border-0 pb-2 mb-2 last:pb-0 last:mb-0">
                  <div className="flex justify-between text-gray-500 dark:text-gray-400 mb-1">
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                    <span className="font-mono">{entry.key}</span>
                  </div>
                  <div className="text-gray-800 dark:text-gray-200">
                    {entry.newValue !== undefined ? String(entry.newValue) : "Action"}
                  </div>
                  {entry.meta?.comment && (
                    <div className="text-gray-500 italic mt-0.5">
                      "{entry.meta.comment}"
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 text-xs py-4">
                No activity recorded yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

