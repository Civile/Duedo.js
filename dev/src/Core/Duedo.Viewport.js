﻿/*
==============================
Duedo.Viewport
Author: http://www.edoardocasella.it
Thanks to: Phaser.js

 * Viewport bindable events
   -update
   -targetlocked
 *

 ! To modify Camera Location use: mygame.Viewport.View <-

 To drag:
 press the support key while dragging
 this.DragSupportKey

 About zooming
 https://stackoverflow.com/questions/2916081/zoom-in-on-a-point-using-scale-and-translate

 ? To prevent scaling on mobile
 <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0,       user-scalable=0' >
==============================
*/

Duedo.Viewport = function ( gameContext, ViewWidth, ViewHeight ) {
	Duedo.GraphicObject.call(this);
	this.Game = gameContext || Duedo.Global.Games[0];
	this.Type = Duedo.VIEWPORT;
	this._Debug = false;

	/*
	To modify width and height values see defined property Width and Height
	that are at the bottom of this page
	*/
	this.View;

	this.Translation;

	this.Children = new Array();

	this.Target;

	this.Deadzone;

	this.AtLimitX = false;
	this.AtLimitY = false;

	this.Offset = new Duedo.Vector2(0, 0);
	this.Bounds;

	this._Edge;

	this._Zoom = 1;

	this.OriginalView = {
		Width: null,
		Height: null
	}

	/*Dragging properties*/
	this.DragScale = 0.5;
	// this.DragMouseOnly = 
	this.DragSupportKey = Duedo.Keyboard.SHIFT;
	this.DragPreventFollow = false;

	/*Initialize*/
	return this._init(ViewWidth, ViewHeight);

};

/*Inherit GraphicObject*/
Duedo.Viewport.prototype = Object.create(Duedo.GraphicObject.prototype);
Duedo.Viewport.prototype.constructor = Duedo.Viewport;



/*"following styles"*/
Duedo.Viewport.FOLLOW_XY = 1; //default
Duedo.Viewport.FOLLOW_X  = 2;
Duedo.Viewport.FOLLOW_Y  = 3;



/*
 * _init
 * @private
*/
Duedo.Viewport.prototype._init = function ( ViewWidth, ViewHeight) {
	this._super();

	if( Duedo.Utils.IsNull(this.Game.World) )
	{
		throw "Duedo.Viewport._init: cannot instantite viewport.";
	}

	/*Translation vector*/
	this.Translation = new Duedo.Vector2(0, 0);

	/*Viewport location/dimension*/
	this.View = new Duedo.Rectangle(new Duedo.Vector2(0, 0), ViewWidth, ViewHeight);

	this.OriginalView = {
		Width: ViewWidth,
		Height: ViewHeight,
		X: this.View.Location.X,
		Y: this.View.Location.Y
	}

	/*Reference to the world bounds*/
	this.Bounds            = new Duedo.Rectangle();
	this.Bounds.Location.X = 0;
	this.Bounds.Location.Y = 0;
	this.Bounds.Width      = this.Game.World.Bounds.Width;
	this.Bounds.Height     = this.Game.World.Bounds.Height;

	/*Locations vectors2*/
	this.Location     = this.View.Location;
	this.LastLocation = new Duedo.Vector2(0, 0);

	
	return this;
};





/*
 * Follow
 * @public
 * Follow a target
 * @target: target must be an instance of GraphicObject or at least an object having a location vector and a dimension
*/
Duedo.Viewport.prototype.Follow = function ( object, style ) {

	if(Duedo.Utils.IsNull(object) || Duedo.Utils.IsNull(object["Location"]))
		return null;

	this.Target = object;
	
	switch (style)
	{
		case Duedo.Viewport.FOLLOW_X:
			//TODO:
			break;

		case Duedo.Viewport.FOLLOW_Y:
			//TODO:
			break;

		case Duedo.Viewport.FOLLOW_XY:
		default:
			/*Set deadzone - both axis following */
			var w = this.View.Width / 8;
			var h = this.View.Height / 3;
			this.Deadzone = new Duedo.Rectangle( new Duedo.Vector2( (this.View.Width - w) / 2, (this.View.Height - h) / 2 - h * 0.25), w, h);
			break;
	}


	this.LastLocation = this.Target.Location.Clone();

	//TargetLocked event
	this._CallTriggers("targetlocked");

	return this;
};


