"use client";

import type { ReactNode } from "react";

interface DashboardPreviewProps {
  started: boolean;
}

interface StepProps {
  started: boolean;
  delayMs: number;
  children: ReactNode;
}

function Step({ started, delayMs, children }: StepProps) {
  return (
    <g
      style={{
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0px)" : "translateY(8px)",
        transition: "opacity 620ms cubic-bezier(0.16,1,0.3,1), transform 620ms cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delayMs}ms`
      }}
    >
      {children}
    </g>
  );
}

interface BarProps {
  started: boolean;
  delayMs: number;
  x: number;
  y: number;
  width: number;
  tone: string;
  strength: number;
}

function Bar({ started, delayMs, x, y, width, tone, strength }: BarProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height="7"
      rx="3.5"
      fill={tone}
      opacity={strength}
      style={{
        transformOrigin: `${x}px ${y}px`,
        transform: started ? "scaleX(1)" : "scaleX(0)",
        transition: "transform 780ms cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delayMs}ms`
      }}
    />
  );
}

export function DashboardPreview({ started }: DashboardPreviewProps) {
  return (
    <svg viewBox="0 0 880 380" className="h-auto w-full" role="img" aria-label="A preview of the dashboard">
      <Step started={started} delayMs={0}>
        <rect x="0" y="0" width="880" height="380" rx="14" fill="var(--panel)" stroke="var(--edge)" />
        <line x1="196" y1="1" x2="196" y2="379" stroke="var(--edge)" />
      </Step>

      <Step started={started} delayMs={180}>
        <path d="M30 30 l11-6 11 6v12l-11 6-11-6Z" stroke="var(--accent)" strokeWidth="1.2" fill="none" />
        <rect x="60" y="27" width="34" height="6" rx="3" fill="var(--ink)" opacity="0.85" />
        <rect x="60" y="38" width="62" height="4" rx="2" fill="var(--faint)" opacity="0.6" />
        <rect x="24" y="86" width="3" height="14" rx="1.5" fill="var(--accent)" />
        <rect x="38" y="90" width="42" height="6" rx="3" fill="var(--ink)" opacity="0.8" />
        <rect x="38" y="118" width="72" height="6" rx="3" fill="var(--faint)" opacity="0.45" />
        <rect x="38" y="146" width="54" height="6" rx="3" fill="var(--faint)" opacity="0.45" />
        <rect x="38" y="174" width="46" height="6" rx="3" fill="var(--faint)" opacity="0.45" />
        <line x1="24" y1="300" x2="172" y2="300" stroke="var(--edge)" />
        <circle cx="38" cy="326" r="11" stroke="var(--edge)" strokeWidth="1.2" fill="none" />
        <circle cx="38" cy="326" r="4" fill="var(--accent)" opacity="0.9" />
        <rect x="58" y="320" width="52" height="5" rx="2.5" fill="var(--ink)" opacity="0.7" />
        <rect x="58" y="330" width="34" height="4" rx="2" fill="var(--faint)" opacity="0.5" />
      </Step>

      <Step started={started} delayMs={360}>
        <rect x="226" y="26" width="128" height="8" rx="4" fill="var(--ink)" opacity="0.85" />
        <rect x="226" y="44" width="212" height="5" rx="2.5" fill="var(--faint)" opacity="0.6" />
      </Step>

      <Step started={started} delayMs={520}>
        <rect x="226" y="76" width="356" height="176" rx="11" fill="var(--page)" stroke="var(--edge)" />
        <path d="M246 96c.4 3 1.4 4 4.4 4.4-3 .4-4 1.4-4.4 4.4-.4-3-1.4-4-4.4-4.4 3-.4 4-1.4 4.4-4.4Z" fill="var(--accent)" />
        <rect x="260" y="97" width="76" height="5" rx="2.5" fill="var(--faint)" opacity="0.7" />
        <rect x="246" y="122" width="242" height="8" rx="4" fill="var(--ink)" opacity="0.9" />
        <rect x="246" y="138" width="176" height="8" rx="4" fill="var(--ink)" opacity="0.9" />
        <rect x="246" y="168" width="300" height="5" rx="2.5" fill="var(--faint)" opacity="0.55" />
        <rect x="246" y="182" width="268" height="5" rx="2.5" fill="var(--faint)" opacity="0.55" />
        <rect x="246" y="210" width="62" height="20" rx="6" stroke="var(--edge)" fill="none" />
        <rect x="316" y="210" width="72" height="20" rx="6" stroke="var(--edge)" fill="none" />
      </Step>

      <Step started={started} delayMs={700}>
        <rect x="598" y="76" width="256" height="176" rx="11" fill="var(--page)" stroke="var(--edge)" />
        <rect x="618" y="96" width="86" height="5" rx="2.5" fill="var(--faint)" opacity="0.7" />
      </Step>

      {[0, 1, 2, 3, 4, 5].map(function drawDot(index) {
        const missed = index === 3;
        return (
          <circle
            key={index}
            cx={622 + index * 14}
            cy="122"
            r="3.5"
            fill={missed ? "none" : "var(--rising)"}
            stroke={missed ? "var(--fading)" : "none"}
            strokeWidth="1.2"
            style={{
              opacity: started ? 1 : 0,
              transition: "opacity 320ms ease-out",
              transitionDelay: `${860 + index * 90}ms`
            }}
          />
        );
      })}

      <Step started={started} delayMs={1420}>
        <rect x="706" y="119" width="34" height="5" rx="2.5" fill="var(--muted)" opacity="0.6" />
        <rect x="618" y="150" width="30" height="4" rx="2" fill="var(--faint)" opacity="0.5" />
        <rect x="658" y="150" width="122" height="4" rx="2" fill="var(--muted)" opacity="0.5" />
        <path d="M818 149l3 3 5-5.5" stroke="var(--rising)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <rect x="618" y="172" width="30" height="4" rx="2" fill="var(--faint)" opacity="0.5" />
        <rect x="658" y="172" width="98" height="4" rx="2" fill="var(--muted)" opacity="0.5" />
        <path d="M818 169l7 7M825 169l-7 7" stroke="var(--fading)" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="618" y="194" width="30" height="4" rx="2" fill="var(--faint)" opacity="0.5" />
        <rect x="658" y="194" width="134" height="4" rx="2" fill="var(--muted)" opacity="0.5" />
        <path d="M818 193l3 3 5-5.5" stroke="var(--rising)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <line x1="618" y1="218" x2="834" y2="218" stroke="var(--edge)" />
        <rect x="618" y="230" width="196" height="4" rx="2" fill="var(--faint)" opacity="0.45" />
      </Step>

      <Step started={started} delayMs={1600}>
        <rect x="226" y="278" width="150" height="5" rx="2.5" fill="var(--faint)" opacity="0.7" />
        <rect x="226" y="302" width="92" height="5" rx="2.5" fill="var(--ink)" opacity="0.65" />
        <rect x="226" y="324" width="92" height="5" rx="2.5" fill="var(--ink)" opacity="0.65" />
        <rect x="226" y="346" width="92" height="5" rx="2.5" fill="var(--ink)" opacity="0.65" />
      </Step>

      <Bar started={started} delayMs={1740} x={336} y={301} width={240} tone="var(--rising)" strength={0.8} />
      <Bar started={started} delayMs={1860} x={336} y={323} width={168} tone="var(--rising)" strength={0.55} />
      <Bar started={started} delayMs={1980} x={336} y={345} width={64} tone="var(--fading)" strength={0.6} />
    </svg>
  );
}
