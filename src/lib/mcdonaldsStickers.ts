/**
 * Láminas bonus McDonald's — una por selección (48 en total).
 * Código: MC-{FIFA_CODE}-13 (e.g. MC-MEX-13, MC-ARG-13).
 * Orden: mismo que las secciones de equipo en el álbum (A→L, 4 por grupo).
 */

/** Códigos FIFA en orden del álbum (igual que teamSections en albumData.ts). */
export const MCD_TEAM_CODES = [
  // A
  'MEX',
  'RSA',
  'KOR',
  'CZE',
  // B
  'CAN',
  'BIH',
  'QAT',
  'SUI',
  // C
  'BRA',
  'MAR',
  'HAI',
  'SCO',
  // D
  'USA',
  'PAR',
  'AUS',
  'TUR',
  // E
  'GER',
  'CUW',
  'CIV',
  'ECU',
  // F
  'NED',
  'JPN',
  'SWE',
  'TUN',
  // G
  'BEL',
  'EGY',
  'IRN',
  'NZL',
  // H
  'ESP',
  'CPV',
  'KSA',
  'URU',
  // I
  'FRA',
  'SEN',
  'IRQ',
  'NOR',
  // J
  'ARG',
  'ALG',
  'AUT',
  'JOR',
  // K
  'POR',
  'COD',
  'UZB',
  'COL',
  // L
  'ENG',
  'CRO',
  'GHA',
  'PAN',
] as const;

/** Lookup inverso: "MEX" → 0, "RSA" → 1, … "PAN" → 47. */
const codeToIndex = new Map<string, number>();
MCD_TEAM_CODES.forEach((code, i) => codeToIndex.set(code, i));

/**
 * Dado un índice 0-based dentro de la sección McDonald's,
 * devuelve el código de lámina (e.g. "MC-MEX-13").
 */
export function mcdCodeForIndex(index: number): string {
  const team = MCD_TEAM_CODES[index];
  return team ? `MC-${team}-13` : `?MCD${index}`;
}

/**
 * Dado un código como "MC-ARG-13", devuelve el índice 0-based
 * dentro de la sección McDonald's (0-47), o undefined si inválido.
 */
export function mcdIndexFromCode(code: string): number | undefined {
  const match = code.toUpperCase().match(/^MC-([A-Z]{2,3})-13$/);
  if (!match) return undefined;
  return codeToIndex.get(match[1]);
}
