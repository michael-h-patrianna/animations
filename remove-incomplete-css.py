#!/usr/bin/env python3

import os
import re

# List of incomplete CSS animations (no metadata export)
INCOMPLETE_ANIMATIONS = [
    "src/components/base/standard-effects/css/StandardEffectsMorphPulse.tsx",
    "src/components/dialogs/modal-orchestration/css/ModalOrchestrationTabSlide.tsx",
    "src/components/dialogs/modal-orchestration/css/ModalOrchestrationMultiStepProgressive.tsx",
    "src/components/progress/progress-bars/css/ProgressBarsProgressStriped.tsx",
    "src/components/progress/progress-bars/css/ProgressBarsProgressSpark.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownSoft.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownStrong.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsTimerFlash.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownHeartbeat.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownExtreme.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownMedium.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsTimerFlip.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsTimerColorShift.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsTimerFlashSoft.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsPillCountdownGlitch.tsx",
    "src/components/realtime/timer-effects/css/TimerEffectsTimerPulse.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicBounceEnergy.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicBounceSoft.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicBadgeGlint.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicGlowPulse.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicBadgeSweep.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicStarBurst.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicCoinSpinFast.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicGlowOrbit.tsx",
    "src/components/rewards/reward-basic/css/RewardBasicStarRadiate.tsx",
]

def get_component_name(file_path):
    """Extract component name from file path"""
    return os.path.basename(file_path).replace('.tsx', '')

def remove_from_index(index_path, component_names):
    """Remove imports and exports for incomplete components from index file"""

    with open(index_path, 'r') as f:
        content = f.read()

    original_content = content

    for comp_name in component_names:
        # Remove CSS import line
        pattern = f"import \\{{[^}}]*{comp_name}[^}}]*\\}} from '\\./css/{comp_name}'\\n"
        content = re.sub(pattern, '', content)

        # Remove from css export object
        # Match line with this component in css object
        pattern = f"\\s*'[^']+': \\{{ component: Css{comp_name}, metadata: [^}}]+ \\}},?\\n"
        content = re.sub(pattern, '', content)

    if content != original_content:
        with open(index_path, 'w') as f:
            f.write(content)
        return True
    return False

def delete_files(file_paths):
    """Delete the incomplete CSS animation files"""
    for file_path in file_paths:
        tsx_path = file_path
        css_path = file_path.replace('.tsx', '.css')

        if os.path.exists(tsx_path):
            os.remove(tsx_path)
            print(f"  Deleted: {tsx_path}")

        if os.path.exists(css_path):
            os.remove(css_path)
            print(f"  Deleted: {css_path}")

def main():
    print("Removing incomplete CSS animations (those without metadata exports)...")
    print()

    # Group files by their parent directory (group folder)
    groups = {}
    for file_path in INCOMPLETE_ANIMATIONS:
        # Extract group path (e.g., src/components/base/standard-effects)
        parts = file_path.split('/')
        group_path = '/'.join(parts[:-2])  # Remove /css/filename.tsx

        if group_path not in groups:
            groups[group_path] = []
        groups[group_path].append(file_path)

    # Process each group
    for group_path, files in groups.items():
        print(f"Processing {group_path}...")

        # Get component names
        comp_names = [get_component_name(f) for f in files]

        # Update index file
        index_path = f"{group_path}/index.ts"
        if os.path.exists(index_path):
            if remove_from_index(index_path, comp_names):
                print(f"  Updated: {index_path}")

        # Delete the files
        delete_files(files)

        print()

    print(f"Removed {len(INCOMPLETE_ANIMATIONS)} incomplete CSS animations")

if __name__ == "__main__":
    main()
