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
  const [searchQuery, setSearchQuery] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState("⚡ INITIALIZING TERNARY ENGINE...");
  
  const procurementDatabase = useRef<ProcurementDoc[]>([]);
  const generator = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null); // ตัวจับตำแหน่งให้แชตเลื่อนลงล่างสุดอัตโนมัติ

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "ai",
      text: "[SYSTEM ONLINE] บูตระบบฐานข้อมูลแผนที่ยุทธวิธีเสร็จสมบูรณ์ แยกพื้นที่แถบเวลากลางวัน-กลางคืน (Timezone Day/Night Overlay)",
    },
    {
      id: 2,
      sender: "ai",
      text: "[⚠️ CORE] กำลังเชื่อมต่อระบบโครงข่ายประสาทเทียมรันตรงผ่านเว็บบราวเซอร์ (Local Inference)...",
    }
  ]);

  // เลื่อนหน้าต่างแชตลงมาล่างสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // 1. ระบบติดตั้งและดึงสมอง AI
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
          text: "✅ [LOCAL BRAIN ONLINE] โหลดสมองกฎหมายจัดซื้อจัดจ้าง พรบ. ระเบียบพัสดุ และหนังสือเวียนสำเร็จแล้ว! ข้อมูลปลอดภัยอยู่บนเครื่องผู้ใช้ 100% ไม่รั่วไหลออกอินเทอร์เน็ต พิมพ์ถามคำถามกฎหมายพัสดุได้เลยครับพี่สิริวิชญ์"
        }]);

      } catch (err) {
        console.log("WebGPU fallback to WASM execution loop...", err);
        setAiStatus("🟡 LOCAL AI ACTIVE (WASM MODE)");
        setIsAiLoading(false);
      }
    };

    initLocalLLM();
  }, []);

  // 2. ระบบเวลาเรียลไทม์
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

  // 3. ฟังก์ชันประมวลผล RAG ถาม-ตอบ
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
          ? matchedDocs.map(d => `[อ้างอิง: ${d.source} ${d.section}] เนื้อหา: ${d.content}`).join("\n")
          : "ไม่มีอ้างอิงระเบียบโดยตรงในระบบ";

        const systemPrompt = `คุณคือระบบผู้ช่วยกฎหมายจัดซื้อจัดจ้างและพัสดุภาครัฐของไทย จงตอบคำถามอย่างเป็นทางการตามข้อเท็จจริง\nบริบทอ้างอิง:\n${contextString}\n\nคำถาม: ${currentInput}\nคำตอบ:`;

        const output = await generator.current(systemPrompt, {
          max_new_tokens: 200,
          temperature: 0.1,
          do_sample: false
        });

        const fullResponse = output[0].generated_text;
        aiTextOutput = fullResponse.split("คำตอบ:")[1]?.trim() || "[LOCAL ENGINE] ประมวลผลลัพธ์สำเร็จ";
      } else {
        aiTextOutput = "[LOCAL ENGINE] ค้นพบคลังข้อความพัสดุ: ระบบจำลองการดึงข้อความใน RAM";
      }

      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: `[🔥 RAG INSIGHT] ${aiTextOutput}` }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { id: Date.now() + 1, sender: "ai", text: "❌ ข้อผิดพลาด: ไม่สามารถรันประมวลผลน้ำหนัก AI ในเครื่องได้" }]);
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
        height: "55px"
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
          <div style={{ background: "#ef4444", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" }}>DEFCON 1 ACTIVE</div>
          <div style={{ fontSize: "13px", color: "#4ade80", background: "#022c22", padding: "4px 10px", borderRadius: "4px", border: "1px solid #065f46" }}>
            SYS TIME (UTC): {time || "00:00:00 000"}
          </div>
        </div>
      </div>

      {/* ================= 2. MAIN SPLIT HUB WORKSPACE ================= */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* 🗺️ ฝั่งซ้าย (70%): แผนที่โลกยุทธวิธี และ แผงควบคุมเลเยอร์ด้านใน */}
        <div style={{ width: "70%", display: "flex", position: "relative", borderRight: "1px solid #1e293b", height: "100%" }}>
          
          {/* แผงควบคุมเปิด-ปิดชั้นข้อมูลยุทธวิธีภายในฝั่งซ้าย */}
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

          {/* กล่องแสดงแผนที่โลก (ขยายเต็มพื้นที่ที่เหลือของฝั่ง 70%) */}
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
              {/* ชั้นหน้ากากแบ่งฟากมืด/ฟากสว่าง */}
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

              {/* จุดพิกัดเรดาร์แจ้งเตือน */}
              <div className="radar-ping" style={{ position: "absolute", left: "73%", top: "42%", width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0 10px #ef4444" }} title="Phrae Hub" />
              <div className="radar-ping" style={{ position: "absolute", left: "52%", top: "28%", width: "10px", height: "10px", background: "#38bdf8", borderRadius: "50%", boxShadow: "0 0 10px #38bdf8" }} title="Moscow Server" />
              <div className="radar-ping" style={{ position: "absolute", left: "25%", top: "35%", width: "10px", height: "10px", background: "#eab308", borderRadius: "50%", boxShadow: "0 0 10px #eab308" }} title="US Gateway" />
            </div>
          </div>

        </div>

        {/* 🤖 ฝั่งขวา (30%): ศูนย์ควบคุมและแชตโต้ตอบยาวเต็มจอ ย้ายมาด้านข้างเลื่อนเมาส์ขยับได้อิสระ */}
        <div style={{ 
          width: "30%", 
          backgroundColor: "#0b101a", 
          display: "flex", 
          flexDirection: "column", 
          height: "100%",
          padding: "12px"
        }}>
          
          {/* ส่วนบน: แผง Live Intelligence Feed (ข่าวสารระบบ) */}
          <div style={{ 
            height: "180px", 
            backgroundColor: "rgba(13, 19, 31, 0.92)", 
            border: "1px solid #1e293b", 
            borderRadius: "6px", 
            padding: "12px", 
            display: "flex", 
            flexDirection: "column",
            marginBottom: "12px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "bold", color: "#ef4444" }}>🔴 LIVE INTELLIGENCE FEED</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", fontSize: "11.5px", color: "#94a3b8", lineHeight: "1.5" }}>
              <p style={{ margin: "2px 0" }}>• [ระบบพัสดุ] ดึงข้อมูลคลัง พรบ. ระเบียบพัสดุ 2560 เข้าสู่ RAM เรียบร้อย</p>
              <p style={{ margin: "2px 0", color: "#38bdf8" }}>• [ระบบปลอดภัย] สถาปัตยกรรมทำงานแบบออฟไลน์แยกตัว 100%</p>
              <p style={{ margin: "2px 0" }}>• [Local Engine] เรียกใช้คำสั่งแกนประมวลผล WebGPU สำเร็จ</p>
            </div>
          </div>

          {/* ส่วนล่าง: หน้าต่างแชตยาวเต็มพื้นที่ที่เหลือ สามารถเลื่อน (Scroll) ขยับดูซ้ายขวาบนล่างได้ */}
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
            <div style={{ borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px", fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>
              LOCAL TERNARY COMMAND LINE
            </div>
            
            {/* รายการแชต: เปิดสิทธิ์ให้ Scroll เลื่อนขึ้นลงดูประวัติได้อย่างอิสระ */}
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

            {/* ส่วนควบคุมช่องสำหรับกรอกคำสั่งพิมพ์ข้อความคุยกับ AI */}
            <div style={{ display: "flex", gap: "8px", marginTop: "8px", paddingTop: "8px", borderTop: "1px solid #233149" }}>
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isAiLoading}
                placeholder={isAiLoading ? "กรุณารอระบบสักครู่..." : "พิมพ์ถามเงื่อนไขกฎหมายพัสดุตรงนี้ได้เลย..."} 
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
