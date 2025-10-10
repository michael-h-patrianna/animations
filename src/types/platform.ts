/**
 * Cross-Platform Animation Abstractions
 *
 * Type-safe interfaces for bridging web CSS features with React Native equivalents.
 * These abstractions enable writing animations once for web (CSS/Framer Motion)
 * and translating them to React Native (Reanimated/Moti).
 *
 * @module types/platform
 */

import type { ReactNode, CSSProperties } from 'react'

// ============================================================================
// HELPER TYPES
// ============================================================================

/**
 * Platform identifier for conditional rendering or type narrowing
 */
export type Platform = 'web' | 'ios' | 'android'

/**
 * CSS color value (hex, rgb, rgba, hsl, hsla, named colors)
 * @example '#FF5733', 'rgb(255, 87, 51)', 'rgba(255, 87, 51, 0.8)', 'hsl(9, 100%, 60%)'
 */
export type Color = string

/**
 * Numeric dimension value in pixels
 * Web: Translates to CSS pixels
 * RN: Translates to density-independent pixels (dp)
 */
export type Dimension = number

/**
 * Percentage value between 0 and 1
 * Used for opacity, gradient stops, etc.
 * @example 0 (fully transparent), 0.5 (50%), 1 (fully opaque)
 */
export type Percentage = number

/**
 * 2D offset for shadows, positions, etc.
 */
export interface Offset {
  x: Dimension
  y: Dimension
}

/**
 * Border radius configuration
 * Can be a single value or per-corner values
 */
export type BorderRadius =
  | Dimension
  | {
      topLeft?: Dimension
      topRight?: Dimension
      bottomLeft?: Dimension
      bottomRight?: Dimension
    }

// ============================================================================
// PLATFORM SHADOW
// ============================================================================

/**
 * Cross-platform shadow abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS box-shadow
 * - iOS: Uses shadowColor, shadowOffset, shadowOpacity, shadowRadius
 * - Android: Uses elevation (with optional shadowColor)
 *
 * @example
 * ```tsx
 * <PlatformShadow
 *   elevation={8}
 *   color="rgba(0, 0, 0, 0.3)"
 *   offset={{ x: 0, y: 4 }}
 * >
 *   <View>Content with shadow</View>
 * </PlatformShadow>
 * ```
 */
export interface PlatformShadowProps {
  /**
   * Shadow elevation level (0-24)
   * Maps to:
   * - Web: blur-radius in box-shadow
   * - Android: elevation property
   * - iOS: shadowRadius
   */
  elevation: number

  /**
   * Shadow color
   * Default: 'rgba(0, 0, 0, 0.3)'
   * Web: Used in box-shadow
   * iOS: Maps to shadowColor
   * Android: Maps to shadowColor (API 28+)
   */
  color?: Color

  /**
   * Shadow offset
   * Default: { x: 0, y: elevation / 2 }
   * Web: Used in box-shadow x-offset and y-offset
   * iOS: Maps to shadowOffset
   * Android: Not directly supported (simulated via elevation)
   */
  offset?: Offset

  /**
   * Shadow opacity (0-1)
   * Default: Derived from color alpha channel
   * Web: Used in box-shadow color alpha
   * iOS: Maps to shadowOpacity
   * Android: Baked into shadowColor alpha
   */
  opacity?: Percentage

  /**
   * Border radius of the shadowed element
   * Affects shadow shape on all platforms
   */
  borderRadius?: BorderRadius

  /**
   * Content to wrap with shadow
   */
  children: ReactNode
}

/**
 * Shadow style object for direct style application
 * Alternative to component-based PlatformShadow
 */
export interface PlatformShadowStyle {
  elevation: number
  shadowColor?: Color
  shadowOffset?: Offset
  shadowOpacity?: Percentage
  shadowRadius?: Dimension
}

// ============================================================================
// PLATFORM GRADIENT
// ============================================================================

/**
 * Gradient type
 */
export type GradientType = 'linear' | 'radial'

/**
 * Linear gradient direction
 * Web: Translates to CSS angle or keyword (to top, to right, etc.)
 * RN: Translates to start/end coordinates for react-native-linear-gradient
 */
export type LinearGradientDirection =
  | 'to top'
  | 'to bottom'
  | 'to left'
  | 'to right'
  | 'to top right'
  | 'to top left'
  | 'to bottom right'
  | 'to bottom left'
  | `${number}deg`

/**
 * Gradient color stop
 */
export interface GradientStop {
  /**
   * Color at this stop
   */
  color: Color

  /**
   * Position of this stop (0-1)
   * 0 = start of gradient, 1 = end of gradient
   */
  position: Percentage
}

