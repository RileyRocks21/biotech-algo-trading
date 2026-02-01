import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Calendar, Building2, Pill, Search, ExternalLink, Activity } from 'lucide-react';

// Sample clinical trial data based on the CTG studies CSV structure
const sampleTrials = [
  {
    id: 'NCT05186233',
    title: 'ALPINE: A Study of Zanubrutinib vs Ibrutinib in Patients With Relapsed/Refractory CLL',
    status: 'RECRUITING',
    conditions: 'Chronic Lymphocytic Leukemia',
    interventions: 'DRUG: Zanubrutinib|DRUG: Ibrutinib',
    sponsor: 'BeiGene',
    phases: 'PHASE3',
    enrollment: 652,
    completionDate: '2024-06-30',
    matchedTicker: 'BGNE'
  },
  {
    id: 'NCT04379635',
    title: 'Study of Pembrolizumab Plus Chemotherapy vs Chemotherapy Alone in Gastric Cancer',
    status: 'COMPLETED',
    conditions: 'Gastric Cancer|Gastroesophageal Junction Adenocarcinoma',
    interventions: 'BIOLOGICAL: Pembrolizumab|DRUG: Chemotherapy',
    sponsor: 'Merck Sharp & Dohme',
    phases: 'PHASE3',
    enrollment: 1581,
    completionDate: '2023-11-15',
    matchedTicker: 'MRK'
  },
  {
    id: 'NCT04091009',
    title: 'DESTINY-Breast04: T-DXd vs Treatment of Physician\'s Choice in HER2-Low Breast Cancer',
    status: 'ACTIVE_NOT_RECRUITING',
    conditions: 'Breast Cancer',
    interventions: 'DRUG: Trastuzumab Deruxtecan',
    sponsor: 'Daiichi Sankyo',
    phases: 'PHASE3',
    enrollment: 557,
    completionDate: '2024-03-01',
    matchedTicker: 'DSNKY'
  },
  {
    id: 'NCT03461952',
    title: 'POLARIX: Pola-R-CHP vs R-CHOP in Previously Untreated DLBCL',
    status: 'COMPLETED',
    conditions: 'Diffuse Large B-Cell Lymphoma',
    interventions: 'DRUG: Polatuzumab Vedotin|BIOLOGICAL: Rituximab',
    sponsor: 'Hoffmann-La Roche',
    phases: 'PHASE3',
    enrollment: 879,
    completionDate: '2023-08-20',
    matchedTicker: 'RHHBY'
  },
  {
    id: 'NCT04136535',
    title: 'EMERALD: Elacestrant vs Standard of Care in ER+/HER2- Breast Cancer',
    status: 'COMPLETED',
    conditions: 'ER+ HER2- Breast Cancer',
    interventions: 'DRUG: Elacestrant',
    sponsor: 'Radius Health',
    phases: 'PHASE3',
    enrollment: 478,
    completionDate: '2023-02-10',
    matchedTicker: 'RDUS'
  },
  {
    id: 'NCT04483505',
    title: 'KRYSTAL-1: Adagrasib in KRASG12C-Mutated Solid Tumors',
    status: 'RECRUITING',
    conditions: 'Non-Small Cell Lung Cancer|Colorectal Cancer',
    interventions: 'DRUG: Adagrasib',
    sponsor: 'Mirati Therapeutics',
    phases: 'PHASE1|PHASE2',
    enrollment: 835,
    completionDate: '2025-01-15',
    matchedTicker: 'MRTX'
  },
  {
    id: 'NCT03899428',
    title: 'IMpassion130: Atezolizumab Plus Nab-Paclitaxel in Triple-Negative Breast Cancer',
    status: 'COMPLETED',
    conditions: 'Triple Negative Breast Cancer',
    interventions: 'BIOLOGICAL: Atezolizumab|DRUG: Nab-Paclitaxel',
    sponsor: 'Genentech',
    phases: 'PHASE3',
    enrollment: 902,
    completionDate: '2022-12-05',
    matchedTicker: 'RHHBY'
  },
  {
    id: 'NCT04573868',
    title: 'FOENIX-CCA2: Futibatinib in Cholangiocarcinoma With FGFR2 Fusions',
    status: 'ACTIVE_NOT_RECRUITING',
    conditions: 'Cholangiocarcinoma',
    interventions: 'DRUG: Futibatinib',
    sponsor: 'Taiho Oncology',
    phases: 'PHASE2',
    enrollment: 103,
    completionDate: '2024-09-30',
    matchedTicker: null
  },
];

