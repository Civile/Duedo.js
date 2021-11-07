
// Gulp version 4
var gulp = require("gulp");
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
const { series } = require("gulp");

/* 
Define gulp task.
This task will uglify all js files in js directory 
and create uglified or minified files with min.js extension inside the 
dist/js directory.
*/
 
gulp.task( "uglify", gulp.series(async function () {
         gulp
        .src("js/*.js")
        .pipe(uglify())
        .pipe(
          rename(function (path) {
            path.extname = ".min.js";
          })
        )
        .pipe(gulp.dest("./dist/js/"));
      })
);

// Code to run gulp tasks
gulp.task(
	"default",
	gulp.series("uglify")
);

/**
 * Compress and uglify engine core
*/
/*
gulp.task('minify', null, function() {
  return gulp
  	.src([
      'dev/src/Duedo.js'
      ,'dev/src/Core/Duedo.Consts.js'
      ,'dev/src/Core/Duedo.Client.js'
      ,'dev/src/Loader/Duedo.Require.js'
      ,'dev/src/Time/Duedo.Time.js'
      ,'dev/src/Math/Duedo.Matrix2.js',
      ,'dev/src/Math/Duedo.Vector2.js',
      ,'dev/src/Other/Duedo.Utils.js',
      ,'dev/src/Other/Duedo.Units.js'
      ,'dev/src/Object/Duedo.Easing.js'
      ,'dev/src/Object/Duedo.Object.js'
      ,'dev/src/Object/Duedo.GraphicObject.js'
      ,'dev/src/Object/Duedo.Entity.js',
      ,'dev/src/Physics/Duedo.prototype.js',
      ,'dev/src/Physics/Box2dWeb-2.1.a.3.js'
      ,'dev/src/Other/Duedo.QuadTree.js'
      ,'dev/src/Physics/Duedo.PhysicsEngine.js'
      ,'dev/src/Object/Duedo.ChildrenList.js'
      ,'dev/src/Object/Duedo.Animation.js'
      ,'dev/src/Object/Duedo.AnimationManager.js'
      ,'dev/src/Geometry/Duedo.Shape.js'
      ,'dev/src/Geometry/Duedo.Dimension.js'
      ,'dev/src/Geometry/Duedo.Point.js'
      ,'dev/src/Geometry/Duedo.Rectangle.js'
      ,'dev/src/Geometry/Duedo.Polygon.js'
      ,'dev/src/Geometry/Duedo.Circle.js'
      ,'dev/src/Geometry/Duedo.Line.js'
      ,'dev/src/Object/Duedo.Text.js',
      ,'dev/src/Parallax/Duedo.Layer.js'
      ,'dev/src/Parallax/Duedo.Parallax.js'
      ,'dev/src/ParticleSystem/Duedo.Particle.js',
      ,'dev/src/ParticleSystem/Duedo.ParticleSystem.js'
      ,'dev/src/SpriteSheet/Duedo.SSequence.js'
      ,'dev/src/SpriteSheet/Duedo.SpriteSheet.js'
      ,'dev/src/Object/Duedo.Image.js'
      ,'dev/src/Core/Duedo.Cache.js'
      ,'dev/src/Loader/Duedo.Loader.js'
      ,'dev/src/Audio/Duedo.SpeechRecognition.js'
      ,'dev/src/Audio/Duedo.Sound.js'
      ,'dev/src/Audio/Duedo.SoundManager.js'
      ,'dev/src/Tilesmap/Duedo.Tile.js'
      ,'dev/src/Tilesmap/Duedo.TilemapLayer.js'
      ,'dev/src/Tilesmap/Duedo.Tilemap.js'
      ,'dev/src/Core/Duedo.State.js'
      ,'dev/src/Core/Duedo.StateManager.js'
      ,'dev/src/Core/Duedo.Events.js'
      ,'dev/src/Core/Duedo.Stage.js'
      ,'dev/src/Input/Duedo.InputManager.js'
      ,'dev/src/Input/Duedo.Keyboard.js'
      ,'dev/src/Input/Duedo.Key.js'
      ,'dev/src/Input/Duedo.Mouse.js'
      ,'dev/src/Input/Duedo.InteractivityManager.js'
      ,'dev/src/Input/Duedo.InteractiveProperties.js'
      ,'dev/src/Core/Duedo.Viewport.js'
      ,'dev/src/Core/Duedo.World.js'
      ,'dev/src/Core/Duedo.Renderer.js'
      ,'dev/src/Core/Duedo.GameContext.js'
      ,'dev/src/Core/Duedo.DebugStorage.js'
  	])
    .pipe(uglify())
    .pipe(concat('duedo.minified.js'))
    .pipe(gulp.dest('build/'));
});
*/
/**
gulp.task('duedo', function() {
  return gulp
    .src([
      'dev/src/Duedo.js'
      ,'dev/src/Core/Duedo.Consts.js'
      ,'dev/src/Core/Duedo.Client.js'
      ,'dev/src/Loader/Duedo.Require.js'
      ,'dev/src/Time/Duedo.Time.js'
      ,'dev/src/Math/Duedo.Matrix2.js',
      ,'dev/src/Math/Duedo.Vector2.js',
      ,'dev/src/Other/Duedo.Utils.js',
      ,'dev/src/Other/Duedo.Units.js'
      ,'dev/src/Object/Duedo.ChildrenList.js'
      ,'dev/src/Object/Duedo.Easing.js'
      ,'dev/src/Object/Duedo.Object.js'
      ,'dev/src/Object/Duedo.GraphicObject.js'
      ,'dev/src/Object/Duedo.Entity.js',
      ,'dev/src/Physics/Duedo.prototype.js',
      ,'dev/src/Physics/Box2dWeb-2.1.a.3.js'
      ,'dev/src/Other/Duedo.QuadTree.js',
      ,'dev/src/Physics/Duedo.PhysicsEngine.js',
      ,'dev/src/Object/Duedo.Animation.js'
      ,'dev/src/Object/Duedo.AnimationManager.js'
      ,'dev/src/Geometry/Duedo.Shape.js'
      ,'dev/src/Geometry/Duedo.Dimension.js'
      ,'dev/src/Geometry/Duedo.Point.js'
      ,'dev/src/Geometry/Duedo.Rectangle.js'
      ,'dev/src/Geometry/Duedo.Polygon.js'
      ,'dev/src/Geometry/Duedo.Circle.js'
      ,'dev/src/Geometry/Duedo.Line.js'
      ,'dev/src/Object/Duedo.Text.js',
      ,'dev/src/Parallax/Duedo.Layer.js'
      ,'dev/src/Parallax/Duedo.Parallax.js'
      ,'dev/src/ParticleSystem/Duedo.Particle.js',
      ,'dev/src/ParticleSystem/Duedo.ParticleSystem.js'
      ,'dev/src/SpriteSheet/Duedo.SSequence.js'
      ,'dev/src/SpriteSheet/Duedo.SpriteSheet.js'
      ,'dev/src/Object/Duedo.Image.js'
      ,'dev/src/Core/Duedo.Cache.js'
      ,'dev/src/Loader/Duedo.Loader.js'
      ,'dev/src/Audio/Duedo.SpeechRecognition.js'
      ,'dev/src/Audio/Duedo.Sound.js'
      ,'dev/src/Audio/Duedo.SoundManager.js'
      ,'dev/src/Tilesmap/Duedo.Tile.js'
      ,'dev/src/Tilesmap/Duedo.TilemapLayer.js'
      ,'dev/src/Tilesmap/Duedo.Tilemap.js'
      ,'dev/src/Core/Duedo.State.js'
      ,'dev/src/Core/Duedo.StateManager.js'
      ,'dev/src/Core/Duedo.Events.js'
      ,'dev/src/Core/Duedo.Stage.js'
      ,'dev/src/Input/Duedo.InputManager.js'
      ,'dev/src/Input/Duedo.Keyboard.js'
      ,'dev/src/Input/Duedo.Key.js'
      ,'dev/src/Input/Duedo.Mouse.js'
      ,'dev/src/Input/Duedo.InteractivityManager.js'
      ,'dev/src/Input/Duedo.InteractiveProperties.js'
      ,'dev/src/Core/Duedo.Viewport.js'
      ,'dev/src/Core/Duedo.World.js'
      ,'dev/src/Core/Duedo.Renderer.js'
      ,'dev/src/Core/Duedo.GameContext.js'
      ,'dev/src/Core/Duedo.DebugStorage.js'
    ])
    .pipe(concat('duedo.js'))
    .pipe(gulp.dest('build/'));
});
*/
/**
 * Default
*/
gulp.task('default', ['uglify']);