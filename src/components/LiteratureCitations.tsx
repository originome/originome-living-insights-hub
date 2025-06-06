
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ExternalLink, Users, TrendingUp, Award } from 'lucide-react';

interface CitationProps {
  study: {
    id: string;
    title: string;
    authors: string;
    year: number;
    doi?: string;
    effectSize: number;
    confidenceInterval: [number, number];
    sampleSize: number;
    population: string;
  };
  relevantTo: string;
}

export const LiteratureCitations: React.FC<{ citations: CitationProps[] }> = ({ citations }) => {
  const getEffectSizeColor = (effectSize: number) => {
    if (Math.abs(effectSize) > 0.3) return 'text-red-600';
    if (Math.abs(effectSize) > 0.15) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getEffectSizeLabel = (effectSize: number) => {
    if (Math.abs(effectSize) > 0.3) return 'Large Effect';
    if (Math.abs(effectSize) > 0.15) return 'Medium Effect';
    return 'Small Effect';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          Scientific Evidence Base
        </CardTitle>
        <div className="text-sm text-gray-600">
          Peer-reviewed studies supporting current calculations
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {citations.map((citation) => (
          <div key={citation.study.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm leading-tight text-gray-900">
                  {citation.study.title}
                </h4>
                <div className="text-xs text-gray-600 mt-1">
                  {citation.study.authors} ({citation.study.year})
                </div>
              </div>
              {citation.study.doi && (
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-2 h-6 text-xs"
                  onClick={() => window.open(`https://doi.org/${citation.study.doi}`, '_blank')}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="text-xs">
                <Users className="h-3 w-3 mr-1" />
                n={citation.study.sampleSize.toLocaleString()}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${getEffectSizeColor(citation.study.effectSize)}`}
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {getEffectSizeLabel(citation.study.effectSize)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Award className="h-3 w-3 mr-1" />
                {citation.study.population}
              </Badge>
            </div>

            <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded">
              <strong>Relevance:</strong> {citation.relevantTo}
            </div>

            <div className="text-xs text-gray-600">
              Effect size: {citation.study.effectSize.toFixed(3)} 
              (95% CI: {citation.study.confidenceInterval[0].toFixed(3)} to {citation.study.confidenceInterval[1].toFixed(3)})
            </div>
          </div>
        ))}

        <div className="text-xs text-gray-500 pt-2 border-t">
          All calculations are based on peer-reviewed scientific literature. Effect sizes follow Cohen's conventions.
        </div>
      </CardContent>
    </Card>
  );
};
