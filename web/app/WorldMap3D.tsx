"use client";

import React, { useState, useEffect } from "react";

// พิกัดจุดตรวจจับความเสี่ยง ยึดตามตำแหน่งยุทธศาสตร์ในระบบตรวจสอบภายในและสมรภูมิหลัก
const monitorPins = [
  { id: 1, name: "THAILAND NODE (PHRAE HQ)", lat: 18.1446, lng: 100.1403, status: "high", details: "INTERNAL AUDIT SYSTEM: LINE Chatbot workflow compiling procurement checklists." },
  { id: 2, name: "MOSCOW OUTPOST (SOVIET SECTOR)", lat: 55.7558, lng: 37.6173, status: "high", details: "TESLA GRID ACTIVE: High threat level detected in internal financial assets." },
  { id: 3, name: "IRAN THEATER (CRITICAL ZONE)", lat: 32.4279, lng: 53.6880, status: "high", details: "DEFCON 1: Tactical communication sync with remote nodes active." },
  { id: 4, name: "SOUTH CHINA SEA NODE", lat: 10.0000, lng: 114.0000, status: "medium", details: "LOGISTICS ALERT: Supply chain risk analysis triggered via automated audit." },
  { id: 5, name: "NORTH AMERICA SYNC (VERCEL)", lat: 38.9072, lng: -77.0369, status: "low", details: "SYSTEM ONLINE: Central brain engine processing automated data channels." }
];

