'use client';
import React, { useEffect, useRef, useState } from 'react';
import './RadarChart.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShieldHalved,
    faCloud,
    faGlobe,
    faEye,
    faDatabase,
    faEnvelope,
    faDesktop,
    faGlasses,
    faGraduationCap
} from '@fortawesome/free-solid-svg-icons';

const labels = [
    'Phishing Simulations',
    'Cloud Posture',
    'External Footprint',
    'Dark Web',
    'Cloud Data',
    'Email Protection',
    'Endpoint Security',
    'Secure Browsing',
    'Security Awareness'
];

const icons = [
    faShieldHalved,
    faCloud,
    faGlobe,
    faEye,
    faDatabase,
    faEnvelope,
    faDesktop,
    faGlasses,
    faGraduationCap
];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const rad = (angleDeg - 90) * Math.PI / 180;
    return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad),
    };
}

function describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
        'M', x, y,
        'L', start.x, start.y,
        'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y,
        'Z'
    ].join(' ');
}

const RadarChart = () => {
    const scanRef = useRef<SVGGElement | null>(null);
    const [dots, setDots] = useState<any[]>([]);
    const [selectedDot, setSelectedDot] = useState<number | null>(null);
    const [selectedLabel, setSelectedLabel] = useState<number | null>(null);
    const [scanAngle, setScanAngle] = useState(0);
    const radius = 160;
    const angleStep = 360 / labels.length;

    useEffect(() => {
        const generatedDots = Array.from({ length: 12 }).map((_, i) => {
            const r = Math.random() * 120;
            const a = Math.random() * 360;
            const rad = (a * Math.PI) / 180;
            return {
                id: i,
                x: Math.cos(rad) * r,
                y: Math.sin(rad) * r,
                angle: a,
                label: `Dot ${i + 1}`
            };
        });
        setDots(generatedDots);
    }, []);

    useEffect(() => {
        let frameId: number;
        const animate = () => {
            const angle = (Date.now() / 25) % 360;
            setScanAngle(angle);
            if (scanRef.current) {
                scanRef.current.setAttribute('transform', `rotate(${angle})`);
            }
            frameId = requestAnimationFrame(animate);
        };
        animate();
        return () => cancelAnimationFrame(frameId);
    }, []);

    const handleDotClick = (id: number) => {
        setSelectedDot(id);
        const dot = dots.find(d => d.id === id);
        if (dot) {
            alert(`Clicked: ${dot.label}\nX: ${dot.x.toFixed(1)}\nY: ${dot.y.toFixed(1)}`);
        }
    };

    const handleLabelClick = (index: number) => {
        setSelectedLabel(index);
    };

    return (
        <svg viewBox="-210 -210 420 420" className="radar-chart">
            <defs>
                <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="rgba(95, 78, 255, 0)" />
                    <stop offset="100%" stopColor="rgba(95, 78, 255, 0.5)" />
                </linearGradient>
            </defs>

            {[53, 106, 160].map((r, i) => (
                <circle
                    key={i}
                    r={r}
                    stroke="#D2D6D9"
                    strokeWidth={1}
                    fill="none"
                    strokeOpacity="0.6"
                    shapeRendering="geometricPrecision"
                />
            ))}

            {selectedLabel !== null && (
                <path
                    d={describeArc(
                        0,
                        0,
                        radius,
                        (selectedLabel * angleStep) - angleStep / 2,
                        (selectedLabel * angleStep) + angleStep / 2
                    )}
                    fill="rgba(95, 78, 255, 0.1)"
                    stroke="rgba(95, 78, 255, 0.3)"
                    strokeWidth="1"
                />
            )}

            {labels.map((label, i) => {
                const angle = ((i * angleStep - 90) * Math.PI) / 180;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;

                return (
                    <g key={i} onClick={() => handleLabelClick(i)} style={{ cursor: 'pointer' }}>
                        <line x1="0" y1="0" x2={x} y2={y} stroke="#D2D6D9" strokeOpacity="1" />

                        <foreignObject
                            x={x * 1.15 - 40}
                            y={y * 1.15 - 40}
                            width="80"
                            height="80"
                            style={{ overflow: 'visible' }}
                        >
                            <div
                                style={{
                                    padding: 10,
                                    borderRadius: 10,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    color: selectedLabel === i ? '#5F4EFF' : '#8C8F94',
                                    fontSize: 10
                                }}
                            >
                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
                                <div style={{
                                    backgroundColor: '#5F4EFF',
                                    borderRadius: '50%',
                                    width: 24,
                                    height: 24,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}>
                                    <FontAwesomeIcon icon={icons[i]} color="white" size="sm" />
                                </div>
                            </div>
                        </foreignObject>
                    </g>
                );
            })}

            {dots.map((dot) => {
                const diff = Math.abs((dot.angle - scanAngle + 360) % 360);
                const isInScan = diff < 6 || diff > 354;

                return (
                    <circle
                        key={dot.id}
                        cx={dot.x}
                        cy={dot.y}
                        r={selectedDot === dot.id || isInScan ? 6 : 4}
                        fill="#5F4EFF"
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

            <g ref={scanRef}>
                <path d={describeArc(0, 0, 160, 0, 45)} fill="url(#radarGradient)" />
            </g>
        </svg>
    );
};

export default RadarChart;