export default function SectionTeam() {
  return (
    <section className="px-4 mt-16 md:mt-24">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-center text-5xl font-extrabold tracking-tight">
          MireaCoin <span className="text-gray-200/80 font-semibold">TEAM</span>
        </h2>

        <div className="mt-10 grid md:grid-cols-2 gap-8">
          <div className="glass rounded-[34px] border border-white/10 p-7">
            <div className="rounded-2xl bg-black/25 border border-neon/30 p-3">
              <div className="h-64 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Фото CEO #1 (placeholder)</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-white font-semibold">KIRILL CHEKUNOV</div>
              <div className="text-gray-400 text-sm">CEO</div>
            </div>
          </div>

          <div className="glass rounded-[34px] border border-white/10 p-7">
            <div className="rounded-2xl bg-black/25 border border-neon/30 p-3">
              <div className="h-64 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center">
                <div className="text-gray-400 text-sm">Фото CEO #2 (placeholder)</div>
              </div>
            </div>

            <div className="mt-4 text-center">
              <div className="text-white font-semibold">DENIS KOSOUROV</div>
              <div className="text-gray-400 text-sm">CEO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}