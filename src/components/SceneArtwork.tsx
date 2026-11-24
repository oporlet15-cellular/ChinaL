interface SceneArtworkProps {
  sceneKey: string;
  className?: string;
}

export function SceneArtwork({ sceneKey, className = 'w-full h-44' }: SceneArtworkProps) {
  switch (sceneKey) {
    // ============ CARTOON 1: MIMI THE CAT ============
    case 'cat-1':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Hungry orange kitten in a sunny kitchen">
          <rect width="320" height="180" fill="#FEF3C7" />
          <circle cx="272" cy="36" r="22" fill="#FDE047" opacity="0.85" />
          <rect x="0" y="132" width="320" height="48" fill="#F5D0A9" />
          {/* Kitchen window */}
          <rect x="24" y="22" width="76" height="62" rx="6" fill="#E0F2FE" stroke="#D97706" strokeWidth="3" />
          <line x1="62" y1="22" x2="62" y2="84" stroke="#D97706" strokeWidth="2" />
          <line x1="24" y1="53" x2="100" y2="53" stroke="#D97706" strokeWidth="2" />
          {/* Thought bubble with fish */}
          <ellipse cx="222" cy="56" rx="44" ry="26" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="2" />
          <circle cx="176" cy="84" r="6" fill="#FFFFFF" />
          <circle cx="164" cy="96" r="4" fill="#FFFFFF" />
          <path d="M206 56 Q220 44 234 56 Q220 68 206 56 Z" fill="#38BDF8" />
          <polygon points="232,56 244,48 244,64" fill="#38BDF8" />
          <circle cx="215" cy="54" r="2" fill="#0F172A" />
          {/* Orange cat */}
          <ellipse cx="136" cy="130" rx="28" ry="22" fill="#F97316" />
          <circle cx="136" cy="100" r="22" fill="#FB923C" />
          <polygon points="118,86 124,68 134,82" fill="#FB923C" />
          <polygon points="154,86 148,68 138,82" fill="#FB923C" />
          <circle cx="129" cy="98" r="3" fill="#1F2937" />
          <circle cx="143" cy="98" r="3" fill="#1F2937" />
          <path d="M132 106 Q136 102 140 106" stroke="#1F2937" strokeWidth="2" fill="none" />
          <path d="M162 132 Q184 118 178 102" stroke="#F97316" strokeWidth="6" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'cat-2':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Kitten peeking under a wooden table">
          <rect width="320" height="180" fill="#FFEDD5" />
          <rect x="0" y="138" width="320" height="42" fill="#E7C8A6" />
          {/* Table */}
          <rect x="44" y="54" width="232" height="16" rx="4" fill="#92400E" />
          <rect x="64" y="70" width="12" height="74" fill="#78350F" />
          <rect x="244" y="70" width="12" height="74" fill="#78350F" />
          {/* Cat peeking */}
          <ellipse cx="152" cy="134" rx="26" ry="18" fill="#F97316" />
          <circle cx="180" cy="124" r="19" fill="#FB923C" />
          <polygon points="168,110 172,96 181,107" fill="#FB923C" />
          <polygon points="193,110 190,96 182,107" fill="#FB923C" />
          <circle cx="185" cy="122" r="2.8" fill="#1F2937" />
          <text x="210" y="106" fontSize="22" fontWeight="700" fill="#C84B31">?</text>
          <text x="226" y="96" fontSize="15" fontWeight="700" fill="#C84B31">?</text>
        </svg>
      );
    case 'cat-3':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Big fish in a blue ceramic bowl with aroma lines">
          <rect width="320" height="180" fill="#ECFDF5" />
          <rect x="0" y="132" width="320" height="48" fill="#D1FAE5" />
          {/* Bowl */}
          <path d="M108 112 L212 112 L198 148 L122 148 Z" fill="#2563EB" />
          <ellipse cx="160" cy="112" rx="52" ry="12" fill="#60A5FA" />
          {/* Big Fish */}
          <path d="M126 108 Q158 84 186 108 Q158 124 126 108 Z" fill="#F59E0B" />
          <polygon points="184,108 202,96 202,120" fill="#D97706" />
          <circle cx="140" cy="105" r="2.5" fill="#1F2937" />
          {/* Aroma waves */}
          <path d="M135 76 Q142 64 135 52" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M160 70 Q167 56 160 42" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
          <path d="M185 76 Q192 64 185 52" stroke="#10B981" strokeWidth="3" strokeLinecap="round" fill="none" />
        </svg>
      );
    case 'cat-4':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Happy kitten smiling with hearts">
          <rect width="320" height="180" fill="#FEF2F2" />
          <rect x="0" y="136" width="320" height="44" fill="#FDE68A" />
          {/* Happy Cat */}
          <ellipse cx="160" cy="130" rx="30" ry="22" fill="#F97316" />
          <circle cx="160" cy="96" r="24" fill="#FB923C" />
          <polygon points="140,80 146,60 156,76" fill="#FB923C" />
          <polygon points="180,80 174,60 164,76" fill="#FB923C" />
          {/* Happy closed eyes ^ ^ */}
          <path d="M148 95 Q152 89 156 95" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M164 95 Q168 89 172 95" stroke="#1F2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M155 103 Q160 109 165 103" stroke="#1F2937" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          {/* Sparkles / Hearts */}
          <text x="96" y="72" fontSize="22" fill="#EF4444">♥</text>
          <text x="206" y="68" fontSize="24" fill="#EF4444">♥</text>
          <text x="224" y="102" fontSize="16" fill="#F59E0B">✦</text>
        </svg>
      );

    // ============ CARTOON 2: UMBRELLA ============
    case 'rain-1':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Rain clouds pouring outside a library">
          <rect width="320" height="180" fill="#CBD5E1" />
          <circle cx="96" cy="46" r="26" fill="#64748B" />
          <circle cx="128" cy="40" r="30" fill="#64748B" />
          <circle cx="166" cy="46" r="26" fill="#64748B" />
          <circle cx="220" cy="48" r="22" fill="#475569" />
          {[56, 88, 120, 152, 184, 216, 248].map((x) => (
            <g key={x} stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round">
              <line x1={x} y1="86" x2={x - 8} y2="108" />
              <line x1={x + 14} y1="118" x2={x + 6} y2="140" />
            </g>
          ))}
          <rect x="0" y="146" width="320" height="34" fill="#94A3B8" />
        </svg>
      );
    case 'rain-2':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Checking an empty backpack under the roof">
          <rect width="320" height="180" fill="#E2E8F0" />
          <rect x="0" y="142" width="320" height="38" fill="#CBD5E1" />
          {/* Backpack */}
          <rect x="116" y="68" width="88" height="82" rx="18" fill="#2563EB" />
          <rect x="130" y="96" width="60" height="36" rx="8" fill="#1D4ED8" />
          <path d="M142 68 Q160 44 178 68" stroke="#1E3A8A" strokeWidth="6" fill="none" />
          {/* Sweat drop & exclamation */}
          <text x="220" y="76" fontSize="28" fontWeight="700" fill="#C84B31">!</text>
          <circle cx="96" cy="76" r="8" fill="#38BDF8" />
        </svg>
      );
    case 'rain-3':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Bright yellow umbrella shared in the rain">
          <rect width="320" height="180" fill="#DBEAFE" />
          <rect x="0" y="146" width="320" height="34" fill="#93C5FD" />
          {/* Big yellow umbrella */}
          <path d="M74 98 Q160 22 246 98 Z" fill="#FACC15" stroke="#CA8A04" strokeWidth="3" />
          <line x1="160" y1="98" x2="160" y2="152" stroke="#78350F" strokeWidth="4" />
          <path d="M160 152 Q160 164 172 162" stroke="#78350F" strokeWidth="4" fill="none" strokeLinecap="round" />
          {/* Two happy silhouettes */}
          <circle cx="132" cy="122" r="14" fill="#334155" />
          <circle cx="188" cy="122" r="14" fill="#475569" />
        </svg>
      );
    case 'rain-4':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Metro station entrance glowing warmly">
          <rect width="320" height="180" fill="#E0F2FE" />
          <rect x="76" y="42" width="168" height="114" rx="10" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" />
          <rect x="96" y="56" width="128" height="28" rx="6" fill="#0284C7" />
          <text x="160" y="75" textAnchor="middle" fontSize="15" fontWeight="700" fill="#FFFFFF">METRO · 地铁</text>
          <rect x="116" y="96" width="88" height="60" fill="#FEF3C7" />
          <rect x="0" y="154" width="320" height="26" fill="#94A3B8" />
        </svg>
      );

    // ============ CARTOON 3: CAFE MIX-UP ============
    case 'cafe-1':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Iced caramel coffee cup with sparkles">
          <rect width="320" height="180" fill="#FEF3C7" />
          <rect x="0" y="138" width="320" height="42" fill="#D6B28D" />
          {/* Cup */}
          <polygon points="126,64 194,64 184,142 136,142" fill="#FDE68A" stroke="#92400E" strokeWidth="3" />
          <rect x="122" y="56" width="76" height="12" rx="4" fill="#FFFFFF" stroke="#92400E" strokeWidth="2.5" />
          <line x1="168" y1="30" x2="160" y2="62" stroke="#16A34A" strokeWidth="5" strokeLinecap="round" />
          <text x="214" y="74" fontSize="20" fill="#C84B31">?!</text>
        </svg>
      );
    case 'cafe-2':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Dark bitter Americano cup">
          <rect width="320" height="180" fill="#F5F5F4" />
          <rect x="0" y="138" width="320" height="42" fill="#D6D3D1" />
          <polygon points="126,64 194,64 184,142 136,142" fill="#44403C" stroke="#1C1917" strokeWidth="3" />
          <rect x="122" y="56" width="76" height="12" rx="4" fill="#FFFFFF" stroke="#1C1917" strokeWidth="2.5" />
          <path d="M142 42 Q148 30 142 20" stroke="#78716C" strokeWidth="2.5" fill="none" />
          <path d="M162 42 Q168 30 162 20" stroke="#78716C" strokeWidth="2.5" fill="none" />
        </svg>
      );
    case 'cafe-3':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Two coffee cups being swapped">
          <rect width="320" height="180" fill="#FFF7ED" />
          <rect x="0" y="138" width="320" height="42" fill="#FED7AA" />
          <polygon points="74,76 126,76 118,140 82,140" fill="#44403C" />
          <polygon points="194,76 246,76 238,140 202,140" fill="#F59E0B" />
          <path d="M132 70 Q160 44 188 70" stroke="#C84B31" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M188 124 Q160 150 132 124" stroke="#C84B31" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'cafe-4':
      return (
        <svg viewBox="0 0 320 180" className={className} role="img" aria-label="Warm cafe table with two cups and friendly chat">
          <rect width="320" height="180" fill="#ECFDF5" />
          <ellipse cx="160" cy="144" rx="108" ry="24" fill="#D97706" />
          <rect x="114" y="92" width="32" height="40" rx="6" fill="#FFFFFF" stroke="#92400E" strokeWidth="2.5" />
          <rect x="174" y="92" width="32" height="40" rx="6" fill="#FFFFFF" stroke="#92400E" strokeWidth="2.5" />
          <text x="160" y="64" textAnchor="middle" fontSize="22" fill="#059669">☕ 💬 ☕</text>
        </svg>
      );

    // ============ SHORT TALES COVERS (HSK 4–6) ============
    case 'tale-horse':
      return (
        <svg viewBox="0 0 400 180" className={className} role="img" aria-label="Ink-wash frontier mountains at sunset">
          <defs>
            <linearGradient id="skyHorse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="100%" stopColor="#FCA5A5" />
            </linearGradient>
          </defs>
          <rect width="400" height="180" fill="url(#skyHorse)" />
          <circle cx="312" cy="52" r="26" fill="#FEF3C7" opacity="0.9" />
          <path d="M0 140 Q80 86 165 128 T340 108 L400 130 L400 180 L0 180 Z" fill="#9A3412" opacity="0.7" />
          <path d="M0 156 Q110 118 220 150 T400 138 L400 180 L0 180 Z" fill="#7C2D12" />
        </svg>
      );
    case 'tale-noodles':
      return (
        <svg viewBox="0 0 400 180" className={className} role="img" aria-label="Warm glowing lantern in a midnight alley">
          <rect width="400" height="180" fill="#1E293B" />
          <circle cx="200" cy="76" r="54" fill="#F59E0B" opacity="0.2" />
          <circle cx="200" cy="76" r="32" fill="#F59E0B" opacity="0.35" />
          <ellipse cx="200" cy="76" rx="20" ry="26" fill="#DC2626" stroke="#FCD34D" strokeWidth="2.5" />
          <line x1="200" y1="0" x2="200" y2="50" stroke="#94A3B8" strokeWidth="2" />
          <rect x="0" y="142" width="400" height="38" fill="#0F172A" />
          <path d="M162 128 L238 128 L226 154 L174 154 Z" fill="#F8FAFC" />
          <path d="M186 116 Q190 106 186 98" stroke="#FDE68A" strokeWidth="2" fill="none" />
          <path d="M214 116 Q218 106 214 98" stroke="#FDE68A" strokeWidth="2" fill="none" />
        </svg>
      );
    case 'tale-tea':
    default:
      return (
        <svg viewBox="0 0 400 180" className={className} role="img" aria-label="Misty green tea mountains at dawn">
          <defs>
            <linearGradient id="skyTea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D1FAE5" />
              <stop offset="100%" stopColor="#F0FDF4" />
            </linearGradient>
          </defs>
          <rect width="400" height="180" fill="url(#skyTea)" />
          <path d="M0 132 Q95 72 195 118 T400 96 L400 180 L0 180 Z" fill="#6EE7B7" opacity="0.65" />
          <path d="M0 152 Q125 104 250 144 T400 128 L400 180 L0 180 Z" fill="#047857" opacity="0.8" />
          <ellipse cx="200" cy="116" rx="140" ry="12" fill="#FFFFFF" opacity="0.55" />
        </svg>
      );
  }
}
