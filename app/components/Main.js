import React from "react";
var canvasSide = 800;

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            boardSide: 125,
            gridSide: 800 / 125,
            start: true,
            simSpeed: 250,
            generation: 0
        };
        this.grid;
        this.copyGrid;
        this.ctx;
        this.c;
        this.frame;
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
        if (_this.state.start) {
            setTimeout(function() {
                _this.setState({
                    generation: _this.state.generation + 1
                });
                _this.drawSquares();
                _this.updateGrid();
                _this.frame = requestAnimationFrame(_this.go.bind(_this));
            }, 500 - _this.state.simSpeed);
        } else {
            cancelAnimationFrame(_this.frame);
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
            this.go();
        }
    }

    randomStart(boardSide) {
        for (var j = 0; j < boardSide; j++) {
            for (var k = 0; k < boardSide; k++) {
                this.grid[j][k] = Math.floor((Math.random() * 2));
            }
        }
    }

    changeGridSides(e) {
        this.pause();
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
            });
            _this.randomStart(boardSide);
            _this.drawSquares();
            _this.updateGrid();
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
        var gridSide = this.state.gridSide;
        var x = Math.floor(cord.x / gridSide);
        var y = Math.floor(cord.y / gridSide);
        this.grid[x][y] = 1;
        this.ctx.fillRect(x * gridSide, y * gridSide, gridSide, gridSide);
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

    clear() {
        var boardSide = this.state.boardSide;
        this.setState({
            generation: 0
        });
        this.pause();
        this.ctx.clearRect(0, 0, canvasSide, canvasSide);
        this.drawGridLines();
        for (var j = 0; j < boardSide; j++) {
            for (var k = 0; k < boardSide; k++) {
                this.grid[j][k] = 0;
            }
        }
    }

    start() {
        var _this = this;
        this.setState({
            start: true
        }, function() {
            _this.go();
        });
    }

    pause() {
        this.setState({
            start: false
        });
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
	        		<button className="control" onClick={(e) => this.start()}>Run</button>
	        		<button className="control" onClick={(e) => this.pause()}>Pause</button>
	        		<button className="control" onClick={(e) => this.clear()}>Clear</button>
	        		<div id="generations">
	        			<p>Generation: {this.state.generation}</p>
	        		</div>
	        	</div>
	        	<div id="canvas">
	        		<canvas id="board" width="800" height="800" onClick={(e) => _this.add(e)}></canvas>
	        	</div>
	        	<div id="boardSize">
	        		<div className="tag">
	        			<p>Board Size: </p>
	        		</div>
	        		<input type="range" name="boardSize" min="50" max="200" defaultValue="125" step="25" onInput={(e) => _this.changeGridSides(e)} onChange={(e) => _this.changeGridSides(e)}/>
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
