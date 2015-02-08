# Duedo.js
2D HTML5 game engine
Duedo is currently under heavy development and actually does not have: physics engine and mobile supports

Readme.md INCOMPLETE

#Version info
1. Project started: 01/2014  
2. Actual version: 1.0
3. Renderer: canvas2d context

#Engine info and functionalities
1. Sound manager
  1. Can preload and play: mp3, wav, ogg, mp4
  2. Dynamic sounds: you can give a world location to the sound: smanager.Play("soundname").SetLocation(x, y);
  3. Callbacks for every sound playing
  4. Google speech recognition to trigger vocal commands to your game
2. Events
  1. Set customized events based on time (like a spaceship that appear every 10 seconds or by a random value)
  2. Give to each element a customizable lifetime
  3. Give temporary modifications to an object
3. StateManager
  1. Create your own game states (menu, menu2, gameplay, menu3)
4. Animations
  1. Animate the properties of a graphic object (mysprite.Animate( { prop:val }, time, "Linear"))
  2. Bind customized callbacks to the animations