/**
 * Reset viewport with new dimension
 * @param {*} width 
 * @param {*} height 
 */
Duedo.Viewport.prototype.Reset = function(width, height) {
	this._init(width, height);
}



/**
 * Zoom
 * @param {*} value 
 */
Duedo.Viewport.prototype.Zoom = function(value) {
	// TODO
	// decrease or increase viewport size
	// update renderer ctx.scale(value, value)
}



/*
 * PreUpdate
 * @public
*/
Duedo.Viewport.prototype.PreUpdate = function() {

   if(this._Draggable)
   {
		this._FavorsDragging();
   }

};



/*
 * _UpdateTargetDependacy
 * @private
*/
Duedo.Viewport.prototype._UpdateTargetDependancy = function() {

	if(!this.Target)
		return;

	if(this._Dragging && this.DragPreventFollow)
		return;

	/*Are we following a target?*/
	this.UpdateTranslation();

};



/*
 * Main update
 * @public
*/
Duedo.Viewport.prototype.Update = function ( deltaT ) {

   this._UpdateTargetDependancy();

	/*Update animations*/
	this.UpdateAnimations( deltaT );
	// View react animations
	this.View.UpdateAnimations( deltaT );

   /*Check camera collision*/
   if( this.Bounds )
   {
	   this.UpdateBoundsCollision();
   }
	 
   /*Update offset*/
   this.Offset.X = this.View.Location.X;
   this.Offset.Y = this.View.Location.Y;

   /*Update translation*/
   this.Location = this.View.Location.DivideScalar(Duedo.Conf.PixelsInMeter).Clone();

   if (!Duedo.Vector2.Compare(this.LastLocation, this.Location))
   {
	   this.Translation = this.Location.Clone().Subtract(this.LastLocation);
   }
   else
   {
	   this.Translation.MultiplyScalar(0);
   }

   return this;

};




/*
 * PostUpdate
*/
Duedo.Viewport.prototype.PostUpdate = function(deltaT) {
   this.LastLocation = this.Location.Clone();
};




/*
 * UpdateTranslation
 * @private
*/
Duedo.Viewport.prototype.UpdateTranslation = function () {

	//Pixel to meters location
	this.mLocation = this.Target.Location.Clone().MultiplyScalar(Duedo.Conf.PixelsInMeter); // location is always scaled by meters per pixel

	/*...follow target - there is a Deadzone */
	if( this.Deadzone )
	{
		this._Edge = this.mLocation.X - this.Deadzone.Location.X;

		if (this.View.Location.X > this._Edge)
		{
			this.View.Location.X = this._Edge;
		}

		this._Edge = this.mLocation.X + this.Target.Width - this.Deadzone.Location.X - this.Deadzone.Width;

		if (this.View.Location.X < this._Edge)
		{
			this.View.Location.X = this._Edge;
		}

		this._Edge = this.mLocation.Y - this.Deadzone.Location.Y;

		if (this.View.Location.Y > this._Edge)
		{
			this.View.Location.Y = this._Edge;
		}

		this._Edge = this.mLocation.Y + this.Target.Height - this.Deadzone.Location.Y - this.Deadzone.Height;

		if (this.View.Location.Y < this._Edge)
		{
			this.View.Location.Y = this._Edge;
		}
	}
	else
	{
		this.FocusOnXY( this.mLocation.X, this.mLocation.Y );
	}

	return this;

};




