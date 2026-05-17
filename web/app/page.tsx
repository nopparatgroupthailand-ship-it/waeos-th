"use client";
import { useState } from "react";
// เรียกใช้งานไฟล์ลูกโลก 3 มิติที่เราสร้างไว้
import WorldMap3D from "./WorldMap3D";

export default function Home() {
  const [urlInput, setUrlInput] = useState("");
  const [savedUrls, setSavedUrls] = useState<string[]>([]);

  const handleAddUrl = () => {
    if (urlInput.trim() !== "") {
      setSavedUrls([...savedUrls, urlInput]);
      setUrlInput("");
    }
  };

  return (
    <main className="flex h-screen w-screen bg-black text-white overflow-hidden">
      
      {/* ฝั่งซ้าย: พื้นที่แสดงผลลูกโลก 3 มิติ สว่าง-มืด (ปรับปรุงตัวเรียกใช้งานแล้ว) */}
      <div className="w-1/2 h-full border-r border-gray-800 flex flex-col items-center justify-center relative bg-gradient-to-b from-gray-900 to-black">
        <h1 className="absolute top-5 text-xl font-bold tracking-wider text-teal-400 z-10">WORLD MONITOR THAI MVP</h1>
        
        {/* เรียกตัวลูกโลก 3D ขึ้นมาทำงานเต็มพื้นที่ฝั่งซ้าย */}
        <div className="w-full h-full">
          <WorldMap3D />
        </div>
      </div>

      {/* ฝั่งขวา: แผงควบคุมช่องข่าว และ Tiny AI */}
      <div className="w-1/2 h-full flex flex-col p-6 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-300">📌 แผงควบคุมและช่องข้อมูล (Multi-panel)</h2>
        
        {/* ช่องกรอก URL แหล่งข้อมูลไทย */}
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            placeholder="วาง URL ข่าว หรือ API ไทย เช่น https://data.go.th" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-gray-900 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-teal-500 text-white"
          />
          <button onClick={handleAddUrl} className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded text-sm font-medium transition">
            เพิ่มช่อง
          </button>
        </div>

        {/* ส่วนแสดงผลช่องย่อยๆ (Multi-panels) ตาม URL ที่เพิ่ม */}
        <div className="grid grid-cols-1 gap-4 flex-1">
          {savedUrls.length === 0 ? (
            <div className="border border-dashed border-gray-800 rounded flex items-center justify-center text-gray-600 text-sm p-10">
              ยังไม่มีข้อมูล กรุณาเพิ่ม URL ข่าวสารของคุณด้านบน
            </div>
          ) : (
            savedUrls.map((url, index) => (
              <div key={index} className="border border-gray-800 bg-gray-950 rounded p-4 h-64 flex flex-col">
                <div className="text-xs text-gray-500 mb-2 truncate">ช่องที่ {index + 1}: {url}</div>
                <iframe src={url} className="w-full flex-1 bg-white rounded" title={`panel-${index}`} />
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}