
import React from "react";
import { Shield, Activity, Zap, Brain } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-5">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                  Originome Intelligence Platform
                </h1>
                <p className="text-base text-slate-600 mt-1">
                  Environmental Pattern Intelligence & Operational Risk Verification
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 px-3 py-1">
                Live Monitoring
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 px-3 py-1">
                Pattern Engine Active
              </Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 px-3 py-1">
                47 Data Sources
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
