// Conway's Game of Life implementation
class GameOfLife {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.cellSize = 12;
        this.cols = 0;
        this.rows = 0;
        this.grid = [];
        this.nextGrid = [];
        this.cellColors = []; // Store colors for each cell
        this.isRunning = true;
        this.frameCount = 0;
        this.updateInterval = 8; // Update every 8 frames for slower evolution
        
        // Track container boundaries for masking
        this.containerBounds = null;
        this.updateContainerBounds();
        
        // Color palette for cells - from Color Hunt
        // https://colorhunt.co/palette/8f87f1c68efde9a5f1fed2e2
        // Purple-pink gradient palette
        this.colors = [
            '#8F87F1', // lavender purple
            '#C68EFD', // light purple
            '#E9A5F1', // pink magenta
            '#FED2E2', // light pink
            '#7B6FE8', // darker purple (variation)
            '#B47BF5', // medium purple (variation)
            '#DF8FE8', // medium magenta (variation)
            '#FCBDD3', // rose pink (variation)
            '#6A5FD8', // deep purple (variation)
            '#A568E5', // vibrant purple (variation)
        ];
        
        // Mouse interaction
        this.mouseX = -1;
        this.mouseY = -1;
        this.isMouseDown = false;
        this.brushSize = 2; // Size of the brush for activating cells
        
