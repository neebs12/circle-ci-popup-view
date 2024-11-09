import { usePipelines } from '../hooks/usePipelines';
import { PipelineCard } from './PipelineCard';
import './PipelineList.css';

interface PipelineListProps {
  token: string;
  orgSlug: string;
  projectName: string;
  view: 'all' | 'mine';
}

export function PipelineList({ token, orgSlug, projectName, view }: PipelineListProps) {
  const { pipelines, loading, error } = usePipelines({ 
    token, 
    orgSlug, 
    projectName,
    view
  });

  if (loading) {
    return <div className="loading">Loading pipelines...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="pipeline-list">
      {pipelines.map((pipeline) => (
        <PipelineCard 
          key={pipeline.id} 
          pipeline={pipeline}
        />
      ))}
    </div>
  );
}
