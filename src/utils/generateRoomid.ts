/**
 * Genereert een 6-cijferige kamer-ID als string, bijv. "345678"
 */
export const generateRoomId = (): string => {
  const id = Math.floor(100000 + Math.random() * 900000)
  return id.toString()
}