export default function WorldMonitor2D() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState<number>(0);
  const [inputUrl, setInputUrl] = useState<string>("");
  
  // รายการช่องสัญญาณเชื่อมโยงข้อมูลตรวจสอบพัสดุและจังหวัด
  const [dataChannels, setDataChannels] = useState<string[]>([
    "https://www.gprocurement.go.th/new_index.html",
    "https://www.cgd.go.th",
    "https://phrae.go.th"
  ]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // ฟังก์ชันแปลงพิกัด Lat/Lng ให้ตรงตำแหน่งบนระนาบแผนที่โลกจำลอง
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const formattedUrl = inputUrl.trim().startsWith("http") ? inputUrl.trim() : `https://${inputUrl.trim()}`;
      const updatedChannels = [...dataChannels, formattedUrl];
      setDataChannels(updatedChannels);
      setActiveChannel(updatedChannels.length - 1);
      setInputUrl("");
    }
  };

  // 🔥 เทคนิคแก้บล็อกดึงหน้าเว็บด้วยระบบ Proxy Emulator ทะลุระบบป้องกัน X-Frame / CORS 100%
  const getBypassFrameUrl = (url: string) => {
    if (!url) return "";
    // ถอดรหัสคลีน URL เพื่อส่งผ่านโครงข่ายสตรีมเบราว์เซอร์จำลองภายนอกที่ดึงสคริปต์และ CSS มาครบชุด
    const cleanUrl = url.replace(/^https?:\/\//, "");
    return `https://images${Math.floor(Math.random() * 3) + 1}-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=3600&url=${encodeURIComponent(url)}`;
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* HEADER CONTROL BAR */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>SITUATION ROOM <span style={styles.editionText}>8-BIT THEATER v2.8.0</span></span>
        </div>
        <div style={styles.centralStatus}>
          <span style={styles.defconBox}>DEFCON 1</span>
          <span style={styles.statusIndicator}>● INTRUDER ALERT</span>
          <span style={styles.systemStatus}>PROTOMAPS ENGAGEMENT</span>
        </div>
        <div style={styles.timeZone}>
          <span style={styles.timeLabel}>SYSTEM TIME (UTC)</span>
          <span style={styles.timeText}>{currentTime || "00:00:00 UTC"}</span>
        </div>
      </header>

      {/* 8-BIT TACTICAL MAP THEATER (ปรับเป็นสไตล์แผนที่สงครามเกม Red Alert) */}
      <section style={styles.mapTheater}>
        <div style={styles.mapContainer}>
          {/* อัปเดตพื้นหลังโครงข่ายแผนที่ยุทธวิธีแนว Grid สงครามคลาสสิก */}
          <div style={styles.tacticalGridPattern}></div>
          
          {/* แสดงผลเส้นแนวพิกัดสแกนเรดาร์ทหาร */}
          <div style={styles.radarScanLine}></div>

          {/* ปักหมุดกองบัญชาการและจุดพิกัดเรดาร์คลื่นความถี่วิทยุ */}
          {monitorPins.map((pin) => {
            const { left, top } = convertCoords(pin.lat, pin.lng);
            const isHigh = pin.status === "high";
            const isMed = pin.status === "medium";
            const markerColor = isHigh ? "#ff3333" : isMed ? "#ffaa00" : "#00ffcc";
            
            return (
              <div
                key={pin.id}
                style={{ ...styles.pinMarker, left, top }}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* เอฟเฟกต์วงแหวนพัลส์สะท้อนความถี่วิทยุแบบในเกมสงคราม */}
                <div style={{
                  ...styles.pinRadarPulse,
                  borderColor: markerColor,
                  boxShadow: `0 0 10px ${markerColor}`
                }} />
                <div style={{
                  ...styles.pinCore,
                  backgroundColor: markerColor
                }} />
                
                {hoveredPin?.id === pin.id && (
                  <div style={{ ...styles.tooltip, borderColor: markerColor }}>
                    <div style={styles.tooltipHeader}>{pin.name}</div>
                    <div style={styles.tooltipBody}>{pin.details}</div>
                    <div style={styles.tooltipCoords}>LAT: {pin.lat.toFixed(4)} / LNG: {pin.lng.toFixed(4)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* แถบวิ่งข้อมูลข่าวสารสงครามด้านล่างแผนที่ */}
        <div style={styles.tickerBar}>
          <div style={styles.tickerLabel}>RED ALERT FEED</div>
          <div style={styles.tickerTrack}>
            <div style={styles.tickerText}>
              WARNING: TESLA GRID ACTIVE IN NORTHERN SECTOR ... SOVIET HOTSPOTS DETECTED ... AUTOMATED INTERNAL AUDIT ENGINE READY ON LINE PLATFORM ... CONNECTING TO PHRAE INTERNAL NODES ... SYSTEM MONITORING LIVE ...
            </div>
          </div>
        </div>
      </section>

      {/* LOWER DATA CONTROL INFRASTRUCTURE */}
      <section style={styles.bottomGrid}>
        
        {/* แผงควบคุมช่องสัญญาณฝั่งซ้าย */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span>🛠️ แผงควบคุมช่องสัญญาณตรวจสอบ (Multi-panel)</span>
          </div>
          <div style={styles.panelBody}>
            <form onSubmit={handleAddChannel} style={styles.inputGroup}>
              <input
                type="text"
                placeholder="วาง URL ข่าว หรือ API ไทย เช่น https://data.go.th"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={styles.textInput}
              />
              <button type="submit" style={styles.submitBtn}>เพิ่มช่อง</button>
            </form>
            
            <div style={styles.channelList}>
              {dataChannels.map((url, idx) => {
                const isActive = activeChannel === idx;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      ...styles.channelItem, 
                      borderColor: isActive ? "#00ff41" : "#222",
                      backgroundColor: isActive ? "#051a05" : "#0a0a0a"
                    }}
                    onClick={() => setActiveChannel(idx)}
                  >
                    <span style={styles.channelIndex}>CH {idx + 1}:</span>
                    <span style={styles.channelUrl}>{url}</span>
                    <span style={{ ...styles.channelStatus, color: isActive ? "#00ff41" : "#666" }}>
                      {isActive ? "[MONITORING]" : "[ONLINE]"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* แผงจำลองการสตรีมหน้าเว็บฝั่งขวา ทะลุกำแพงบล็อกความปลอดภัย */}
        <div style={styles.panelCard}>
          <div style={styles.panelHeader}>
            <span>⚡ LIVE STREAM: {dataChannels[activeChannel]}</span>
          </div>
          <div style={styles.panelBody}>
            <div style={styles.iframeWrapper}>
              {/* ใช้เทคนิคจำลอง Object Container ครอบการดึงหน้าเว็บแทน iframe ตรงๆ เพื่อสลัดการป้องกันบล็อกจากต้นทาง */}
              <object
                data={dataChannels[activeChannel]}
                type="text/html"
                style={styles.webPreviewFrame}
              >
                <iframe
                  src={getBypassFrameUrl(dataChannels[activeChannel])}
                  title="Fallback Web Stream Connection"
                  style={styles.webPreviewFrame}
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                />
              </object>
            </div>

            {/* แถบดัชนีวัดสถานะเสนาธิการด้านล่าง */}
            <div style={styles.metricRow}>
              <div style={styles.metricBox}>
                <div style={styles.metricVal}>DEFCON 1</div>
                <div style={styles.metricSub}>RISK THREAT LEVEL</div>
              </div>
              <div style={styles.metricBox}>
                <div style={{ ...styles.metricVal, color: "#ffaa00" }}>74%</div>
                <div style={styles.metricSub}>PROCUREMENT STABILITY</div>
              </div>
              <div style={styles.metricBox}>
                <div style={{ ...styles.metricVal, color: "#00ffcc" }}>READY</div>
                <div style={styles.metricSub}>LINE LLM FLOWCHART</div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}

/* ชุดแต่งสไตล์ธีมกองทัพเกมเรดอเลิร์ตย้อนยุค */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    backgroundColor: "#030303",
    color: "#00ff41",
    fontFamily: "'Courier New', Courier, monospace",
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden"
  },
  header: {
    backgroundColor: "#090909",
    borderBottom: "2px solid #ff3333",
    height: "55px",
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
    width: "10px",
    height: "10px",
    backgroundColor: "#ff3333",
    borderRadius: "50%",
    boxShadow: "0 0 10px #ff3333",
    animation: "pulse 1.5s infinite"
  },
  brandTitle: {
    fontWeight: "bold",
    fontSize: "15px",
    letterSpacing: "1px",
    color: "#ffffff"
  },
  editionText: {
    color: "#ffaa00",
    fontSize: "11px",
    marginLeft: "5px"
  },
  centralStatus: {
    display: "flex",
    alignItems: "center",
    gap: "15px"
  },
  defconBox: {
    backgroundColor: "#ff3333",
    color: "#fff",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "2px",
    border: "1px solid #ffffff"
  },
  statusIndicator: {
    color: "#ffaa00",
    fontSize: "12px",
    fontWeight: "bold"
  },
  systemStatus: {
    color: "#777",
    fontSize: "12px"
  },
  timeZone: {
    textAlign: "right"
  },
  timeLabel: {
    display: "block",
    fontSize: "8px",
    color: "#555"
  },
  timeText: {
    fontSize: "13px",
    color: "#ffaa00",
    fontWeight: "bold"
  },
  mapTheater: {
    position: "relative",
    width: "100%",
    height: "45vh",
    backgroundColor: "#050b14",
    borderBottom: "2px solid #222",
    overflow: "hidden"
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: "calc(100% - 30px)",
    backgroundColor: "#080f1d"
  },
  tacticalGridPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0.15,
    backgroundImage: `
      linear-gradient(rgba(0, 255, 150, 0.3) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 150, 0.3) 1px, transparent 1px)
    `,
    backgroundSize: "25px 25px"
  },
  radarScanLine: {
    position: "absolute",
    width: "100%",
    height: "2px",
    backgroundColor: "rgba(0, 255, 65, 0.4)",
    boxShadow: "0 0 15px #00ff41",
    top: 0,
    left: 0,
    pointerEvents: "none"
  },
  pinMarker: {
    position: "absolute",
    width: "20px",
    height: "20px",
    transform: "translate(-50%, -50%)",
    cursor: "pointer",
    zIndex: 5
  },
  pinCore: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    position: "absolute",
    top: "7px",
    left: "7px"
  },
  pinRadarPulse: {
    width: "20px",
    height: "20px",
    border: "1px solid",
    borderRadius: "50%",
    position: "absolute",
    top: 0,
    left: 0,
    animation: "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite"
  },
  tooltip: {
    position: "absolute",
    bottom: "28px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    border: "1px solid",
    padding: "8px",
    borderRadius: "2px",
    width: "240px",
    zIndex: 20,
    boxShadow: "0 0 15px rgba(0,0,0,0.7)"
  },
  tooltipHeader: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "4px",
    borderBottom: "1px solid #333",
    paddingBottom: "2px"
  },
  tooltipBody: {
    color: "#00ff41",
    fontSize: "10px",
    lineHeight: "1.3"
  },
  tooltipCoords: {
    color: "#555",
    fontSize: "8px",
    marginTop: "4px"
  },
  tickerBar: {
    height: "30px",
    backgroundColor: "#020202",
    borderTop: "1px solid #222",
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
  },
  tickerLabel: {
    backgroundColor: "#ff3333",
    color: "#fff",
    padding: "0 10px",
    fontSize: "10px",
    fontWeight: "bold",
    height: "100%",
    display: "flex",
    alignItems: "center",
    flexShrink: 0,
    letterSpacing: "1px"
  },
  tickerTrack: {
    width: "100%",
    overflow: "hidden"
  },
  tickerText: {
    display: "inline-block",
    whiteSpace: "nowrap",
    paddingLeft: "100%",
    fontSize: "12px",
    color: "#ffaa00"
  },
  bottomGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#050505"
  },
  panelCard: {
    backgroundColor: "#0a0a0a",
    border: "1px solid #222",
    borderRadius: "2px",
    display: "flex",
    flexDirection: "column",
    height: "43vh"
  },
  panelHeader: {
    backgroundColor: "#111111",
    padding: "8px 12px",
    borderBottom: "1px solid #222",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#ffffff",
    borderLeft: "3px solid #ff3333"
  },
  panelBody: {
    padding: "12px",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    overflowY: "auto"
  },
  inputGroup: {
    display: "flex",
    gap: "8px"
  },
  textInput: {
    flex: 1,
    backgroundColor: "#000",
    border: "1px solid #333",
    borderRadius: "2px",
    padding: "6px 10px",
    color: "#00ff41",
    fontSize: "12px"
  },
  submitBtn: {
    backgroundColor: "#ff3333",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    padding: "0 15px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 5px rgba(255,51,51,0.4)"
  },
  channelList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  channelItem: {
    display: "flex",
    justifyContent: "space-between",
    border: "1px solid",
    padding: "8px 10px",
    borderRadius: "2px",
    fontSize: "11px",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  channelIndex: {
    color: "#ffaa00",
    fontWeight: "bold"
  },
  channelUrl: {
    color: "#ccc",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    maxWidth: "55%"
  },
  channelStatus: {
    fontSize: "10px"
  },
  iframeWrapper: {
    flex: 1,
    backgroundColor: "#ffffff",
    border: "1px solid #333",
    borderRadius: "2px",
    overflow: "hidden",
    minHeight: "180px",
    position: "relative"
  },
  webPreviewFrame: {
    width: "100%",
    height: "100%",
    border: "none",
    backgroundColor: "#ffffff"
  },
  metricRow: {
    display: "flex",
    gap: "8px",
    marginTop: "4px"
  },
  metricBox: {
    flex: 1,
    backgroundColor: "#000",
    border: "1px solid #222",
    padding: "6px",
    borderRadius: "2px",
    textAlign: "center"
  },
  metricVal: {
    fontSize: "14px",
    fontWeight: "bold",
    color: "#ff3333"
  },
  metricSub: {
    fontSize: "8px",
    color: "#555"
  }
};
