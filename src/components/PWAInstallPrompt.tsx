import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installCount, setInstallCount] = useState(0);
  const [dismissedCount, setDismissedCount] = useState(0);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Get install/dismiss counts from localStorage
    const storedInstallCount = parseInt(localStorage.getItem('pwa-install-count') || '0');
    const storedDismissedCount = parseInt(localStorage.getItem('pwa-dismissed-count') || '0');
    setInstallCount(storedInstallCount);
    setDismissedCount(storedDismissedCount);

    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt if not dismissed too many times
      if (dismissedCount < 3 && !isInstalled) {
        // Delay showing to avoid immediate popup
        setTimeout(() => {
          setShowInstall(true);
        }, 3000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstall(false);
      setDeferredPrompt(null);
      console.log('[PWA] App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [dismissedCount, isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        const newCount = installCount + 1;
        setInstallCount(newCount);
        localStorage.setItem('pwa-install-count', newCount.toString());
        console.log('[PWA] User accepted the install prompt');
      } else {
        console.log('[PWA] User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowInstall(false);
    } catch (error) {
      console.error('[PWA] Error during install:', error);
    }
  };

  const handleDismiss = () => {
    setShowInstall(false);
    const newCount = dismissedCount + 1;
    setDismissedCount(newCount);
    localStorage.setItem('pwa-dismissed-count', newCount.toString());
    
    // Don't show again for this session if dismissed multiple times
    if (newCount >= 3) {
      localStorage.setItem('pwa-install-dismissed-permanently', 'true');
    }
  };

  const handleInstallInstructions = () => {
    setShowInstall(false);
    // Show instructions based on browser
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (userAgent.includes('chrome')) {
      alert('To install FitFlow:\n1. Click the menu icon (⋮) in the address bar\n2. Click "Install FitFlow"\n3. Click "Install" in the dialog');
    } else if (userAgent.includes('safari')) {
      alert('To install FitFlow:\n1. Click the Share icon (□↑) in the address bar\n2. Scroll down and click "Add to Home Screen"\n3. Click "Add" in the dialog');
    } else if (userAgent.includes('firefox')) {
      alert('To install FitFlow:\n1. Open the menu (☰) in the browser\n2. Click "Install this site as an app"\n3. Click "Install" in the dialog');
    } else {
      alert('Look for "Install" or "Add to Home Screen" in your browser menu to install FitFlow');
    }
  };

  // Don't show if already installed or permanently dismissed
  if (isInstalled || localStorage.getItem('pwa-install-dismissed-permanently') === 'true') {
    return null;
  }

  // Don't show if no install prompt is available
  if (!showInstall || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600">
                <Download className="h-4 w-4 text-white" />
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Install App
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-lg text-gray-900">
            Install FitFlow
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Get the best experience with our app! Work offline, receive notifications, and enjoy faster loading.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <Smartphone className="h-3 w-3 text-green-600" />
              <span className="text-gray-600">Mobile Optimized</span>
            </div>
            <div className="flex items-center space-x-1">
              <Monitor className="h-3 w-3 text-green-600" />
              <span className="text-gray-600">Desktop Support</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              onClick={handleInstallClick}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" />
              Install Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleInstallInstructions}
              className="border-green-200 text-green-700 hover:bg-green-50"
            >
              How?
            </Button>
          </div>
          
          {dismissedCount > 0 && (
            <p className="text-xs text-gray-500 text-center">
              This reminder will appear {Math.max(0, 3 - dismissedCount)} more time{Math.max(0, 3 - dismissedCount) !== 1 ? 's' : ''}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// PWA Install Banner for better visibility
export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      if (!isInstalled && localStorage.getItem('pwa-install-dismissed-permanently') !== 'true') {
        setTimeout(() => setShowBanner(true), 2000);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  if (isInstalled || !showBanner) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
            <Download className="h-5 w-5" />
          </div>
          <div>
            <p className="font-semibold">Install FitFlow</p>
            <p className="text-sm text-green-100">Get the full experience with our app</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowBanner(false)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            Maybe Later
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              if (deferredPrompt) {
                await deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setDeferredPrompt(null);
                setShowBanner(false);
              }
            }}
            className="bg-white text-green-600 hover:bg-green-50"
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook to check PWA installation status
export function usePWAInstall() {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    checkInstalled();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setIsInstallable(false);
      return outcome === 'accepted';
    } catch (error) {
      console.error('[PWA] Install error:', error);
      return false;
    }
  };

  return {
    isInstalled,
    isInstallable,
    install,
    deferredPrompt
  };
}