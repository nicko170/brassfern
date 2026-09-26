/**
 * Poster — a static spec-sheet elevation of the configured pack.
 * Shown when WebGL is unavailable or the visitor prefers reduced motion.
 * Colours follow the live configuration; scale follows the model.
 */

interface PosterProps {
  body: string
  pocket: string
  trim: string
  modelName: string
  scaleY: number
}

export default function Poster({ body, pocket, trim, modelName, scaleY }: PosterProps) {
  const id = 'opc-poster'
  return (
    <svg
      className="opc-poster-svg"
      viewBox="0 0 320 400"
      role="img"
      aria-label={`Technical elevation of the ${modelName} pack in the selected colourway`}
    >
      {/* contour lines */}
      <g fill="none" stroke="rgba(233,229,216,0.07)" strokeWidth="1">
        <path d="M-10 60 Q80 30 160 60 T330 60" />
        <path d="M-10 120 Q80 90 160 120 T330 120" />
        <path d="M-10 330 Q80 300 160 330 T330 330" />
        <path d="M-10 385 Q80 355 160 385 T330 385" />
      </g>

      <g transform={`translate(160 208) scale(1 ${scaleY}) translate(-160 -218)`}>
        {/* shoulder straps */}
        <rect x="84" y="36" width="30" height="200" rx="15" fill={trim} opacity="0.85" />
        <rect x="206" y="36" width="30" height="200" rx="15" fill={trim} opacity="0.85" />
        {/* hip belt */}
        <rect x="58" y="292" width="204" height="40" rx="20" fill={trim} opacity="0.9" />
        <rect x="140" y="302" width="40" height="20" rx="6" fill="#232726" />

        {/* main body */}
        <rect x="80" y="58" width="160" height="268" rx="42" fill={body} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
        <rect x="90" y="70" width="140" height="244" rx="34" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeDasharray="4 5" />
        {/* climbing-shadow tonal side */}
        <path d="M80 100 a42 42 0 0 1 42 -42 l0 310 a42 42 0 0 1 -42 -42 z" fill="rgba(0,0,0,0.14)" />

        {/* brain lid */}
        <rect x="72" y="40" width="176" height="58" rx="26" fill={body} stroke="rgba(0,0,0,0.4)" strokeWidth="2" />
        <rect x="118" y="50" width="84" height="20" rx="10" fill={pocket} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

        {/* daisy chains */}
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x="97" y={118 + i * 34} width="11" height="20" rx="3" fill={trim} />
            <rect x="212" y={118 + i * 34} width="11" height="20" rx="3" fill={trim} />
          </g>
        ))}

        {/* side bottle pockets */}
        <rect x="52" y="218" width="30" height="72" rx="13" fill={pocket} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
        <rect x="238" y="218" width="30" height="72" rx="13" fill={pocket} stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />

        {/* front pocket */}
        <rect x="106" y="172" width="108" height="128" rx="30" fill={pocket} stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
        <path d="M112 200 a48 40 0 0 1 96 0" fill="none" stroke="#232726" strokeWidth="3" />
        <rect x="202" y="192" width="6" height="16" rx="3" fill="#b3945a" />

        {/* strap buckles */}
        <rect x="88" y="222" width="22" height="12" rx="3" fill="#232726" />
        <rect x="210" y="222" width="22" height="12" rx="3" fill="#232726" />
      </g>

      {/* spec callouts */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize="8.5" letterSpacing="1.5" fill="rgba(233,229,216,0.55)">
        <line x1="248" y1="60" x2="286" y2="44" stroke="rgba(233,229,216,0.35)" strokeWidth="1" />
        <text x="288" y="40">BRAIN LID</text>
        <line x1="223" y1="150" x2="286" y2="120" stroke="rgba(233,229,216,0.35)" strokeWidth="1" />
        <text x="288" y="117">DAISY CHAIN</text>
        <line x1="52" y1="250" x2="34" y2="236" stroke="rgba(233,229,216,0.35)" strokeWidth="1" />
        <text x="4" y="232">BOTTLE PKT</text>
        <line x1="62" y1="312" x2="34" y2="330" stroke="rgba(233,229,216,0.35)" strokeWidth="1" />
        <text x="4" y="344">HIP BELT</text>
        <line x1="214" y1="260" x2="286" y2="286" stroke="rgba(233,229,216,0.35)" strokeWidth="1" />
        <text x="288" y="290">SHOVE-IT</text>
      </g>

      <desc id={id}>{modelName} technical drawing</desc>
    </svg>
  )
}
