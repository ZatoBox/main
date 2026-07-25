import {
  Package,
  Home,
  Archive,
  Brain,
  Scan,
  Store,
  FileText,
  RefreshCw,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string;
  icon: LucideIcon;
  path: string;
  pluginId?: string;
  alwaysVisible: boolean;
}

export const menuItems: MenuItem[] = [
  {
    id: 'home',
    icon: Home,
    path: '/home',
    alwaysVisible: true,
  },
  {
    id: 'inventory',
    icon: Archive,
    path: '/inventory',
    alwaysVisible: true,
  },
  {
    id: 'smartInventory',
    icon: Brain,
    path: '/smart-inventory',
    pluginId: 'smart-inventory',
    alwaysVisible: false,
  },
  {
    id: 'ocr',
    icon: Scan,
    path: '/ocr-result',
    pluginId: 'ocr-module',
    alwaysVisible: false,
  },
  {
    id: 'pos',
    icon: Package,
    path: '/pos-integration',
    pluginId: 'pos-integration',
    alwaysVisible: false,
  },
  {
    id: 'receipts',
    icon: FileText,
    path: '/receipts',
    pluginId: 'receipts',
    alwaysVisible: false,
  },
  {
    id: 'restock',
    icon: RefreshCw,
    path: '/restock',
    pluginId: 'restock',
    alwaysVisible: false,
  },
  {
    id: 'wallet',
    icon: Wallet,
    path: '/wallet-withdraw',
    pluginId: 'wallet',
    alwaysVisible: false,
  },
  {
    id: 'pluginStore',
    icon: Store,
    path: '/plugin-store',
    alwaysVisible: true,
  },
];

export const isMenuItemVisible = (
  item: MenuItem,
  modules: Record<string, boolean> | undefined
): boolean => {
  if (item.alwaysVisible) return true;
  if (item.pluginId) return Boolean(modules?.[item.pluginId]);
  return true;
};
