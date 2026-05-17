"use client";

import React, { useState, useEffect } from "react";

// พิกัดปักหมุดความเสี่ยงจัดซื้อจัดจ้างสไตล์ WorldMonitor
const initialPins = [
  { id: 1, name: "Bangkok HQ (Audit Pending)", lat: 13.7563, lng: 100.5018, status: "high", details: "พบสัญญาสั่งซื้อวิธีเฉพาะเจาะจงซ้ำซ้อนในระบบ" },
  { id: 2, name: "Nan Province Office", lat: 18.7834, lng: 100.7753, status: "medium", details: "อยู่ระหว่างการตรวจรับพัสดุประจำงวดโครงสร้างพื้นฐาน" },
  { id: 3, name: "Phrae Hub Office", lat: 18.1446, lng: 100.1403, status: "low", details: "ผ่านการประเมินความโปร่งใสและเสถียรภาพสัญญาสูง" },
  { id: 4, name: "Washington D.C. Node", lat: 38.9072, lng: -77.0369, status: "low", details: "Vercel Build Server Connected" }
];

export default function WorldMap2DSimple() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);

  useEffect(() => {
    // อัปเดตเวลา UTC ทุกนาที
    const updateTime = () => {
      setCurrentTime(new Date().toUTCString());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันแปลงพิกัด Lat/Lng เป็นเปอร์เซ็นต์บนหน้าจอแบบง่าย
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { x, y };
  };

  return (
    <div className="w-full h-full flex flex-col bg-[#050b14] text-slate-100 font-sans relative overflow-hidden p-4 select-none">
      
      {/* Header สไตล์ แผงมอนิเตอร์ระดับโลก */}
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
          <div className="text-[11px] font-mono text-slate-400">SYSTEM TIME (UTC)
