import React, { useEffect, useState } from'react';
import { Link } from'react-router-dom';

function AnimatedCounter({ end, duration = 1800 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export function Landing() {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700">
      <section className="w-full max-w-4xl mx-auto px-4 sm:px-6 mt-10 mb-16 text-center">
        <div className="bg-[#e8f0fe]  border border-[#8ab4f8]  rounded-2xl md:rounded-3xl py-12 md:py-20 px-6 sm:px-12 mb-8 transform hover:scale-[1.01] transition-transform duration-500">
          <div className="text-[52px] md:text-[72px] font-medium text-[#1967d2]  leading-none mb-3 tracking-tight">
            <AnimatedCounter end={6840} />
          </div>
          <div className="text-[14px] text-[#5F5E5A]">
            kg CO₂e · your estimated annual footprint
          </div>
          
          <h1 className="text-[24px] md:text-[32px] font-medium text-gray-900  mt-10 mb-4 mx-auto max-w-lg leading-tight">
            The first step is knowing your number.
          </h1>
          <p className="text-[14px] md:text-[16px] text-gray-600  max-w-[420px] mx-auto mb-10 leading-relaxed">
            Track your carbon footprint in under 90 seconds. Get personalised actions that actually fit your life.
          </p>
          
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-[#1a73e8] hover:bg-[#1967d2] text-white px-8 py-4 rounded-full text-[15px] font-medium transition-colors shadow-sm"
          >
            Calculate mine free <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-[#f8f9fa]  rounded-xl p-5 border border-gray-100">
            <div className="text-[12px] text-gray-500 mb-1">Average Indian footprint</div>
            <div className="text-[24px] font-medium text-gray-900">1.9t</div>
            <div className="text-[11px] text-gray-500 mt-1">CO₂e per year</div>
          </div>
          <div className="bg-[#f8f9fa]  rounded-xl p-5 border border-gray-100">
            <div className="text-[12px] text-gray-500 mb-1">1.5°C target</div>
            <div className="text-[24px] font-medium text-gray-900">2.3t</div>
            <div className="text-[11px] text-gray-500 mt-1">per person / year</div>
          </div>
          <div className="bg-[#f8f9fa]  rounded-xl p-5 border border-gray-100">
            <div className="text-[12px] text-gray-500 mb-1">Avg action saves</div>
            <div className="text-[24px] font-medium text-gray-900">180kg</div>
            <div className="text-[11px] text-[#1e8e3e]  font-medium mt-1">↓ per year</div>
          </div>
        </div>
      </section>
      
      {/* Why it matters */}
      <section id="why-it-matters" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100">
        <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6">Why carbon tracking matters</h2>
        <div className="text-left text-gray-600 space-y-6 text-[16px] leading-relaxed max-w-3xl mx-auto">
          <p>
            Climate change is one of the most pressing challenges of our time. According to the <a href="https://www.ipcc.ch/" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] underline">Intergovernmental Panel on Climate Change (IPCC)</a>, rapid reductions in greenhouse gas emissions are required across all sectors to limit global warming to 1.5°C. Understanding your personal contribution is the foundational step towards meaningful action.
          </p>
          <p>
            Every choice we make—from how we commute to what we eat—has an environmental cost. The <a href="https://www.unep.org/" target="_blank" rel="noopener noreferrer" className="text-[#1a73e8] underline">UN Environment Programme</a> highlights that household consumption accounts for a significant portion of global emissions. By measuring your footprint, you can identify high-impact areas in your daily life.
          </p>
          <p>
            With Carbon Tracky, we make this process intuitive. You can start by completing your <Link to="/onboarding" className="text-[#1a73e8] underline">initial assessment</Link> to get a baseline score. From there, your personalized <Link to="/dashboard" className="text-[#1a73e8] underline">tracking dashboard</Link> provides continuous insights. If you ever need to update your preferences, simply visit your <Link to="/profile" className="text-[#1a73e8] underline">user profile</Link> to adjust your settings. Knowledge is power, and tracking empowers you to be part of the solution.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100">
        <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6">How it works</h2>
        <p className="text-[16px] text-gray-600 max-w-2xl mx-auto mb-16">
          Understanding your impact shouldn't be complicated. Carbon Tracky simplifies the process into three easy steps.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
            <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">1</div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Log your habits</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed">Input your daily transport, diet, and energy usage in seconds using our streamlined interface.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
            <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">2</div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Get AI insights</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed">Our Gemini-powered engine analyzes your footprint to find the most impactful areas for improvement.</p>
          </div>
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
            <div className="w-12 h-12 bg-[#e8f0fe] text-[#1967d2] rounded-full flex items-center justify-center font-medium text-xl mb-6">3</div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">Reduce impact</h3>
            <p className="text-gray-600 text-[14px] leading-relaxed">Commit to personalized actions, track your progress over time, and build a lasting sustainable lifestyle.</p>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100 mb-10">
        <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-6">Real-world impact</h2>
        <p className="text-[16px] text-gray-600 max-w-2xl mx-auto mb-16">
          When millions make small changes, the collective impact is massive. Here's what we're achieving together.
        </p>
        <div className="bg-[#1a73e8] text-white rounded-3xl p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-6">
            <h3 className="text-3xl md:text-4xl font-medium leading-tight">Every kilogram counts.</h3>
            <p className="text-[#e8f0fe] text-[16px] leading-relaxed">
              By aligning your daily choices with global sustainability targets, you're directly contributing to the fight against climate change. Our community has already saved thousands of tonnes of CO₂e.
            </p>
            <Link to="/dashboard" className="inline-block mt-4 bg-white text-[#1a73e8] px-6 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-sm">
              Join the movement
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-medium mb-1">24.5k</div>
              <div className="text-[12px] text-blue-100 uppercase tracking-wider">Active users</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl font-medium mb-1">1.2m</div>
              <div className="text-[12px] text-blue-100 uppercase tracking-wider">Actions logged</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center col-span-2">
              <div className="text-4xl font-medium mb-1">8,450t</div>
              <div className="text-[12px] text-blue-100 uppercase tracking-wider">CO₂e Reduced this year</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 text-center border-t border-gray-100 mb-10">
        <h2 className="text-[32px] md:text-[40px] font-medium text-gray-900 mb-10">Frequently Asked Questions</h2>
        <div className="text-left space-y-8 max-w-3xl mx-auto">
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">How accurate is the carbon calculator?</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Our calculator uses up-to-date emission factors provided by global environmental agencies. While it provides an estimate rather than a perfectly exact figure, it is highly accurate for identifying major emission sources in your lifestyle.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Is my data secure and private?</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              Absolutely. We take privacy seriously. Your lifestyle inputs are encrypted and only used to generate your personalized footprint analysis. We never sell your personal data to third parties.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Do I need to track every single day?</h3>
            <p className="text-gray-600 text-[15px] leading-relaxed">
              No, you don't. We recommend updating your footprint whenever you make a significant lifestyle change. However, logging occasional habits in your dashboard helps the AI provide better, more tailored recommendations.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
