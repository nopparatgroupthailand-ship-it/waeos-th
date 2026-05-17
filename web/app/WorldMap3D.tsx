"use client";

import React, { useState, useEffect } from "react";

// พิกัดจุดตรวจจับความเสี่ยงพัสดุและฐานยุทธศาสตร์ (ยึดตามตำแหน่งแผนที่โลกเรดาร์)
const monitorPins = [
  { id: 1, name: "THAILAND NODE (PHRAE HQ)", lat: 18.1446, lng: 100.1403, status: "high", type: "TESLA", details: "ระบบตรวจสอบภายใน: LINE Chatbot กำลังประมวลผล Checklist ความเสี่ยงจัดซื้อจัดจ้าง" },
  { id: 2, name: "MOSCOW OUTPOST (SOVIET SECTOR)", lat: 55.7558, lng: 37.6173, status: "high", type: "BASE", details: "TESLA GRID ACTIVE: ตรวจพบดัชนีความเสี่ยงงบประมาณแผ่นดินระดับสูง" },
  { id: 3, name: "IRAN THEATER (CRITICAL ZONE)", lat: 32.4279, lng: 53.6880, status: "high", type: "RADAR", details: "DEFCON 1: ตรวจพบการซิงค์ข้อมูลจัดซื้อจัดจ้างข้ามเครือข่ายผิดปกติ" },
  { id: 4, name: "SOUTH CHINA SEA NODE", lat: 10.0000, lng: 114.0000, status: "medium", type: "SHIP", details: "LOGISTICS ALERT: ระบบคลาวด์ตรวจสแกนเส้นทางขนส่งพัสดุภาครัฐ" },
  { id: 5, name: "NORTH AMERICA SYNC (VERCEL)", lat: 38.9072, lng: -77.0369, status: "low", details: "SYSTEM ONLINE: เซิร์ฟเวอร์หลักเสร็จสิ้นการบิวด์ระบบ Situation Room v2.8.0" }
];

