"use client";

import React from "react";
// เรียกใช้ Component แผนที่ที่เราปรับปรุงให้เป็นแบบ 8-Bit Red Alert เต็มผืนแล้ว
import WorldMap3D from "./WorldMap3D";

export default function Home() {
  return (
    <main className="w-screen min-h-screen bg-[#050505] text-white overflow-x-hidden flex flex-col m-0 p-0">
      
      {/* ดึงแผนที่ยุทธวิธี WorldMonitor 8-Bit กางออกเต็มผืนหน้าจอขอบชนขอบ 
        ไม่มีการแบ่งช่อง 70/30 หรือ 50/50 แนวตั้งอีกต่อไป สัดส่วนไหลยาวตามหน้าจอตัวอย่างเป๊ะๆ
      */}
      <div className="w-full flex-1 min-h-screen flex flex-col">
        <WorldMap3D />
      </div>

    </main>
  );
}
