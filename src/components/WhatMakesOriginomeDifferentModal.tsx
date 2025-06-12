
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Zap, Eye, TrendingUp, Shield } from 'lucide-react';

export const WhatMakesOriginomeDifferentModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-0 hover:from-purple-700 hover:to-indigo-700"
        >
          <Brain className="h-4 w-4 mr-2" />
          What Makes Originome Different?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Brain className="h-6 w-6 text-purple-600" />
            What Makes Originome Different?
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold text-lg mb-2">Bio-Adaptive Infrastructure Intelligence</h3>
            <p className="text-gray-700">
              Originome is the world's first platform to reveal invisible, multiscale patterns 
              across environmental, cosmic, and biological systems that drive organizational performance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-red-600" />
                  <h4 className="font-medium">Traditional Dashboards</h4>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Monitor single metrics in isolation</li>
                  <li>• React to problems after they occur</li>
                  <li>• Focus only on indoor air quality</li>
                  <li>• Provide generic recommendations</li>
                  <li>• Miss hidden risk patterns</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <h4 className="font-medium">Originome Pattern Engine</h4>
                </div>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Reveals hidden cross-correlations</li>
                  <li>• Predicts problems before they manifest</li>
                  <li>• Integrates cosmic and seasonal forces</li>
                  <li>• Provides adaptive, context-aware insights</li>
                  <li>• Uncovers invisible performance drivers</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-600" />
              Unique Data Integration Layers
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Badge variant="outline" className="text-xs p-2 text-center">
                Geomagnetic Activity
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Solar Weather
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Seismic Patterns
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Lunar Cycles
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Pollen Indexes
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Weather Anomalies
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Air Quality
              </Badge>
              <Badge variant="outline" className="text-xs p-2 text-center">
                Indoor Conditions
              </Badge>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <h4 className="font-medium">Real Business Impact</h4>
            </div>
            <p className="text-sm text-gray-700">
              Organizations using Originome insights have seen 15-25% reductions in unexpected 
              absenteeism, 12% improvements in productivity during optimal conditions, and 
              significant cost savings from proactive rather than reactive facility management.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium">Scientific Foundation</h4>
            </div>
            <p className="text-sm text-gray-700">
              Every correlation and prediction is grounded in peer-reviewed research from 
              institutions like Harvard, EPA, CDC, and leading environmental health organizations. 
              We don't guess—we apply proven science at scale.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
