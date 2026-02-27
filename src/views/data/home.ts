interface TextType {
  headingLight: string
  headingBold: string
  description: string
}

export const text = {
  headingLight: 'Free Online',
  headingBold: 'Scrum Poker tool',
  description:
    'Estimate stories with a clean, distraction\u2011free interface. Create a room in seconds, invite your team, and vote in real time.',
} as const satisfies TextType
