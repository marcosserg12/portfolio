/** Tamanhos de tela usados na suíte. A altura padrão é 900 px. */
export type Viewport = { width: number; height: number };

export const PHONE: Viewport = { width: 390, height: 844 };
export const DESKTOP: Viewport = { width: 1440, height: 900 };
export const WIDE: Viewport = { width: 1600, height: 900 };

export const width = (w: number, height = 900): Viewport => ({ width: w, height });