const statusColors = {
  'RECRUITING': 'bg-bullish/20 text-bullish',
  'ACTIVE_NOT_RECRUITING': 'bg-accent/20 text-accent',
  'COMPLETED': 'bg-blue-500/20 text-blue-400',
  'TERMINATED': 'bg-bearish/20 text-bearish',
  'SUSPENDED': 'bg-yellow-500/20 text-yellow-400',
};

const phaseColors = {
  'PHASE1': 'bg-purple-500/20 text-purple-400',
  'PHASE2': 'bg-blue-500/20 text-blue-400',
  'PHASE3': 'bg-green-500/20 text-green-400',
  'PHASE4': 'bg-accent/20 text-accent',
};

export default function ClinicalTrialsTable({ isPro = false }) {
  const [trials, setTrials] = useState(sampleTrials);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [phaseFilter, setPhaseFilter] = useState('all');
  const [onlyMatched, setOnlyMatched] = useState(false);

  const filteredTrials = trials.filter(trial => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matches = trial.title.toLowerCase().includes(term) ||
        trial.sponsor.toLowerCase().includes(term) ||
        trial.conditions.toLowerCase().includes(term) ||
        trial.id.toLowerCase().includes(term) ||
        (trial.matchedTicker && trial.matchedTicker.toLowerCase().includes(term));
      if (!matches) return false;
    }
    if (statusFilter !== 'all' && trial.status !== statusFilter) return false;
    if (phaseFilter !== 'all' && !trial.phases.includes(phaseFilter)) return false;
    if (onlyMatched && !trial.matchedTicker) return false;
    return true;
  });

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-white">Clinical Trial Catalysts</h2>
            <span className="ml-2 px-2 py-0.5 bg-accent/20 text-accent text-xs rounded-full">
              {filteredTrials.length} trials
            </span>
          </div>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-white/5">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search trials, sponsors, tickers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-accent/50"
            />
          </div>
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="RECRUITING">Recruiting</option>
            <option value="ACTIVE_NOT_RECRUITING">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          
          {/* Phase Filter */}
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="all">All Phases</option>
            <option value="PHASE1">Phase 1</option>
            <option value="PHASE2">Phase 2</option>
            <option value="PHASE3">Phase 3</option>
            <option value="PHASE4">Phase 4</option>
          </select>
          
          {/* Matched Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyMatched}
              onChange={(e) => setOnlyMatched(e.target.checked)}
              className="w-4 h-4 rounded border-white/10 bg-white/5 text-accent focus:ring-accent/50"
            />
            <span className="text-sm text-gray-400">Matched to Options Only</span>
          </label>
        </div>
      </div>
      
      {/* Trials Grid */}
      <div className="flex-1 overflow-auto p-4 grid gap-4 auto-rows-max">
        <AnimatePresence initial={false}>
          {filteredTrials.map((trial) => (
            <motion.div
              key={trial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`
                p-4 rounded-xl border bg-surface/50 hover:bg-surface transition-colors cursor-pointer
                ${trial.matchedTicker ? 'border-accent/30 ring-1 ring-accent/20' : 'border-white/5'}
              `}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono text-gray-500">{trial.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[trial.status] || 'bg-white/10 text-gray-400'}`}>
                      {trial.status.replace(/_/g, ' ')}
                    </span>
                    {trial.phases.split('|').map(phase => (
                      <span key={phase} className={`px-2 py-0.5 rounded text-xs font-medium ${phaseColors[phase] || 'bg-white/10 text-gray-400'}`}>
                        {phase.replace('PHASE', 'P')}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-white font-medium text-sm leading-snug mb-2 line-clamp-2">
                    {trial.title}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {trial.sponsor}
                    </span>
                    <span className="flex items-center gap-1">
                      <Pill className="w-3 h-3" />
                      {trial.conditions.split('|')[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trial.completionDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-3 h-3" />
                      {trial.enrollment} enrolled
                    </span>
                  </div>
                </div>
                
                {/* Matched Ticker */}
                {trial.matchedTicker && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-3 py-2 bg-accent/10 border border-accent/30 rounded-lg">
                      <span className="text-xs text-gray-400">Matched</span>
                      <div className="text-lg font-bold text-accent">{trial.matchedTicker}</div>
                    </div>
                    <a
                      href={`https://clinicaltrials.gov/study/${trial.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      View on CTG
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
