import { useLayoutEffect, useId, useRef, useState } from 'react';
import { Geography } from '@vnedyalk0v/react19-simple-maps';
import { m, useReducedMotion } from 'motion/react';
import { inkSpread } from '@/lib/motion';

interface CountryInkBloomProps {
  geography: any;
  /** Final colour of the country — the ink being soaked in. */
  fill: string;
  /**
   * Where the ink starts, in the zoom group's user-space coordinates. Null
   * when the mark came from somewhere other than a map tap (the country list,
   * the detail sheet), in which case we bloom from the shape's own centre.
   */
  origin: { x: number; y: number } | null;
}

/**
 * The signature moment: a single country's new colour soaking outward from the
 * point the user tapped, while the shape takes a springy hit.
 *
 * This is deliberately the ONLY animated node on a map of ~170 paths. The
 * geographies underneath stay plain memoised components; this overlay draws a
 * duplicate of just the marked country on top of them.
 */
export function CountryInkBloom({ geography, fill, origin }: CountryInkBloomProps) {
  const rawId = useId().replace(/:/g, '');
  const maskId = `bloom-mask-${rawId}`;
  const gradId = `bloom-grad-${rawId}`;

  const groupRef = useRef<SVGGElement>(null);
  const reduceMotion = useReducedMotion();

  // Measured from the rendered path, so the bloom is placed and sized correctly
  // whatever the projection or zoom level. The path must therefore be in the
  // DOM before we can measure it — hence useLayoutEffect plus the opacity gate
  // below, which together let us measure without ever painting an unmasked
  // frame of the finished colour.
  const [geom, setGeom] = useState<{
    cx: number;
    cy: number;
    radius: number;
  } | null>(null);

  useLayoutEffect(() => {
    const path = groupRef.current?.querySelector('path');
    if (!path) return;

    const box = path.getBBox();
    const cx = origin?.x ?? box.x + box.width / 2;
    const cy = origin?.y ?? box.y + box.height / 2;

    // Far corner of the bounding box from the ink's origin, so the bloom is
    // always guaranteed to cover the whole shape however off-centre the tap was.
    const dx = Math.max(cx - box.x, box.x + box.width - cx);
    const dy = Math.max(cy - box.y, box.y + box.height - cy);

    setGeom({ cx, cy, radius: Math.hypot(dx, dy) * 1.15 });
  }, [geography, origin]);

  return (
    <g ref={groupRef} style={{ pointerEvents: 'none' }}>
      <defs>
        {/* Soft edge, so the ink feathers into the paper instead of arriving
            as a hard expanding disc. */}
        <radialGradient id={gradId}>
          <stop offset="55%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse">
          {geom && (
            <m.circle
              cx={geom.cx}
              cy={geom.cy}
              fill={`url(#${gradId})`}
              initial={{ r: reduceMotion ? geom.radius : 0 }}
              animate={{ r: geom.radius }}
              transition={reduceMotion ? { duration: 0 } : inkSpread}
            />
          )}
        </mask>
      </defs>

      {/* No transform lives on this subtree on purpose: animating one on a
          masked element makes the browser re-rasterise the mask each frame.
          The squash-and-pop is a CSS keyframe on the plain, unmasked path
          underneath (see MapGeography), where it is far cheaper.

          Rendered unmasked-but-invisible on the very first pass purely so it
          can be measured; the layout effect fills in geom before paint. */}
      <Geography
        geography={geography}
        mask={geom ? `url(#${maskId})` : undefined}
        opacity={geom ? 1 : 0}
        style={{
          default: { fill, stroke: 'none', outline: 'none' },
          hover: { fill, stroke: 'none', outline: 'none' },
          pressed: { fill, stroke: 'none', outline: 'none' },
        }}
      />
    </g>
  );
}
