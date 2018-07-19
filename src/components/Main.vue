<template>
  <main>
    <div id = "appContainer">
      <canvas id = "appCanvas">
        <b>Required canvas and javascript enabled to work</b>
      </canvas>
    </div>

    <div class = "buttonContainer">
      <button @click = "settingsOnClick" :disabled = "isGeneratorRunning">
        Settings
      </button>
      <button @click = "generateMazeOnClick" :disabled = "isGeneratorRunning">
        Generate
      </button>
      <button @click = "toggleSolution" :disabled = "isGeneratorRunning">
        <span v-if = "!isShowSolution">Show</span>
        <span v-else>Hide</span>
        Solution
      </button>
      <button :disabled = "isGeneratorRunning" v-if = "settings" @click = "exportAs">
        Export as PNG
      </button>
    </div>
    <Settings ref = "settings"/>

    <sweet-modal icon="error" title="Error" ref = "exportError">
      No maze has been generated !
    </sweet-modal>
  </main>
</template>

<script>
import Generator from '../maze/generator';
import Settings from './Settings';
import Draw from '../maze/draw';

export default {
  methods: {
    settingsOnClick() {
      this.$refs.settings.openModal();
    },

    checkCellAvailable(maze, cell) {
      if(maze.length - 1 <= cell.col) { // Check col
        // Check row

      }
      return false
    },

  isMovableCell({cell}) {
    return cell && !cell.isGeneratorVisited;
  },

    async generateMazeOnClick() {
      // Clear direciton queue
      this.destinationCells = [];

      // Start by generating maze
      const settings = this.settings;
      this.maze = Generator.generateEmptyMaze(settings);

      // Settings
      this.appCanvasContext.globalCompositeOperation = 'copy';
      this.appCanvasContext.lineWidth = 1;
      this.appCanvasContext.strokeStyle = settings.wallColor;

      // Calculate canvas width and height and set it
      const size = (settings.pathWidth + (settings.wallWidth / 2));
      const width = (settings.cols * size);
      const height = (settings.rows * size);
      const initialNode = Generator.generateInitialNode(this.maze, settings);

      this.appCanvas.width = width;
      this.appCanvas.height = height;


      this.isGeneratorRunning = true;

      // Start generating maze : await because recursive and drawing too ...
      let destinationCheckFunc = null
      let processDestinationCellFunc = null

       switch (settings.endPosition) {
        case 'Top':
          destinationCheckFunc = (curCell) => {
            if (curCell.row === 0 &&
            !this.isMovableCell(curCell.NeighBours.Left) &&
            !this.isMovableCell(curCell.NeighBours.Right))
              return true
          }
          processDestinationCellFunc = (curCell) => {
            curCell.Top=true
          }
          break;

        case 'Bottom':
          destinationCheckFunc = (curCell) => {
            if (curCell.row === settings.rows - 1 &&
            !this.isMovableCell(curCell.NeighBours.Left) &&
            !this.isMovableCell(curCell.NeighBours.Right))
              return true
          }
          processDestinationCellFunc = (curCell) => {
            curCell.Bottom=true
          }
          break;

        case 'Right':
          destinationCheckFunc = (curCell) => {
            if (curCell.col === settings.cols - 1 &&
            !this.isMovableCell(curCell.NeighBours.Top) &&
            !this.isMovableCell(curCell.NeighBours.Bottom))
              return true
          }
          processDestinationCellFunc = (curCell) => {
            curCell.Right=true
          }
          break;

        case 'Left':
          destinationCheckFunc = (curCell) => {
            if (curCell.col === 0 &&
            !this.isMovableCell(curCell.NeighBours.Top) &&
            !this.isMovableCell(curCell.NeighBours.Bottom))
              return true
          }
          processDestinationCellFunc = (curCell) => {
            curCell.Left=true
          }
          break;


        default:
          break;
      }

      await Generator.recursiveMazeTravel(this.maze,
        initialNode,
        settings,
        this.appCanvas,
        this.appCanvasContext,
        this.destinationCells,
        destinationCheckFunc,
        processDestinationCellFunc);

      // Mapping solution node
      Generator.generateTargetNode(this.destinationCells);

      // If enable solution then redraw solution node
      if (this.isShowSolution) {
        // Clear all canvas
        Draw.drawDestinationLine(this.appCanvasContext, this.settings, this.destinationCells)
      }

      this.isGeneratorRunning = false;
    },

    toggleSolution() {
      // Toggle solution
      this.isShowSolution = !this.isShowSolution;

      // Redraw solution if maze have been create
      if (this.destinationCells.length > 0) {
        // Clear all canvas


        // Draw.drawCells(this.appCanvas,
        //   this.appCanvasContext,
        //   this.settings,
        //   this.destinationCells,
        //   this.isShowSolution,
        //   this.isGeneratorRunning);
      }
    },

    exportAs() {
      // If maze hasn't been generate
      if (!this.destinationCells.length > 0) {
        this.$refs.exportError.open();
        return;
      }

      let redirectUrl = '';
      const link = document.createElement('a');

      redirectUrl = this.appCanvas.toDataURL('image/png;base64;');
      link.href = redirectUrl;
      link.download = 'Maze.png';

      document.body.appendChild(link);
      link.click();
    },
  },

  computed: {
    settings() {
      return this.$store.state.settings;
    },

    appCanvas() {
      return document.getElementById('appCanvas');
    },

    appCanvasContext() {
      return this.appCanvas.getContext('2d');
    },
  },

  data() {
    return {
      maze: null,
      destinationCells: [],
      isShowSolution: true,
      isGeneratorRunning: false,
    };
  },

  components: {
    Settings,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
html {
  height: 100%;
}

body {
  min-height: 100%;
}

main{
  justify-content: center;
  display:flex
}

#appContainer{
  margin-right: 20px;
  border: 1px solid black;
  display: flex;
  justify-content: flex-start;
  align-items: baseline;
  overflow: auto;
}

#appCanvas{
  margin: 20px;
}

.buttonContainer{
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

button, a{
  background: transparent;
  text-align: left;
  padding: 10px 5px;
  font-size: 1.2em;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

button:hover, a{
  color: #039BE5;
  text-decoration: underline;
  cursor: pointer;
}
</style>
