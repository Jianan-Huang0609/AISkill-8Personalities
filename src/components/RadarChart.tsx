import { RadarChart as RechartsRadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { DimensionScores } from '../types/questionnaire';

interface RadarChartProps {
  scores: DimensionScores;
}

export default function RadarChart({ scores }: RadarChartProps) {
  const data = [
    { dimension: '理论洞察', value: scores.theory, score: scores.theory },
    { dimension: '工程实现', value: scores.engineering, score: scores.engineering },
    { dimension: '学习敏捷', value: scores.learning, score: scores.learning },
    { dimension: 'AI协作', value: scores.collaboration, score: scores.collaboration },
    { dimension: '信息雷达', value: scores.radar, score: scores.radar },
    { dimension: '创新突破', value: scores.innovation, score: scores.innovation },
    { dimension: '影响力', value: scores.influence, score: scores.influence },
    { dimension: '表达审美', value: scores.aesthetics, score: scores.aesthetics },
  ];

  // 自定义标签渲染函数，显示维度名称和得分
  const renderCustomLabel = (props: any) => {
    const { x, y, payload } = props;
    const dataItem = data.find(d => d.dimension === payload.value);
    const score = dataItem?.score || 0;
    
    // 计算标签位置，确保不重叠
    const radius = Math.sqrt(x * x + y * y);
    const scale = radius > 0 ? (radius + 25) / radius : 1;
    const labelX = x * scale;
    const labelY = y * scale;
    
    return (
      <g>
        <text
          x={labelX}
          y={labelY}
          fill="#2C2C2C"
          fontSize={11}
          fontWeight={600}
          textAnchor="middle"
          dy={-8}
        >
          {payload.value}
        </text>
        <text
          x={labelX}
          y={labelY}
          fill="#C8102E"
          fontSize={14}
          fontWeight={700}
          textAnchor="middle"
          dy={6}
        >
          {score.toFixed(1)}
        </text>
      </g>
    );
  };

  return (
    <div className="radar-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart 
          data={data} 
          margin={{ top: 30, right: 30, bottom: 30, left: 30 }}
          outerRadius="75%"
        >
          <PolarGrid stroke="#E0E0E0" />
          <PolarAngleAxis 
            dataKey="dimension" 
            tick={renderCustomLabel}
            tickLine={false}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 10]}
            tick={{ fill: 'rgba(0, 0, 0, 0.3)', fontSize: 9 }}
            tickCount={6}
            axisLine={false}
          />
          <Radar
            name="得分"
            dataKey="value"
            stroke="#C8102E"
            fill="#C8102E"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

