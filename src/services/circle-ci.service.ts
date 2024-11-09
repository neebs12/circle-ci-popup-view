import { PipelineWithWorkflows } from '../types/types';
import { Cache } from './cache';
import { ValidationService } from './validation.service';
import { PipelineService } from './pipeline.service';

export class CircleCIService {
  private readonly validationService: ValidationService;
  private readonly pipelineService: PipelineService;

  constructor(token: string, orgSlug: string, projectName: string, cache?: Cache) {
    this.validationService = new ValidationService(token, orgSlug, projectName);
    this.pipelineService = new PipelineService(token, orgSlug, projectName, cache);
  }

  // Validation methods
  async validateToken() {
    return this.validationService.validateToken();
  }

  async validateOrgSlug() {
    return this.validationService.validateOrgSlug();
  }

  async validateProjectName() {
    return this.validationService.validateProjectName();
  }

  // Pipeline methods
  async getPipelinesWithWorkflows(view: 'all' | 'mine' = 'all'): Promise<PipelineWithWorkflows[]> {
    return this.pipelineService.getPipelinesWithWorkflows(view);
  }

  formatPipelineData(pipelineData: PipelineWithWorkflows[]) {
    return this.pipelineService.formatPipelineData(pipelineData);
  }
}
