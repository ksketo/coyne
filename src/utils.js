const mod = (n, m) => {
  return ((n % m) + m) % m
}

const range = (start, end) => {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

module.exports = {
  mod, range
}
