import React from 'react';

interface ValidationState {
  token: { message: string; isValid: boolean | null };
  orgSlug: { message: string; isValid: boolean | null };
  projectNames: { [key: string]: { message: string; isValid: boolean | null } };
}

interface ConfigFormProps {
  config: {
    token: string;
    orgSlug: string;
    // NOTE: This will be entered as "projectA, projectB, projectX, ..." to local chrome storage
    projectNames: string;
  };
  validation: ValidationState;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ConfigurationForm: React.FC<ConfigFormProps> = ({
  config,
  validation,
  isSaving,
  onSubmit,
  onChange,
}) => {
  const getValidationClass = (isValid: boolean | null) => {
    if (isValid === null) return '';
    return isValid ? 'valid' : 'invalid';
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="token">CircleCI API Token</label>
        <input
          type="password"
          id="token"
          name="token"
          value={config.token}
          onChange={onChange}
          className={getValidationClass(validation.token.isValid)}
        />
        <div className="help-text">Your CircleCI Personal API Token (eg: CCIPAT_...)</div>
        {validation.token.message && (
          <div className={`validation-message ${getValidationClass(validation.token.isValid)}`}>
            {validation.token.message}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="orgSlug">Organization Slug</label>
        <input
          type="text"
          id="orgSlug"
          name="orgSlug"
          value={config.orgSlug}
          onChange={onChange}
          className={getValidationClass(validation.orgSlug.isValid)}
        />
        <div className="help-text">Organization in Circle CI (eg: gh/YourOrg)</div>
        {validation.orgSlug.message && (
          <div className={`validation-message ${getValidationClass(validation.orgSlug.isValid)}`}>
            {validation.orgSlug.message}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="projectNames">Project Names</label>
        <input
          type="text"
          id="projectNames"
          name="projectNames"
          value={config.projectNames}
          onChange={onChange}
          // validation.projectNames is { "projectA": { message, isValid }, "projectB": {message, isValid} } 
          // className={getValidationClass(Object.entries(validation.projectNames).every( keyVal => keyVal[1].isValid === true ))}
          // TODO: This doesnt work correctly as we currently use "valid", "invalid", null
          //   if the above returns false (which .every will at first go), the form with display false. Which we dont want
          //   we actually want null at first, then check. 
          //   ... so for now, just default to null
          className={getValidationClass(null)}
        />
        <div className="help-text">One or more projects in Circle CI, comma separated (eg: rails-app) (eg: projA, projX)</div>
        {Object.entries(validation.projectNames).map(([name, result]) => (
          <div key={name} className={`validation-message ${getValidationClass(result.isValid)}`}>
            {result.isValid ? `✅ Found: ${name}` : `❌ Not Found: ${name}`}
          </div>
        ))}
      </div>

      <div className="button-group">
        <button type="submit" className="save-button" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Options'}
        </button>
      </div>
    </form>
  );
};

export default ConfigurationForm;
