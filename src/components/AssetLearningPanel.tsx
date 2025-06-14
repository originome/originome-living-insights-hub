
import React, { useState, useEffect } from 'react';
import { AssetLearningService, AssetFingerprint, DynamicAssetCard } from '@/services/assetLearningService';
import { AssetFingerprintCard } from './AssetFingerprintCard';
import { DynamicAssetDisplay } from './DynamicAssetDisplay';
import { VulnerabilitySignatureCard } from './VulnerabilitySignatureCard';

interface AssetLearningPanelProps {
  buildingType: string;
  location: { lat: number; lon: number };
  currentConditions: any;
}

export const AssetLearningPanel: React.FC<AssetLearningPanelProps> = ({
  buildingType,
  location,
  currentConditions
}) => {
  const [assetFingerprint, setAssetFingerprint] = useState<AssetFingerprint | null>(null);
  const [dynamicCard, setDynamicCard] = useState<DynamicAssetCard | null>(null);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);

  const assetId = `asset_${buildingType}_${location.lat.toFixed(2)}_${location.lon.toFixed(2)}`;

  useEffect(() => {
    // Create or retrieve asset fingerprint
    let asset = AssetLearningService.createAssetFingerprint(assetId, buildingType, location);
    setAssetFingerprint(asset);

    // Generate dynamic asset card
    const card = AssetLearningService.generateDynamicAssetCard(assetId, currentConditions);
    setDynamicCard(card);

    // Simulate learning progress
    setIsLearning(true);
    const interval = setInterval(() => {
      setLearningProgress(prev => {
        const newProgress = prev + Math.random() * 5;
        if (newProgress >= 100) {
          setIsLearning(false);
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [assetId, buildingType, location.lat, location.lon, currentConditions]);

  return (
    <div className="space-y-4">
      {/* Asset Fingerprinting */}
      {assetFingerprint && (
        <AssetFingerprintCard
          assetFingerprint={assetFingerprint}
          isLearning={isLearning}
          learningProgress={learningProgress}
        />
      )}

      {/* Dynamic Asset Card */}
      {dynamicCard && (
        <DynamicAssetDisplay dynamicCard={dynamicCard} />
      )}

      {/* Vulnerability Signature */}
      {assetFingerprint && (
        <VulnerabilitySignatureCard assetFingerprint={assetFingerprint} />
      )}
    </div>
  );
};
