export default class Game extends EventTarget {
    constructor() {
        super()
        this.event = new CustomEvent("score")
        this.loseEvent = new CustomEvent("lose")
        this.score = 0;
        this.pieceCount = 0;
        this.period = 900;
        this.lines = [];
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
        this.level = 1;
        this.playfield = this.createGamefield();
        this.activePiece = this.createPiece();
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
            if (!line.includes(0)) {
                fullLinesIndx.push(index)
            }
        })
        return fullLinesIndx
    }

    refreshField() {
        let blocks = this.activePiece.blocks
        let playfield = this.createGamefield()
        let {x, y} = this.activePiece;


        if(this.isPieceOutOfBounds()) {
            this.dispatchEvent(this.loseEvent)
            this.level = 1
            this.score = 0
            this.pieceCount = 0
            this.period = 900
            this.playfield = this.createGamefield()
            return
        }
        for (let i = 0; i < playfield.length; i++) {
                for (let e = 0; e < playfield[y].length; e++) {
                    playfield[i][e] = this.playfield[i][e]
                }
        }

        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if(blocks[i][e]) {
                    playfield[y + i][x + e] = blocks[i][e]
                }
            }
        }



        return playfield
    }

    createPiece() {   
        this.pieceCount += 1
        let pieceIndex = Math.floor(Math.random() * 7)
        let piece = {
            x: 4,
            y: 0,
            blocks: [],
            pieceName: ''
        }
        piece.blocks = this.pieces[pieceIndex]['piece']
        piece.pieceName = this.pieces[pieceIndex]['pieceName']
        return piece
    }

    createGamefield() {
        return new Array(20).fill(0).map(() => new Array(10).fill(0));
    }

    movePieceRight() {
        this.activePiece.x += 1;

        if (this.isPieceOutOfBounds()) {
            this.activePiece.x -= 1;
        }
        
    }

    movePieceLeft() {
        this.activePiece.x -= 1;
        if (this.isPieceOutOfBounds()) {
            this.activePiece.x += 1;
        }

    }

    movePieceDown() {
        this.activePiece.y += 1;
        if (this.isPieceOutOfBounds()) {
            this.activePiece.y -= 1;
            this.lockPiece()
        }
    }

    rotatePiece() {
        let blocks = this.activePiece.blocks
        let prevRotation = blocks.slice()
        this.activePiece.blocks = blocks.reverse().map((line, i) => blocks.map(line => (line[i])))
        if(this.isPieceOutOfBounds()) {
            this.activePiece.blocks = prevRotation
        }
    }

    isPieceOutOfBounds() {
        let playfield = this.playfield;
        let {x, y} = this.activePiece;
        let blocks = this.activePiece.blocks;
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if (
                    blocks[i][e] &&
                    ((playfield[y + i] == undefined || playfield[y + i][x + e] == undefined) ||
                    playfield[y + i][x + e])                 
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
    


    lockPiece() {
        let blocks = this.activePiece.blocks;
        let playfield = this.playfield;
        let {x, y} = this.activePiece;
        for (let i = 0; i < blocks.length; i++) {
            for (let e = 0; e < blocks[i].length; e++) {
                if(blocks[i][e]) {
                    playfield[y + i][x + e] = blocks[i][e]
                }
            }
        }
        this.activePiece = this.createPiece()
        this.lines = this.isLineFulled()
        if(this.lines.length) {
            this.clearLine()
            this.transformPlayfield()
            
        }
    }
}