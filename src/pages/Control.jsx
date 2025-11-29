import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Thermometer, 
  Wind,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SmartThermostatDemo from './SmartThermostatDemo';
import AirQualityHMI from './AirQualityHMI';

const Control = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL or default to thermostat
  const getActiveTab = () => {
    if (location.pathname.includes('/control/air-quality')) {
      return 'air-quality';
    }
    return 'thermostat';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Sync activeTab with location changes and redirect to default if needed
  useEffect(() => {
    if (location.pathname === '/control') {
      navigate('/control/thermostat', { replace: true });
      return;
    }
    const tab = getActiveTab();
    setActiveTab(tab);
  }, [location.pathname, navigate]);

  const tabs = [
    { id: 'thermostat', label: 'Thermostat', icon: Thermometer, component: SmartThermostatDemo },
    { id: 'air-quality', label: 'Air Quality', icon: Wind, component: AirQualityHMI },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);
  const ActiveComponent = activeTabData?.component || SmartThermostatDemo;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/control/${tabId}`);
  };

  const handlePrevious = () => {
    navigate('/analysis');
  };

  const handleNext = () => {
    navigate('/config');
  };

  return (
    <div className="page-gradient-overlay min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevious}
                className="icon-container hover:opacity-80 transition-opacity"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h1 className="heading-primary">Control</h1>
              <button
                onClick={handleNext}
                className="icon-container hover:opacity-80 transition-opacity"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                      : 'btn-glass text-high-contrast'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Content */}
        <div className="animate-fade-in-up">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Control;

