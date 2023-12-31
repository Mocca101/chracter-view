export default interface DiceCombo {
  diceType: number;
  quantity: number;
  modifier?: number;
}

export interface HitDice {
  dice: DiceCombo;
  used: number;
}
