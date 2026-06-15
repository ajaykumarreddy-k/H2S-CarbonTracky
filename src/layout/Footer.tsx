import React from'react';
import { Link } from'react-router-dom';
import { cn } from'../lib/utils';

export function Footer() {
  return (
    <div className="w-full mt-24 overflow-x-hidden text-[#1a73e8]">
      <style>
        {`
          .massive-text {
            font-size: clamp(40px, 18vw, 300px);
            line-height: 0.8;
            letter-spacing: 0.02em;
          }
          .curved-text-container {
            margin-top: -1vw;
          }
          .nav-link {
            transition: all 0.2s ease-in-out;
            position: relative;
          }
          .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -4px;
            left: 50%;
            background-color: currentColor;
            transition: all 0.3s ease;
            transform: translateX(-50%);
          }
          .nav-link:hover::after {
            width: 100%;
          }
          .nav-link:hover {
            opacity: 0.8;
          }
        `}
      </style>

      {/* Main Footer Visuals */}
      <div className="w-full flex flex-col items-center justify-center relative px-4">
        
        {/* Giant "CARBON" */}
        <div className="w-full flex justify-center items-center select-none pb-2">
          <h1 className="massive-text font-black whitespace-nowrap text-center tracking-tighter" style={{ fontFamily: '"Arial Black", "Helvetica Black", Impact, sans-serif' }}>
            CARBON
          </h1>
        </div>

        {/* Curved "TRACKY" */}
        <div className="curved-text-container w-full flex justify-center relative z-10 select-none">
          <svg viewBox="0 0 500 160" className="w-[60vw] max-w-[400px] min-w-[220px] overflow-visible">
            <path id="tracky-arc" d="M 20 20 Q 250 180 480 20" fill="transparent" stroke="none" />
            <text fill="currentColor" style={{ fontSize: '42px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '0.45em', fontFamily: 'system-ui, sans-serif' }}>
              <textPath href="#tracky-arc" startOffset="50%" textAnchor="middle">TRACKY</textPath>
            </text>
          </svg>
        </div>
        
      </div>

      {/* Navigation Links */}
      <footer className="w-full pb-10 pt-12 sm:pt-20 px-4 sm:px-8 z-20">
        <nav>
          <ul className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-10 md:gap-x-12 gap-y-6 text-center max-w-6xl mx-auto">
            <li><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="nav-link text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">Calculate</button></li>
            <li><a href="#how-it-works" className="nav-link text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">How It Works</a></li>
            <li><a href="#impact" className="nav-link text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">Impact</a></li>
            <li><a href="#" className="nav-link text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">Methodology</a></li>
            <li><a href="#" className="nav-link text-[10px] sm:text-[11px] font-bold tracking-[0.25em] uppercase">Privacy</a></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
