
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronRight, ExternalLink, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InteractiveBadgeProps {
  label: string;
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  tooltip?: string;
  expandableContent?: {
    title: string;
    description: string;
    details?: string[];
    actions?: Array<{
      label: string;
      onClick: () => void;
      variant?: 'default' | 'outline';
    }>;
  };
  onClick?: () => void;
  showInfoIcon?: boolean;
}

export const InteractiveBadge: React.FC<InteractiveBadgeProps> = ({
  label,
  variant = 'outline',
  className = '',
  tooltip,
  expandableContent,
  onClick,
  showInfoIcon = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleBadgeClick = () => {
    if (expandableContent) {
      setIsExpanded(!isExpanded);
    } else if (onClick) {
      onClick();
    }
  };

  const badge = (
    <Badge 
      variant={variant} 
      className={`cursor-pointer hover:bg-opacity-80 transition-colors ${className} ${expandableContent || onClick ? 'hover:shadow-md' : ''}`}
      onClick={handleBadgeClick}
    >
      <span>{label}</span>
      {showInfoIcon && <Info className="h-3 w-3 ml-1" />}
      {expandableContent && (
        <span className="ml-1">
          {isExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </span>
      )}
    </Badge>
  );

  const content = tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs p-3 bg-white border shadow-lg">
          <p className="text-sm">{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : badge;

  return (
    <div className="inline-block">
      {content}
      {expandableContent && isExpanded && (
        <Card className="mt-2 shadow-lg border-l-4 border-blue-500 absolute z-50 w-80 bg-white">
          <CardContent className="p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{expandableContent.title}</h4>
            <p className="text-sm text-gray-700 mb-3">{expandableContent.description}</p>
            {expandableContent.details && (
              <ul className="text-xs text-gray-600 mb-3 space-y-1">
                {expandableContent.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {detail}
                  </li>
                ))}
              </ul>
            )}
            {expandableContent.actions && (
              <div className="flex gap-2 flex-wrap">
                {expandableContent.actions.map((action, idx) => (
                  <Button 
                    key={idx}
                    size="sm" 
                    variant={action.variant || 'outline'}
                    onClick={action.onClick}
                    className="text-xs"
                  >
                    {action.label}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
