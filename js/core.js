//объект ядра очередей работы игры
function coreGame(options)
{
	var obj = this;
	obj.drawBuffer = new Array();
	obj.showBuffer = new Array();
	obj.intervalDraw = false;
	obj.intervalShow = false;
	obj.prevTimeShow = 0;
	obj.prevTimeDraw = 0;

	if (options == undefined) {
		options = new Object();
	}
	if (options.speedDraw != undefined) {
		obj.speedDraw = options.speedDraw;
	} else {
		obj.speedDraw = 16;
	}
	if (options.speedShow != undefined) {
		obj.speedShow = options.speedShow;
	} else {
		obj.speedShow = 16;
	}

	//функция начинает работу задач
	obj.start = function() {
		var time = new Date().getTime();
		obj.prevTimeDraw = time + obj.speedDraw;
		obj.prevTimeShow = time + obj.speedShow;
		obj.intervalDraw = setTimeout(obj.draw, obj.speedDraw);
		obj.intervalShow = setTimeout(obj.show, obj.speedShow);
		obj.drawBuffer = new Array();
		obj.showBuffer = new Array();
	}
	//функция останавливает работу задач
	obj.stop = function() {
		if (obj.intervalDraw) {
			clearTimeout(obj.intervalDraw);
		}
		if (obj.intervalShow) {
			clearTimeout(obj.intervalShow);
		}
		obj.intervalDraw = false;
		obj.intervalShow = false;
	}

	//функция выполняет очередь показа задач
	obj.show = function() {
		var tmpBuffer = obj.showBuffer;
		obj.showBuffer = new Array();
		tmpBuffer.reverse();
		var functionName;
		while (functionName = tmpBuffer.pop()) {
			functionName();
		}
		do {
			obj.prevTimeShow += obj.speedShow;
		} while(new Date().getTime() > obj.prevTimeShow);
		obj.intervalShow = setTimeout(obj.show, obj.prevTimeShow - new Date().getTime());
	}
	//функция добавляет в очередь показа задачу
	obj.pushShow = function(functionName) {
		obj.showBuffer.push(functionName);
	}
	//функция очищает очередь показа задач
	obj.clearShow = function() {
		obj.showBuffer = new Array();
	}

	//функция выполняет очередь задач
	obj.draw = function() {
		do {
			var tmpBuffer = obj.drawBuffer;
			obj.drawBuffer = new Array();
			tmpBuffer.reverse();
			var tmp;
			while(tmp = tmpBuffer.pop()) {
				tmp[0]--;
				if (tmp[0] > 0) {
					obj.drawBuffer.push(tmp);
				} else {
					if(tmp.length == 5) {
						tmp[1](tmp[2], tmp[3], tmp[4]);
					} else if(tmp.length == 4) {
						tmp[1](tmp[2], tmp[3]);
					} else if(tmp.length == 3) {
						tmp[1](tmp[2]);
					} else {
						tmp[1]();
					}
				}
			}
			obj.prevTimeDraw += obj.speedDraw;
		} while(new Date().getTime() > obj.prevTimeDraw);
		obj.intervalDraw = setTimeout(obj.draw, obj.prevTimeDraw - new Date().getTime());
	}
	//функция добавляет очередь задач
	obj.pushDraw = function(functionName, time, param1, param2, param3) {
		var tmp = new Array();
		if(time!=undefined) {
			tmp.push(Math.ceil(time));
		} else {
			tmp.push(1);
		}
		tmp.push(functionName);
		if(param1!=undefined) {
			tmp.push(param1);
		}
		if(param2!=undefined) {
			tmp.push(param2);
		}
		if(param3!=undefined) {
			tmp.push(param3);
		}
		obj.drawBuffer.push(tmp);
	}
	//функция очищает очередь задач
	obj.clearDraw = function() {
		obj.drawBuffer = new Array();
	}
}

//функция отрисовки объекта с свойствами
function drawImage(obj)
{
	ctx.drawImage(obj.image,
		obj.scrollX, obj.scrollY,
		obj.width, obj.height,
		obj.X, obj.Y,
		obj.width, obj.height
	);
}
//функция действия объекта со временем
function drawStart(obj)
{
	if(!obj.bShow) {
		obj.bShow = true;
		if(obj.show != undefined) {
			obj.show();
		}
	}
	if(!obj.bDraw) {
		obj.bDraw = true;
		if(obj.draw != undefined) {
			obj.draw();
		}
	}
}
//функция очистки поля для старта отрисовки
function clearCanvas()
{
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	cGame.pushShow(clearCanvas);
}
//функция проверяет пересеклись ли объекты
function isContactObj(obj1, obj2)
{
	var contactX1 = (obj1.contactX != undefined ? obj1.contactX : 0);
	var contactY1 = (obj1.contactY != undefined ? obj1.contactY : 0);
	var contactWidth1 = (obj1.contactWidth != undefined ? obj1.contactWidth : obj1.width);
	var contactHeight1 = (obj1.contactHeight != undefined ? obj1.contactHeight : obj1.height);
	var fX1 = obj1.X + contactX1;
	var fX2 = obj1.X + contactX1 + contactWidth1;
	var fY1 = obj1.Y + contactY1;
	var fY2 = obj1.Y + contactY1 + contactHeight1;

	var contactX2 = (obj2.contactX != undefined ? obj1.contactX : 0);
	var contactY2 = (obj2.contactY != undefined ? obj1.contactY : 0);
	var contactWidth2 = (obj2.contactWidth != undefined ? obj2.contactWidth : obj2.width);
	var contactHeight2 = (obj2.contactHeight != undefined ? obj2.contactHeight : obj2.height);
	var uX1 = obj2.X+contactX2;
	var uX2 = obj2.X+contactX2+contactWidth2;
	var uY1 = obj2.Y+contactY2;
	var uY2 = obj2.Y+contactY2+contactHeight2;

	if((fX1 >= uX1 && fX1 <= uX2 && fY1 >= uY1 && fY1 <= uY2)
		|| (fX2 >= uX1 && fX2 <= uX2 && fY1 >= uY1 && fY1 <= uY2)
		|| (fX1 >= uX1 && fX1 <= uX2 && fY2 >= uY1 && fY2 <= uY2)
		|| (fX2 >= uX1 && fX1 <= uX2 && fY2 >= uY1 && fY2 <= uY2)
	) {
		return true;
	}
	return false;
}


