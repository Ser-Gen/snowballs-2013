//объект игры
function drawGame()
{
	var obj = this;
	obj.bShow = false;
	obj.bDraw = false;
	obj.drawSpeed = 1;
	obj.holes = new Array();
	obj.snakes = new Array();
	obj.time = false;
	obj.life = false;

	//количество показанных змей
	obj.countSnakes = 0;
	//время между показами змей
	obj.drawStepShowSnake = 150;
	//время на демонстрацию змей
	obj.drawSpeedShowSnake = 130;

	//сброс игры
	obj.resetGame = function(){
		for (var i = obj.holes.length - 1; i >= 0; i--) {
			obj.holes[i].bShow = false;
			delete obj.holes[i];
		}
		for (var i = obj.snakes.length - 1; i >= 0; i--) {
			obj.snakes[i].bDraw = false;
			delete obj.snakes[i];
		}

		obj.drawStepShowSnake = 150;
		obj.drawSpeedShowSnake = 130;

		obj.life = new drawLife();
		obj.time = new drawTime();
		obj.holes = new Array();
		obj.snakes = new Array();
		obj.countSnakes = 0;
	}
	obj.drawGameStart = function(){
		var time = new Date()
		var hours = time.getHours()
		if(!obj.bDraw) {
			$('.pageMain').removeClass('page-start page-end');

			obj.resetGame();

			obj.life.start();
			obj.time.start();

			drawStart(obj);

			obj.drawCreateHole();
			obj.drawCreateSnake();

		}
	}
	//работа игры, своевременное показ змей и т.д.
	obj.draw = function() {
		if(obj.bDraw && obj.time.bDraw) {
			for (var i = 0; i < obj.snakes.length; i++) {
				if (!obj.snakes[i].lockHole) {
					obj.drawShowSnake(i);
					break;
				}
			}
			cGame.pushDraw(obj.draw, obj.drawSpeed);
		} else {
			obj.drawGameStop();
		}
	}
	//обработка клика мыши
	obj.mouseClick = function(clickX, clickY){
		if (obj.bDraw) {
			var objClick = {
				X : clickX,
				Y : clickY,
				contactX : 0,
				contactY : 0,
				contactWidth : 1,
				contactHeight : 1
			};
			for (var i = 0; i < obj.snakes.length; i++) {
				if (obj.snakes[i].lockHole && obj.snakes[i].bDraw
					&& isContactObj(objClick, obj.snakes[i])) {
						obj.drawDamage(obj.snakes[i]);
				}
			}
		}
	}
	//попадание по змее
	obj.drawDamage = function(snake){
		if (snake.damage()) {
			obj.life.damage();
			if (snake.damageBonus) {
				obj.time.drawTime += 5000;
			}
			if (obj.drawSpeedShowSnake > 0) {
				obj.drawSpeedShowSnake--;
			}
		}
	}
	//создание новой лунки
	obj.drawCreateHole = function(){
		if (obj.bDraw) {
			do {
				var hole = new drawHole();
				var contact = false;
				for (var i = 0; i < obj.holes.length; i++) {
					contact = contact || isContactObj(hole, obj.holes[i]);
				}
				if (!contact) {
					hole.start();
					obj.holes.push(hole);
				}
			} while (obj.holes.length < 10);
		}
	}
	//создание змеи
	obj.drawCreateSnake = function(){
		var indexHole = obj.randomHole();
		if (obj.bDraw && indexHole >= 0) {
			do {
				indexHole = obj.randomHole();
				var snake = new drawSnake(obj.holes[indexHole], obj.drawSpeedShowSnake);
				if (snake.lockHole) {
					obj.snakes.push(snake);
					cGame.pushDraw(obj.snakes[obj.countSnakes].start, 20);
					obj.countSnakes++;
				}
			} while (obj.snakes.length < 4 && indexHole >= 0);
		}
	}
	//показ змеи
	obj.drawShowSnake = function(showSnake){
		if (obj.bDraw && !obj.snakes[showSnake].lockHole) {
			var indexHole = obj.randomHole();
			if (indexHole >= 0) {
				var snake = new drawSnake(obj.holes[indexHole], obj.drawSpeedShowSnake);
				if (snake.lockHole) {
					obj.countSnakes++;
					if (obj.drawStepShowSnake > 0) {
						obj.drawStepShowSnake--;
					}
					obj.snakes[showSnake].bDraw = false;
					obj.snakes[showSnake] = snake;
					cGame.pushDraw(obj.snakes[showSnake].start, 20 + Math.ceil(obj.drawStepShowSnake * Math.random()));
				}
			}
		}
	}
	//выбор случайной постой лунки
	obj.randomHole = function(){
		var indexHole = -1;
		var holesIndex = new Array();
		for (var i = 0; i < obj.holes.length; i++) {
			if (!obj.holes[i].bLockSnake) {
				holesIndex.push(i);
			}
		}
		if (holesIndex.length > 0) {
			if (Math.random() > 0.5) {
				holesIndex.reverse();
			}
			if (holesIndex.length > 0) {
				holesIndex.sort(function(){
					return Math.random() > 0.5;
				});
				indexHole = holesIndex.pop();
			}
		}
		return indexHole;
	}

	//остановка игры
	obj.drawGameStop = function(){
		obj.bDraw = false;
		for (var i = 0; i < obj.snakes.length; i++) {
			obj.snakes[i].bDraw = false;
		}
		obj.life.bShow = false;
		obj.time.bDraw = false;
		var r = parseInt(obj.life.drawLife);
		var f = obj.countSnakes;
		var l = r * f;
		f = f * l;
		l = Math.round(f / l.toString().length);
		if (r % 10 == 0 || r % 10 >= 5
			|| (r % 100 >= 11 && r % 100 <= 14)) {
			$('.screen-end h2').html('попаданий');
		} else if (r % 10 == 1) {
			$('.screen-end h2').html('попадание');
		} else {
			$('.screen-end h2').html('попадания');
		}
		$('.screen-end .result').html(r);
		$('.pageMain').removeClass('page-start').addClass('page-end');
	}
}

