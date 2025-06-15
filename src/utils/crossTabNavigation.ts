
export type TabType = 'executive' | 'event-horizon' | 'velocity' | 'geographic' | 'assets';

export interface CrossTabAction {
  targetTab: TabType;
  label: string;
  description: string;
}

export const getCrossTabActions = (context: string): CrossTabAction[] => {
  const actions: Record<string, CrossTabAction[]> = {
    'geomagnetic': [
      {
        targetTab: 'event-horizon',
        label: 'View Risk Analysis',
        description: 'See real-time environmental risk detection for geomagnetic effects'
      }
    ],
    'amplification_cascade': [
      {
        targetTab: 'velocity',
        label: 'Rate Analysis',
        description: 'Analyze rate-of-change patterns driving the amplification'
      },
      {
        targetTab: 'event-horizon',
        label: 'Risk Timeline',
        description: 'View cascading risk timeline and prevention windows'
      }
    ],
    'compound_risk': [
      {
        targetTab: 'assets',
        label: 'Asset Impact',
        description: 'See how compound risks affect specific building assets'
      },
      {
        targetTab: 'geographic',
        label: 'Location Analysis',
        description: 'View geographic factors contributing to compound risk'
      }
    ],
    'cross_domain': [
      {
        targetTab: 'geographic',
        label: 'Geographic Intelligence',
        description: 'Explore micro-anomaly detection and location-specific patterns'
      },
      {
        targetTab: 'assets',
        label: 'Asset Learning',
        description: 'View legacy-asset fingerprinting and learning patterns'
      }
    ],
    'pollen_convergence': [
      {
        targetTab: 'event-horizon',
        label: 'Convergence Analysis',
        description: 'Detailed analysis of pollen-geomagnetic convergence patterns'
      }
    ]
  };

  return actions[context] || [];
};

export const createTabNavigationHandler = (onTabChange: (tab: TabType) => void) => {
  return (targetTab: TabType) => {
    onTabChange(targetTab);
    // Scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
};
