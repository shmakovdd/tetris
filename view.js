export default class View {
    constructor(row, columns) {
        this.wrapper = document.querySelector('.wrapper')
        this.title = document.querySelector('.title')
        this.canvas = document.querySelector('#example')
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

    renderPlayfield(playfield, mode) {
        if (playfield == undefined) return
        this.context.clearRect(0, 0, 320, 640)

        for (let y = 0; y < playfield.length; y++) {
            for (let x = 0; x < playfield[y].length; x++) {
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
                if(mode && playfield[y][x]) this.renderBlockColor('red', x, y)
            }
        }
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