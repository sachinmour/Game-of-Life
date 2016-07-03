import React from "react";
var canvasSide = 700;
var ctx;

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            boardSide: 105,
            gridSide: 700 / 105,
            start: true,
            simSpeed: 250,
            generation: 0
        };
        this.grid;
        this.copyGrid;
        this.ctx;
        this.c;
    }

    updateGrid() {
        var boardSide = this.state.boardSide;
        for (var j = 0; j < boardSide; j++) {
            for (var k = 0; k < boardSide; k++) {
                var neighbours = 0;
                neighbours += this.grid[(j - 1 + boardSide) % boardSide][(k - 1 + boardSide) % boardSide];
                neighbours += this.grid[(j - 1 + boardSide) % boardSide][k];
                neighbours += this.grid[(j - 1 + boardSide) % boardSide][(k + 1) % boardSide];
                neighbours += this.grid[j][(k - 1 + boardSide) % boardSide];
                neighbours += this.grid[j][(k + 1) % boardSide];
                neighbours += this.grid[(j + 1) % boardSide][(k - 1 + boardSide) % boardSide];
                neighbours += this.grid[(j + 1) % boardSide][k];
                neighbours += this.grid[(j + 1) % boardSide][(k + 1) % boardSide];

                if (this.grid[j][k] === 0) {
                    switch (neighbours) {
                        case 3:
                            this.copyGrid[j][k] = 1;
                            break;
                        default:
                            this.copyGrid[j][k] = 0;
                    }
                } else if (this.grid[j][k] === 1) {
                    switch (neighbours) {
                        case 0:
                        case 1:
                            this.copyGrid[j][k] = 0;
                            break;
                        case 2:
                        case 3:
                            this.copyGrid[j][k] = 1;
                            break;
                        case 4:
                        case 5:
                        case 6:
                        case 7:
                        case 8:
                            this.copyGrid[j][k] = 0;
                            break;
                        default:
                            this.copyGrid[j][k] = 0;
                    }

                }
            }
        }

        for (var j = 0; j < boardSide; j++) {
            for (var k = 0; k < boardSide; k++) {
                this.grid[j][k] = this.copyGrid[j][k];
            }
        }
    }

    go() {
        var _this = this;
        var frame;
        if (_this.state.start) {
            setTimeout(function() {
                _this.setState({
                    generation: _this.state.generation + 1
                });
                _this.drawSquares();
                _this.updateGrid();
                frame = requestAnimationFrame(_this.go.bind(_this));
            }, 5000);
        } else {
            cancelAnimationFrame(frame);
        }
    }

    createArray(rows) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    }

    componentDidMount() {
        this.c = document.getElementById('board');
        this.ctx = this.c.getContext('2d');
        this.grid = this.createArray(this.state.boardSide);
        this.copyGrid = this.createArray(this.state.boardSide);
        if (this.state.start) {
            this.randomStart(this.state.boardSide);
        }
    }

    randomStart(boardSide) {
        for (var j = 0; j < boardSide; j++) {
            for (var k = 0; k < boardSide; k++) {
                this.grid[j][k] = Math.floor((Math.random() * 2));
            }
        }
        this.go();
    }

    changeGridSides(e) {
        var boardSide = parseInt(e.target.value);
        var gridSide = canvasSide / boardSide;
        var _this = this;
        this.setState({
            start: false,
            boardSide: boardSide,
            gridSide: gridSide
        }, function() {
            _this.grid = _this.createArray(boardSide);
            _this.copyGrid = _this.createArray(boardSide);
            _this.setState({
                start: true
            }, function() {
                _this.randomStart(boardSide);
            })
        });
    }

    drawGridLines() {
        var gridSide = this.state.gridSide;
        var boardSide = this.state.boardSide;
        this.ctx.beginPath();
        this.ctx.strokeStyle = "#7E8AA2"
        for (var i = 0; i <= boardSide; i++) {
            this.ctx.moveTo(0, i * gridSide);
            this.ctx.lineTo(canvasSide, i * gridSide);
        }
        for (var i = 0; i <= boardSide; i++) {
            this.ctx.moveTo(i * gridSide, 0);
            this.ctx.lineTo(i * gridSide, canvasSide);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawSquares() {
        this.ctx.clearRect(0, 0, canvasSide, canvasSide);
        this.ctx.fillStyle = "#FF0000";
        var boardSide = this.state.boardSide;
        var gridSide = this.state.gridSide;
        for (var j = 0; j < boardSide; j++) {
            var x = j * gridSide;
            for (var k = 0; k < boardSide; k++) {
                if (this.grid[j][k] === 1) {

                    var y = k * gridSide;
                    this.ctx.fillRect(x, y, gridSide, gridSide);
                }
            }

        }
        this.drawGridLines();
    }

    add(e) {
        var cord = this.getCoordinates(e);
        this.grid[Math.floor(cord.x / this.state.gridSide)][Math.floor(cord.y / this.state.gridSide)] = 1;
    }

    getCoordinates(e) {
        var canvas = this.c;
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width;
        var scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        }
    }

    start() {
        this.setState({
            start: true
        });
        this.go();
    }

    changeSpeed(e) {
        this.setState({
            simSpeed: e.target.value
        });
    }

    render() {
        var _this = this;
        return (
            <div id="content">
	            <div id="controls">
	        		<button className="control">Run</button>
	        		<button className="control">Pause</button>
	        		<button className="control">Clear</button>
	        		<div id="generations">
	        			<p>Generation: {this.state.generation}</p>
	        		</div>
	        	</div>
	        	<div id="canvas">
	        		<canvas id="board" width="700" height="700" onClick={(e) => _this.add(e)}></canvas>
	        	</div>
	        	<div id="boardSize">
	        		<div className="tag">
	        			<p>Board Size: </p>
	        		</div>
	        		<input type="range" name="boardSize" min="35" max="175" defaultValue="105" step="35" onInput={(e) => _this.changeGridSides(e)} onChange={(e) => _this.changeGridSides(e)}/>
	        	</div>
	        	<div id="simSpeed">
	        		<div className="tag">
	        			<p>Sim Speed: </p>
	        		</div>
	        		<input type="range" name="simSpeed" min="0" max="500" defaultValue="250" step="50" onInput={(e) => _this.changeSpeed(e)} onChange={(e) => _this.changeSpeed(e)}/>
	        	</div>
            </div>
        )
    }

}

export default Board;
