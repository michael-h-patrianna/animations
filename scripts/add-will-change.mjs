#!/usr/bin/env node
/**
 * Script to add will-change properties to CSS animation classes
 * that are missing them.
 */

import fs from 'fs/promises'

const filesToFix = [
  'src/components/progress/loading-states/css/LoadingStatesDotsRise.css',
  'src/components/progress/loading-states/css/LoadingStatesRingProgress.css',
  'src/components/progress/loading-states/css/LoadingStatesSkeletonVertical.css',
  'src/components/progress/loading-states/css/LoadingStatesSkeletonHorizontal.css',
  'src/components/progress/loading-states/css/LoadingStatesSkeletonTile.css',
  'src/components/progress/loading-states/css/LoadingStatesSkeletonCard.css',
  'src/components/progress/progress-bars/css/ProgressBarsZoomedProgress.css',
  'src/components/rewards/lights/css/LightsCircleStatic8.css',
  'src/components/rewards/lights/css/LightsCircleStatic3.css',
  'src/components/rewards/lights/css/LightsCircleStatic2.css',
  'src/components/rewards/lights/css/LightsCircleStatic6.css',
  'src/components/rewards/lights/css/LightsCircleStatic7.css',
  'src/components/rewards/lights/css/LightsCircleStatic5.css',
  'src/components/rewards/lights/css/LightsCircleStatic4.css',
  'src/components/rewards/lights/framer/LightsCircleStatic3.css',
  'src/components/rewards/lights/framer/LightsCircleStatic2.css',
  'src/components/rewards/lights/framer/LightsCircleStatic4.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownStrong.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownSoft.css',
  'src/components/realtime/timer-effects/css/TimerEffectsTimerPulse.css',
  'src/components/realtime/timer-effects/css/TimerEffectsTimerFlip.css',
  'src/components/realtime/timer-effects/css/TimerEffectsTimerColorShift.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownMedium.css',
  'src/components/realtime/timer-effects/css/TimerEffectsPillCountdownExtreme.css',
  'src/components/dialogs/modal-content/css/ModalContentFormFieldLeftReveal.css',
  'src/components/dialogs/modal-content/css/ModalContentListSpotlight.css',
  'src/components/dialogs/modal-content/css/ModalContentFormFieldGradient.css',
  'src/components/dialogs/modal-content/css/ModalContentListVerticalWipe.css',
  'src/components/dialogs/modal-content/css/ModalContentFormFieldRightReveal.css',
  'src/components/dialogs/modal-content/css/ModalContentButtonsStagger3.css',
  'src/components/dialogs/modal-content/css/ModalContentListSoftStagger.css',
  'src/components/base/text-effects/css/TextEffectsCounterIncrement.css',
]

/**
 * Extract animated properties from @keyframes
 */
function extractAnimatedProperties(keyframesBlock) {
  const properties = new Set()

  // Look for property names in keyframe blocks
  const propertyPatterns = [
    /\btransform\b/,
    /\bopacity\b/,
    /\bwidth\b/,
    /\bheight\b/,
    /\bbackground-position\b/,
    /\bbackground\b/,
    /\bcolor\b/,
    /\bbox-shadow\b/,
  ]

  for (const pattern of propertyPatterns) {
    if (pattern.test(keyframesBlock)) {
      const prop = pattern.source.match(/\\b(\w+(-\w+)*)\\b/)?.[1]
      if (prop) properties.add(prop)
    }
  }

  return Array.from(properties)
}

/**
 * Add will-change to classes with animation
 */
async function addWillChangeToFile(filePath) {
  console.log(`Processing: ${filePath}`)

  const content = await fs.readFile(filePath, 'utf-8')

  // Find all @keyframes blocks and their animated properties
  const keyframesMap = new Map()
  const keyframesRegex = /@keyframes\s+([\w-]+)\s*{([^}]+({[^}]+}[^}]+)+)}/g
  let match

  while ((match = keyframesRegex.exec(content)) !== null) {
    const animationName = match[1]
    const keyframesBlock = match[2]
    const props = extractAnimatedProperties(keyframesBlock)
    keyframesMap.set(animationName, props)
  }

  let modifiedContent = content

  // Find classes with animation: property and add will-change if missing
  const classRegex = /([.#][\w-]+(?:::?[\w-]+)?)\s*{([^}]*)}/g

  while ((match = classRegex.exec(content)) !== null) {
    const selector = match[1]
    const ruleContent = match[2]

    // Check if this rule has animation
    if (/animation:/.test(ruleContent) && !/will-change:/.test(ruleContent)) {
      // Try to determine what properties are animated
      const animationMatch = ruleContent.match(/animation:\s*([^\s;]+)/)
      if (animationMatch) {
        const animationName = animationMatch[1].split(' ')[0]
        const animatedProps = keyframesMap.get(animationName) || ['transform']
        const willChangeValue = animatedProps.length > 0 ? animatedProps.join(', ') : 'transform'

        // Add will-change after the animation property
        const updatedRule = ruleContent.replace(
          /(animation:[^;]+;)/,
          `$1\n  will-change: ${willChangeValue};`
        )

        // Replace the entire rule
        const oldRule = `${selector} {${ruleContent}}`
        const newRule = `${selector} {${updatedRule}}`
        modifiedContent = modifiedContent.replace(oldRule, newRule)
      }
    }
  }

  if (modifiedContent !== content) {
    await fs.writeFile(filePath, modifiedContent, 'utf-8')
    console.log(`✓ Updated: ${filePath}`)
    return true
  }

  console.log(`- No changes needed: ${filePath}`)
  return false
}

async function main() {
  console.log('Adding will-change properties to CSS files...\n')

  let updatedCount = 0

  for (const file of filesToFix) {
    try {
      const updated = await addWillChangeToFile(file)
      if (updated) updatedCount++
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message)
    }
  }

  console.log(`\nComplete! Updated ${updatedCount} files.`)
}

main().catch(console.error)
