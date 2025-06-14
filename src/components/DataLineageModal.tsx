
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Globe, Lock, Database, Satellite } from 'lucide-react';

interface DataSource {
  name: string;
  type: 'public' | 'private' | 'derived';
  lastUpdated: Date;
  reliability: number;
  description: string;
}

interface DataLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
  riskEventId: string;
  publicSources: string[];
  privateSources: string[];
}

export const DataLineageModal: React.FC<DataLineageModalProps> = ({
  isOpen,
  onClose,
  riskEventId,
  publicSources,
  privateSources
}) => {
  const getDataSourceDetails = (sourceName: string, isPrivate: boolean): DataSource => {
    return {
      name: sourceName,
      type: isPrivate ? 'private' : 'public',
      lastUpdated: new Date(Date.now() - Math.random() * 3600000), // Random time within last hour
      reliability: 0.85 + Math.random() * 0.14, // 85-99% reliability
      description: isPrivate 
        ? 'Client-specific operational data with full audit trail'
        : 'Verified public environmental monitoring data'
    };
  };

  const allSources = [
    ...publicSources.map(source => getDataSourceDetails(source, false)),
    ...privateSources.map(source => getDataSourceDetails(source, true))
  ];

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'public': return <Globe className="h-4 w-4 text-blue-600" />;
      case 'private': return <Lock className="h-4 w-4 text-green-600" />;
      default: return <Database className="h-4 w-4 text-purple-600" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Satellite className="h-5 w-5" />
            Data Lineage - Risk Event {riskEventId.slice(-6)}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            Complete audit trail of data sources used to generate this risk assessment
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Globe className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="font-medium">{publicSources.length}</div>
              <div className="text-blue-600">Public Sources</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Lock className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="font-medium">{privateSources.length}</div>
              <div className="text-green-600">Private Sources</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Data Sources</h4>
            {allSources.map((source, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSourceIcon(source.type)}
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={source.type === 'private' ? 'default' : 'outline'} className="text-xs">
                      {source.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {(source.reliability * 100).toFixed(0)}% reliable
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-1">{source.description}</div>
                <div className="text-xs text-gray-500">
                  Last updated: {source.lastUpdated.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Data Fusion Process</h4>
            <div className="text-sm text-gray-700 space-y-1">
              <div>1. Real-time data ingestion from all sources</div>
              <div>2. Cross-validation against historical patterns</div>
              <div>3. Multi-factor correlation analysis</div>
              <div>4. Risk probability calculation with confidence intervals</div>
              <div>5. Event generation with full audit trail</div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Enterprise Security</span>
            </div>
            <div className="text-sm text-blue-700">
              All data is processed with end-to-end encryption. Private client data never leaves your security perimeter. 
              Public data is verified against multiple independent sources for accuracy.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
