import { ImageResponse } from 'next/og';
import { plain } from '#/lib/metadata.ts';

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = 'image/png';

const GREEN = '#2fc186';

/**
 * Fetches an svg and returns it as a data URI, with the first colour that is bright enough to
 * accent the card
 */
async function loadIcon(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) return undefined;
    const svg = await response.text();
    const colours = [...svg.matchAll(/#[0-9a-f]{6}(?![0-9a-f])/gi)].map((m) => m[0]);
    const accent = colours.find((c) => {
      const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => Number.parseInt(c.slice(i, i + 2), 16));
      return 0.299 * r + 0.587 * g + 0.114 * b > 70;
    });
    return {
      src: `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`,
      accent,
    };
  } catch {
    return undefined;
  }
}

/** The link preview card, rendered once per page and cached by Next */
export async function renderOgCard(card: { title: string; subtitle: string; iconUrl?: string }) {
  const title = plain(card.title);
  const subtitle = plain(card.subtitle);
  const icon = card.iconUrl ? await loadIcon(card.iconUrl) : undefined;
  const accent = icon?.accent ?? GREEN;

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: `radial-gradient(circle at 85% 20%, ${accent}33, #0a0a0a 55%)`,
        color: '#fafafa',
        position: 'relative',
      }}
    >
      {icon && (
        // biome-ignore lint/performance/noImgElement: Rendered to an image, not a page
        <img
          src={icon.src}
          alt=""
          width={168}
          height={168}
          style={{ position: 'absolute', top: 80, right: 80 }}
        />
      )}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 12,
          background: accent,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="72" height="72" viewBox="0 0 512 512">
          <g
            fill="none"
            stroke={GREEN}
            strokeWidth="72"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M84 158 L226 236 L84 314" />
            <path d="M232 368 H420" />
          </g>
        </svg>
        <div style={{ fontSize: 44, fontWeight: 700, color: GREEN }}>Evaluate</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ fontSize: title.length > 30 ? 64 : 76, fontWeight: 700, lineHeight: 1.05 }}>
          {title}
        </div>
        <div style={{ fontSize: 32, color: '#a1a1aa', lineHeight: 1.3 }}>{subtitle}</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
