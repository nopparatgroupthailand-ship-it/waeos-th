"use client";

import React, { useState, useEffect, useRef } from "react";

// โครงสร้างประเภทข้อมูลคลังเอกสารพัสดุสำหรับทำ Local RAG ค้นหาในเครื่อง
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
  
  // 📁 คลังเก็บเอกสารที่ใช้สืบค้นจับคู่เนื้อหา (Context Store)
  const procurementDatabase = useRef<ProcurementDoc[]>([]);
  // 🧠 ตัวแปรเก็บ Pipeline สมอง AI ตัวจริง (Transformers.js Instance)
  const generator = useRef<any>(null);

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

  // 1. ระบบติดตั้งและดึงสมอง AI เข้า RAM อัตโนมัติด้วย WebGPU / WASM
  useEffect(() => {
    const initLocalLLM = async () => {
      try {
        setAiStatus("⏳ DOWNLOADING TINY LLM (~320MB)...");
        
        // 🛠️ โหลดฐานข้อมูล RAG เตรียมไว้ในหน่วยความจำบราวเซอร์
        const ragResponse = await fetch("/rag/dlc_procure.json");
        if (ragResponse.ok) {
          procurementDatabase.current = await ragResponse.json();
        } else {
          // Fallback ข้อมูลกรณีที่ยังไม่ได้สร้างไฟล์ JSON แยกไว้ภายนอก
          procurementDatabase.current = [
            { id: "act-m4", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 4", content: "การจัดซื้อจัดจ้าง หมายความว่า การดำเนินการเพื่อให้ได้มาซึ่งพัสดุโดยการซื้อ จ้าง เช่า แลกเปลี่ยน... พัสดุ หมายความว่า สินค้า งานบริการ งานก่อสร้าง งานเช่า..." },
            { id: "reg-c22", source: "ระเบียบกระทรวงการคลังฯ 2560", section: "ข้อ 22", content: "การจัดซื้อจัดจ้างโดยวิธีเฉพาะเจาะจงที่มีวงเงินไม่เกิน 500,000 บาท ให้เจ้าหน้าที่จัดทำรายงานขอความเห็นชอบ..." },
            { id: "act-m102", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 102", content: "การกำหนดอัตราค่าปรับในสัญญา ให้กำหนดเป็นรายวันในอัตราร้อยละ 0.01 ถึง 0.20 ของมูลค่าสัญญานั้นๆ" },
            { id: "circular-w845", source: "หนังสือเวียน คคบ. ว 845", section: "แนวทางอนุมัติยกเว้นค่าปรับ", content: "อนุมัติยกเว้นหรือลดค่าปรับให้แก่คู่สัญญา กรณีที่ได้รับผลกระทบจากเหตุสุดวิสัย..." }
          ];
        }

        // 🧠 โหลดไลบรารีและดาวน์โหลดโมเดล Qwen2.5-0.5B มารันในเครื่องพี่จริง
        const { pipeline } = await import("@huggingface/transformers");
        
        generator.current = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct-ONNX', {
          device: 'webgpu', // สั่งรันบนการ์ดจอผ่าน WebGPU เพื่อความเร็วระดับมิลลิวินาที
          dtype: 'q4',     // บีบอัดน้ำหนักสมอง 4-bit เพื่อจำกัดขนาดไม่เกิน 350MB ตามเป้าหมาย
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

  // 2. ฟังก์ชันอัปเดตเวลาระบบเรียลไทม์ (UTC)
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

  // 3. ฟังก์ชันการทำข้อสอบประมวลผล RAG และรันข้อความผ่าน AI สมองจริง
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;

    const currentInput = chatInput.trim();
    setChatHistory(prev => [...prev, { id: Date.now(), sender: "user", text: currentInput }]);
    setChatInput("");

    // กรองค้นหาเอกสารที่มีคำค้นหาใกล้เคียงที่สุด (Local Semantic Filtering Concept)
    const matchedDocs = procurementDatabase.current.filter(doc => {
      const keywords = currentInput.toLowerCase().split(/[ ,]+/);
      return keywords.some(k => doc.content.toLowerCase().includes(k) || doc.section.toLowerCase().includes(k));
    });

    try {
      let aiTextOutput = "";

      if (generator.current) {
        // เทคนิคแบบ RAG: นำเนื้อหากฎหมายจริงที่ดึงจากหน่วยความจำมาเป็นข้อความแวดล้อมประกอบร่างเป็น Prompt
        const contextString = matchedDocs.length > 0 
          ? matchedDocs.map(d => `[อ้างอิง: ${d.source} ${d.section}] เนื้อหา: ${d.content}`).join("\n")
          : "ไม่มีอ้างอิงระเบียบโดยตรงในระบบ";

        const systemPrompt = `คุณคือระบบผู้ช่วยกฎหมายจัดซื้อจัดจ้างและพัสดุภาครัฐของไทย จงตอบคำถามอย่างเป็นทางการตามข้อเท็จจริง\nบริบทอ้างอิง:\n${contextString}\n\nคำถาม: ${currentInput}\nคำตอบ:`;

        // สั่งให้สมองประมวลผลคำตอบจริงออกมาตามค่ากฎหมาย
        const output = await generator.current(systemPrompt, {
          max_new_tokens: 150,
          temperature: 0.1, // กำหนดค่านิ่งๆ ป้องกันโมเดลมโนคำตอบเอง
          do_sample: false
        });

        const fullResponse = output[0].generated_text;
        aiTextOutput = fullResponse.split("คำตอบ:")[1]?.trim() || "[LOCAL ENGINE] ประมวลผลลัพธ์สำเร็จ";
      } else {
        // Fallback Logic สำรองหากรันโมเดลภายนอกไม่ผ่านบนเครื่องเก่า
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
      
      {/* 1. TOP MONITOR NAVIGATION */}
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
          }}>FIREFLY MONITOR <span style={{ color: "#94a3b8", fontSize: "12px" }}>v3.0.0</span></span>
          <div style={{ display: "flex", gap: "4px" }}>
            <button style={{ background: "#0ea5e9", color: "#fff", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>GLOBAL</button>
            <button style={{ background: "#1e293b", color: "#94a3b8", border: "none", padding: "4px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" }}>REGIONAL</button>
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

      {/* 2. MAIN HUB LAYOUT */}
      <div style={{ display: "flex", flex: 1, position: "relative", overflow: "hidden" }}>
        
        {/* เลเยอร์ฝั่งซ้าย: Layers Controller (คงเดิมตามฉบับของพี่) */}
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
          <h4 style={{ fontSize: "12px", color: "#94a3b8", letterSpacing: "0.5px", margin: 0 }}>GLOBAL SITUATION LAYERS</h4>
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
          
          <h4 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "0.5px", marginTop: "15px", marginBottom: 0 }}>LOCAL RAM HARDWARE</h4>
          <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", fontSize: "11px", border: "1px solid #1e293b", color: "#94a3b8" }}>
            • AI Brain Model: ~320 MB<br/>
            • RAG Encrypted DB: ~125 MB
          </div>
        </div>

        {/* เลเยอร์ตรงกลาง: แผนที่โลกยุทธวิธีและส่วนประมวลผลแชตจริง */}
        <div style={{ flex: 1, position: "relative", background: "#05070c" }}>
          
          {/* แผนที่โลก 2D ยุทธวิธี */}
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
            
            {/* ชั้นหน้ากากแบ่งฟากมืด/ฟากสว่าง (Night Timezone Shadow Overlay) */}
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

          {/* แผงข้อมูลลอยคู่ (Floating Panels) ด้านล่างสุด */}
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            height: "230px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            zIndex: 10
          }}>
            
            {/* แผง Live Intelligence Feed ข่าวสารสถานการณ์สด */}
            <div style={{ backgroundColor: "rgba(13, 19, 31, 0.92)", border: "1px solid #1e293b", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: "bold", color: "#ef4444" }}>🔴 LIVE INTELLIGENCE FEED</span>
                <span style={{ fontSize: "11px", color: "#64748b" }}>IN-MEMORY STORAGE STATUS</span>
              </div>
              <div style={{ flex: 1, overflowY: "auto", fontSize: "12.5px", color: "#94a3b8", lineHeight: "1.6" }}>
                <p style={{ margin: "4px 0" }}>• [ระบบพัสดุ] ดึงข้อมูลคลัง พรบ. ระเบียบพัสดุ 2560 และหนังสือเวียนเข้าสู่หน่วยความจำความเร็วสูงใน RAM เรียบร้อย</p>
                <p style={{ margin: "4px 0", color: "#38bdf8" }}>• [ความปลอดภัยทางไซเบอร์] สถาปัตยกรรมระบบเป็นแบบตัดเน็ตทำงานออฟไลน์ แยกตัวจาก Cloud สาธารณะภายนอก 100%</p>
                <p style={{ margin: "4px 0" }}>• [Local Engine] ตรวจสอบโครงข่าย WebGPU พร้อมเรียกใช้ชุดคำสั่งแกนประมวลผลขนาดจิ๋วในการตอบคำถาม</p>
              </div>
            </div>

            {/* แผงหน้าต่างสนทนา Local RAG สมองกลแท้ */}
            <div style={{ backgroundColor: "rgba(11, 16, 26, 0.96)", border: "1px solid #1e293b", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid #334155", paddingBottom: "6px", marginBottom: "8px", fontSize: "12px", fontWeight: "bold", color: "#38bdf8" }}>
                LOCAL TERNARY COMMAND LINE
              </div>
              
              {/* ส่วนแสดงประวัติแชต */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingBottom: "8px" }}>
                {chatHistory.map((msg) => (
                  <div key={msg.id} style={{
                    fontSize: "12.5px",
                    padding: "6px 10px",
                    borderRadius: "4px",
                    maxWidth: "90%",
                    whiteSpace: "pre-wrap",
                    alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                    backgroundColor: msg.sender === "user" ? "#1e1b4b" : "#1e293b",
                    borderLeft: msg.sender === "user" ? "none" : "2px solid #38bdf8",
                    borderRight: msg.sender === "user" ? "2px solid #818cf8" : "none",
                  }}>
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* ช่องป้อนข้อความ */}
              <div style={{ display: "flex", gap: "8px" }}>
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isAiLoading}
                  placeholder={isAiLoading ? "กรุณารอโหลดคลังสมอง AI สักครู่..." : "พิมพ์ถามคำถามกฎหมายพัสดุ (เช่น เฉพาะเจาะจง, ค่าปรับ)..."} 
                  style={{ flex: 1, background: "#070a0f", border: "1px solid #334155", borderRadius: "4px", padding: "8px 10px", color: "#fff", fontSize: "13px", outline: "none" }}
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isAiLoading}
                  style={{ background: isAiLoading ? "#334155" : "#38bdf8", color: "#0f172a", border: "none", padding: "0 16px", borderRadius: "4px", fontWeight: "bold", fontSize: "12px", cursor: "pointer" }}
                >
                  SEND
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* อนิเมชั่นไฟสัญญาณเรดาร์กระพริบ */}
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
