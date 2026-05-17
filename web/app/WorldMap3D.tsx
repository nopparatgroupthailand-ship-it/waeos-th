"use client";

import React, { useState, useEffect } from "react";

// พิกัดจุดแสดงผลความเสี่ยง ดึงข้อมูลตามบริบทระบบตรวจสอบภายใน
const monitorPins = [
  { id: 1, name: "Thailand Node (Phrae HQ)", lat: 18.1446, lng: 100.1403, status: "high", details: "INTERNAL AUDIT REPORT: Processing LINE Chatbot workflow summaries." },
  { id: 2, name: "Iran Theater (Critical Zone)", lat: 32.4279, lng: 53.6880, status: "high", details: "DEFCON 1: Tactical deployment and cybersecurity monitoring active." },
  { id: 3, name: "South China Sea Node", lat: 10.0000, lng: 114.0000, status: "medium", details: "Conflict Zone: Supply chain and maritime logistics route analysis." },
  { id: 4, name: "North America Sync", lat: 38.9072, lng: -77.0369, status: "low", details: "Vercel Deployment Node: Build automation logs successfully optimized." },
  { id: 5, name: "Europe Operations", lat: 48.8566, lng: 2.3522, status: "medium", details: "Radiation Watch // LegalTech integration framework checks." },
  { id: 6, name: "Beijing Intelligence Node", lat: 39.9042, lng: 116.4074, status: "high", details: "High Alert: Automated procurement anomaly detection system testing." }
];

export default function WorldMonitor2D() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);
  const [newsFeed] = useState<string>(
    "SOVIET INVADERS DETECTED IN NORTH ATLANTIC THEATER ... CHRONOSPHERE SIGNATURE ACTIVATED IN PACIFIC SECTOR ... YURI'S MIND CONTROL TOWERS DETECTED ... SYSTEM ONLINE ..."
  );
  const [inputUrl, setInputUrl] = useState<string>("");
  const [dataChannels, setDataChannels] = useState<string[]>([
    "https://www.gprocurement.go.th/new_index.html",
    "https://www.cgd.go.th",
    "https://phrae.go.th"
  ]);
  
  // สถานะเก็บ URL เว็บที่กำลังเปิดดูในแผงควบคุม (Default ตัวแรกคือกรมบัญชีกลาง)
  const [activeUrl, setActiveUrl] = useState<string>("https://www.gprocurement.go.th/new_index.html");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันแปลงพิกัด Lat/Lng เป็น % บนแผนที่
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const formattedUrl = inputUrl.trim().startsWith("http") ? inputUrl.trim() : `https://${inputUrl.trim()}`;
      setDataChannels([...dataChannels, formattedUrl]);
      setActiveUrl(formattedUrl);
      setInputUrl("");
    }
  };

  // ตัวช่วยแปลง URL เว็บไซต์รัฐบาลที่ติดความปลอดภัย (X-Frame) ให้สามารถฝังเปิดดูได้จริง
  const getEmbeddableUrl = (url: string) => {
    if (url.includes("gprocurement.go.th") || url.includes("cgd.go.th") || url.includes("go.th")) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=jpg` ? `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}` : url;
    }
    return url;
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* 1. TOP HEADER STATUS BAR */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>WORLD MONITOR <span style={styles.editionText}>v2.8.0</span></span>
        </div>
        <div style={styles.centralStatus}>
          <span style={styles.defconBox}>DEFCON 1</span>
          <span style={styles.statusIndicator}>● LIVE FEED</span>
          <span style={styles.systemStatus}>SITUATION ROOM</span>
        </div>
        <div style={styles.timeZone}>
          <span style={styles.timeLabel}>SYSTEM TIME (UTC)</span>
          <span style={styles.timeText}>{currentTime || "00:00:00 UTC"}</span>
        </div>
      </header>

      {/* 2. MAIN MAP THEATER (หน้าจอแผนที่โลก ไม่แบ่ง 70/30) */}
      <section style={styles.mapTheater}>
        <div style={styles.mapContainer}>
          {/* เปลี่ยนไปใช้ภาพแผนที่แนว Sci-fi Grid คุณภาพสูง ดึงรูปขึ้นแน่นอน */}
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop" 
            alt="Cyber Grid World Map" 
            style={styles.mapImage}
          />
          
          <div style={styles.mapGridOverlay}></div>

          {/* ปักหมุดพิกัดเสี่ยงภัย */}
          {monitorPins.map((pin) => {
            const { left, top } = convertCoords(pin.lat, pin.lng);
            return (
              <div
                key={pin.id}
                style={{ ...styles.pinMarker, left, top }}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <div style={{
                  ...styles.pinRadar,
                  backgroundColor: pin.status === "high" ? "#ef4444" : pin.status === "medium" ? "#facc15" : "#06b6d4",
                  boxShadow: `0 0 12px ${pin.status === "high" ? "#ef4444" : pin.status === "medium" ? "#facc15" : "#06b6d4"}`
                }} />
                
                {/* Tooltip บอกรายละเอียดข้อมูล */}
                {hoveredPin?.id === pin.id && (
                  <div style={styles.tooltip}>
                    <div style={styles.tooltipHeader}>{pin.name}</div>
                    <div style={styles.tooltipBody}>{pin.details}</div>
                    <div style={styles.tooltipCoords}>LAT: {pin.lat.toFixed(4)} / LNG: {pin.lng.toFixed(4)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* แถบข่าววิ่งด้านล่างแผนที่ */}
        <div style={styles.tickerBar}>
          <div style={styles.tickerLabel}>LIVE NEWS FEED</div>
          <div style={styles.tickerTrack}>
            <div style={styles.tickerText}>{newsFeed}</div>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM INFRASTRUCTURE GRID (แบ่งพื้นที่แบบ 50:50 สมดุล) */}
      <section style={styles.bottomGrid}>
        
        {/* แผงควบคุมซ้าย: การจัดการช่องสัญญาณเว็บ/ข้อมูลตรวจสอบ */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span><span style={styles.accentText}>📌
