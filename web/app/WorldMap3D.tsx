"use client";

import React, { useState, useEffect } from "react";

// 📍 พิกัดยุทธศาสตร์โลก (Lat/Lng สากล)
const strategicNodes = [
  { id: 1, lat: 18.1446, lng: 100.1403, color: "#00ff66", label: "PHRAE HQ (THAILAND)", status: "ACTIVE" },
  { id: 2, lat: 55.7558, lng: 37.6173, color: "#ff3333", label: "MOSCOW OUTPOST", status: "CRITICAL" },
  { id: 3, lat: 40.7128, lng: -74.0060, color: "#00f0ff", label: "NEW YORK NODE", status: "MONITORING" },
  { id: 4, lat: -33.8688, lng: 151.2093, color: "#ffaa00", label: "SYDNEY RADAR", status: "STANDBY" }
];

export default function WorldMapCompleteTheater() {
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
  const [utcHour, setUtcHour] = useState<number>(12);
  const [currentLayer, setCurrentLayer] = useState<string>("GLOBAL");

  // 🕒 1. นาฬิกาตรวจจับเวลาโลกดักจับ Real-time คำนวณม่านเงา
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
      
      {/* ── TOP BLACK HEADER (NAVIGATION BAR) ── */}
      <header style={styles.topHeader}>
        <div style={styles.leftNavZone}>
          <div style={styles.tabButtonActive}>🌐 WORLD</div>
          <div style={styles.tabButton}>📊 ANALYTICS</div>
          <div style={styles.tabButton}>⚡ SATELLITE</div>
          <div style={styles.tabButton}>🛡️ DEFENSE</div>
        </div>
        
        <div style={styles.centerBrandZone}>
          <span style={styles.mainLogoText}>MONITOR</span>
          <span style={styles.versionTag}>v2.8.0 @elisahabib</span>
          <div style={styles.livePulseContainer}>
            <div style={styles.greenPulseDot}></div>
            <span style={styles.liveText}>LIVE</span>
          </div>
          <select style={styles.globalSelect} value={currentLayer} onChange={(e) => setCurrentLayer(e.target.value)}>
            <option value="GLOBAL">Global Theater</option>
            <option value="ASIA">Asia-Pacific Zone</option>
            <option value="AMERICA">AMER Command</option>
          </select>
        </div>

        <div style={styles.rightControlZone}>
          <div style={styles.defconBadge}>🚨 DEFCON 1 / 67%</div>
          <div style={styles.goldPoints}>🪙 22</div>
          <button style={styles.searchButton}>🔍 Search</button>
          <button style={styles.linkButton} onClick={() => window.open('https://worldmonitor.app', '_blank')}>🔗 Link External</button>
          <button style={styles.signInBtn}>Sign In</button>
          <button style={styles.createAccountBtn}>Create account</button>
        </div>
      </header>

      {/* ── SUB-HUD STATUS BAR ── */}
      <div style={styles.subHudBar}>
        <div style={styles.subHudLeft}>● LIVE MONITORING ACTIVE</div>
        <div style={styles.subHudCenter}>GLOBAL SITUATION CONTROL // {currentTimeStr || "SYNCHRONIZING..."}</div>
        <div style={styles.subHudRight}>
          <button style={styles.toggleViewBtnActive}>2D</button>
          <button style={styles.toggleViewBtn}>3D</button>
          <button style={styles.bitMapBadge}>ระดับจอ: 8-BIT MAP</button>
        </div>
      </div>

      {/* ── MAIN WORKSPACE CONTENT (3 SPLIT PANELS) ── */}
      <div style={styles.mainWorkspaceLayout}>
        
        {/* 1. LEFT CONTROL SIDEBAR */}
        <aside style={styles.leftSidebar}>
          <div style={styles.sidebarSectionTitle}>SEARCH LAYERS</div>
          <input type="text" placeholder="Filter operational layers..." style={styles.layerSearchInput} />
          
          <div style={styles.layerListItem}><input type="checkbox" defaultChecked /> 🗺️ IRAN ATTACKS</div>
          <div style={styles.layerListItem}><input type="checkbox" defaultChecked /> 🎯 INTEL HOTSPOTS</div>
          <div style={styles.layerListItem}><input type="checkbox" defaultChecked /> ⚔️ CONFLICT ZONES</div>
          <div style={styles.layerListItem}><input type="checkbox" defaultChecked /> 🏭 MILITARY BASES</div>
          <div style={styles.layerListItem}><input type="checkbox" defaultChecked /> ☢️ NUCLEAR SITES</div>
          <div style={styles.layerListItem}><input type="checkbox" /> 🌪️ WEATHER STORM TECH</div>
          
          <div style={styles.userProfileStick}>
            <div style={styles.avatarCircle}>S</div>
            <div>
              <div style={{fontWeight:"bold", fontSize:"11px"}}>Siriwit Rangap</div>
              <div style={{color:"#00ff66", fontSize:"9px"}}>Commanding Officer</div>
            </div>
          </div>
        </aside>

        {/* 2. CENTER PIECE: THE TACTICAL 8-BIT MAP THEATER */}
        <main style={styles.centerTheater}>
          <div style={styles.mapWrapper}>
            {/* ชั้นฐาน: ภาพกลางวัน */}
            <img src="/map_day.png.png" alt="Tactical Day Base" style={styles.mapBackgroundImg} />

            {/* ชั้นม่านเงา: ย้อมมืดตามเวลาโลกจริง */}
            <div 
              style={{
                ...styles.nightShadowLayer,
                background: `linear-gradient(90deg, 
                  rgba(4, 7, 20, 0.8) 0%, 
                  rgba(4, 7, 20, 0.45) 22%, 
                  rgba(0, 0, 0, 0) 48%, 
                  rgba(0, 0, 0, 0) 52%, 
                  rgba(4, 7, 20, 0.45) 78%, 
                  rgba(4, 7, 20, 0.8) 100%)`,
                transform: `translateX(calc(-50% + ${(shadowOffset + 50) % 100}%))`,
              }}
            />

            {/* ชั้นแผงไฟเมือง: map_night.png ซ้อนทับแบบเรืองแสง */}
            <div style={styles.nightLightsContainer}>
              <img src="/map_night.png" alt="Tactical Night Overlay" style={styles.mapBackgroundImg} />
            </div>

            {/* ตารางเลเซอร์กริด */}
            <div style={styles.gridOverlayLayer} />

            {/* พิกัดเรดาร์กะพริบอัตโนมัติ */}
            {strategicNodes.map((node) => {
              const { left, top } = convertGeoToPercent(node.lat, node.lng);
              const localHour = (utcHour + node.lng / 15 + 24) % 24;
              const isNodeNight = localHour >= 18 || localHour < 6;

              return (
                <div key={node.id} style={{ ...styles.radarTargetPoint, left, top }}>
                  <div style={{ ...styles.radarPulseRing, borderColor: node.color }} />
                  <div style={{ ...styles.radarCoreDot, backgroundColor: node.color, boxShadow: `0 0 10px ${node.color}` }} />
                  
                  {/* กล่อง Tooltip แจ้งสถานะอย่างละเอียด */}
                  <div style={styles.mapTooltip}>
                    <div style={{ color: "#ffaa00", fontWeight: "bold" }}>{node.label}</div>
                    <div style={{ color: isNodeNight ? "#94a3b8" : "#00ff66", fontSize: "9px", marginTop: "2px" }}>
                      STATUS: {isNodeNight ? "🌌 NIGHT OPS [" + node.status + "]" : "☀️ DAYLIGHT [" + node.status + "]"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DRAG & DROP NOTICE PANEL */}
          <div style={styles.dragPanelNotice}>
            DROP PANELS HERE TO MOVE THEM BELOW THE MAP AREA
          </div>
        </main>

        {/* 3. RIGHT SIDEBAR: LIVE BLOOMBERG STREAM */}
        <aside style={styles.rightBloombergSidebar}>
          <div style={styles.sidebarSectionTitle}>
            <span>LIVE NEWS</span> <span style={{color:"#ff3333"}}>● 93 FEEDS</span>
          </div>
          <div style={styles.newsSourceTabs}>
            <div style={styles.newsTabActive}>BLOOMBERG</div>
            <div style={styles.newsTab}>SKYNEWS</div>
            <div style={styles.newsTab}>CNBC</div>
            <div style={styles.newsTab}>ALJAZEERA</div>
          </div>
          
          {/* กรอบหน้าต่างสตรีมวิดีโอข่าวกรองทหาร */}
          <div style={styles.videoStreamContainer}>
            <div style={styles.videoPlaceholder}>
              <div style={styles.videoHeaderOverlay}>Bloomberg Television // Live Stream</div>
              <div style={styles.videoMainTitleText}>Bloomberg <span style={{color:"#ffaa00"}}>This Weekend</span></div>
              <div style={styles.videoFooterStatusBar}>EXTERNAL INTELLIGENCE FEED ACTIVE</div>
            </div>
          </div>
        </aside>

      </div>

      {/* ── BOTTOM MULTI-DATA ANALYTICS FEED ── */}
      <footer style={styles.bottomAnalyticsFooter}>
        <div style={styles.analyticsCard}>
          <div style={styles.cardHeader}>AI INSIGHTS</div>
          <div style={styles.cardBody}>
            <span style={{color:"#ff3333"}}>CRITICAL:</span> Turkey Node reports 6 news events / 43 active signals. Russia instability index remains elevated at 83.
          </div>
        </div>
        <div style={styles.analyticsCard}>
          <div style={styles.cardHeader}>AI STRATEGIC POSTURE</div>
          <div style={styles.cardBody}>
            BLACK SEA: <span style={{color:"#00ff66"}}>NORM</span> | KOREA: <span style={{color:"#00ff66"}}>NORM</span> | SCS TARGETS: <span style={{color:"#ffaa00"}}>WARN</span>
          </div>
        </div>
        <div style={styles.analyticsCard}>
          <div style={styles.cardHeader}>COUNTRY INSTABILITY</div>
          <div style={styles.cardBody}>
            RUSSIA: <span style={{color:"#ff3333"}}>83 ➔</span> | IRAN: <span style={{color:"#ffaa00"}}>63 ➔</span> | THAILAND HQ: <span style={{color:"#00ff66"}}>STABLE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* 🎨 HIGH-TECH COMMAND CENTER STYLES */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: { backgroundColor: "#000000", color: "#ffffff", fontFamily: "monospace", width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", overflowX: "hidden" },
  
  // แถบเมนูด้านบนสุด (Top Navigation Bar)
  topHeader: { height: "45px", backgroundColor: "#0a0f1d", borderBottom: "1px solid #1e293b", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 12px", zIndex: 110 },
  leftNavZone: { display: "flex", gap: "4px" },
  tabButton: { padding: "6px 12px", fontSize: "11px", color: "#94a3b8", cursor: "pointer", border: "1px solid transparent", borderRadius: "3px" },
  tabButtonActive: { padding: "6px 12px", fontSize: "11px", color: "#00ff66", backgroundColor: "rgba(0,255,102,0.1)", border: "1px solid #00ff66", borderRadius: "3px", fontWeight: "bold" },
  centerBrandZone: { display: "flex", alignItems: "center", gap: "8px" },
  mainLogoText: { fontSize: "14px", fontWeight: "bold", letterSpacing: "2px", color: "#ffffff" },
  versionTag: { fontSize: "9px", color: "#475569" },
  livePulseContainer: { display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#020617", padding: "2px 6px", borderRadius: "4px", border: "1px solid #1e293b" },
  greenPulseDot: { width: "6px", height: "6px", backgroundColor: "#00ff66", borderRadius: "50%", boxShadow: "0 0 6px #00ff66" },
  liveText: { fontSize: "9px", color: "#00ff66", fontWeight: "bold" },
  globalSelect: { backgroundColor: "#0f172a", color: "#fff", border: "1px solid #334155", fontSize: "11px", padding: "2px 8px", borderRadius: "4px", outline: "none" },
  rightControlZone: { display: "flex", alignItems: "center", gap: "8px" },
  defconBadge: { backgroundColor: "rgba(255,51,51,0.15)", color: "#ff3333", border: "1px solid #ff3333", fontSize: "10px", fontWeight: "bold", padding: "4px 8px", borderRadius: "3px" },
  goldPoints: { color: "#ffaa00", fontWeight: "bold", fontSize: "11px", backgroundColor: "#1e1b4b", padding: "4px 8px", borderRadius: "3px", border: "1px solid #4338ca" },
  searchButton: { backgroundColor: "#1e293b", color: "#fff", border: "1px solid #334155", padding: "4px 10px", fontSize: "11px", borderRadius: "3px", cursor: "pointer" },
  linkButton: { backgroundColor: "#0369a1", color: "#fff", border: "1px solid #0284c7", padding: "4px 10px", fontSize: "11px", borderRadius: "3px", cursor: "pointer", fontWeight: "bold" },
  signInBtn: { backgroundColor: "#00ff66", color: "#000", border: "none", padding: "4px 10px", fontSize: "11px", fontWeight: "bold", borderRadius: "3px", cursor: "pointer" },
  createAccountBtn: { backgroundColor: "transparent", color: "#94a3b8", border: "1px solid #334155", padding: "4px 10px", fontSize: "11px", borderRadius: "3px", cursor: "pointer" },

  // แถบ HUD บรรทัดที่ 2 (Sub-HUD Operational Bar)
  subHudBar: { height: "35px", backgroundColor: "#020617", borderBottom: "1px solid #0f172a", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 15px" },
  subHudLeft: { fontSize: "11px", color: "#ff3333", fontWeight: "bold" },
  subHudCenter: { fontSize: "11px", color: "#94a3b8", letterSpacing: "0.5px" },
  subHudRight: { display: "flex", alignItems: "center", gap: "4px" },
  toggleViewBtn: { backgroundColor: "#0f172a", color: "#94a3b8", border: "1px solid #1e293b", padding: "2px 8px", fontSize: "10px", cursor: "pointer" },
  toggleViewBtnActive: { backgroundColor: "#00ff66", color: "#000", border: "1px solid #00ff66", padding: "2px 8px", fontSize: "10px", fontWeight: "bold", cursor: "pointer" },
  bitMapBadge: { backgroundColor: "#0284c7", color: "#fff", border: "none", padding: "3px 10px", fontSize: "10px", fontWeight: "bold", borderRadius: "3px", marginLeft: "6px" },

  // โครงสร้างเลย์เอาท์หลัก (Main Partition Workspace)
  mainWorkspaceLayout: { flex: 1, display: "flex", overflow: "hidden" },
  
  // 1. แผงควบคุมเลเยอร์ฝั่งซ้าย (Left Sidebar)
  leftSidebar: { width: "240px", backgroundColor: "#040814", borderRight: "1px solid #0f172a", display: "flex", flexDirection: "column", padding: "12px", position: "relative" },
  sidebarSectionTitle: { fontSize: "11px", fontWeight: "bold", color: "#64748b", letterSpacing: "1px", marginBottom: "8px", display: "flex", justifyContent: "space-between" },
  layerSearchInput: { backgroundColor: "#0f172a", border: "1px solid #1e293b", padding: "6px", fontSize: "11px", color: "#fff", borderRadius: "4px", marginBottom: "12px", outline: "none" },
  layerListItem: { display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#cbd5e1", padding: "6px 4px", borderBottom: "1px solid #0f172a", cursor: "pointer" },
  userProfileStick: { position: "absolute", bottom: "10px", left: "10px", right: "10px", backgroundColor: "#090f1d", border: "1px solid #1e293b", padding: "8px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "10px" },
  avatarCircle: { width: "28px", height: "28px", backgroundColor: "#3b82f6", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" },

  // 2. แผงมอนิเตอร์แผนที่ตรงกลาง (Center Theater Component)
  centerTheater: { flex: 1, backgroundColor: "#000", display: "flex", flexDirection: "column", padding: "8px" },
  mapWrapper: { position: "relative", width: "100%", flex: 1, overflow: "hidden", border: "1px solid #1e293b", borderRadius: "4px" },
  mapBackgroundImg: { width: "100%", height: "100%", objectFit: "cover" },
  nightShadowLayer: { position: "absolute", top: 0, left: 0, width: "200%", height: "100%", pointerEvents: "none", mixBlendMode: "multiply", transition: "transform 0.5s linear", zIndex: 10 },
  nightLightsContainer: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", mixBlendMode: "screen", opacity: 0.88, zIndex: 12 },
  gridOverlayLayer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)", backgroundSize: "24px 24px", pointerEvents: "none", zIndex: 15 },
  dragPanelNotice: { height: "28px", border: "1px dashed #334155", color: "#475569", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "6px", borderRadius: "3px" },

  // จุดพิกัดเป้าหมายและ Tooltip
  radarTargetPoint: { position: "absolute", width: "14px", height: "14px", transform: "
