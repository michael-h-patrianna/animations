import cardPackHamsterImage from '@/assets/card-pack/card-hamster.png'
import cardPackKittenImage from '@/assets/card-pack/card-kitten.png'
import cardPackPuppyImage from '@/assets/card-pack/card-puppy.png'
import cardPackDragonPetImage from '@/assets/card-pack/card-dragon-pet.png'
import cardPackUnicornImage from '@/assets/card-pack/card-unicorn.png'
import cardPackGoldfishImage from '@/assets/card-pack/card-goldfish.png'
import cardPackTurtleImage from '@/assets/card-pack/card-turtle.png'
import cardPackBunnyImage from '@/assets/card-pack/card-bunny.png'
import cardPackParrotImage from '@/assets/card-pack/card-parrot.png'
import cardPackFerretImage from '@/assets/card-pack/card-ferret.png'
import cardPackSugarGliderImage from '@/assets/card-pack/card-sugar-glider.png'
import cardPackChickImage from '@/assets/card-pack/card-chick.png'
import cardPackDucklingImage from '@/assets/card-pack/card-duckling.png'
import cardPackPigletImage from '@/assets/card-pack/card-piglet.png'
import cardPackLambImage from '@/assets/card-pack/card-lamb.png'
import cardPackCalfImage from '@/assets/card-pack/card-calf.png'
import cardPackFoalImage from '@/assets/card-pack/card-foal.png'
import cardPackGoatKidImage from '@/assets/card-pack/card-goat-kid.png'
import cardPackAlpacaImage from '@/assets/card-pack/card-alpaca.png'
import cardPackPeacockImage from '@/assets/card-pack/card-peacock.png'
import cardPackSquirrelImage from '@/assets/card-pack/card-squirrel.png'
import cardPackHedgehogImage from '@/assets/card-pack/card-hedgehog.png'
import cardPackRaccoonImage from '@/assets/card-pack/card-raccoon.png'
import cardPackFoxCubImage from '@/assets/card-pack/card-fox-cub.png'
import cardPackOwlImage from '@/assets/card-pack/card-owl.png'
import cardPackBearCubImage from '@/assets/card-pack/card-bear-cub.png'
import cardPackDeerFawnImage from '@/assets/card-pack/card-deer-fawn.png'
import cardPackRedPandaImage from '@/assets/card-pack/card-red-panda.png'
import cardPackSnowLeopardImage from '@/assets/card-pack/card-snow-leopard.png'
import cardPackFairyBunnyImage from '@/assets/card-pack/card-fairy-bunny.png'
import cardPackSlimePetImage from '@/assets/card-pack/card-slime-pet.png'
import cardPackCrystalSnailImage from '@/assets/card-pack/card-crystal-snail.png'
import cardPackMoonCatImage from '@/assets/card-pack/card-moon-cat.png'
import cardPackEmberFoxImage from '@/assets/card-pack/card-ember-fox.png'
import cardPackGriffinChickImage from '@/assets/card-pack/card-griffin-chick.png'
import cardPackKitsuneImage from '@/assets/card-pack/card-kitsune.png'

import type { CardData } from './CardPackParts'

/* ─── Card Set Definition ─── */

export type CardSet = {
  id: string
  name: string
  ribbonColor: string
  ribbonGlow: string
  cards: CardData[]
}

/* ─── Ribbon colors per set ─── */

const SET_COLORS = {
  pets: { ribbon: 'var(--set-pets-ribbon)', glow: 'var(--set-pets-glow)' }, // Sky Blue
  farm: { ribbon: 'var(--set-farm-ribbon)', glow: 'var(--set-farm-glow)' }, // Spring Green
  wildlife: { ribbon: 'var(--set-wildlife-ribbon)', glow: 'var(--set-wildlife-glow)' }, // Amber
  fantasy: { ribbon: 'var(--set-fantasy-ribbon)', glow: 'var(--set-fantasy-glow)' }, // Royal Purple
} as const

/* ─── Card Sets ─── */

let nextId = 0
function card(
  name: string,
  rarity: 1 | 2 | 3 | 4 | 5,
  frontImage: string,
  setId: string
): CardData {
  return { id: nextId++, name, rarity, frontImage, setId }
}

