class Global {
  static DECK = [9,9,8,8,7,7,6,6,5,5,4,4,3,3,2,2,1,1]
  static CARD_SIZE = 50
  static BOARD_DIM = 6

  /**
   * Shuffles array in place. ES6 version
   * from https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
   * @param {Array} a items An array containing the items.
   */
  static shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  static rmfirstocc(a, v) {
    var found = true;
    var i;
    for (i = 0; i < a.length; i++) {
      if (a[i] === v) {
        found = true;
        break;
      }
    }
    if (found) {
      return a.filter((v, idx) => idx !== i);
    } else return a;
  }

  static coord1d2d(idx, dimx, dimy) {
    return {
      x: idx % dimx,
      y: Math.trunc(idx / dimx),
    };
  }

  static coord2d1d(x, y, dimx, dimy) {
    return y * dimx + x;
  }
}

export default Global
