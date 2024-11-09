export interface CacheImplementation {
    set(key: string, value: any): Promise<void>;
    get(key: string): Promise<any>;
}
