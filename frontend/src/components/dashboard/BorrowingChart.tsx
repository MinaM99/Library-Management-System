'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useAppSelector } from '@/lib/redux/store';
import { useEffect, useState, useMemo } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BorrowingChart() {
  const borrowings = useAppSelector((state) => state.borrowings.items);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const monthlyData = useMemo(() => {
    if (!isClient) {
      // Return empty data during SSR
      return [];
    }

    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      const count = borrowings.filter((b) => {
        const borrowDate = new Date(b.borrowDate);
        return (
          borrowDate.getMonth() === date.getMonth() &&
          borrowDate.getFullYear() === date.getFullYear()
        );
      }).length;
      return { month: `${month} ${year}`, count };
    }).reverse();
  }, [borrowings, isClient]);

  const data = {
    labels: monthlyData.map((d) => d.month),
    datasets: [
      {
        label: 'Number of Borrowings',
        data: monthlyData.map((d) => d.count),
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgb(79, 70, 229)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Borrowings',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Don't render the chart during SSR
  if (!isClient) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <Bar options={options} data={data} />
    </div>
  );
}
