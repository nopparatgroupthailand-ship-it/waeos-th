"use client";

import React, { useState, useEffect } from "react";

export default function DebugImage() {
  const [imgStatus, setImgStatus] = useState<string>("กำลังตรวจสอบช่องสัญญาณภาพ...");
  const [resolvedPath, setResolvedPath] = useState<string>("");
  const imageName = "Gemini_Generated_Image_nvm58snvm58snvm5.png";

  useEffect(() => {
    // เช็คพิกัดปัจจุบันของโดเมนที่รันอยู่บน Vercel
    setResolvedPath(`${window.location.origin}/${imageName}`);
  }, []);

  return (
    <div style={{ padding: "20px", backgroundColor: "#000", color: "#fff", fontFamily: "monospace", minHeight: "100vh" }}>
      <h2 style={{ color: "#ffaa00" }}>🚨 ระบบวิเคราะห์เครือข่าย Assets (Image Debugger)</h2>
      
      <div style={{ border: "1px dashed #444", padding: "15px", marginBottom: "20px", backgroundColor: "#050505" }}>
        <p><strong>[1] ตรวจสอบสิทธิ์และ Path ปลายทาง:</strong></p>
        <p style={{ color: "#00ffcc" }}>URL ที่ระบบพยายามเรียก: <a href={`/${imageName}`} target="_blank" rel="noreferrer" style={{ color: "#00ffcc" }}>{resolvedPath}</a></p>
        <p style={{ color: "#aaa" }}>💡 ลองคลิกลิงก์ด้านบน: ถ้าขึ้น 404 แสดงว่ารูปไม่ได้อยู่ในโฟลเดอร์ public หรือพิมพ์ชื่อตัวเล็ก/ตัวใหญ่ไม่ตรงกันบน Vercel</p>
      </div>

      <div style={{ border: "1px dashed #444", padding: "15px", backgroundColor: "#050505" }}>
        <p><strong>[2] ตรวจจับพฤติกรรมแท็ก &lt;img&gt; เรียลไทม์:</strong></p>
        <p>สถานะปัจจุบัน: <span style={{ color: imgStatus.includes("สำเร็จ") ? "#00ff00" : "#ff3333", fontWeight: "bold" }}>{imgStatus}</span></p>
        
        {/* แท็กดักจับ Event */}
        <img 
          src={`/${imageName}`}
          alt="Test Stream"
          style={{ width: "200px", height: "auto", border: "1px solid #333", marginTop: "10px", display: "block" }}
          onLoad={() => {
            setImgStatus("✅ เชื่อมต่อสำเร็จ! ระบบดึงภาพขึ้นจอควบคุมได้ปกติ");
          }}
          onError={(e) => {
            setImgStatus("❌ ล้มเหลว (404 Not Found / ถูกบล็อกสิทธิ์)! เบราว์เซอร์ไม่สามารถเข้าถึงไฟล์ภาพที่ระบุได้");
          }}
        />
      </div>

      <div style={{ marginTop: "20px", color: "#666", fontSize: "12px" }}>
        *วิธีแก้ด่วน: ย้ายไฟล์ภาพไปไว้ที่คอมพิวเตอร์ในโฟลเดอร์ <code>โปรเจกต์/public/Gemini_Generated_Image_nvm58snvm58snvm5.png</code> แล้วกด Push ขึ้น Vercel ใหม่อีกครั้งครับ
      </div>
    </div>
  );
}
