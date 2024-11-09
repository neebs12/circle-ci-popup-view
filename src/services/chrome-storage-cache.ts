import { CacheImplementation } from './cache-implementation';

export class ChromeStorageCache implements CacheImplementation {
    async set(key: string, value: any): Promise<void> {
        console.log(`[Cache Write] Storing data for key: ${key}`);
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: value }, () => {
                console.log(`[Cache Write] Successfully stored data for key: ${key}`);
                resolve();
            });
        });
    }

    async get(key: string): Promise<any> {
        console.log(`[Cache Read] Attempting to read key: ${key}`);
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                const value = result[key];
                if (value) {
                    console.log(`[Cache Hit] Found data for key: ${key}`);
                } else {
                    console.log(`[Cache Miss] No data found for key: ${key}`);
                }
                resolve(value);
            });
        });
    }
}
