export default class View {
    constructor(row, columns) {
        this.canvas = document.querySelector('#example')
        this.context = this.canvas.getContext('2d')
        this.row = row;
        this.columns = columns;
        this.score = document.querySelector('[data-score]')
        this.startButton = document.querySelector('#startButton')
        this.modal = document.querySelector('.modal')
        this.level = document.querySelector('[data-level]')
        this.paused = document.querySelector('.paused')
    }

    renderScore(score = 0) {
        this.score.innerHTML = score
    }

    startModalOff() {
        this.modal.style.display = 'none'
        this.startButton.style.display = 'none'
    }

    playSound() {
        var audio = new Audio(); 
        audio.src = 'levelup.mp3'; 
        audio.autoplay = true; 
    }
    
    playOnScoreIncrease() {
        var audio = new Audio(); 
        audio.src = 'clearLine.mp3'; 
        audio.autoplay = true; 
    }

    playGameOverSound() {
        var audio = new Audio(); 
        audio.src = 'nani.mp3'; 
        audio.autoplay = true; 
    }

    showGameOver(score) {
        this.modal.style.display = 'flex'
        this.paused.innerHTML = `GAME OVER:((( YOUR SCORE: ${score}`
        this.paused.style.display = 'block'
        this.startButton.innerHTML = 'WANNA TRY AGAIN??'
        this.startButton.style.display = 'block'
    }

    closeGameOver() {
        this.modal.style.display = 'none'
        this.paused.style.display = 'none'
        this.startButton.style.display = 'none'
    }

    showPauseModal() {
        this.modal.style.display = 'flex'
        this.paused.style.display = 'block'
        this.paused.innerHTML = 'GAME PAUSED'
    }

    pauseModalOff() {
        this.paused.style.display = 'none'
        this.modal.style.display = 'none'
    }

    renderDifficulty(level = 0) {
        this.level.innerHTML = level
    }

    renderPlayfield(playfield, blockName) {
        if (playfield == undefined) return
        this.context.clearRect(0, 0, 320, 640)

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
                if(playfield[y][x]) {
                    this.renderBlockColor(blockName, x, y)
                }

                switch(playfield[y][x]) {
                    case 'S':
                        this.renderBlockColor('#f60000', x, y)
                        break
                    case 'Z':
                        this.renderBlockColor('#67b321', x, y)
                        break
                    case 'I':
                        this.renderBlockColor('#01e3fb', x, y)
                        break
                    case 'T':
                        this.renderBlockColor('#a10297', x, y)
                        break  
                    case 'O':
                        this.renderBlockColor('#faff01', x, y)
                        break
                    case 'L':
                        this.renderBlockColor('#fe8c03', x, y)
                        break  
                    case 'J':
                        this.renderBlockColor('#ff52ba', x, y)
                        break      
                }
            }
        }
    }

    renderBlockColor(blockColor, x, y) {
        this.context.fillStyle = `${blockColor}`
        this.context.shadowColor = `${blockColor}`;
        this.context.strokeStyle = 'black'
        this.context.shadowBlur = 5;
        
        this.context.strokeRect( x * 32, y * 32, 32, 32)
        this.context.fillRect( x * 32, y * 32, 32, 32)
    }

}