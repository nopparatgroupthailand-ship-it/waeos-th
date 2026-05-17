"use client";

import React, { useState, useEffect } from "react";

const strategicNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#00ff66", label: "PHRAE HQ (THAILAND)", status: "ACTIVE" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ff3333", label: "MOSCOW OUTPOST", status: "CRITICAL" },
  { id: 3, lat: 40.7128, lng: -74.0060, color: "#00f0ff", label: "NEW YORK NODE", status: "MONITORING" }
];

export default function TacticalMatrixDashboard() {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [utcHour, setUtcHour] = useState<number>(12);
  
  // 🔘 สถานะการสลับหน้าจอ (8BIT / 2D / 3D) กลับมาทำงานเหมือนเดิม
  const [mapMode, setMapMode] = useState<"8BIT" | "2D" | "3D">("8BIT");

  // 🌐 ระบบ Dynamic URL Matrix (พี่สามารถเปลี่ยน URL ในช่องกรอกเพื่อดึงเว็บมาฉายสดได้)
  const [mainMapUrl, setMainMapUrl] = useState<string>(""); // หากใส่ URL จะดึงเว็บมาทับแผนที่หลัก ทิ้งว่างไว้จะโชว์แผนที่ 8-Bit
  const [urlSlot1, setUrlSlot1] = useState<string>("https://www.bloomberg.com");
  const [urlSlot2, setUrlSlot2] = useState<string>("https://www.tradingview.com");
  const [urlSlot3, setUrlSlot3] = useState<string>("https://www.youtube.com/embed/live_stream?channel=UCrXjaM_wZ9vM86bZf55ZExA"); // ตัวอย่างสตรีมสด

  useEffect(() => {
    const updateGlobalClock = () => {
      const now = new Date();
      setCurrentTimeStr(now.toUTCString().replace("GMT", "UTC"));
      setUtcHour(now.getUTCHours() + now.getUTCMinutes() / 60);
    };
    updateGlobalClock();
    const interval = setInterval(updateGlobalClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const convertGeoToPercent = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  const shadowOffset = (utcHour / 24) * 100;

  return (
    <div style={styles.dashboardContainer}>
      
      {/* ── TOP BLACK HEADER ── */}
      <header style={styles.topHeader}>
        <div style={styles.leftNavZone}>
          <div style={styles.tabButtonActive}>🌐 MATRIX THEATER</div>
          <div style={styles.tabButton} onClick={() => window.open('https://worldmonitor.app', '_blank')}>🔗 EXTERNAL SYSTEM</div>
        </div>
        
        <div style={styles.centerBrandZone}>
          <span style={styles.mainLogoText}>FIREFLY OS</span>
          <span style={styles.versionTag}>v4.0 MATRIX</span>
          <div style={styles.livePulseContainer}>
            <div style={styles.greenPulseDot}></div>
            <span style={styles.liveText}>SYSTEM LIVE</span>
          </div>
        </div>

        <div style={styles.rightControlZone}>
          <div style={styles.defconBadge}>🚨 LEVEL: ACTIVE</div>
          <span style={styles.clockText}>{currentTimeStr || "CLOCK SYNCHRONIZING..."}</span>
        </div>
      </header>

      {/* ── SUB-HUD MODE CONTROLLER (ระบบปุ่มสลับหน้าจอเดิม) ── */}
      <div style={styles.subHudBar}>
        <div style={styles.subHudLeft}>
          ⌨️ MAIN COMMANDER: <span style={{color: "#00ff66"}}>Siriwit Rangap</span>
        </div>
        <div style={styles.subHudRight}>
          <span style={styles.controlLabel}>SCREEN CONTROLLER:</span>
          <button 
            style={mapMode === "2D" ? styles.toggleViewBtnActive : styles.toggleViewBtn} 
            onClick={() => setMapMode("2D")}
          >2D MAP</button>
          <button 
            style={mapMode === "3D" ? styles.toggleViewBtnActive : styles.toggleViewBtn} 
            onClick={() => setMapMode("3D")}
          >3D MAP</button>
          <button 
            style={mapMode === "8BIT" ? styles.toggleViewBtnActive : styles.toggleViewBtn} 
            onClick={() => setMapMode("8BIT")}
          >ระดับจอ: 8-BIT MAP</button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE (แบ่งสัดส่วนบน-ล่างอย่างชัดเจน) ── */}
      <div style={styles.mainWorkspaceLayout}>
        
        {/* 🗺️ AREA 1: จอฉายแผงควบคุม/แผนที่ ด้านบนสุด (TOP MAIN MONITOR) */}
        <section style={styles.topMainMonitor}>
          <div style={styles.panelHeaderBar}>
            <span>🖥️ UPPER THEATER PANEL [MODE: {mapMode}]</span>
            <div style={styles.urlInputGroup}>
              <span style={{fontSize: "9px", color: "#64748b"}}>OVERRIDE URL:</span>
              <input 
                type="text" 
                placeholder="ทิ้งว่างไว้เพื่อดูแผนที่ หรือใส่ https://... เพื่อดึงเว็บมาแสดง" 
                value={mainMapUrl}
                onChange={(e) => setMainMapUrl(e.target.value)}
                style={styles.panelUrlInput}
              />
            </div>
          </div>

          <div style={styles.monitorContentWrapper}>
            {mainMapUrl ? (
              /* หากระบุ URL แผงบนจะกลายเป็นเว็บสดทันที */
              <iframe src={mainMapUrl} style={styles.liveIframeSandbox} title="Upper System Web" />
            ) : (
              /* โหมดแผนที่ดั้งเดิมของพี่สิริวิชญ์ */
              <div style={{position: "relative", width: "100%", height: "100%"}}>
                {mapMode === "8BIT" ? (
                  <>
                    <img src="/map_day.png.png" alt="Tactical Day Base" style={styles.mapBackgroundImg} />
                    <div 
                      style={{
                        ...styles.nightShadowLayer,
                        background: `linear-gradient(90deg, rgba(4,7,20,0.8) 0%, rgba(4,7,20,0.45) 22%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 52%, rgba(4,7,20,0.45) 78%, rgba(4,7,20,0.8) 100%)`,
                        transform: `translateX(calc(-50% + ${(shadowOffset + 50) % 100}%))`,
                      }}
                    />
                    <div style={styles.nightLightsContainer}>
                      <img src="/map_night.png" alt="Tactical Night Overlay" style={styles.mapBackgroundImg} />
                    </div>
                  </>
                ) : (
                  <div style={styles.fallbackMapVector}>
                    [กำลังจำลองพิกัดโครงข่ายดิจิทัล {mapMode} VECTOR WIREFRAME ...]
                  </div>
                )}

                <div style={styles.gridOverlayLayer} />

                {/* จุดเรดาร์ยุทธศาสตร์บนแผนที่ */}
                {strategicNodes.map((node) => {
                  const { left, top } = convertGeoToPercent(node.lat, node.lng);
                  return (
                    <div key={node.id} style={{ ...styles.radarTargetPoint, left, top }}>
                      <div style={{ ...styles.radarPulseRing, borderColor: node.color }} />
                      <div style={{ ...styles.radarCoreDot, backgroundColor: node.color }} />
                      <div style={styles.mapTooltip}>{node.label}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* 📊 AREA 2: ช่องแบ่งสี่เหลี่ยมด้านล่าง (LOWER MATRIX CHANNELS) */}
        <section style={styles.bottomMatrixGrid}>
          
          {/* SLOT 1 */}
          <div style={styles.matrixCardComponent}>
            <div style={styles.matrixCardHeader}>
              <span>📊 MATRIX CHANNEL 01</span>
              <input 
                type="text" 
                value={urlSlot1} 
                onChange={(e) => setUrlSlot1(e.target.value)} 
                style={styles.gridUrlMiniInput} 
                placeholder="ใส่ URL เว็บที่ต้องการ..."
              />
            </div>
            <div style={styles.matrixCardBody}>
              <iframe src={urlSlot1} style={styles.liveIframeSandbox} title="Slot 1 Web" />
            </div>
          </div>

          {/* SLOT 2 */}
          <div style={styles.matrixCardComponent}>
            <div style={styles.matrixCardHeader}>
              <span>📈 MATRIX CHANNEL 02</span>
              <input 
                type="text" 
                value={urlSlot2} 
                onChange={(e) => setUrlSlot2(e.target.value)} 
                style={styles.gridUrlMiniInput} 
                placeholder="ใส่ URL เว็บที่ต้องการ..."
              />
            </div>
            <div style={styles.matrixCardBody}>
              <iframe src={urlSlot2} style={styles.liveIframeSandbox} title="Slot 2 Web" />
            </div>
          </div>

          {/* SLOT 3 */}
          <div style={styles.matrixCardComponent}>
            <div style={styles.matrixCardHeader}>
              <span>📡 MATRIX CHANNEL 03</span>
              <input 
                type="text" 
                value={urlSlot3} 
                onChange={(e) => setUrlSlot3(e.target.value)} 
                style={styles.gridUrlMiniInput} 
                placeholder="ใส่ URL เว็บที่ต้องการ..."
              />
            </div>
            <div style={styles.matrixCardBody}>
              <iframe src={urlSlot3} style={styles.liveIframeSandbox} title="Slot 3 Web" />
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

/* 🎨 MATRIX THEATER ENGINE STYLE SHEET */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { backgroundColor: "#000000", color: "#ffffff", fontFamily: "monospace", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" },
  topHeader: { height: "45px", backgroundColor: "#070b14", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px", zIndex: 110 },
  leftNavZone: { display: "flex", gap: "6px" },
  tabButton: { padding: "6px 12px", fontSize: "11px", color: "#64748b", cursor: "pointer", border: "1px solid #1e293b", borderRadius: "3px", backgroundColor: "#020617" },
  tabButtonActive: { padding: "6px 12px", fontSize: "11px", color: "#00ff66", backgroundColor: "rgba(0,255,102,0.1)", border: "1px solid #00ff66", borderRadius: "3px", fontWeight: "bold" },
  centerBrandZone: { display: "flex", alignItems: "center", gap: "8px" },
  mainLogoText: { fontSize: "13px", fontWeight: "bold", letterSpacing: "2px", color: "#ffffff" },
  versionTag: { fontSize: "9px", color: "#475569" },
  livePulseContainer: { display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#020617", padding: "2px 6px", borderRadius: "4px" },
  greenPulseDot: { width: "6px", height: "6px", backgroundColor: "#00ff66", borderRadius: "50%", boxShadow: "0 0 6px #00ff66" },
  liveText: { fontSize: "8px", color: "#00ff66", fontWeight: "bold" },
  rightControlZone: { display: "flex", alignItems: "center", gap: "12px" },
  defconBadge: { color: "#ffaa00", fontSize: "10px", fontWeight: "bold" },
  clockText: { fontSize: "11px", color: "#ffaa00", fontWeight: "bold" },
  
  subHudBar: { height: "35px", backgroundColor: "#020617", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px" },
  subHudLeft: { fontSize: "11px", color: "#94a3b8" },
  subHudRight: { display: "flex", alignItems: "center", gap: "6px" },
  controlLabel: { fontSize: "11px", color: "#475569", marginRight: "4px" },
  toggleViewBtn: { backgroundColor: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b", padding: "3px 10px", fontSize: "10px", cursor: "pointer", borderRadius: "3px" },
  toggleViewBtnActive: { backgroundColor: "#00ff66", color: "#000", border: "1px solid #00ff66", padding: "3px 10px", fontSize: "10px", fontWeight: "bold", cursor: "pointer", borderRadius: "3px" },

  mainWorkspaceLayout: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", padding: "6px", gap: "6px" },
  
  // โครงสร้างแผงบน (Upper Panel)
  topMainMonitor: { flex: 6, backgroundColor: "#040814", border: "1px solid #1e293b", borderRadius: "4px", display: "flex", flexDirection: "column", overflow: "hidden" },
  panelHeaderBar: { height: "32px", backgroundColor: "#090f1e", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 10px", fontSize: "11px", fontWeight: "bold", color: "#94a3b8" },
  urlInputGroup: { display: "flex", alignItems: "center", gap: "6px" },
  panelUrlInput: { backgroundColor: "#020617", border: "1px solid #334155", color: "#00ff66", fontSize: "10px", padding: "2px 8px", borderRadius: "3px", width: "320px", outline: "none" },
  monitorContentWrapper: { flex: 1, position: "relative", overflow: "hidden", backgroundColor: "#000" },
  liveIframeSandbox: { width: "100%", height: "100%", border: "none", backgroundColor: "#fff" },
  
  // สไตล์สำหรับแผงแผนที่ในจอหลัก
  mapBackgroundImg: { width: "100%", height: "100%", objectFit: "cover" },
  nightShadowLayer: { position: "absolute", top: 0, left: 0, width: "200%", height: "100%", pointerEvents: "none", mixBlendMode: "multiply", transition: "transform 0.5s linear", zIndex: 10 },
  nightLightsContainer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.88, zIndex: 12 },
  gridOverlayLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.01) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 15 },
  fallbackMapVector: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#38bdf8", fontSize: "12px", letterSpacing: "1px" },
  radarTargetPoint: { position: "absolute", width: "10px", height: "10px", transform: "translate(-50%, -50%)", zIndex: 25 },
  radarCoreDot: { width: "4px", height: "4px", borderRadius: "50%", position: "absolute", top: "3px", left: "3px" },
  radarPulseRing: { width: "10px", height: "10px", border: "1px solid", borderRadius: "50%", position: "absolute", top: 0, left: 0, animation: "radarGlow 2s infinite linear" },
  mapTooltip: { position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#090f1d", border: "1px solid #1e293b", padding: "2px 6px", borderRadius: "3px", fontSize: "8px", whiteSpace: "nowrap" },

  // โครงสร้างช่องแบ่ง 3 กล่องด้านล่าง (Lower Grid Matrix)
  bottomMatrixGrid: { flex: 4, display: "flex", gap: "6px" },
  matrixCardComponent: { flex: 1, backgroundColor: "#040814", border: "1px solid #1e293b", borderRadius: "4px", display: "flex", flexDirection: "column", overflow: "hidden" },
  matrixCardHeader: { height: "28px", backgroundColor: "#090f1e", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 8px", fontSize: "10px", fontWeight: "bold", color: "#64748b" },
  gridUrlMiniInput: { backgroundColor: "#020617", border: "1px solid #1e293b", color: "#ffaa00", fontSize: "10px", padding: "1px 6px", borderRadius: "3px", width: "160px", outline: "none", textAlign: "right" },
  matrixCardBody: { flex: 1, backgroundColor: "#000", position: "relative" }
};
