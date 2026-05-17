"use client";

import React, { useState, useEffect } from "react";

const initialPins = [
  { id: 1, name: "Bangkok HQ (Audit Pending)", lat: 13.7563, lng: 100.5018, status: "high", details: "พบสัญญาสั่งซื้อวิธีเฉพาะเจาะจงซ้ำซ้อน" },
  { id: 2, name: "Nan Province Office", lat: 18.7834, lng: 100.7753, status: "medium", details: "อยู่ระหว่างการตรวจรับพัสดุประจำงวด" },
  { id: 3, name: "Songkhla Branch", lat: 7.1898, lng: 100.5954, status: "low", details: "ผ่านการประเมินความโปร่งใสระดับดีเยี่ยม" },
  { id: 4, name: "Washington D.C. Node", lat: 38.9072, lng: -77.0369, status: "low", details: "Vercel Build Server Connected" }
];

export default function WorldMap2DTimezone() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);
  const [solarOffset, setSolarOffset] = useState<number>(0);

  useEffect(() => {
    const updateSystem = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString());
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const totalMinutes = utcHours * 60 + utcMinutes;
      const offsetPercent = (totalMinutes / 1440) * 100;
      setSolarOffset(offsetPercent);
    };

    updateSystem();
    const interval = setInterval(updateSystem, 60000);
    return () => clearInterval(interval);
  }, []);

  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050b14] text-slate-100 font-sans relative overflow-hidden p-4 select-none">
      
      <div className="flex items-center justify-between border-b border-teal-950/60 pb-3 mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="flex space-x-1">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs text-red-400 font-bold tracking-widest">DEFCON 1</span>
          </div>
          <h1 className="text-sm font-black tracking-wider text-teal-400 bg-teal-950/40 px-3 py-1 rounded border border-teal-900/50">
            WAEOS GLOBAL SITUATION MONITOR
          </h1>
        </div>
        <div className="text-right">
          <div className="text-[11px] font-mono text-slate-400">SYSTEM TIME (UTC)</div>
          <div className="text-xs font-mono font-bold text-teal-300">{currentTime || "LOADING..."}</div>
        </div>
      </div>

      <div className="flex-1 w-full bg-[#030712] rounded-lg border border-slate-900 relative overflow-hidden">
        
        {/* เลเยอร์เส้นตารางแบบ WorldMonitor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1f38_1px,transparent_1px),linear-gradient(to_bottom,#0f1f38_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-20 z-10" />

        {/* 🗺️ แผนที่โลกความละเอียดสูง ปลอดภัยจากปัญหา CORS */}
        <img 
          src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80" 
          alt="World Map"
          className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity"
        />

        {/* 🌗 แถบเงาแบ่งเขตเวลากลางวัน-กลางคืนพาดผ่านจอแบบเรียลไทม์ */}
        <div 
          className="absolute inset-y-0 w-[45%] bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none transition-all duration-1000 ease-linear z-10"
          style={{ left: `${(solarOffset + 15) % 100}%` }}
        />
        <div 
          className="absolute inset-y-0 w-[45%] bg-black/80 pointer-events-none transition-all duration-1000 ease-linear z-10"
          style={{ left: `${solarOffset <= 15 ? solarOffset + 85 : solarOffset - 15}%` }}
        />

        {/* ชั้นปักหมุดความเสี่ยง */}
        {initialPins.map((pin) => {
          const { x, y } = convertCoords(pin.lat, pin.lng);
          return (
            <div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
              style={{ left: `${x}%`, top: `${y}%` }}
              onMouseEnter={() => setHoveredPin(pin)}
              onMouseLeave={() => setHoveredPin(null)}
            >
              <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping -left-1.5 -top-1.5 ${
                pin.status === "high" ? "bg-red-500" : pin.status === "medium" ? "bg-amber-500" : "bg-teal-500"
              }`} />
              <div className={`h-3 w-3 rounded-full border border-white shadow-lg ${
                pin.status === "high" ? "bg-red-600" : pin.status === "medium" ? "bg-amber-500" : "bg-teal-400"
              }`} />
            </div>
          );
        })}

        {/* กล่องดีเทลเมื่อ Hover พิกัด */}
        {hoveredPin && (
          <div className="absolute bottom-4 left-4 bg-[#091526]/95 border border-teal-500/40 p-4 rounded shadow-2xl z-30 max-w-xs backdrop-blur-md">
            <div className="text-[10px] uppercase font-bold tracking-widest text-teal-400 mb-1">AI MONITOR NODE //</div>
            <div className="text-xs font-bold text-white mb-1">{hoveredPin.name}</div>
            <div className="text-[11px] text-slate-300 leading-relaxed">{hoveredPin.details}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span>LAT: {hoveredPin.lat}</span> <span>LNG: {hoveredPin.lng}</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-sm border border-slate-900 rounded px-2 py-1 flex items-center gap-3 text-[10px] text-slate-400 font-mono z-20">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Risk</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Elevated</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Normal</div>
          <div className="text-slate-500 border-l border-slate-800 pl-2">🌗 Realtime Solarpaces</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3 z-10">
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-teal-400 font-bold mb-0.5 uppercase tracking-wider">🤖 AI Strategic Posture</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            ระบบวิเคราะห์ตรวจพบดัชนีเสี่ยงสูงในส่วนภูมิภาค แนะนำให้ดึงข้อมูลจาก n8n เพิ่มเติมเพื่อตรวจสอบสัญญาย้อนหลัง
          </p>
        </div>
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-amber-400 font-bold mb-0.5 uppercase tracking-wider">📈 Procurement Stability</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            สัดส่วนการแข่งขันราคา (e-Bidding) เฉลี่ยอยู่ที่ 74% อยู่ในเกณฑ์เสถียรภาพความโปร่งใสปกติทั่วไป
          </p>
        </div>
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-purple-400 font-bold mb-0.5 uppercase tracking-wider">⚡ Tiny LLM Internal Audit</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            พร้อมรับไฟล์รายงานการตรวจรับผ่านช่องทาง Chat เพื่อจัดทำสรุปผังสถิติเชิงปริมาณทันทีเมื่อต้องการ
          </p>
        </div>
      </div>

    </div>
  );
}
