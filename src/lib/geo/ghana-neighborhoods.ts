/**
 * Approximate centroid coordinates for named areas within Accra that show
 * up in `businesses.location`. There is no latitude/longitude column on
 * `businesses` — the real schema only has this free-text field, and values
 * range from a clean "Osu, Accra" to a full street address to something
 * unparseable like "Digital platform — Accra, Ghana". Live geocoding every
 * business isn't viable at request time (rate-limited, hundreds of rows),
 * so businesses are clustered by the neighborhood name found inside their
 * `location` string, each pinned at that neighborhood's known center —
 * this is standard, publicly known place-name data, not fabricated
 * per-business GPS. A business whose location doesn't match a known name
 * falls back to central Accra, so nothing is silently dropped from the map.
 *
 * Order matters: longer/more specific names are checked before their
 * substrings (e.g. "Airport Residential" before "Airport").
 */
export const GHANA_NEIGHBORHOODS: { name: string; lat: number; lng: number }[] = [
  { name: "Airport Residential Area", lat: 5.6052, lng: -0.1719 },
  { name: "Airport City", lat: 5.6037, lng: -0.1698 },
  { name: "East Legon", lat: 5.6494, lng: -0.1538 },
  { name: "Labadi", lat: 5.5563, lng: -0.1584 },
  { name: "Labone", lat: 5.5622, lng: -0.1662 },
  { name: "Cantonments", lat: 5.5766, lng: -0.1746 },
  { name: "Spintex", lat: 5.6284, lng: -0.1178 },
  { name: "Roman Ridge", lat: 5.5934, lng: -0.1897 },
  { name: "North Ridge", lat: 5.5645, lng: -0.2058 },
  { name: "Ridge", lat: 5.5599, lng: -0.2004 },
  { name: "Osu", lat: 5.5560, lng: -0.1794 },
  { name: "Dzorwulu", lat: 5.5985, lng: -0.1927 },
  { name: "Abelenkpe", lat: 5.5978, lng: -0.2039 },
  { name: "Legon", lat: 5.6506, lng: -0.1868 },
  { name: "Teshie", lat: 5.5833, lng: -0.1039 },
  { name: "Dansoman", lat: 5.5358, lng: -0.2621 },
  { name: "Madina", lat: 5.6836, lng: -0.1670 },
  { name: "Kwabenya", lat: 5.6981, lng: -0.2181 },
  { name: "Odorkor", lat: 5.5722, lng: -0.2603 },
  { name: "Tema", lat: 5.6698, lng: -0.0166 },
  { name: "Kumasi", lat: 6.6885, lng: -1.6244 },
  { name: "Takoradi", lat: 4.8845, lng: -1.7554 },
  { name: "Cape Coast", lat: 5.1053, lng: -1.2466 },
];

/** Central Accra — the fallback pin for a `location` that matches nothing above. */
export const ACCRA_CENTER = { name: "Accra", lat: 5.6037, lng: -0.1870 };

/** Finds the first known neighborhood whose name appears in a business's location string. */
export function matchNeighborhood(location: string): { name: string; lat: number; lng: number } {
  const lower = location.toLowerCase();
  const match = GHANA_NEIGHBORHOODS.find((n) => lower.includes(n.name.toLowerCase()));
  return match ?? ACCRA_CENTER;
}
