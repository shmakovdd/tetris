import Game from './game.js';
import View from './view.js';
class Controller {
    constructor(view, game) {
        this.IsPaused = false
        this.interval = null
        this.isLose = false
        this.spaceKeyBind = this.spaceKeyBind.bind(this)
        this.keyBinds = this.keyBinds.bind(this)
        this.getLeadersboardInfo()
        view.renderScore(game.score)
        
        game.addEventListener('score', () => {
            view.renderScore(game.score)
            view.playOnScoreIncrease()
        })
        game.addEventListener('lose', () => {
            this.sendPlayerScore()
            this.isLose = true
            view.playHellMusic('stop')
            view.playGameOverSound()
            clearInterval(this.interval)
            view.showGameOver(game.score)
            document.removeEventListener('keydown', this.keyBinds)
            document.removeEventListener('keydown', this.spaceKeyBind)
        })

        view.inputNickname.addEventListener('change', e => {
            let nickname = e.target.value;
            game.name = nickname
        })
        document.addEventListener('click', e => {
            if(e.target == view.startButton) {
                document.addEventListener('keydown', this.spaceKeyBind)
                document.addEventListener('keydown', this.keyBinds)
                if(this.isLose) {
                    view.closeGameOver()
                    view.changeBack('tetrispaper.jpg!d')
                    view.changeTitle('normal')
                    this.isLose = false
                }
                view.startModalOff()
                this.startGame()
            }
            if(e.target == view.holdField && game.isHold !== true) {
                game.swapHoldAndActive()
                view.renderPlayfield(game.refreshField())
                view.renderSecondfield(game.refreshSecondField())
                view.renderHold(game.refreshHold())
            } 
        })
    }

    async sendPlayerScore() {
        await game.sendRequest('POST', 'https://blooming-crag-85774.herokuapp.com/api/score', game.playerData)
        let refreshBoard = await game.sendRequest('GET', 'https://blooming-crag-85774.herokuapp.com/api/score')
        game.db = refreshBoard
        console.log(game.db)
        view.renderLeadersboard(game.db);
    }

    async getLeadersboardInfo() {
        game.db.then(
            data => {
                view.renderLeadersboard(data);
            }
        )
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
                    if(game.level >= 10) {
                        view.renderPlayfield(game.refreshField(), 'hell')
                    } else {
                        view.renderPlayfield(game.refreshField())
                    } 
                    break
                case 'ArrowRight':
                    game.movePieceRight()
                    if(game.level >= 10) {
                        view.renderPlayfield(game.refreshField(), 'hell')
                    } else {
                        view.renderPlayfield(game.refreshField())
                    } 
                    break
                case 'ArrowLeft':
                    game.movePieceLeft()
                    if(game.level >= 10) {
                        view.renderPlayfield(game.refreshField(), 'hell')
                    } else {
                        view.renderPlayfield(game.refreshField())
                    } 
                    break
                case 'ArrowUp':
                    game.rotatePiece()
                    if(game.level >= 10) {
                        view.renderPlayfield(game.refreshField(), 'hell')
                    } else {
                        view.renderPlayfield(game.refreshField())
                    } 
                    break
                case 'Enter': 
                    this.fastDrop()
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
        view.renderPlayfield(game.refreshField())
        view.renderSecondfield(game.refreshSecondField())
        this.changeInterval(game.period, game.level)

    }
    
    fastDrop() {
        clearInterval(this.interval)
        let that = this
        this.interval = setInterval(() => {
 
            game.movePieceDown()
            if(game.level >= 10) {
                view.renderPlayfield(game.refreshField(), 'hell')
            } else {
                view.renderPlayfield(game.refreshField())
                view.renderSecondfield(game.refreshSecondField())
            } 
            if (game.isPieceLocked) {
                clearInterval(this.interval)
                if(that.isLose == false) {
                    that.changeInterval(game.period, game.level)
                }
                game.isPieceLocked = false
            }

        }, 15)
    }

    newLevel(count, period, level) {
        period = period == 1 ? 900 : +period.toString().match(/.(\d{1,3})/)[1] // Если это дробное число, то беру из него только три цифры после запятой
        if(game.pieceCount == count && game.pieceCount !== 145) {
            view.playSound()
            view.changeWrapperBorder()
            clearInterval(this.interval)
            game.period = period;          
            switch (level) {
                case 2:
                    view.displayAchiev('vadim')
                    break;
            
                case 10:
                    view.displayAchiev('doomguy')
                    view.playHellMusic('play')
                    view.changeBack('hellpaper.jpg')
                    view.changeTitle('hell')
                    break;
            }

            game.level = level;
            view.renderDifficulty(game.level)
            this.changeInterval(game.period, game.level)
        }
            game.movePieceDown()
            if(game.level >= 10) {
                view.renderPlayfield(game.refreshField(), 'hell')
            } else {
                view.renderPlayfield(game.refreshField())
        view.renderSecondfield(game.refreshSecondField())
            } 
    }

    changeInterval(period, level) {
        let currentState = game.levelAndPiecesCount.find(item => {
            if (item.level == level || item.pieceCount == game.pieceCount) return true
        })
        this.interval = setInterval(function() {
            this.newLevel(currentState.pieceCount + 15,
                Math.pow((0.86-(((currentState.level + 1))* 0.007)),
                (currentState.level + 1)), currentState.level + 1)
        }.bind(this), period)

    }
}


let view = new View(20, 10);
let game = new Game();
let controller = new Controller(view, game)
window.game = game;
window.view = view;
window.c = controller
 




