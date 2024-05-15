class Cell {
  public bomb = false
  public revealed = false
  public flagged = false
  public neighbors = 0

  reveal() {
    this.revealed = true
  }

  flag() {
    this.flagged = true
  }

  unflag() {
    this.flagged = false
  }
}

export default Cell
