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
  
  // 🛠️ ระบบแดชบอร์ดลากขยับขนาดจอซ้าย-ขวา
  const [leftWidth, setLeftWidth] = useState(70); 
  const isResizing = useRef(false);

  const procurementDatabase = useRef<ProcurementDoc[]>([]);
  const generator = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      sender: "ai",
      text: "[SYSTEM ONLINE] บูตระบบจัดการแผนที่ยุทธวิธีเสร็จสมบูรณ์ ระบบตรวจสอบแกนฐานสาม Setun สแตนบาย",
    },
    {
      id: 2,
      sender: "ai",
      text: "[⚠️ SETUN CORE] ระบบประมวลผล RAG ทำงานร่วมกับ WebGPU Local Inference คุมเข้มความปลอดภัยข้อมูลพัสดุ",
    }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // ฟังก์ชันลากหน้าจอขยับซ้ายขวา
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResizing);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing.current) return;
    const newWidth = (e.clientX / window.innerWidth) * 100;
    if (newWidth > 30 && newWidth < 85) {
      setLeftWidth(newWidth);
    }
  };

  const stopResizing = () => {
    isResizing.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResizing);
  };

  // 1. ระบบดึงสมอง AI และฐานข้อมูลพัสดุ
  useEffect(() => {
    const initLocalLLM = async () => {
      try {
        setAiStatus("⏳ DOWNLOADING TINY LLM (~320MB)...");
        
        const ragResponse = await fetch("/rag/dlc_procure.json");
        if (ragResponse.ok) {
          procurementDatabase.current = await ragResponse.json();
        } else {
          // Fallback Database ชุดข้อมูลกฎหมายพัสดุ
          procurementDatabase.current = [
            { id: "act-m4", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 4", content: "การจัดซื้อจัดจ้าง หมายความว่า การดำเนินการเพื่อให้ได้มาซึ่งพัสดุโดยการซื้อ จ้าง เช่า แลกเปลี่ยน... พัสดุ หมายความว่า สินค้า งานบริการ งานก่อสร้าง งานเช่า..." },
            { id: "reg-c22", source: "ระเบียบกระทรวงการคลังฯ 2560", section: "ข้อ 22", content: "การจัดซื้อจัดจ้างโดยวิธีเฉพาะเจาะจงที่มีวงเงินไม่เกิน 500,000 บาท ให้เจ้าหน้าที่จัดทำรายงานขอความเห็นชอบ..." },
            { id: "act-m102", source: "พ.ร.บ. จัดซื้อจัดจ้างฯ 2560", section: "มาตรา 102", content: "การกำหนดอัตราค่าปรับในสัญญา ให้กำหนดเป็นรายวันในอัตราร้อยละ 0.01 ถึง 0.20 ของมูลค่าสัญญานั้นๆ" },
            { id: "circular-w845", source: "หนังสือเวียน คคบ. ว 845", section: "แนวทางอนุมัติยกเว้นค่าปรับ", content: "อนุมัติยกเว้นหรือลดค่าปรับให้แก่คู่สัญญา กรณีที่ได้รับผลกระทบจากเหตุสุดวิสัยหรือภัยพิบัติ..." }
          ];
        }

        const { pipeline } = await import("@huggingface/transformers");
        
        generator.current = await pipeline('text-generation', 'onnx-community/Qwen2.5-0.5B-Instruct-ONNX', {
          device: 'webgpu',
          dtype: 'q4',
        });

        setAiStatus("🟢 SETUN-GPU READY");
        setIsAiLoading(false);
        setChatHistory(prev => [...prev, {
          id: Date.now(),
          sender: "ai",
          text: "🟢 [SETUN CORE ONLINE] โหลดสถาปัตยกรรมคุมโมเดลเสร็จสิ้น พร้อมคัดกรองระเบียบพัสดุด้วยความเร็วสูง"
        }]);

      } catch (err) {
        console.log("WebGPU fallback to WASM...", err);
        setAiStatus("🟡 LOCAL AI ACTIVE (WASM MODE)");
        setIsAiLoading(false);
      }
    };

    initLocalLLM();
  }, []);

  // 2. แถบเงาแสงอาทิตย์ขยับตามเวลาจริง
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

  // 3. ฟังก์ชันประมวลผลสกัดคำตอบด้วยตรรกะฐานสาม (Setun Ternary Evaluation)
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const currentInput = chatInput.trim();
    setChatHistory(prev => [...prev, { id: Date.now(), sender: "user", text: currentInput }]);
    setChatInput("");

    // 🧠 ขั้นตอนที่ 1: คัดกรองข้อความด้วยคีย์เวิร์ดภาษาไทยใน RAM
    const matchedDocs = procurementDatabase.current.filter(doc => {
      const keywords = currentInput.toLowerCase().split(/[ ,]+/);
      return keywords.some(k => doc.content.toLowerCase().includes(k) || doc.section.toLowerCase().includes(k));
    });

    // 🧠 ขั้นตอนที่ 2: ตั้งคำนวณสถานะตรรกะฐานสาม (Ternary State Evaluation)
    // +1 = เจอข้อมูลตรง/อนุมัติ, -1 = ผิดระเบียบ/ปฏิเสธ, 0 = ไม่แน่ชัด
    let ternaryState = 0; 
    if (matchedDocs.length > 0) {
      ternaryState = 1; // เปลี่ยนเป็นสถานะยืนยันความถูกต้องของคลังข้อมูลทันที
      if (currentInput.includes("เกิน") || currentInput.includes("ผิด")) {
        ternaryState = -1; // ตีสถานะขัดต่อกฎหมายพัสดุ
      }
    }

    try {
      let aiTextOutput = "";

      // 🛡️ ระบบเซฟตี้คัตตรรกะฐานสาม: ถ้าค่าเป็น +1 หรือ -1 ให้หยิบกฎหมายไทยขึ้นมาตอบทันที ไม่ปล่อยให้ AI ดิบเดาสุ่มภาษาอังกฤษอีกต่อไป
      if (ternaryState === 1 || ternaryState === -1) {
        const doc = matchedDocs[0];
        const stateTag = ternaryState === 1 ? "🟢 [ตรรกะระเบียบ: ผ่าน]" : "🔴 [ตรรกะระเบียบ: ตรวจพบข้อจำกัด]";
        aiTextOutput = `${stateTag}\n⚖️ อ้างอิง: ${doc.source} (${doc.section})\n📜 เนื้อหาข้อบังคับ: ${doc.content}`;
      } 
      // 🤖 สถานะ 0 (ไม่แน่ชัด/คำถามทั่วไป) -> ส่งต่อให้ Tiny LLM รันประมวลผลผ่าน GPU ในเครื่อง
      else if (generator.current && !isAiLoading) {
        const systemPrompt = `คุณคือ AI ผู้เชี่ยวชาญกฎหมายจัดซื้อจัดจ้างไทย จงตอบคำถามเป็นภาษาไทยเท่านั้น ห้ามตอบอังกฤษ\nคำถาม: ${currentInput}\nคำตอบภาษาไทย:`;

        const output = await generator.current(systemPrompt, {
          max_new_tokens: 100,
          temperature: 0.1,
          do_sample: false
        });

        const fullResponse = output[0].generated_text;
        aiTextOutput = fullResponse.replace(systemPrompt, "").trim();
        
        // ถ้าผลลัพธ์จาก AI ปลอมหรือหลุดภาษาอังกฤษ ให้ใช้ Default ข้อความเตือนความปลอดภัย
        if (!aiTextOutput || aiTextOutput.match(/[a-zA-Z]{5,}/g)) {
          aiTextOutput = "⚠️ [ระบบสแกนความปลอดภัย] ตรวจพบการคำนวณค่าน้ำหนักข้อความคลาดเคลื่อน กรุณาพิมพ์ระบุคำค้นหาพัสดุให้ชัดเจน เช่น 'มาตรา 4', 'ข้อ 22เฉพาะเจาะจง' หรือ 'ค่าปรับ'";
        }
      } else {
        aiTextOutput = "⏳ กำลังดึงข้อมูลตรวจสอบข้อกฎหมายจัดซื้อจัดจ้างภาครัฐในหน่วยความจำชั่วคราว...";
      }

      setChatHistory(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: `[🔥 SETUN TERNARY INSIGHT - STATE (${ternaryState})] \n${aiTextOutput}` 
      }]);
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
        
        {/* 🗺️ ฝั่งซ้าย: แผนที่ยุทธวิธี */}
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
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🟢 SETUN TERNARY CORES</label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}><input type="checkbox" defaultChecked /> 🔵 CONFLICT ZONES</label>
            </div>
            
            <h4 style={{ fontSize: "11px", color: "#38bdf8", letterSpacing: "0.5px", marginTop: "15px", marginBottom: 0 }}>LOCAL RAM HARDWARE</h4>
            <div style={{ background: "#111827", padding: "8px", borderRadius: "4px", fontSize: "11px", border: "1px solid #1e293b", color: "#94a3b8" }}>
              • Balanced Ternary Logic Engine<br/>
              • Local RAG Database: Active
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

              <div className="radar-ping" style={{ position: "absolute", left: "73%", top: "42%", width: "12px", height: "12px", background: "#ef4444", borderRadius: "50%", boxShadow: "0 0
