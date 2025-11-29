import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  TrendingUp, 
  Search, 
  BarChart2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import SevenDayCostForecaster from './SevenDayCostForecaster';
import MonthlyBudgetPlanner from './MonthlyBudgetPlanner';
import GasVsHeatPump from './GasVsHeatPump';
import SystemPerformanceAnalyzer from './SystemPerformanceAnalyzer';

const Analysis = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active tab from URL or default to forecast
  const getActiveTab = () => {
    if (location.pathname.includes('/analysis/forecast') || location.pathname === '/analysis') {
      return 'forecast';
    }
    if (location.pathname.includes('/analysis/budget')) {
      return 'budget';
    }
    if (location.pathname.includes('/analysis/compare')) {
      return 'compare';
    }
    if (location.pathname.includes('/analysis/analyzer')) {
      return 'analyzer';
    }
    return 'forecast';
  };

  const [activeTab, setActiveTab] = useState(getActiveTab());

  // Sync activeTab with location changes and redirect to default if needed
  useEffect(() => {
    if (location.pathname === '/analysis') {
      navigate('/analysis/forecast', { replace: true });
      return;
    }
    const tab = getActiveTab();
    setActiveTab(tab);
  }, [location.pathname, navigate]);

  const tabs = [
    { id: 'forecast', label: 'Forecast', icon: Calendar, component: SevenDayCostForecaster },
    { id: 'budget', label: 'Budget', icon: TrendingUp, component: MonthlyBudgetPlanner },
    { id: 'compare', label: 'Compare', icon: Search, component: GasVsHeatPump },
    { id: 'analyzer', label: 'Analyzer', icon: BarChart2, component: SystemPerformanceAnalyzer },
  ];

  const activeTabData = tabs.find(t => t.id === activeTab);
  const ActiveComponent = activeTabData?.component || SevenDayCostForecaster;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/analysis/${tabId}`);
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex > 0) {
      handleTabChange(tabs[currentIndex - 1].id);
    } else {
      navigate('/home');
    }
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(t => t.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      handleTabChange(tabs[currentIndex + 1].id);
    } else {
      navigate('/control');
    }
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
              <h1 className="heading-primary">Analysis</h1>
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

export default Analysis;

