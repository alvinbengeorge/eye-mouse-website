'use client';

import { useState, useRef, useEffect } from 'react';
import { Eye, Mouse, Settings, Home, Calculator, FileText, Mail, Calendar, Music, Camera, ChevronUp, X, Check, ArrowLeft } from 'lucide-react';

export default function EyeTrackingInterface() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const [calculatorDisplay, setCalculatorDisplay] = useState('0');
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (activeModal) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [activeModal]);

  // Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (activeModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [activeModal]);

  const handleButtonClick = (action: string, modalId?: string) => {
    setClickCount(prev => prev + 1);
    console.log(`Eye-tracking click: ${action}`);
    
    // Add visual feedback
    const button = document.activeElement as HTMLElement;
    if (button) {
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    }

    // Open modal if specified
    if (modalId) {
      setActiveModal(modalId);
    }
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const handleCalculatorInput = (value: string) => {
    if (value === 'C') {
      setCalculatorDisplay('0');
    } else if (value === '=') {
      try {
        const result = eval(calculatorDisplay.replace('×', '*').replace('÷', '/'));
        setCalculatorDisplay(result.toString());
      } catch {
        setCalculatorDisplay('Error');
      }
    } else {
      setCalculatorDisplay(prev => prev === '0' ? value : prev + value);
    }
    handleButtonClick(`Calculator: ${value}`);
  };

  const navigationButtons = [
    { id: 'home', label: 'Home', icon: Home, color: 'bg-blue-500 hover:bg-blue-600' },
    { id: 'calculator', label: 'Calculator', icon: Calculator, color: 'bg-green-500 hover:bg-green-600' },
    { id: 'notes', label: 'Notes', icon: FileText, color: 'bg-purple-500 hover:bg-purple-600' },
    { id: 'mail', label: 'Mail', icon: Mail, color: 'bg-red-500 hover:bg-red-600' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, color: 'bg-orange-500 hover:bg-orange-600' },
    { id: 'music', label: 'Music', icon: Music, color: 'bg-pink-500 hover:bg-pink-600' },
    { id: 'camera', label: 'Camera', icon: Camera, color: 'bg-teal-500 hover:bg-teal-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'bg-gray-500 hover:bg-gray-600' },
  ];

  const quickActions = [
    { label: 'Yes', color: 'bg-emerald-500 hover:bg-emerald-600', modalId: 'yes' },
    { label: 'No', color: 'bg-rose-500 hover:bg-rose-600', modalId: 'no' },
    { label: 'Help', color: 'bg-amber-500 hover:bg-amber-600', modalId: 'help' },
    { label: 'Emergency', color: 'bg-red-600 hover:bg-red-700', modalId: 'emergency' },
  ];

  const renderModal = () => {
    if (!activeModal) return null;

    const getModalContent = () => {
      switch (activeModal) {
        case 'calculator':
          return (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Calculator</h2>
              <div className="max-w-md mx-auto">
                <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-2xl mb-6">
                  <div className="text-right text-3xl font-mono text-slate-900 dark:text-white min-h-[50px] flex items-center justify-end">
                    {calculatorDisplay}
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['C', '±', '%', '÷', '7', '8', '9', '×', '4', '5', '6', '-', '1', '2', '3', '+', '0', '0', '.', '='].map((btn, i) => (
                    <button
                      key={i}
                      onClick={() => handleCalculatorInput(btn)}
                      className={`
                        h-16 rounded-xl font-semibold text-lg
                        ${['C', '±', '%'].includes(btn) 
                          ? 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200' 
                          : ['÷', '×', '-', '+', '='].includes(btn)
                          ? 'bg-orange-500 hover:bg-orange-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                        }
                        transform transition-all duration-150
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300
                        ${btn === '0' && i === 16 ? 'col-span-2' : ''}
                      `}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );

        case 'yes':
          return (
            <div className="text-center">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Check size={48} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Yes Confirmed</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Your positive response has been recorded.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleButtonClick('Continue')}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold h-16 rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Continue
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold h-16 rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          );

        case 'no':
          return (
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <X size={48} className="text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">No Selected</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Your negative response has been recorded.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleButtonClick('Go Back')}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold h-16 rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Go Back
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold h-16 rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Close
                </button>
              </div>
            </div>
          );

        case 'help':
          return (
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Eye size={48} className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Help & Support</h2>
              <div className="text-left space-y-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-xl">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Eye Tracking Tips:</h3>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Look directly at buttons to target them</li>
                    <li>• Blink to click when cursor is positioned</li>
                    <li>• Use large buttons for easier targeting</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-xl">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Navigation:</h3>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Click any app to open in modal</li>
                    <li>• Press ESC or click outside to close</li>
                    <li>• Use quick actions for common responses</li>
                  </ul>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold h-16 w-full rounded-xl transition-all duration-150 hover:scale-105"
              >
                Got It!
              </button>
            </div>
          );

        case 'emergency':
          return (
            <div className="text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                <Camera size={48} className="text-red-600" />
              </div>
              <h2 className="text-3xl font-bold text-red-600 mb-4">Emergency Alert</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                Emergency assistance has been requested. Help is on the way.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => handleButtonClick('Call Emergency')}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold h-20 rounded-xl transition-all duration-150 hover:scale-105 text-xl"
                >
                  📞 Call for Help
                </button>
                <button
                  onClick={closeModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold h-16 rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Cancel
                </button>
              </div>
            </div>
          );

        default:
          const app = navigationButtons.find(nav => nav.id === activeModal);
          if (app) {
            const IconComponent = app.icon;
            return (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <IconComponent size={48} className="text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{app.label}</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
                  {app.label} application interface would be displayed here. 
                  This is a demonstration of the modal-based interface.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <button
                      key={i}
                      onClick={() => handleButtonClick(`${app.label} Action ${i}`)}
                      className="
                        bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600
                        h-16 rounded-xl font-medium text-slate-700 dark:text-slate-300
                        transform transition-all duration-150
                        hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300
                      "
                    >
                      Action {i}
                    </button>
                  ))}
                </div>

                <button
                  onClick={closeModal}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold h-16 w-full rounded-xl transition-all duration-150 hover:scale-105"
                >
                  Close {app.label}
                </button>
              </div>
            );
          }
          return null;
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div 
          ref={modalRef}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Modal Active</span>
              </div>
              <button
                onClick={closeModal}
                className="
                  w-12 h-12 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                  rounded-full flex items-center justify-center
                  transform transition-all duration-150 hover:scale-110
                  focus:outline-none focus:ring-4 focus:ring-blue-300
                "
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>
            {getModalContent()}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-xl">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Eye Tracker Interface
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Modal-Based • Large Buttons • Eye-Friendly Design
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-full">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-green-800 dark:text-green-200">
                    Eye Tracking Active
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Clicks: {clickCount}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Welcome to Eye Tracking Interface
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Click any button below to open its interface in a modal window. 
            Large buttons optimized for eye-tracking with blink-to-click functionality.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleButtonClick(action.label, action.modalId)}
                className={`
                  ${action.color} text-white font-bold
                  w-full h-24 rounded-3xl shadow-lg
                  transform transition-all duration-200 ease-out
                  hover:scale-105 hover:shadow-2xl
                  focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                  active:scale-95
                  text-xl
                `}
                aria-label={`Quick action: ${action.label}`}
                tabIndex={0}
              >
                {action.label}
              </button>
            ))}
          </div>
        </section>

        {/* Main Applications */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">
            Applications
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {navigationButtons.map((nav) => {
              const IconComponent = nav.icon;
              return (
                <button
                  key={nav.id}
                  onClick={() => handleButtonClick(nav.label, nav.id)}
                  className={`
                    ${nav.color} text-white
                    w-full h-40 rounded-3xl shadow-lg
                    transform transition-all duration-200 ease-out
                    hover:scale-105 hover:shadow-2xl
                    focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50
                    active:scale-95
                    flex flex-col items-center justify-center space-y-3
                  `}
                  aria-label={`Open ${nav.label} application`}
                  tabIndex={0}
                >
                  <IconComponent size={40} />
                  <span className="font-bold text-lg">{nav.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Mouse className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Large Buttons
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                All buttons are sized for easy eye-tracking targeting and blink-to-click interaction
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Eye className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Modal Interface
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Clean modal windows that open for each application, keeping the interface uncluttered
              </p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Settings className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                Accessible Design
              </h4>
              <p className="text-slate-600 dark:text-slate-400">
                Full keyboard navigation and screen reader support with high contrast visuals
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-500 dark:text-slate-400 pb-8">
        <p>Eye Tracking Interface • Modal-Based Design • Optimized for Accessibility</p>
      </footer>

      {/* Render Modal */}
      {renderModal()}
    </div>
  );
}
