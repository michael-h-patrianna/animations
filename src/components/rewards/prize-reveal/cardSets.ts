import {
  cardPackHamsterImage,
  cardPackKittenImage,
  cardPackPuppyImage,
  cardPackDragonPetImage,
  cardPackUnicornImage,
  cardPackGoldfishImage,
  cardPackTurtleImage,
  cardPackBunnyImage,
  cardPackParrotImage,
  cardPackFerretImage,
  cardPackSugarGliderImage,
  cardPackChickImage,
  cardPackDucklingImage,
  cardPackPigletImage,
  cardPackLambImage,
  cardPackCalfImage,
  cardPackFoalImage,
  cardPackGoatKidImage,
  cardPackAlpacaImage,
  cardPackPeacockImage,
  cardPackSquirrelImage,
  cardPackHedgehogImage,
  cardPackRaccoonImage,
  cardPackFoxCubImage,
  cardPackOwlImage,
  cardPackBearCubImage,
  cardPackDeerFawnImage,
  cardPackRedPandaImage,
  cardPackSnowLeopardImage,
  cardPackFairyBunnyImage,
  cardPackSlimePetImage,
  cardPackCrystalSnailImage,
  cardPackMoonCatImage,
  cardPackEmberFoxImage,
  cardPackGriffinChickImage,
  cardPackKitsuneImage,
} from '@/assets'

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
  pets:     { ribbon: 'rgb(79 195 247)',  glow: 'rgb(79 195 247 / 50%)' },  // Sky Blue
  farm:     { ribbon: 'rgb(102 187 106)', glow: 'rgb(102 187 106 / 50%)' }, // Spring Green
  wildlife: { ribbon: 'rgb(255 167 38)',  glow: 'rgb(255 167 38 / 50%)' },  // Amber
  fantasy:  { ribbon: 'rgb(171 71 188)',  glow: 'rgb(171 71 188 / 50%)' },  // Royal Purple
} as const

/* ─── Card Sets ─── */

let nextId = 0
function card(name: string, rarity: 1 | 2 | 3 | 4 | 5, frontImage: string, setId: string): CardData {
  return { id: nextId++, name, rarity, frontImage, setId }
}

export const CARD_SETS: CardSet[] = [
  {
    id: 'pets',
    name: 'Cute Pets',
    ribbonColor: SET_COLORS.pets.ribbon,
    ribbonGlow: SET_COLORS.pets.glow,
    cards: [
      card('Nibbles',  1, cardPackHamsterImage,     'pets'),
      card('Bubbles',  1, cardPackGoldfishImage,     'pets'),
      card('Shelly',   1, cardPackTurtleImage,       'pets'),
      card('Whiskers', 2, cardPackKittenImage,       'pets'),
      card('Clover',   2, cardPackBunnyImage,        'pets'),
      card('Biscuit',  3, cardPackPuppyImage,        'pets'),
      card('Captain',  3, cardPackParrotImage,       'pets'),
      card('Bandit',   4, cardPackFerretImage,       'pets'),
      card('Glider',   5, cardPackSugarGliderImage,  'pets'),
    ],
  },
  {
    id: 'farm',
    name: 'Cute Farm Animals',
    ribbonColor: SET_COLORS.farm.ribbon,
    ribbonGlow: SET_COLORS.farm.glow,
    cards: [
      card('Peep',        1, cardPackChickImage,    'farm'),
      card('Puddle',      1, cardPackDucklingImage,  'farm'),
      card('Truffles',    1, cardPackPigletImage,    'farm'),
      card('Woolly',      2, cardPackLambImage,      'farm'),
      card('Buttercup',   2, cardPackCalfImage,      'farm'),
      card('Gallop',      3, cardPackFoalImage,      'farm'),
      card('Billy',       3, cardPackGoatKidImage,   'farm'),
      card('Marshmallow', 4, cardPackAlpacaImage,    'farm'),
      card('Majesty',     5, cardPackPeacockImage,   'farm'),
    ],
  },
  {
    id: 'wildlife',
    name: 'Cute Wildlife',
    ribbonColor: SET_COLORS.wildlife.ribbon,
    ribbonGlow: SET_COLORS.wildlife.glow,
    cards: [
      card('Acorn',   1, cardPackSquirrelImage,    'wildlife'),
      card('Bristle', 1, cardPackHedgehogImage,    'wildlife'),
      card('Rascal',  1, cardPackRaccoonImage,     'wildlife'),
      card('Rusty',   2, cardPackFoxCubImage,      'wildlife'),
      card('Hoot',    2, cardPackOwlImage,         'wildlife'),
      card('Honey',   3, cardPackBearCubImage,     'wildlife'),
      card('Bambi',   3, cardPackDeerFawnImage,    'wildlife'),
      card('Blossom', 4, cardPackRedPandaImage,    'wildlife'),
      card('Frost',   5, cardPackSnowLeopardImage, 'wildlife'),
    ],
  },
  {
    id: 'fantasy',
    name: 'Cute Fantasy',
    ribbonColor: SET_COLORS.fantasy.ribbon,
    ribbonGlow: SET_COLORS.fantasy.glow,
    cards: [
      card('Sparkle',  1, cardPackFairyBunnyImage,   'fantasy'),
      card('Gloop',    1, cardPackSlimePetImage,      'fantasy'),
      card('Swirl',    1, cardPackCrystalSnailImage,  'fantasy'),
      card('Luna',     2, cardPackMoonCatImage,       'fantasy'),
      card('Blaze',    2, cardPackEmberFoxImage,      'fantasy'),
      card('Talon',    3, cardPackGriffinChickImage,  'fantasy'),
      card('Kitsune',  3, cardPackKitsuneImage,       'fantasy'),
      card('Ember',    4, cardPackDragonPetImage,     'fantasy'),
      card('Stardust', 5, cardPackUnicornImage,       'fantasy'),
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
  1: 0.40,
  2: 0.25,
  3: 0.20,
  4: 0.10,
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
    const pool = CARDS_BY_RARITY[rarity]
    const card = pool[Math.floor(Math.random() * pool.length)]
    drawn.push({ ...card })
  }
  // Sort by rarity ascending for escalating drama
  drawn.sort((a, b) => a.rarity - b.rarity)
  // Randomly mark one card as "new"
  const newIndex = Math.floor(Math.random() * drawn.length)
  drawn[newIndex] = { ...drawn[newIndex], isNew: true }
  return drawn
}
