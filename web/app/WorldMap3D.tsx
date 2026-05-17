"use client";
import { useEffect, useRef, useState } from "react";
import DynamicGlobe from "react-force-graph-3d";

export default function WorldMap3D() {
  const globeRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && globeRef.current) {
      // ตั้งค่ามุมกล้องให้หันมาที่โซนประเทศไทย (พิกัด Lat: 13, Lng: 100)
      globeRef.current.pointOfView({ lat: 13, lng: 100, altitude: 2.5 });
      
      // ปรับแต่งแสง (Directional Light) เพื่อจำลองเงากลางวัน-กลางคืนตามเวลาจริง
      const scene = globeRef.current.scene();
      const lights = scene.children.filter((obj: any) => obj.type === "DirectionalLight");
      
      if (lights.length > 0) {
        const now = new Date();
        const hours = now.getHours();
        // คำนวณมุมองศาของดวงอาทิตย์คร่าวๆ อิงตามชั่วโมงปัจจุบัน
        const sunAngle = (hours / 24) * Math.PI * 2;
        
        // ขยับตำแหน่งแสงอาทิตย์จำลองทำให้เกิดเงาสว่าง-มืดบนลูกโลก
        lights[0].position.set(Math.cos(sunAngle) * 300, 0, Math.sin(sunAngle) * 300);
      }
    }
  }, [mounted]);

  if (!mounted) return <div className="text-gray-500">กำลังโหลดแผนที่ 3D...</div>;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <DynamicGlobe 
        ref={globeRef}
        showAtmosphere={true}
        atmosphereAltitude={0.15}
        atmosphereColor="rgba(20, 184, 166, 0.5)"
        backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
        bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
        globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      />
    </div>
  );
}
