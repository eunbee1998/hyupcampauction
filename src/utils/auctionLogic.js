
export function parseCardFileName(filename) {
  const [num, name, positionWithExt] = filename.split("_");
  const position = positionWithExt.replace('.png', '').toUpperCase();
  return { number: num, name, position };
}
