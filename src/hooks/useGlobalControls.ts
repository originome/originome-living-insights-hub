
import { useState, useCallback } from "react";

interface GlobalControlsState {
  dateRange: string;
  location: string;
  assetFilter: string;
  riskLevel: string;
  patternType: string;
  confidenceThreshold: string;
}

const useGlobalControls = () => {
  const [controls, setControls] = useState<GlobalControlsState>({
    dateRange: "24h",
    location: "hq-campus",
    assetFilter: "",
    riskLevel: "all",
    patternType: "all",
    confidenceThreshold: "60"
  });

  const updateControl = useCallback((key: keyof GlobalControlsState, value: string) => {
    setControls(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetControls = useCallback(() => {
    setControls({
      dateRange: "24h",
      location: "hq-campus",
      assetFilter: "",
      riskLevel: "all",
      patternType: "all",
      confidenceThreshold: "60"
    });
  }, []);

  return {
    controls,
    updateControl,
    resetControls,
    setDateRange: (value: string) => updateControl('dateRange', value),
    setLocation: (value: string) => updateControl('location', value),
    setAssetFilter: (value: string) => updateControl('assetFilter', value),
    setRiskLevel: (value: string) => updateControl('riskLevel', value),
    setPatternType: (value: string) => updateControl('patternType', value),
    setConfidenceThreshold: (value: string) => updateControl('confidenceThreshold', value),
  };
};

export default useGlobalControls;
