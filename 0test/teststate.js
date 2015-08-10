var activeObj = null;
var select;
var qz = 99;
var line;
var rect;

var Cache = game.Cache;
var Ph = game.PhysicsEngine;


var PATH_GAME = "0test/";


/* ======================
 * Game state (test)
*/
function ADD_QUADTREETEST() {



    var quad = {

        bbg: null,
        btn_enter: null,
        pssnow: null,

        Load: function () {
            this.Game.Loader.AddResource(PATH_GAME + "src/tilemaps/rock.jpg");
            this.Game.Loader.AddResource(PATH_GAME + "src/images/ball.png");
            this.Game.Loader.AddResource(PATH_GAME + "src/sprites/samus.png");
            this.Game.Loader.AddResource(PATH_GAME + "src/anims/metroidAnim.json");
            this.Game.Loader.AddResource("src/ParticleSystem/Presets/PSFire.json");
            this.Game.Loader.AddResource("src/ParticleSystem/Presets/PSFire.json");
        },
        Create: function () {
            var obs;
            if(px)
            px.Debug = true;
            //q = new Duedo.QuadTree(this.Game, 0, new Duedo.Rectangle(new Duedo.Vector2(0, 0),
              //  game.World.Width, game.World.Height));

            //game.InteractivityManager.UseQuadTree(q);
            prepareMap();

            var player = new Player();

            game.Add(player.Sprite);
            game.Add(player);
            game.Camera.Follow(player.Sprite);
            rect = new Duedo.Rectangle(new Duedo.Vector2(4, 1), 100, 100);
            rect.Z = 100;
            rect.Draggable = true;
            game.Add(rect);
            //rect.FixedToViewport = true;

            ball = new Duedo.Image(game, game.Cache.GetImage("ball"));
            ball.Width = 1;
            ball.Height = 1;
            ball.Body = Ph.CircleBody(new Duedo.Vector2(10, 1), 0.5, {restitution:1, density:10, friction:2});

            
            game.Add(ball);
    
            ball.OnPointerOn = function() {
                console.log(this);
                this.Alpha = 0.4;
            };
            ball.OnPointerOut = function() {
                this.Alpha = 1;
            };

            rect.OnPointerOn = function() {
                console.log(this);
                this.Alpha = 0.4;
            };
            rect.OnPointerOut = function() {
                this.Alpha = 1;
            };



            //ground
            Ph.RectBody(new Duedo.Vector2(0, 5), 40, 2, {isStatic:true});
          



            //game.Add(rect);1

        },
        Enter: function () {
            //Play ost
            //this.Game.SoundManager.Play("ost1").Repeat = Infinity;
            

        },
        Update: function () {
            
        }

    }

    game.StateManager.AddState("quadtree", quad, true);
}









/* ======================
 * Player (test)
*/
Player = function() {

    this.Body;
    this.Sprite;

    this.Jumping = false;
    this.OnGround = false;
    this.PrintCheck = true;
    this.Init();
};


Player.prototype.Init = function() {
    
    /*Add spritesheet*/
    this.Sprite = new Duedo.SpriteSheet(game, Cache.GetImage("samus"), 'player');
    this.Sprite.Load(game.Cache.GetJSON("metroidAnim"));
    
    this.Sprite.Name = "metroid";
    this.Sprite.Z = 2;
    this.Sprite.Location.X = 3;
    this.Sprite.Location.Y = 0;
    this.Sprite.PlaySequence("standleft");
    game.Camera.Follow(this.Sprite);
    this.Sprite.Body = Ph.RectBody(new Duedo.Vector2(3, 1), 0.5, 1, {friction:10, restitution:0, density:0.2});
    this.Sprite.Rotation = 5;
    this.Sprite.Body.SetFixedRotation(true);
    return this;

};

/*
 * Update
*/
Player.prototype.Update = function() {

    if(!this.Sprite.Body) return;

   if(Keyboard.KeyState(Duedo.Keyboard.RIGHT)) {
       vel = this.Sprite.Body.GetLinearVelocity();
       vel.x = 10;
       this.Sprite.Body.SetLinearVelocity(vel);
       this.Sprite.PlaySequence("runright");
    }
    else if(Keyboard.KeyState(Duedo.Keyboard.LEFT)) {
       vel = this.Sprite.Body.GetLinearVelocity();
       this.Sprite.PlaySequence("runleft");
       vel.x = -10;
       this.Sprite.Body.SetLinearVelocity(vel);
    } else {
        vel = this.Sprite.Body.GetLinearVelocity();

       if(vel.x > 0) {
        this.Sprite.PlaySequence("standright");
        }
        else if(vel.x < 0) {
            this.Sprite.PlaySequence("standleft");
        }
        
    }

          vel = this.Sprite.Body.GetLinearVelocity();
        //console.log(vel);

    if(Keyboard.KeyState(Duedo.Keyboard.UP)) {
        this.Sprite.Body.ApplyForce( new b2Vec2(0,-150), this.Sprite.Body.GetWorldCenter() );
    } 

    if(Keyboard.KeyState(Duedo.Keyboard.CONTROL)) {
        var prj = Ph.RectBody(new Duedo.Vector2(this.Sprite.Location.X+0.7, this.Sprite.Location.Y), 0.5, 0.2, {density:1});
        prj.ApplyForce(new b2Vec2(300,-140), prj.GetPosition());
    } 

};



/* ======================
 * PrepareMap (test)
*/
function prepareMap() {

    

};