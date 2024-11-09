import { BaseApiService } from './base-api.service';
import { Workflow, ApiResponse } from '../types/types';
import { Cache } from './cache';

export class WorkflowService extends BaseApiService {
  private readonly cache?: Cache;

  constructor(token: string, orgSlug: string, projectName: string, cache?: Cache) {
    super(token, orgSlug, projectName);
    this.cache = cache;
  }

  private getCacheKey(pipelineId: string): string {
    return `pipeline_${pipelineId}`;
  }

  async getWorkflowsForPipeline(pipelineId: string): Promise<Workflow[]> {
    try {
      // Check cache first if available
      if (this.cache) {
        const cachedWorkflows = await this.cache.get(this.getCacheKey(pipelineId));
        if (cachedWorkflows) {
          console.log(`[Cache Hit] Using cached workflows for pipeline ${pipelineId}`);
          return cachedWorkflows;
        }
        console.log(`[Cache Miss] No cached data found for pipeline ${pipelineId}`);
      }

      // Fetch from API if not in cache
      console.log(`[API Call] Fetching workflows for pipeline ${pipelineId}`);
      const data = await this.fetchApi<ApiResponse<Workflow>>(`/pipeline/${pipelineId}/workflow`);
      const workflows = data.items;

      // Cache workflows if any of them are successful
      if (this.cache) {
        const hasSuccessfulWorkflow = workflows.some(workflow => workflow.status === 'success');
        if (hasSuccessfulWorkflow) {
          console.log(`[Cache Write] Caching workflows for pipeline ${pipelineId} (Found successful workflow)`);
          await this.cache.set(this.getCacheKey(pipelineId), workflows);
        } else {
          console.log(`[Cache Skip] Not caching workflows for pipeline ${pipelineId} (No successful workflows)`);
          const statuses = workflows.map(w => w.status).join(', ');
          console.log(`[Cache Skip] Workflow statuses: ${statuses}`);
        }
      }

      return workflows;
    } catch (error) {
      console.error(`[API Error] Error fetching workflows for pipeline ${pipelineId}:`, error);
      throw error;
    }
  }
}
