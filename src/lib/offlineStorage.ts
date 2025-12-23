// Offline Storage Manager for FitFlow PWA
// Handles IndexedDB operations for offline functionality
import { useState, useEffect } from 'react';

export interface WorkoutData {
  id: string;
  student_id: string;
  workout_id: string;
  exercises: ExerciseData[];
  completed_at?: string;
  duration_minutes?: number;
  difficulty_rating?: number;
  notes?: string;
  isOffline?: boolean;
}

export interface ExerciseData {
  id: string;
  workout_id: string;
  name: string;
  sets: SetData[];
  rest_time?: number;
  notes?: string;
  order_index: number;
}

export interface SetData {
  id?: string;
  exercise_id: string;
  set_number: number;
  weight?: number;
  reps?: number;
  completed: boolean;
  timestamp?: number;
}

export interface SyncQueueItem {
  id: string;
  type: 'workout' | 'exercise' | 'measurement';
  action: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount?: number;
}

export class OfflineStorageManager {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'FitFlowOffline';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        console.log('[OfflineStorage] Database initialized');
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        // Store workout data
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
          workoutStore.createIndex('student_id', 'student_id', { unique: false });
          workoutStore.createIndex('workout_id', 'workout_id', { unique: false });
          workoutStore.createIndex('completed_at', 'completed_at', { unique: false });
        }
        
        // Store exercise data
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
          exerciseStore.createIndex('workout_id', 'workout_id', { unique: false });
          exerciseStore.createIndex('order_index', 'order_index', { unique: false });
        }
        
        // Store set data
        if (!db.objectStoreNames.contains('sets')) {
          const setStore = db.createObjectStore('sets', { keyPath: 'id', autoIncrement: true });
          setStore.createIndex('exercise_id', 'exercise_id', { unique: false });
          setStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store sync queue
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { keyPath: 'id' });
          syncStore.createIndex('type', 'type', { unique: false });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store cached API responses
        if (!db.objectStoreNames.contains('apiCache')) {
          const apiStore = db.createObjectStore('apiCache', { keyPath: 'url' });
          apiStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store user preferences
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      };
    });
  }

  // Workout Management
  async storeWorkoutData(workoutData: WorkoutData): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['workouts'], 'readwrite');
    const store = transaction.objectStore('workouts');
    
    // Mark as offline data
    workoutData.isOffline = true;
    
    return new Promise((resolve, reject) => {
      const request = store.put(workoutData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getWorkoutData(id: string): Promise<WorkoutData | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['workouts'], 'readonly');
    const store = transaction.objectStore('workouts');
    
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllWorkoutData(studentId?: string): Promise<WorkoutData[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['workouts'], 'readonly');
    const store = transaction.objectStore('workouts');
    
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      
      if (studentId) {
        const index = store.index('student_id');
        request = index.getAll(studentId);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async deleteWorkoutData(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['workouts'], 'readwrite');
    const store = transaction.objectStore('workouts');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // Exercise Management
  async storeExerciseData(exerciseData: ExerciseData): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['exercises'], 'readwrite');
    const store = transaction.objectStore('exercises');
    
    return new Promise((resolve, reject) => {
      const request = store.put(exerciseData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getExerciseData(workoutId: string): Promise<ExerciseData[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['exercises'], 'readonly');
    const store = transaction.objectStore('exercises');
    const index = store.index('workout_id');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(workoutId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Set Management
  async storeSetData(setData: SetData): Promise<string> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['sets'], 'readwrite');
    const store = transaction.objectStore('sets');
    
    if (!setData.timestamp) {
      setData.timestamp = Date.now();
    }
    
    return new Promise((resolve, reject) => {
      const request = store.put(setData);
      request.onsuccess = () => resolve(request.result as string);
      request.onerror = () => reject(request.error);
    });
  }

  async getSetData(exerciseId: string): Promise<SetData[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['sets'], 'readonly');
    const store = transaction.objectStore('sets');
    const index = store.index('exercise_id');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(exerciseId);
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  // Sync Queue Management
  async addToSyncQueue(item: Omit<SyncQueueItem, 'id'>): Promise<string> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    const syncItem: SyncQueueItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      retryCount: 0
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(syncItem);
      request.onsuccess = () => resolve(syncItem.id);
      request.onerror = () => reject(request.error);
    });
  }

  async getSyncQueueItems(type?: string): Promise<SyncQueueItem[]> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readonly');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      let request: IDBRequest;
      
      if (type) {
        const index = store.index('type');
        request = index.getAll(type);
      } else {
        request = store.getAll();
      }
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async updateSyncQueueRetryCount(id: string): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['syncQueue'], 'readwrite');
    const store = transaction.objectStore('syncQueue');
    
    return new Promise((resolve, reject) => {
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const item = getRequest.result;
        if (item) {
          item.retryCount = (item.retryCount || 0) + 1;
          const updateRequest = store.put(item);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          resolve();
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  // API Cache Management
  async cacheApiResponse(url: string, data: any, ttl: number = 300000): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['apiCache'], 'readwrite');
    const store = transaction.objectStore('apiCache');
    
    const cacheItem = {
      url,
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    };
    
    return new Promise((resolve, reject) => {
      const request = store.put(cacheItem);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getCachedApiResponse(url: string): Promise<any | null> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['apiCache'], 'readonly');
    const store = transaction.objectStore('apiCache');
    
    return new Promise((resolve, reject) => {
      const request = store.get(url);
      request.onsuccess = () => {
        const result = request.result;
        if (result && result.expires > Date.now()) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearExpiredCache(): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['apiCache'], 'readwrite');
    const store = transaction.objectStore('apiCache');
    const index = store.index('timestamp');
    const now = Date.now();
    
    return new Promise((resolve, reject) => {
      const request = index.openCursor(IDBKeyRange.upperBound(now));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Preferences Management
  async setPreference(key: string, value: any): Promise<void> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['preferences'], 'readwrite');
    const store = transaction.objectStore('preferences');
    
    return new Promise((resolve, reject) => {
      const request = store.put({ key, value });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getPreference(key: string): Promise<any> {
    if (!this.db) await this.init();
    
    const transaction = this.db!.transaction(['preferences'], 'readonly');
    const store = transaction.objectStore('preferences');
    
    return new Promise((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.value : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  // Storage Management
  async getStorageStats(): Promise<{ usage: number; quota: number; breakdown: any[] }> {
    if (!this.db) await this.init();
    
    const breakdown = [];
    const totalUsage = 0;
    
    const storeNames = ['workouts', 'exercises', 'sets', 'syncQueue', 'apiCache', 'preferences'];
    
    for (const storeName of storeNames) {
      try {
        const transaction = this.db!.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        
        const count = await new Promise<number>((resolve) => {
          const request = store.count();
          request.onsuccess = () => resolve(request.result);
        });
        
        breakdown.push({ store: storeName, count });
      } catch (error) {
        console.warn(`[OfflineStorage] Could not get stats for ${storeName}:`, error);
      }
    }
    
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        return {
          usage: estimate.usage || 0,
          quota: estimate.quota || 0,
          breakdown
        };
      } catch (error) {
        console.warn('[OfflineStorage] Could not get storage estimate:', error);
      }
    }
    
    return { usage: totalUsage, quota: 0, breakdown };
  }

  async clearAllData(): Promise<void> {
    if (!this.db) await this.init();
    
    const storeNames = ['workouts', 'exercises', 'sets', 'syncQueue', 'apiCache', 'preferences'];
    
    for (const storeName of storeNames) {
      try {
        const transaction = this.db!.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        await new Promise<void>((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      } catch (error) {
        console.warn(`[OfflineStorage] Could not clear ${storeName}:`, error);
      }
    }
    
    console.log('[OfflineStorage] All data cleared');
  }

  // Close database connection
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
export const offlineStorage = new OfflineStorageManager();

// React hook for offline storage
export function useOfflineStorage() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [storageStats, setStorageStats] = useState<any>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const updateStats = async () => {
      try {
        const stats = await offlineStorage.getStorageStats();
        setStorageStats(stats);
      } catch (error) {
        console.error('[OfflineStorage] Failed to get stats:', error);
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return {
    isOnline,
    storageStats,
    offlineStorage
  };
}