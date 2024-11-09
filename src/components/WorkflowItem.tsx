import { formatTimeAgo } from '../utils/dateUtils';

interface WorkflowItemProps {
  id: string;
  name: string;
  status: string;
  created_at: string;
  workflow_url: string;
}

export function WorkflowItem({ name, status, created_at, workflow_url }: WorkflowItemProps) {
  const defaultStatusClass = "running"
  const statusClass = [ "success", "failed" ].includes(status.toLowerCase()) ? `status-${status}` : `status-${defaultStatusClass}`

  return (
    <div className={`workflow-item ${statusClass}`}>
      <a 
        href={workflow_url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="workflow-name-link"
      >
        {name}
      </a>
      <div className="workflow-details">
        <span className="workflow-status">{status}</span>
        <span className="workflow-time">{formatTimeAgo(created_at)}</span>
      </div>
    </div>
  );
}
