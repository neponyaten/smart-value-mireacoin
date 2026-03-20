import Link from "next/link";
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
          href="https://t.me/mireacoin"
          target="_blank"
          className="flex items-center gap-2 text-gray-300 hover:text-neon transition"
        >
          <FaTelegramPlane size={18} />
          <span className="text-sm">t.me/mireacoin</span>
        </a>

        {/* Кнопка */}
        <Link
          href="/auth"
          className="px-10 py-3 rounded-full bg-neon text-black font-semibold shadow-neon hover:scale-105 active:scale-95 transition duration-200"
        >
          Авторизоваться
        </Link>
      </div>
    </footer>
  );
}