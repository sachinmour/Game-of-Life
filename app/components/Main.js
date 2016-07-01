import React from "react";

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            grid: Array(400).fill(Array(400).fill(0))
        };
    }

    componentDidMount() {
        var _this = this;
        var copyGrid = Array(400).fill(Array(400).fill(0));
        for (var j = 0; j < 400; j++) { //iterate through rows
            for (var k = 0; k < 400; k++) { //iterate through columns
                var rawRandom = Math.random(); //get a raw random number
                var improvedNum = (rawRandom * 2); //convert it to an int
                var randomBinary = Math.floor(improvedNum);
                if (randomBinary === 1) {
                    copyGrid[j][k] = 1;
                } else {
                    copyGrid[j][k] = 0;
                }
            }
        }
        this.setState({
            grid: copyGrid
        });
        this.update(copyGrid);
    }

    update(grid) {
        var _this = this;
        var c = document.getElementById('board');
        var ctx = c.getContext('2d');
        ctx.clearRect(0, 0, 400, 400);
        for (var j = 1; j < 400; j++) { //iterate through rows

            for (var k = 1; k < 400; k++) { //iterate through columns
                if (grid[j][k] === 1) {

                    ctx.fillStyle = "#FF0000";

                    ctx.fillRect(j, k, 1, 1);

                }

            }

        }
    }

    render() {
        return (
            <canvas id="board" width="400" height="400"></canvas>
        )
    }

}

export default Board;
