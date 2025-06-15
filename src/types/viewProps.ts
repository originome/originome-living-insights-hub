
export interface ViewProps {
  dateRange: string;
  location: string;
  assetFilter: string;
}

export interface ExecutiveViewProps extends ViewProps {
  onTabChange: (tab: 'executive' | 'event-horizon' | 'velocity' | 'geographic' | 'assets') => void;
}
