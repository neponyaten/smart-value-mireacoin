import Reveal from "@/components/landing/Reveal";

export default function SectionAbout() {
  return (
    <section id="about" className="px-4 mt-16 md:mt-24">
      <div className="mx-auto w-full max-w-6xl grid md:grid-cols-2 gap-10 items-start">
        <Reveal>
          <div className="glass rounded-[34px] border border-white/10 p-8">
            <h2 className="text-4xl font-extrabold tracking-tight text-glow">
              О ПРОЕКТЕ
            </h2>

            <p className="mt-5 text-gray-200/90 leading-relaxed">
              Проект создан, чтобы стимулировать активность и посещаемость,
              вознаграждая студентов за их достижения и участие.
            </p>

            <p className="mt-4 text-gray-200/90 leading-relaxed">
              Каждый ваш вход в систему, каждый успешно сданный проект, каждое
              посещенное мероприятие конвертируется в уникальные койны.
            </p>

            <p className="mt-4 text-gray-200/90 leading-relaxed">
              <span className="text-neon font-semibold">SMART EXCHANGE</span> — конвертация
              вашего времени в реальные активы.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="glass rounded-[34px] border border-white/10 p-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-glow">
              ЗАЧЕМ ЭТО СТУДЕНТУ
            </h2>

            <p className="mt-5 text-gray-200/90 leading-relaxed">
              <span className="text-neon font-semibold">SMART VALUE</span>{" "}
              превращает твою учебу в увлекательную игру. Твоя посещаемость и
              активность теперь имеют цифровой вес.
            </p>

            <p className="mt-4 text-gray-200/90 leading-relaxed">
              Получай редкие артефакты, создавай уникальный облик своего профиля и
              докажи, что твоя группа — самая мощная в РТУ МИРЭА.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}