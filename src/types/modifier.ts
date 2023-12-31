import { type Stat } from "./stats"

export default interface ModifierCalc {
  (this:Stat): number
}
