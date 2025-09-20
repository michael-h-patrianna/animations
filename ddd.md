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

In AnimationCard.tsx we display the description of an animation:
<p className="pf-card__description">{description}</p>

Change this to the follow behaviour (try to use Shadcn)
1. The description is wrapped in an accordion.
2. When the accordion is closed only one line of the description is displayed.
3. Check if easily doable. Only if yes then: the caret icon right of the accordion element is disabled if the description is already fully visible. The accordion cannot be opened. This must work in a responsive environment where the cards can change in width and sometimes the description will be fully visible and on resize it will need the accordion to be fully readable.
