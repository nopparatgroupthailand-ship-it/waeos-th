"use client";

import React, { useState, useEffect } from "react";

// พิกัดจุดแสดงผลความเสี่ยง (Global Conflict & Intel Hotspots) แบบเดียวกับต้นฉบับ
const monitorPins = [
  { id: 1, name: "Thailand Node (Phrae HQ)", lat: 18.1446, lng: 100.1403, status: "high", details: "INTERNAL AUDIT SYSTEM ONLINE // MONITORING ACTIVE" },
  { id: 2, name: "Iran Theater (Critical Zone)", lat: 32.4279, lng: 53.6880, status: "high", details: "DEFCON 1 // Intel Hotspot Detected" },
  { id: 3, name: "South China Sea Node", lat: 10.0000, lng: 114.0000, status: "medium", details: "Conflict Zone // Naval Base Tracking" },
  { id: 4, name: "North America Sync", lat: 38.9072, lng: -77.0369, status: "low", details: "Vercel Deployment Node Connection Stable" },
  { id: 5, name: "Europe Operations", lat: 48.8566, lng: 2.3522, status: "medium", details: "Radiation Watch // Supply Chain Risk Analysis" },
  { id: 6, name: "Beijing Intelligence Node", lat: 39.9042, lng: 116.4074, status: "high", details: "High Alert // Strategic Posture Active" }
];

export default function WorldMonitor2D() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString().replace('T', ' ').substring(0, 19) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // แปลงพิกัดภูมิศาสตร์ (Lat, Lng) ให้ลงจุดบนแผนที่ 2D แบบสากล (Equirectangular Projection)
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col bg-[#0b0f17] text-[#e2e8f0] font-mono relative overflow-hidden p-3 select-none border border-[#1e293b]">
      
      {/* ส่วนหัวแสดงสถานะระบบสไตล์ WorldMonitor */}
      <div className="flex items-center justify-between border-b border-[#1e2e4a] pb-2 mb-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-[#1c1917] px-2 py-0.5 border border-[#ef4444] rounded">
            <span className="w-2 h-2 rounded-full bg-[#ef4444] animate-pulse" />
            <span className="text-[11px] text-[#f87171] font-bold tracking-wider">DEFCON 1 100%</span>
          </div>
          <div className="text-xs font-bold tracking-widest text-[#38bdf8]">
            GLOBAL SITUATION MONITOR <span className="text-slate-500 text-[10px]">v2.8.0</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[11px] text-[#38bdf8] font-bold">{currentTime || "CONNECTING..."}</span>
        </div>
      </div>

      {/* พื้นที่แผนที่ 2 มิติเต็มจอ */}
      <div className="flex-1 w-full bg-[#05070c] rounded relative overflow-hidden border border-[#111827]">
        
        {/* เส้นตาราง Grid พื้นหลัง (Latitude/Longitude Lines) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#162235_1px,transparent_1px),linear-gradient(to_bottom,#162235_1px,transparent_1px)] bg-[size:3%_5%] opacity-40 z-0" />

        {/* 🗺️ วาดโครงร่างทวีป 2 มิติด้วยเวกเตอร์ความละเอียดสูงตรงกลางจอ */}
        <svg className="absolute inset-0 w-full h-full opacity-25 z-0" viewBox="0 0 1000 500" preserveAspectRatio="none">
          {/* อเมริกาเหนือและกรีนแลนด์ */}
          <path d="M50,50 L200,40 L280,30 L350,50 L300,120 L250,150 L180,180 L100,160 L50,100 Z M350,15 L430,20 L400,60 L340,50 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
          {/* อเมริกาใต้ */}
          <path d="M220,240 L260,250 L310,290 L330,340 L290,440 L250,480 L230,420 L210,320 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
          {/* แอฟริกา */}
          <path d="M440,200 L490,180 L560,210 L610,260 L570,360 L510,420 L490,400 L460,300 L420,240 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
          {/* ยูเรเชีย (ยุโรป และ เอเชียทั้งหมด) */}
          <path d="M420,150 L520,110 L620,80 L800,80 L920,120 L940,180 L900,240 L850,280 L800,320 L750,260 L680,240 L600,240 L520,250 L460,180 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
          {/* เน้นลายเส้นโครงร่างบริเวณ ประเทศไทย และภูมิภาคเอเชียตะวันออกเฉียงใต้ */}
          <path d="M750,250 L775,252 L785,275 L770,305 L755,300 L745,270 Z" fill="#1e293b" opacity="0.6" stroke="#0ea5e9" strokeWidth="1.5" />
          {/* ออสเตรเลีย */}
          <path d="M800,360 L870,365 L900,420 L820,440 Z" fill="none" stroke="#475569" strokeWidth="1.5" />
        </svg>

        {/* จุดปักหมุดไฟเรืองแสงกระพริบ (Interactive Global Intel Pins) */}
        {monitorPins.map((pin) => {
          const { x, y } = convertCoords(pin.lat, pin.lng);
          return (
            <div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              {/* วงแหวนเรดาร์สะท้อนรอบจุด */}
              <span className={`absolute inline-flex h-5 w-5 rounded-full opacity-75 animate-ping -left-1.5 -top-1.5 ${
                pin.status === "high" ? "bg-[#ef4444]" : pin.status === "medium" ? "bg-[#f59e0b]" : "bg-[#0ea5e9]"
              }`} />
              {/* เม็ดไฟศูนย์กลาง */}
              <div className={`h-2 w-2 rounded-full border border-black shadow-md ${
                pin.status === "high" ? "bg-[#ef4444]" : pin.status === "medium" ? "bg-[#f59e0b]" : "bg-[#0ea5e9]"
              }`} />
            </div>
          );
        })}

        {/* กล่องแสดงข้อมูลเมื่อเลื่อนเมาส์ไปชี้ที่จุดปักหมุด */}
        {hoveredPin && (
          <div className="absolute bottom-3 left-3 bg-[#0f172a]/95 border border-[#38bdf8]/50 p-3 rounded shadow-xl z-20 max-w-sm font-mono backdrop-blur-sm">
            <div className="text-[10px] text-[#38bdf8] font-bold mb-1">INTEL NODE // SECURITY ACCESS</div>
            <div className="text-xs font-bold text-white mb-0.5">{hoveredPin.name}</div>
            <div className="text-[11px] text-slate-300 leading-normal">{hoveredPin.details}</div>
            <div className="mt-1.5 text-[9px] text-slate-500">
              COORDS: {hoveredPin.lat.toFixed(4)}N, {hoveredPin.lng.toFixed(4)}E
            </div>
          </div>
        )}

        {/* คำอธิบายสัญลักษณ์ (Legend) ที่มุมจอด้านล่าง */}
        <div className="absolute bottom-2 right-2 bg-[#0b0f17]/90 border border-[#1e293b] rounded px-2 py-1 flex items-center gap-3 text-[10px] font-mono z-10">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#ef4444]" /> High Alert</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" /> Elevated</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9]" /> Normal Node</div>
          <span className="text-[#475569]">|</span>
          <span className="text-slate-400">PROTOMAPS 2D LIVE</span>
        </div>
      </div>

    </div>
  );
}
