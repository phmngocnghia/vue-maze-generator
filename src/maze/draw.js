/* eslint-disable no-param-reassign, brace-style */

export default {
  drawTopRetangle(context, x, y, length) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length, y);
    context.stroke();
    context.closePath();
  },

  drawLeftRetangle(context, x, y, length) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y + length);
    context.stroke();
    context.closePath();
  },

  drawBottomRangle(context, x, y, length) {
    context.beginPath();
    context.moveTo(x, y + length);
    context.lineTo(x + length, y + length);
    context.stroke();
    context.closePath();
  },

  drawRightRetangle(context, x, y, length) {
    context.beginPath();
    context.moveTo(x + length, y);
    context.lineTo(x + length, y + length);
    context.stroke();
    context.closePath();
  },

  drawLine(context, x, y, xEnd, yEnd) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(xEnd, yEnd);
    context.stroke();
    context.closePath();
  },

  getCenterToBorderLeft(context, x, y, length) {
    return {
      x: x - parseInt(length / 2),
      y: y
    }
  },

  getCenterToBorderRight(context, x, y, length) {
    return {
      x: x + parseInt(length / 2),
      y: y
    }
  },

  getCenterToBorderTop(context, x, y, length) {
    return {
      x: x,
      y: y - parseInt(length / 2)
    }
  },

  getCenterToBorderBottom(context, x, y, length) {
    return {
      x: x,
      y: y + parseInt(length / 2)
    }
  },

  drawAllCell(maze, settings, canvas, context) {
    for (let i = 0; i < settings.cols; i += 1) {
      for (let j = 0; j < settings.rows; j += 1) {
        this.drawCell(
          canvas,
          context,
          settings,
          maze[i][j],
        );
      }
    }
  },

  drawCells(
    canvas,
    context,
    settings,
    cells,
    isShowSolution,
  ) {
    cells.forEach((elem) => {
      this.drawCell(canvas, context, settings, elem, isShowSolution);
    });
  },

  drawCell(
    canvas,
    context,
    settings,
    curCell,
    isShowSolution,
  ) {
    // Start drawing
    // Loop col
    let x = curCell.col * (settings.pathWidth) + 1
    let y = curCell.row * (settings.pathWidth) + 1
    x = x === 0 ? 1 : x
    y = y === 0 ? 1 : y
    let shouldDrawSolution = false;

    // is it current active
    if (curCell.isGeneratorActive) {
      context.fillStyle = settings.activePathColor;
    }

    // else if have been visited

    // else use default path color
    else {
      context.fillStyle = settings.visitedPathColor;
    }

    // Clear rect before draw stroke: can't make stroke overlay


    // draw wall
    // Color will be draw when it doesn't have any neightbor
    const notWallColor = shouldDrawSolution ? 'white' : 'white'; // Is solution node are not

    // Color will be draw
    this.wallColorPicker(context,
      !curCell.Top,
      settings.wallColor,
      notWallColor);

    this.drawTopRetangle(context,
      x,
      y,
      settings.pathWidth);


    this.wallColorPicker(context,
      !curCell.Left,
      settings.wallColor,
      notWallColor);

    this.drawLeftRetangle(context,
      x,
      y,
      settings.pathWidth);

    this.wallColorPicker(context,
      !curCell.Bottom,
      settings.wallColor,
      notWallColor);

    this.drawBottomRangle(context,
      x,
      y,
      settings.pathWidth);

    this.wallColorPicker(context,
      !curCell.Right,
      settings.wallColor,
      notWallColor);

    this.drawRightRetangle(context,
      x,
      y,
      settings.pathWidth);

    context.fillRect(
      x,
      y,
      settings.pathWidth,
      settings.pathWidth);
  },

  wallColorPicker(
    context,
    condition,
    wallColor,
    notWallColor
  ) {
    if (condition) {
      context.strokeStyle = wallColor;
    } else {
      context.strokeStyle = notWallColor
    }
  },

  clearDestinationLine(context, settings, destinationCells) {
    for (cell of destinationCells) {
      var x = cell.col * (settings.pathWidth);
      var y = cell.row * (settings.pathWidth);
      context.clearRect(x, y, settings.pathWidth, settings.pathWidth)
    }
  },

  drawDestinationLine(context, settings, destinationCells) {
    context.strokeStyle = settings.solutionColor
    for (let i = 0; i < destinationCells.length - 1; i++) {
      let lineStart = this.getCenterPoint(destinationCells[i], settings.pathWidth)
      let lineEnd = this.getCenterPoint(destinationCells[i + 1], settings.pathWidth)
      this.drawLine(context, lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
    }

    /**
    |--------------------------------------------------
    | Start position
    |--------------------------------------------------
    */
   this.drawLineBetweenCenterPointAndDirectedBorder(
     context,
     destinationCells[0],
     settings.pathWidth,
     settings.endPosition
   )

    /**
    |--------------------------------------------------
    | End position
    |--------------------------------------------------
    */
   this.drawLineBetweenCenterPointAndDirectedBorder(
    context,
    destinationCells[destinationCells.length-1],
    settings.pathWidth,
    settings.startPosition
   )
  },

  drawLineBetweenCenterPointAndDirectedBorder(context, cell, length, direction) {
    let start = this.getCenterPoint(cell, length)
    let startX = start.x
    let startY = start.y
    let end = null
    switch (direction) {
      case 'Top':
        end = this.getCenterToBorderTop(context, startX, startY, length)
        break;
      case 'Bottom':
        end = this.getCenterToBorderBottom(context, startX, startY, length)
        break;
      case 'Left':
        end = this.getCenterToBorderLeft(context, startX, startY, length)
        break;
      case 'Right':
        end = this.getCenterToBorderRight(context, startX, startY, length)
        break;

      default:
        break;
    }
    this.drawLine(context, start.x, start.y, end.x, end.y);
  },

  getCenterPoint(cell, pathWidth) {
    var x = cell.col * pathWidth;
    var y = cell.row * pathWidth;
    var xEnd = x + 2 + pathWidth
    var yEnd = y + 2 + pathWidth
    return {
      x: parseInt((x + xEnd) / 2),
      y: parseInt((y + yEnd) / 2)
    }
  }
};
