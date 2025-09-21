# React Native Animation Translation Guide

## Available Libraries in Your React Native App

Your React Native app has these animation libraries installed:
- **react-native-reanimated** - Core animation engine
- **moti** - Declarative animations (built on Reanimated)
- **@react-native-community/blur** - iOS/Android blur effects
- **react-native-animateable-text** - Animated text effects
- **react-native-linear-gradient** - Gradient backgrounds
- **react-native-svg** - SVG animations and shapes

## Translation Strategy for Each CSS Feature

### 1. Blur Effects (`filter: blur()`)

**CSS Animation (Web):**
```css
@keyframes fadeBlur {
  0% { filter: blur(10px); opacity: 0; }
  100% { filter: blur(0); opacity: 1; }
}
```

**React Native Translation:**
```tsx
// Option 1: Animated blur with @react-native-community/blur
import { BlurView } from '@react-native-community/blur';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function AnimatedModal() {
  const blurAmount = useSharedValue(10);
  
  const animatedProps = useAnimatedProps(() => ({
    blurAmount: blurAmount.value,
  }));

  useEffect(() => {
    blurAmount.value = withTiming(0, { duration: 400 });
  }, []);

  return (
    <AnimatedBlurView 
      animatedProps={animatedProps}
      blurType="light"
    />
  );
}

// Option 2: Simulated blur with scale + opacity (better performance)
import { MotiView } from 'moti';

<MotiView
  from={{ 
    scale: 0.9, 
    opacity: 0 
  }}
  animate={{ 
    scale: 1, 
    opacity: 1 
  }}
  transition={{
    type: 'timing',
    duration: 400,
    easing: Easing.out(Easing.quad)
  }}
>
  {/* Content */}
</MotiView>
```

**When to use each:**
- Use `BlurView` for static background blurs (modal overlays, frosted glass)
- Use scale + opacity simulation for animated focus effects (better performance)

### 2. Drop Shadow Effects (`filter: drop-shadow()`)

**CSS (Web):**
```css
filter: drop-shadow(0 0 10px rgba(255, 0, 0, 0.5));
```

**React Native Translation:**
```tsx
// For iOS - use shadow properties
const styles = StyleSheet.create({
  glowEffect: {
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  }
});

// For Android - use elevation + custom solution
import { MotiView } from 'moti';

// Animated glow effect
<MotiView
  from={{ 
    shadowOpacity: 0,
    shadowRadius: 0,
  }}
  animate={{ 
    shadowOpacity: 0.5,
    shadowRadius: 10,
  }}
  transition={{
    type: 'timing',
    duration: 300,
    loop: true,
  }}
  style={{
    shadowColor: '#FF0000',
    elevation: 5, // Android fallback
  }}
/>
```

### 3. Text Animations

**CSS (Web):**
```css
/* Glitch text, typewriter, etc. */
@keyframes glitch {
  0% { transform: translateX(0); }
  20% { transform: translateX(-2px); }
  40% { transform: translateX(2px); }
}
```

**React Native with react-native-animateable-text:**
```tsx
import AnimateableText from 'react-native-animateable-text';

// Glitch Effect
const GlitchText = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: 50 }),
        withTiming(2, { duration: 50 }),
        withTiming(0, { duration: 50 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }]
  }));

  return (
    <AnimateableText 
      text="GLITCH TEXT" 
      animatedProps={animatedStyle}
    />
  );
};

// Typewriter Effect
const TypewriterText = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setDisplayText(text.slice(0, index));
      index++;
      if (index > text.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, [text]);

  return <AnimateableText text={displayText} />;
};
```

### 4. Gradient Animations

**CSS (Web):**
```css
background: linear-gradient(90deg, #ff0000, #00ff00);
```

**React Native with react-native-linear-gradient:**
```tsx
import LinearGradient from 'react-native-linear-gradient';
import Animated, { useAnimatedProps, interpolateColor } from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function AnimatedGradientBackground() {
  const progress = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => {
    const color1 = interpolateColor(
      progress.value,
      [0, 1],
      ['#FF0000', '#00FF00']
    );
    const color2 = interpolateColor(
      progress.value,
      [0, 1],
      ['#00FF00', '#0000FF']
    );
    
    return {
      colors: [color1, color2],
    };
  });

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration: 2000 }),
      -1,
      true
    );
  }, []);

  return (
    <AnimatedLinearGradient
      animatedProps={animatedProps}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.gradient}
    />
  );
}
```

### 5. Complex Shapes & Paths (`clip-path`)

**CSS (Web):**
```css
clip-path: circle(50% at 50% 50%);
```

**React Native with react-native-svg:**
```tsx
import Svg, { Defs, ClipPath, Circle, Image } from 'react-native-svg';
import Animated, { useAnimatedProps } from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function IrisWipeEffect() {
  const radius = useSharedValue(0);

  const animatedProps = useAnimatedProps(() => ({
    r: radius.value,
  }));

  useEffect(() => {
    radius.value = withTiming(100, { duration: 700 });
  }, []);

  return (
    <Svg>
      <Defs>
        <ClipPath id="iris">
          <AnimatedCircle 
            animatedProps={animatedProps}
            cx="50%" 
            cy="50%" 
          />
        </ClipPath>
      </Defs>
      <Image
        href={require('./modal.png')}
        clipPath="url(#iris)"
        width="100%"
        height="100%"
      />
    </Svg>
  );
}
```

