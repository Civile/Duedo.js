﻿/*
==============================
Duedo.Stage
Updates all the game entities
Author: http://www.edoardocasella.it
==============================
*/

Duedo.Stage = function (gameContext) {
    Duedo.Object.call(this);
    this.Game = gameContext || Duedo.Global.Games[0];
};

/*Inherit generic Object*/
Duedo.Stage.prototype = Object.create(Duedo.Object.prototype);
Duedo.Stage.prototype.constructor = Duedo.Stage;



/*
 * Update levels
 * Called by the main loop
*/
Duedo.Stage.prototype.PreUpdate = function (dt) {
    this.__Update(dt, this.Game.Entities, "PreUpdate");
};
Duedo.Stage.prototype.Update = function (dt) {
    this.__Update(dt, this.Game.Entities, "Update");
};
Duedo.Stage.prototype.PostUpdate = function (dt) {
    this.__Update(dt, this.Game.Entities, "PostUpdate");
};



/*
 * __Update
 * @private
*/
Duedo.Stage.prototype.__Update = function (deltaT, ents, upLevel) {

    /*Update entities*/
    var len = ents.length - 1;

    /*Cycle through all entities*/
    while ((ent = ents[len--]) != null) {

        /*Check entity life*/
        if (!Duedo.Null(ent["InUse"])) {
            if (ent.MustBeDead(this.Game))
                ent.InUse = false;

            /*Entity is dead*/
            if (!ent.InUse) {
                if (!Duedo.Null(ent["_CallTriggers"]))
                    ent._CallTriggers("destroy");
                this.Game.Entities.splice(i, 1);
                continue;
            }
        }

        /*Update entity*/
        if (!Duedo.Null(ent[upLevel])) {
            ent[upLevel](deltaT);
            if(!Duedo.Null(ent["Super" + upLevel]))
                ent["Super" + upLevel](deltaT);
        }
    }
};

