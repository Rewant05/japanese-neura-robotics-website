"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const logs = [
  "神経回路初期化",
  "光学配列 // 校正中",
  "トルクバス // 接続済み",
  "触覚外皮 // 圧力地図準備完了",
  "群リンク // 256機体同期完了",
  "人工知能制御系 // 安全確認",
  "ニューラコア // 準備完了",
];

export function CinematicLoader({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const reduceMotion = useReducedMotion();
  const activeLogs = useMemo(() => {
    const count = Math.max(1, Math.ceil((progress / 100) * logs.length));
    return logs.slice(0, count);
  }, [progress]);

  useEffect(() => {
    if (reduceMotion) {
      const shortTimer = window.setTimeout(() => {
        setProgress(100);
        setVisible(false);
        onDone();
      }, 650);
      return () => window.clearTimeout(shortTimer);
    }

    const interval = window.setInterval(() => {
      setProgress((value) => {
        const next = Math.min(100, value + (value < 70 ? 4 : 2));
        if (next >= 100) {
          window.clearInterval(interval);
          window.setTimeout(() => {
            setVisible(false);
            onDone();
          }, 520);
        }
        return next;
      });
    }, 76);

    return () => window.clearInterval(interval);
  }, [onDone, reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-graphite text-white"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container-x grid min-h-[70vh] grid-cols-1 items-center gap-10 lg:grid-cols-[.85fr_1fr]">
            <div className="relative mx-auto aspect-square w-[min(420px,78vw)]">
              <div className="absolute inset-0 border border-cyan/20" />
              <div className="absolute left-1/2 top-1/2 h-[46%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-[48%] border border-white/26 bg-white/[.03] shadow-hud">
                <div className="absolute inset-[14%] rounded-[50%] border border-cyan/45 bg-black">
                  <motion.div
                    className="absolute inset-[22%] rounded-[50%] bg-cyan shadow-[0_0_54px_rgba(56,232,255,.72)]"
                    animate={{
                      scale: [0.75, 1, 0.72],
                      x: [-10, 12, 0],
                    }}
                    transition={{
                      duration: 1.6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute inset-x-0 top-1/2 h-px bg-laser"
                    animate={{ y: [-36, 36, -36] }}
                    transition={{ duration: 0.9, repeat: Infinity }}
                  />
                </div>
              </div>
              <motion.div
                className="absolute inset-x-[12%] top-1/2 h-px bg-cyan/80"
                animate={{ scaleX: [0.25, 1, 0.25], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 0.64, repeat: Infinity }}
              />
              <div className="absolute bottom-8 left-8 right-8 h-1 bg-white/10">
                <motion.div
                  className="h-full bg-cyan"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="tech-border scanline p-6 md:p-8">
              <p className="hud-label">ニューラ・ロボティクス / 起動シーケンス</p>
              <div className="mt-8 flex items-end justify-between gap-6">
                <h1 className="text-4xl font-semibold uppercase text-white md:text-6xl">
                  神経システム初期化中
                </h1>
                <span className="font-mono text-4xl text-cyan">
                  {progress.toString().padStart(3, "0")}%
                </span>
              </div>
              <div className="mt-8 space-y-3 font-mono text-sm text-white/68">
                {activeLogs.map((log) => (
                  <motion.p
                    key={log}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="h-1.5 w-1.5 bg-cyan" />
                    {log}
                  </motion.p>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