export const CARD_SETS: CardSet[] = [
  {
    id: 'pets',
    name: 'Cute Pets',
    ribbonColor: SET_COLORS.pets.ribbon,
    ribbonGlow: SET_COLORS.pets.glow,
    cards: [
      card('Nibbles', 1, cardPackHamsterImage, 'pets'),
      card('Bubbles', 1, cardPackGoldfishImage, 'pets'),
      card('Shelly', 1, cardPackTurtleImage, 'pets'),
      card('Whiskers', 2, cardPackKittenImage, 'pets'),
      card('Clover', 2, cardPackBunnyImage, 'pets'),
      card('Biscuit', 3, cardPackPuppyImage, 'pets'),
      card('Captain', 3, cardPackParrotImage, 'pets'),
      card('Bandit', 4, cardPackFerretImage, 'pets'),
      card('Glider', 5, cardPackSugarGliderImage, 'pets'),
    ],
  },
  {
    id: 'farm',
    name: 'Cute Farm Animals',
    ribbonColor: SET_COLORS.farm.ribbon,
    ribbonGlow: SET_COLORS.farm.glow,
    cards: [
      card('Peep', 1, cardPackChickImage, 'farm'),
      card('Puddle', 1, cardPackDucklingImage, 'farm'),
      card('Truffles', 1, cardPackPigletImage, 'farm'),
      card('Woolly', 2, cardPackLambImage, 'farm'),
      card('Buttercup', 2, cardPackCalfImage, 'farm'),
      card('Gallop', 3, cardPackFoalImage, 'farm'),
      card('Billy', 3, cardPackGoatKidImage, 'farm'),
      card('Marshmallow', 4, cardPackAlpacaImage, 'farm'),
      card('Majesty', 5, cardPackPeacockImage, 'farm'),
    ],
  },
  {
    id: 'wildlife',
    name: 'Cute Wildlife',
    ribbonColor: SET_COLORS.wildlife.ribbon,
    ribbonGlow: SET_COLORS.wildlife.glow,
    cards: [
      card('Acorn', 1, cardPackSquirrelImage, 'wildlife'),
      card('Bristle', 1, cardPackHedgehogImage, 'wildlife'),
      card('Rascal', 1, cardPackRaccoonImage, 'wildlife'),
      card('Rusty', 2, cardPackFoxCubImage, 'wildlife'),
      card('Hoot', 2, cardPackOwlImage, 'wildlife'),
      card('Honey', 3, cardPackBearCubImage, 'wildlife'),
      card('Bambi', 3, cardPackDeerFawnImage, 'wildlife'),
      card('Blossom', 4, cardPackRedPandaImage, 'wildlife'),
      card('Frost', 5, cardPackSnowLeopardImage, 'wildlife'),
    ],
  },
  {
    id: 'fantasy',
    name: 'Cute Fantasy',
    ribbonColor: SET_COLORS.fantasy.ribbon,
    ribbonGlow: SET_COLORS.fantasy.glow,
    cards: [
      card('Sparkle', 1, cardPackFairyBunnyImage, 'fantasy'),
      card('Gloop', 1, cardPackSlimePetImage, 'fantasy'),
      card('Swirl', 1, cardPackCrystalSnailImage, 'fantasy'),
      card('Luna', 2, cardPackMoonCatImage, 'fantasy'),
      card('Blaze', 2, cardPackEmberFoxImage, 'fantasy'),
      card('Talon', 3, cardPackGriffinChickImage, 'fantasy'),
      card('Kitsune', 3, cardPackKitsuneImage, 'fantasy'),
      card('Ember', 4, cardPackDragonPetImage, 'fantasy'),
      card('Stardust', 5, cardPackUnicornImage, 'fantasy'),
    ],
  },
]

/* ─── All card images (for preloading) ─── */

export const ALL_CARD_IMAGES = CARD_SETS.flatMap((set) => set.cards.map((c) => c.frontImage))

/* ─── Set lookup ─── */

const setMap = new Map(CARD_SETS.map((s) => [s.id, s]))

export function getCardSet(setId: string): CardSet | undefined {
  return setMap.get(setId)
}

/* ─── Weighted random draw ─── */

/** Probability weights per star rarity (must sum to 1) */
const RARITY_WEIGHTS: Record<number, number> = {
  1: 0.4,
  2: 0.25,
  3: 0.2,
  4: 0.1,
  5: 0.05,
}

/** All cards grouped by rarity across all sets */
const CARDS_BY_RARITY: Record<number, CardData[]> = {}
for (const set of CARD_SETS) {
  for (const c of set.cards) {
    ;(CARDS_BY_RARITY[c.rarity] ??= []).push(c)
  }
}

/** Pick a random rarity using weighted probabilities */
function pickRarity(): number {
  const roll = Math.random()
  let cumulative = 0
  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulative += weight
    if (roll < cumulative) return Number(rarity)
  }
  return 1 // fallback
}

/** Draw N random cards from across all sets using weighted rarity */
export function drawCards(count: number): CardData[] {
  const drawn: CardData[] = []
  for (let i = 0; i < count; i++) {
    const rarity = pickRarity()
    const pool = CARDS_BY_RARITY[rarity]!
    const card = pool[Math.floor(Math.random() * pool.length)]!
    drawn.push({ ...card })
  }
  // Sort by rarity ascending for escalating drama
  drawn.sort((a, b) => a.rarity - b.rarity)
  // Randomly mark one card as "new"
  const newIndex = Math.floor(Math.random() * drawn.length)
  drawn[newIndex] = { ...drawn[newIndex]!, isNew: true }
  return drawn
}
