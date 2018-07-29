<template>
  <main>
    <div class = "buttonContainer mr">
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

    <div id = "appContainer" :style="{height: height+35+'px'}">
      <canvas id = "appCanvas">
        <b>Required canvas and javascript enabled to work</b>
      </canvas>
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
      const size = (settings.pathWidth + 1);
      this.width = (settings.cols * size);
      this.height = (settings.rows * size);
      const initialNode = Generator.generateInitialNode(this.maze, settings);
      this.appCanvas.width = this.width;
      this.appCanvas.height = this.height;


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
      if (this.isShowSolution) {
        Draw.drawDestinationLine(this.appCanvasContext, this.settings, this.destinationCells)
      } else {
        // Clear all canvas


        Draw.drawCells(this.appCanvas,
          this.appCanvasContext,
          this.settings,
          this.destinationCells,
          this.isShowSolution,
          this.isGeneratorRunning);
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
      destinationCells: [],
      isShowSolution: true,
      isGeneratorRunning: false,
      width: 300,
      height: 300
    };
  },

  mounted() {
    this.generateMazeOnClick()
  },

  components: {
    Settings,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.d-flex {
  display: flex
}
.mr {
  margin-right: 20px
}

html {
  height: 100%;
}

body {
  min-height: 100%;
}

main{
  justify-content: center;
  overflow: auto;
}

#appContainer{
  display: flex;
  justify-content: center;
}

#appCanvas{
  margin: 20px;
}

.buttonContainer{
  display: inline-block;
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