        this.setupCanvas();
        this.initializeGrid();
        this.setupEventListeners();
        this.animate();
    }
    
    updateContainerBounds() {
        const container = document.querySelector('.container');
        if (container) {
            const rect = container.getBoundingClientRect();
            this.containerBounds = {
                left: rect.left,
                right: rect.right,
                top: rect.top,
                bottom: rect.bottom
            };
        }
    }
    
    setupCanvas() {
        const resize = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.cols = Math.floor(this.canvas.width / this.cellSize);
            this.rows = Math.floor(this.canvas.height / this.cellSize);
            
            // Update container bounds on resize
            this.updateContainerBounds();
            
            // Reinitialize grid on resize
            if (this.grid.length === 0) {
                this.initializeGrid();
            } else {
                this.resizeGrid();
            }
        };
        
        resize();
        window.addEventListener('resize', resize);
        window.addEventListener('scroll', () => this.updateContainerBounds());
    }
    
    initializeGrid() {
        this.grid = [];
        this.nextGrid = [];
        this.cellColors = [];
        
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            this.cellColors[i] = [];
            for (let j = 0; j < this.cols; j++) {
                // Start with mostly empty grid
                this.grid[i][j] = 0;
                this.nextGrid[i][j] = 0;
                this.cellColors[i][j] = this.getRandomColor();
            }
        }
        
        // Add just a few small interesting patterns to start
        // These will slowly expand and create more complex structures
        
        // Add a few gliders in different locations
        this.addGlider(8, 8);
        this.addGlider(this.rows - 20, this.cols - 20);
        this.addGlider(15, this.cols - 30);
        
        // Add a small r-pentomino (very active pattern that expands)
        this.addRPentomino(Math.floor(this.rows / 2), Math.floor(this.cols / 4));
        
        // Add another r-pentomino on the other side
        this.addRPentomino(Math.floor(this.rows / 3), Math.floor(3 * this.cols / 4));
        
        // Add a few random scattered cells for variety (very sparse)
        for (let i = 0; i < 15; i++) {
            const row = Math.floor(Math.random() * this.rows);
            const col = Math.floor(Math.random() * this.cols);
            this.grid[row][col] = 1;
        }
    }
    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }
    
    resizeGrid() {
        const oldGrid = this.grid;
        const oldColors = this.cellColors;
        const oldRows = oldGrid.length;
        const oldCols = oldGrid[0] ? oldGrid[0].length : 0;
        
        this.grid = [];
        this.nextGrid = [];
        this.cellColors = [];
        
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            this.cellColors[i] = [];
            for (let j = 0; j < this.cols; j++) {
                if (i < oldRows && j < oldCols) {
                    this.grid[i][j] = oldGrid[i][j];
                    this.cellColors[i][j] = oldColors[i][j];
                } else {
                    this.grid[i][j] = 0;
                    this.cellColors[i][j] = this.getRandomColor();
                }
                this.nextGrid[i][j] = 0;
            }
        }
    }
    
    // Add a glider pattern
    addGlider(row, col) {
        const pattern = [
            [0, 1, 0],
            [0, 0, 1],
            [1, 1, 1]
        ];
        
        this.addPattern(pattern, row, col);
    }
    
    // Add an R-pentomino pattern (expands into complex structures)
    addRPentomino(row, col) {
        const pattern = [
            [0, 1, 1],
            [1, 1, 0],
            [0, 1, 0]
        ];
        
        this.addPattern(pattern, row, col);
    }
    
    // Add a pulsar pattern
    addPulsar(row, col) {
        const pattern = [
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [1,0,0,0,0,1,0,1,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,0,0,0,1,1,1,0,0]
        ];
        
        this.addPattern(pattern, row, col);
    }
    
    addPattern(pattern, startRow, startCol) {
        for (let i = 0; i < pattern.length; i++) {
            for (let j = 0; j < pattern[i].length; j++) {
                const row = startRow + i;
                const col = startCol + j;
                if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
                    this.grid[row][col] = pattern[i][j];
                }
            }
        }
    }
    
    setupEventListeners() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = e.clientX - rect.left;
            this.mouseY = e.clientY - rect.top;
            
            if (this.isMouseDown) {
                this.activateCellsAtMouse();
            }
        });
        
        this.canvas.addEventListener('mousedown', (e) => {
            this.isMouseDown = true;
            this.activateCellsAtMouse();
        });
        
        this.canvas.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            this.mouseX = -1;
            this.mouseY = -1;
        });
        
        // Mobile touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.isMouseDown = true;
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            this.activateCellsAtMouse();
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouseX = touch.clientX - rect.left;
            this.mouseY = touch.clientY - rect.top;
            if (this.isMouseDown) {
                this.activateCellsAtMouse();
            }
        });
        
        this.canvas.addEventListener('touchend', () => {
            this.isMouseDown = false;
        });
    }
    
    activateCellsAtMouse() {
        if (this.mouseX < 0 || this.mouseY < 0) return;
        
        const col = Math.floor(this.mouseX / this.cellSize);
        const row = Math.floor(this.mouseY / this.cellSize);
        
        // Activate cells in a brush area
        for (let i = -this.brushSize; i <= this.brushSize; i++) {
            for (let j = -this.brushSize; j <= this.brushSize; j++) {
                const r = row + i;
                const c = col + j;
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    // Create interesting patterns when clicking
                    if (Math.abs(i) + Math.abs(j) <= this.brushSize) {
                        this.grid[r][c] = 1;
                        this.cellColors[r][c] = this.getRandomColor();
                    }
                }
            }
        }
    }
    
    isInsideContainer(row, col) {
        if (!this.containerBounds) return false;
        
        const x = col * this.cellSize;
        const y = row * this.cellSize;
        const cellRight = x + this.cellSize;
        const cellBottom = y + this.cellSize;
        
        // Add a buffer zone around the container (2 cells worth)
        const buffer = this.cellSize * 2;
        
        // Check if cell is inside or near container (with buffer)
        return (x >= this.containerBounds.left - buffer && 
                cellRight <= this.containerBounds.right + buffer &&
                y >= this.containerBounds.top - buffer && 
                cellBottom <= this.containerBounds.bottom + buffer);
    }
    
    countNeighbors(row, col) {
        let count = 0;
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const r = row + i;
                const c = col + j;
                
                // Check boundaries - treat edges and container area as dead cells
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    // Treat cells inside container as always dead
                    if (!this.isInsideContainer(r, c)) {
                        count += this.grid[r][c];
                    }
                }
            }
        }
        
        return count;
    }
    
    update() {
        // Apply Conway's Game of Life rules
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                // Kill any cells inside the container area
                if (this.isInsideContainer(i, j)) {
                    this.nextGrid[i][j] = 0;
                    continue;
                }
                
                const neighbors = this.countNeighbors(i, j);
                const cell = this.grid[i][j];
                
                if (cell === 1) {
                    // Cell is alive
                    if (neighbors < 2 || neighbors > 3) {
                        this.nextGrid[i][j] = 0; // Dies
                    } else {
                        this.nextGrid[i][j] = 1; // Survives
                    }
                } else {
                    // Cell is dead
                    if (neighbors === 3) {
                        this.nextGrid[i][j] = 1; // Birth
                        // New cells inherit a random color from neighbors
                        this.cellColors[i][j] = this.getNeighborColor(i, j);
                    } else {
                        this.nextGrid[i][j] = 0; // Stays dead
                    }
                }
            }
        }
        
        // Swap grids
        [this.grid, this.nextGrid] = [this.nextGrid, this.grid];
    }
    
    getNeighborColor(row, col) {
        // Get a random color from living neighbors
        const neighborColors = [];
        
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                if (i === 0 && j === 0) continue;
                
                const r = row + i;
                const c = col + j;
                
                // Check boundaries - no wrap-around
                if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) {
                    if (this.grid[r][c] === 1) {
                        neighborColors.push(this.cellColors[r][c]);
                    }
                }
            }
        }
        
        if (neighborColors.length > 0) {
            return neighborColors[Math.floor(Math.random() * neighborColors.length)];
        }
        
        return this.getRandomColor();
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw cells with colors, but skip cells inside or near container
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] === 1 && !this.isInsideContainer(i, j)) {
                    const x = j * this.cellSize;
                    const y = i * this.cellSize;
                    
                    this.ctx.fillStyle = this.cellColors[i][j];
                    this.ctx.fillRect(
                        x,
                        y,
                        this.cellSize - 1,
                        this.cellSize - 1
                    );
                }
            }
        }
        
        // No hover indicator - removed for cleaner look
    }
    
    animate() {
        if (this.isRunning) {
            this.frameCount++;
            
            // Update game state at slower interval
            if (this.frameCount % this.updateInterval === 0) {
                this.update();
            }
            
            this.draw();
        }
        
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Game of Life when page loads
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameOfLife');
    if (canvas) {
        new GameOfLife(canvas);
        console.log('🧬 Conway\'s Game of Life is running! Hover and click to create new cells.');
    }
});

