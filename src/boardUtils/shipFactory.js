class Ship {
  constructor (size, name) {
    this.name = name;
    this.size = size;
    this.life = size;
    this.position = [];
  };
};

module.exports = {
  Ship,
}
