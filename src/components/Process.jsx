import { FiArrowRight } from 'react-icons/fi';
import '../css/sections.css';

const steps = [
  { num: 1, title: 'Book Your Slot', desc: 'Secure your slot today and start your website journey.' },
  { num: 2, title: 'Fill Details', desc: 'Provide business details and requirements via easy online form.' },
  { num: 3, title: 'Pay Advance', desc: 'Pay the advance to confirm your website development slot.' },
  { num: 4, title: 'Get Website In 5 to 10 Days', desc: 'Receive your fully designed website live within the due time.' },
];

export default function Process() {
  return (
    <section className="process-section">
      <div className="container">
        <h2 className="section-title">
          Our <span className="text-green">Simple</span> 4-Step Process
        </h2>
        <p className="section-subtitle">
          From booking to launch — we make it simple, fast, and stress-free.
        </p>
        <div className="process-wrap" data-aos="fade-up">
          {steps.map((step, i) => (
            <>
              <div className="process-step" key={step.num}>
                <div className="step-circle">{step.num}</div>
                <h5>{step.title}</h5>
                <p>{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="process-connector" key={`conn${i}`}>
                  <FiArrowRight />
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
}
