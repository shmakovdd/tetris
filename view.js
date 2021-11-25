export default class View {
    constructor(row, columns) {
        this.wrapper = document.querySelector('.wrapper')
        this.tetrisWrapper = document.querySelector('.tetris_wrapper')
        this.title = document.querySelector('.title')
        this.canvas = document.querySelector('#playfield')
        this.context = this.canvas.getContext('2d')
        this.row = row;
        this.columns = columns;
        this.score = document.querySelector('[data-score]')
        this.startButton = document.querySelector('#startButton')
        this.modal = document.querySelector('.modal')
        this.level = document.querySelector('[data-level]')
        this.paused = document.querySelector('.paused')
        this.hellMusic = new Audio(); 
        this.achiev = document.querySelector('.achiev')
        this.nextBlocksField = document.querySelector('#next-blocks')
        this.nextBlocksFieldCtx = this.nextBlocksField.getContext('2d')
        this.holdField = document.querySelector('#hold')
        this.holdFieldCtx = this.holdField.getContext('2d')
    }

    changeHoldBorder(state) {
        switch (state) {
            case true:
                this.holdField.classList.add('red_border')
                setInterval(() => this.holdField.classList.remove('red_border'), 1000)
                break;
        
            case false:
                this.holdField.classList.add('green_border')
                setInterval(() => this.holdField.classList.remove('green_border'), 500)
                break;
        }
    }

    changeWrapperBorder() {
        this.tetrisWrapper.classList.toggle('level-up')
        if (this.tetrisWrapper.classList.contains('level-up')) {
            setInterval(() => this.tetrisWrapper.classList.remove('level-up'), 500)
        }
    }

    renderScore(score = 0) {
        this.score.innerHTML = score
    }

    startModalOff() {
        this.modal.style.display = 'none'
        this.startButton.style.display = 'none'
    }

    changeTitle(mode) {
        switch (mode) {
            case 'hell':
                this.title.innerHTML = 'SUFFER!!!'
                this.title.style.fontSize = '45px'
                this.title.style.color = 'red'
                break;
        
            case 'normal':
                this.title.innerHTML = '<span style="color: #f60000">T</span><span style="color: #67b321">E</span><span style="color: #01e3fb">T</span><span style="color: #a10297">R</span><span style="color: #faff01">I</span><span style="color: #fe8c03">S</span>'
                this.title.style.fontSize = '32px'
                break;
        }
    }

    changeBack(src) {
        this.wrapper.style.backgroundImage = `url(${src})`
    }
    playSound() {
        var audio = new Audio(); 
        audio.src = 'levelup.mp3'; 
        audio.volume = 0.4;
        audio.autoplay = true; 
    }
    
    playHellMusic(check) {
        switch (check) {
            case 'play':
                this.hellMusic.currentTime = 0
                this.hellMusic.src = 'bfg.mp3'; 
                this.hellMusic.autoplay = true; 
                this.hellMusic.volume = 0.4;
                break;
        
            case 'stop':
                this.hellMusic.pause()
                break;
        }

    }


    playOnScoreIncrease() {
        var audio = new Audio(); 
        audio.src = 'clearLine.mp3'; 
        audio.autoplay = true; 
    }
    playJustToSuffer() {
        var audio = new Audio(); 
        audio.src = 'suffer.mp3'; 
        audio.autoplay = true; 
        audio.volume = 0.3;
    }
    playGameOverSound() {
        var audio = new Audio(); 
        audio.volume = 0.5;
        audio.src = 'nani.mp3'; 
        audio.autoplay = true; 
    }

    showGameOver(score) {
        this.modal.style.display = 'flex'
        this.paused.innerHTML = `GAME OVER! YOUR SCORE: ${score}`
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
        level = level == 8 ? 'STILL TOO EASY?' : level
        level = level == 9 ? 'DIE HARD' : level
        level = level == 10 ? 'INSANE' : level
        level = level == 11 ? 'BEYOND GOOD AND EVIL' : level
        this.level.innerHTML = level
    }

    displayAchiev(achievName) {
        let achievTitle = document.querySelector('.achiev__name')
        let achievContent = document.querySelector('.achiev__descr')
        switch (achievName) {
            case 'vadim':
                achievTitle.innerHTML = 'Тест на Вадима'
                achievContent.innerHTML = 'Пройти первый уровень'
            break;    
            case 'doomguy': 
                achievTitle.innerHTML = 'Добро пожаловать в АД'
                achievContent.innerHTML = 'Добраться до последнего уровня'
            break;
        }

        this.achiev.classList.toggle('achiev-shown')
        setTimeout(() => {
            if(this.achiev.classList.contains('achiev-shown')) {
                this.achiev.classList.remove('achiev-shown')
            }
        }, 5000)
    }

    renderHold(field) {
        this.holdFieldCtx.clearRect(0,0, 180, 180)
        
        for (let y = 0; y < field[y].length; y++) {
            for (let x = 0; x < field.length; x++) {
                switch(field[x][y]) {
                    case 'S':
                        this.renderHoldBlock('#f60000', y, x)
                        break
                    case 'Z':
                        this.renderHoldBlock('#67b321', y, x)
                        break
                    case 'I':
                        this.renderHoldBlock('#01e3fb', y, x)
                        break
                    case 'T':
                        this.renderHoldBlock('#a10297', y, x)
                        break  
                    case 'O':
                        this.renderHoldBlock('#faff01', y, x)
                        break
                    case 'L':
                        this.renderHoldBlock('#fe8c03', y, x)
                        break  
                    case 'J':
                        this.renderHoldBlock('#ff52ba', y, x)
                        break
                }
            }
        }
    }

    renderSecondfield(field) {
        this.nextBlocksFieldCtx.clearRect(0,0, 200, 400)
        
        for (let y = 0; y < field[y].length; y++) {
            for (let x = 0; x < field.length; x++) {
                switch(field[x][y]) {
                    case 'S':
                        this.renderSecondFieldBlock('#f60000', y, x)
                        break
                    case 'Z':
                        this.renderSecondFieldBlock('#67b321', y, x)
                        break
                    case 'I':
                        this.renderSecondFieldBlock('#01e3fb', y, x)
                        break
                    case 'T':
                        this.renderSecondFieldBlock('#a10297', y, x)
                        break  
                    case 'O':
                        this.renderSecondFieldBlock('#faff01', y, x)
                        break
                    case 'L':
                        this.renderSecondFieldBlock('#fe8c03', y, x)
                        break  
                    case 'J':
                        this.renderSecondFieldBlock('#ff52ba', y, x)
                        break
                }
            }
        }
    }

    renderPlayfield(playfield, mode) {
        if (playfield == undefined) return
        this.context.clearRect(0, 0, 320, 640)

        let pieceColor

        for (let y = 0; y < playfield[y].length; y++) {
            for (let x = 0; x < playfield.length; x++) {
                switch(playfield[x][y]) {
                    case 'S':
                        this.renderBlockColor('#f60000', y, x)
                        pieceColor = '#f60000'
                        break
                    case 'Z':
                        this.renderBlockColor('#67b321', y, x)
                        pieceColor = '#67b321'
                        break
                    case 'I':
                        this.renderBlockColor('#01e3fb', y, x)
                        pieceColor = '#01e3fb'
                        break
                    case 'T':
                        this.renderBlockColor('#a10297', y, x)
                        pieceColor = '#a10297'
                        break  
                    case 'O':
                        this.renderBlockColor('#faff01', y, x)
                        pieceColor = '#faff01'
                        break
                    case 'L':
                        this.renderBlockColor('#fe8c03', y, x)
                        pieceColor = '#fe8c03'
                        break  
                    case 'J':
                        this.renderBlockColor('#ff52ba', y, x)
                        pieceColor = '#ff52ba'
                        break
                    case 2: 
                    this.renderFantomBlock(pieceColor, y, x)
                        break          
                }
                if(mode && playfield[y][x]) this.renderBlockColor('red', x, y)
            }
        }
    }

    renderHoldBlock (blockColor, x, y) {
        this.holdFieldCtx.fillStyle = `${blockColor}`
        this.holdFieldCtx.shadowColor = `${blockColor}`;
        this.holdFieldCtx.strokeStyle = 'black'
        this.holdFieldCtx.shadowBlur = 10;
        
        this.holdFieldCtx.strokeRect( x * 30, y * 30, 30, 30)
        this.holdFieldCtx.fillRect( x * 30, y * 30, 30, 30)
    }

    renderSecondFieldBlock (blockColor, x, y) {
        this.nextBlocksFieldCtx.fillStyle = `${blockColor}`
        this.nextBlocksFieldCtx.shadowColor = `${blockColor}`;
        this.nextBlocksFieldCtx.strokeStyle = 'black'
        this.nextBlocksFieldCtx.shadowBlur = 10;
        
        this.nextBlocksFieldCtx.strokeRect( x * 20, y * 20, 20, 20)
        this.nextBlocksFieldCtx.fillRect( x * 20, y * 20, 20, 20)
    }

    renderFantomBlock(color, x , y) {
        this.context.strokeStyle = `${color}`
        this.context.lineWidth = '2px';
        this.context.strokeRect( x * 32, y * 32, 32, 32)

    }

    renderBlockColor(blockColor, x, y) {
        this.context.fillStyle = `${blockColor}`
        this.context.shadowColor = `${blockColor}`;
        this.context.strokeStyle = 'black'
        this.context.shadowBlur = 10;
        
        this.context.strokeRect( x * 32, y * 32, 32, 32)
        this.context.fillRect( x * 32, y * 32, 32, 32)
    }

}