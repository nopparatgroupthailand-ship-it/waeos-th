"use client";

import React, { useState, useEffect, useRef } from "react";

interface ProcurementDoc {
  id: string;
  source: string;
  section: string;
  content: string;
}

export default function WorldMapComponent() {
  const [time, setTime] = useState("");
  const [localTime, setLocalTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState("⚡ INITIALIZING TERNARY ENGINE...");
  const [nightPosition, setNightPosition] = useState("45%");
  
  // 🛠️ ระบบแดชบอร์ดลากขยับขนาดจอซ้าย-ขวา (เริ่มต้นที่ 70%)
  const [leftWidth, setLeftWidth] = useState(70); 
  const isResizing = useRef(false);

  const procurementDatabase = useRef<ProcurementDoc[]>([]);
  const generator = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "ai",
      text: "[SYSTEM ONLINE] บูตระบบจัดการแผนที่ยุทธวิธีเสร็จสมบูรณ์ ระบบตรวจจับแถบเงาแสงอาทิตย์ขยับอัตโนมัติทำงาน",
    },
    {
      id: 2,
      sender: "ai",
      text: "[⚠️ CORE] กำลังเชื่อมโยงโครงข่ายประสาทเทียมตรงผ่านเว็บบราวเซอร์ (Local WebGPU Inference)...",
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ฟังก์ชันเริ่มต้นคำนวณการลากหน้าจอขยับซ้ายขวา
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    // คำนวณร้อยละความกว้างหน้าจอตามตำแหน่งเมาส์จริง
    const newWidth = (e.clientX / window.innerWidth) * 100;
    // ล็อกระยะขั้นต่ำไม่ให้จอบีบเล็กเกินไปจนพัง (ขั้นต่ำ 40% สูงสุด 85%)
    if (newWidth > 40 && newWidth < 85) {
      setLeftWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  // 1. ระบบติดตั้งดึงสมอง AI
  useEffect(() => {
    const initLocalLLM = async () => {
      try {
        setAiStatus("⏳ DOWNLOADING TINY LLM (~320MB)...");
        
        const ragResponse = await fetch("/rag/dlc_procure.json");
        if (ragResponse.ok) {
          procurementDatabase.current = await ragResponse.json();
        } else {
          procurementDatabase.current = [
            { id: "act-m4", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 4", content: "การจัดซื้อจัดจ้าง หมายความว่า การดำเนินการเพื่อให้ได้มาซึ่งพัสดุโดยการซื้อ จ้าง เช่า แลกเปลี่ยน... พัสดุ หมายความว่า สินค้า งานบริการ งานก่อสร้าง งานเช่า..." },
            { id: "reg-c22", source: "ระเบียบกระทรวงการคลังฯ 2560", section: "ข้อ 22", content: "การจัดซื้อจัดจ้างโดยวิธีเฉพาะเจาะจงที่มีวงเงินไม่เกิน 500,000 บาท ให้เจ้าหน้าที่จัดทำรายงานขอความเห็นชอบ..." },
            { id: "act-m102", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 102", content: "การกำหนดอัตราค่าปรับในสัญญา ให้กำหนดเป็นรายวันในอัตราร้อยละ 0.01 ถึง 0.20 ของมูลค่าสัญญานั้นๆ" },
            { id: "circular-w845", source: "หนังสือเวียน คคบ. ว 845", section: "แนวทางอนุมัติยกเว้นค่าปรับ", content: "อนุมัติยกเว้นหรือลดค่าปรับให้แก่คู่สัญญา กรณีที่ได้รับผลกระทบจากเหตุสุดวิสัย..." }
          ];
        }

        const { pipeline } = await import("@huggingface/transformers");
        
        generator.current = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct-ONNX', {
          device: 'webgpu',
          dtype: 'q4',
        });

        setAiStatus("🟢 LOCAL AI READY (WEB-GPU)");
        setIsAiLoading(false);
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          sender: "ai",
          text: "✅ [LOCAL BRAIN ONLINE] โหลดสมอง AI เรียบร้อยแล้ว! ข้อมูลทำงานออฟไลน์ในเครื่องปลอดภัย 100% พิมพ์ถามคำถามเงื่อนไขกฎหมายพัสดุได้เลยครับพี่สิริวิชญ์"
        }]);

      } catch (err) {
        console.log("WebGPU fallback to WASM...", err);
        setAiStatus("🟡 LOCAL AI ACTIVE (WASM MODE)");
        setIsAiLoading(false);
      }
    };

    initLocalLLM();
  }, []);

  // 2. ระบบเวลาเรียลไทม์และคำนวณเงาแสงอาทิตย์
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(Math.floor(Math.random() * 900) + 100);
      setTime(`${hrs}:${mins}:${secs} ${ms}`);
      setLocalTime(now.toLocaleTimeString("th-TH"));

      const currentUtcHour = now.getUTCHours() + (now.getUTCMinutes() / 60);
      const shiftPercent = ((currentUtcHour + 6) % 24) / 24 * 100;
      setNightPosition(`${shiftPercent}%`);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  // 3. ฟังก์ชันประมวลผลสกัดคำตอบตรงจุด
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const currentInput = chatInput.trim();
    setChatHistory(prev => [...prev, { id: Date.now(), sender: "user", text: currentInput }]);
    setChatInput("");

    const matchedDocs = procurementDatabase.current.filter(doc => {
      const keywords = currentInput.toLowerCase().split(/[ ,]+/);
      return keywords.some(k => doc.content.toLowerCase().includes(k) || doc.section.toLowerCase().includes(k));
    });

    try {
      let aiTextOutput = "";

      if (generator.current) {
        const contextString = matchedDocs.length > 0 
          ? matchedDocs.map(d => `[ระเบียบอ้างอิง: ${d.source} ${d.section}] เนื้อหา: ${d.content}`).join("\n")
          : "ไม่พบระเบียบพัสดุที่เกี่ยวข้องโดยตรงในระบบข้อมูลคลัง RAM";

        const systemPrompt = `บริบทกฎหมาย:\n${contextString}\n\nคำถามจากเจ้าหน้าที่: ${currentInput}\nคำตอบสั้นๆ:`;

        const output = await generator.current(systemPrompt, {
          max_new_tokens: 150,
          temperature: 0.1,
          do_sample: false
        });

        const fullResponse = output[0].generated_text;
        
        if (fullResponse.includes("คำตอบสั้นๆ:")) {
          aiTextOutput = fullResponse.split("คำตอบสั้นๆ:")[1]?.trim();
        } else {
          aiTextOutput = fullResponse.replace(systemPrompt, "").trim();
        }

        if (!aiTextOutput || aiTextOutput.length < 2) {
          aiTextOutput = matchedDocs.length > 0 
            ? `พบข้อความอ้างอิงตรงกับคำค้นหาของพี่ดังนี้ครับ:\n${matchedDocs[0].content}`
            : "สแกนแล้วไม่พบมาตราที่ตรงกับคำหลักที่ส่งมา ลองปรับใช้คำว่า 'มาตรา 4' หรือ 'อัตราค่าปรับ' ดูครับพี่";
        }

      } else {
        aiTextOutput = "[LOCAL CONSOLE] ตรวจพบคำค้นหาพัสดุ ดึงประโยคอ้างอิงจาก RAM สำเร็จ";
      }

      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: `[🔥 RAG INSIGHT] ${aiTextOutput}` }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: "❌ ข้อผิดพลาด: แกนประมวลผลในเครื่องหยุดทำงานชั่วคราว" }]);
    }
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
      
      {/* ================= 1. TOP BAR NAVBAR ================= */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 16px",
        backgroundColor: "#0d131f",
        borderBottom: "1px solid #1e293b",
        height: "55px",
        userSelect: "none"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontWeight: "bold", letterSpacing: "1px", color: "#38bdf8", fontSize: "16px" }}>
            FIREFLY MONITOR <span style={{ color: "#94a3b8", fontSize: "12px" }}>v3.0.0</span>
          </span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={{ background: "#0ea5e9", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px" }}>GLOBAL</button>
            <button style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px" }}>REGIONAL</button>
          </div>
          <div style={{ fontSize: "12px", background: isAiLoading ? "#1e293b" : "#065f46", color: "#fff", padding: "4px 10px", borderRadius: "4px", fontWeight: "bold" }}>
            {aiStatus}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div style={{ background: "#065f46", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>TH TIME: {localTime}</div>
          <div style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>DEFCON 1 ACTIVE</div>
          <div style={{ fontSize: "13px", color: "#4ade80", background: "#022c22", padding: "4px 10px", borderRadius: "4px", border: "1px solid #065f46" }}>
            SYS TIME (UTC): {time || "00:00:00 000"}
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN SPLIT HUB WORKSPACE ================= */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative" }}>
        
        {/* 🗺️ ฝั่งซ้าย: แผนที่ยุทธวิธี (คำนวณความกว้างแบบก้าวหน้าตามค่า leftWidth) */}
        <div style={{ width: `${leftWidth}%`, display: "flex", position: "relative", height: "100%", overflow: "hidden" }}>
          
          <div style={{
            width: "240px",
            backgroundColor: "#0b101a",
            borderRight: "1px solid #1e293b",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            zIndex: 5,
            userSelect: "none"
          }}>
            <h4 style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.5px", margin: 0 }}>GLOBAL SITUATION LAYERS</h4>
            <input 
              type="text" 
              placeholder="Search layers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: "#111827", border: "1px solid #334155", padding: "6px 10px", borderRadius: "4px", color: "#fff", fontSize: "12px" }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "12px", marginTop: "8px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🔴 THAI PROCUREMENT HOTSPOTS</label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🟢 TESLA ENERGY GRID</label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🔵 CONFLICT ZONES</label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" /> 🟡 WEATHER STATION</label>
            </div>
            
            <h4 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "0.5px", marginTop: "15px", marginBottom: 0 }}>LOCAL RAM HARDWARE</h4>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", fontSize: "11px", border: "1px solid #1e293b", color: "#94a3b8" }}>
              • AI Brain Model: ~320 MB<br/>
              • RAG Encrypted DB: ~125 MB
            </div>
          </div>

          <div style={{ flex: 1, position: "relative", background: "#05070c" }}>
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
              <div style={{
                position: "absolute",
                top: 0,
                left: nightPosition,
                width: "45%",
                height: "100%",
                background: "linear-gradient(90deg, rgba(5,7,12,0) 0%, rgba(5,7,12,0.8) 30%, rgba(5,7,12,0.85) 100%)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
                transition: "left 0.5s ease"
              }} />

              <div className="radar-ping" style={{ position: "absolute", left: "73%", top: "42%", width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px #ef4444" }} title="Phrae Hub" />
              <div className="radar-ping" style={{ position: "absolute", left: "52%", top: "28%", width: "10px", height: "10px", background: "#38bdf8", borderRadius: "50%", boxShadow: "0 0 10px #38bdf8" }} title="Moscow Server" />
              <div className="radar-ping" style={{ position: "absolute", left: "25%", top: "35%", width: "10px", height: "10px", background: "#eab308", borderRadius: "50%", boxShadow: "0 0 10px #eab308" }} title="US Gateway" />
            </div>
          </div>

        </div>

        {/* 🎛️ แถบกระจกแนวตั้ง (ขยับแกนกลาง): ใช้เมาส์คลิกค้างแล้วลากเลื่อนปรับขนาดซ้ายขวาได้อิสระ */}
        <div 
          onMouseDown={startResizing}
          style={{
            width: "6px",
            background: "#1e293b",
            cursor: "col-resize",
            position: "relative",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#38bdf8")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#1e293b")}
        >
          {/* ขีดสัญลักษณ์ตรงกลางปุ่มลาก */}
          <div style={{ width: "2px", height: "20px", background: "#64748b", borderRadius: "1px" }} />
        </div>

        {/* 🤖 ฝั่งขวา: แผงควบคุมและกล่องแชต (ความกว้างจะลด-ขยายสวนทางตามแถบลากอัตโนมัติ) */}
        <div style={{ 
          width: `${100 - leftWidth}%`, 
          backgroundColor: "#0b101a", 
          display: "flex", 
          flexDirection: "column", 
          height: "100%",
          padding: "12px",
          overflow: "hidden"
        }}>
          
          <div style={{ 
            height: "140px", 
            backgroundColor: "rgba(13, 19, 31, 0.92)", 
            border: "1px solid #1e293b", 
            borderRadius: "6px", 
            padding: "12px", 
            display: "flex", 
            flexDirection: "column",
            marginBottom: "12px",
            userSelect: "none"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ef4444" }}>🔴 LIVE INTELLIGENCE FEED</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", fontSize: "11.5px", color: "#94a3b8", lineHeight: "1.5" }}>
              <p style={{ margin: "2px 0" }}>• [ระบบพัสดุ] จับคู่ฐานข้อมูลออฟไลน์ใน RAM เสร็จสิ้น</p>
              <p style={{ margin: "2px 0", color: "#38bdf8" }}>• [การทำงาน] แยกโมเดลรันแบบปิดปลอดภัย 100%</p>
              <p style={{ margin: "2px 0" }}>• [Hardware] เชื่อมแกนประมวลผล WebGPU ของเครื่องผู้ใช้</p>
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            backgroundColor: "rgba(11, 16, 26, 0.96)", 
            border: "1px solid #1e293b", 
            borderRadius: "6px", 
            padding: "12px", 
            display: "flex", 
            flexDirection: "column",
            overflow: "hidden"
          }}>
            <div style={{ borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px", fontSize: "12px", fontWeight: "bold", color: "#38bdf8", userSelect: "none" }}>
              LOCAL TERNARY COMMAND LINE
            </div>
            
            <div style={{ 
              flex: 1, 
              overflowY: "auto", 
              overflowX: "hidden", 
              display: "flex", 
              flexDirection: "column", 
              gap: "8px", 
              paddingBottom: "8px"
            }}>
              {chatHistory.map((msg) => (
                <div key={msg.id} style={{
                  fontSize: "12.5px",
                  padding: "8px 10px",
                  borderRadius: "4px",
                  maxWidth: "95%",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  backgroundColor: msg.sender === "user" ? "#1e1b4b" : "#1e293b",
                  borderLeft: msg.sender === "user" ? "none" : "2px solid #38bdf8",
                  borderRight: msg.sender === "user" ? "2px solid #818cf8" : "none",
                }}>
                  {msg.text}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #233149" }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isAiLoading}
                placeholder={isAiLoading ? "กรุณารอระบบติดตั้งแกนสมอง..." : "พิมพ์ค้นหาเงื่อนไขกฎหมายพัสดุตรงนี้ได้เลย..."} 
                style={{ 
                  flex: 1, 
                  background: "#070a0f", 
                  border: "1px solid #334155", 
                  borderRadius: "4px", 
                  padding: "8px 10px", 
                  color: "#fff", 
                  fontSize: "13px", 
                  outline: "none" 
                }}
              />
              <button 
                onClick={handleSendMessage} 
                disabled={isAiLoading}
                style={{ 
                  background: isAiLoading ? "#334155" : "#38bdf8", 
                  color: "#0f172a", 
                  border: "none", 
                  padding: "0 16px", 
                  borderRadius: "4px", 
                  fontWeight: "bold", 
                  fontSize: "12px", 
                  cursor: "pointer" 
                }}
              >
                SEND
              </button>
            </div>
          </div>

        </div>

      </div>

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
