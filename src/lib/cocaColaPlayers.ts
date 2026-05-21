/**
 * Jugadores de la colección bonus Coca-Cola (CC1–CC14).
 * Clave = código de lámina, valor = { name, country (código FIFA) }.
 */
export interface CocaColaPlayer {
  name: string;
  /** Código FIFA del país, e.g. "GER", "ARG" */
  country: string;
}

export const COCA_COLA_PLAYERS: Record<string, CocaColaPlayer> = {
  CC1: { name: 'Lamine Yamal', country: 'ESP' },
  CC2: { name: 'Joshua Kimmich', country: 'GER' },
  CC3: { name: 'Harry Kane', country: 'ENG' },
  CC4: { name: 'Santiago Giménez', country: 'MEX' },
  CC5: { name: 'Joško Gvardiol', country: 'CRO' },
  CC6: { name: 'Federico Valverde', country: 'URU' },
  CC7: { name: 'Jefferson Lerma', country: 'COL' },
  CC8: { name: 'Enner Valencia', country: 'ECU' },
  CC9: { name: 'Gabriel Magalhães', country: 'BRA' },
  CC10: { name: 'Virgil van Dijk', country: 'NED' },
  CC11: { name: 'Alphonso Davies', country: 'CAN' },
  CC12: { name: 'Emiliano Martínez', country: 'ARG' },
  CC13: { name: 'Raúl Jiménez', country: 'MEX' },
  CC14: { name: 'Lautaro Martínez', country: 'ARG' },
};
