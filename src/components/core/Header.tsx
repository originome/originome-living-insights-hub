
import React from "react";
import { Shield, Activity, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Originome Intelligence Platform
                </h1>
                <p className="text-sm text-slate-600">
                  Operational Risk Verification & Environmental Intelligence
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-green-500" />
              <Badge variant="outline" className="text-green-700 border-green-300">
                Live Monitoring
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Pattern Engine Active
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
