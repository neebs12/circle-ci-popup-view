import { BaseApiService } from './base-api.service';

interface ValidationResult {
  isValid: boolean;
  message: string;
}

export class ValidationService extends BaseApiService {
  async validateToken(): Promise<ValidationResult> {
    try {
      const data = await this.fetchApi<{ name: string }>('/me');
      return {
        isValid: true,
        message: `✅ Token valid (authenticated as ${data.name})`
      };
    } catch (error) {
      return {
        isValid: false,
        message: '❌ Error validating token'
      };
    }
  }

  async validateOrgSlug(): Promise<ValidationResult> {
    try {
      const data = await this.fetchApi<Array<{ slug: string }>>('/me/collaborations');
      const validSlugs = data.map(org => org.slug);
      
      if (validSlugs.includes(this.orgSlug)) {
        return {
          isValid: true,
          message: '✅ Organization found'
        };
      }
      
      return {
        isValid: false,
        message: '❌ Organization not found in your collaborations'
      };
    } catch (error) {
      return {
        isValid: false,
        message: '❌ Error validating organization'
      };
    }
  }

  async validateProjectName(): Promise<ValidationResult> {
    try {
      await this.fetchApi(`/project/${this.orgSlug}/${this.projectName}`);
      return {
        isValid: true,
        message: '✅ Project found'
      };
    } catch (error) {
      return {
        isValid: false,
        message: '❌ Project not found'
      };
    }
  }
}
