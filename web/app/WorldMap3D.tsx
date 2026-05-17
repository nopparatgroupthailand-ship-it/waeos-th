"use client";

import React, { useState, useEffect } from "react";

// พิกัดจุดเสี่ยงจัดซื้อจัดจ้าง (Audit Node Locations)
const initialPins = [
  { id: 1, name: "Bangkok HQ (Audit Pending)", lat: 13.7563, lng: 100.5018, status: "high", details: "พบสัญญาสั่งซื้อวิธีเฉพาะเจาะจงซ้ำซ้อนในระบบ" },
  { id: 2, name: "Nan Province Office", lat: 18.7834, lng: 100.7753, status: "medium", details: "อยู่ระหว่างการตรวจรับพัสดุประจำงวดโครงสร้างพื้นฐาน" },
  { id: 3, name: "Phrae Hub Office", lat: 18.1446, lng: 100.1403, status: "low", details: "ระบบตรวจผ่านเกณฑ์ความโปร่งใสและเสถียรภาพสัญญาสูง" },
  { id: 4, name: "Washington D.C. Node", lat: 38.9072, lng: -77.0369, status: "low", details: "Vercel Sync Server Active" }
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
      // คำนวณขยับเงาตามเวลาจริงรอบโลก (1440 นาที)
      const offsetPercent = (totalMinutes / 1440) * 100;
      setSolarOffset(offsetPercent);
    };

    updateSystem();
    const interval = setInterval(updateSystem, 60000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันแปลงค่าพิกัดโลกให้เป็นจุด % บนจอแบบ 2D (Equirectangular)
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050b14] text-slate-100 font-sans relative overflow-hidden p-4 select-none">
      
      {/* Top Header สไตล์ แผงยุทธศาสตร์ */}
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

      {/* Main Map Arena */}
      <div className="flex-1 w-full bg-[#030712] rounded-lg border border-slate-900 relative overflow-hidden">
        
        {/* เลเยอร์เส้นตารางแบบ WorldMonitor */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1f38_1px,transparent_1px),linear-gradient(to_bottom,#0f1f38_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-20 z-10" />

        {/* 🗺️ แผนที่โลก 2D เวกเตอร์ (สร้างลายเส้นทวีปโดยตรง ไม่พึ่งพาไฟล์ภาพภายนอก หมดปัญหา CORS) */}
        <svg className="absolute inset-0 w-full h-full opacity-30 mix-blend-screen" viewBox="0 0 1000 500" preserveAspectRatio="none">
          {/* อเมริกาเหนือ-ใต้ */}
          <path d="M100,100 L250,130 L280,220 L320,280 L280,450 L250,480 L230,400 L250,300 L180,240 L120,200 Z" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M250,280 L320,290 L350,350 L310,480 L280,480 L260,380 Z" fill="none" stroke="#0d9488" strokeWidth="1.5" />
          {/* ยูเรเชีย แอฟริกา (ยุโรป เอเชีย ไทย) */}
          <path d="M450,100 L600,80 L850,110 L920,180 L880,300 L800,320 L750,280 L700,350 L650,450 L580,400 L500,420 L420,300 L450,180 Z" fill="none" stroke="#1e293b" strokeWidth="2" strokeDasharray="4 2" />
          <path d="M500,200 L620,180 L780,220 L850,260 L800,350 L700,320 L580,280 Z" fill="none" stroke="#0d9488" strokeWidth="1.5" />
          {/* ขยายลายเส้นเน้นเฉพาะฝั่งเอเชียตะวันออกเฉียงใต้และประเทศไทย */}
          <path d="M740,260 L780,260 L790,290 L770,320 L750,310 Z" fill="#115e59" opacity="0.4" stroke="#2dd4bf" strokeWidth="1" />
          {/* ออสเตรเลีย */}
          <path d="M800,380 L880,390 L900,450 L820,460 Z" fill="none" stroke="#0d9488" strokeWidth="1.5" />
        </svg>

        {/* 🌗 แถบเงาแบ่งโซน กลางวัน/กลางคืน (Day/Night Timezone) ขยับเลื่อนนุ่มนวลแบบเรียลไทม์ */}
        <div 
          className="absolute inset-y-0 w-[50%] bg-gradient-to-r from-black/85 via-black/40 to-transparent pointer-events-none transition-all duration-1000 ease-linear z-10"
          style={{ left: `${(solarOffset + 20) % 100}%` }}
        />
        <div 
          className="absolute inset-y-0 w-[50%] bg-black/85 pointer-events-none transition-all duration-1000 ease-linear z-10"
          style={{ left: `${solarOffset <= 20 ? solarOffset + 80 : solarOffset - 20}%` }}
        />

        {/* ชั้นปักหมุดความเสี่ยง (Interactive Pins) */}
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

        {/* กล่องบรรยายรายละเอียด AI Node ข้อมูลเมื่อผู้ใช้ Hover เมาส์ */}
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

        {/* แถบอธิบายสัญลักษณ์ (Legend) ด้านล่างจอ */}
        <div className="absolute bottom-2 right-2 bg-slate-950/90 backdrop-blur-sm border border-slate-900 rounded px-2 py-1 flex items-center gap-3 text-[10px] text-slate-400 font-mono z-20">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Risk</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Elevated</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Normal</div>
          <div className="text-slate-500 border-l border-slate-800 pl-2">🌗 Realtime Solarpaces</div>
        </div>
      </div>

      {/* แผงบรรยายสรุปด้านล่าง */}
      <div className="grid grid-cols-3 gap-2 mt-3 z-10">
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-teal-400 font-bold mb-0.5 uppercase tracking-wider">🤖 AI Strategic Posture</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            ตรวจพบดัชนีเสี่ยงในส่วนภูมิภาค แนะนำให้ดึงข้อมูลจากโครงข่าย n8n เพิ่มเติมเพื่อสอบทานสัญญาย้อนหลัง
          </p>
        </div>
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-amber-400 font-bold mb-0.5 uppercase tracking-wider">📈 Procurement Stability</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            สัดส่วนแข่งขันราคาเฉลี่ยอิเล็กทรอนิกส์อยู่ที่ 74% อยู่ในเกณฑ์มาตรฐานเสถียรภาพปกติทั่วไป
          </p>
        </div>
        <div className="bg-[#091424] border border-slate-900 rounded p-2.5">
          <div className="text-[10px] text-purple-400 font-bold mb-0.5 uppercase tracking-wider">⚡ Tiny LLM Internal Audit</div>
          <p className="text-[11px] text-slate-400 leading-normal">
            รองรับระบบรายงานประมวลผลไฟล์ตรวจรับพัสดุผ่าน LINE Chatbot เพื่อร่าง Flowchart และ Checklist อัตโนมัติ
          </p>
        </div>
      </div>

    </div>
  );
}
