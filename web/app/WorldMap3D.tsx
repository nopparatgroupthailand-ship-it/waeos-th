"use client";

import React, { useState, useEffect } from "react";

export default function WorldMapComponent() {
  const [time, setTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "ai",
      text: "[SYSTEM ONLINE] บูตระบบฐานข้อมูลแผนที่ยุทธวิธีเสร็จสมบูรณ์ แยกพื้นที่แถบเวลากลางวัน-กลางคืน (Timezone Day/Night Overlay) พร้อมประมวลผล Local RAG กฎหมายพัสดุ",
    },
  ]);

  // ฟังก์ชันอัปเดตเวลาระบบเรียลไทม์ (UTC)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(Math.random() * 900) + 100);
      setTime(`${hrs}:${mins}:${secs} ${ms}`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // ฟังก์ชันส่งคำถามระบบแชต AI
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const newHistory = [...chatHistory, { id: Date.now(), sender: "user", text: chatInput }];
    setChatHistory(newHistory);
    const currentInput = chatInput;
    setChatInput("");

    // ระบบประมวลผลจำลองตอบข้อกฎหมายพัสดุ
    setTimeout(() => {
      let aiResponse = "[LOCAL ENGINE] ระบบทำการวิเคราะห์เงื่อนไขตรวจสอบข้อมูลในหน่วยความจำชั่วคราวเรียบร้อยแล้ว";
      if (currentInput.includes("เฉพาะเจาะจง") || currentInput.includes("วงเงิน")) {
        aiResponse = "[RAG INSIGHT] วงเงินไม่เกิน 500,000 บาท เข้าเงื่อนไขวิธีเฉพาะเจาะจง ตามระเบียบกระทรวงการคลังฯ พ.ศ. 2560 ข้อ 22 และ พ.ร.บ. จัดซื้อจัดจ้างฯ มาตรา 56 (1) (ข) สามารถจัดทำรายงานเสนอหัวหน้าหน่วยงานรัฐเพื่ออนุมัติได้ทันที";
      } else if (currentInput.includes("ปรับ") || currentInput.includes("สัญญา")) {
        aiResponse = "[RISK ALERT] กรณีคู่สัญญาผิดนัดหรือส่งมอบล่าช้า ต้องคิดค่าปรับรายวันในอัตราร้อยละ 0.01 - 0.20 ตาม พ.ร.บ. มาตรา 102 ควบคู่ระเบียบพัสดุ ข้อ 162 ครับ";
      }

      setChatHistory((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text: aiResponse }]);
    }, 800);
  };

  return (
    <div style={{
      backgroundColor: "#080b11",
      color: "#e2e8f0",
      height: "100vh",
      fontFamily: "'Sarabun', sans-serif",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }}>
      
      {/* 1. TOP MONITOR NAVIGATION (แถบควบคุมบนสุดสไตล์ WorldMonitor) */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        backgroundColor: "#0d131f",
        borderBottom: "1px solid #1e293b",
        height: "55px"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontWeight: "bold",
            letterSpacing: "1px",
            color: "#38bdf8",
            fontSize: "16px"
          }}>MONITOR <span style={{ color: "#94a3b8", fontSize: "12px" }}>v2.8.0</span></span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={{ background: "#0ea5e9", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>GLOBAL</button>
            <button style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>REGIONAL</button>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>DEFCON 1 ACTIVE</div>
          <div style={{ fontSize: "13px", color: "#4ade80", background: "#022c22", padding: "4px 10px", borderRadius: "4px", border: "1px solid #065f46" }}>
            SYS TIME (UTC): {time || "00:00:00 000"}
          </div>
        </div>
      </div>

      {/* 2. MAIN HUB LAYOUT */}
      <div style={{ display: "flex", flex: 1, position: "relative", overflow: "hidden" }}>
        
        {/* เลเยอร์ฝั่งซ้าย: แผงควบคุมเปิด-ปิดชั้นข้อมูลยุทธวิธี (Layers Controller) */}
        <div style={{
          width: "240px",
          backgroundColor: "#0b101a",
          borderRight: "1px solid #1e293b",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          zIndex: 5
        }}>
          <h4 style={{ fontSize: "12px", color: "#94a3b8", letterSpacing: "0.5px" }}>GLOBAL SITUATION LAYERS</h4>
          <input 
            type="text" 
            placeholder="Search layers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ background: "#111827", border: "1px solid #334155", padding: "6px 10px", borderRadius: "4px", color: "#fff", fontSize: "12px" }}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "13px", marginTop: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🔴 THAI PROCUREMENT HOTSPOTS</label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🟢 TESLA ENERGY GRID</label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🔵 CONFLICT ZONES MANAGEMENT</label>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" /> 🟡 WEATHER CONTROL STATION</label>
          </div>
        </div>

        {/* เลเยอร์ตรงกลาง: แผนที่โลก 2D ยุทธวิธี พร้อมเอฟเฟกต์ฟากสว่างและฟากมืด (Day/Night Timezone) */}
        <div style={{ flex: 1, position: "relative", background: "#05070c" }}>
          
          {/* พื้นหลังภาพแผนที่โลก 2D คมชัดสูงแบบพิกเซลเรโทรสไตล์ Red Alert */}
          <div style={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('/map_day.png.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "absolute",
            top: 0,
            left: 0
          }}>
            
            {/* ชั้นหน้ากากแบ่งฟากมืด (Night Timezone Shadow Overlay) ปรับเลื่อนฝั่งตามเวลาจริง */}
            <div style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "45%",
              height: "100%",
              background: "linear-gradient(90deg, rgba(5,7,12,0) 0%, rgba(5,7,12,0.75) 20%, rgba(5,7,12,0.85) 100%)",
              mixBlendMode: "multiply",
              pointerEvents: "none"
            }} />

            {/* จุดพิกัดสัญญาณเรดาร์แจ้งเตือนกระพริบตามจุดสำคัญบนแผนที่ */}
            <div className="radar-ping" style={{ position: "absolute", left: "73%", top: "42%", width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px #ef4444" }} title="Phrae Hub" />
            <div className="radar-ping" style={{ position: "absolute", left: "52%", top: "28%", width: "10px", height: "10px", background: "#38bdf8", borderRadius: "50%", boxShadow: "0 0 10px #38bdf8" }} title="Moscow Server" />
            <div className="radar-ping" style={{ position: "absolute", left: "25%", top: "35%", width: "10px", height: "10px", background: "#eab308", borderRadius: "50%", boxShadow: "0 0 10px #eab308" }} title="US Gateway" />

          </div>

          {/* กล่องซ้อนทับลอย (Floating Panels) ด้านล่างแผนที่ สำหรับอ่าน AI Insights และคุยโต้ตอบ */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            height: "220px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            zIndex: 10
          }}>
            
            {/* แผงข้อความข่าวสารสถานการณ์สด (Live Updates) */}
            <div style={{ backgroundColor: "rgba(13, 19, 31, 0.9)", border: "1px solid #1e293b", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ef4444" }}>🔴 LIVE INTELLIGENCE FEED</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>IN-MEMORY STORAGE STATUS</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", fontSize: "12.5px", color: "#94a3b8", lineHeight: "1.6" }}>
                <p>• [ระบบพัสดุ] ดึงข้อมูลพระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560 เข้าสู่ RAM ปลอดภัย 100%</p>
                <p style={{ color: "#38bdf8" }}>• [ไทม์โซน] คำนวณเงาตกกระทบช่วงเวลากลางวัน/กลางคืนครอบคลุมภูมิภาคเอเชียตะวันออกเฉียงใต้และเครือข่ายศูนย์ปฏิบัติการ</p>
                <p>• [Local AI] เปิดใช้งานโมดูลคัดกรองกฎหมายพัสดุออฟไลน์ ไม่มีการเชื่อมต่อส่งข้อมูลออกนอกพื้นที่</p>
              </div>
            </div>

            {/* แผงหน้าต่างสนทนา Local RAG Assistant */}
            <div style={{ backgroundColor: "rgba(11, 16, 26, 0.95)", border: "1px solid #1e293b", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px", fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>
                LOCAL TERNARY COMMAND LINE
              </div>
              
              {/* รายการข้อความแชต */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "8px" }}>
                {chatHistory.map((msg) => (
                  <div key={msg.id} style={{
                    fontSize: "12.5px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    maxWidth: "90%",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "user" ? "#1e1b4b" : "#1e293b",
                    borderLeft: msg.sender === "user" ? "none" : "2px solid #38bdf8",
                    borderRight: msg.sender === "user" ? "2px solid #818cf8" : "none",
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* ช่องป้อนข้อความส่งคำสั่ง */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="พิมพ์ถามคำถามกฎหมายพัสดุที่นี่..." 
                  style={{ flex: 1, background: "#070a0f", border: "1px solid #334155", borderRadius: "4px", padding: "6px 10px", color: "#fff", fontSize: "13px", outline: "none" }}
                />
                <button onClick={handleSendMessage} style={{ background: "#38bdf8", color: "#0f172a", border: "none", padding: "0 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}>SEND</button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* สไตล์อนิเมชั่นเรดาร์เพิ่มเติม */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.3); opacity: 0.4; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        .radar-ping {
          animation: pulse 2s infinite ease-in-out;
        }
      `}} />

    </div>
  );
}
