import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Leaf, Sprout, Hotel, Truck, FlaskConical, Wallet, CalendarDays, Plus, TrendingUp, ClipboardList, Waves, PackageCheck, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import './styles.css';

const initialCrops = [
  { id: 1, name: 'Lettuce Heads', system: 'NFT', cycle: 42, price: 2500, unit: 'head', weeklyTarget: 70, cost: 550, loss: 10 },
  { id: 2, name: "Chef's Salad Mix", system: 'NFT', cycle: 28, price: 5000, unit: '200g bag', weeklyTarget: 35, cost: 1200, loss: 12 },
  { id: 3, name: 'Rocket', system: 'NFT', cycle: 30, price: 18000, unit: 'kg', weeklyTarget: 4, cost: 5500, loss: 12 },
  { id: 4, name: 'Genovese Basil', system: 'NFT', cycle: 35, price: 20000, unit: 'kg', weeklyTarget: 5, cost: 6000, loss: 8 },
  { id: 5, name: 'Mini Cucumber', system: 'Dutch buckets', cycle: 55, price: 4500, unit: 'kg', weeklyTarget: 12, cost: 1700, loss: 10 }
];

const initialHotels = [
  { id: 1, name: 'Friend Hotel A', rooms: 6, guests: 30, delivery: 'Mon / Thu', status: 'Sampling', weeklySpend: 115000 },
  { id: 2, name: 'Friend Hotel B', rooms: 12, guests: 40, delivery: 'Mon / Thu', status: 'Sampling', weeklySpend: 165000 }
];

const initialChannels = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  crop: i < 5 ? 'Lettuce Heads' : i < 8 ? "Chef's Salad Mix" : i < 10 ? 'Rocket' : 'Genovese Basil',
  planted: `${7 + (i % 5) * 4} days ago`,
  health: i % 6 === 0 ? 'Watch' : 'Good',
  sites: 20,
  progress: Math.min(92, 18 + i * 6)
}));

const initialLogs = [
  { date: 'Today', ph: 6.1, ec: 1.35, water: 500, note: 'Good range for leafy greens' },
  { date: 'Yesterday', ph: 6.3, ec: 1.42, water: 470, note: 'Topped reservoir' },
  { date: '2 days ago', ph: 5.9, ec: 1.31, water: 455, note: 'Stable' }
];

function money(n) { return new Intl.NumberFormat('en-TZ', { maximumFractionDigits: 0 }).format(n) + ' TZS'; }

