/**
 * Generates a 6-digit room ID as a string, e.g. "345678"
 */
export const generateRoomId = (): string => {
  const id = Math.floor(100000 + Math.random() * 900000)
  return id.toString()
}
