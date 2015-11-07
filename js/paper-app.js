var fb = new Firebase("https://multidraw.firebaseIO.com/path");
var path;
var pathRef;
var paths = [];
tool.minDistance = 10;

document.querySelector('#clear').addEventListener('click', function () {
    //    document.querySelector('#clear_notice').style.display="block";
    fb.push({
        clear: true
    });
    //    document.querySelector('#clear_notice').style.display="none";
});

function clear() {
    fb.remove();
    pathRef = null;
    project.activeLayer.removeChildren();
    view.draw();
}
fb.on('child_added', function (snapshot) {
    var sPoint = snapshot.val();
    if (sPoint.clear) {
        clear();
        return;
    }
    var nPath = new Path();
    var child = fb.child(snapshot.key());
    //    nPath.add(new Point(sPoint.x, sPoint.y));
    nPath.strokeColor = "black";

    child.on("child_added", function (newSeg) {
        var newPoint = newSeg.val();

        if (newPoint.end) {
            child.off();
        } else {
            nPath.add(new Point(newPoint.x, newPoint.y));
        }
        view.draw();
    });
});

function onMouseDown(e) {
    //    path=new Path();
    //    path.strokeColor="black";
    //    path.add(e.point);
    pathRef = fb.push();
    pathRef.push({
        x: e.point.x,
        y: e.point.y
    });
}

function onMouseDrag(e) {
    //    path.add(e.point);
    if (pathRef) {
        pathRef.push({
            x: e.point.x,
            y: e.point.y
        });
    }

}

function onMouseUp(e) {
    //    path.smooth();
    //    path= new Path();
    if (pathRef) {
        pathRef.push({
            end: true
        });
    }

}