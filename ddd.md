read README.md
task:
the Achievement Ring animation is broken, does not display what it is supposed to show check its name and description. plan and create a high class, production- and game-ready animation.


use /Users/Spare/Documents/graphics/image_manifest.json and /Users/Spare/Documents/graphics/ for getting high quality image assets

Level Meter Spin
Level Banner Rise
Achievement Card
Quest Chain

read README.md
1. Add a new group "Standard effects" to the category "Base effects".
2. Move into the "Standard effects" category the animation previews: Error Shake Gentle, and Success Bounce Soft
3. Rename Error Shake Gentle to Error Shake, Success Bounce Soft to Success Bounce
4. Remove the animation previews Error Shake Intentional and Success Bounce Energetic


5. Add a new group "Icon effects" to the category "Base effects".



Move the Timeline Progress animation into the Progress Bar group. Remove the card only leave the timeline milestones progress bar on top. Make sure you move all css needed for this to still work and look the same way it did before.


remove the following animation previews completely: Soft Fill, Pulse Update, Thick Pulse, Surge Final, Wave Motion


C
Move the following animation preve


Read Readme.md

At the moment we are showing in one view all animation previews for a category.
Instead:
1. In a single view show only the animations of a group
2. The sidebar visually indicates the currently displayed group
3. When clicking on a category in the sidebar, it navigates to the first group in the category
4. Views nowhere show the title of the category

Read README.md
In the Content choreography group we have several animation previews that have elements in their content that have default styling using white background and dark text. They need to be adapted to our actual color scheme.

All animations in the Content choreography group currently only animate content inside the mock modal container. But the purpose of these animations is to demonstrate how to chain animations of opening a modal and animating their content.

For this:
1. Add a good looking modal open animation to all of the mock modals. (these are not actual modals, just containers that look like modals).
2. Make sure that the currently existing animations for the content in these modals are timed so that they create a good looking animation sequence. This means usually that the content animation start playing shortly before the modal is fully opened.

Move the group "Celebration effects" together with all its animations into the Game Elements & Rewards category

In the Wizard Scale Rotate animation preview, highlight the first Step as well as the first tile with a subtle but pleasing border color change.

Remove the animation previews: Tab Tile Swap, Progressive Tile Flow, Tile Highlight Sweep

Modify the Tab Content Morph preview
1. Turn it into an actual working tab component
2. Animate the tab content swiping left right when navigating through the tabs
3. Highlight the currently selected tab
4. The first tab is selected by default

Remove the animation previes: Spark Trail, Crisp Snap
Remove the Blur from Fade with Zoom animation

CRT TV Turn On and Origami Unfold look the same


read README.md and docs/REACT_NATIVE_REFACTORING_PATTERNS.md to understand this project.

the group Standard effects in the Base effects category is supposed to be a showcase of commonly used animation types in mobile games, triple aaa games and best-of-class websites and apps.

1. research and prepare a list of animations that should be showcased (e.g. shake, wiggle, bounce, ripple effect on buttons, etc)
2. enhance your plan to follow the disney animation principle that you have a main animation accompanied by 1 or 2 more subtle secondary animations do provide more depth to animations.
3. then implement new previews for these animations in the Standard effects category.

do not use particle effects.

use these images for the Standard animations group
Shake: /Users/Spare/Documents/graphics/casino-2023-11-27-05-09-50-utc/PNG/480px/unlucky_hires.png
Bounce: /Users/Spare/Documents/graphics/casino-2023-11-27-05-09-50-utc/PNG/480px/win_hires.png
Wiggle: /Users/Spare/Documents/graphics/casino-3d-icons-2025-01-22-15-24-15-utc/png/037-bell.png
Spin: /Users/Spare/Documents/graphics/casino-gambling-3d-icon-2024-05-06-19-31-22-utc/34.png
Float: /Users/Spare/Documents/graphics/baby animals and christmas/PNG/1.png
Pulse: /Users/Spare/Documents/graphics/adventure-game-3d-icon-2024-09-12-17-19-47-utc/Roll Paper.png
/Users/Spare/Documents/graphics/casino-3d-icons-2025-01-22-15-21-14-utc/png/010-jackpot.png for

remove the animation previews: Lift Arrival, Fade & Blur Soft, Fade & Vertical Shift, Fade with Zoom


Treasure chest closed:
Treasure chest opened:
Ancient scroll: /Users/Spare/Documents/graphics/adventure-game-3d-icon-2024-09-12-17-19-47-utc/Roll Paper.png
Sack of gold: /Users/Spare/Documents/graphics/adventure-game-3d-icon-2024-09-12-17-19-47-utc/Money Bag.png
Magic book: adventure-game-3d-icon-2024-09-12-17-19-47-utc/Game Book.png
Treasure map: /Users/Spare/Documents/graphics/adventure-3d-illustration-2024-08-19-16-09-40-utc/Adventure Map.png
Key: /Users/Spare/Documents/graphics/adventure-game-3d-illustration-2024-09-06-23-38-24-utc/Key.png
Coin: /Users/Spare/Documents/graphics/adventure-game-3d-illustration-2024-09-06-23-38-24-utc/Game Coins.png
Potion: /Users/Spare/Documents/graphics/game-assets-3d-illustration-2023-11-27-05-12-38-utc/18 a.png
Hammer: /Users/Spare/Documents/graphics/game-assets-3d-illustration-2023-11-27-05-12-38-utc/13 a.png


cute
/Users/Spare/Documents/graphics/baby%20animals%20and%20christmas/PNG/1.png


/Users/Spare/Documents/graphics/3d-treasure-illustration-2024-01-27-00-38-40-utc/0007.png


copy this image into our assets: /Users/Spare/Documents/graphics/game-assets-3d-illustration-2023-11-27-04-49-50-utc/14 a.png

Use this image for the Shake animation. Remove the text and the rectangle container from the animation, only animate the image. Do not rewrite anything from the animation or its keyframes itself

In the Pulse animation, Remove the text and the rectangle container from the animation, only animate the image. Do not rewrite anything from the animation or its keyframes itself. Make the image larger (relative to height) to be in line with the image size we have in the Bounce animation. Make the glow area smaller as the image shows a scroll which leaves lot of empty transparent space left and right.

in the Game Element & Rewards category add a new group "Icon animations". Make it the first group in this category.

To the new group add exact copies of the Shake, Bounce, Float, Pulse animations. Make sure to create exact copies including all CSS, so the copy and original are independent of each other.

In the Standard effects group, unify all animations in what they animate: a rectangle with only the name of the animation inside
e.g.:
<div class="standard-demo-element wiggle-element"><div class="demo-text">Shake</div></div>

no image

Remove the following groups and all their animations: Basic Rewards, UI feedback

Review the animations: Slide Up Soft, Slide Down Welcome, Slide Down Hero Drop, Slide Left Drift, 3D Card Flip, Slide Right Drift, Portal Swirl

problem: they feel choppy / stuttery. they should look more fluid. are they using CSS keyframes? check if you can replace them with framer motion animations that do and look exactly the same. if not: check if you can use more keyframes and/or change the timing function to make the animations look more fluid.

Remove the animation Material Ripple



The Wave Text animation is very imperformant causing constant layout recalcs. Review and suggest solutions. Do not change code, just analyse the code and the problem and suggest solutions.
