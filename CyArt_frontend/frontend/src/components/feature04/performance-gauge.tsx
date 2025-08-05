// components/feature04/performance-gauge.tsx
"use client"

import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"

export default function PerformanceGauge() {
  const { agents } = useSocket()
  const [value, setValue] = useState(8000)
  const target = 10000
  const scale = [0, 5000, 10000]
  
  // Update gauge based on online agents
  useEffect(() => {
    if (agents && agents.length > 0) {
      const onlineAgents = agents.filter(a => a.status === "Online").length
      const totalAgents = agents.length
      const percentage = totalAgents > 0 ? (onlineAgents / totalAgents) : 0
      setValue(Math.round(percentage * 10000))
    }
  }, [agents])
  const CHART_SIZE = 260;
  const STROKE_WIDTH = 20;

  const percentage = Math.min(Math.round((value / target) * 100), 100);
  const radius = (CHART_SIZE - STROKE_WIDTH) / 2;
  const circumference = Math.PI * radius;
  const dashOffset = circumference * (1 - percentage/100);

  return (
    <div className="flex flex-col h-full items-center pt-1"> {/* Reduced pt-2 to pt-1 */}
      {/* Gauge Visualization */}
      <div className="relative mx-auto -mt-2" style={{ width: CHART_SIZE, height: CHART_SIZE/2 }}> {/* Added -mt-2 */}
        {/* Background track */}
        <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE/2}`} className="absolute inset-0">
          <path
            d={`M ${STROKE_WIDTH/2} ${CHART_SIZE/2} 
                A ${radius} ${radius} 0 0 1 ${CHART_SIZE-STROKE_WIDTH/2} ${CHART_SIZE/2}`}
            fill="none"
            stroke="#EFF6FF"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
          />
        </svg>

        {/* Progress track */}
        <svg viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE/2}`} className="absolute inset-0">
          <path
            d={`M ${STROKE_WIDTH/2} ${CHART_SIZE/2} 
                A ${radius} ${radius} 0 0 1 ${CHART_SIZE-STROKE_WIDTH/2} ${CHART_SIZE/2}`}
            fill="none"
            stroke="#3B82F6"
            strokeWidth={STROKE_WIDTH}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>

        {/* Needle indicator */}
        <div className="absolute bottom-0 left-1/2" style={{
          transform: `translateX(-50%) rotate(${-90 + (percentage * 1.8)}deg)`,
          transformOrigin: 'center bottom',
          height: radius - 10,
          width: STROKE_WIDTH
        }}>
          <div className="relative h-full w-full">
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-800 border border-white"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-blue-700 rounded-sm"></div>
          </div>
        </div>

        {/* Value display */}
        <div className="absolute top-1/2 left-0 right-0 text-center">
          <span className="text-[26px] font-bold text-gray-800">{value.toLocaleString()}</span>
        </div>
      </div>

      {/* Scale labels */}
      <div className="w-full flex justify-between px-8 -mt-1"> {/* Added -mt-1 */}
        {scale.map((num, i) => (
          <span key={i} className="text-xs text-gray-500">{num.toLocaleString()}</span>
        ))}
      </div>

      {/* Status indicator */}
      <div className="flex justify-center items-center gap-1.5 mt-1"> {/* Reduced mt-2 to mt-1 */}
        <div className={`w-2.5 h-2.5 rounded-full ${
          percentage >= 75 ? 'bg-green-500' : 
          percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
        }`} />
        <span className="text-xs font-medium text-gray-600">
          {percentage >= 75 ? 'On Track' : percentage >= 50 ? 'Needs Attention' : 'At Risk'}
        </span>
      </div>
    </div>
  );
}