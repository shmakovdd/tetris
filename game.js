export default class Game extends EventTarget {
    constructor() {
        super()
        this.event = new CustomEvent("score")
        this.loseEvent = new CustomEvent("lose")
        this.score = 0
        this.name = 'unknown'
        this.pieceCount = 0
        this.period = 900
        this.lines = []
        this.level = 1
        this.isPieceLocked = false // нужно только для мгновенного падения блока
        this.pieces = [
            {
                pieceName: 'T',
                piece: [
                    [0,0,0],
                    ['T','T','T'],
                    [0,'T',0],
                ]
            },
            {
                pieceName: 'O',
                piece: [
                    [0,0,0,0],
                    [0,'O','O',0],
                    [0,'O','O',0],
                    [0,0,0,0],
                ]
            },
            {
                pieceName: 'L',
                piece: [
                    [0,'L',0],
                    [0,'L',0],
                    [0,'L','L'],
                ]
            },
            {
                pieceName: 'S',
                piece: [
                    [0,0,0],
                    [0,'S','S'],
                    ['S','S',0],
                ]
            },
            {
                pieceName: 'Z',
                piece: [
                    [0,0,0],
                    ['Z','Z',0],
                    [0,'Z','Z'],
                ]
            },
            
            {
                pieceName: 'J',
                piece: [
                    [0,'J',0],
                    [0,'J',0],
                    ['J','J',0],
                ]
            },
            {
                pieceName: 'I',
                piece: [
                    [0,0,0,0],
                    ['I','I','I','I'],
                    [0,0,0,0],
                    [0,0,0,0],
                ]
            },

    
        ];
        this.secondField = this.createField(20, 10) 
        this.pieceIndexs = this.createPiecesIndexArray()
        this.playfield = this.createField(20, 10)
        this.levelAndPiecesCount = this.calculateLevelsAndPieceCount()
        this.activePiece = this.createPiece()
        this.nextPiece = this.createNextPieces(this.pieceIndexs[1], 2)
        this.secondPiece = this.createNextPieces(this.pieceIndexs[2], 8)
        this.thirdPiece = this.createNextPieces(this.pieceIndexs[3], 14)
        this.holdField = this.createField(6, 6)
        this.hold = this.createHold()
        this.isHold = false
        this.db = this.sendRequest('GET', 'https://blooming-crag-85774.herokuapp.com/api/score')
    }   

    get playerData() {
        return {
            name: this.name,
            score: +this.score
        }
    }

    calculateLevelsAndPieceCount() {
        let arr = []
        let levelAndPiecesCount = new Map()
        for (let i = 1; i <= 11; i++) {
            arr.push({
                level: 1*i, 
                pieceCount: (15 * i) - 14})
            levelAndPiecesCount.set(1 * i, (15 * i) - 14)
        }

        return arr
    }

    sendRequest(method, url, body = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest()

            xhr.open(method, url)

            xhr.responseType = 'json'
            xhr.setRequestHeader('Content-Type', 'application/json')

            xhr.onload = () => {
               resolve(xhr.response)
            }
        
            xhr.send(JSON.stringify(body))
        })
    }

    createPiecesIndexArray() {
        let array = []
        for (let i = 0; i < 4; i++) {
            array.push(this.getRandomNumber())
        }
        return array
    }

    transformPiecesArray() {
        this.pieceIndexs.splice(0, 1)
        this.pieceIndexs.push(this.getRandomNumber())
        return this.pieceIndexs
    }

    clearLine() {
        this.lines.forEach((lineIndex) => this.playfield[lineIndex].forEach((item, index)=> {
            this.playfield[lineIndex][index] = 0
        }))
    }

    transformPlayfield() {
        let emptyLines
        for(let i = 0; i < this.lines.length; i++) {
            emptyLines = this.playfield.splice(this.lines[i], 1)
            this.playfield = emptyLines.concat(this.playfield)
            this.increaseScore()
        }
        
    }

    isLineFulled() {
        let fullLinesIndx = []
        this.playfield.forEach((line, index) => {
            if (line.every((item => typeof(item) == 'string'))) {
                fullLinesIndx.push(index)
            }
        })
        return fullLinesIndx
    }

    refreshSecondField() {
        let playfield = this.createField(20, 10)
        let {x: x1, y:y1, blocks: blocks1} = this.nextPiece
        let {x: x2, y:y2, blocks: blocks2} = this.secondPiece
        let {x: x3, y:y3, blocks: blocks3} = this.thirdPiece
        for (let i = 0; i < playfield.length; i++) {
            for (let e = 0; e < playfield[e].length; e++) {
                playfield[i][e] = this.secondField[i][e]
            }
        }
        for (let i = 0; i < blocks1.length; i++) {
            for (let e = 0; e < blocks1[i].length; e++) {
                if(blocks1[i][e]) {
                    playfield[y1 + i][x1 + e] = blocks1[i][e]
                }
            }
        }
        for (let i = 0; i < blocks2.length; i++) {
            for (let e = 0; e < blocks2[i].length; e++) {
                if(blocks2[i][e]) {
                    playfield[y2 + i][x2 + e] = blocks2[i][e]
                }
            }
        }
        for (let i = 0; i < blocks3.length; i++) {
            for (let e = 0; e < blocks3[i].length; e++) {
                if(blocks3[i][e]) {
                    playfield[y3 + i][x3 + e] = blocks3[i][e]
                }
            }
        }
        return playfield
    }

    refreshHold() {
        let field = this.createField(6,6)
        let {x, y, blocks} = this.hold
        for (let i = 0; i < playfield.length; i++) {
            for (let e = 0; e < playfield[e].length; e++) {
                field[i][e] = this.holdField[i][e]
            }
        }
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if(blocks[i][e]) {
                    field[y + i][x + e] = blocks[i][e]
                }
            }
        }
        return field
    }

    clearHold() {
        this.hold.blocks = []
    }

    refreshField() {
        let blocks = this.activePiece.blocks
        let playfield = this.createField(20, 10)
        let {x: xCoor, y: yCoor} = this.activePiece;
        let fantomBlocks = {
            x: xCoor,
            y: yCoor,
            blocks: this.activePiece.blocks.map(line => [...line]),
            fantom: true
        }
        for (let i = 0; i < fantomBlocks.blocks.length; i++) {
            for (let e = 0; e < fantomBlocks.blocks[i].length; e++) {
               if(fantomBlocks.blocks[i][e] !== 0) fantomBlocks.blocks[i][e] = 2
            }
        }
        for (let i = 0; i < this.playfield.length; i++) {
            for (let e = 0; e < this.playfield[e].length; e++) {
                if (this.playfield[i][e] == 2) this.playfield[i][e] = 0
            }
        }
        while (this.isPieceOutOfBounds(fantomBlocks) !== true) {
            this.moveFantomPiece(fantomBlocks)
        }
        fantomBlocks.y -= 1;
        if(fantomBlocks.y >=0) this.lockPiece(fantomBlocks)

        if(this.isPieceOutOfBounds(this.activePiece)) {
            this.dispatchEvent(this.loseEvent)
            this.level = 1
            this.score = 0
            this.pieceCount = 0
            this.period = 900
            this.playfield = this.createField(20, 10)
            return
        }

        for (let i = 0; i < playfield.length; i++) {
                for (let e = 0; e < playfield[yCoor].length; e++) {
                    playfield[i][e] = this.playfield[i][e]
                }
        }
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if(blocks[i][e]) {
                    playfield[yCoor + i][xCoor + e] = blocks[i][e]
                }
            }
        }
        return playfield
    }


    getRandomNumber() {
        return Math.floor(Math.random() * 7)
    }

    createPiece() {   
        this.pieceCount += 1
        let pieceIndex = this.pieceIndexs[0]
        let piece = {
            x: 4,
            y: 0,
            blocks:  this.pieces[pieceIndex]['piece'].map(item => item.slice()),
            pieceName: this.pieces[pieceIndex]['pieceName']
        }
        return piece
    }

    createHold() {
        let piece = {
            x: 1,
            y: 1,
            blocks: [],
            pieceName: ''
        }
        return piece
    }

    
    swapHoldAndActive() {
        this.isHold = true
        if(this.hold.blocks.length) { // если холд уже есть
            let blockTemp = this.hold.blocks.map(item => item.slice())
            this.hold.blocks = this.activePiece.blocks.map(item => item.slice())
            this.activePiece.blocks = blockTemp
            let nameTemp = this.hold.pieceName
            this.hold.pieceName = this.activePiece.pieceName
            this.activePiece.pieceName = nameTemp
            this.activePiece.y = 0
            this.activePiece.x = 4
        } else { // если холд пустой 
            this.hold.blocks = this.activePiece.blocks.map(item => item.slice())
            this.hold.pieceName = this.activePiece.pieceName
            this.pieceIndexs = this.transformPiecesArray()
            this.activePiece = this.createPiece() 
            this.nextPiece = this.createNextPieces(this.pieceIndexs[1], 2)
            this.secondPiece = this.createNextPieces(this.pieceIndexs[2], 8)
            this.thirdPiece = this.createNextPieces(this.pieceIndexs[3], 14)
        }
    }


    createNextPieces(indx, y) {
        let piece = {
            x: 3,
            y,
            blocks: this.pieces[indx]['piece'],
            pieceName: this.pieces[indx]['pieceName']
        }
        return piece
    }

    createField(y, x) {
        return new Array(y).fill(0).map(() => new Array(x).fill(0));
    }



    movePieceRight() {
        this.activePiece.x += 1;

        if (this.isPieceOutOfBounds(this.activePiece)) {
            this.activePiece.x -= 1;
        }
        
    }

    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.isPieceOutOfBounds(this.activePiece)) {
            this.activePiece.x += 1;
        }

    }

    moveFantomPiece(piece) {
        piece.y += 1
    }

    movePieceDown() {
        this.activePiece.y += 1;

        if (this.isPieceOutOfBounds(this.activePiece)) {
            this.activePiece.y -= 1;
            this.lockPiece(this.activePiece)
        }
    }

    rotatePiece() {
        let blocks = this.activePiece.blocks
        let prevRotation = blocks.slice()
        this.activePiece.blocks = blocks.reverse().map((line, i) => blocks.map(line => (line[i])))
        if(this.isPieceOutOfBounds(this.activePiece)) {
            this.activePiece.blocks = prevRotation
        }
    }

    isPieceOutOfBounds(pieceInfo) {
        let playfield = this.playfield;
        let {x, y, blocks} = pieceInfo;;
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if (
                    (blocks[i][e]) &&
                    ((playfield[y + i] == undefined || playfield[y + i][x + e] == undefined) ||
                    (playfield[y + i][x + e] && playfield[y + i][x + e] !== 2))                 
                ) {
                    return true
                }
                                
            }
        }
        return false
    }

    increaseScore() {
        this.score += 50;
        this.dispatchEvent(this.event)
    }
    
    

    lockPiece(piece) {
        let playfield = this.playfield;
        let {x, y, blocks} = piece;
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if(blocks[i][e]) {
                    playfield[y + i][x + e] = blocks[i][e]
                }
            }
        }

        if(!(piece.fantom == true)) this.isPieceLocked = true

        if(!(piece.fantom == true)) {
            this.pieceIndexs = this.transformPiecesArray()
            this.activePiece = this.createPiece() 
            this.nextPiece = this.createNextPieces(this.pieceIndexs[1], 2)
            this.secondPiece = this.createNextPieces(this.pieceIndexs[2], 8)
            this.thirdPiece = this.createNextPieces(this.pieceIndexs[3], 14)
            this.isHold = false
        }
        this.lines = this.isLineFulled()
        if(this.lines.length) {
            this.clearLine()
            this.transformPlayfield()
            
        }
    }

}