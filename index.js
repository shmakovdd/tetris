import Game from './game.js';
import View from './view.js';
class Controller {
    constructor(view, game) {
        this.IsPaused = false
        this.interval = null
        this.isLose = false
        this.spaceKeyBind = this.spaceKeyBind.bind(this)
        view.renderScore(game.score)
        game.addEventListener('score', () => {
            view.renderScore(game.score)
            view.playOnScoreIncrease()
        })
        game.addEventListener('lose', () => {
            this.lose = true
            view.playGameOverSound()
            clearInterval(this.interval)
            view.showGameOver(game.score)
            document.removeEventListener('keydown', this.keyBinds)
            document.removeEventListener('keydown', this.spaceKeyBind)
        })

        document.addEventListener('click', e => {
            if(e.target == view.startButton) {
                document.addEventListener('keydown', this.spaceKeyBind)
                document.addEventListener('keydown', this.keyBinds)
                if(this.lose) view.closeGameOver()
                view.startModalOff()
                this.startGame()
            }
        })
    }

    spaceKeyBind(e) {
        if (e.code == 'Space') {
            this.pauseGame()
        }
    }

    keyBinds(e) {
            switch(e.code) {
                case 'ArrowDown': 
                    game.movePieceDown()
                    view.renderPlayfield(game.refreshField())
                    break
                case 'ArrowRight':
                    game.movePieceRight()
                    view.renderPlayfield(game.refreshField())
                    break
                case 'ArrowLeft':
                    game.movePieceLeft()
                    view.renderPlayfield(game.refreshField())
                    break
                case 'ArrowUp':
                    game.rotatePiece()
                    view.renderPlayfield(game.refreshField())
                    break
            }
    }

    pauseGame() {
        if (this.IsPaused == false) {
            clearInterval(this.interval)
            this.IsPaused = true
            view.showPauseModal()
            document.removeEventListener('keydown', this.keyBinds)
        } else {
            this.changeInterval(game.period, game.level)
            this.IsPaused = false
            view.startModalOff()
            document.addEventListener('keydown', this.keyBinds)
        }
    }

    startGame() {
        view.renderScore(game.score)
        view.renderDifficulty(game.level)
        view.renderPlayfield(game.refreshField(), game.activePiece.pieceName)
        this.changeInterval(game.period, game.level)

    }
    
    newLevel(count, period, level) {
        if(game.pieceCount == count && game.pieceCount !== 81) {
            view.playSound()
            clearInterval(this.interval)
            game.period = period;

            game.level = level;
            view.renderDifficulty(game.level)
            this.changeInterval(game.period, game.level)
        }
            game.movePieceDown()
            console.log(game.period);
            console.log(game.pieceCount)
            view.renderPlayfield(game.refreshField(), game.activePiece.pieceName)
    }

    changeInterval(period, level) {
        if(game.pieceCount == 1 || level == 1) {
            this.interval = setInterval(function() {
               this.newLevel(10, 860, 2)
            }.bind(this), period)
        }
        if(game.pieceCount == 10 || level == 2 ) {
            this.interval = setInterval(function() {
               this.newLevel(15, 720, 3)
            }.bind(this), period)
        }
        if(game.pieceCount == 15 || level == 3) {
            this.interval = setInterval(function() {
               this.newLevel(30, 550, 4)
            }.bind(this), period)
        }
        if(game.pieceCount == 30 || level == 4) {
            this.interval = setInterval(function() {
               this.newLevel(45, 480, 5)
            }.bind(this), period)
        }
        if(game.pieceCount == 45 || level == 5) {
            this.interval = setInterval(function() {
               this.newLevel(60, 400, 6)
            }.bind(this), period)
        }
        if(game.pieceCount == 60 || level == 6) {
            this.interval = setInterval(function() {
               this.newLevel(80, 380, 7)
            }.bind(this), period)
        }
        if(game.pieceCount == 80 || level == 7) {
            this.interval = setInterval(function() {
               this.newLevel(81, 330, 8)
            }.bind(this), period)
        }
    }
}


let view = new View(20, 10);
let game = new Game();
let controller = new Controller(view, game)
window.game = game;
window.view = view;
 