/*
 * _FavorsDragging
*/
Duedo.Viewport.prototype._FavorsDragging = function() {

	var mouse = this.Game.InputManager.Mouse;

	if(!this._DragMouseLastLocation)
		if(!Duedo.Vector2.Compare(this._DragMouseLastLocation, mouse.Location))
			this._DragMouseLastLocation = mouse.Location.Clone();
	
	//Should be pressed both LEFT_BUTTON and at least a Duedo key {ex: Duedo.Keyboard.CONTROL}
	if(
		(!mouse.IsDown(Duedo.Mouse.LEFT_BUTTON) || !this.Game.InputManager.Keyboard.KeyState(this.DragSupportKey)) && this.DragSupportKey
		|| !mouse.IsDown(Duedo.Mouse.LEFT_BUTTON))
	{
		if(this._Dragging) {
			document.body.style.cursor = 'auto';
		}
		this._Dragging = false;
		return this._DragMouseLastLocation = mouse.Location.Clone();
	}

	var DeltaMouse = mouse.Location.Clone().Subtract(this._DragMouseLastLocation);
	if(DeltaMouse.Magnitude() != 0) {
		document.body.style.cursor = 'grab';
		this._Dragging = true;
	}

	var DirVector = DeltaMouse.Clone();

	DirVector.MultiplyScalar(this.DragScale).Negate();

	// Prevent sliding too much when zooming in
	DirVector.DivideScalar(this.Zoom);

	this.View.Location.X += DirVector.X;
	this.View.Location.Y += DirVector.Y;

	this._DragMouseLastLocation = mouse.Location.Clone();

};





/*
 * UpdateBoundsCollision
 * @private
*/
Duedo.Viewport.prototype.UpdateBoundsCollision = function () {

	/*...check bounds collision*/
	this.AtLimitX = false;
	this.AtLimitY = false;

	//X
	if( this.View.Location.X <= this.Bounds.Location.X )
	{
		this.AtLimitX = true;
		this.View.Location.X = this.Bounds.Location.X;
	}

	if( this.View.Location.X + this.View.Width >= this.Bounds.Location.X + this.Bounds.Width )
	{
		this.AtLimitX = true;
		this.View.Location.X = (this.Bounds.Location.X + this.Bounds.Width) - this.View.Width;
	}

	//Y
	if (this.View.Location.Y <= this.Bounds.Location.Y)
	{
		this.AtLimitY = true;
		this.View.Location.Y = this.Bounds.Location.Y;
	}

	if (this.View.Location.Y + this.View.Height >= this.Bounds.Location.Y + this.Bounds.Height)
	{
		this.AtLimitY = true;
		this.View.Location.Y = (this.Bounds.Location.Y + this.Bounds.Height) - this.View.Height;
	}

	return this;

};



/*
 * FocusOnXY
 * @public
*/
Duedo.Viewport.prototype.FocusOnXY = function (x, y) {
	this.SetPosition( Math.round(x - this.View.HalfWidth ), Math.round( y - this.View.HalfHeight ) );
	return this;
};




/*
 * SetPosition
 * @public
*/
Duedo.Viewport.prototype.SetPosition = function (x, y) {

	this.View.Location.X = x;
	this.View.Location.Y = y;

	if( this.Bounds )
	{
		this.UpdateBoundsCollision();
	}


	return this;

};



/*
 * Intersects
 * @public
 * Check object intersection
*/
Duedo.Viewport.prototype.Intersects = function ( DuedoRect ) {
	/*
		Rectangle intersection
		* TODO - coordinate e dimensioni van convertite in metri
	*/
	return this.View.Intersects(DuedoRect);
};




/*
 * Attach
 * @public
 * Make an object fixed to viewport
 * @gobject: the graphic object
 * @offsetVetor: (Duedo.Vector2) the camera offset
*/
Duedo.Viewport.prototype.Attach = function ( gobj, offsetVector ) {

	if( !Duedo.Utils.IsNull(gobj) )
	{
		gobj.FixedToViewport = true;
		gobj.ViewportOffset  = offsetVector;
	}

	return gobject;

};



/*
 * Detach
 * @public
 * Free an object from the camera. The gobj will no longer follow
 * the camera translation
*/
Duedo.Viewport.prototype.Detach = function ( gobj ) {

	if( !Duedo.Utils.IsNull(gobj) )
	{
		gobj.FixedToViewport = false;
	}

	return gobj;
};


/*
 * Animate
 * @public
 * Animate the View
*/
Duedo.Viewport.prototype.Animate = function ( AffectedProperties, Duration, Tweening, name ) {
	return this.View.Animate(AffectedProperties, Duration, Tweening, name);
};

/*
 * Width
 * @public
 * Manage Width property
*/
Object.defineProperty(Duedo.Viewport.prototype, "Width", {

	set: function ( value ) {
		this.View.Width = value;
		//TODO fix MODIFICA SCALE
	},

	get: function () {
		return this.View.Width;
	}

});



