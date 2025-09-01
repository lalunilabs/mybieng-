'use client';

import { useState } from 'react';
import { 
  APP_VERSION, 
  BUILD_DATE, 
  COMPONENT_VERSIONS, 
  VERSION_HISTORY,
  getFullVersionString,
  formatVersion 
} from '@/lib/version';

interface VersionInfoProps {
  showComponents?: boolean;
  showHistory?: boolean;
  compact?: boolean;
}

export function VersionInfo({ showComponents = false, showHistory = false, compact = false }: VersionInfoProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (compact) {
    return (
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <span>{getFullVersionString()}</span>
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="h-auto p-1 text-xs hover:text-brand-600 transition-colors"
        >
          {showDetails ? '−' : '+'}
        </button>
        {showDetails && (
          <div className="absolute z-50 mt-8 bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-64">
            <VersionDetails />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <span className="text-brand-600">📋</span>
          Version Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Current platform version and component details
        </p>
      </div>
      <div className="p-6 space-y-4">
        <VersionDetails showComponents={showComponents} showHistory={showHistory} />
      </div>
    </div>
  );
}

function VersionDetails({ showComponents = false, showHistory = false }: { showComponents?: boolean; showHistory?: boolean }) {
  const latestVersion = VERSION_HISTORY[0];

  return (
    <div className="space-y-4">
      {/* Current Version */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-medium text-gray-900">Platform Version</h4>
          <p className="text-sm text-gray-600">{getFullVersionString()}</p>
        </div>
        <div className="px-3 py-1 bg-brand-100 text-brand-700 rounded-full text-sm font-medium">
          Latest
        </div>
      </div>

      {/* Latest Release Info */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-900 mb-2">{latestVersion.title}</h4>
        <p className="text-sm text-gray-600 mb-3">{latestVersion.notes}</p>
        
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-700">Key Features:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {latestVersion.features.slice(0, 4).map((feature, index) => (
              <li key={index} className="flex items-start">
                <span className="text-brand-500 mr-2 mt-0.5">•</span>
                {feature}
              </li>
            ))}
            {latestVersion.features.length > 4 && (
              <li className="text-gray-500 italic">
                +{latestVersion.features.length - 4} more features...
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Component Versions */}
      {showComponents && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Component Versions</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(COMPONENT_VERSIONS).map(([component, version]) => (
              <div key={component} className="flex justify-between items-center py-1">
                <span className="text-gray-600">{component}</span>
                <span className="text-brand-600 font-mono">{formatVersion(version)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Version History */}
      {showHistory && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Release History</h4>
          <div className="space-y-3">
            {VERSION_HISTORY.map((release, index) => (
              <div key={release.version} className="border-l-2 border-brand-200 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-brand-600">{formatVersion(release.version)}</span>
                  <span className="text-sm text-gray-500">{release.date}</span>
                  {index === 0 && (
                    <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{release.title}</p>
                <p className="text-xs text-gray-500">{release.notes}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
