import { useState } from 'react';
import { CircleCIService } from '../services/circle-ci.service';

interface ValidationState {
  token: { message: string; isValid: boolean | null };
  orgSlug: { message: string; isValid: boolean | null };
  projectNames: { [key: string]: { message: string; isValid: boolean | null } };
}

export const useValidation = () => {
  const [validation, setValidation] = useState<ValidationState>({
    token: { message: '', isValid: null },
    orgSlug: { message: '', isValid: null },
    projectNames: {}
  });

  const resetValidation = () => {
    setValidation({
      token: { message: '', isValid: null },
      orgSlug: { message: '', isValid: null },
      projectNames: {}
    });
  };

  const validateConfiguration = async (
    token: string,
    orgSlug: string,
    projectNamesInput: string
  ): Promise<boolean> => {
    resetValidation();
    
    let hasWarnings = false;

    try {
      // Validate token and orgSlug
      const service = new CircleCIService(token, orgSlug, '');
      const tokenValidation = await service.validateToken();
      const orgValidation = await service.validateOrgSlug();

      const projectNames = projectNamesInput.split(",").map(pn => pn.trim())
      const projectValidations: { [key: string]: { message: string; isValid: boolean | null } } = {};

      for (const projectName of projectNames) {
        const projectService = new CircleCIService(token, orgSlug, projectName);
        const projectValidation = await projectService.validateProjectName();
        projectValidations[projectName] = projectValidation;
        if (!projectValidation.isValid) {
          hasWarnings = true;
        }
      }

      setValidation({
        token: tokenValidation,
        orgSlug: orgValidation,
        projectNames: projectValidations
      });

      hasWarnings = hasWarnings || !tokenValidation.isValid || !orgValidation.isValid;
    } catch (error) {
      console.error('Validation error:', error);
      hasWarnings = true;
    }

    return !hasWarnings;
  };

  return {
    validation,
    validateConfiguration,
    resetValidation
  };
};
