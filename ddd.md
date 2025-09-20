read README.md
task:
the Achievement Ring animation is broken, does not display what it is supposed to show check its name and description. plan and create a high class, production- and game-ready animation.


use /Users/Spare/Documents/graphics/image_manifest.json and /Users/Spare/Documents/graphics/ for getting high quality image assets

Level Meter Spin
Level Banner Rise
Achievement Card
Quest Chain

read README.md

1. Add a new group "Icon effects" to the category "Base effects".
2. Move into the "Icon effects" category the


Remove Complex timers

Move the XP Number Pop and Level Breakthrough animation into the Text Effects group. Pay extreme attention to maintaining the exact ui, look and animation behaviour. do not break them.


read README.md
Make sure that in the AnimationCard component it is possible to select the title and description text with the mouse cursor. currently it is not possible because the swiping of the whole category is catching the mouse in this case. any mouse interaction on an AnimationCard should not be used for the swiping/navigation between categories.

Move the Timeline Progress animation into the Progress Bar group. Remove the card only leave the timeline milestones progress bar on top. Make sure you move all css needed for this to still work and look the same way it did before.
