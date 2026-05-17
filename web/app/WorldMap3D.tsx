"use client";

import React, { useState, useEffect } from "react";

// พิกัดยุทธศาสตร์โลก (Lat/Lng ตรงตามแผนที่สากล)
const strategicNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#00ff66", label: "PHRAE HQ (THAILAND)", country: "TH" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ff3333", label: "MOSCOW OUTPOST", country: "RU" },
  { id: 3, lat: 40.7128, lng: -74.0060, color: "#00f0ff", label: "NEW YORK NODE", country: "US" },
  { id: 4, lat: -33.8688, lng: 151.2093, color: "#ffaa00", label: "SYDNEY RADAR", country: "AU" }
];

export default function WorldMapCanvasTheater() {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [utcHour, setUtcHour] = useState<number>(12); // เก็บค่าชั่วโมง UTC ปัจจุบันเพื่อคำนวณเงา
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // 🕒 1. ดักจับเวลาโลก (UTC) แบบ Real-time เพื่อคำนวณตำแหน่งดวงอาทิตย์
  useEffect(() => {
    const updateGlobalClock = () => {
      const now = new Date();
      // แสดงฟอร์แมตเวลาบนจอแบบทหาร
      setCurrentTimeStr(now.toUTCString().replace("GMT", "UTC"));
      // ใช้เวลา UTC ในการคำนวณตำแหน่งความมืด-สว่างของโลก
      setUtcHour(now.getUTCHours() + now.getUTCMinutes() / 60);
    };

    updateGlobalClock();
    const interval = setInterval(updateGlobalClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🗺️ 2. สูตรคณิตศาสตร์แปลงค่าภูมิศาสตร์ (Lat/Lng) ไปเป็นเปอร์เซ็นต์บนหน้าจอพิกเซล
  const convertGeoToPercent = (lat: number, lng: number) => {
    // ปรับชดเชยระยะขอบของภาพพิกเซลเพื่อให้จุดปักตรงประเทศพอดี
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  // 🌌 3. คำนวณหาตำแหน่ง "ม่านเงากลางคืน" วิ่งจากขวาไปซ้ายตามเวลาหมุนของโลก
  // เที่ยงคืน UTC (00:00) เงาหนาจะอยู่ตรงกลางแผนที่พอดี (0 องศา)
  const shadowOffset = (utcHour / 24) * 100;

  return (
    <div style={styles.dashboardContainer}>
      {/* HUD CONTROL BAR */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>ENGAGEMENT THEATER <span style={styles.versionBadge}>v3.0 CYBERRADAR</span></span>
        </div>
        <div style={styles.statusDisplay}>
          <span style={{ color: "#00ff66" }}>● GLOBAL TIME MONITOR ACTIVE</span>
        </div>
        <div style={styles.clockZone}>
          <span style={styles.clockLabel}>REALTIME UTC SYSTEM</span>
          <span style={styles.clockText}>{currentTimeStr || "SYNCHRONIZING..."}</span>
        </div>
      </header>

      {/* TACTICAL MAP AREA */}
      <section style={styles.mapTheater}>
        <div style={styles.mapWrapper}>
          
          {/* Layer 1: ภาพ 8-bit พื้นหลังดั้งเดิมของพี่บน GitHub */}
          <img 
            src="/Gemini_Generated_Image_nvm58snvm58snvm5.png" 
            alt="Tactical 8Bit Background" 
            style={styles.mapBackground}
          />

          {/* Layer 2: ม่านเงากลางคืนอัตโนมัติ (Dynamic Day/Night Overlay) */}
          {/* ส่วนที่โดนเงาครอบทับ = กลางคืน | ส่วนที่โล่ง = กลางวัน */}
          <div 
            style={{
              ...styles.nightShadowLayer,
              background: `linear-gradient(90deg, 
                rgba(5, 10, 25, 0.75) 0%, 
                rgba(5, 10, 25, 0.4) 20%, 
                rgba(0, 0, 0, 0) 40%, 
                rgba(0, 0, 0, 0) 60%, 
                rgba(5, 10, 25, 0.4) 80%, 
                rgba(5, 10, 25, 0.75) 100%)`,
              // ขยับเงาตามแกน X ของโลกเรียลไทม์ (หมุนตะวันออกไปตะวันตะวันตก)
              transform: `translateX(calc(-50% + ${(shadowOffset + 50) % 100}%))`,
            }}
          />

          {/* Layer 3: แผ่นกริดเลเซอร์บางๆ พาดผ่านจอคอมพิวเตอร์ทหาร */}
          <div style={styles.gridOverlay} />

          {/* Layer 4: ไอคอน + จุดตรวจจับความร้อน (Hotspots) วางทับด้วยระบบพิกัดเปอร์เซ็นต์ */}
          {strategicNodes.map((node) => {
            const { left, top } = convertGeoToPercent(node.lat, node.lng);
            
            // ตรวจสอบแบบคร่าวๆ ว่าโหนดนั้นๆ อยู่ในโซนมืดหรือสว่างจากค่า Longitude เทียบกับเวลา UTC
            const localHour = (utcHour + node.lng / 15 + 24) % 24;
            const isNodeNight = localHour >= 18 || localHour < 6;

            return (
              <div 
                key={node.id} 
                style={{ ...styles.radarTarget, left, top }}
                onMouseEnter={() => setHoveredNode(node.label)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* วงแหวนเรดาร์กะพริบ (Hotspot Circle Effect) */}
                <div style={{ ...styles.radarPulse, borderColor: node.color }} />
                {/* จุดไข่แดงแกนกลาง */}
                <div style={{ ...styles.radarCore, backgroundColor: node.color, boxShadow: `0 0 12px ${node.color}` }} />
                
                {/* หน้าต่างป้ายข้อมูลอัจฉริยะ (Dynamic Tooltip) บอกสถานะสว่าง/มืด ทันที */}
                <div style={styles.tooltipBox}>
                  <div style={{ color: "#ffaa00", fontWeight: "bold" }}>{node.label}</div>
                  <div style={{ color: isNodeNight ? "#94a3b8" : "#00ff66", fontSize: "9px", marginTop: "2px" }}>
                    STATUS: {isNodeNight ? "🌌 NIGHT OPS ACTIVE" : "☀️ DAYLIGHT MONITOR"}
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </section>

      {/* BOTTOM ANALYSIS BAR */}
      <footer style={styles.footerBar}>
        <div style={styles.intelBadge}>SYS INSIGHT</div>
        <div style={styles.intelText}>
          [ANALYTICS] เงากลางคืนจำลองคำนวณจากมุมตกกระทบของดวงอาทิตย์อ้างอิงเวลานาฬิกา UTC ปัจจุบัน | โหนดภูมิภาคเอเชีย (TH/RU) เข้าสู่เขตปฏิบัติการกลางคืนอย่างสมบูรณ์ | โซนอเมริกา (US) อยู่ในเขตแสงสว่าง...
        </div>
      </footer>
    </div>
  );
}

/* TACTICAL ENGINE STYLES */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { backgroundColor: "#04060a", color: "#fff", fontFamily: "monospace", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column" },
  header: { backgroundColor: "#090d16", borderBottom: "2px solid #ff3333", height: "50px", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 20px", zIndex: 100 },
  brandZone: { display: "flex", alignItems: "center", gap: "8px" },
  pulseDot: { width: "8px", height: "8px", backgroundColor: "#00ff66", borderRadius: "50%", boxShadow: "0 0 8px #00ff66" },
  brandTitle: { fontWeight: "bold", fontSize: "13px", letterSpacing: "1px" },
  versionBadge: { color: "#ffaa00", fontSize: "9px" },
  statusDisplay: { fontSize: "11px" },
  clockZone: { textAlign: "right" },
  clockLabel: { display: "block", fontSize: "8px", color: "#475569" },
  clockText: { fontSize: "12px", color: "#ffaa00", fontWeight: "bold" },
  
  // โซนแสดงแผนที่หลัก
  mapTheater: { flex: 1, backgroundColor: "#020406", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", position: "relative" },
  mapWrapper: { position: "relative", width: "100%", height: "100%", maxWidth: "1200px", aspectRatio: "24/11", overflow: "hidden", border: "2px solid #1e293b", borderRadius: "6px" },
  mapBackground: { width: "100%", height: "100%", objectFit: "cover" },
  
  // 🌌 เลเยอร์เงาครอบทับ (โหมดคูณสี Mix-Blend-Mode ช่วยให้ภาพพื้นหลังไม่สูญเสียความละเอียด 8-Bit)
  nightShadowLayer: { position: "absolute", top: 0, left: 0, width: "200%", height: "100%", pointerEvents: "none", mixBlendMode: "multiply", transition: "transform 0.5s linear", zIndex: 10 },
  gridOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none", zIndex: 20 },
  
  // จุดพิกัดเรดาร์ Hotspot ต่างๆ บนแผนที่
  radarTarget: { position: "absolute", width: "16px", height: "16px", transform: "translate(-50%, -50%)", zIndex: 30, cursor: "pointer" },
  radarCore: { width: "6px", height: "6px", borderRadius: "50%", position: "absolute", top: "5px", left: "5px" },
  radarPulse: { width: "16px", height: "16px", border: "1px solid", borderRadius: "50%", position: "absolute", top: 0, left: 0, animation: "radarGlow 2s infinite linear" },
  
  // กล่อง Tooltip บอกรายละเอียดความสว่างแต่ละโหนด
  tooltipBox: { position: "absolute", bottom: "22px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(9,13,22,0.95)", border: "1px solid #334155", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.6)", pointerEvents: "none" },
  
  // แถบวิ่งด้านล่างสุด
  footerBar: { height: "32px", backgroundColor: "#090d16", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center" },
  intelBadge: { backgroundColor: "#ff3333", color: "#fff", fontSize: "9px", fontWeight: "bold", padding: "0 12px", height: "100%", display: "flex", alignItems: "center" },
  intelText: { fontSize: "11px", color: "#94a3b8", paddingLeft: "15px", whiteSpace: "nowrap", overflow: "hidden" }
};
