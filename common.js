// Device-friendly animation

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Pointer lock API

window.havePointerLock =
    'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

if (window.havePointerLock) {
    var windowElement = window.Element.prototype;
    windowElement.pointerLockElement = 
	windowElement.requestPointerLock ||
	windowElement.mozRequestPointerLock ||
	windowElement.webkitRequestPointerLock;
} else
    console.log("Pointer lock not supported by browser.");
