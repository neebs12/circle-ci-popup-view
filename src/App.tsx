import { useState, useEffect } from 'react';
import { PipelineList } from './components/PipelineList';
import './App.css';

interface StorageResult {
  CIRCLE_CI_TOKEN?: string;
  ORG_SLUG?: string;
  PROJECT_NAMES?: string;
  SELECTED_PROJECT_NAME?: string;
  SELECTED_VIEW?: 'all' | 'mine';
}

interface Config {
  token: string;
  orgSlug: string;
  projectNames: string[];
}

type ViewType = 'all' | 'mine';

function App() {
  const [config, setConfig] = useState<Config>({
    token: '',
    orgSlug: '',
    projectNames: []
  });

  const [selectedProjectName, setSelectedProjectName] = useState<string>('');
  const [selectedView, setSelectedView] = useState<ViewType>('all');

  useEffect(() => {
    chrome.storage.local.get(
      ['CIRCLE_CI_TOKEN', 'ORG_SLUG', 'PROJECT_NAMES', 'SELECTED_PROJECT_NAME', 'SELECTED_VIEW'],
      (result: StorageResult) => {
        let projectNames = result.PROJECT_NAMES || '';

        setConfig({
          token: result.CIRCLE_CI_TOKEN || '',
          orgSlug: result.ORG_SLUG || '',
          projectNames: projectNames.split(",").map(str => str.trim())
        });

        const firstProjectName = projectNames.split(",")[0]?.trim(); 
        setSelectedProjectName(result.SELECTED_PROJECT_NAME || firstProjectName || '');
        setSelectedView(result.SELECTED_VIEW || 'all');
      }
    );
  }, []);

  const handleProjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newProjectName = e.target.value;
    setSelectedProjectName(newProjectName);
    chrome.storage.local.set({ SELECTED_PROJECT_NAME: newProjectName });
  };

  const handleViewChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newView = e.target.value as ViewType;
    setSelectedView(newView);
    chrome.storage.local.set({ SELECTED_VIEW: newView });
  };

  const openOptions = () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    }
  };

  if (!config.token || !config.orgSlug || config.projectNames.length === 0) {
    return (
      <div className="config-needed">
        <h2>Configuration Needed</h2>
        <p>Please set up your CircleCI configuration in the extension options.</p>
        <button onClick={openOptions} className="options-button">
          Open Options
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="header-selectors">
            <select
              value={selectedProjectName}
              onChange={handleProjectChange}
              className="project-select"
            >
              {config.projectNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <select
              value={selectedView}
              onChange={handleViewChange}
              className="view-select"
            >
              <option value="all">All Pipelines</option>
              <option value="mine">My Pipelines</option>
            </select>
          </div>
          <button onClick={openOptions} className="config-button">
            <img src="gear.svg" alt="Configure" className="gear-icon" />
          </button>
        </div>
      </header>
      <main>
        <PipelineList
          token={config.token}
          orgSlug={config.orgSlug}
          projectName={selectedProjectName}
          view={selectedView}
        />
      </main>
    </div>
  );
}

export default App;
