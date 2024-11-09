import { WorkflowItem } from './WorkflowItem';
import { FormattedPipeline } from '../types/types';

interface PipelineCardProps {
  pipeline: FormattedPipeline;
}

export function PipelineCard({ pipeline }: PipelineCardProps) {
  return (
    <div className="pipeline-card">
      <div className="pipeline-header">
        <div className="pipeline-info">
          <a 
            href={pipeline.pipeline_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="pipeline-number-link"
          >
            🔗 #{ pipeline.pipeline_number}
          </a>
          <div className="actor-info">
            {pipeline.actor_avatar ? (
              <img src={pipeline.actor_avatar} alt={pipeline.actor} className="actor-avatar" />
            ) : (
              <span className="robot-avatar">🤖</span>
            )}
          </div>
          <span className="pipeline-branch">{pipeline.branch}</span>
        </div>
      </div>

      <div className="commit-info">
        <span className="commit-hash">{pipeline.commit_hash}</span>
        <span className="commit-subject">{pipeline.commit_subject}</span>
      </div>

      <div className="workflows">
        {pipeline.workflows.map((workflow) => (
          <WorkflowItem 
            key={workflow.id}
            {...workflow}
          />
        ))}
      </div>
    </div>
  );
}
