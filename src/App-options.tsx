import './App-options.css';
import ConfigurationForm from './components/ConfigurationForm';
import StatusMessage from './components/StatusMessage';
import { useConfiguration } from './hooks/useConfiguration';
import { useValidation } from './hooks/useValidation';

function AppOptions() {
  const {
    config,
    isSaving,
    status,
    setIsSaving,
    saveConfiguration,
    handleConfigChange
  } = useConfiguration();

  const {
    validation,
    validateConfiguration
  } = useValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const isValid = await validateConfiguration(
      config.token,
      config.orgSlug,
      config.projectNames
    );

    await saveConfiguration(!isValid);
    setIsSaving(false);
  };

  return (
    <div className="options-container">
      <div className="options-content">
        <h1>CircleCI Extension Options</h1>
        
        <ConfigurationForm
          config={config}
          validation={validation}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onChange={handleConfigChange}
        />

        <StatusMessage
          message={status.message}
          type={status.type}
        />
      </div>
    </div>
  );
}

export default AppOptions;
