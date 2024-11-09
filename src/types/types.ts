export interface Actor {
  login: string;
  avatar_url: string | null;
}

export interface Trigger {
  received_at: string;
  type: 'webhook' | 'schedule';
  actor: Actor;
}

export interface VcsCommit {
  body: string;
  subject: string;
}

export interface Vcs {
  origin_repository_url: string;
  target_repository_url: string;
  revision: string;
  provider_name: string;
  commit?: VcsCommit;
  branch?: string;
  tag?: string;
}

export interface Pipeline {
  id: string;
  errors: any[];
  project_slug: string;
  updated_at: string;
  number: number;
  state: string;
  created_at: string;
  trigger: Trigger;
  vcs: Vcs;
}

export interface Workflow {
  pipeline_id: string;
  id: string;
  name: string;
  project_slug: string;
  status: string;
  started_by: string;
  pipeline_number: number;
  created_at: string;
  stopped_at: string;
  tag?: string;
}

export interface PipelineWithWorkflows {
  pipeline: Pipeline;
  workflows: Workflow[];
}

export interface ApiResponse<T> {
  items: T[];
  next_page_token: string | null;
}

export interface FormattedPipeline {
  id: string;
  pipeline_number: number;
  trigger_type: string;
  actor: string;
  actor_avatar: string | null;
  branch: string;
  commit_hash: string;
  commit_subject: string;
  pipeline_url: string;
  workflows: {
    id: string;
    name: string;
    status: string;
    created_at: string;
    workflow_url: string;
  }[];
}
