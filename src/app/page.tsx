import Image from "next/image";
import RadarChart from '../component/RadarChart';

export default function Home() {
  return (
    <div className="p-16 bg-white">
      <RadarChart />
    </div>
  );
}
