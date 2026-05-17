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
  
  // กำหนดช่องสัญญาณแรกเริ่มต้น
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

  // วิธีดึงหน้าเว็บที่ติดระบบความปลอดภัยขั้นสูง (X-Frame-Options) มาสตรีมสดบนหน้าจอแบบ World Monitor ตัวจริง
  const getEmbeddableUrl = (url: string) => {
    if (!url) return "";
    // ใช้บริการ Open Proxy เพื่อดึง HTML โครงสร้างหลักของเว็บเป้าหมายมาสตรีมทะลุกำแพงความปลอดภัย
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
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

      {/* 2. MAIN MAP THEATER (แผนที่โลกแบบไร้รอยต่อเต็มระนาบ ไม่แบ่งสัดส่วนดรอป 70/30) */}
      <section style={styles.mapTheater}>
        <div style={styles.mapContainer}>
          {/* อัปเดตลิงก์รูปภาพแผนที่โลกแนว Matrix Cyber Grid แท้ภาพคมชัด 100% */}
          <img 
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
            alt="Cyber Map Grid" 
            style={styles.mapImage}
          />
          
          <div style={styles.mapGridOverlay}></div>

          {/* ปักหมุดยุทธวิธี */}
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

        {/* แถบข้อมูลข่าวสารสไลด์วิ่ง */}
        <div style={styles.tickerBar}>
          <div style={styles.tickerLabel}>LIVE NEWS FEED</div>
          <div style={styles.tickerTrack}>
            <div style={styles.tickerText}>{newsFeed}</div>
          </div>
        </div>
      </section>

      {/* 3. BOTTOM INFRASTRUCTURE GRID */}
      <section style={styles.bottomGrid}>
        
        {/* แผงซ้าย: จัดการสถานีลิงก์เชื่อมต่อ */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span><span style={styles.accentText}>📌</span> แผงควบคุมช่องสัญญาณตรวจสอบ (Multi-panel)</span>
          </div>
          <div style={styles.panelBody}>
            <form onSubmit={handleAddChannel} style={styles.inputGroup}>
              <input
                type="text"
                placeholder="ใส่ URL เช่น phrae.go.th หรือเว็บข่าวตรวจสอบ"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={styles.textInput}
              />
              <button type="submit" style={styles.submitBtn}>เพิ่มช่อง</button>
            </form>
            
            <div style={styles.channelList}>
              {dataChannels.map((url, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    ...styles.channelItem, 
                    borderColor: activeUrl === url ? "#00ff41" : "#1a1a1a",
                    backgroundColor: activeUrl === url ? "#051a05" : "#000"
                  }}
                  onClick={() => setActiveUrl(url)}
                >
                  <span style={styles.channelIndex}>CH {idx + 1}:</span>
                  <span style={styles.channelUrl}>{url}</span>
                  <span style={{ ...styles.channelStatus, color: activeUrl === url ? "#00ff41" : "#666" }}>
                    {activeUrl === url ? "[MONITORING]" : "[ONLINE]"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* แผงขวา: ดึงข้อมูลหน้าเว็บมาสตรีมแบบ Sandbox */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span><span style={styles.accentText}>⚡</span> LIVE STREAM: {activeUrl}</span>
          </div>
          <div style={styles.panelBody}>
            <div style={styles.iframeWrapper}>
              <iframe
                src={getEmbeddableUrl(activeUrl)}
                title="World Monitor Live Stream Frame"
                style={styles.webPreviewFrame}
                sandbox="allow-scripts allow-same-origin allow-popups"
              />
            </div>

            <div style={styles.metricRow}>
              <div style={styles.metricBox}>
                <div style={styles.metricVal}>DEFCON 1</div>
                <div style={styles.metricSub}>RISK THREAT LEVEL</div>
              </div>
              <div style={styles.metricBox}>
                <div style={{ ...styles.metricVal, color: "#facc15" }}>74%</div>
                <div style={styles.metricSub}>PROCUREMENT STABILITY</div>
              </div>
              <div style={styles.metricBox}>
                <div style={{ ...styles.metricVal, color: "#a855f7" }}>READY</div>
                <div style={styles.metricSub}>LINE LLM FLOWCHART</div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

/* ชุดรูปแบบเลย์เอาต์ยุทธวิธีควบคุมสัดส่วน */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    backgroundColor: "#060606",
    color: "#00ff41",
    fontFamily: "'Orbitron', 'Courier New', sans-serif",
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden"
  },
  header: {
    backgroundColor: "#0c0c0c",
    borderBottom: "2px solid #222",
    height: "60px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 20px",
    zIndex: 10
  },
  brandZone: {
    display: "flex",
    alignItems: "center",
    gap: "10px"
  },
  pulseDot: {
    width: "8px",
    height: "8px",
    backgroundColor: "#ef4444",
    borderRadius: "50%",
    boxShadow: "0 0 8px #ef4444"
  },
  brandTitle: {
    fontWeight: "bold",
    fontSize: "16px",
    letterSpacing: "1px",
    color: "#ffffff"
  },
  editionText: {
    color: "#ef4444",
    fontSize: "11px",
    fontFamily: "monospace"
  },
  centralStatus: {
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  defconBox: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "3px 8px",
    fontSize: "12px",
    fontWeight: "bold",
    borderRadius: "3px"
  },
  statusIndicator: {
    color: "#00ff41",
    fontSize: "13px",
    fontWeight: "bold"
  },
  systemStatus: {
    color: "#888",
    fontSize: "13px",
    letterSpacing: "1px"
  },
  timeZone: {
    textAlign: "right"
  },
  timeLabel: {
    display: "block",
    fontSize: "9px",
    color: "#666",
    fontFamily: "monospace"
  },
  timeText: {
    fontSize: "14px",
    color: "#00ff41",
    fontWeight: "bold",
    fontFamily: "monospace"
  },
  mapTheater: {
    position: "relative",
    width: "100%",
    height: "48vh",
    backgroundColor: "#0d0f14",
    borderBottom: "2px solid #222"
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: "calc(100% - 35px)",
    overflow: "hidden"
  },
  mapImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.35
  },
  mapGridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundImage: "linear-gradient(rgba(0, 255, 65, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.08) 1px, transparent 1px)",
    backgroundSize: "30px 30px",
    pointerEvents: "none"
  },
  pinMarker: {
    position: "absolute",
    width: "16px",
    height: "16px",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    zIndex: 5
  },
  pinRadar: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    position: "absolute",
    top: "2px",
    left: "2px"
  },
  tooltip: {
    position: "absolute",
    bottom: "25px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(5, 5, 5, 0.95)",
    border: "1px solid #00ff41",
    padding: "10px",
    borderRadius: "4px",
    width: "250px",
    zIndex: 20
  },
  tooltipHeader: {
    color: "#fff",
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "5px",
    borderBottom: "1px solid #222",
    fontFamily: "monospace"
  },
  tooltipBody: {
    color: "#00ff41",
    fontSize: "11px",
    lineHeight: "1.4"
  },
  tooltipCoords: {
    color: "#888",
    fontSize: "9px",
    marginTop: "4px",
    fontFamily: "monospace"
  },
  tickerBar: {
    height: "35px",
    backgroundColor: "#050505",
    borderTop: "1px solid #222",
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
  },
  tickerLabel: {
    backgroundColor: "#ef4444",
    color: "#fff",
    padding: "0 12px",
    fontSize: "11px",
    fontWeight: "bold",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexShrink: 0
  },
  tickerTrack: {
    width: "100%",
    overflow: "hidden"
  },
  tickerText: {
    display: "inline-block",
    whiteSpace: "nowrap",
    paddingLeft: "100%",
    fontSize: "13px",
    color: "#00ff41",
    fontFamily: "monospace"
  },
  bottomGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    padding: "20px",
    backgroundColor: "#060606"
  },
  panelCard: {
    backgroundColor: "#0d0d0d",
    border: "1px solid #222",
    borderRadius: "4px",
    display: "flex",
    flexDirection: "column",
    height: "40vh"
  },
  panelHeader: {
    backgroundColor: "#121212",
    padding: "10px 15px",
    borderBottom: "1px solid #222",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#ffffff"
  },
  accentText: {
    marginRight: "5px"
  },
  panelBody: {
    padding: "15px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto"
  },
  inputGroup: {
    display: "flex",
    gap: "10px"
  },
  textInput: {
    flex: 1,
    backgroundColor: "#000",
    border: "1px solid #333",
    borderRadius: "3px",
    padding: "8px 12px",
    color: "#00ff41",
    fontSize: "13px"
  },
  submitBtn: {
    backgroundColor: "#00ff41",
    color: "#000",
    border: "none",
    borderRadius: "3px",
    padding: "0 15px",
    fontSize: "12px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  channelList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px"
  },
  channelItem: {
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#000",
    border: "1px solid #1a1a1a",
    padding: "10px 12px",
    borderRadius: "3px",
    fontSize: "12px",
    cursor: "pointer"
  },
  channelIndex: {
    color: "#666",
    fontWeight: "bold"
  },
  channelUrl: {
    color: "#bbb",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "60%"
  },
  channelStatus: {
    fontFamily: "monospace"
  },
  iframeWrapper: {
    flex: 1,
    backgroundColor: "#111",
    border: "1px solid #222",
    borderRadius: "3px",
    overflow: "hidden",
    minHeight: "160px"
  },
  webPreviewFrame: {
    width: "100%",
    height: "100%",
    border: "none",
    backgroundColor: "#ffffff"
  },
  metricRow: {
    display: "flex",
    gap: "10px",
    marginTop: "5px"
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#000",
    border: "1px solid #222",
    padding: "8px",
    borderRadius: "3px",
    textAlign: "center"
  },
  metricVal: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#ef4444"
  },
  metricSub: {
    fontSize: "8px",
    color: "#666"
  }
};
