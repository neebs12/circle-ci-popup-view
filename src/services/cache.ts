import { CacheImplementation } from './cache-implementation';

export class Cache {
    private cacheImpl: CacheImplementation;

    constructor(implementation: CacheImplementation) {
        this.cacheImpl = implementation;
    }

    async set(key: string, value: any): Promise<void> {
        return this.cacheImpl.set(key, value);
    }

    async get(key: string): Promise<any> {
        return this.cacheImpl.get(key);
    }
}
