"use client";

import React, { useState } from "react";

export default function WorldMap3D() {
  // สเตตัสสำหรับสลับโหมดจอภาพ: 'tactical' (แผนที่ 8-bit) หรือ 'live' (จอ monitor สด)
  const [viewMode, setViewMode] = useState<"tactical" | "live">("tactical");

  // พิกัดจุดตรวจการทางยุทธวิธี
  const signalNodes = [
    { id: 1, top: "25%", left: "28%", color: "#00f0ff", type: "Normal" },
    { id: 2, top: "18%", left: "51%", color: "#ffaa00", type: "Elevated" },
    { id: 3, top: "22%", left: "65%", color: "#ff3333", type: "High Alert" },
    { id: 4, top: "43%", left: "32%", color: "#ff3333", type: "High Alert" },
    { id: 5, top: "49%", left: "38%", color: "#ff3333", type: "High Alert" },
    { id: 6, top: "29%", left: "82%", color: "#ff3333", type: "High Alert" },
    { id: 7, top: "52%", left: "81%", color: "#ffaa00", type: "Elevated" },
  ];

  return (
    <div 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "100%", 
        minHeight: "530px",
        backgroundColor: "#060a0f",
        border: "2px solid #1a2530",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.9)"
      }}
    >
      {/* ================= แผงควบคุมการสลับช่องสัญญาณภาพ (TOP CONTROL BAR) ================= */}
      <div 
        style={{ 
          position: "absolute", 
          top: "12px", 
          left: "12px", 
          right: "12px",
          display: "flex",
          justifyContent: "between",
          alignItems: "center",
          zIndex: 20,
          pointerEvents: "none" // ให้คลิกทะลุไปกดปุ่มด้านในได้
        }}
      >
        {/* ฝั่งซ้าย: ป้ายสถานะระบบ */}
        <div 
          style={{ 
            backgroundColor: "rgba(6, 10, 15, 0.9)", 
            border: "1px solid #ff3333",
            padding: "6px 12px", 
            borderRadius: "4px",
            fontSize: "11px",
            fontFamily: "monospace",
            color: "#fff",
            letterSpacing: "1px",
            pointerEvents: "auto"
          }}
        >
          <span style={{ color: "#ff3333", marginRight: "6px", animation: "blink 1s infinite" }}>●</span> 
          {viewMode === "tactical" ? "TACTICAL THEATER: DEFCON 1" : "LIVE MONITORING ACTIVE"}
        </div>

        {/* ฝั่งขวา: ปุ่มกดสลับโหมดการทำงาน */}
        <div style={{ marginLeft: "auto", pointerEvents: "auto" }}>
          <button
            onClick={() => setViewMode(viewMode === "tactical" ? "live" : "tactical")}
            style={{
              backgroundColor: viewMode === "live" ? "#ffaa00" : "#00f0ff",
              color: "#000",
              border: "none",
              padding: "6px 14px",
              borderRadius: "4px",
              fontFamily: "monospace",
              fontWeight: "bold",
              fontSize: "11px",
              cursor: "pointer",
              boxShadow: "0 0 10px rgba(0,240,255,0.5)",
              transition: "all 0.2s"
            }}
          >
            🛰️ สลับจอ: {viewMode === "tactical" ? "LIVE STREAM" : "8-BIT MAP"}
          </button>
        </div>
      </div>

      {/* ================= โหมดที่ 1: แผนที่ยุทธวิธี 8-BIT (TACTICAL THEATER) ================= */}
      {viewMode === "tactical" && (
        <div 
          style={{ 
            width: "100%", 
            height: "100%", 
            position: "absolute",
            backgroundImage: "url('/Gemini_Generated_Image_nvm58snvm58snvm5.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* เส้นกริดครอบจอบางๆ */}
          <div 
            style={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: "linear-gradient(rgba(18, 24, 32, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(18, 24, 32, 0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              pointerEvents: "none",
              zIndex: 1
            }}
          />

          {/* เรนเดอร์พิกัดดวงไฟกะพริบ */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 5 }}>
            {signalNodes.map((node) => (
              <div
                key={node.id}
                style={{
                  position: "absolute",
                  top: node.top,
                  left: node.left,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <div 
                  style={{
                    position: "absolute",
                    top: "-10px", left: "-10px",
                    width: "32px", height: "32px",
                    borderRadius: "50%",
                    border: `2px solid ${node.color}`,
                    animation: "tacticalPulse 2s infinite ease-out",
                    opacity: 0
                  }}
                />
                <div 
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: node.color,
                    boxShadow: `0 0 15px ${node.color}, 0 0 5px #fff`
                  }}
                  title={`Node ${node.id}`}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= โหมดที่ 2: ดึงระบบแผนที่สดภายนอก (LIVE MONITOR STREAM) ================= */}
      {viewMode === "live" && (
        <div style={{ width: "100%", height: "100%", paddingTop: "50px", boxSizing: "border-box" }}>
          <iframe
            src="https://worldmonitor.app/?view=global" // ลิงก์ระบบตรวจสอบสถานการณ์แผนที่ภายนอก
            style={{
              width: "100%",
              height: "100%",
              minHeight: "475px",
              border: "none",
              backgroundColor: "#0c0f12"
            }}
            allow="autoplay; encrypted-media"
            title="Global Situation Live Stream"
          />
        </div>
      )}

      {/* แถบรายงานเวอร์ชันด้านล่าง */}
      <div 
        style={{
          position: "absolute",
          bottom: "8px",
          right: "12px",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "monospace",
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.6)",
          padding: "2px 6px",
          borderRadius: "3px"
        }}
      >
        {viewMode === "tactical" ? "PROTOMAPS 8-BIT THEATER v2.8.0" : "EXTERNAL INTELLIGENCE FEED"}
      </div>

      {/* แอนิเมชันสไตล์เรดาร์ทหาร */}
      <style>{`
        @keyframes tacticalPulse {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
