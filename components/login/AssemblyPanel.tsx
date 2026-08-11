'use client'

/**
 * The right half of the login screen: a page assembling itself out of blocks.
 *
 * The references we looked at all fill this space with an abstract gradient or
 * a stock photo, which would sit equally well on a bank or a dentist. Scaffold
 * can show the thing it actually does before anyone signs up, and it costs four
 * divs and a keyframe loop rather than the real block renderers.
 *
 * Every animation here is suppressed by the reduced-motion rule in globals.css.
 */
export default function AssemblyPanel() {
  return (
    <div
      className="relative hidden overflow-hidden lg:flex lg:items-center lg:justify-center"
      style={{
        // A real gradient ground, not a near-black one with faint glows on top.
        background: 'linear-gradient(145deg, #7f1d3a 0%, #be123c 32%, #ea580c 68%, #f59e0b 100%)',
      }}
    >
      {/* Heat blooms, screened over the gradient so the corners glow. */}
      <div
        aria-hidden="true"
        className="absolute -inset-1/4"
        style={{
          background:
            'radial-gradient(40% 40% at 18% 14%, rgba(255,90,140,.55), transparent 70%),' +
            'radial-gradient(45% 45% at 88% 86%, rgba(255,196,60,.55), transparent 70%)',
          mixBlendMode: 'screen',
          filter: 'blur(10px)',
        }}
      />

      {/* Builder grid. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.14) 1px, transparent 1px),' +
            'linear-gradient(90deg, rgba(255,255,255,.14) 1px, transparent 1px)',
          backgroundSize: '34px 34px',
          maskImage: 'radial-gradient(75% 65% at 50% 45%, #000 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 65% at 50% 45%, #000 35%, transparent 100%)',
        }}
      />

      {/* Centre scrim. The gradient's orange end cannot carry white text at AA,
          so the area holding copy is darkened back down. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(66% 58% at 50% 54%, rgba(12,10,9,.88), rgba(12,10,9,.45) 62%, transparent 100%)',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center gap-8 px-10">
        <div className="w-full max-w-[290px] rounded-xl border border-white/20 bg-black/45 p-3 shadow-pop backdrop-blur-md">
          <div className="flex flex-col gap-2">
            <div className="assembly-block h-14 rounded-md bg-gradient-to-br from-white/85 to-white/55 [animation-delay:0ms]" />
            <div className="assembly-block grid h-10 grid-cols-3 gap-1.5 [animation-delay:450ms]">
              <i className="rounded bg-white/25 ring-1 ring-inset ring-white/30" />
              <i className="rounded bg-white/25 ring-1 ring-inset ring-white/30" />
              <i className="rounded bg-white/25 ring-1 ring-inset ring-white/30" />
            </div>
            <div className="assembly-block h-6 rounded-md bg-white/20 ring-1 ring-inset ring-white/25 [animation-delay:900ms]" />
            <div className="assembly-block h-9 rounded-md bg-builder-accent [animation-delay:1350ms]" />
          </div>
        </div>

        <div className="max-w-xs text-center">
          <p className="text-lg font-semibold leading-snug text-white drop-shadow">
            Drag a block. That is the whole learning curve.
          </p>
          <p className="mt-2 text-sm leading-relaxed text-white">
            Six block types, a live canvas, and an export button that gives you a single
            HTML file you can host anywhere.
          </p>
        </div>
      </div>

      <style>{`
        .assembly-block {
          opacity: 0;
          animation: assembly 5.5s cubic-bezier(.2,0,0,1) infinite;
        }
        @keyframes assembly {
          0%   { opacity: 0; transform: translateY(-10px) scale(.97); }
          9%   { opacity: 1; transform: translateY(0) scale(1); }
          82%  { opacity: 1; transform: translateY(0) scale(1); }
          92%, 100% { opacity: 0; transform: translateY(6px) scale(.99); }
        }
        @media (prefers-reduced-motion: reduce) {
          .assembly-block { opacity: 1; animation: none; }
        }
      `}</style>
    </div>
  )
}
