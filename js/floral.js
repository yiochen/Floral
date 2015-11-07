function Arrow(vel, d, dd, inc) {
    this.length = vel.length;
    this.dir = vel.normalize();
    this.d = d;
    this.dd = dd;
    if (inc === null) {
        this.inc = true;
    } else {
        this.inc = inc;
    }
    this.alive = true;
}
Arrow.prototype.getVector = function () {
    return this.dir * this.length;
};
Arrow.prototype.setVector = function (vel) {
    this.length = vel.length;
    this.dir = vel.normalize();
};
Arrow.prototype.next = function () {
    if (!this.alive) return;
    var del = this.getVector();
    del.angle += 90;
    this.setVector((this.getVector() + del.normalize() * this.d).normalize() * this.length);
    if (this.inc) {
        this.d += this.dd;
    } else {
        this.d -= this.dd;
    }
    if (Math.abs(this.d) >= this.length / 2) {
        this.alive = false;
    }
};
Arrow.prototype.sprout = function (dd, inc) {
    return new Arrow(this.getVector(), this.d, dd, inc);
};
var CONST = {
    sprout_chance: 0.02,
};
//----------------------------------------------------------//
var initVel = new Point(10, 10);
initVel.angle = Math.random() * 360;
var a = new Arrow(initVel, 1, 0.1, false);
var pos = view.center;
var path = new Path();
path.strokeColor = "white";
path.add(pos);
var counter = 0;
var maxCounter = 1000;
var heads = [{
    pos: pos,
    path: path,
    arrow: a,
}];

function onFrame(event) {
    if (counter < maxCounter) {
        heads.forEach(function (elem, index) {
            var a = elem.arrow;
            var pos = elem.pos;
            var path = elem.path;
            if (a.alive) {
                pos += a.getVector();
                elem.pos = pos;
                path.add(pos);
                path.smooth();
                a.next();
                if (Math.random() < CONST.sprout_chance) {
                    var newPath = new Path();
                    newPath.strokeColor = "white";
                    heads.push({
                        pos: pos.clone(),
                        path: newPath,
                        arrow: a.sprout(Math.random(), Math.random() < 0.5 ? true : false),
                    });
                }
            }
        });
        counter++;
    }
}