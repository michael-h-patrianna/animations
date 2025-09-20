read README.md
task:
the Achievement Ring animation is broken, does not display what it is supposed to show check its name and description. plan and create a high class, production- and game-ready animation.


use /Users/Spare/Documents/graphics/image_manifest.json and /Users/Spare/Documents/graphics/ for getting high quality image assets

Level Meter Spin
Level Banner Rise
Achievement Card
Quest Chain

read README.md

1. Add a new category "Base effects".
2. The caegory is the first category.
3. In the category add a group "Text effects".
4. In the text effects category add as first animation the complete text reveal effect from the existing "Achievement Ring" animation - only the text not the ring and trophy animations.


Remove Complex timers

Move the XP Number Pop and Level Breakthrough animation into the Text Effects group. Pay extreme attention to maintaining the exact ui, look and animation behaviour. do not break them.


read README.md

at the moment we display all animations in one long list.

instead:
1. we only display one category at a time
2. when changing categories there is a professional swipe transition
3. the sidebar indicates the currently displayed category
4. when selecting a group, the correct category is swiped in, and then the view scrolls the requested group into view
