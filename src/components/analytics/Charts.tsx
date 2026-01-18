import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

interface ChartContainerProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
}

export function ChartContainer({ 
  children, 
  title, 
  subtitle, 
  height = 300, 
  className = '' 
}: ChartContainerProps) {
  return (
    <div className={`w-full ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-foreground">{title}</h3>}
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  );
}

export function ProgressLineChart({ 
  data, 
  title, 
  subtitle, 
  height = 300,
  dataKey = 'value',
  color = '#3b82f6',
  showGrid = true,
  showArea = false,
  className = ''
}: {
  data: Array<{ name: string; [key: string]: number | string }>;
  title?: string;
  subtitle?: string;
  height?: number;
  dataKey?: string;
  color?: string;
  showGrid?: boolean;
  showArea?: boolean;
  className?: string;
}) {
  const ChartComponent = showArea ? AreaChart : LineChart;
  const DataComponent = showArea ? Area : Line;

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
      <ChartComponent data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
        <XAxis 
          dataKey="name" 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))'
          }}
        />
        <DataComponent 
          type="monotone" 
          dataKey={dataKey} 
          stroke={color} 
          fill={color}
          fillOpacity={showArea ? 0.2 : 0}
          strokeWidth={2}
          dot={{ fill: color, strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, fill: color }}
        />
      </ChartComponent>
    </ChartContainer>
  );
}

export function VolumeBarChart({ 
  data, 
  title, 
  subtitle, 
  height = 300,
  className = ''
}: {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
}) {
  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="name" 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))'
          }}
        />
        <Bar 
          dataKey="value" 
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}

export function PersonalRecordPieChart({ 
  data, 
  title, 
  subtitle, 
  height = 300,
  className = ''
}: {
  data: Array<{ name: string; value: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
}) {
  const COLORS = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b', 
    '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
  ];

  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))'
          }}
        />
        <Legend />
      </PieChart>
    </ChartContainer>
  );
}

export function WeeklyActivityChart({ 
  data, 
  title, 
  subtitle, 
  height = 200,
  className = ''
}: {
  data: Array<{ day: string; workouts: number; volume: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
}) {
  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <XAxis 
          dataKey="day" 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="workouts" 
          stroke="hsl(var(--primary))" 
          fillOpacity={1} 
          fill="url(#colorActivity)"
          strokeWidth={2}
        />
        <ReferenceLine y={1} stroke="hsl(var(--muted-foreground))" strokeDasharray="2 2" />
      </AreaChart>
    </ChartContainer>
  );
}

export function ProgressComparisonChart({ 
  data, 
  title, 
  subtitle, 
  height = 350,
  className = ''
}: {
  data: Array<{ period: string; weight: number; volume: number; duration: number }>;
  title?: string;
  subtitle?: string;
  height?: number;
  className?: string;
}) {
  return (
    <ChartContainer title={title} subtitle={subtitle} height={height} className={className}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis 
          dataKey="period" 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <YAxis 
          className="text-xs fill-muted-foreground"
          tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--card-foreground))'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="weight" 
          stroke="#ef4444" 
          strokeWidth={2}
          name="Peso (kg)"
          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="volume" 
          stroke="#10b981" 
          strokeWidth={2}
          name="Volume (kg)"
          dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
        />
        <Line 
          type="monotone" 
          dataKey="duration" 
          stroke="#3b82f6" 
          strokeWidth={2}
          name="Duração (min)"
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}