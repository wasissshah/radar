'use client';
import React, { useRef } from 'react';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const data = {
    labels: [
        'Phishing Simulations', 'Cloud Posture', 'External Footprint',
        'Dark Web', 'Cloud Data', 'Email Protection',
        'Endpoint Security', 'Secure Browsing', 'Security Awareness'
    ],
    datasets: [
        {
            label: 'Security Risk Score',
            data: [65, 59, 80, 81, 56, 55, 40, 60, 70],
            backgroundColor: 'rgba(103, 80, 164, 0.2)',
            borderColor: 'rgba(103, 80, 164, 1)',
            pointBackgroundColor: '#5F4EFF',
            pointBorderColor: '#fff',
            pointHoverRadius: 6,
            pointHoverBorderWidth: 2,
            pointHoverBackgroundColor: '#5F4EFF',
        }
    ]
};

const options: ChartOptions<'radar'> = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        r: {
            angleLines: {
                color: '#D2D6D9',
            },
            grid: {
                color: '#D2D6D9',
            },
            pointLabels: {
                color: '#8C8F94',
                font: {
                    size: 12,
                    weight: 'bold',
                },
            },
            ticks: {
                display: false,
            }
        }
    },
    onClick: (e, elements, chart) => {
        if (elements.length > 0) {
            const index = elements[0].index;
            const label = data.labels[index];
            const value = data.datasets[0].data[index];
            alert(`Clicked: ${label} = ${value}`);
        }
    },
};

const RadarChartLib = () => {
    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <Radar data={data} options={options} />
        </div>
    );
};

export default RadarChartLib;
