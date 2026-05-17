"use client";

import React, { useState, useEffect } from "react";

// สร้างพิกัดจำลองสำหรับปักหมุดความเสี่ยง (Audit Risks) ในไทยและรอบโลกสไตล์ WorldMonitor
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
    // อัปเดตเวลาปัจจุบันและคำนวณตำแหน่งเงาจาก timezone จริง
    const updateSystem = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString());

      // คำนวณองศาดวงอาทิตย์คร่าวๆ ตามเวลา UTC เพื่อเลื่อนตำแหน่งแถบเงา (Day/Night Terminator)
      const utcHours = now.getUTCHours();
      const utcMinutes = now.getUTCMinutes();
      const totalMinutes = utcHours * 60 + utcMinutes;
      // 1440 นาทีใน 1 วัน หมุนรอบโลก 100%
      const offsetPercent = (totalMinutes / 1440) * 100;
      setSolarOffset(offsetPercent);
    };

    updateSystem();
    const interval = setInterval(updateSystem, 60000); // อัปเดตทุกนาที
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันแปลงพิกัด Lat/Lng เป็นเปอร์เซ็นต์บนหน้าจอแบบง่าย (Equirectangular Projection)
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050b14] text-slate-100 font-sans relative overflow-hidden p-4 select-none">
      
      {/* ส่วนหัวแผงมอนิเตอร์ระดับโลก */}
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

      {/* พื้นที่แผนที่โลกและเลเยอร์กลางวัน/กลางคืน */}
      <div className="flex-1 w-full bg-[#08101c] rounded-lg border border-slate-900 relative overflow-hidden group">
        
        {/* เลเยอร์เส้นตารางตรรกะ (Grid Lines) สไตล์ Cyberpunk */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f1f38_1px,transparent_1px),linear-gradient(to_bottom,#0f1f38_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30" />

        {/* แผนที่โลก 2D เส้นกรอบหยาบน้ำหนักเบา (จำลองโครงสร้างทวีปหลัก) */}
        <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none bg-center bg-no-repeat bg-cover" 
             style={{ backgroundImage: `url('https://pub-c0525679e9a444a7b74f762e840d249f.r2.dev/world-alpha.svg')` }} />

        {/* 🌗 เลเยอร์เงาแบ่งเขตสว่าง/มืด (Day/Night Overlay) ขยับตามแนวเวลา Timezone */}
        <div 
          className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none transition-all duration-1000 ease-linear"
          style={{ left: `${(solarOffset + 25) % 100}%` }}
        />
        <div 
          className="absolute inset-y-0 w-1/2 bg-black/80 pointer-events-none transition-all duration-1000 ease-linear"
          style={{ left: `${solarOffset <= 25 ? solarOffset + 75 : solarOffset - 25}%` }}
        />

        {/* ชั้นปักหมุดข้อมูลความเสี่ยงจัดซื้อจัดจ้าง (Audit Pins) */}
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
              {/* เอฟเฟกต์วงแหวนเรืองแสงคลื่นความถี่รอบจุดหมุด */}
              <span className={`absolute inline-flex h-6 w-6 rounded-full opacity-75 animate-ping -left-1.5 -top-1.5 ${
                pin.status === "high" ? "bg-red-500" : pin.status === "medium" ? "bg-amber-500" : "bg-teal-500"
              }`} />
              {/* ตัวหมุดใจกลางหลัก */}
              <div className={`h-3 w-3 rounded-full border border-white shadow-lg ${
                pin.status === "high" ? "bg-red-600" : pin.status === "medium" ? "bg-amber-500" : "bg-teal-400"
              }`} />
            </div>
          );
        })}

        {/* 💬 กล่องป๊อปอัปดีเทลที่จะเด้งเมื่อเอาเมาส์ชี้จุดหมุดแบบเรียลไทม์ (AI Strategic Posture) */}
        {hoveredPin && (
          <div className="absolute bottom-4 left-4 bg-[#091526]/95 border border-teal-500/40 p-4 rounded shadow-2xl z-30 max-w-xs backdrop-blur-md animate-fade-in">
            <div className="text-[10px] uppercase font-bold tracking-widest text-teal-400 mb-1">
              AI MONITOR NODE //
            </div>
            <div className="text-xs font-bold text-white mb-1">{hoveredPin.name}</div>
            <div className="text-[11px] text-slate-300 leading-relaxed">{hoveredPin.details}</div>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
              <span>LAT: {hoveredPin.lat}</span>
              <span>LNG: {hoveredPin.lng}</span>
            </div>
          </div>
        )}

        {/* แถบอธิบายสัญลักษณ์ด้านล่าง (Legend) แบบ WorldMonitor */}
        <div className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-900 rounded px-2 py-1 flex items-center gap-3 text-[10px] text-slate-400 font-mono z-20">
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> High Risk</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Elevated</div>
          <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Normal</div>
          <div className="text-slate-500 border-l border-slate-800 pl-2">🌗 Realtime Solarpaces</div>
        </div>
      </div>

      {/* แถบแผง AI INSIGHTS ด้านล่างจอมอนิเตอร์ */}
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