/**
 * Cross-platform linear gradient abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS linear-gradient() via background-image
 * - RN: Uses react-native-linear-gradient or expo-linear-gradient
 *
 * @example
 * ```tsx
 * <PlatformLinearGradient
 *   colors={[
 *     { color: '#FF5733', position: 0 },
 *     { color: '#FFC300', position: 1 }
 *   ]}
 *   direction="to bottom"
 * >
 *   <Text>Gradient Background</Text>
 * </PlatformLinearGradient>
 * ```
 */
export interface PlatformLinearGradientProps {
  /**
   * Gradient color stops
   * Must have at least 2 stops
   */
  colors: readonly [GradientStop, GradientStop, ...GradientStop[]]

  /**
   * Gradient direction
   * Default: 'to bottom'
   */
  direction?: LinearGradientDirection

  /**
   * Content to render on top of gradient
   */
  children: ReactNode

  /**
   * Additional styles to apply to the gradient container
   */
  style?: CSSProperties
}

/**
 * Cross-platform radial gradient abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS radial-gradient() via background-image
 * - RN: Uses react-native-radial-gradient (limited support)
 *
 * Note: Radial gradients have limited RN support. Consider using
 * linear gradients or SVG-based solutions for complex radial effects.
 *
 * @example
 * ```tsx
 * <PlatformRadialGradient
 *   colors={[
 *     { color: '#FF5733', position: 0 },
 *     { color: '#FFC300', position: 1 }
 *   ]}
 *   center={{ x: 0.5, y: 0.5 }}
 * >
 *   <View>Radial Gradient</View>
 * </PlatformRadialGradient>
 * ```
 */
export interface PlatformRadialGradientProps {
  /**
   * Gradient color stops
   * Must have at least 2 stops
   */
  colors: readonly [GradientStop, GradientStop, ...GradientStop[]]

  /**
   * Center point of the radial gradient (0-1 normalized coordinates)
   * Default: { x: 0.5, y: 0.5 } (center)
   */
  center?: { x: Percentage; y: Percentage }

  /**
   * Radius of the gradient (0-1, relative to container size)
   * Default: 0.5
   */
  radius?: Percentage

  /**
   * Content to render on top of gradient
   */
  children: ReactNode

  /**
   * Additional styles to apply to the gradient container
   */
  style?: CSSProperties
}

// ============================================================================
// PLATFORM TEXT SHADOW
// ============================================================================

/**
 * Cross-platform text shadow abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS text-shadow
 * - RN: Uses textShadowColor, textShadowOffset, textShadowRadius
 *
 * @example
 * ```tsx
 * <PlatformTextShadow
 *   color="rgba(0, 0, 0, 0.5)"
 *   offset={{ x: 2, y: 2 }}
 *   blur={4}
 * >
 *   <Text>Text with shadow</Text>
 * </PlatformTextShadow>
 * ```
 */
export interface PlatformTextShadowProps {
  /**
   * Shadow color
   * Default: 'rgba(0, 0, 0, 0.5)'
   */
  color?: Color

  /**
   * Shadow offset
   * Default: { x: 0, y: 0 }
   * Web: Used in text-shadow x-offset and y-offset
   * RN: Maps to textShadowOffset
   */
  offset?: Offset

  /**
   * Shadow blur radius
   * Default: 0
   * Web: Used in text-shadow blur-radius
   * RN: Maps to textShadowRadius
   */
  blur?: Dimension

  /**
   * Text content to apply shadow to
   */
  children: ReactNode
}

/**
 * Text shadow style object for direct style application
 * Alternative to component-based PlatformTextShadow
 */
export interface PlatformTextShadowStyle {
  textShadowColor?: Color
  textShadowOffset?: Offset
  textShadowRadius?: Dimension
}

// ============================================================================
// PLATFORM FILTER
// ============================================================================

/**
 * Filter effect types
 * Limited to effects that can be reasonably approximated on both platforms
 */
export type FilterType = 'blur' | 'brightness' | 'contrast' | 'grayscale' | 'opacity'

/**
 * Blur filter configuration
 */
export interface BlurFilter {
  type: 'blur'
  /**
   * Blur radius in pixels
   * Web: CSS blur() filter
   * RN: BlurView component (requires expo-blur or react-native-blur)
   */
  radius: Dimension
}

/**
 * Brightness filter configuration
 */
export interface BrightnessFilter {
  type: 'brightness'
  /**
   * Brightness multiplier
   * 1 = normal, <1 = darker, >1 = brighter
   * Web: CSS brightness() filter
   * RN: Tint overlay or color matrix (limited)
   */
  value: number
}

/**
 * Contrast filter configuration
 */
export interface ContrastFilter {
  type: 'contrast'
  /**
   * Contrast multiplier
   * 1 = normal, <1 = less contrast, >1 = more contrast
   * Web: CSS contrast() filter
   * RN: Color matrix (limited support)
   */
  value: number
}

/**
 * Grayscale filter configuration
 */
