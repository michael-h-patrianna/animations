// Import assets so Vite resolves and fingerprints them in production
import presentBox from '@/assets/present_box.png';
import presentBoxBalloon from '@/assets/present_box_balloon.png';
import pulseScroll from '@/assets/pulse_scroll.png';
import shakeIcon from '@/assets/shake_icon.png';

// Extendable: add more assets here as needed
export const CRITICAL_ICON_IMAGES: string[] = [
  presentBoxBalloon,
  presentBox,
  shakeIcon,
  pulseScroll,
];
