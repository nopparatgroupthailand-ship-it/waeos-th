"use client";

export default function WorldMap3D() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-white p-8 relative overflow-hidden select-none">
      {/* ลายเส้น Grid ตกแต่งด้านหลัง */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />
      
      {/* แสงเรืองออร่าโทน Teal (แบบไทย) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="z-10 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
          SYSTEM ONLINE
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">
          WAEOS-TH MONITORING
        </h2>
        <p className="text-sm text-slate-400 max-w-sm mx-auto">
          ระบบขับเคลื่อนข้อมูลอัตโนมัติ พร้อมประมวลผลโครงสร้างแผงควบคุมเพื่อการตรวจสอบภายใน
        </p>
      </div>
    </div>
  );
}
