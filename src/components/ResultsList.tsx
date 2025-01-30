import React from 'react';
import { Results, Range } from '../types';
import { formatHex } from '../utils/formatter';

interface ResultsListProps {
  results: Results;
}

const ResultsList: React.FC<ResultsListProps> = ({ results }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        تم العثور على {results.ranges.length} نطاق فرعي في {results.timeElapsed.toFixed(2)} ثانية
      </h2>
      
      <div className="space-y-4">
        {results.ranges.map((range, index) => (
          <div
            key={index}
            className="bg-gray-50 p-4 rounded-lg border-r-4 border-blue-500"
          >
            <h3 className="font-semibold mb-2">النطاق #{index + 1}</h3>
            <div className="font-mono text-sm space-y-1 text-left dir-ltr">
              <p>النمط المتكرر: {range.pattern}</p>
              <p>من: 0x{formatHex(range.start)}</p>
              <p>إلى: 0x{formatHex(range.end)}</p>
              <p>حجم النطاق: {(range.end - range.start).toString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsList;

