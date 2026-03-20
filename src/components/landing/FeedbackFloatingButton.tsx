import { FaTelegramPlane } from "react-icons/fa";

export default function FeedbackFloatingButton() {
  return (
    <a
      href="https://t.me/MireaCoin"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-slate-900/75 px-4 py-2.5 text-xs font-semibold text-cyan-100 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-cyan-200/50"
    >
      <FaTelegramPlane size={14} />
      Сообщить об ошибке
    </a>
  );
}