//объект лунки
function drawHole()
{
	var obj = this;
	obj.image = imageHole;
	obj.scrollX = 82 * Math.round(2 * Math.random());
	obj.scrollY = 0;
	obj.width = 82;
	obj.height = 82;
	obj.X = Math.round((831 - obj.width) * Math.random()) + 66;
	obj.Y = Math.round((517 - obj.height) * Math.random()) + 98;
	obj.contactX = -5;
	obj.contactY = -5;
	obj.contactWidth = 92;
	obj.contactHeight = 92;
	obj.bShow = false;
	obj.bLockSnake = false;
	obj.start = function() {
		drawStart(obj);
	}
	obj.show = function() {
		if(obj.bShow || obj.bLockSnake) {
			drawImage(obj);
			cGame.pushShow(obj.show);
		}
	}
}

//объект змеи
function drawSnake(objHole, viewStep)
{
	var obj = this;
	obj.image = imageSnake;
	obj.damageBonus = false;
	obj.viewStep = 40;

	obj.X = 0;
	obj.Y = 0;
	obj.scrollX = 0;
	obj.scrollY = 0;
	obj.width = 106;
	obj.height = 107;
	if (Math.random() > 0.91) {
		obj.scrollY = 2 * obj.height;
		obj.damageBonus = true;
		viewStep = Math.ceil(viewStep / 10);
		obj.viewStep = 30;
	}
	obj.bShow = false;
	obj.bDraw = false;
	obj.lockHole = false;
	obj.imageCur = 0;
	obj.showImageCount = 8;
	obj.showSpeed = 2;
	obj.viewSpeed = 1;
	obj.snowball = false;

	if (objHole != undefined) {
		obj.X = objHole.X - 13;
		obj.Y = objHole.Y - 13;
		objHole.bLockSnake = true;
		obj.lockHole = true;
	}

	if (viewStep == undefined) {
		viewStep = 100;
	} else if (parseInt(viewStep) > 0) {
		viewStep = parseInt(viewStep);
	} else {
		viewStep = 0;
	}
	obj.viewStep += viewStep;

	obj.start = function() {
		if (obj.lockHole) {
			drawStart(obj);
		}
	}
	obj.show = function() {
		if(obj.bShow) {
			drawImage(obj);
			cGame.pushShow(obj.show);
		}
	}
	obj.draw = function() {
		if(obj.bDraw) {
			obj.scrollX = obj.width * obj.imageCur;
			obj.imageCur++;
			if(obj.imageCur < obj.showImageCount) {
				cGame.pushDraw(obj.draw, obj.showSpeed);
			} else {
				obj.drawView();
			}
		} else {
			obj.drawHide();
		}
	}
	obj.drawView = function() {
		if (obj.bDraw) {
			obj.viewStep--;
			if (obj.viewStep > 0) {
				cGame.pushDraw(obj.drawView, obj.viewSpeed);
			} else {
				obj.imageCur -= 2;
				cGame.pushDraw(obj.drawHide, obj.viewSpeed);
			}
		} else {
			obj.imageCur -= 2;
			obj.drawHide();
		}
	}
	obj.drawHide = function() {
		obj.bDraw = false;
		if (obj.snowball != false && obj.snowball.bDraw) {
			cGame.pushDraw(obj.drawHide, obj.showSpeed);
		} else if (obj.snowball != false) {
			obj.scrollY += obj.height;
			obj.snowball = false;

			if (obj.damageBonus) {
				obj.bonus = new drawBonus(obj.X + Math.round(obj.width / 2), obj.Y - 20);
				obj.bonus.start();
			}

			cGame.pushDraw(obj.drawHide, obj.showSpeed);
		} else if(obj.imageCur > 0) {
			obj.imageCur--;
			obj.scrollX = obj.width * obj.imageCur;
			cGame.pushDraw(obj.drawHide, obj.showSpeed);
		} else {
			objHole.bLockSnake = false;
			obj.lockHole = false;
			obj.bShow = false;
		}
	}
	obj.damage = function() {
		if (obj.bDraw) {
			obj.snowball = new drawSnowball(obj.X + Math.round(obj.width / 2), obj.Y);
			obj.snowball.start();
			obj.bDraw = false;
			return true;
		}
		return false;
	}
}

