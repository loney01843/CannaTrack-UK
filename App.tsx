
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import { AppView, Product, LogEntry, Device, ToleranceBreak, Surgery, Pharmacy, StockedItem } from './types';
import { INITIAL_PRODUCTS } from './constants/products';
import { INITIAL_SURGERIES, INITIAL_PHARMACIES } from './constants/locations';
import LogEntryFormView from './views/LogEntryFormView';
import MyLogsView from './views/MyLogsView';
import ProductsView from './views/ProductsView';
import SuggestionsView from './views/SuggestionsView';
import DashboardView from './views/DashboardView';
import SettingsView from './views/SettingsView';
import StashItemFormModal from './components/StashItemFormModal'; // New import

export type Theme = 'light' | 'dark';

const PRODUCTS_STORAGE_KEY = 'cannaTrackAllProducts';
const LOG_ENTRIES_STORAGE_KEY = 'cannaTrackLogEntries';
const DEVICES_STORAGE_KEY = 'cannaTrackDevices';
const TOLERANCE_BREAKS_STORAGE_KEY = 'cannaTrackToleranceBreaks';
const SURGERIES_STORAGE_KEY = 'cannaTrackSurgeries';
const PHARMACIES_STORAGE_KEY = 'cannaTrackPharmacies';
const STOCKED_ITEMS_STORAGE_KEY = 'cannaTrackStockedItems'; 
const THEME_STORAGE_KEY = 'cannaTrackTheme';


