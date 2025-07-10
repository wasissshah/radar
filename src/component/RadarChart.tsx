'use client';
import React, { useEffect, useRef, useState } from 'react';
import './RadarChart.css';

const labels = [
    "Phishing Simulations", "Cloud Posture", "External Footprint",
    "Dark Web", "Cloud Data", "Email Protection",
    "Endpoint Security", "Secure Browsing", "Security Awareness"
];

type Dot = {
    id: number;
    x: number;
    y: number;
    angle: number;
    label: string;
};

// Convert polar to cartesian
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

// Describe rotating arc
function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
        "M", x, y,
        "L", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
    ].join(" ");
}

const RadarChart = () => {
    const scanRef = useRef<SVGGElement | null>(null);
    const [dots, setDots] = useState<Dot[]>([]);
    const [selectedDot, setSelectedDot] = useState<number | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
    const [scanAngle, setScanAngle] = useState(0);
    const radius = 160;
    const angleStep = (2 * Math.PI) / labels.length;

    // Generate dots
    useEffect(() => {
        const generatedDots: Dot[] = Array.from({ length: 12 }).map((_, i) => {
            const r = Math.random() * 120;
            const a = Math.random() * 2 * Math.PI;
            return {
                id: i,
                x: Math.cos(a) * r,
                y: Math.sin(a) * r,
                angle: (a * 180) / Math.PI,
                label: `Dot ${i + 1}`
            };
        });
        setDots(generatedDots);
    }, []);

    // Animate scan
    useEffect(() => {
        let frameId: number;
        const animate = () => {
            const angle = (Date.now() / 25) % 360; // 2x faster
            setScanAngle(angle);
            if (scanRef.current) {
                scanRef.current.setAttribute('transform', `rotate(${angle})`);
            }
            frameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    // Dot click
    const handleDotClick = (id: number) => {
        setSelectedDot(id);
        const dot = dots.find(d => d.id === id);
        if (dot) {
            alert(`Clicked: ${dot.label}\nX: ${dot.x.toFixed(1)}\nY: ${dot.y.toFixed(1)}`);
        }
    };

    // Label click
    const handleLabelClick = (index: number) => {
        setSelectedLabel(index);
        alert(`Clicked label: ${labels[index]}`);
    };

    return (
        <svg viewBox="-200 -200 400 400" className="radar-chart">
            <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(95, 78, 255, 0)" />
                    <stop offset="100%" stopColor="rgba(95, 78, 255, 0.5)" />
                </linearGradient>
            </defs>

            {/* Rings */}
            {[53, 106, 160].map((r, i) => (
                <circle key={i} r={r} stroke="#D2D6D9" fill="none" strokeOpacity="0.6" />
            ))}

            {/* Spokes + Labels */}
            {labels.map((label, i) => {
                const angle = angleStep * i;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <g key={i}>
                        <line x1="0" y1="0" x2={x} y2={y} stroke="#D2D6D9" strokeOpacity="1" />
                        <text
                            x={x * 1}
                            y={y * 1}
                            enableBackground={'red'}
                            fontSize="10"
                            fontWeight="700"
                            textAnchor="middle"
                            alignmentBaseline="middle"
                            fill={i === selectedLabel ? '#5F4EFF' : '#8C8F94'}
                            onClick={() => handleLabelClick(i)}
                            style={{ cursor: 'pointer' }}
                        >
                            {label}
                        </text>
                    </g>
                );
            })}

            {/* Dots */}
            {dots.map((dot) => {
                const diff = Math.abs((dot.angle - scanAngle + 360) % 360);
                const isInScan = diff < 6 || diff > 354;

                return (
                    <circle
                        key={dot.id}
                        cx={dot.x}
                        cy={dot.y}
                        r={selectedDot === dot.id || isInScan ? 6 : 4}
                        className="radar-dot"
                        onClick={() => handleDotClick(dot.id)}
                        style={{
                            cursor: 'pointer',
                            stroke: selectedDot === dot.id ? '#5F4EFF' : isInScan ? '#AAA3F7' : 'none',
                            strokeWidth: selectedDot === dot.id || isInScan ? 2 : 0
                        }}
                    />
                );
            })}

            {/* Rotating Scan Beam */}
            <g ref={scanRef}>
                <path
                    d={describeArc(0, 0, 160, 0, 45)}
                    fill="url(#radarGradient)"
                />
            </g>
        </svg>
    );
};

export default RadarChart;
