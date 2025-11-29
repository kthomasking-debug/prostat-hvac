import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Server, 
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Upgrades from './Upgrades';
import DocumentationSetupGuides from './DocumentationSetupGuides';

const Hardware = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('bridge');

  const tabs = [
    { id: 'bridge', label: 'Bridge', icon: Server, component: DocumentationSetupGuides },
    { id: 'shop', label: 'Shop', icon: Zap, component: Upgrades },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);
  const ActiveComponent = activeTabData?.component || DocumentationSetupGuides;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePrevious = () => {
    navigate('/control');
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
              <h1 className="heading-primary">Docs</h1>
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

export default Hardware;

