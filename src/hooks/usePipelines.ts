import { useState, useEffect } from 'react';
import { CircleCIService } from '../services/circle-ci.service';
import { FormattedPipeline } from '../types/types';
import { ChromeStorageCache } from '../services/chrome-storage-cache';
import { Cache } from '../services/cache';

interface UsePipelinesProps {
  token: string;
  orgSlug: string;
  projectName: string;
  view: 'all' | 'mine';
}

interface UsePipelinesResult {
  pipelines: FormattedPipeline[];
  loading: boolean;
  error: string | null;
}

export function usePipelines({ token, orgSlug, projectName, view }: UsePipelinesProps): UsePipelinesResult {
  const [pipelines, setPipelines] = useState<FormattedPipeline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPipelines = async () => {
      try {
        console.log('[Init] Initializing CircleCI service with caching');
        const chromeStorageCache = new ChromeStorageCache();
        const cache = new Cache(chromeStorageCache);
        const service = new CircleCIService(token, orgSlug, projectName, cache);
        
        console.log(`[Fetch] Starting ${view} pipeline data fetch`);
        const data = await service.getPipelinesWithWorkflows(view);
        const formattedData = service.formatPipelineData(data);
        console.log('[Success] Pipeline data fetched and formatted');
        
        setPipelines(formattedData);
      } catch (err) {
        console.error('[Error] Failed to fetch pipeline data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch pipeline data');
      } finally {
        setLoading(false);
      }
    };

    fetchPipelines();
  }, [token, orgSlug, projectName, view]);

  return { pipelines, loading, error };
}
