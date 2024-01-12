export type Personality = {
  generalPersonality: string;
  personalityTraits: personalityTrait[];
}

export type personalityTrait = {
  name: string;
  text: string;
}

