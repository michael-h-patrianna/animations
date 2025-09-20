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
