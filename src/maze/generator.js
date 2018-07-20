/* eslint-disable no-param-reassign, one-var, no-await-in-loop */

const Draw = require('./draw').default;
const shuffle = require('shuffle-array');

export default {
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  activeCellFunction() {
    /**
     * Set curCell active
     * Parent disactive if have
     * Then redraw itself and it's parent
     */
    this.isGeneratorActive = true;
  },

  disactiveCellFunction() {
    /**
     * Set curCell disactive
     * Parent disactive if have
     * Then redraw itself and it's parent
     */
    this.isGeneratorActive = false;
  },

  isMovableCell(neighbor) {
    if (!neighbor) return false
    var cell = neighbor.cell
    return cell && !cell.isGeneratorVisited;
  },

  generateInitialNode(maze, settings) {
    let initialNode = null

    switch (settings.startPosition) {
      case 'Top':
        initialNode = maze[0][Math.floor((Math.random() * settings.cols))]
        initialNode.Top = true
        break;

      case 'Bottom':
        initialNode = maze[settings.rows - 1][Math.floor((Math.random() * settings.cols))]
        initialNode.Bottom = true
        break;

      case 'Left':
        initialNode = maze[Math.floor((Math.random() * settings.rows))][0]
        initialNode.Left = true
        break;

      case 'Right':
        initialNode = maze[Math.floor((Math.random() * settings.rows))][settings.cols - 1]
        initialNode.Right = true
        break;


      default:
        break;
    }

    return initialNode;
  },

  getCell(maze, col, row) {
    const mazeCol = maze[col];
    if (mazeCol) { // if exist
      return mazeCol[row]; // maze row can be undefined
    }

    return mazeCol; // undefined column
  },

  generateEmptyMaze(settings) {
    const maze = [];
    for (var i = 0; i < settings.rows; i += 1) {
      const mazeColumn = [];
      for (var j = 0; j < settings.cols; j += 1) {
        const cell = {
          // Debug
          row: i,
          col: j,

          // Check if have wall
          Top: null,
          Bottom: null,
          Left: null,
          Right: null,

          // Track back from target node to root
          parent: null,

          // Utility function
          NeighBours: {
            Right: { position: 'Right', cell: null }, // Index 0
            Left: { position: 'Left', cell: null }, // Index 1
            Bottom: { position: 'Bottom', cell: null },
            Top: { position: 'Top', cell: null },
          },

          // Show animation
          isGeneratorVisited: false,
          isGeneratorActive: false,

          // Draw solution
          isTargetNode: false,

          active: this.activeCellFunction,
          deActive: this.disactiveCellFunction,

          reDraw(canvas, context, drawSettings, drawCell) {
            drawCell(canvas, context, drawSettings, this);
            if (this.parent) {
              drawCell(canvas, context, drawSettings, this.parent);
            }
          },
        };

        mazeColumn.push(cell);
      }
      maze.push(mazeColumn);
    }

    // Generate real left, right bottom index
    for (let i = 0; i < settings.rows; i += 1) {
      for (let j = 0; j < settings.cols; j += 1) {
        var cell = maze[i][j]
        cell.NeighBours.Left.cell = maze[i] ? maze[i][j-1] : null
        cell.NeighBours.Right.cell = maze[i] ? maze[i][j+1] : null
        cell.NeighBours.Top.cell = maze[i - 1] ? maze[i-1][j] : null
        cell.NeighBours.Bottom.cell = maze[i + 1] ? maze[i+1][j] : null
      }
    }

    return maze;
  },

  async recursiveMazeTravel(
    maze,
    curCell,
    settings,
    canvas,
    context,
    destinationCells, // Have noode = already have direction node
    destinationCheckFunc,
    processDestinationCellFunc
  ) {
    // Mark as visited and active
    curCell.isGeneratorVisited = true;

    /**
     * Set curCell active
     * Parent disactive if have
     * Then redraw itself and it's parent
     */
    curCell.active();
    curCell.reDraw(canvas, context, settings, Draw.drawCell.bind(Draw));


    // Chose random direction order, return new array
    // Transform array into object
    // Lop all object in push it into array with variable
    let nextCells = [
      curCell.NeighBours.Left,
      curCell.NeighBours.Right,
      curCell.NeighBours.Top,
      curCell.NeighBours.Bottom
    ]

    // Check for target node
    /**
     * First element reach bottom or top depeneding on settings will be destination node
     */

    if (destinationCells.length === 0 && destinationCheckFunc(curCell)) {
      processDestinationCellFunc(curCell)
      destinationCells.push(curCell)
      curCell.isTargetNode = true
      curCell.reDraw(canvas, context, settings, Draw.drawCell.bind(Draw))
    }

    // Start shuffle
    nextCells = shuffle(nextCells);

    //  Keep moving random neighbor
    while (nextCells.length > 0) {
      const nextCell = nextCells.pop();
      const nextCellValue = nextCell.cell,
        nextPostion = nextCell.position;
      await this.sleep(1);

      if (this.isMovableCell(nextCell)) {
        switch (nextPostion) {
          // Remove current and next move cell border
          /**
          |--------------------------------------------------
          | If move to top : then next cell will have no border bottom and current cell have no border-top
          |--------------------------------------------------
          */
          case 'Top': curCell.Top = true; nextCellValue.Bottom = true; break;
          case 'Bottom': curCell.Bottom = true; nextCellValue.Top = true; break;
          case 'Right': curCell.Right = true; nextCellValue.Left = true; break;
          case 'Left': curCell.Left = true; nextCellValue.Right = true; break;
          default: break;
        }

        nextCellValue.parent = curCell;

        await this.recursiveMazeTravel(
          maze,
          nextCellValue,
          settings,
          canvas,
          context,
          destinationCells,
          destinationCheckFunc,
          processDestinationCellFunc
        );
      }
    }

    /**
     * Set curCell disactive
     * Parent disactive if have
     * Then redraw itself and it's parent
     */
    curCell.deActive();
    curCell.reDraw(canvas, context, settings, Draw.drawCell.bind(Draw));
  },

  generateTargetNode(destinationCells) {
    /**
     * Travel back to root and set isTargetNode to true
     */
    let curCell = destinationCells[0].parent;
    while (curCell) {
      curCell.isTargetNode = true;
      destinationCells.push(curCell);
      curCell = curCell.parent;
    }
  },
};
