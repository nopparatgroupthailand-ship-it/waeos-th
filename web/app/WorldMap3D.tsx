"use client";

import React, { useState, useEffect } from "react";

// พิกัดโหนดสัญญาณยุทธวิธี (กำหนดค่า Lat/Lon จริงเพื่อใช้คำนวณตำแหน่งพิกเซล)
const tacticalNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#ff3333", label: "สถานะ: ไทย (PHRAE HQ)", country: "TH" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ffaa00", label: "MOSCOW OUTPOST", country: "RU" },
  { id: 3, lat: 38.9072, lng: -77.0369, color: "#00f0ff", label: "VERCEL EAST NODE", country: "US" },
  { id: 4, lat: 35.6762, lng: 139.6503, color: "#00ff66", label: "TOKYO RADAR", country: "JP" }
];

export default function WorldMapTacticalV2() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isNight, setIsNight] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = ปกติ, 1.5 - 2 = ซูมเข้า
  const [activeCountry, setActiveCountry] = useState<string>("GLOBAL");

  // 🕒 1. ระบบควบคุมเวลาและสลับสกินภาพกลางวัน-กลางคืนอัตโนมัติ
  useEffect(() => {
    const updateTheater = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));

      // ดักจับเวลาเครื่องผู้ใช้: เกิน 18:00 หรือก่อน 06:00 จะปรับเป็น Night Mode ออโต้
      const currentHour = now.getHours();
      setIsNight(currentHour >= 18 || currentHour < 6);
    };

    updateTheater();
    const interval = setInterval(updateTheater, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔎 2. ฟังก์ชันควบคุมการซูม (Zoom In / Out)
  const handleZoom = (direction: "in" | "out") => {
    if (direction === "in" && zoomLevel < 2.5) setZoomLevel((prev) => prev + 0.3);
    if (direction === "out" && zoomLevel > 1) setZoomLevel((prev) => prev - 0.3);
  };

  // 🗺️ 3. สูตรแปลงพิกัดทางภูมิศาสตร์ (Lat/Lon) ให้ลงตำแหน่งบนแผนที่พิกเซลพอดี
  const convertGeoToPercent = (lat: number, lng: number) => {
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
          <span style={styles.brandTitle}>SITUATION ROOM <span style={styles.editionText}>THAI MVP V2.8.2</span></span>
        </div>

        {/* แผงควบคุมระบบแยกส่วนภูมิภาค */}
        <div style={styles.regionSelector}>
          <span style={{ color: "#666", marginRight: "5px" }}>SECTOR:</span>
          {["GLOBAL", "TH", "RU", "US"].map((sector) => (
            <button
              key={sector}
              onClick={() => setActiveCountry(sector)}
              style={{
                ...styles.sectorBtn,
                backgroundColor: activeCountry === sector ? "#ff3333" : "#111",
                color: activeCountry === sector ? "#fff" : "#888",
                borderColor: activeCountry === sector ? "#ff3333" : "#333"
              }}
            >
              {sector}
            </button>
          ))}
        </div>

        <div style={styles.timeZone}>
          <span style={styles.timeLabel}>SYSTEM TIME (UTC)</span>
          <span style={styles.timeText}>{currentTime || "00:00:00 200"}</span>
        </div>
      </header>

      {/* TACTICAL MAP MONITOR */}
      <section style={styles.mapTheater}>
        
        {/* แถบเครื่องมือซูมฝั่งขวา (Zoom UI Widget) */}
        <div style={styles.zoomWidget}>
          <button onClick={() => handleZoom("in")} style={styles.zoomBtn}>+</button>
          <div style={styles.zoomIndicator}>{Math.round(zoomLevel * 100)}%</div>
          <button onClick={() => handleZoom("out")} style={styles.zoomBtn}>-</button>
        </div>

        {/* หน้าจอแสดงผลแผนที่ */}
        <div 
          style={{ 
            ...styles.mapViewWindow,
            transform: `scale(${zoomLevel})`, // บังคับการซูมแบบศูนย์กลางยุทธวิธี
            transformOrigin: activeCountry === "TH" ? "75% 45%" : "center center" // ย้ายจุดศูนย์กลางซูมตามประเทศที่เลือก
          }}
        >
          {/* ☀️ เลเยอร์ล่าง: แผนที่โหมดกลางวัน (สว่าง) */}
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
              opacity: isNight ? 1 : 0 // ค่อยๆ เฟดเมื่อถึงเวลากลางคืนจริง
            }} 
          />

          {/* ตะแกรงเลเซอร์ดิจิทัล (Scanlines & Matrix Grid) */}
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
                  <span style={{ color: "#ffaa00" }}>{node.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* แถบแจ้งเตือนข้อมูลวิ่งใต้จอภาพ */}
        <div style={styles.tickerSection}>
          <div style={styles.tickerBadge}>INTEL FEED</div>
          <div style={styles.tickerWrapper}>
            <div style={styles.tickerContent}>
              [SYSTEM NOTE]: MONITORING ACTIVE AREA: {activeCountry} | TIME MODE: {isNight ? "NIGHT OPERATION (LIGHTS ACTIVE)" : "DAY OPERATION"} | RADAR REFRESH STABLE v2.8.2 ...
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD BOTTOM ROW */}
      <section style={styles.footerGrid}>
        <div style={styles.footerPanel}>
          <div style={styles.panelTitle}>AI INSIGHTS & TACTICAL ANALYSIS</div>
          <div style={styles.panelContent}>
            <p style={{ color: "#aaa", fontSize: "12px", margin: 0 }}>
              ระบบรันไทม์จำลองสภาวะแวดล้อมเสร็จสิ้น คอนโซลควบคุมอยู่ในสถิติจำลองโหมดอัตโนมัติ 
              พี่สามารถใช้แผงควบคุมด้านบนกดเลือกซูมเจาะจงโซนประเทศไทย (TH) หรือกดปุ่มเครื่องมือด้านขวาเพื่อเร่งสัดส่วนการซูมพิกเซลได้โดยภาพไม่สูญเสียความละเอียดครับ
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* TACTICAL STYLES SHEET */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { backgroundColor: "#05070a", color: "#fff", fontFamily: "monospace", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { backgroundColor: "#0a0d14", borderBottom: "2px solid #ff3333", height: "55px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", zIndex: 30 },
  brandZone: { display: "flex", alignItems: "center", gap: "10px" },
  pulseDot: { width: "8px", height: "8px", backgroundColor: "#ff3333", borderRadius: "50%", boxShadow: "0 0 8px #ff3333" },
  brandTitle: { fontWeight: "bold", fontSize: "14px", letterSpacing: "1px" },
  editionText: { color: "#ffaa00", fontSize: "10px" },
  regionSelector: { display: "flex", gap: "6px", alignItems: "center" },
  sectorBtn: { border: "1px solid", padding: "3px 10px", fontSize: "11px", fontFamily: "monospace", fontWeight: "bold", borderRadius: "3px", cursor: "pointer", transition: "all 0.2s" },
  timeZone: { textAlign: "right" },
  timeLabel: { display: "block", fontSize: "8px", color: "#555" },
  timeText: { fontSize: "13px", color: "#ffaa00", fontWeight: "bold" },
  mapTheater: { position: "relative", width: "100%", height: "55vh", backgroundColor: "#020406", borderBottom: "2px solid #1a2530", overflow: "hidden" },
  zoomWidget: { position: "absolute", top: "20px", right: "20px", backgroundColor: "rgba(10,13,20,0.9)", border: "1px solid #333", borderRadius: "4px", display: "flex", flexDirection: "column", alignItems: "center", width: "45px", zIndex: 40, padding: "5px 0" },
  zoomBtn: { backgroundColor: "transparent", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer", width: "100%", padding: "2px 0" },
  zoomIndicator: { fontSize: "9px", color: "#ffaa00", margin: "4px 0", fontFamily: "monospace" },
  mapViewWindow: { width: "100%", height: "calc(100% - 30px)", position: "relative", transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" },
  mapLayerBase: { width: "100%", height: "100%", objectFit: "cover" },
  mapLayerOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "opacity 1.5s ease-in-out", pointerEvents: "none" },
  gridOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,51,51,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,51,51,0.03) 1px, transparent 1px)", backgroundSize: "25px 25px", pointerEvents: "none", zIndex: 10 },
  radarPin: { position: "absolute", width: "14px", height: "14px", transform: "translate(-50%, -50%)", zIndex: 15 },
  radarCore: { width: "6px", height: "6px", borderRadius: "50%", position: "absolute", top: "4px", left: "4px" },
  radarPulse: { width: "14px", height: "14px", border: "1px solid", borderRadius: "50%", position: "absolute", top: 0, left: 0, animation: "radarGlow 1.8s infinite linear" },
  radarTooltip: { position: "absolute", top: "16px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(0,0,0,0.85)", border: "1px solid #333", padding: "2px 6px", borderRadius: "2px", fontSize: "9px", whiteSpace: "nowrap" },
  tickerSection: { height: "30px", backgroundColor: "#05070a", display: "flex", alignItems: "center", borderTop: "1px solid #1a2530" },
  tickerBadge: { backgroundColor: "#ff3333", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "0 10px", height: "100%", display: "flex", alignItems: "center" },
  tickerWrapper: { overflow: "hidden", width: "100%" },
  tickerContent: { display: "inline-block", whiteSpace: "nowrap", paddingLeft: "100%", animation: "tickerRun 25s linear infinite", color: "#ffaa00", fontSize: "12px" },
  footerGrid: { flex: 1, padding: "15px", backgroundColor: "#05070a" },
  footerPanel: { backgroundColor: "#0a0d14", border: "1px solid #1a2530", borderRadius: "4px", height: "100%" },
  panelTitle: { backgroundColor: "#0f131f", padding: "8px 15px", fontSize: "11px", fontWeight: "bold", color: "#ffaa00", borderBottom: "1px solid #1a2530" },
  panelContent: { padding: "12px" }
};