/*
 * Height
 * @public
 * Manage Height property
*/
Object.defineProperty(Duedo.Viewport.prototype, "Height", {

	set: function (value) {
		this.View.Height = value;
		//TODO fix MODIFICA SCALE
	},

	get: function () {
		return this.View.Height;
	}

});



/*
 * HalfWidth
 * @public
*/
Object.defineProperty(Duedo.Viewport.prototype, "HalfWidth", {

	get: function () {
		return this.View.Width / 2;
	}

});



/*
 * HalfHeight
 * @public
*/
Object.defineProperty(Duedo.Viewport.prototype, "HalfHeight", {
	get: function () {
		return this.View.Height / 2;
	}

});



/*
 * Zoom
 * @public
 * Manage Zoom property
*/
Object.defineProperty(Duedo.Viewport.prototype, "Zoom", {

	set: function ( value ) {
		this._Zoom = value;
		// Allow only 1 (Rendrer.this.Context.scale(Zoom))
		if(this._Zoom < 1) {
			this._Zoom = 1;
		}

		// Change camera size
		this.View.Width = this.OriginalView.Width / this._Zoom;
		this.View.Height = this.OriginalView.Height / this._Zoom;

		// Move camera toward the mouse
		if(!this.Game.IsMobile) {
			const mouseLocation = this.Game.InputManager.Mouse.Location.Clone();
			const distance = this.View.Location.Clone().Subtract(mouseLocation);
			distance.Normalize().MultiplyScalar(5);
			const toAdd = this.Location.Clone().Add(distance);
			console.log(this.Game.InputManager.Mouse.LocationInTheWorld());
			// this.FocusOnXY(mouseLocation.X, mouseLocation.Y);
			// this.SetPosition(toAdd.X, toAdd.Y);
		}
	},

	get: function () {
		return this._Zoom;
	}

});



/*
 * Center
 * @public
 * Return the viewport location center
*/
Object.defineProperty(Duedo.Viewport.prototype, "Center", {

	get: function() {
		return new Duedo.Vector2( this.View.Location.X + (this.HalfWidth), this.View.Location.Y + (this.View.HalfHeight));
	},

});



/*
 * EnableDragging
 * @public
 * Makes the viewport draggable
*/
Object.defineProperty(Duedo.Viewport.prototype, "EnableDragging", {

	get: function() {
		return this._Draggable;
	},

	set: function(value) {
		this._Draggable = value;
	}

});



/*
 * Debug
 * @public
 * If setted to true will print debug informations
*/
Object.defineProperty(Duedo.Viewport.prototype, "Debug", {

	get: function() {
		return this._Debug;
	},

	set: function(bool) {

		if(bool === true)
		{
			this._Debug = true;

			if(this._DebugText)
				return;

			/*Prepare a text object through which view the informations*/
			this._DebugText = new Duedo.Text(this.Game, "VIEWPORT-DEBUG");
			this._DebugText.FixedToViewport = true;
			this._DebugText.FontSize = 15;
			this._DebugText.ViewportOffset.X = 5;
			this._DebugText.ViewportOffset.Y = 15;
			this._DebugText.FontWeight = "bold";
			this._DebugText.Draggable = true;

			/*Add to debug storage for updates*/
			this.Game.DebugStorage.Add(this._DebugText);
		}
		else
		{
			this._Debug = false;
			if(this._DebugText)
				this._DebugText.InUse = false;
		}
	}

});




/*
 * RenderDebugInfo
 * @public
 * Render debug information about the viewport
*/
Duedo.Viewport.prototype.RenderDebugInfo = function(renderer) {

	/*Debug info text*/
	this._DebugText.Text = "VIEWPORT-DEBUG\nLocation: {X: "+this.View.Location.X.toFixed(2)+" Y: "+this.View.Location.Y.toFixed(2)+"}\nDimension: {Width: "+this.View.Width+" Height: "+this.View.Height+"}\nBounds: {Width: "+this.Bounds.Width+" Height:    "+this.Bounds.Height+"}\nTranslation: {X:"+this.Translation.X.toFixed(2)+" Y:"+this.Translation.Y.toFixed(2)+"}";
	this._DebugText.Draw(this.Game.Renderer.Context);

	this._DebugText.RenderOrderID = renderer.CurrentRenderOrderID++;
};
