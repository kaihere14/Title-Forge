import React from 'react';
import { ChevronRight, Info, TrendingUp } from 'lucide-react';

export default function VideoGrowthCard() {
  // Sample data for the bar chart (showing weekly video views)
  const weeklyData = [
    { week: 1, growth: 85, enhanced: false },
    { week: 2, growth: 78, enhanced: false },
    { week: 3, growth: 82, enhanced: false },
    { week: 4, growth: 88, enhanced: false },
    { week: 5, growth: 75, enhanced: false },
    { week: 6, growth: 80, enhanced: false },
    { week: 7, growth: 86, enhanced: false },
    { week: 8, growth: 90, enhanced: false },
    { week: 9, growth: 95, enhanced: true },
    { week: 10, growth: 98, enhanced: true },
    { week: 11, growth: 100, enhanced: true },
    { week: 12, growth: 95, enhanced: true },
    { week: 13, growth: 92, enhanced: true },
    { week: 14, growth: 97, enhanced: true },
    { week: 15, growth: 100, enhanced: true },
    { week: 16, growth: 98, enhanced: true },
  ];

  const maxGrowth = Math.max(...weeklyData.map(d => d.growth));

 
  const makeSmoothPath = (pts, TENSION = 0.45) => {
    if (!pts.length) return "";
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;

    const cr2bezier = (p0, p1, p2, p3) => {

      const bp1 = {
        x: p1.x + (p2.x - p0.x) * TENSION,
        y: p1.y + (p2.y - p0.y) * TENSION,
      };
      const bp2 = {
        x: p2.x - (p3.x - p1.x) * TENSION,
        y: p2.y - (p3.y - p1.y) * TENSION,
      };
      return `${bp1.x},${bp1.y} ${bp2.x},${bp2.y} ${p2.x},${p2.y}`;
    };

    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i === 0 ? pts[0] : pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i + 2 < pts.length ? pts[i + 2] : pts[pts.length - 1];
      d += ` C ${cr2bezier(p0, p1, p2, p3)}`;
    }
    return d;
  };

  return (
    <div className="w-full max-w-2xl bg-gray-50 rounded-2xl p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6 md:mb-8">
        <div className="w-2 h-2 bg-black rounded-sm"></div>
        <h2 className="text-lg md:text-xl font-normal text-gray-900">
          Enhanced Title Impact
        </h2>
      </div>

      <div className="border-t border-gray-300 pt-6 md:pt-8">
        {/* Growth Metric */}
        <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-6 gap-4 md:gap-0">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-600 text-sm md:text-base">Video View Growth</span>
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-baseline gap-2 md:gap-3">
              <span className="text-4xl md:text-6xl font-normal text-gray-900">127%</span>
              <span className="text-red-500 text-lg md:text-xl font-normal">+45% vs before</span>
            </div>
          </div>
          <button className="flex items-center gap-2 text-gray-900 hover:gap-3 transition-all self-start md:self-auto">
            <span className="text-sm md:text-base">Details</span>
            <ChevronRight className="w-4 md:w-5 h-4 md:h-5" />
          </button>
        </div>

        {/* Bar Chart with Growth Line */}
        <div className="mb-6 relative">
          {/* SVG for growth line */}
          <svg
            className="absolute inset-0 w-full h-32 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {/* prepare numeric points in viewBox space */}
            {
              (() => {
                const pts = weeklyData.map((data, index) => ({
                  x: ((index + 0.5) / weeklyData.length) * 100,
                  y: 100 - (data.growth / maxGrowth) * 100,
                  enhanced: data.enhanced,
                }));

                const d = makeSmoothPath(pts);

                return (
                  <g>
                    <path
                      d={d}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeOpacity="0.98"
                      vectorEffect="non-scaling-stroke"
                    />

                    {/* Show fewer dots: every 3rd point or any enhanced point */}
                    {pts.map((p, i) => {
                      const show = p.enhanced || i % 3 === 0;
                      if (!show) return null;
                      return (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={1.2}
                          fill={p.enhanced ? '#ef4444' : '#ef9a9a'}
                          stroke="#fff"
                          strokeWidth={0.5}
                          vectorEffect="non-scaling-stroke"
                        />
                      );
                    })}
                  </g>
                );
              })()
            }
          </svg>

          {/* Bars */}
          <div className="flex items-end gap-1 h-32">
            {weeklyData.map((data, index) => (
              <div
                key={index}
                className="flex-1 flex flex-col justify-end"
              >
                <div
                  className={`w-full rounded-t transition-all ${
                    data.enhanced ? 'bg-red-500 opacity-30' : 'bg-gray-300 opacity-30'
                  }`}
                  style={{ height: `${(data.growth / maxGrowth) * 100}%` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0">
          <span className="text-gray-900 text-base md:text-lg">Enhanced Titles</span>
          <div className="flex items-center gap-2 md:gap-3">
            <span className="text-gray-600 text-sm md:text-base">2,847 Videos</span>
            <span className="text-gray-400">•</span>
            <span className="text-red-500 text-sm md:text-base font-normal">+45%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-3 md:w-4 h-3 md:h-4 bg-gray-300 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">Before Enhancement</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 md:w-4 h-3 md:h-4 bg-red-500 rounded"></div>
            <span className="text-xs md:text-sm text-gray-600">After Enhancement</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3 md:w-4 h-3 md:h-4 text-red-500" />
            <span className="text-xs md:text-sm text-gray-600">Growth Trend</span>
          </div>
        </div>
      </div>
    </div>
  );
}