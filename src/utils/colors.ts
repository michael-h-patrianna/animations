/* eslint-disable animation-rules/no-hardcoded-colors -- Color utility requires raw color manipulation */

/**
 * RGB color channels
 */
type RGB = { r: number; g: number; b: number };

const FALLBACK_COLOR: RGB = { r: 255, g: 215, b: 0 };

function clampChannel(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function formatHexColor({ r, g, b }: RGB): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function parseHexColor(color: string): RGB | null {
  const hex = color.trim().replace(/^#/, '');
  const validHex = /^[\da-f]+$/i;

  if (!validHex.test(hex)) {
    return null;
  }

  if (hex.length === 3 || hex.length === 4) {
    const expanded = hex
      .slice(0, 3)
      .split('')
      .map((char) => char + char)
      .join('');
    return {
      r: parseInt(expanded.slice(0, 2), 16),
      g: parseInt(expanded.slice(2, 4), 16),
      b: parseInt(expanded.slice(4, 6), 16),
    };
  }

  if (hex.length === 6 || hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  return null;
}

function parseRgbChannel(channel: string): number {
  const value = channel.trim();
  if (value.endsWith('%')) {
    return clampChannel((parseFloat(value) / 100) * 255);
  }
  return clampChannel(parseFloat(value));
}

function parseRgbColor(color: string): RGB | null {
  const match = color
    .trim()
    .match(/^rgba?\(\s*([+-]?\d*\.?\d+%?)\s*,\s*([+-]?\d*\.?\d+%?)\s*,\s*([+-]?\d*\.?\d+%?)(?:\s*,\s*[+-]?\d*\.?\d+%?)?\s*\)$/i);

  if (!match) {
    return null;
  }

  return {
    r: parseRgbChannel(match[1]),
    g: parseRgbChannel(match[2]),
    b: parseRgbChannel(match[3]),
  };
}

/**
 * Resolves named colors and CSS variables through the browser engine.
 */
function resolveCssColor(color: string): RGB | null {
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof window.getComputedStyle !== 'function'
  ) {
    return null;
  }

  const probe = document.createElement('span');
  probe.style.color = '';
  probe.style.color = color;

  if (!probe.style.color) {
    return null;
  }

  probe.style.position = 'absolute';
  probe.style.visibility = 'hidden';
  probe.style.pointerEvents = 'none';

  const parent = document.body ?? document.documentElement;
  parent.appendChild(probe);
  const resolvedColor = window.getComputedStyle(probe).color;
  probe.remove();

  return parseRgbColor(resolvedColor) ?? parseHexColor(resolvedColor);
}

/**
 * Parses a color string and returns RGB values.
 * Supports hex, rgb/rgba, named colors, and CSS variables (web runtime).
 */
function parseColor(color: string): RGB {
  const trimmedColor = color.trim();
  return (
    parseHexColor(trimmedColor) ??
    parseRgbColor(trimmedColor) ??
    resolveCssColor(trimmedColor) ??
    FALLBACK_COLOR
  );
}

/**
 * Blends two colors together at a given percentage
 * Works in both web and React Native environments
 * Supports hex, rgba/rgb, named colors, and CSS variable formats
 *
 * @param color1 - First color (e.g., '#ffd700' or 'rgba(255, 215, 0, 0.7)')
 * @param color2 - Second color (e.g., '#666666' or 'rgba(102, 102, 102, 0.5)')
 * @param percentage - Percentage of color1 to use (0-100)
 * @returns Blended hex color
 */
export function blendColors(color1: string, color2: string, percentage: number): string {
  const c1 = parseColor(color1);
  const c2 = parseColor(color2);

  const mix = percentage / 100;
  const r = clampChannel(c1.r * mix + c2.r * (1 - mix));
  const g = clampChannel(c1.g * mix + c2.g * (1 - mix));
  const b = clampChannel(c1.b * mix + c2.b * (1 - mix));

  return formatHexColor({ r, g, b });
}

/**
 * Adds transparency to a color
 * Works in both web and React Native environments
 *
 * @param color - Color value (hex/rgb/rgba/var)
 * @param alpha - Transparency (0-100)
 * @returns RGBA color string
 */
export function addTransparency(color: string, alpha: number): string {
  const { r, g, b } = parseColor(color);

  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(1, alpha / 100))})`;
}

/**
 * Shifts color temperature warmer (adds orange/yellow tones) or cooler (adds blue tones)
 * Works in both web and React Native environments
 *
 * @param color - Color value (hex/rgb/rgba/var)
 * @param shift - Positive for warm, negative for cool (-50 to 50)
 * @returns Shifted hex color
 */
export function shiftColorTemperature(color: string, shift: number): string {
  const parsedColor = parseColor(color);
  let r = parsedColor.r;
  let g = parsedColor.g;
  let b = parsedColor.b;

  if (shift > 0) {
    // Warm shift: increase red and green (orange/yellow tones)
    r = clampChannel(r + shift * 0.8);
    g = clampChannel(g + shift * 0.5);
    b = clampChannel(b - shift * 0.3);
  } else {
    // Cool shift: increase blue, reduce red
    const coolShift = Math.abs(shift);
    r = clampChannel(r - coolShift * 0.4);
    g = clampChannel(g - coolShift * 0.2);
    b = clampChannel(b + coolShift * 0.6);
  }

  return formatHexColor({ r, g, b });
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
  const parsedOnColor = parseColor(onColor);

  // Apply warm temperature shift to onColor for more inviting glow
  const warmOnColor = shiftColorTemperature(onColor, 15);

  // Derive off color by darkening the on color to 20% brightness with 70% opacity
  let r = clampChannel(parsedOnColor.r * 0.2);
  let g = clampChannel(parsedOnColor.g * 0.2);
  let b = clampChannel(parsedOnColor.b * 0.2);

  // Desaturate by moving RGB values closer to their average
  const avg = (r + g + b) / 3;
  const desaturationFactor = 0.6; // 60% closer to gray
  r = clampChannel(r + (avg - r) * desaturationFactor);
  g = clampChannel(g + (avg - g) * desaturationFactor);
  b = clampChannel(b + (avg - b) * desaturationFactor);

  const offColorBase = formatHexColor({ r, g, b });

  // Apply cool temperature shift to offColor for more muted appearance
  const coolOffColor = shiftColorTemperature(offColorBase, -10);
  const parsedOffColor = parseColor(coolOffColor);
  const offColor = `rgba(${parsedOffColor.r}, ${parsedOffColor.g}, ${parsedOffColor.b}, 0.7)`;

  // Pre-calculate radial gradient color for animations (replaces color-mix())
  const onGradientColor = blendColors(warmOnColor, '#000000', 85);

  // Additional color-mix replacements for animations
  const offBlend10On = blendColors(offColor, warmOnColor, 90);  // 90% off + 10% on
  const onBlend5Off = blendColors(warmOnColor, offColor, 95);    // 95% on + 5% off
  const onBlend10Off = blendColors(warmOnColor, offColor, 90);   // 90% on + 10% off

  return {
    // Base colors with temperature shifts
    on: warmOnColor,
    off: offColor,

    // Blended intermediate steps (use warm color for blending)
    blend90: blendColors(warmOnColor, offColor, 90),
    blend80: blendColors(warmOnColor, offColor, 80),
    blend70: blendColors(warmOnColor, offColor, 70),
    blend60: blendColors(warmOnColor, offColor, 60),
    blend40: blendColors(warmOnColor, offColor, 40),
    blend30: blendColors(warmOnColor, offColor, 30),
    blend20: blendColors(warmOnColor, offColor, 20),
    blend10: blendColors(warmOnColor, offColor, 10),

    // Off color with slight on color tint
    offTint30: blendColors(offColor, warmOnColor, 70),
    offTint20: blendColors(offColor, warmOnColor, 80),

    // Additional blends for specific animation patterns
    offBlend10On,   // 90% off + 10% on
    onBlend5Off,    // 95% on + 5% off
    onBlend10Off,   // 90% on + 10% off

    // Radial gradient color (85% of on color blended with transparent)
    onGradient: onGradientColor,

    // Transparency variations for glows and shadows (use warm color)
    onGlow100: addTransparency(warmOnColor, 100),
    onGlow95: addTransparency(warmOnColor, 95),
    onGlow90: addTransparency(warmOnColor, 90),
    onGlow80: addTransparency(warmOnColor, 80),
    onGlow75: addTransparency(warmOnColor, 75),
    onGlow70: addTransparency(warmOnColor, 70),
    onGlow65: addTransparency(warmOnColor, 65),
    onGlow60: addTransparency(warmOnColor, 60),
    onGlow55: addTransparency(warmOnColor, 55),
    onGlow50: addTransparency(warmOnColor, 50),
    onGlow45: addTransparency(warmOnColor, 45),
    onGlow40: addTransparency(warmOnColor, 40),
    onGlow35: addTransparency(warmOnColor, 35),
    onGlow30: addTransparency(warmOnColor, 30),

    // White glow for special effects (#fff transparency)
    whiteGlow100: 'rgba(255, 255, 255, 1)',

    offGlow40: addTransparency(offColor, 40),
    offGlow35: addTransparency(offColor, 35),
    offGlow30: addTransparency(offColor, 30),
  };
}

/**
 *
 */
export type BulbColors = ReturnType<typeof calculateBulbColors>;
