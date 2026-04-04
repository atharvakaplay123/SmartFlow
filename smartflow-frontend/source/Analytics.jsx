import React, { useState, useEffect } from 'react';
import {
  LineChart as RechartsLineChart, Line,
  AreaChart as RechartsAreaChart, Area,
  BarChart as RechartsBarChart, Bar,
  PieChart as RechartsPieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { 
  FaRegClock, FaCar, FaCheckCircle, FaExclamationTriangle, 
  FaInfoCircle, FaArrowRight, FaArrowDown, FaSyncAlt 
} from 'react-icons/fa';
import styles from './Analytics.module.css';

const trafficData = [
  { time: '06:00', density: 25 },
  { time: '08:00', density: 85 },
  { time: '10:00', density: 45 },
  { time: '12:00', density: 50 },
  { time: '14:00', density: 40 },
  { time: '16:00', density: 65 },
  { time: '18:00', density: 80 },
  { time: '20:00', density: 55 },
  { time: '22:00', density: 30 }
];

const congestionData = [
  { hour: '6AM', congestion: 20 },
  { hour: '8AM', congestion: 85 },
  { hour: '10AM', congestion: 35 },
  { hour: '12PM', congestion: 40 },
  { hour: '2PM', congestion: 30 },
  { hour: '4PM', congestion: 55 },
  { hour: '6PM', congestion: 80 },
  { hour: '8PM', congestion: 45 },
];

const efficiencyData = [
  { day: 'Mon', efficiency: 85 },
  { day: 'Tue', efficiency: 87 },
  { day: 'Wed', efficiency: 86 },
  { day: 'Thu', efficiency: 89 },
  { day: 'Fri', efficiency: 88 },
  { day: 'Sat', efficiency: 91 },
  { day: 'Sun', efficiency: 92.4 }
];

const pieData = [
  { name: 'Road A (Main)', value: 40, fill: '#3b82f6' },
  { name: 'Road B (East)', value: 25, fill: '#14b8a6' },
  { name: 'Road C (West)', value: 20, fill: '#8b5cf6' },
  { name: 'Road D (North)', value: 15, fill: '#f97316' },
];

const StatCard = ({ title, value, subtext, icon, trendValue, trend, stripColor }) => {
  return (
    <div className={styles.card}>
      <div className={`${styles.statStrip} ${styles['strip' + stripColor]}`}></div>
      <div className={styles.statTop}>
        <div>
          <div className={styles.statValue}>{value}</div>
          <div className={styles.statLabel}>{title}</div>
        </div>
        <div className={`${styles.statIconWrapper} ${styles['icon' + stripColor]}`}>
          {icon}
        </div>
      </div>
      <div className={styles.statTrendRow}>
        <span className={trend === 'up' ? styles.trendup : styles.trenddown}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}
        </span> {subtext}
      </div>
    </div>
  );
};

const InsightCard = ({ color, icon, text }) => {
  return (
    <div className={`${styles.insightCard} ${styles['border' + color]}`}>
      <div className={`${styles.insightIcon} ${styles['icon' + color]}`}>
        {icon}
      </div>
      <p className={styles.insightText}>{text}</p>
    </div>
  );
};

const Analytics = () => {
  const [timeState, setTimeState] = useState('Just now');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeState(prev => prev === 'Just now' ? 'A moment ago' : 'Just now');
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setTimeState('Just now');
    }, 500);
  };

  const highestCongestion = Math.max(...congestionData.map(d => d.congestion));

  return (
    <div className={styles.root}>
      {/* Page Header */}
      <header className={styles.headerRow}>
        <div>
          <div className="page-title">Insights</div>
          <div className="page-heading">Network Analytics</div>
        </div>
        <div className={styles.headerRight}>
          <span className={styles.badge}>Last 24 hours</span>
        </div>
      </header>

      {/* KPI Cards Top Row */}
      <div className={styles.kpiGrid}>
        <StatCard
          title="Avg Daily Traffic"
          value="2,847"
          trendValue="12%"
          trend="up"
          subtext="vs last week"
          icon={<FaCar size={20} />}
          stripColor="blue"
        />
        <StatCard
          title="Peak Traffic Hour"
          value="8–9 AM"
          trendValue="85%"
          trend="up"
          subtext="density level"
          icon={<FaRegClock size={20} />}
          stripColor="amber"
        />
        <StatCard
          title="AI Optimization Success"
          value="94.2%"
          trendValue="3.5%"
          trend="up"
          subtext="improvement"
          icon={<FaCheckCircle size={20} />}
          stripColor="green"
        />
      </div>

      {/* Main Graph & Efficiency Card */}
      <div className={styles.mainGrid}>
        {/* Main Area Chart */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Traffic Density Over Time</h3>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={trafficData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDensity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="density" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDensity)" activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }} isAnimationActive={false} />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* System Efficiency Trend */}
        <div className={styles.card} style={{ justifyContent: 'space-between' }}>
          <div>
            <h3 className={styles.cardTitle}>System Efficiency Trend</h3>
            <div className={styles.effValue}>92.4%</div>
            <div className={styles.effSub}>Consistent upward trend</div>
          </div>
          <div className={styles.chartWrapperSmall}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={efficiencyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <Tooltip 
                  contentStyle={{ borderRadius: '6px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', fontSize: '11px', padding: '4px 8px' }} 
                />
                <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 4 }} isAnimationActive={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bar, Pie, Comparison */}
      <div className={styles.bottomGrid}>
        
        {/* Bar Chart */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Peak Congestion Hours</h3>
          <div className={styles.chartWrapperMedium}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={congestionData} margin={{ top: 15, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="congestion" radius={[6, 6, 0, 0]} isAnimationActive={false} label={{ position: 'top', fill: '#64748b', fontSize: 11, fontWeight: 600 }}>
                  {congestionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.congestion === highestCongestion ? '#1d4ed8' : '#3b82f6'} />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Traffic Distribution</h3>
          <div className={styles.chartWrapperMedium}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                  label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                    return (
                      <text x={x} y={y} fill="#ffffff" textAnchor="middle" dominantBaseline="central" fontSize="11px" fontWeight="600">
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill || entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                <Legend 
                  verticalAlign="bottom" 
                  content={(props) => {
                    const { payload } = props;
                    return (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px', fontSize: '10px', color: '#475569', paddingTop: '10px' }}>
                        {payload.map((entry, index) => (
                          <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.color }}></span>
                            {entry.value}
                          </li>
                        ))}
                      </ul>
                    );
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Comparison Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Before vs After AI</h3>
          
          <div className={styles.compWrapper}>
            <div className={styles.compSide}>
              <div className={styles.compLabel}>Without AI</div>
              <div className={styles.compValueLeft}>
                <FaRegClock size={16} className={styles.compIcon} />
                14 <span className={styles.compUnit}>min</span>
              </div>
            </div>
            
            <div className={styles.arrowRight}>
              <FaArrowRight size={20} />
            </div>
            
            <div className={styles.compSide}>
              <div className={styles.compLabel}>With AI</div>
              <div className={styles.compValueRight}>
                <FaRegClock size={16} className={styles.compValueRight} />
                6 <span className={styles.compUnit}>min</span>
              </div>
            </div>
          </div>
          
          <div className={styles.compHighlight}>
            <span className={styles.highlightText}>
              <FaArrowDown size={12} /> 57% average delay reduction
            </span>
          </div>
        </div>
      </div>



    </div>
  );
};

export default Analytics;
