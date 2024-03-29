﻿/*
==============================
Duedo.State ( TEMPLATE )
Author: http://www.edoardocasella.it
==============================
*/

Duedo.State = function () {

};


/*
 * Constructor
*/
Duedo.State.prototype.constructor = Duedo.State;



/*
 * Data
 * @overwritten
 * To store state's relative data: accessible as this.StateData from every state's methods
*/
Duedo.State.prototype.Data = {};



/*
 * Load
 * @overwritten
*/
Duedo.State.prototype.Load = function () {
};




/*
 * LoadUpdate
 * @overwritten
*/
Duedo.State.prototype.LoadUpdate = function() {
};


/*
 * Create
 * @overwritten
*/
Duedo.State.prototype.Create = function () {
};



/*
 * Update
 * @overwritten
*/
Duedo.State.prototype.Update = function () {
};

/*
 * Paused
 * @overwritten
*/
Duedo.State.prototype.PausedUpdate = function () {
};



/*
 * Render
 * @private
*/
Duedo.State.prototype.Render = function (_2dcontext) {
};

/*
 * Exit
 * @overwritten
*/
Duedo.State.prototype.Exit = function () {
};



/*
 * Zoom
 * @overwritten
*/
Duedo.State.prototype.Zoom = function () {
};



/*
 * Enter
 * @overwritten
*/
Duedo.State.prototype.Enter = function () {
};



/*
 * Shutdown
 * @overwritten
*/
Duedo.State.prototype.Destroy = function () {
};



/*
 * Pause
 * @overwritten
*/
Duedo.State.prototype.Pause = function() {
};



/*
 * Resume
 * @overwritten
*/
Duedo.State.prototype.Resume = function() {	
};