export default function WorldMonitor2D() {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [hoveredPin, setHoveredPin] = useState<any>(null);
  const [activeChannel, setActiveChannel] = useState<number>(0);
  const [inputUrl, setInputUrl] = useState<string>("");
  
  // รายการช่องสัญญาณสำหรับตรวจสอบข้อมูลพัสดุและข่าวสาร
  const [dataChannels, setDataChannels] = useState([
    { title: "ระบบจัดซื้อจัดจ้างภาครัฐ (gprocurement)", url: "https://www.gprocurement.go.th/new_index.html", status: "READY", desc: "ฐานข้อมูลดิบ e-GP กรมบัญชีกลาง สำหรับดึงเลขโครงการ" },
    { title: "กรมบัญชีกลาง (CGD Portal)", url: "https://www.cgd.go.th", status: "CONNECTED", desc: "ช่องทางตรวจสอบระเบียบการเบิกจ่ายและสิทธิประโยชน์" },
    { title: "สำนักงานจังหวัดแพร่ (Phrae Governance)", url: "https://phrae.go.th", status: "MONITORING", desc: "เครือข่ายหลักสำหรับดึงข้อมูลโครงการตรวจสอบภายในระดับจังหวัด" }
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

  // แปลงพิกัดภูมิศาสตร์ให้อยู่บนผืนแผนที่แบบ 2D จำลองเกมยุทธวิธี
  const convertCoords = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((90 - lat) / 180) * 100;
    return { left: `${x}%`, top: `${y}%` };
  };

  const handleAddChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      const formattedUrl = inputUrl.trim().startsWith("http") ? inputUrl.trim() : `https://${inputUrl.trim()}`;
      setDataChannels([...dataChannels, {
        title: `ช่องสัญญาณภายนอกกำหนดเอง (${dataChannels.length + 1})`,
        url: formattedUrl,
        status: "ACTIVE",
        desc: "ช่องสัญญาณสตรีมข้อมูลดิบผ่านระบบ Proxy Bypass"
      }]);
      setActiveChannel(dataChannels.length);
      setInputUrl("");
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      {/* HEADER CONTROL BAR (ธีมกองบัญชาการ) */}
      <header style={styles.header}>
        <div style={styles.brandZone}>
          <div style={styles.pulseDot}></div>
          <span style={styles.brandTitle}>SITUATION ROOM <span style={styles.editionText}>8-BIT THEATER v2.8.0</span></span>
        </div>
        <div style={styles.centralStatus}>
          <span style={styles.defconBox}>DEFCON 1</span>
          <span style={styles.statusIndicator}>● INTRUDER ALERT</span>
          <span style={styles.systemStatus}>SOVIET RADAR ENGAGED</span>
        </div>
        <div style={styles.timeZone}>
          <span style={styles.timeLabel}>SYSTEM TIME (UTC)</span>
          <span style={styles.timeText}>{currentTime || "00:00:00 UTC"}</span>
        </div>
      </header>

      {/* 8-BIT TACTICAL MAP THEATER (แผนที่สมรภูมิยุทธวิธีสไตล์เกม Red Alert) */}
      <section style={styles.mapTheater}>
        <div style={styles.mapContainer}>
          {/* ลายเส้น Grid ตารางแบบเกมวางแผนทางทหารย้อนยุค */}
          <div style={styles.tacticalGridPattern}></div>
          
          {/* จำลองรูปทวีปสไตล์พิกเซลเกม 8-Bit (วาดด้วยเส้นขอบเรดาร์แสงนีออน) */}
          <svg style={styles.worldVectorOverlay} viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* อเมริกาเหนือ/ใต้ */}
            <path d="M 10,20 Q 20,15 25,25 T 30,45 Q 25,55 32,75 T 35,90 Q 25,75 22,50 T 12,35 Z" fill="none" stroke="#1d3557" strokeWidth="0.6" strokeDasharray="1,1" />
            {/* ยูเรเชีย / แอฟริกา */}
            <path d="M 45,25 Q 55,20 70,18 T 88,25 Q 90,45 80,55 T 75,75 Q 65,85 55,70 T 48,45 Z" fill="none" stroke="#1d3557" strokeWidth="0.6" strokeDasharray="1,1" />
            {/* ออสเตรเลีย */}
            <path d="M 78,70 Q 85,68 88,75 T 80,85 Z" fill="none" stroke="#1d3557" strokeWidth="0.6" strokeDasharray="1,1" />
          </svg>

          {/* เส้นเลเซอร์เรดาร์สแกนผ่านหน้าจอ */}
          <div style={styles.radarScanLine}></div>

          {/* การเรนเดอร์หมุดพิกัดสัญญาณวิทยุ (Radar Pulse) */}
          {monitorPins.map((pin) => {
            const { left, top } = convertCoords(pin.lat, pin.lng);
            const isHigh = pin.status === "high";
            const markerColor = isHigh ? "#ff3333" : "#00ffcc";
            
            return (
              <div
                key={pin.id}
                style={{ ...styles.pinMarker, left, top }}
                onMouseEnter={() => setHoveredPin(pin)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                {/* วงแหวนสะท้อนคลื่นวิทยุว่อนขยายตัว (Red Alert Style) */}
                <div style={{ ...styles.pinRadarPulse, borderColor: markerColor, boxShadow: `0 0 8px ${markerColor}` }} />
                <div style={{ ...styles.pinCore, backgroundColor: markerColor }} />
                
                {hoveredPin?.id === pin.id && (
                  <div style={{ ...styles.tooltip, borderColor: markerColor }}>
                    <div style={styles.tooltipHeader}>
                      <span style={{ color: markerColor }}>[🚨 {pin.type}]</span> {pin.name}
                    </div>
                    <div style={styles.tooltipBody}>{pin.details}</div>
                    <div style={styles.tooltipCoords}>LAT: {pin.lat.toFixed(4)} / LNG: {pin.lng.toFixed(4)}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* แถบวิ่งข้อมูล Feed อัปเดตด้านล่างแผนที่ */}
        <div style={styles.tickerBar}>
          <div style={styles.tickerLabel}>RED ALERT FEED</div>
          <div style={styles.tickerTrack}>
            <div style={styles.tickerText}>
              [SYSTEM WARNING] : TESLA GRID HIGHLY ACTIVE ... DETECTING LOCAL PHRAE PROCUREMENT DATA ... OVERRIDING CORS RESTRICTIONS VIA EMULATED DATA STREAM ... LLM PARSING ENGINE IS READY TO GENERATE CHECKLISTS ...
            </div>
          </div>
        </div>
      </section>

      {/* LOWER ARCHITECTURE: แบ่งส่วน 70:30 ตามโครงสร้างระบบตรวจสอบยุทธวิธี */}
      <section style={styles.bottomGrid}>
        
        {/* แผงควบคุมฝั่งซ้าย (ช่องสัญญาณ) */}
        <div style={styles.panelCardLeft}>
          <div style={styles.panelHeader}>
            <span>🛠️ แผงควบคุมช่องสัญญาณตรวจสอบ (Multi-panel)</span>
          </div>
          <div style={styles.panelBody}>
            <form onSubmit={handleAddChannel} style={styles.inputGroup}>
              <input
                type="text"
                placeholder="วาง URL หรือ API ไทย เช่น https://data.go.th"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                style={styles.textInput}
              />
              <button type="submit" style={styles.submitBtn}>เพิ่มช่อง</button>
            </form>
            
            <div style={styles.channelList}>
              {dataChannels.map((ch, idx) => {
                const isActive = activeChannel === idx;
                return (
                  <div 
                    key={idx} 
                    style={{ 
                      ...styles.channelItem, 
                      borderColor: isActive ? "#ff3333" : "#222",
                      backgroundColor: isActive ? "#1a0505" : "#0d0d0d"
                    }}
                    onClick={() => setActiveChannel(idx)}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={styles.channelIndex}>CH {idx + 1}: {ch.title}</span>
                      <span style={styles.channelUrlText}>{ch.url}</span>
                    </div>
                    <span style={{ ...styles.channelStatus, color: isActive ? "#ff3333" : "#666" }}>
                      [{ch.status}]
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* แผงจำลองการรับส่งข้อมูลฝั่งขวา (แก้ไขปัญหา 404 และการโดนบล็อกเฟรม) */}
        <div style={styles.panelCardRight}>
          <div style={styles.panelHeader}>
            <span>⚡ LIVE MONITOR INTERFACE: {dataChannels[activeChannel].title}</span>
          </div>
          <div style={styles.panelBody}>
            
            {/* หน้าต่างจำลอง Secure Data Monitor แทนการยัด iframe ดิบที่โดนบล็อก */}
            <div style={styles.secureDisplayBox}>
              <div style={styles.secureHeader}>
                <span style={styles.secureDot}>●</span> SECURITY BYPASS ACTIVE
              </div>
              <div style={styles.secureContent}>
                <h3 style={styles.secureTitle}>{dataChannels[activeChannel].title}</h3>
                <p style={styles.secureDesc}>{dataChannels[activeChannel].desc}</p>
                
                <div style={styles.alertTerminalBox}>
                  <div>[STATUS] เครือข่ายปลายทางจำกัดสิทธิ์การฝังเฟรมภายในแอปพลิเคชัน</div>
                  <div>[ACTION] เปิดลิงก์ตรงผ่านโครงข่ายควบคุมระยะไกลเพื่อความเสถียร 100%</div>
                </div>

                <a 
                  href={dataChannels[activeChannel].url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={styles.launchButton}
                >
                  🚀 เข้าสู่เว็บไซต์ระบบหลัก (Direct Access)
                </a>
              </div>
            </div>

            {/* ส่วนแสดงดัชนีวัดผลเสนาธิการด้านล่าง */}
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
                <div style={styles.metricSub}>TINY LLM FLOWCHART</div>
              </div>
            </div>

          </div>
        </div>

      </section>
    </div>
  );
}

/* สไตล์การตกแต่งสถาปัตยกรรมห้องยุทธการสไตล์เกมกองทัพย้อนยุค */
const styles: { [key: string]: React.CSSProperties } = {
  dashboardContainer: {
    backgroundColor: "#020202",
    color: "#ff3333",
    fontFamily: "'Courier New', Courier, monospace",
    width: "100vw",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden"
  },
  header: {
    backgroundColor: "#0a0a0a",
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
    boxShadow: "0 0 10px #ff3333"
  },
  brandTitle: {
    fontWeight: "bold",
    fontSize: "14px",
    letterSpacing: "1px",
    color: "#ffffff"
  },
  editionText: {
    color: "#ffaa00",
    fontSize: "10px",
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
    padding: "2px 6px",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "2px"
  },
  statusIndicator: {
    color: "#ffaa00",
    fontSize: "11px",
    fontWeight: "bold"
  },
  systemStatus: {
    color: "#555",
    fontSize: "11px"
  },
  timeZone: {
    textAlign: "right"
  },
  timeLabel: {
    display: "block",
    fontSize: "8px",
    color: "#444"
  },
  timeText: {
    fontSize: "12px",
    color: "#ffaa00",
    fontWeight: "bold"
  },
  mapTheater: {
    position: "relative",
    width: "100%",
    height: "45vh",
    backgroundColor: "#04080f",
    borderBottom: "2px solid #222",
    overflow: "hidden"
  },
  mapContainer: {
    position: "relative",
    width: "100%",
    height: "calc(100% - 30px)",
    backgroundColor: "#050912"
  },
  tacticalGridPattern: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0.1,
    backgroundImage: `
      linear-gradient(rgba(255, 51, 51, 0.2) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 51, 51, 0.2) 1px, transparent 1px)
    `,
    backgroundSize: "30px 30px"
  },
  worldVectorOverlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    opacity: 0.45
  },
  radarScanLine: {
    position: "absolute",
    width: "100%",
    height: "2px",
    backgroundColor: "rgba(255, 51, 51, 0.3)",
    boxShadow: "0 0 10px #ff3333",
    top: "30%",
    left: 0,
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
  pinCore: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    position: "absolute",
    top: "5px",
    left: "5px"
  },
  pinRadarPulse: {
    width: "16px",
    height: "16px",
    border: "1px solid",
    borderRadius: "50%",
    position: "absolute",
    top: 0,
    left: 0
  },
  tooltip: {
    position: "absolute",
    bottom: "24px",
    left: "50%",
    transform: "translateX(-50%)",
    backgroundColor: "rgba(5, 5, 5, 0.95)",
    border: "1px solid",
    padding: "8px",
    borderRadius: "2px",
    width: "230px",
    zIndex: 20
  },
  tooltipHeader: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: "bold",
    marginBottom: "4px",
    borderBottom: "1px solid #222",
    paddingBottom: "2px"
  },
  tooltipBody: {
    color: "#cccccc",
    fontSize: "10px",
    lineHeight: "1.4"
  },
  tooltipCoords: {
    color: "#444",
    fontSize: "8px",
    marginTop: "4px"
  },
  tickerBar: {
    height: "30px",
    backgroundColor: "#000",
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
    alignItems: "center"
  },
  tickerTrack: {
    width: "100%",
    overflow: "hidden"
  },
  tickerText: {
    whiteSpace: "nowrap",
    fontSize: "11px",
    color: "#ffaa00"
  },
  bottomGrid: {
    flex: 1,
    display: "grid",
    gridTemplateColumns: "35% 65%",
    gap: "15px",
    padding: "15px",
    backgroundColor: "#030303"
  },
  panelCardLeft: {
    backgroundColor: "#080808",
    border: "1px solid #222",
    borderRadius: "2px",
    display: "flex",
    flexDirection: "column",
    height: "43vh"
  },
  panelCardRight: {
    backgroundColor: "#080808",
    border: "1px solid #222",
    borderRadius: "2px",
    display: "flex",
    flexDirection: "column",
    height: "43vh"
  },
  panelHeader: {
    backgroundColor: "#0f0f0f",
    padding: "8px 12px",
    borderBottom: "1px solid #222",
    fontSize: "11px",
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
    border: "1px solid #222",
    borderRadius: "2px",
    padding: "6px 10px",
    color: "#ff3333",
    fontSize: "11px"
  },
  submitBtn: {
    backgroundColor: "#ff3333",
    color: "#fff",
    border: "none",
    borderRadius: "2px",
    padding: "0 12px",
    fontSize: "11px",
    fontWeight: "bold",
    cursor: "pointer"
  },
  channelList: {
    display: "flex",
    flexDirection: "column",
    gap: "6px"
  },
  channelItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid",
    padding: "8px 10px",
    borderRadius: "2px",
    fontSize: "11px",
    cursor: "pointer"
  },
  channelIndex: {
    color: "#ffffff",
    fontWeight: "bold"
  },
  channelUrlText: {
    color: "#666",
    fontSize: "9px"
  },
  channelStatus: {
    fontSize: "9px",
    fontWeight: "bold"
  },
  secureDisplayBox: {
    flex: 1,
    backgroundColor: "#000000",
    border: "1px solid #222",
    borderRadius: "2px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center"
  },
  secureHeader: {
    color: "#ffaa00",
    fontSize: "10px",
    fontWeight: "bold",
    letterSpacing: "1px",
    marginBottom: "10px"
  },
  secureDot: {
    animation: "pulse 1s infinite",
    marginRight: "4px"
  },
  secureTitle: {
    color: "#ffffff",
    fontSize: "14px",
    margin: "0 0 5px 0"
  },
  secureDesc: {
    color: "#888",
    fontSize: "11px",
    margin: "0 0 15px 0",
    maxWidth: "80%"
  },
  alertTerminalBox: {
    backgroundColor: "#080000",
    border: "1px dashed #ff3333",
    padding: "8px 12px",
    fontSize: "10px",
    color: "#ff8888",
    textAlign: "left",
    marginBottom: "15px",
    lineHeight: "1.5"
  },
  launchButton: {
    backgroundColor: "#ff3333",
    color: "#ffffff",
    textDecoration: "none",
    padding: "8px 16px",
    fontSize: "11px",
    fontWeight: "bold",
    borderRadius: "2px",
    boxShadow: "0 0 10px rgba(255,51,51,0.3)"
  },
  metricRow: {
    display: "flex",
    gap: "8px",
    marginTop: "auto"
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
    fontSize: "13px",
    fontWeight: "bold",
    color: "#ff3333"
  },
  metricSub: {
    fontSize: "8px",
    color: "#444"
  }
};
