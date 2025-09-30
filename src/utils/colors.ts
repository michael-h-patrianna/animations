/**
 * Blends two hex colors together at a given percentage
 * Works in both web and React Native environments
 *
 * @param color1 - First hex color (e.g., '#ffd700')
 * @param color2 - Second hex color (e.g., '#666666')
 * @param percentage - Percentage of color1 to use (0-100)
 * @returns Blended hex color
 */
export function blendColors(color1: string, color2: string, percentage: number): string {
  // Parse hex colors
  const r1 = parseInt(color1.slice(1, 3), 16);
  const g1 = parseInt(color1.slice(3, 5), 16);
  const b1 = parseInt(color1.slice(5, 7), 16);

  const r2 = parseInt(color2.slice(1, 3), 16);
  const g2 = parseInt(color2.slice(3, 5), 16);
  const b2 = parseInt(color2.slice(5, 7), 16);

  // Blend
  const r = Math.round(r1 * (percentage / 100) + r2 * (1 - percentage / 100));
  const g = Math.round(g1 * (percentage / 100) + g2 * (1 - percentage / 100));
  const b = Math.round(b1 * (percentage / 100) + b2 * (1 - percentage / 100));

  // Return hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Adds transparency to a hex color
 * Works in both web and React Native environments
 *
 * @param color - Hex color (e.g., '#ffd700')
 * @param alpha - Transparency (0-100)
 * @returns RGBA color string
 */
export function addTransparency(color: string, alpha: number): string {
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha / 100})`;
}

/**
 * Pre-calculates color steps for light bulb animations
 * Generates intermediate colors between onColor and derived offColor
 * The offColor is automatically derived by darkening onColor to 20% brightness with 70% opacity
 *
 * @param onColor - Color when bulb is lit (e.g., '#ffd700')
 * @returns Object with pre-calculated color steps
 */
export function calculateBulbColors(onColor: string) {
  // Derive off color by darkening the on color to 20% brightness with 70% opacity
  let r = Math.round(parseInt(onColor.slice(1, 3), 16) * 0.2);
  let g = Math.round(parseInt(onColor.slice(3, 5), 16) * 0.2);
  let b = Math.round(parseInt(onColor.slice(5, 7), 16) * 0.2);

  // Desaturate by moving RGB values closer to their average
  const avg = (r + g + b) / 3;
  const desaturationFactor = 0.6; // 60% closer to gray
  r = Math.round(r + (avg - r) * desaturationFactor);
  g = Math.round(g + (avg - g) * desaturationFactor);
  b = Math.round(b + (avg - b) * desaturationFactor);

  const offColor = `rgba(${r}, ${g}, ${b}, 0.7)`;

  return {
    // Base colors
    on: onColor,
    off: offColor,

    // Blended intermediate steps
    blend90: blendColors(onColor, offColor, 90),
    blend80: blendColors(onColor, offColor, 80),
    blend70: blendColors(onColor, offColor, 70),
    blend60: blendColors(onColor, offColor, 60),
    blend40: blendColors(onColor, offColor, 40),
    blend30: blendColors(onColor, offColor, 30),
    blend20: blendColors(onColor, offColor, 20),
    blend10: blendColors(onColor, offColor, 10),

    // Off color with slight on color tint
    offTint30: blendColors(offColor, onColor, 70),
    offTint20: blendColors(offColor, onColor, 80),

    // Transparency variations for glows and shadows
    onGlow80: addTransparency(onColor, 80),
    onGlow70: addTransparency(onColor, 70),
    onGlow60: addTransparency(onColor, 60),
    onGlow50: addTransparency(onColor, 50),
    onGlow45: addTransparency(onColor, 45),
    onGlow35: addTransparency(onColor, 35),
    onGlow30: addTransparency(onColor, 30),

    offGlow35: addTransparency(offColor, 35),
    offGlow30: addTransparency(offColor, 30),
  };
}

export type BulbColors = ReturnType<typeof calculateBulbColors>;
