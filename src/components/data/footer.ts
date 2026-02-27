interface TextType {
  logoAlt: string
  brandName: string
  tagline: string
  copyrightSuffix: string
}

export const text = {
  logoAlt: 'Planning Poker logo',
  brandName: 'Planning Poker',
  tagline: 'Lightweight, real-time Scrum Poker to keep your planning fast and focused.',
  copyrightSuffix: 'Planning Poker. All rights reserved.',
} as const satisfies TextType
