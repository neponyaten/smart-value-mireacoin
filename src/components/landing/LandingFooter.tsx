import { FaTelegramPlane } from "react-icons/fa";

export default function LandingFooter() {
  return (
    <footer className="px-4 pb-10">
      <div className="mx-auto w-full max-w-6xl glass rounded-3xl border border-white/10 p-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Лого */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black/30 border border-white/10 flex items-center justify-center">
            <span className="text-neon font-bold">M</span>
          </div>
          <div className="text-gray-200 text-sm">MireaCoin</div>
        </div>

        {/* Telegram */}
        <a
          href="https://t.me/MireaCoin"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-gray-300 hover:text-neon transition"
        >
          <FaTelegramPlane size={18} />
          <span className="text-sm">t.me/mireacoin</span>
        </a>

        <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.14em] text-cyan-100/90">
          Beta
        </span>
      </div>
    </footer>
  );
}