### 6. Particle Effects & Complex Animations

**React Native with Moti + SVG:**
```tsx
import { MotiView } from 'moti';
import Svg, { Circle } from 'react-native-svg';

const ParticleEffect = () => {
  const particles = Array.from({ length: 20 });

  return (
    <>
      {particles.map((_, i) => (
        <MotiView
          key={i}
          from={{
            translateX: 0,
            translateY: 0,
            scale: 0,
            opacity: 1,
          }}
          animate={{
            translateX: Math.random() * 200 - 100,
            translateY: Math.random() * 200 - 100,
            scale: 1,
            opacity: 0,
          }}
          transition={{
            type: 'timing',
            duration: 1000,
            delay: i * 50,
          }}
          style={styles.particle}
        />
      ))}
    </>
  );
};
```

## Animation-by-Animation Translation Guide

### Modal Animations

| CSS Animation | React Native Implementation |
|--------------|----------------------------|
| **scale-gentle-pop** | Moti with scale + opacity |
| **3d-flip** | Reanimated with rotateY transform |
| **glitch-digital** | Multiple MotiViews with offsets + AnimateableText |
| **iris-wipe** | react-native-svg with animated ClipPath |
| **portal-swirl** | Reanimated with rotate + scale |
| **tv-turn-on** | Reanimated with scaleX/scaleY sequence |

### Text Effects

| CSS Animation | React Native Implementation |
|--------------|----------------------------|
| **typewriter** | AnimateableText with progressive reveal |
| **glitch-text** | AnimateableText with transform offsets |
| **character-reveal** | Individual AnimateableText chars with delays |
| **counter-increment** | Reanimated with interpolated values |

### Progress Animations

| CSS Animation | React Native Implementation |
|--------------|----------------------------|
| **progress-bar** | MotiView with animated width |
| **gradient-progress** | AnimatedLinearGradient |
| **segmented-progress** | Multiple MotiViews with delays |

### Reward Animations

| CSS Animation | React Native Implementation |
|--------------|----------------------------|
| **coin-cascade** | Multiple MotiViews with physics |
| **confetti** | react-native-svg particles |
| **glow-effects** | Animated shadow properties |

## Performance Optimization Tips

### 1. Use Native Driver
```tsx
// Always enable native driver when possible
useNativeDriver: true // for transforms and opacity
```

### 2. Batch Animations
```tsx
// Run multiple animations in parallel
Animated.parallel([
  Animated.timing(animation1, config),
  Animated.timing(animation2, config),
]).start();
```

### 3. Optimize Blur Usage
- Static blurs: Use `BlurView` component
- Animated blurs: Use scale + opacity simulation
- Heavy blur effects: Consider pre-rendered images

### 4. Shadow Performance
```tsx
// iOS: Use shadow properties
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.25,
shadowRadius: 3.84,

// Android: Use elevation
elevation: 5,

// For colored shadows on Android, use a view behind
```

## Implementation Examples

### Complete Modal Animation (Moti)
```tsx
import { MotiView } from 'moti';
import { BlurView } from '@react-native-community/blur';

export function GameModal({ visible, children }) {
  return (
    <>
      {/* Background blur overlay */}
      {visible && (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
        />
      )}
      
      {/* Animated modal */}
      <MotiView
        from={{
          scale: 0.85,
          opacity: 0,
          translateY: 50,
        }}
        animate={{
          scale: visible ? 1 : 0.85,
          opacity: visible ? 1 : 0,
          translateY: visible ? 0 : 50,
        }}
        transition={{
          type: 'spring',
          damping: 15,
          stiffness: 150,
        }}
        style={styles.modal}
      >
        {children}
      </MotiView>
    </>
  );
}
```

### Text Effect with AnimateableText
```tsx
import AnimateableText from 'react-native-animateable-text';
import { useSharedValue, withSpring } from 'react-native-reanimated';

export function XPCounter({ value }) {
  const animatedValue = useSharedValue(0);
  
  useEffect(() => {
    animatedValue.value = withSpring(value, {
      damping: 15,
      stiffness: 150,
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    text: `+${Math.round(animatedValue.value)} XP`,
  }));

  return (
    <AnimateableText 
      animatedProps={animatedProps}
      style={styles.xpText}
    />
  );
}
```

## Testing Checklist

- [ ] Test on both iOS and Android devices
- [ ] Verify 60fps performance on low-end devices
- [ ] Check memory usage with Flipper
- [ ] Test with React Native's performance monitor
- [ ] Validate gesture responsiveness during animations
- [ ] Ensure animations work with reduced motion settings

## Common Pitfalls to Avoid

1. **Don't animate layout properties** - Use transforms instead
2. **Avoid excessive blur animations** - Use sparingly for performance
3. **Test shadow performance on Android** - Elevation is limited
4. **Be careful with SVG animations** - Can be CPU intensive
5. **Always cleanup animation listeners** - Prevent memory leaks

## Resources

- [Reanimated Docs](https://docs.swmansion.com/react-native-reanimated/)
- [Moti Docs](https://moti.fyi/)
- [React Native SVG](https://github.com/react-native-svg/react-native-svg)
- [Blur Library](https://github.com/Kureev/react-native-blur)
- [Animateable Text](https://github.com/axelra-ag/react-native-animateable-text)