const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  
  const [products, setProducts] = useState<Product[]>(() => {
    const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        return Array.isArray(parsedProducts) ? parsedProducts : INITIAL_PRODUCTS;
      } catch (error) {
        console.error("Error parsing products from localStorage:", error);
        return INITIAL_PRODUCTS;
      }
    }
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  });

  const [logEntries, setLogEntries] = useState<LogEntry[]>(() => {
    const storedLogs = localStorage.getItem(LOG_ENTRIES_STORAGE_KEY);
    return storedLogs ? JSON.parse(storedLogs) : [];
  });

  const [productIdToLog, setProductIdToLog] = useState<string | null>(null);
  
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    return storedTheme || 'light';
  });

  const [ownedDevices, setOwnedDevices] = useState<Device[]>(() => {
    const storedDevices = localStorage.getItem(DEVICES_STORAGE_KEY);
    return storedDevices ? JSON.parse(storedDevices) : [];
  });

  const [toleranceBreaks, setToleranceBreaks] = useState<ToleranceBreak[]>(() => {
    const storedBreaks = localStorage.getItem(TOLERANCE_BREAKS_STORAGE_KEY);
    return storedBreaks ? JSON.parse(storedBreaks) : [];
  });

  const [surgeries, setSurgeries] = useState<Surgery[]>(() => {
    const storedSurgeries = localStorage.getItem(SURGERIES_STORAGE_KEY);
    if (storedSurgeries) {
        try {
            const parsed = JSON.parse(storedSurgeries);
            return Array.isArray(parsed) ? parsed : INITIAL_SURGERIES;
        } catch (e) { return INITIAL_SURGERIES; }
    }
    localStorage.setItem(SURGERIES_STORAGE_KEY, JSON.stringify(INITIAL_SURGERIES));
    return INITIAL_SURGERIES;
  });

  const [pharmacies, setPharmacies] = useState<Pharmacy[]>(() => {
    const storedPharmacies = localStorage.getItem(PHARMACIES_STORAGE_KEY);
     if (storedPharmacies) {
        try {
            const parsed = JSON.parse(storedPharmacies);
            return Array.isArray(parsed) ? parsed : INITIAL_PHARMACIES;
        } catch (e) { return INITIAL_PHARMACIES; }
    }
    localStorage.setItem(PHARMACIES_STORAGE_KEY, JSON.stringify(INITIAL_PHARMACIES));
    return INITIAL_PHARMACIES;
  });

  const [stockedItems, setStockedItems] = useState<StockedItem[]>(() => {
    const storedStash = localStorage.getItem(STOCKED_ITEMS_STORAGE_KEY);
    return storedStash ? JSON.parse(storedStash) : [];
  });
  const [isStashItemFormModalOpen, setIsStashItemFormModalOpen] = useState(false);
  const [stashItemFormState, setStashItemFormState] = useState<{ product?: Product, existingStockedItem?: StockedItem } | null>(null);

  // UI Placeholder for Google Sign-In
  const [isGuestUser, setIsGuestUser] = useState(true);
  const [demoUserName, setDemoUserName] = useState("Guest User");


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => { localStorage.setItem(LOG_ENTRIES_STORAGE_KEY, JSON.stringify(logEntries)); }, [logEntries]);
  useEffect(() => { localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(ownedDevices)); }, [ownedDevices]);
  useEffect(() => { localStorage.setItem(TOLERANCE_BREAKS_STORAGE_KEY, JSON.stringify(toleranceBreaks)); }, [toleranceBreaks]);
  useEffect(() => { localStorage.setItem(SURGERIES_STORAGE_KEY, JSON.stringify(surgeries)); }, [surgeries]);
  useEffect(() => { localStorage.setItem(PHARMACIES_STORAGE_KEY, JSON.stringify(pharmacies)); }, [pharmacies]);
  useEffect(() => { localStorage.setItem(STOCKED_ITEMS_STORAGE_KEY, JSON.stringify(stockedItems)); }, [stockedItems]);


  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const handleNavigate = useCallback((view: AppView, prodId: string | null = null) => {
    setCurrentView(view);
    setProductIdToLog(prodId || null);
    window.scrollTo(0, 0); 
  }, []);

  const addLogEntry = (newLogEntryData: Omit<LogEntry, 'id'>) => {
    const newLog: LogEntry = {
      ...newLogEntryData,
      id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
    };
    setLogEntries(prevLogs => [newLog, ...prevLogs]);
  };

  const deleteLogEntry = (logId: string) => {
    setLogEntries(prevLogs => prevLogs.filter(log => log.id !== logId));
  };
  
  const handleAddProduct = (newProduct: Product) => {
    if (products.some(p => p.id === newProduct.id)) {
        setProducts(prevProducts => prevProducts.map(p => p.id === newProduct.id ? newProduct : p));
        alert(`Product "${newProduct.name}" updated successfully!`);
    } else {
        setProducts(prevProducts => [newProduct, ...prevProducts]);
        alert(`Product "${newProduct.name}" added successfully!`);
    }
  };

  const recentLogs = useMemo(() => 
    [...logEntries].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0,5),
    [logEntries]
  );

  // Device Management
  const addDevice = (deviceData: Omit<Device, 'id'>) => {
    const newDevice: Device = {...deviceData, id: new Date().toISOString() + Math.random().toString(36).substring(2,9) };
    setOwnedDevices(prev => [...prev, newDevice]);
  };
  const updateDevice = (updatedDevice: Device) => setOwnedDevices(prev => prev.map(d => d.id === updatedDevice.id ? updatedDevice : d));
  const deleteDevice = (deviceId: string) => {
    setOwnedDevices(prev => prev.filter(d => d.id !== deviceId));
    setLogEntries(prevLogs => prevLogs.map(log => log.deviceId === deviceId ? {...log, deviceId: undefined} : log));
  };

  // Tolerance Break Management
  const startToleranceBreak = () => {
    setToleranceBreaks(prev => prev.map(tb => tb.isActive ? {...tb, isActive: false, endDate: tb.endDate || new Date().toISOString().split('T')[0] } : tb));
    const newBreak: ToleranceBreak = {
      id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
      startDate: new Date().toISOString().split('T')[0],
      isActive: true,
      endDate: null,
    };
    setToleranceBreaks(prev => [newBreak, ...prev]);
    alert(`Tolerance break started on ${new Date(newBreak.startDate).toLocaleDateString('en-GB')}.`);
  };
  const endToleranceBreak = (breakId: string) => {
    setToleranceBreaks(prev => prev.map(tb => tb.id === breakId ? {...tb, isActive: false, endDate: new Date().toISOString().split('T')[0]} : tb));
    alert('Tolerance break ended.');
  };
  const activeToleranceBreak = useMemo(() => toleranceBreaks.find(tb => tb.isActive) || null, [toleranceBreaks]);

  // Surgery Management
  const addSurgery = (surgeryData: Omit<Surgery, 'id'>) => {
    const newSurgery: Surgery = { ...surgeryData, id: new Date().toISOString() + Math.random().toString(36).substring(2,9) };
    setSurgeries(prev => [...prev, newSurgery]);
  };
  const updateSurgery = (updatedSurgery: Surgery) => setSurgeries(prev => prev.map(s => s.id === updatedSurgery.id ? updatedSurgery : s));
  const deleteSurgery = (surgeryId: string) => {
    setSurgeries(prev => prev.filter(s => s.id !== surgeryId));
    setLogEntries(prevLogs => prevLogs.map(log => log.surgeryId === surgeryId ? {...log, surgeryId: undefined} : log));
  };

  // Pharmacy Management
  const addPharmacy = (pharmacyData: Omit<Pharmacy, 'id'>) => {
    const newPharmacy: Pharmacy = { ...pharmacyData, id: new Date().toISOString() + Math.random().toString(36).substring(2,9) };
    setPharmacies(prev => [...prev, newPharmacy]);
  };
  const updatePharmacy = (updatedPharmacy: Pharmacy) => setPharmacies(prev => prev.map(p => p.id === updatedPharmacy.id ? updatedPharmacy : p));
  const deletePharmacy = (pharmacyId: string) => {
    setPharmacies(prev => prev.filter(p => p.id !== pharmacyId));
    setLogEntries(prevLogs => prevLogs.map(log => log.pharmacyId === pharmacyId ? {...log, pharmacyId: undefined} : log));
  };

  // Stash Management
  const openStashItemFormModal = (product?: Product, existingStockedItem?: StockedItem) => {
    setStashItemFormState({ product, existingStockedItem });
    setIsStashItemFormModalOpen(true);
  };

  const closeStashItemFormModal = () => {
    setIsStashItemFormModalOpen(false);
    setStashItemFormState(null);
  };

  const handleSaveStockedItem = (itemData: { productId: string; quantity: string; acquisitionDate?: string }) => {
    setStockedItems(prev => {
      const existingIndex = prev.findIndex(si => si.productId === itemData.productId);
      if (itemData.quantity.trim() === '' || itemData.quantity.trim() === '0') { 
        if (existingIndex !== -1) {
          return prev.filter(si => si.productId !== itemData.productId);
        }
        return prev; 
      }
      if (existingIndex !== -1) { 
        const updatedItems = [...prev];
        updatedItems[existingIndex] = { ...updatedItems[existingIndex], ...itemData };
        return updatedItems;
      } else { 
        return [...prev, itemData];
      }
    });
    closeStashItemFormModal();
  };
  
  const handleRemoveStockedItem = (productId: string) => {
    setStockedItems(prev => prev.filter(si => si.productId !== productId));
  };

  // Demo Google Sign-In/Out
  const handleDemoSignIn = () => {
    setIsGuestUser(false);
    setDemoUserName("Demo User");
    alert("Simulated Sign-In: You are now 'Demo User'.\n(This is a UI placeholder; no actual Google Sign-In occurred.)");
  };
  const handleDemoSignOut = () => {
    setIsGuestUser(true);
    setDemoUserName("Guest User");
  };


  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <DashboardView 
                  onNavigate={handleNavigate} 
                  recentLogs={recentLogs} 
                  products={products}
                  stockedItems={stockedItems} 
                  activeToleranceBreak={activeToleranceBreak} 
                  theme={theme} 
                />;
      case AppView.LOG_ENTRY:
        return <LogEntryFormView 
                  products={products} 
                  ownedDevices={ownedDevices} 
                  surgeries={surgeries} 
                  pharmacies={pharmacies} 
                  onAddLog={addLogEntry} 
                  onNavigate={handleNavigate} 
                  initialProductId={productIdToLog} 
                  theme={theme}
                />;
      case AppView.MY_LOGS:
        return <MyLogsView 
                  logs={logEntries} 
                  products={products} 
                  ownedDevices={ownedDevices} 
                  surgeries={surgeries} 
                  pharmacies={pharmacies} 
                  onDeleteLog={deleteLogEntry} 
                  onNavigate={handleNavigate} 
                  theme={theme} 
                />;
      case AppView.PRODUCTS:
        return <ProductsView 
                  products={products} 
                  onAddProduct={handleAddProduct} 
                  onNavigate={handleNavigate} 
                  theme={theme} 
                />;
      case AppView.SUGGESTIONS:
        return <SuggestionsView products={products} logs={logEntries} onNavigate={handleNavigate} theme={theme} />;
      case AppView.SETTINGS: 
        return <SettingsView 
                    theme={theme} 
                    toggleTheme={toggleTheme}
                    ownedDevices={ownedDevices}
                    onAddDevice={addDevice}
                    onUpdateDevice={updateDevice}
                    onDeleteDevice={deleteDevice}
                    surgeries={surgeries}
                    onAddSurgery={addSurgery}
                    onUpdateSurgery={updateSurgery}
                    onDeleteSurgery={deleteSurgery}
                    pharmacies={pharmacies}
                    onAddPharmacy={addPharmacy}
                    onUpdatePharmacy={updatePharmacy}
                    onDeletePharmacy={deletePharmacy}
                    toleranceBreaks={toleranceBreaks}
                    onStartToleranceBreak={startToleranceBreak}
                    onEndToleranceBreak={endToleranceBreak}
                    stockedItems={stockedItems} 
                    allProducts={products} 
                    onOpenStashItemForm={openStashItemFormModal} 
                    onRemoveStockedItem={handleRemoveStockedItem} 
                    onNavigate={handleNavigate}
                    isGuestUser={isGuestUser}
                    demoUserName={demoUserName}
                    onDemoSignIn={handleDemoSignIn}
                    onDemoSignOut={handleDemoSignOut}
                />;
      default:
        return <DashboardView 
                  onNavigate={handleNavigate} 
                  recentLogs={recentLogs} 
                  products={products} 
                  stockedItems={stockedItems}
                  activeToleranceBreak={activeToleranceBreak} 
                  theme={theme} 
                />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-page-bg-light dark:bg-page-bg-dark transition-colors duration-300">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main className="flex-grow container mx-auto px-0 sm:px-4 py-4 pb-24 sm:pb-4"> 
        {renderView()}
      </main>
      {isStashItemFormModalOpen && stashItemFormState && (
        <StashItemFormModal
          isOpen={isStashItemFormModalOpen}
          onClose={closeStashItemFormModal}
          onSave={handleSaveStockedItem}
          productToStartWith={stashItemFormState.product}
          existingStockedItem={stashItemFormState.existingStockedItem}
          allProducts={products}
          currentStockedItems={stockedItems}
        />
      )}
      <footer className="bg-dark text-center text-gray-400 dark:bg-gray-900 dark:text-gray-500 p-4 text-xs transition-colors duration-300">
        CannaTrack UK - For informational purposes only. Consult with your healthcare provider.
      </footer>
    </div>
  );
};

export default App;
