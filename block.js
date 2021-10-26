class Block {
  constructor() {
    this.top = this.left = this.right = this.bottom = this.front  = this.back = -1
  }
  rotateL() {
    const tmp = this.front
    this.front = this.top
    this.top = this.back
    this.back = this.bottom
    this.bottom = tmp
  }
  rotateR() {
    const tmp = this.front
    this.front = this.bottom
    this.bottom = this.back
    this.back = this.top
    this.top = tmp

  }
  rotateU() {
    const tmp = this.front
    this.front = this.right
    this.right = this.back
    this.back = this.left
    this.left = tmp
  }
  rotateD() {
    const tmp = this.front
    this.front = this.left
    this.left = this.back
    this.back = this.right
    this.right = tmp
  }
  rotateB() {
    const tmp = this.top
    this.top = this.right
    this.right = this.bottom
    this.bottom = this.left
    this.left = tmp
  }
  rotateF() {
    const tmp = this.top
    this.top = this.left
    this.left = this.bottom
    this.bottom = this.right
    this.right = tmp
  }
  setColor(face, color) {
    this[face] = color
  }
  getAllColor() {
    return [this.top, this.right, this.bottom, this.left, this.front, this.back]
  }
  getColor(face) {
    return this[face]
  }
}

module.exports = Block
