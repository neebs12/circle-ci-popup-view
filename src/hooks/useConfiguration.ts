import { useState, useEffect } from 'react';

interface ConfigState {
  token: string;
  orgSlug: string;
  projectNames: string;
}

export const useConfiguration = () => {
  const [config, setConfig] = useState<ConfigState>({
    token: '',
    orgSlug: '',
    projectNames: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'warning' | null }>({
    message: '',
    type: null
  });

  useEffect(() => {
    // Load saved options
    chrome.storage.local.get(
      ['CIRCLE_CI_TOKEN', 'ORG_SLUG', 'PROJECT_NAMES'],
      (result) => {
        setConfig({
          token: result.CIRCLE_CI_TOKEN || '',
          orgSlug: result.ORG_SLUG || '',
          projectNames: result.PROJECT_NAMES || ''
        });
      }
    );
  }, []);

  const saveConfiguration = async (hasWarnings: boolean) => {
    return new Promise<void>((resolve) => {
      if (hasWarnings) {
        setStatus({
          message: '😭 Failed to save Options! Check warnings above up 👆',
          type: 'warning'
        });        
        resolve()
      } else {
        chrome.storage.local.set(
          {
            CIRCLE_CI_TOKEN: config.token,
            ORG_SLUG: config.orgSlug,
            PROJECT_NAMES: config.projectNames,
          },
          () => {
            setStatus({
              message: 'Options saved successfully!',
              type: 'success'
            });
            resolve()
          }
        );        
      }
    });
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    config,
    isSaving,
    status,
    setIsSaving,
    saveConfiguration,
    handleConfigChange
  };
};