function App() {
  const [crops, setCrops] = useState(initialCrops);
  const [hotels, setHotels] = useState(initialHotels);
  const [channels] = useState(initialChannels);
  const [logs] = useState(initialLogs);
  const [startupCost, setStartupCost] = useState(2700000);
  const [monthlyFixed, setMonthlyFixed] = useState(320000);
  const [newCrop, setNewCrop] = useState({ name: '', price: '', weeklyTarget: '', unit: 'unit', cycle: 35, cost: 0, loss: 10, system: 'NFT' });

  const model = useMemo(() => {
    const weeklyRevenue = crops.reduce((s, c) => s + Number(c.price) * Number(c.weeklyTarget), 0);
    const weeklyVariableCost = crops.reduce((s, c) => s + Number(c.cost || 0) * Number(c.weeklyTarget), 0);
    const monthlyRevenue = weeklyRevenue * 4.33;
    const monthlyVariableCost = weeklyVariableCost * 4.33;
    const monthlyProfit = monthlyRevenue - monthlyVariableCost - Number(monthlyFixed || 0);
    const payback = monthlyProfit > 0 ? startupCost / monthlyProfit : 0;
    return { weeklyRevenue, monthlyRevenue, monthlyVariableCost, monthlyProfit, payback };
  }, [crops, monthlyFixed, startupCost]);

  const revenueData = crops.map(c => ({ name: c.name.replace('Genovese ', ''), revenue: Math.round(c.price * c.weeklyTarget * 4.33) }));
  const profitTrend = [
    { month: 'M1', profit: Math.round(model.monthlyProfit * .35) },
    { month: 'M2', profit: Math.round(model.monthlyProfit * .55) },
    { month: 'M3', profit: Math.round(model.monthlyProfit * .75) },
    { month: 'M4', profit: Math.round(model.monthlyProfit) },
    { month: 'M5', profit: Math.round(model.monthlyProfit * 1.15) },
    { month: 'M6', profit: Math.round(model.monthlyProfit * 1.3) }
  ];

  function addCrop(e) {
    e.preventDefault();
    if (!newCrop.name) return;
    setCrops([...crops, { ...newCrop, id: Date.now(), price: Number(newCrop.price || 0), weeklyTarget: Number(newCrop.weeklyTarget || 0), cycle: Number(newCrop.cycle || 35), cost: Number(newCrop.cost || 0), loss: Number(newCrop.loss || 10) }]);
    setNewCrop({ name: '', price: '', weeklyTarget: '', unit: 'unit', cycle: 35, cost: 0, loss: 10, system: 'NFT' });
  }

  return <div className="app">
    <aside className="sidebar">
      <div className="brand"><div className="logo"><Leaf size={26}/></div><div><h1>Zanzibar Fresh OS</h1><p>Premium produce command centre</p></div></div>
      <nav>{['Dashboard','Farm Map','Production','Hotels','Financials','Nutrients','Deliveries'].map((x,i)=><a key={x} href={`#${x.toLowerCase().replaceAll(' ','-')}`}>{[BarChart3,Sprout,ClipboardList,Hotel,Wallet,FlaskConical,Truck][i]({size:18})}{x}</a>)}</nav>
      <div className="side-card"><Waves/><b>South East Coast Pilot</b><span>12 NFT channels · 2 hotel samples · passion fruit shade canopy</span></div>
    </aside>

    <main>
      <section className="hero" id="dashboard">
        <div><p className="eyebrow">Backyard pilot → boutique hotel supplier</p><h2>Grow, harvest, pack and deliver with numbers behind every decision.</h2></div>
        <button><Plus size={18}/> Record harvest</button>
      </section>

      <section className="kpis">
        <Kpi icon={<Wallet/>} label="Monthly revenue" value={money(model.monthlyRevenue)} />
        <Kpi icon={<TrendingUp/>} label="Monthly profit" value={money(model.monthlyProfit)} />
        <Kpi icon={<CalendarDays/>} label="Payback" value={`${model.payback.toFixed(1)} months`} />
        <Kpi icon={<PackageCheck/>} label="Weekly production" value={`${crops.reduce((s,c)=>s+c.weeklyTarget,0)} units`} />
      </section>

      <section className="grid two">
        <Panel title="Revenue by product" subtitle="Estimated monthly revenue by crop/product.">
          <ResponsiveContainer width="100%" height={280}><BarChart data={revenueData}><XAxis dataKey="name" tick={{fontSize:12}}/><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`}/><Tooltip formatter={(v)=>money(v)}/><Bar dataKey="revenue" radius={[8,8,0,0]}/></BarChart></ResponsiveContainer>
        </Panel>
        <Panel title="Profit ramp" subtitle="Illustrative ramp as production stabilises.">
          <ResponsiveContainer width="100%" height={280}><LineChart data={profitTrend}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="month"/><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`}/><Tooltip formatter={(v)=>money(v)}/><Line type="monotone" dataKey="profit" strokeWidth={3}/></LineChart></ResponsiveContainer>
        </Panel>
      </section>

      <section className="panel" id="farm-map"><div className="panel-head"><div><h3>Digital farm map</h3><p>Each card represents one NFT channel. Use this as the simple operating board.</p></div></div><div className="channels">{channels.map(ch=><div className={`channel ${ch.health==='Watch'?'watch':''}`} key={ch.id}><div><b>Channel {ch.id}</b><span>{ch.crop}</span></div><div className="bar"><i style={{width:ch.progress+'%'}}></i></div><small>{ch.planted} · {ch.sites} sites · {ch.health}</small></div>)}</div></section>

      <section className="grid two" id="production">
        <Panel title="Crop planner" subtitle="Targets can be edited in code now; later we connect a database.">
          <table><thead><tr><th>Crop</th><th>System</th><th>Weekly target</th><th>Monthly revenue</th></tr></thead><tbody>{crops.map(c=><tr key={c.id}><td>{c.name}</td><td>{c.system}</td><td>{c.weeklyTarget} {c.unit}</td><td>{money(c.price*c.weeklyTarget*4.33)}</td></tr>)}</tbody></table>
        </Panel>
        <Panel title="Add crop idea" subtitle="Prototype form to capture future products.">
          <form onSubmit={addCrop} className="form"><input placeholder="Crop/product" value={newCrop.name} onChange={e=>setNewCrop({...newCrop,name:e.target.value})}/><input placeholder="Price" value={newCrop.price} onChange={e=>setNewCrop({...newCrop,price:e.target.value})}/><input placeholder="Weekly target" value={newCrop.weeklyTarget} onChange={e=>setNewCrop({...newCrop,weeklyTarget:e.target.value})}/><button>Add product</button></form>
        </Panel>
      </section>

      <section className="grid two" id="hotels">
        <Panel title="Hotel customers" subtitle="Start with friends as sample partners.">
          {hotels.map(h=><div className="hotel" key={h.id}><div><b>{h.name}</b><span>{h.rooms} rooms · max {h.guests} guests · {h.status}</span></div><strong>{money(h.weeklySpend)}/week</strong></div>)}
        </Panel>
        <Panel title="Delivery plan" subtitle="Simple rhythm for boutique hotels.">
          <div className="delivery"><b>Monday 7:30am</b><span>Lettuce heads, salad bags, basil, rocket</span></div><div className="delivery"><b>Thursday 7:30am</b><span>Fresh top-up delivery + chef feedback</span></div>
        </Panel>
      </section>

      <section className="grid two" id="financials">
        <Panel title="Financial controls" subtitle="Change assumptions live.">
          <label>Startup cost <input type="number" value={startupCost} onChange={e=>setStartupCost(Number(e.target.value))}/></label>
          <label>Monthly fixed costs <input type="number" value={monthlyFixed} onChange={e=>setMonthlyFixed(Number(e.target.value))}/></label>
          <div className="summary"><span>Variable costs/month</span><b>{money(model.monthlyVariableCost)}</b></div><div className="summary"><span>Break-even</span><b>{model.payback.toFixed(1)} months</b></div>
        </Panel>
        <Panel title="Suggested first product mix" subtitle="Focused on high-demand salad crops.">
          <ul className="ticks"><li>Lettuce heads for reliability</li><li>Chef's salad mix for premium margin</li><li>Rocket for restaurants and pizzas</li><li>Genovese basil for chefs</li><li>Mini cucumbers in Dutch buckets, not NFT</li></ul>
        </Panel>
      </section>

      <section className="grid two" id="nutrients">
        <Panel title="pH / EC log" subtitle="Hydroponics only works if this is tracked.">
          <table><thead><tr><th>Date</th><th>pH</th><th>EC</th><th>Water L</th></tr></thead><tbody>{logs.map((l,i)=><tr key={i}><td>{l.date}</td><td>{l.ph}</td><td>{l.ec}</td><td>{l.water}</td></tr>)}</tbody></table>
        </Panel>
        <Panel title="Target ranges" subtitle="Starter ranges for leafy greens; refine with local results.">
          <div className="range"><span>pH</span><b>5.8–6.3</b></div><div className="range"><span>EC lettuce</span><b>1.2–1.8</b></div><div className="range"><span>EC basil/rocket</span><b>1.4–2.0</b></div><div className="range"><span>Water temp</span><b>18–24°C ideal</b></div>
        </Panel>
      </section>
    </main>
  </div>
}

function Kpi({icon,label,value}) { return <div className="kpi"><div>{icon}</div><span>{label}</span><b>{value}</b></div> }
function Panel({title,subtitle,children}) { return <section className="panel"><div className="panel-head"><div><h3>{title}</h3><p>{subtitle}</p></div></div>{children}</section> }

createRoot(document.getElementById('root')).render(<App/>);
