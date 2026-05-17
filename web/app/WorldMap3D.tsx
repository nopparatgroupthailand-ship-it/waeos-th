"use client";

import React, { useState, useEffect } from "react";

// 📍 กำหนดพิกัดโหนดสัญญาณยุทธวิธี (คำนวณลงตำแหน่งพิกเซลจาก Lat/Lng จริงบนแผนที่โลก)
const strategicNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#00ff66", label: "PHRAE HQ (THAILAND)", country: "TH" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ff3333", label: "MOSCOW OUTPOST", country: "RU" },
  { id: 3, lat: 40.7128, lng: -74.0060, color: "#00f0ff", label: "NEW YORK NODE", country: "US" },
  { id: 4, lat: -33.8688, lng: 151.2093, color: "#ffaa00", label: "SYDNEY RADAR", country: "AU" }
];

export default function WorldMapCanvasTheater() {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [utcHour, setUtcHour] = useState<number>(12); // ใช้คำนวณตำแหน่งเงาจากเวลามาตรฐานโลก

  // 🕒 1. นาฬิกาตรวจจับเวลาโลกดักจับนาที/ชั่วโมง เพื่อขับเคลื่อนม่านเงา Real-time
  useEffect(() => {
    const updateGlobalClock = () => {
      const now = new Date();
      // แสดงฟอร์แมตเวลาทหารบนหน้าจอ HUD
      setCurrentTimeStr(now.toUTCString().replace("GMT", "UTC"));
      // แปลงเวลาปัจจุบันเป็นจำนวนชั่วโมงสะสมในระบบ UTC
      setUtcHour(now.getUTCHours() + now.getUTCMinutes() / 60);
    };

    updateGlobalClock();
    const interval = setInterval(updateGlobalClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🗺️ 2. ฟังก์ชันแปลงค่าภูมิศาสตร์เป็นพิกัดเปอร์เซ็นต์ซ้อนทับภาพ (Equirectangular Projection)
  const convertGeoToPercent = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  // 🌌 3. คำนวณตำแหน่งองศาและระยะเยื้องของเงาตามการหมุนรอบตัวเองของโลก
  const shadowOffset = (utcHour / 24) * 100;

  return (
    <div style={styles.dashboardContainer}>
      {/* HUD CONTROL BAR */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>
            ENGAGEMENT THEATER <span style={styles.versionBadge}>v3.2 CLEAN_AXIS</span>
          </span>
        </div>
        <div style={styles.statusDisplay}>
          <span style={{ color: "#00ff66" }}>● DYNAMIC TERMINATOR ENGINE ACTIVE</span>
        </div>
        <div style={styles.clockZone}>
          <span style={styles.clockLabel}>REALTIME UTC SYSTEM</span>
          <span style={styles.clockText}>{currentTimeStr || "SYNCHRONIZING..."}</span>
        </div>
      </header>

      {/* MAIN MONITOR THEATER */}
      <section style={styles.mapTheater}>
        <div style={styles.mapWrapper}>
          
          {/* Layer 1: ภาพพื้นหลังโหมดกลางวัน ( map_day.png.png ) */}
          <img 
            src="/map_day.png.png" 
            alt="Tactical Map Day" 
            style={styles.mapBackground}
          />

          {/* Layer 2: ม่านเงาย้อมสีพื้นหลังฝั่งที่เป็นกลางคืนตามเวลาจริงทั่วโลก */}
          <div 
            style={{
              ...styles.nightShadowLayer,
              background: `linear-gradient(90deg, 
                rgba(4, 7, 20, 0.78) 0%, 
                rgba(4, 7, 20, 0.45) 20%, 
                rgba(0, 0, 0, 0) 45%, 
                rgba(0, 0, 0, 0) 55%, 
                rgba(4, 7, 20, 0.45) 80%, 
                rgba(4, 7, 20, 0.78) 100%)`,
              // เลื่อนตำแหน่งม่านเงาพาดผ่านแผนที่จากทิศตะวันออกไปยังทิศตะวันตกตามเวลา UTC จริง
              transform: `translateX(calc(-50% + ${(shadowOffset + 50) % 100}%))`,
            }}
          />

          {/* Layer 3: แผงไฟเรืองแสงกลางคืน ( map_night.png ) จะเฟดสว่างขึ้นในจุดที่เข้าสู่มุมมืด */}
          <div style={styles.nightOverlayContainer}>
            <img 
              src="/map_night.png" 
              alt="Tactical Map Night Lights" 
              style={styles.mapBackground}
            />
          </div>

          {/* Layer 4: ตะแกรงเส้นสแกนเรดาร์ดิจิทัล (Cyber Grid Lines) */}
          <div style={styles.gridOverlay} />

          {/* Layer 5: ระบบคำนวณปักหมุดเรดาร์กะพริบและรายงานสถานะรายประเทศ */}
          {strategicNodes.map((node) => {
            const { left, top } = convertGeoToPercent(node.lat, node.lng);
            
            // คำนวณเวลาท้องถิ่นแบบคร่าวๆ จากเส้นแวง (Longitude) เพื่อเช็คความมืด-สว่างเฉพาะจุด
            const localHour = (utcHour + node.lng / 15 + 24) % 24;
            const isNodeNight = localHour >= 18 || localHour < 6;

            return (
              <div key={node.id} style={{ ...styles.radarTarget, left, top }}>
                {/* วงแหวนรัศมีเรดาร์กะพริบ */}
                <div style={{ ...styles.radarPulse, borderColor: node.color }} />
                {/* แกนกลางเป้าหมาย */}
                <div style={{ ...styles.radarCore, backgroundColor: node.color, boxShadow: `0 0 12px ${node.color}` }} />
                
                {/* หน้าต่างป้ายข้อมูลอัจฉริยะประเมินสภาวะแสงแบบ Real-time */}
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

      {/* BOTTOM INTEL FEED TICKER */}
      <footer style={styles.footerBar}>
        <div style={styles.intelBadge}>INTEL FEED</div>
        <div style={styles.intelText}>
          [SYSTEM LOG] ซิงโครไนซ์ไฟล์ภาพสำเร็จ: map_day.png.png และ map_night.png ทำงานร่วมกับเอนจินควบคุมระดับความสว่างพิกัดโลกเรียลไทม์...
        </div>
      </footer>
    </div>
  );
}

/* 🎨 STRATEGIC STYLES ENGINE */
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
  
  // กรอบโรงภาพยนตร์แผงมอนิเตอร์
  mapTheater: { flex: 1, backgroundColor: "#020406", display: "flex", justifyContent: "center", alignItems: "center", padding: "10px", position: "relative" },
  mapWrapper: { position: "relative", width: "100%", height: "100%", maxWidth: "1200px", aspectRatio: "24/11", overflow: "hidden", border: "2px solid #1e293b", borderRadius: "6px" },
  mapBackground: { width: "100%", height: "100%", objectFit: "cover" },
  
  // 🌌 เลเยอร์ม่านเงามืดคูณสีลงบนชั้นแผนที่ (Mix-Blend-Mode ช่วยรักษาเม็ดพิกเซล 8-bit ไม่ให้สูญเสียรายละเอียด)
  nightShadowLayer: { position: "absolute", top: 0, left: 0, width: "200%", height: "100%", pointerEvents: "none", mixBlendMode: "multiply", transition: "transform 0.5s linear", zIndex: 10 },
  
  // 🌙 เลเยอร์ควบคุมแสงไฟเมืองเวลากลางคืน ซ้อนทับด้านบนม่านเงา
  nightOverlayContainer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.85, zIndex: 12 },
  
  gridOverlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none", zIndex: 20 },
  radarTarget: { position: "absolute", width: "16px", height: "16px", transform: "translate(-50%, -50%)", zIndex: 30 },
  radarCore: { width: "6px", height: "6px", borderRadius: "50%", position: "absolute", top: "5px", left: "5px" },
  radarPulse: { width: "16px", height: "16px", border: "1px solid", borderRadius: "50%", position: "absolute", top: 0, left: 0, animation: "radarGlow 2s infinite linear" },
  tooltipBox: { position: "absolute", bottom: "22px", left: "50%", transform: "translateX(-50%)", backgroundColor: "rgba(9,13,22,0.95)", border: "1px solid #334155", padding: "5px 10px", borderRadius: "4px", fontSize: "10px", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0,0,0,0.6)", pointerEvents: "none" },
  
  footerBar: { height: "32px", backgroundColor: "#090d16", borderTop: "1px solid #1e293b", display: "flex", alignItems: "center" },
  intelBadge: { backgroundColor: "#ff3333", color: "#fff", fontSize: "9px", fontWeight: "bold", padding: "0 12px", height: "100%", display: "flex", alignItems: "center" },
  intelText: { fontSize: "11px", color: "#94a3b8", paddingLeft: "15px", whiteSpace: "nowrap", overflow: "hidden" }
};
