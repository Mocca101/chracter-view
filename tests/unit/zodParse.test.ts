import { zBaseCheck } from "../../src/types/zod/zodSchemas";
import { expect, test } from "vitest";
import { parse as parseYaml } from "yaml";

test('parse a base check', () => {

    const testCheckYaml = `
    Test Check:
        stat: strength
        dice: 1d20
        proficiencyState: 0
    `;


    const check = zBaseCheck.parse(
        parseYaml(testCheckYaml)
    );
    
    expect(check).toEqual({
        "Test Check": {
            stat: "strength",
            dice: {
                diceType: 20,
                quantity: 1,
                modifier: undefined,
            },
            proficiencyState: 0,
        }
    });
});