export interface GrayscaleFilter {
  type: 'grayscale'
  /**
   * Grayscale amount (0-1)
   * 0 = full color, 1 = full grayscale
   * Web: CSS grayscale() filter
   * RN: Color matrix or desaturate
   */
  amount: Percentage
}

/**
 * Opacity filter configuration
 */
export interface OpacityFilter {
  type: 'opacity'
  /**
   * Opacity value (0-1)
   * 0 = fully transparent, 1 = fully opaque
   * Web: CSS opacity() filter or opacity property
   * RN: opacity style property
   */
  value: Percentage
}

/**
 * Union of all filter configurations
 */
export type FilterConfig =
  | BlurFilter
  | BrightnessFilter
  | ContrastFilter
  | GrayscaleFilter
  | OpacityFilter

/**
 * Cross-platform filter abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS filter property
 * - RN: Uses platform-specific implementations (BlurView, color matrices, etc.)
 *
 * Note: Not all CSS filters have RN equivalents. Complex filters may require
 * alternative visual approaches on RN.
 *
 * @example
 * ```tsx
 * <PlatformFilter
 *   filters={[
 *     { type: 'blur', radius: 10 },
 *     { type: 'brightness', value: 1.2 }
 *   ]}
 * >
 *   <Image src="photo.jpg" />
 * </PlatformFilter>
 * ```
 */
export interface PlatformFilterProps {
  /**
   * Array of filter effects to apply
   * Applied in order from first to last
   */
  filters: readonly FilterConfig[]

  /**
   * Content to apply filters to
   */
  children: ReactNode

  /**
   * Additional styles to apply to the filter container
   */
  style?: CSSProperties
}

// ============================================================================
// PLATFORM PSEUDO ELEMENT
// ============================================================================

/**
 * Pseudo element position
 */
export type PseudoElementPosition = 'before' | 'after'

/**
 * Cross-platform pseudo element abstraction
 *
 * Platform implementations:
 * - Web: Translates to CSS ::before or ::after pseudo-elements
 * - RN: Uses absolutely positioned View components
 *
 * Common use cases:
 * - Decorative shapes (badges, ribbons, corners)
 * - Overlay effects
 * - Borders and dividers
 * - Background patterns
 *
 * @example
 * ```tsx
 * <PlatformPseudoElement
 *   position="before"
 *   content={{
 *     width: 20,
 *     height: 20,
 *     backgroundColor: '#FF5733',
 *     borderRadius: 10
 *   }}
 *   style={{
 *     position: 'absolute',
 *     top: -5,
 *     right: -5
 *   }}
 * >
 *   <View>Content with badge</View>
 * </PlatformPseudoElement>
 * ```
 */
export interface PlatformPseudoElementProps {
  /**
   * Position of the pseudo element relative to content
   * 'before': Renders before the children (in DOM order on web, z-index on RN)
   * 'after': Renders after the children
   */
  position: PseudoElementPosition

  /**
   * Style for the pseudo element
   * Web: Applied to ::before or ::after
   * RN: Applied to absolutely positioned View
   */
  content: CSSProperties

  /**
   * Positioning style for the pseudo element
   * Typically includes position: absolute and top/right/bottom/left
   * Web: Merged into ::before or ::after styles
   * RN: Applied to wrapper View
   */
  style?: CSSProperties

  /**
   * Main content
   */
  children: ReactNode
}

/**
 * Alternative pseudo element abstraction using render props
 * Provides more flexibility for complex pseudo element content
 *
 * @example
 * ```tsx
 * <PlatformPseudoElementRender
 *   renderBefore={() => (
 *     <View style={{ position: 'absolute', top: 0, left: 0 }}>
 *       <Icon name="badge" />
 *     </View>
 *   )}
 * >
 *   <View>Main content</View>
 * </PlatformPseudoElementRender>
 * ```
 */
export interface PlatformPseudoElementRenderProps {
  /**
   * Render function for ::before equivalent
   * Web: Rendered as ::before pseudo-element
   * RN: Rendered as sibling View before children
   */
  renderBefore?: () => ReactNode

  /**
   * Render function for ::after equivalent
   * Web: Rendered as ::after pseudo-element
   * RN: Rendered as sibling View after children
   */
  renderAfter?: () => ReactNode

  /**
   * Main content
   */
  children: ReactNode
}

// ============================================================================
// COMPOSITE TYPES
// ============================================================================

/**
 * Combined platform styling configuration
 * Allows applying multiple platform abstractions at once
 */
export interface PlatformStyle {
  shadow?: PlatformShadowStyle
  textShadow?: PlatformTextShadowStyle
  filters?: readonly FilterConfig[]
}

/**
 * Platform-aware component props
 * Extends base props with platform detection
 */
export interface PlatformAwareProps {
  /**
   * Target platform (auto-detected if not provided)
   */
  platform?: Platform
}
