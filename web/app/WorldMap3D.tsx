"use client";

import React from "react";

export default function WorldMap3D() {
  // จำลองพิกัดดวงไฟสัญญาณตามยุทธวิธี
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
        minHeight: "500px",
        backgroundColor: "#080c10",
        // ดึงรูปภาพพื้นหลังจากห้องควบคุมระบบ
        backgroundImage: "url('/Gemini_Generated_Image_nvm58snvm58snvm5.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        border: "2px solid #1a2530",
        borderRadius: "6px",
        overflow: "hidden",
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.8)"
      }}
    >
      {/* เส้นกริดดิจิทัลครอบทับจอบางๆ */}
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

      {/* แผงข้อมูลด่วนมุมซ้ายบนของจอภาพ (SITUATION ROOM OVERLAY) */}
      <div 
        style={{ 
          position: "absolute", 
          top: "12px", 
          left: "12px", 
          backgroundColor: "rgba(6, 10, 15, 0.85)", 
          border: "1px solid #ff3333",
          padding: "6px 12px", 
          borderRadius: "4px",
          fontSize: "11px",
          fontFamily: "monospace",
          color: "#fff",
          zIndex: 10,
          letterSpacing: "1px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)"
        }}
      >
        <span style={{ color: "#ff3333", marginRight: "6px" }}>●</span> 
        RED ALERT : DEFCON 1 ACTIVE
      </div>

      {/* ระบบเรนเดอร์พิกัดดวงไฟกะพริบ (Tactical Nodes Layer) */}
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
            {/* เอฟเฟกต์วงแหวนคลื่นวิทยุกระจายตัว (Pulse Ring) */}
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
            {/* แกนดวงไฟหลักตรงกลาง */}
            <div 
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                backgroundColor: node.color,
                boxShadow: `0 0 15px ${node.color}, 0 0 5px #fff`,
                cursor: "pointer"
              }}
              title={`Node ${node.id} : ${node.type}`}
            />
          </div>
        ))}
      </div>

      {/* ✅ แก้ไขจุดนี้: เอา attribute 'tag' ออก เพื่อให้ TypeScript ปล่อยผ่านสำเร็จ */}
      <style>{`
        @keyframes tacticalPulse {
          0% { transform: scale(0.2); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>

      {/* แถบรายงานสิทธิ์สัดส่วนแผนที่ด้านล่าง */}
      <div 
        style={{
          position: "absolute",
          bottom: "8px",
          right: "12px",
          fontSize: "10px",
          color: "rgba(255,255,255,0.4)",
          fontFamily: "monospace",
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: "2px 6px",
          borderRadius: "3px"
        }}
      >
        PROTOMAPS 8-BIT ENGAGEMENT THEATER v2.8.0
      </div>
    </div>
  );
}
