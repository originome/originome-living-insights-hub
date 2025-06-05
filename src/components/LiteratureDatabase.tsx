
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FileDown, Search, Database, ExternalLink } from 'lucide-react';

interface LiteratureEntry {
  id: string;
  study: string;
  journal: string;
  variable: string;
  outcome: string;
  effectSize: string;
  sampleSize: number;
  year: number;
  doi: string;
  notes: string;
  quality: 'High' | 'Medium' | 'Low';
}

const literatureData: LiteratureEntry[] = [
  {
    id: '1',
    study: 'Allen et al. (2016)',
    journal: 'Environmental Health Perspectives',
    variable: 'CO₂',
    outcome: 'Cognitive Function',
    effectSize: '-15% at 1000ppm',
    sampleSize: 24,
    year: 2016,
    doi: '10.1289/ehp.1510037',
    notes: 'COGfx study - reduced performance in decision making and information usage',
    quality: 'High'
  },
  {
    id: '2',
    study: 'Satish et al. (2012)',
    journal: 'Environmental Health Perspectives',
    variable: 'CO₂',
    outcome: 'Decision Making',
    effectSize: '-50% at 2500ppm',
    sampleSize: 22,
    year: 2012,
    doi: '10.1289/ehp.1104789',
    notes: 'Significant decrements in most decision-making metrics',
    quality: 'High'
  },
  {
    id: '3',
    study: 'Zhang et al. (2017)',
    journal: 'Indoor Air',
    variable: 'PM2.5',
    outcome: 'Cognitive Performance',
    effectSize: '-6% per 10μg/m³',
    sampleSize: 302,
    year: 2017,
    doi: '10.1111/ina.12394',
    notes: 'Office workers, association with response speed and accuracy',
    quality: 'High'
  },
  {
    id: '4',
    study: 'Wargocki & Wyon (2017)',
    journal: 'Building and Environment',
    variable: 'Temperature',
    outcome: 'Productivity',
    effectSize: '-2% per °C above 25°C',
    sampleSize: 15,
    year: 2017,
    doi: '10.1016/j.buildenv.2017.05.040',
    notes: 'Call center performance study',
    quality: 'Medium'
  },
  {
    id: '5',
    study: 'Mills et al. (2007)',
    journal: 'Indoor Air',
    variable: 'Ventilation Rate',
    outcome: 'Sick Building Syndrome',
    effectSize: '-50% symptoms',
    sampleSize: 109,
    year: 2007,
    doi: '10.1111/j.1600-0668.2007.00474.x',
    notes: 'Doubling ventilation rate reduces SBS symptoms',
    quality: 'High'
  },
  {
    id: '6',
    study: 'Lan et al. (2011)',
    journal: 'Building and Environment',
    variable: 'Temperature',
    outcome: 'Work Performance',
    effectSize: 'Peak at 21-22°C',
    sampleSize: 21,
    year: 2011,
    doi: '10.1016/j.buildenv.2010.12.017',
    notes: 'Office work performance decreases with temperature deviation',
    quality: 'Medium'
  },
  {
    id: '7',
    study: 'Park & Yoon (2011)',
    journal: 'Building and Environment',
    variable: 'Illuminance',
    outcome: 'Visual Comfort',
    effectSize: 'Optimal 500-1000 lux',
    sampleSize: 56,
    year: 2011,
    doi: '10.1016/j.buildenv.2010.08.022',
    notes: 'Task performance and visual comfort in office environments',
    quality: 'Medium'
  }
];

export const LiteratureDatabase: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<LiteratureEntry | null>(null);

  const filteredData = literatureData.filter(entry =>
    entry.study.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.variable.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.outcome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.journal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const headers = [
      'Study', 'Journal', 'Variable', 'Outcome', 'Effect Size', 
      'Sample Size', 'Year', 'DOI', 'Quality', 'Notes'
    ];
    
    const csvContent = [
      headers.join(','),
      ...filteredData.map(entry => [
        `"${entry.study}"`,
        `"${entry.journal}"`,
        `"${entry.variable}"`,
        `"${entry.outcome}"`,
        `"${entry.effectSize}"`,
        entry.sampleSize,
        entry.year,
        `"${entry.doi}"`,
        `"${entry.quality}"`,
        `"${entry.notes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'originome_literature_database.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Literature database exported as CSV file.",
    });
  };

  const exportPDF = () => {
    toast({
      title: "PDF Export",
      description: "PDF export would include full citations, methodology details, and data quality assessments.",
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'High': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffectColor = (effectSize: string) => {
    if (effectSize.includes('-')) return 'text-red-600';
    if (effectSize.includes('Optimal') || effectSize.includes('Peak')) return 'text-green-600';
    return 'text-blue-600';
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-indigo-600" />
            <CardTitle>Peer-Reviewed Literature Database</CardTitle>
            <Badge variant="outline" className="text-xs">
              {filteredData.length} studies
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search studies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={exportCSV} variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={exportPDF} variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Study
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Variable
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Outcome
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Effect Size
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Quality
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Sample
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Year
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((entry) => (
                <tr 
                  key={entry.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {entry.study}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {entry.journal}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge variant="outline" className="text-xs">
                      {entry.variable}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.outcome}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getEffectColor(entry.effectSize)}`}>
                      {entry.effectSize}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Badge className={getQualityColor(entry.quality)} variant="secondary">
                      {entry.quality}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    n={entry.sampleSize}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.year}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEntry && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {selectedEntry.study}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedEntry(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div><strong>Journal:</strong> {selectedEntry.journal}</div>
              <div><strong>DOI:</strong> 
                <a 
                  href={`https://doi.org/${selectedEntry.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 ml-1 inline-flex items-center gap-1"
                >
                  {selectedEntry.doi}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div><strong>Notes:</strong> {selectedEntry.notes}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
