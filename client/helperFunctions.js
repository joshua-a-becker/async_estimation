export function chunkSubstr(str, size) {
  const numChunks = Math.ceil(str.length / size)
  const chunks = new Array(numChunks)

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size)
  }

  return chunks
}

export function addBreaksToString(_string, chunkSize) {
  const split_string = _string.split(" ")

  const chunks_array = split_string.reduce((acc, _chunk) => {
    if (_chunk.length > chunkSize) {
      return [...acc, chunkSubstr(_chunk, chunkSize).join("\n")]
    }
    return [...acc, _chunk]
  }, [])

  return chunks_array.join(" ")
}
