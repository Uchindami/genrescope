import { useEffect } from 'react';
import { useSWRConfig } from 'swr';

/**
 * Development-only hook to expose SWR cache in console
 */
export function useSWRDevTools() {
  const { cache, mutate } = useSWRConfig();
  
  useEffect(() => {
    if (import.meta.env.DEV && typeof window !== 'undefined') {
      // Expose cache inspector
      (window as any).__SWR_DEVTOOLS__ = {
        // View all cached keys
        keys: () => {
          const keys: string[] = [];
          if (cache instanceof Map) {
            cache.forEach((_, key) => keys.push(key));
          }
          console.table(keys);
          return keys;
        },
        
        // View cache value
        get: (key: string) => {
          if (cache instanceof Map) {
            const value = cache.get(key);
            console.log('Cache value:', value);
            return value;
          }
        },
        
        // Clear specific key
        clear: (key: string) => {
          mutate(key, undefined);
          console.log(`Cleared cache for: ${key}`);
        },
        
        // Clear all cache
        clearAll: () => {
          mutate(() => true, undefined, { revalidate: false });
          console.log('Cleared all cache');
        },
        
        // Stats
        stats: () => {
          let count = 0;
          if (cache instanceof Map) {
            count = cache.size;
          }
          console.log(`Total cached keys: ${count}`);
          return { cacheSize: count };
        },
      };
      
      console.log('[SWR DevTools] Available at window.__SWR_DEVTOOLS__');
      console.log('[SWR DevTools] Try: window.__SWR_DEVTOOLS__.keys()');
    }
  }, [cache, mutate]);
}
