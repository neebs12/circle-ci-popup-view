export class BaseApiService {
  protected readonly baseUrl = 'https://circleci.com/api/v2';
  protected readonly token: string;
  protected readonly orgSlug: string;
  protected readonly projectName: string;

  constructor(token: string, orgSlug: string, projectName: string) {
    this.token = token;
    this.orgSlug = orgSlug;
    this.projectName = projectName;
  }

  protected get headers() {
    return {
      'Circle-Token': this.token,
      'Content-Type': 'application/json',
    };
  }

  protected async fetchApi<T>(url: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API Error] Error fetching ${url}:`, error);
      throw error;
    }
  }
}
