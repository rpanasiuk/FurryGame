require("../scss/main.scss");

class Furry {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.direction = 'right';		
	}
}

class Coin {
	constructor() {
		this.x = Math.floor(Math.random() * 10);
		this.y = Math.floor(Math.random() * 10);		
	}
}

class Game {
	constructor(furryInstance, coinInstance) {
		this.board = document.querySelectorAll("#board > div");
		this.furry = new Furry();
		this.coin = new Coin();
		this.score = 0;
		this.live = true;
		this.idSetInterval	= this.startGame();
	}

	index(x,y) {
		return x + (y * 10);
	}

	showFurry() {
		this.hideVisibleFurry();

		const pos = this.index(this.furry.x, this.furry.y);

		return this.board[pos].classList.add('furry');
	}

	showCoin() {
		const pos = this.index(this.coin.x, this.coin.y);
		
		return this.board[pos].classList.add('coin');
	}

	startGame(time=250) {
		return setInterval(() => {
            this.moveFurry();
        }, time);		
	}

	moveFurry() {

		if (this.furry.direction === 'right') {
			this.furry.x = this.furry.x + 1;
		} else if (this.furry.direction === 'left') {
			this.furry.x = this.furry.x - 1;
		} else if (this.furry.direction === 'up') {
			this.furry.y = this.furry.y + 1;
		} else if (this.furry.direction === 'down') {
			this.furry.y = this.furry.y - 1;
		}

		this.gameOver();

		if (this.live) {
			this.showFurry();
			this.checkCoinCollision();			
		}
	}

	hideVisibleFurry() {
		const furryClassItem = document.querySelector('.furry');

		if (furryClassItem) {
			furryClassItem.classList.remove('furry');
		}
	}

	turnFurry(event) {
		switch (event.which) {
			case 37:
				this.furry.direction = 'left';
				break;
			case 38:
				this.furry.direction = 'down';
				break;
			case 39:
				this.furry.direction = 'right';
				break;
			case 40:
				this.furry.direction = 'up';
				break;
		}	
	}

	checkCoinCollision() {
		const pos = this.index(this.coin.x, this.coin.y);

		if (pos === this.index(this.furry.x, this.furry.y)) {
			this.board[pos].classList.remove('coin');
			this.score++;

			document.querySelector('#score strong').innerText = this.score;

			this.coin = new Coin();
			this.showCoin();
		}
	}

	gameOver() {
		if (this.furry.x < 0 || this.furry.y < 0 || this.furry.x > 9 || this.furry.y > 9) {
			clearInterval(this.idSetInterval);

			this.live = false;
			this.hideVisibleFurry();
			alert('Game over.');
		}
	}
}

document.addEventListener("DOMContentLoaded", function() {

	const gameInstance = new Game();

	gameInstance.showFurry();
	gameInstance.showCoin();

	document.addEventListener('keydown', function(event){
		gameInstance.turnFurry(event);
	});
});