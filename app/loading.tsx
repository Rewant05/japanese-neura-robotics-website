export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite text-chrome">
      <div className="tech-border scanline w-[min(520px,calc(100vw-32px))] p-6">
        <p className="hud-label">ニューラシステム起動中</p>
        <div className="mt-5 h-1 w-full bg-white/10">
          <div className="h-full w-2/3 bg-cyan" />
        </div>
      </div>
    </main>
  );
}
