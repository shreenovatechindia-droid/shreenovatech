import { useEffect, useRef, useState } from 'react';
import { getStats } from '../utils/api';
import '../css/sections.css';

const FALLBACK = [
  { num_value:10000, suffix:' +', label:'Happy Customers' },
  { num_value:99.9,  suffix:'%',  label:'Uptime Record' },
  { num_value:24,    suffix:'*7', label:'Contact Support' },
  { num_value:4.9,   suffix:'/5', label:'Average Rating' },
];

function Counter({ target, suffix, started }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    const isDecimal = target % 1 !== 0;
    const duration = 1800;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target]);
  return <>{count}{suffix}</>;
}

export default function Stats() {
  const [stats, setStats] = useState(FALLBACK);
  const ref     = useRef();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    getStats()
      .then(r => { if (r.data?.data?.length) setStats(r.data.data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="stats-section" ref={ref}>
      <div className="stats-grid">
        {stats.map(s => (
          <div className="stat-col" key={s.label} data-aos="fade-up">
            <div className="stat-num">
              <Counter target={parseFloat(s.num_value)} suffix={s.suffix} started={started} />
            </div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
