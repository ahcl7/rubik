const {COLORS} = require('./utils')
const _ = require('lodash')
const Block = require('./block')
String.prototype.replaceAt = function (index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

class Rubik {
  constructor() {
    this.blocks = _.range(3).map(i => _.range(3).map(j => _.range(3).map(k => new Block())))
    this.fillFaceColor('top', COLORS.white)
    this.fillFaceColor('right', COLORS.red)
    this.fillFaceColor('bottom', COLORS.yellow)
    this.fillFaceColor('left', COLORS.orange)
    this.fillFaceColor('front', COLORS.green)
    this.fillFaceColor('back', COLORS.blue)
  }

  fillFaceColor(face, color) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let x, y, z
        switch (face) {
          case 'top': {
            [x, y, z] = [0, i, j]
            break;
          }
          case 'right': {
            [x, y, z] = [i, j, 2]
            break;
          }
          case 'bottom': {
            [x, y, z] = [2, i, j]
            break;
          }
          case 'left': {
            [x, y, z] = [i, j, 0]
            break;
          }
          case 'front': {
            [x, y, z] = [i, 0, j]
            break;
          }
          case 'back': {
            [x, y, z] = [i, 2, j]
            break;
          }
        }
        this.blocks[x][y][z].setColor(face, color)
      }
    }
  }

  rotate(orientation, layer, direction) { //orientation: horizontal, vertical; layer: 0, 1, 2; direction: -1: left/up/cw, 1: right/down/ccw
    const rotatedBlocks = _.range(3).map(i => _.range(3))
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let x, y
        if (direction === -1) [x, y] = [j, 2 - i]
        else [x, y] = [2 - j, i]
        switch (orientation) {
          case 'x': {
            rotatedBlocks[x][y] = this.blocks[layer][i][j]
            break;
          }
          case 'z': {
            rotatedBlocks[x][y] = this.blocks[i][j][layer]
            break;
          }
          case 'y': {
            rotatedBlocks[x][y] = this.blocks[i][layer][j]
            break;
          }
        }
      }
    }
    switch (orientation) {
      case 'x': {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.blocks[layer][i][j] = rotatedBlocks[i][j]
            if (direction === -1) this.blocks[layer][i][j].rotateD()
            else this.blocks[layer][i][j].rotateU()
          }
        }
        break;
      }
      case 'z': {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.blocks[i][j][layer] = rotatedBlocks[i][j]
            if (direction === -1) this.blocks[i][j][layer].rotateR()
            else this.blocks[i][j][layer].rotateL()
          }
        }
        break;
      }
      case 'y': {
        for (let i = 0; i < 3; i++) {
          for (let j = 0; j < 3; j++) {
            this.blocks[i][layer][j] = rotatedBlocks[i][j]
            if (direction === -1) this.blocks[i][layer][j].rotateF()
            else this.blocks[i][layer][j].rotateB()
          }
        }
        break;
      }
    }
  }

  getFaceColors(face) {
    const rs = []
    for (let i = 0; i < 3; i++) {
      let row = ''
      for (let j = 0; j < 3; j++) {
        let x, y, z
        switch (face) {
          case 'top': {
            [x, y, z] = [0, i, j]
            break;
          }
          case 'right': {
            [x, y, z] = [i, j, 2]
            break;
          }
          case 'bottom': {
            [x, y, z] = [2, i, j]
            break;
          }
          case 'left': {
            [x, y, z] = [i, j, 0]
            break;
          }
          case 'front': {
            [x, y, z] = [i, 0, j]
            break;
          }
          case 'back': {
            [x, y, z] = [i, 2, j]
            break;
          }
        }
        switch (this.blocks[x][y][z].getColor(face)) {
          case COLORS.white:
            row += 'w';
            break;
          case COLORS.yellow:
            row += 'y';
            break;
          case COLORS.green:
            row += 'g';
            break;
          case COLORS.blue:
            row += 'b';
            break;
          case COLORS.orange:
            row += 'o';
            break;
          case COLORS.red:
            row += 'r';
            break;
        }
      }
      rs.push(row)
    }
    return rs
  }

  rotateU(direction) {
    this.rotate('x', 0, direction)
  }

  rotateD(direction) {
    this.rotate('x', 2, direction)
  }

  rotateR(direction) {
    this.rotate('z', 2, direction)
  }

  rotateL(direction) {
    this.rotate('z', 0, direction)
  }

  rotateF(direction) {
    this.rotate('y', 0, direction)
  }

  rotateB(direction) {
    this.rotate('y', 2, direction)
  }

  shuffleByScramble(scramble) {
    const moves = scramble.split(' ').map(move => {
      if (move.length === 1) {
        return {type: move[0], direction: 1}
      } else {
        if (move[1] === '2') {
          return {type: move[0], direction: 2}
        } else return {type: move[0], direction: -1}
      }
    })
    for (const {type, direction} of moves) {
      if (direction === 2) {
        this[`rotate${type}`](1)
        this[`rotate${type}`](1) //rotate twice
      } else {
        switch (type) {
          case 'D':
          case 'R':
          case 'F':
            this[`rotate${type}`](-1 * direction);
            break;
          case 'U':
          case 'L':
          case 'B':
            this[`rotate${type}`](direction);
            break;
        }
      }
    }
  }

  display() {
    const topFace = this.getFaceColors('top')
    const rightFace = this.getFaceColors('right')
    const bottomFace = this.getFaceColors('bottom')
    const leftFace = this.getFaceColors('left')
    const frontFace = this.getFaceColors('front')
    const backFace = this.getFaceColors('back')
    const rs = _.range(12).map(i => '                ')

    function assignColors(colors, top, left) {
      for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors[i].length; j++) {
          rs[i + top] = rs[i + top].replaceAt(j + left, colors[i][j])
        }
      }
    }

    function mapping(a, fx, fy) {
      const rs = _.cloneDeep(a)
      for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
          rs[fx(i)] = rs[fx(i)].replaceAt(fy(j), a[i][j])
        }
      }
      return rs
    }

    assignColors(mapping(topFace, x => 2 - x, y => y), 0, 4)
    assignColors(mapping(leftFace, x => x, y => 2 - y), 4, 0)
    assignColors(frontFace, 4, 4)
    assignColors(rightFace, 4, 8)
    assignColors(mapping(backFace, x => x, y => 2 - y), 4, 12)
    assignColors(bottomFace, 8, 4)
    if (process.env.NODE_ENV === 'test') console.log(rs)
    else for (const row of rs) console.log(row)
  }
}

module.exports = Rubik
