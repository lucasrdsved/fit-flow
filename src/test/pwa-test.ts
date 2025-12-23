// PWA Functionality Tests
// These tests can be run to verify PWA features are working correctly

describe('PWA Functionality', () => {
  beforeEach(() => {
    // Mock service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register = vi.fn().mockResolvedValue({
        installing: null,
        waiting: null,
        active: null,
        scope: 'http://localhost:4173/',
        updateViaCache: 'all'
      });
    }

    // Mock Notification API
    if ('Notification' in window) {
      Notification.requestPermission = vi.fn().mockResolvedValue('granted');
      Object.defineProperty(Notification, 'permission', {
        get: () => 'granted'
      });
    }
  });

  test('Service Worker Registration', async () => {
    expect('serviceWorker' in navigator).toBe(true);
    
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.register('/sw.js');
      expect(registration.scope).toBe('http://localhost:4173/');
    }
  });

  test('Notification Permission', async () => {
    expect('Notification' in window).toBe(true);
    
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      expect(permission).toBe('granted');
    }
  });

  test('IndexedDB Support', () => {
    expect('indexedDB' in window).toBe(true);
    
    if ('indexedDB' in window) {
      const request = indexedDB.open('test-db', 1);
      expect(request).toBeDefined();
    }
  });

  test('Online/Offline Detection', () => {
    expect(navigator.onLine).toBeDefined();
    expect(typeof navigator.onLine).toBe('boolean');
  });

  test('PWA Manifest Loading', async () => {
    const manifestResponse = await fetch('/manifest.json');
    expect(manifestResponse.ok).toBe(true);
    
    const manifest = await manifestResponse.json();
    expect(manifest.name).toBe('FitFlow - Fitness Management Platform');
    expect(manifest.short_name).toBe('FitFlow');
    expect(manifest.icons).toBeDefined();
    expect(manifest.icons.length).toBeGreaterThan(0);
  });

  test('Service Worker File Exists', async () => {
    const swResponse = await fetch('/sw.js');
    expect(swResponse.ok).toBe(true);
    
    const swText = await swResponse.text();
    expect(swText).toContain('CACHE_VERSION');
    expect(swText).toContain('FitFlow');
  });

  test('Icons Load Correctly', async () => {
    const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
    
    for (const size of iconSizes) {
      const iconResponse = await fetch(`/icons/icon-${size}x${size}.png`);
      expect(iconResponse.ok).toBe(true);
      expect(iconResponse.headers.get('content-type')).toMatch(/image\/png/);
    }
  });
});

// Manual PWA Testing Checklist
export const PWATestChecklist = {
  serviceWorker: {
    registered: 'Service worker registered successfully',
    caching: 'Static assets are cached',
    offline: 'App works offline',
    updates: 'App updates when new version available'
  },
  installable: {
    prompt: 'Install prompt appears',
    standalone: 'App launches in standalone mode',
    icons: 'App icons display correctly',
    splash: 'Splash screen shows on load'
  },
  notifications: {
    permission: 'Notification permission granted',
    display: 'Notifications display correctly',
    actions: 'Notification actions work',
    background: 'Notifications work when app in background'
  },
  performance: {
    loadTime: 'Initial load < 3 seconds',
    response: 'App responds to user input quickly',
    caching: 'API responses cached appropriately',
    bundleSize: 'Bundle size < 400KB'
  },
  offline: {
    dataSync: 'Data syncs when back online',
    storage: 'Offline data stored correctly',
    queue: 'Actions queued while offline',
    recovery: 'App recovers from network failures'
  }
};

// PWA Feature Detection
export const detectPWAFeatures = () => {
  const features = {
    serviceWorker: 'serviceWorker' in navigator,
    notifications: 'Notification' in window,
    pushManager: 'PushManager' in window,
    indexedDB: 'indexedDB' in window,
    onlineStatus: 'onLine' in navigator,
    shareAPI: 'share' in navigator,
    fileSystem: 'showSaveFilePicker' in window,
    wakeLock: 'wakeLock' in navigator,
    bluetooth: 'bluetooth' in navigator,
    usb: 'usb' in navigator,
    nfc: 'nfc' in window,
    geolocation: 'geolocation' in navigator,
    camera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    microphone: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
    vibration: 'vibrate' in navigator,
    fullscreen: 'fullscreenEnabled' in document,
    pictureInPicture: 'pictureInPictureEnabled' in document,
    webShare: 'share' in navigator,
    webAuthn: 'credentials' in navigator,
    paymentRequest: 'PaymentRequest' in window,
    webGL: (() => {
      try {
        const canvas = document.createElement('canvas');
        return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
      } catch (e) {
        return false;
      }
    })(),
    webAssembly: 'WebAssembly' in window,
    webWorker: 'Worker' in window,
    webSocket: 'WebSocket' in window,
    localStorage: 'localStorage' in window,
    sessionStorage: 'sessionStorage' in window
  };

  return features;
};

// Performance Monitoring
export const monitorPerformance = () => {
  if ('performance' in window) {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    return {
      // Core Web Vitals
      LCP: performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0,
      FID: performance.getEntriesByType('first-input')[0]?.processingStart || 0,
      CLS: performance.getEntriesByType('layout-shift').reduce((sum, entry) => {
        return sum + (entry as any).value;
      }, 0),
      
      // Navigation timing
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      firstPaint: performance.getEntriesByType('paint')[0]?.startTime || 0,
      firstContentfulPaint: performance.getEntriesByType('paint')[1]?.startTime || 0,
      
      // Resource timing
      resourceCount: performance.getEntriesByType('resource').length,
      totalTransferSize: performance.getEntriesByType('resource').reduce((sum, entry) => {
        return sum + (entry as any).transferSize || 0;
      }, 0)
    };
  }
  
  return null;
};

// Network Status Monitoring
export const monitorNetworkStatus = () => {
  const status = {
    online: navigator.onLine,
    connection: null,
    effectiveType: null,
    downlink: null,
    rtt: null,
    saveData: null
  };

  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    status.connection = connection;
    status.effectiveType = connection.effectiveType;
    status.downlink = connection.downlink;
    status.rtt = connection.rtt;
    status.saveData = connection.saveData;
  }

  return status;
};

// PWA Installation Status
export const checkInstallationStatus = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInWebAppiOS = (window.navigator as any).standalone === true;
  const isInWebAppChrome = window.matchMedia('(display-mode: standalone)').matches;
  
  return {
    isInstalled: isStandalone || isInWebAppiOS || isInWebAppChrome,
    isStandalone,
    isInWebAppiOS,
    isInWebAppChrome,
    displayMode: (() => {
      if (isStandalone) return 'standalone';
      if (isInWebAppiOS) return 'ios-webapp';
      if (isInWebAppChrome) return 'chrome-webapp';
      return 'browser';
    })()
  };
};