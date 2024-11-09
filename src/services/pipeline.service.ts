import { BaseApiService } from './base-api.service';
import { Pipeline, ApiResponse, PipelineWithWorkflows } from '../types/types';
import { WorkflowService } from './workflow.service';
import { Cache } from './cache';

export class PipelineService extends BaseApiService {
  private readonly workflowService: WorkflowService;

  constructor(token: string, orgSlug: string, projectName: string, cache?: Cache) {
    super(token, orgSlug, projectName);
    this.workflowService = new WorkflowService(token, orgSlug, projectName, cache);
  }

  async getPipelines(view: 'all' | 'mine' = 'all'): Promise<Pipeline[]> {
    try {
      console.log(`[API Call] Fetching ${view} pipelines list`);
      const endpoint = view === 'mine' 
        ? `/project/${this.orgSlug}/${this.projectName}/pipeline/mine`
        : `/project/${this.orgSlug}/${this.projectName}/pipeline`;
      
      const data = await this.fetchApi<ApiResponse<Pipeline>>(endpoint);
      console.log(`[API Success] Retrieved ${data.items.length} pipelines`);
      return data.items;
    } catch (error) {
      console.error('[API Error] Error fetching pipelines:', error);
      throw error;
    }
  }

  async getPipelinesWithWorkflows(view: 'all' | 'mine' = 'all'): Promise<PipelineWithWorkflows[]> {
    try {
      console.log(`[Start] Fetching ${view} pipelines and their workflows`);
      const pipelines = await this.getPipelines(view);
      console.log(`[Process] Processing ${pipelines.length} pipelines`);
      
      const pipelineWorkflows = await Promise.all(
        pipelines.map(async (pipeline) => {
          const workflows = await this.workflowService.getWorkflowsForPipeline(pipeline.id);
          return {
            pipeline,
            workflows
          };
        })
      );
      
      console.log('[End] Completed fetching all pipeline workflows');
      return pipelineWorkflows;
    } catch (error) {
      console.error('[Error] Error fetching pipelines with workflows:', error);
      throw error;
    }
  }

  formatPipelineData(pipelineData: PipelineWithWorkflows[]) {
    console.log('[Format] Formatting pipeline data for display');

    return pipelineData.map(({ pipeline, workflows }) => ({
      id: pipeline.id,
      pipeline_number: pipeline.number,
      trigger_type: pipeline.trigger.type,
      actor: pipeline.trigger.actor.login,
      actor_avatar: pipeline.trigger.actor.avatar_url,
      branch: pipeline.vcs.branch || pipeline.vcs.tag || 'N/A',
      commit_hash: pipeline.vcs.revision.slice(0, 7),
      // If the commit message is empty, we simply add "..."
      commit_subject: pipeline.vcs.commit?.subject || "...",
      pipeline_url: `https://app.circleci.com/pipelines/github/${pipeline.project_slug.split('/').slice(1).join('/')}/${pipeline.number}`,
      workflows: workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        status: workflow.status,
        created_at: workflow.created_at,
        workflow_url: `https://app.circleci.com/pipelines/github/${pipeline.project_slug.split('/').slice(1).join('/')}/${pipeline.number}/workflows/${workflow.id}`
      }))
    }));
  }
}