//объект часов
function drawSnowball(X, Y)
{
	var obj = this;
	obj.image = imageSnowball;
	obj.scrollX = 0;
	obj.scrollY = 0;
	obj.width = 192;
	obj.height = 204;
	obj.X = X - Math.round(obj.width / 2);
	obj.Y = Y;
	obj.bShow = false;
	obj.bDraw = false;
	obj.drawSpeed = 2;
	obj.imageCur = 0;
	obj.showImageCount = 9;

	obj.start = function() {
		drawStart(obj);
	}
	obj.show = function() {
		if(obj.bShow) {
			drawImage(obj);
			cGame.pushShow(obj.show);
		}
	}
	obj.draw = function() {
		if(obj.bDraw) {
			obj.imageCur++;
			if(obj.imageCur < obj.showImageCount) {
				obj.scrollX = obj.width * obj.imageCur;
				cGame.pushDraw(obj.draw, obj.drawSpeed);
			} else {
				obj.bDraw = false;
				obj.bShow = false;
			}
		} else {
			obj.bShow = false;
		}
	}
}

//объект часов
function drawBonus(X, Y)
{
	var obj = this;
	obj.image = imageBonus;
	obj.scrollX = 0;
	obj.scrollY = 0;
	obj.width = 129;
	obj.height = 32;
	obj.X = X - Math.round(obj.width / 2);
	obj.Y = Y;
	obj.bShow = false;
	obj.bDraw = false;
	obj.drawSpeed = 3;
	obj.imageCur = 0;
	obj.showImageCount = 10;

	obj.start = function() {
		drawStart(obj);
	}
	obj.show = function() {
		if(obj.bShow) {
			drawImage(obj);
			cGame.pushShow(obj.show);
		}
	}
	obj.draw = function() {
		if(obj.bDraw) {
			obj.imageCur++;
			if(obj.imageCur < obj.showImageCount) {
				obj.scrollX = obj.width * obj.imageCur;
				cGame.pushDraw(obj.draw, obj.drawSpeed);
			} else {
				obj.bDraw = false;
				obj.bShow = false;
			}
		} else {
			obj.bShow = false;
		}
	}
}

//объект жизней
function drawLife()
{
	var obj = this;
	obj.image = imageLifeTime;
	obj.X = 748;
	obj.Y = 22;
	obj.scrollX = 0;
	obj.scrollY = 0;
	obj.width = 39;
	obj.height = 39;
	obj.bShow = false;
	obj.drawLife = 0;
	obj.fillStyle = '#000000';
	obj.font = 'bold '+drawLevelFontSize+'px sans-serif';
	obj.symb = String.fromCharCode(215);

	obj.start = function() {
		drawStart(obj);
	}
	obj.show = function() {
		if(obj.bShow) {
			drawImage(obj);
			ctx.font = obj.font;
			ctx.fillStyle = obj.fillStyle;
			ctx.fillText(obj.symb + obj.drawLife, obj.X + obj.width, obj.Y + 29);
			cGame.pushShow(obj.show);
		}
	}
	obj.damage = function() {
		if(obj.bShow) {
			obj.drawLife++;
		}
	}
}
//объект часов
function drawTime()
{
	var obj = this;
	obj.image = imageLifeTime;
	obj.X = 859;
	obj.Y = 22;
	obj.scrollX = 39;
	obj.scrollY = 0;
	obj.width = 39;
	obj.height = 39;
	obj.bShow = false;
	obj.bDraw = false;
	obj.drawSpeed = 10;
	obj.drawTime = 60000;
	obj.fillStyle = '#000000';
	obj.font = 'bold '+drawLevelFontSize+'px sans-serif';

	obj.start = function() {
		obj.drawTime = obj.drawTime + new Date().getTime();
		drawStart(obj);
	}
	obj.show = function() {
		if(obj.bShow) {
			drawImage(obj);
			var time = Math.ceil((obj.drawTime - new Date().getTime() ) / 1000);
			ctx.font = obj.font;
			ctx.fillStyle = obj.fillStyle;
			ctx.fillText(Math.floor(time / 60) + ':' + (time % 60 < 10 ? '0' : '') + (time % 60), obj.X + obj.width, obj.Y + 29);
			cGame.pushShow(obj.show);
		}
	}
	obj.draw = function() {
		if(obj.bDraw) {
			if (obj.drawTime - new Date().getTime() > 0) {
				cGame.pushDraw(obj.draw, obj.drawSpeed);
			} else {
				obj.bDraw = false;
				obj.bShow = false;
			}
		} else {
			obj.bShow = false;
		}
	}
}

