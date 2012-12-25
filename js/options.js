//опции игры
canvasWidth = 980;//высота канваса
canvasHeight = 630;//ширина канваса
gameSpeed = 16;//общая скорость игры

//кратинки для интерфейса
imageHole = new Image();
imageHole.src = 'img/holes-sprite-82x82.png';
imageSnake = new Image();
imageSnake.src = 'img/snake-sprite-animation.png';
imageSnowball = new Image();
imageSnowball.src = 'img/snow-ball-sprite-192x204.png';
imageBonus = new Image();
imageBonus.src = 'img/bonus-animation-sprite-129x32.png';
imageLifeTime = new Image();
imageLifeTime.src = 'img/hud-sprite-39x39.png';

//опции уровня
drawLevelSpeed = 20;//время шага уровня
drawLevelFontSize = 24;//размер шрифта текста

// поддерживаются ли трогательные события
var isTouch = ('ontouchstart' in window),
    actionEvent = isTouch ? "touchstart" : "mousedown";

$(document).ready(function(){
	drawCanvas = document.getElementById('drawCanvas');
	drawCanvas.width = canvasWidth;
	drawCanvas.height = canvasHeight;
	if(drawCanvas && drawCanvas.getContext) {
		ctx = drawCanvas.getContext('2d');
	}

	if (isTouch) {
		var canvasOffsetX,
		    canvasOffsetY;

		function findPos (obj) {
			canvasOffsetX = canvasOffsetY = 0;
			if (obj.offsetParent) {
				do {
					canvasOffsetX += obj.offsetLeft;
					canvasOffsetY += obj.offsetTop;	
				} while (obj = obj.offsetParent);
			}
		};
		findPos(drawCanvas);

		$(window).resize(function () {
			findPos(drawCanvas);
		});
	};

	cGame = new coreGame({
		speedDraw: gameSpeed,
		speedShow: gameSpeed
	});
	cGame.start();
	clearCanvas();
	game = new drawGame();

	document.body.ontouchmove = function(e) {
    if (e && e.preventDefault) { e.preventDefault(); }
    if (e && e.stopPropagation) { e.stopPropagation(); }
    return false;
	}

	drawCanvas.addEventListener(actionEvent, function (e) {
		var isMouse = e.type == "mousedown",
		X = (isMouse) ? (e.offsetX == undefined ? e.layerX : e.offsetX) : e.touches[0].clientX - canvasOffsetX,
		Y = (isMouse) ? (e.offsetY == undefined ? e.layerY : e.offsetY) : e.touches[0].clientY - canvasOffsetY;
		game.mouseClick(X, Y);
	});

});