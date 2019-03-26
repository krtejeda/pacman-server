class Pacman {
	constructor(id) {
		this.PACMAN_DIRECTION = 3;
		this.PACMAN_DIRECTION_TRY = -1;
		this.PACMAN_DIRECTION_TRY_TIMER = null;
		this.PACMAN_DIRECTION_TRY_CANCEL = 1000;
		this.PACMAN_POSITION_X = 276;
		this.PACMAN_POSITION_Y = 416;
		this.PACMAN_POSITION_STEP = 2;
		this.PACMAN_MOUNTH_STATE = 3;
		this.PACMAN_MOUNTH_STATE_MAX = 6;
		this.PACMAN_SIZE = 16;
		this.PACMAN_MOVING = false;
		this.PACMAN_MOVING_TIMER = -1;
		this.PACMAN_MOVING_SPEED = 15;
		this.PACMAN_CANVAS_CONTEXT = null;
		this.PACMAN_EAT_GAP = 15;
		this.PACMAN_GHOST_GAP = 20;
		this.PACMAN_FRUITS_GAP = 15;
		this.PACMAN_KILLING_TIMER = -1;
		this.PACMAN_KILLING_SPEED = 70;
		this.PACMAN_RETRY_SPEED = 2100;
		this.PACMAN_DEAD = false;

		//var canvas = document.getElementById('canvas-pacman');
		var canvas = document.createElement('canvas');
		canvas.setAttribute('id', 'canvas-pacman' + id);
		canvas.setAttribute('width', '550');
		canvas.setAttribute('height', '550');
		canvas.setAttribute('style', 'position: absolute');
		document.querySelector('#board').appendChild(canvas);
		if (canvas.getContext) {
			this.PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
		}
	}
	resetPacman() {
		this.stopPacman();
		this.PACMAN_DIRECTION = 3;
		this.PACMAN_DIRECTION_TRY = -1;
		this.PACMAN_DIRECTION_TRY_TIMER = null;
		this.PACMAN_POSITION_X = 276;
		this.PACMAN_POSITION_Y = 416;
		this.PACMAN_MOUNTH_STATE = 3;
		this.PACMAN_MOVING = false;
		this.PACMAN_MOVING_TIMER = -1;
		this.PACMAN_KILLING_TIMER = -1;
		this.PACMAN_DEAD = false;
		this.PACMAN_SUPER = false;
	};
	getPacmanCanevasContext() {
		return this.PACMAN_CANVAS_CONTEXT;
	};
	stopPacman() {
		if (this.PACMAN_MOVING_TIMER != -1) {
			clearInterval(this.PACMAN_MOVING_TIMER);
			this.PACMAN_MOVING_TIMER = -1;
			this.PACMAN_MOVING = false;
		}
		if (this.PACMAN_KILLING_TIMER != -1) {
			clearInterval(this.PACMAN_KILLING_TIMER);
			this.PACMAN_KILLING_TIMER = -1;
		}
	};
	pausePacman() {
		if (this.PACMAN_DIRECTION_TRY_TIMER != null) {
			this.PACMAN_DIRECTION_TRY_TIMER.pause();
		}
		if (this.PACMAN_MOVING_TIMER != -1) {
			clearInterval(this.PACMAN_MOVING_TIMER);
			this.PACMAN_MOVING_TIMER = -1;
			this.PACMAN_MOVING = false;
		}
	};
	resumePacman() {
		if (this.PACMAN_DIRECTION_TRY_TIMER != null) {
			this.PACMAN_DIRECTION_TRY_TIMER.resume();
		}
		this.movePacman();
	};
	tryMovePacmanCancel() {
		if (this.PACMAN_DIRECTION_TRY_TIMER != null) {
			this.PACMAN_DIRECTION_TRY_TIMER.cancel();
			this.PACMAN_DIRECTION_TRY = -1;
			this.PACMAN_DIRECTION_TRY_TIMER = null;
		}
	};
	tryMovePacman(direction) {
		this.PACMAN_DIRECTION_TRY = direction;
		this.PACMAN_DIRECTION_TRY_TIMER = new Timer(() => {
			this.tryMovePacmanCancel();
		}, this.PACMAN_DIRECTION_TRY_CANCEL);
	};
	movePacman(direction) {
		if (this.PACMAN_MOVING === false) {
			this.PACMAN_MOVING = true;
			this.drawPacman();
			this.PACMAN_MOVING_TIMER = setInterval(() => {
				this.movePacman();
			}
				, this.PACMAN_MOVING_SPEED);
		}
		var directionTry = direction;
		var quarterChangeDirection = false;
		if (!directionTry && this.PACMAN_DIRECTION_TRY != -1) {
			directionTry = this.PACMAN_DIRECTION_TRY;
		}
		if ((!directionTry || this.PACMAN_DIRECTION !== directionTry)) {
			if (directionTry) {
				if (this.canMovePacman(directionTry)) {
					if (this.PACMAN_DIRECTION + 1 === directionTry || this.PACMAN_DIRECTION - 1 === directionTry || this.PACMAN_DIRECTION + 1 === directionTry || (this.PACMAN_DIRECTION === 4 && directionTry === 1) || (this.PACMAN_DIRECTION === 1 && directionTry === 4)) {
						quarterChangeDirection = true;
					}
					this.PACMAN_DIRECTION = directionTry;
					this.tryMovePacmanCancel();
				}
				else {
					if (directionTry !== this.PACMAN_DIRECTION_TRY) {
						this.tryMovePacmanCancel();
					}
					if (this.PACMAN_DIRECTION_TRY === -1) {
						this.tryMovePacman(directionTry);
					}
				}
			}
			if (this.canMovePacman(this.PACMAN_DIRECTION)) {
				this.erasePacman();
				if (this.PACMAN_MOUNTH_STATE < this.PACMAN_MOUNTH_STATE_MAX) {
					this.PACMAN_MOUNTH_STATE++;
				}
				else {
					this.PACMAN_MOUNTH_STATE = 0;
				}
				var speedUp = 0;
				if (quarterChangeDirection) {
					speedUp = 6;
				}
				if (this.PACMAN_DIRECTION === 1) {
					this.PACMAN_POSITION_X += this.PACMAN_POSITION_STEP + speedUp;
				}
				else if (this.PACMAN_DIRECTION === 2) {
					this.PACMAN_POSITION_Y += this.PACMAN_POSITION_STEP + speedUp;
				}
				else if (this.PACMAN_DIRECTION === 3) {
					this.PACMAN_POSITION_X -= this.PACMAN_POSITION_STEP + speedUp;
				}
				else if (this.PACMAN_DIRECTION === 4) {
					this.PACMAN_POSITION_Y -= (this.PACMAN_POSITION_STEP + speedUp);
				}
				if (this.PACMAN_POSITION_X === 2 && this.PACMAN_POSITION_Y === 258) {
					this.PACMAN_POSITION_X = 548;
					this.PACMAN_POSITION_Y = 258;
				}
				else if (this.PACMAN_POSITION_X === 548 && this.PACMAN_POSITION_Y === 258) {
					this.PACMAN_POSITION_X = 2;
					this.PACMAN_POSITION_Y = 258;
				}
				this.drawPacman();
				if ((this.PACMAN_MOUNTH_STATE) === 0 || (this.PACMAN_MOUNTH_STATE) === 3) {
					this.testBubblesPacman();
					this.testGhostsPacman();
					this.testFruitsPacman();
				}
			}
			else {
				this.stopPacman();
			}
		}
		else if (direction && this.PACMAN_DIRECTION === direction) {
			this.tryMovePacmanCancel();
		}
	};
	canMovePacman(direction) {
		var positionX = this.PACMAN_POSITION_X;
		var positionY = this.PACMAN_POSITION_Y;
		if (positionX === 276 && positionY === 204 && direction === 2)
			return false;
		if (direction === 1) {
			positionX += this.PACMAN_POSITION_STEP;
		}
		else if (direction === 2) {
			positionY += this.PACMAN_POSITION_STEP;
		}
		else if (direction === 3) {
			positionX -= this.PACMAN_POSITION_STEP;
		}
		else if (direction === 4) {
			positionY -= this.PACMAN_POSITION_STEP;
		}
		for (var i = 0, imax = PATHS.length; i < imax; i++) {
			var p = PATHS[i];
			var c = p.split("-");
			var cx = c[0].split(",");
			var cy = c[1].split(",");
			var startX = cx[0];
			var startY = cx[1];
			var endX = cy[0];
			var endY = cy[1];
			if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) {
				return true;
			}
		}
		return false;
	};
	drawPacman() {
		var ctx = this.getPacmanCanevasContext();
		ctx.fillStyle = "#fff200";
		ctx.beginPath();
		var startAngle = 0;
		var endAngle = 2 * Math.PI;
		var lineToX = this.PACMAN_POSITION_X;
		var lineToY = this.PACMAN_POSITION_Y;
		if (this.PACMAN_DIRECTION === 1) {
			startAngle = (0.35 - (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			endAngle = (1.65 + (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			lineToX -= 8;
		}
		else if (this.PACMAN_DIRECTION === 2) {
			startAngle = (0.85 - (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			endAngle = (0.15 + (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			lineToY -= 8;
		}
		else if (this.PACMAN_DIRECTION === 3) {
			startAngle = (1.35 - (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			endAngle = (0.65 + (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			lineToX += 8;
		}
		else if (this.PACMAN_DIRECTION === 4) {
			startAngle = (1.85 - (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			endAngle = (1.15 + (this.PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
			lineToY += 8;
		}
		ctx.arc(this.PACMAN_POSITION_X, this.PACMAN_POSITION_Y, this.PACMAN_SIZE, startAngle, endAngle, false);
		ctx.lineTo(lineToX, lineToY);
		ctx.fill();
		ctx.closePath();
	};
	erasePacman() {
		var ctx = this.getPacmanCanevasContext();
		ctx.clearRect((this.PACMAN_POSITION_X - 2) - this.PACMAN_SIZE, (this.PACMAN_POSITION_Y - 2) - this.PACMAN_SIZE, (this.PACMAN_SIZE * 2) + 5, (this.PACMAN_SIZE * 2) + 5);
	};
	killPacman() {
		playDieSound();
		LOCK = true;
		this.PACMAN_DEAD = true;
		this.stopPacman();
		stopGhosts();
		pauseTimes();
		stopBlinkSuperBubbles();
		this.PACMAN_KILLING_TIMER = setInterval(() => {
			this.killingPacman();
		}, this.PACMAN_KILLING_SPEED);
	};
	killingPacman() {
		if (this.PACMAN_MOUNTH_STATE > -12) {
			this.erasePacman();
			this.PACMAN_MOUNTH_STATE--;
			this.drawPacman();
		}
		else {
			clearInterval(this.PACMAN_KILLING_TIMER);
			this.PACMAN_KILLING_TIMER = -1;
			this.erasePacman();
			if (LIFES > 0) {
				lifes(-1);
				setTimeout('retry()', (this.PACMAN_RETRY_SPEED));
			}
			else {
				gameover();
			}
		}
	};
	testGhostsPacman() {
		this.testGhostPacman('blinky');
		this.testGhostPacman('pinky');
		this.testGhostPacman('inky');
		this.testGhostPacman('clyde');
	};
	testGhostPacman(ghost) {
		var positionX = eval('GHOST_' + ghost.toUpperCase() + '_POSITION_X');
		var positionY = eval('GHOST_' + ghost.toUpperCase() + '_POSITION_Y');
		if (positionX <= this.PACMAN_POSITION_X + this.PACMAN_GHOST_GAP && positionX >= this.PACMAN_POSITION_X - this.PACMAN_GHOST_GAP && positionY <= this.PACMAN_POSITION_Y + this.PACMAN_GHOST_GAP && positionY >= this.PACMAN_POSITION_Y - this.PACMAN_GHOST_GAP) {
			var state = eval('GHOST_' + ghost.toUpperCase() + '_STATE');
			if (state === 0) {
				this.killPacman();
			}
			else if (state === 1) {
				startEatGhost(ghost);
			}
		}
	};
	testFruitsPacman() {
		if (FRUIT_CANCEL_TIMER != null) {
			if (FRUITS_POSITION_X <= this.PACMAN_POSITION_X + this.PACMAN_FRUITS_GAP && FRUITS_POSITION_X >= this.PACMAN_POSITION_X - this.PACMAN_FRUITS_GAP && FRUITS_POSITION_Y <= this.PACMAN_POSITION_Y + this.PACMAN_FRUITS_GAP && FRUITS_POSITION_Y >= this.PACMAN_POSITION_Y - this.PACMAN_FRUITS_GAP) {
				eatFruit();
			}
		}
	};
	testBubblesPacman() {
		var r = { x: this.PACMAN_POSITION_X - (this.PACMAN_SIZE / 2), y: this.PACMAN_POSITION_Y - (this.PACMAN_SIZE / 2), width: (this.PACMAN_SIZE * 2), height: (this.PACMAN_SIZE * 2) };
		for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i++) {
			var bubble = BUBBLES_ARRAY[i];
			var bubbleParams = bubble.split(";");
			var testX = parseInt(bubbleParams[0].split(",")[0]);
			var testY = parseInt(bubbleParams[0].split(",")[1]);
			var p = { x: testX, y: testY };
			if (isPointInRect(p, r)) {
				if (bubbleParams[4] === "0") {
					var type = bubbleParams[3];
					eraseBubble(type, testX, testY);
					BUBBLES_ARRAY[i] = bubble.substr(0, bubble.length - 1) + "1";
					if (type === "s") {
						setSuperBubbleOnXY(testX, testY, "1");
						score(SCORE_SUPER_BUBBLE);
						playEatPillSound();
						affraidGhosts();
					}
					else {
						score(SCORE_BUBBLE);
						playEatingSound();
					}
					BUBBLES_COUNTER--;
					if (BUBBLES_COUNTER === 0) {
						win();
					}
				}
				else {
					stopEatingSound();
				}
				return;
			}
		}
	};
}

// var PACMAN_DIRECTION = 3;
// var PACMAN_DIRECTION_TRY = -1;
// var PACMAN_DIRECTION_TRY_TIMER = null;
// var PACMAN_DIRECTION_TRY_CANCEL = 1000;
// var PACMAN_POSITION_X = 276;
// var PACMAN_POSITION_Y = 416;
// var PACMAN_POSITION_STEP = 2;
// var PACMAN_MOUNTH_STATE = 3;
// var PACMAN_MOUNTH_STATE_MAX = 6;
// var PACMAN_SIZE = 16;
// var PACMAN_MOVING = false;
// var PACMAN_MOVING_TIMER = -1;
// var PACMAN_MOVING_SPEED = 15;
// var PACMAN_CANVAS_CONTEXT = null;
// var PACMAN_EAT_GAP = 15;
// var PACMAN_GHOST_GAP = 20;
// var PACMAN_FRUITS_GAP = 15;
// var PACMAN_KILLING_TIMER = -1;
// var PACMAN_KILLING_SPEED = 70;
// var PACMAN_RETRY_SPEED = 2100;
// var PACMAN_DEAD = false;

// function initPacman(id) {
// 	//var canvas = document.getElementById('canvas-pacman');
// 	var canvas = document.createElement('canvas');
// 	canvas.setAttribute('id', 'canvas-pacman' + id);
// 	canvas.setAttribute('width', '550');
// 	canvas.setAttribute('height', '550');
// 	document.querySelector('#board').appendChild(canvas);

// 	if (canvas.getContext) {
// 		PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
// 	}
// }
// function resetPacman() {
// 	stopPacman();

// 	PACMAN_DIRECTION = 3;
// 	PACMAN_DIRECTION_TRY = -1;
// 	PACMAN_DIRECTION_TRY_TIMER = null;
// 	PACMAN_POSITION_X = 276;
// 	PACMAN_POSITION_Y = 416;
// 	PACMAN_MOUNTH_STATE = 3;
// 	PACMAN_MOVING = false;
// 	PACMAN_MOVING_TIMER = -1;
// 	PACMAN_KILLING_TIMER = -1;
// 	PACMAN_DEAD = false;
// 	PACMAN_SUPER = false;
// }
// function getPacmanCanevasContext() {
// 	return PACMAN_CANVAS_CONTEXT;
// }

// function stopPacman() {
// 	if (PACMAN_MOVING_TIMER != -1) {
// 		clearInterval(PACMAN_MOVING_TIMER);
// 		PACMAN_MOVING_TIMER = -1;
// 		PACMAN_MOVING = false;
// 	}
// 	if (PACMAN_KILLING_TIMER != -1) {
// 		clearInterval(PACMAN_KILLING_TIMER);
// 		PACMAN_KILLING_TIMER = -1;
// 	}
// }

// function pausePacman() {
// 	if (PACMAN_DIRECTION_TRY_TIMER != null) {
// 		PACMAN_DIRECTION_TRY_TIMER.pause();
// 	}

// 	if (PACMAN_MOVING_TIMER != -1) {
// 		clearInterval(PACMAN_MOVING_TIMER);
// 		PACMAN_MOVING_TIMER = -1;
// 		PACMAN_MOVING = false;
// 	}
// }
// function resumePacman() {
// 	if (PACMAN_DIRECTION_TRY_TIMER != null) {
// 		PACMAN_DIRECTION_TRY_TIMER.resume();
// 	}
// 	movePacman();
// }

// function tryMovePacmanCancel() {
// 	if (PACMAN_DIRECTION_TRY_TIMER != null) {
// 		PACMAN_DIRECTION_TRY_TIMER.cancel();
// 		PACMAN_DIRECTION_TRY = -1;
// 		PACMAN_DIRECTION_TRY_TIMER = null;
// 	}
// }
// function tryMovePacman(direction) {
// 	PACMAN_DIRECTION_TRY = direction;
// 	PACMAN_DIRECTION_TRY_TIMER = new Timer('tryMovePacmanCancel()', PACMAN_DIRECTION_TRY_CANCEL);
// }

// function movePacman(direction) {

// 	if (PACMAN_MOVING === false) {
// 		PACMAN_MOVING = true;
// 		drawPacman();
// 		PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
// 	}

// 	var directionTry = direction;
// 	var quarterChangeDirection = false;

// 	if (!directionTry && PACMAN_DIRECTION_TRY != -1) {
// 		directionTry = PACMAN_DIRECTION_TRY;
// 	}

// 	if ((!directionTry || PACMAN_DIRECTION !== directionTry)) {

// 		if (directionTry) {
// 			if (canMovePacman(directionTry)) {
// 				if (PACMAN_DIRECTION + 1 === directionTry || PACMAN_DIRECTION - 1 === directionTry || PACMAN_DIRECTION + 1 === directionTry || (PACMAN_DIRECTION === 4 && directionTry === 1) || (PACMAN_DIRECTION === 1 && directionTry === 4)) {
// 					quarterChangeDirection = true;
// 				}
// 				PACMAN_DIRECTION = directionTry;
// 				tryMovePacmanCancel();
// 			} else {
// 				if (directionTry !== PACMAN_DIRECTION_TRY) {
// 					tryMovePacmanCancel();
// 				}
// 				if (PACMAN_DIRECTION_TRY === -1) {
// 					tryMovePacman(directionTry);
// 				}
// 			}
// 		}

// 		if (canMovePacman(PACMAN_DIRECTION)) {
// 			erasePacman();

// 			if (PACMAN_MOUNTH_STATE < PACMAN_MOUNTH_STATE_MAX) {
// 				PACMAN_MOUNTH_STATE++;
// 			} else {
// 				PACMAN_MOUNTH_STATE = 0;
// 			}

// 			var speedUp = 0;
// 			if (quarterChangeDirection) {
// 				speedUp = 6;
// 			}

// 			if (PACMAN_DIRECTION === 1) {
// 				PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
// 			} else if (PACMAN_DIRECTION === 2) {
// 				PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
// 			} else if (PACMAN_DIRECTION === 3) {
// 				PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
// 			} else if (PACMAN_DIRECTION === 4) {
// 				PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
// 			}

// 			if (PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258) {
// 				PACMAN_POSITION_X = 548;
// 				PACMAN_POSITION_Y = 258;
// 			} else if (PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258) {
// 				PACMAN_POSITION_X = 2;
// 				PACMAN_POSITION_Y = 258;
// 			}

// 			drawPacman();

// 			if ((PACMAN_MOUNTH_STATE) === 0 || (PACMAN_MOUNTH_STATE) === 3) {
// 				testBubblesPacman();
// 				testGhostsPacman();
// 				testFruitsPacman();
// 			}
// 		} else {
// 			stopPacman();
// 		}
// 	} else if (direction && PACMAN_DIRECTION === direction) {
// 		tryMovePacmanCancel();
// 	}
// }

// function canMovePacman(direction) {

// 	var positionX = PACMAN_POSITION_X;
// 	var positionY = PACMAN_POSITION_Y;

// 	if (positionX === 276 && positionY === 204 && direction === 2) return false;

// 	if (direction === 1) {
// 		positionX += PACMAN_POSITION_STEP;
// 	} else if (direction === 2) {
// 		positionY += PACMAN_POSITION_STEP;
// 	} else if (direction === 3) {
// 		positionX -= PACMAN_POSITION_STEP;
// 	} else if (direction === 4) {
// 		positionY -= PACMAN_POSITION_STEP;
// 	}

// 	for (var i = 0, imax = PATHS.length; i < imax; i++) {

// 		var p = PATHS[i];
// 		var c = p.split("-");
// 		var cx = c[0].split(",");
// 		var cy = c[1].split(",");

// 		var startX = cx[0];
// 		var startY = cx[1];
// 		var endX = cy[0];
// 		var endY = cy[1];

// 		if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) {
// 			return true;
// 		}
// 	}

// 	return false;
// }

// function drawPacman() {

// 	var ctx = getPacmanCanevasContext();

// 	ctx.fillStyle = "#fff200";
// 	ctx.beginPath();

// 	var startAngle = 0;
// 	var endAngle = 2 * Math.PI;
// 	var lineToX = PACMAN_POSITION_X;
// 	var lineToY = PACMAN_POSITION_Y;
// 	if (PACMAN_DIRECTION === 1) {
// 		startAngle = (0.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		endAngle = (1.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		lineToX -= 8;
// 	} else if (PACMAN_DIRECTION === 2) {
// 		startAngle = (0.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		endAngle = (0.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		lineToY -= 8;
// 	} else if (PACMAN_DIRECTION === 3) {
// 		startAngle = (1.35 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		endAngle = (0.65 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		lineToX += 8;
// 	} else if (PACMAN_DIRECTION === 4) {
// 		startAngle = (1.85 - (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		endAngle = (1.15 + (PACMAN_MOUNTH_STATE * 0.05)) * Math.PI;
// 		lineToY += 8;
// 	}
// 	ctx.arc(PACMAN_POSITION_X, PACMAN_POSITION_Y, PACMAN_SIZE, startAngle, endAngle, false);
// 	ctx.lineTo(lineToX, lineToY);
// 	ctx.fill();
// 	ctx.closePath();
// }

// function erasePacman() {

// 	var ctx = getPacmanCanevasContext();
// 	ctx.clearRect((PACMAN_POSITION_X - 2) - PACMAN_SIZE, (PACMAN_POSITION_Y - 2) - PACMAN_SIZE, (PACMAN_SIZE * 2) + 5, (PACMAN_SIZE * 2) + 5);
// }

// function killPacman() {
// 	playDieSound();

// 	LOCK = true;
// 	PACMAN_DEAD = true;
// 	stopPacman();
// 	stopGhosts();
// 	pauseTimes();
// 	stopBlinkSuperBubbles();
// 	PACMAN_KILLING_TIMER = setInterval('killingPacman()', PACMAN_KILLING_SPEED);
// }
// function killingPacman() {
// 	if (PACMAN_MOUNTH_STATE > -12) {
// 		erasePacman();
// 		PACMAN_MOUNTH_STATE--;
// 		drawPacman();
// 	} else {
// 		clearInterval(PACMAN_KILLING_TIMER);
// 		PACMAN_KILLING_TIMER = -1;
// 		erasePacman();
// 		if (LIFES > 0) {
// 			lifes(-1);
// 			setTimeout('retry()', (PACMAN_RETRY_SPEED));
// 		} else {
// 			gameover();
// 		}
// 	}
// }

// function testGhostsPacman() {
// 	testGhostPacman('blinky');
// 	testGhostPacman('pinky');
// 	testGhostPacman('inky');
// 	testGhostPacman('clyde');

// }
// function testGhostPacman(ghost) {
// 	eval('var positionX = GHOST_' + ghost.toUpperCase() + '_POSITION_X');
// 	eval('var positionY = GHOST_' + ghost.toUpperCase() + '_POSITION_Y');

// 	if (positionX <= PACMAN_POSITION_X + PACMAN_GHOST_GAP && positionX >= PACMAN_POSITION_X - PACMAN_GHOST_GAP && positionY <= PACMAN_POSITION_Y + PACMAN_GHOST_GAP && positionY >= PACMAN_POSITION_Y - PACMAN_GHOST_GAP) {
// 		eval('var state = GHOST_' + ghost.toUpperCase() + '_STATE');
// 		if (state === 0) {
// 			killPacman();
// 		} else if (state === 1) {
// 			startEatGhost(ghost);
// 		}
// 	}
// }
// function testFruitsPacman() {

// 	if (FRUIT_CANCEL_TIMER != null) {
// 		if (FRUITS_POSITION_X <= PACMAN_POSITION_X + PACMAN_FRUITS_GAP && FRUITS_POSITION_X >= PACMAN_POSITION_X - PACMAN_FRUITS_GAP && FRUITS_POSITION_Y <= PACMAN_POSITION_Y + PACMAN_FRUITS_GAP && FRUITS_POSITION_Y >= PACMAN_POSITION_Y - PACMAN_FRUITS_GAP) {
// 			eatFruit();
// 		}
// 	}
// }
// function testBubblesPacman() {

// 	var r = { x: PACMAN_POSITION_X - (PACMAN_SIZE / 2), y: PACMAN_POSITION_Y - (PACMAN_SIZE / 2), width: (PACMAN_SIZE * 2), height: (PACMAN_SIZE * 2) };

// 	for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i++) {
// 		var bubble = BUBBLES_ARRAY[i];

// 		var bubbleParams = bubble.split(";");
// 		var testX = parseInt(bubbleParams[0].split(",")[0]);
// 		var testY = parseInt(bubbleParams[0].split(",")[1]);
// 		var p = { x: testX, y: testY };

// 		if (isPointInRect(p, r)) {

// 			if (bubbleParams[4] === "0") {
// 				var type = bubbleParams[3];

// 				eraseBubble(type, testX, testY);
// 				BUBBLES_ARRAY[i] = bubble.substr(0, bubble.length - 1) + "1"

// 				if (type === "s") {
// 					setSuperBubbleOnXY(testX, testY, "1");
// 					score(SCORE_SUPER_BUBBLE);
// 					playEatPillSound();
// 					affraidGhosts();
// 				} else {
// 					score(SCORE_BUBBLE);
// 					playEatingSound();
// 				}
// 				BUBBLES_COUNTER--;
// 				if (BUBBLES_COUNTER === 0) {
// 					win();
// 				}
// 			} else {
// 				stopEatingSound();
// 			}
// 			return;
// 		}
// 	}
// }