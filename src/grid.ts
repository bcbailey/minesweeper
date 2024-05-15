import Cell from './cell'

class Grid {
  public rows: number
  public cols: number
  public bombs: number
  public cells: Cell[][] = [ ]

  constructor(rows: number, cols: number, bombs: number = 0) {
    this.rows = rows
    this.cols = cols
    this.bombs = bombs || Math.floor(rows * cols * .15)

    this.createCells()
    this.placeBombs()
    this.calculateNeighbors()
  }

  cell(x: number, y: number) {
    return this.cells[y] && this.cells[y][x]
  }

  createCells() {
    const { rows, cols } = this
    const cells: Cell[][] = [ ]

    for (let y = 0; y < rows; y++) {
      cells[y] = [ ]
      for (let x = 0; x < cols; x++) {
        cells[y][x] = new Cell()
      }
    }

    this.cells = cells
  }

  placeBombs(num: number = this.bombs) {
    if (num > this.rows * this.cols) {
      throw new Error('Too many bombs')
    }

    let placed = 0
    while (placed < num) {
      let y = Math.floor(Math.random() * this.rows)
      let x = Math.floor(Math.random() * this.cols)
      let cell = this.cell(x, y)

      if (!cell || cell.bomb) {
        continue
      }

      cell.bomb = true
      placed++
    }
  }

  calculateNeighbors() {
    const { rows, cols } = this

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        let cell = this.cell(x, y)
        let count = 0

        for (let yoff = -1; yoff <= 1; yoff++) {
          for (let xoff = -1; xoff <= 1; xoff++) {
            let cy = y + yoff
            let cx = x + xoff

            // Ignore self or out of range
            if (
              (xoff === 0 && yoff == 0) ||
              (
                cx < 0 || cx >= this.cols ||
                cy < 0 || cy >= this.rows
              )
            ) continue

            if (this.cell(cx, cy)?.bomb) {
              count++
            }
          }
        }

        cell.neighbors = count
      }
    }
  }

  reveal(x: number, y: number) {
    let cell = this.cell(x, y)
    if (!cell) return

    // If it is a bomb, game over, reveal everything
    if (cell.bomb) {
      this.gameOver()
      return
    }

    // Reveal the cell, and if it isnt empty return
    cell.reveal()
    if (cell.neighbors !== 0) return

    // Reveal the surrounding cells
    for (let yoff = -1; yoff <= 1; yoff++) {
      for (let xoff = -1; xoff <= 1; xoff++) {
        let cx = x + xoff
        let cy = y + yoff
        let cell = this.cell(cx, cy)
        if (cell && !cell.revealed && !cell.flagged && !cell.bomb) {
          this.reveal(cx, cy)
        }
      }
    }
  }

  revealAll() {
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        this.cell(x, y).reveal()
      }
    }
  }

  flag(x: number, y: number) {
    const cell = this.cell(x, y)
    if (cell && !cell.revealed) {
      cell.flag()
    }
  }

  unflag(x: number, y: number) {
    const cell = this.cell(x, y)
    if (cell && !cell.revealed) {
      cell.unflag()
    }
  }

  numFlagged() {
    return this.cells.flat().filter(c => c.flagged).length
  }

  gameOver() {
    this.revealAll()
  }

  isGameover() {
    return this.cells.flat().every(c => c.revealed || c.flagged || c.bomb)
  }

  isWon() {
    return !this.cells.flat().some(c => c.bomb === c.revealed)
  }
}

export default Grid
