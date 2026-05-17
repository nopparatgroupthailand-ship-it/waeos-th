"use client";

import React, { useState, useEffect } from "react";

// พิกัดโหนดสัญญาณยุทธวิธี (กำหนดค่า Lat/Lon จริงเพื่อใช้คำนวณตำแหน่งพิกเซล)
const tacticalNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#00ff66", label: "สถานะ: ไทย (PHRAE HQ)", country: "TH" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ff3333", label: "MOSCOW OUTPOST (PRIMARY BASE)", country: "RU" },
  { id: 3, lat: 38.9072, lng: -77.0369, color: "#00f0ff", label: "VERCEL EAST NODE", country: "US" },
  { id: 4, lat: 35.6762, lng: 139.6503, color: "#ffaa00", label: "TOKYO RADAR", country: "JP" }
];

export default function WorldMapTacticalV2() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isNight, setIsNight] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = ปกติ, >1 = ซูมเข้า
  const [activeCountry, setActiveCountry] = useState<string>("GLOBAL");

  // 🕒 1. ระบบควบคุมเวลาและสลับสกินภาพกลางวัน-กลางคืนอัตโนมัติ (Local Time-Based)
  useEffect(() => {
    const updateTheater = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));

      // 🕒 ตรวจสอบเวลาเครื่อง: เกิน 18:00 หรือก่อน 06:00 จะปรับเป็น Night Mode เปิดไฟเมืองออโต้
      const currentHour = now.getHours();
      setIsNight(currentHour >= 18 || currentHour < 6);
    };

    updateTheater();
    const interval = setInterval(updateTheater, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔎 2. ฟังก์ชันควบคุมการซูมยุทธวิธี (Tactical Zoom)
  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoomLevel < 2.5) setZoomLevel((prev) => prev + 0.3);
    if (direction === "out" && zoomLevel > 1) setZoomLevel((prev) => prev - 0.3);
  };

  // 🗺️ 3. สูตรแปลงพิกัดทางภูมิศาสตร์ (Lat/Lon) ให้ลงตำแหน่งบนแผนที่พิกเซลพอดี
  const convertGeoToPercent = (lat: number, lng: number) => {
    // ปรับสัดส่วนตามมาตรฐาน Equirectangular Projection ให้เข้ากับภาพ Base Map
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  return (
    <div style={styles.dashboardContainer}>
      
      {/* HEADER CONTROL BAR */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>
            SITUATION ROOM <span style={styles.editionText}>8-BIT THEATER V2.8.5</span>
          </span>
        </div>

        {/* แผงควบคุมระบบแยกส่วนภูมิภาค (Sector Selector) */}
        <div style={styles.regionSelector}>
          <span style={{ color: "#556b82", marginRight: "5px", fontSize: "11px" }}>TACTICAL SECTOR:</span>
          {["GLOBAL", "TH", "RU", "US"].map((sector) => (
            <button
              key={sector}
              onClick={() => {
                setActiveCountry(sector);
                // ถ้าเลือกประเทศเจาะจง ให้ซูมเข้าไปอัตโนมัติเพื่อความตื่นตาตื่นใจ
                if (sector !== "GLOBAL") setZoomLevel(1.6);
                else setZoomLevel(1);
              }}
              style={{
                ...styles.sectorBtn,
                backgroundColor: activeCountry === sector ? "#ff3333" : "#0d121d",
                color: activeCountry === sector ? "#fff" : "#7a8c9e",
                borderColor: activeCountry === sector ? "#ff3333" : "#1a2333"
              }}
            >
              {sector}
            </button>
          ))}
        </div>

        <div style={styles.timeZone}>
          <span style={styles.timeLabel}>SYSTEM TIME (UTC)</span>
          <span style={styles.timeText}>{currentTime || "00:00:00 UTC"}</span>
        </div>
      </header>

      {/* TACTICAL MAP MONITOR THEATER */}
      <section style={styles.mapTheater}>
        
        {/* แถบเครื่องมือซูมฝั่งขวา (Zoom UI Widget) */}
        <div style={styles.zoomWidget}>
          <button onClick={() => handleZoom("in")} style={styles.zoomBtn}>＋</button>
          <div style={styles.zoomIndicator}>{Math.round(zoomLevel * 100)}%</div>
          <button onClick={() => handleZoom("out")} style={styles.zoomBtn}>－</button>
        </div>

        {/* หน้าจอแสดงผลเลเยอร์แผนที่ซ้อนทับ */}
        <div 
          style={{ 
            ...styles.mapViewWindow,
            transform: `scale(${zoomLevel})`,
            // ย้ายจุดศูนย์กลางซูมตามพิกัดภูมิภาคที่เลือก (ไทยจะเฉียงไปทางขวาแถวๆ เอเชีย)
            transformOrigin: activeCountry === "TH" ? "76% 52%" : activeCountry === "RU" ? "60% 30%" : activeCountry === "US" ? "25% 40%" : "center center"
          }}
        >
          {/* ☀️ เลเยอร์ล่าง: แผนที่โหมดกลางวัน (ลิงก์ตรงชื่อไฟล์ภาพ Red Alert 2 บน GitHub ของพี่) */}
          <img 
            src="/Gemini_Generated_Image_nvm58snvm58snvm5.png" 
            alt="Tactical Map Day" 
            style={styles.mapLayerBase} 
          />

          {/* 🌙 เลเยอร์บน: แผนที่โหมดกลางคืน (ไฟเมืองส้มระยิบระยับ/สปอตไลท์ทหาร) */}
          <img 
            src="/map_night.png" 
            alt="Tactical Map Night" 
            style={{ 
              ...styles.mapLayerOverlay, 
              opacity: isNight ? 1 : 0 // ค่อยๆ เฟดเข้าหากลางคืนอย่างนุ่มนวลตามเวลาจริง
            }} 
          />

          {/* ตะแกรงเลเซอร์ดิจิทัล (Scanlines & Grid Overlay เพิ่มฟีลลิ่งหน้าจอคอมพิวเตอร์ทหาร) */}
          <div style={styles.gridOverlay} />

          {/* ระบบพิกัดดวงไฟเรดาร์กะพริบ */}
          {tacticalNodes.map((node) => {
            const { left, top } = convertGeoToPercent(node.lat, node.lng);
            // แสดงเฉพาะจุดที่สัมพันธ์กับภูมิภาคที่เลือก (หรือแสดงทั้งหมดถ้าเลือก GLOBAL)
            if (activeCountry !== "GLOBAL" && activeCountry !== node.country) return null;

            return (
              <div key={node.id} style={{ ...styles.radarPin, left, top }}>
                <div style={{ ...styles.radarPulse, borderColor: node.color }} />
                <div style={{ ...styles.radarCore, backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }} />
                <div style={styles.radarTooltip}>
                  <span style={{ color: "#fff" }}>{node.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* แถบแจ้งเตือนข้อมูลวิ่งใต้จอภาพ (Intel Feed) */}
        <div style={styles.tickerSection}>
          <div style={styles.tickerBadge}>INTEL FEED</div>
          <div style={styles.tickerWrapper}>
            <div style={styles.tickerContent}>
              [SITUATION ROOM NOTE]: CURRENT ACTIVE SECTOR: {activeCountry} | SYSTEM THEATER OPERATING MODE: {isNight ? "NIGHT LIGHTS ENGAGED (100%)" : "DAYLIGHT BASE MONITORING"} | ENHANCED CROSSFADE READY v2.8.5 ...
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD BOTTOM ROW: AI ANALYSIS PANEL */}
      <section style={styles.footerGrid}>
        <div style={styles.footerPanel}>
          <div style={styles.panelTitle}>COMMANDER INSIGHTS & TACTICAL LIVE STATUS</div>
          <div style={styles.panelContent}>
            <p style={{ color: "#8a9ba8", fontSize: "12px", margin: 0, lineHeight: "1.6" }}>
              ยินดีด้วยครับพี่สิริวิชญ์! ระบบทำการเชื่อมต่อแผนที่ยุทธวิธี 8-Bit สมบูรณ์แบบแล้ว เลเยอร์ตรวจจับเวลา (Local Time-Based) กำลังทำงานอัตโนมัติ 
              หากเข้าสู่ช่วงเวลากลางคืน (หลัง 18:00 น.) ภาพจะทำการเฟดเปลี่ยนเป็นโหมดสปอตไลท์ทหารและแสงไฟนีออนของเมืองหลวงทันที 
              พี่สามารถทดสอบคลิกเปลี่ยน SECTOR ที่หัวเว็บเพื่อสั่งให้มุมกล้องล็อกเป้าและซูมเจาะจงรายประเทศได้ทันทีครับ!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* TACTICAL STYLES SHEET */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { backgroundColor: "#06090f", color: "#fff", fontFamily: "monospace", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { backgroundColor: "#0b111e", borderBottom: "2px solid #ff3333", height: "55px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", zIndex: 30 },
  brandZone: { display: "flex", alignItems: "center", gap: "10px" },
  pulseDot: { width: "8px", height: "8px", backgroundColor: "#ff3333", borderRadius: "50%", boxShadow: "0 0 8px #ff3333", animation: "ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite" },
  brandTitle: { fontWeight: "bold", fontSize: "14px", letterSpacing: "1px", color: "#e1e8ed" },
  editionText: { color: "#ffaa00", fontSize: "10px", marginLeft: "5px" },
  regionSelector: { display: "flex", gap: "6px", alignItems: "center" },
  sectorBtn: { border: "1px solid", padding: "4px 12px", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "3px", cursor: "pointer", transition: "all 0.2s ease" },
  timeZone: { textAlign: "right" },
  timeLabel: { display: "block", fontSize: "8px", color: "#556b82" },
  timeText: { fontSize: "13px", color: "#ffaa00", fontWeight: "bold" },
  mapTheater: { position: "relative", width: "100%", height: "60vh", backgroundColor: "#020408", borderBottom: "1px solid #1a2333", overflow: "hidden" },
  zoomWidget: { position: "absolute", top: "20px", right: "20px", backgroundColor: "rgba(11,17,30,0.95)", border: "1px solid #1a2333", borderRadius: "4px", display: "flex", flexDirection: "column", alignItems: "center", width: "45px", zIndex: 40, padding: "5px 0", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" },
  zoomBtn: { backgroundColor: "transparent", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", width: "100%", padding: "4px 0", fontWeight: "bold" },
  zoomIndicator: { fontSize: "9px", color: "#ffaa00", margin: "2px 0", fontFamily: "monospace" },
  mapViewWindow: { width: "100%", height: "100%", position: "relative", transition: "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" },
  mapLayerBase: { width: "100%", height: "100%", objectFit: "cover" },
  mapLayerOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 2s ease-in-out", pointerEvents: "none" },
  gridOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,2
