import { ElectronApplication, Page, _electron as electron } from 'playwright'
import { test, expect } from 'playwright/test'
import 'dotenv/config'
import { BaseStats } from '../src/data/BaseStats';
import { DnDBaseSkills } from '../src/data/BaseSkills';
import { kuiniString } from './testUtils';

const pathToVault = process.env.TO_VAULT;
const pathToExe = process.env.TO_EXE;

const kuiniStats = [
  '20  Str +5',
  '9  Dex -1',
  '15  Con +2',
  '4  Int -3',
  '15  Wis +2',
  '18  Cha +4'
]

const kuiniSkillsObj = [
  {
    name: 'Acrobatics',
    stat: 'Dex',
    proficient: false,
    expectedValue: -1
  },
  {
    name: 'Animal Handling',
    stat: 'Wis',
    proficient: true,
    expectedValue: 2
  },
  {
    name: 'Arcana',
    stat: 'Int',
    proficient: false,
    expectedValue: -3
  },
  {
    name: 'Athletics',
    stat: 'Str',
    proficient: true,
    expectedValue: 5
  },
  {
    name: 'Deception',
    stat: 'Cha',
    proficient: true,
    expectedValue: 4
  },
  {
    name: 'History',
    stat: 'Int',
    proficient: false,
    expectedValue: -3
  },
  {
    name: 'Insight',
    stat: 'Wis',
    proficient: true,
    expectedValue: 2
  },
  {
    name: 'Intimidation',
    stat: 'Cha',
    proficient: true,
    expectedValue: 4
  },
  {
    name: 'Investigation',
    stat: 'Int',
    proficient: false,
    expectedValue: -3
  },
  {
    name: 'Medicine',
    stat: 'Wis',
    proficient: true,
    expectedValue: 2
  },
  {
    name: 'Nature',
    stat: 'Int',
    proficient: false,
    expectedValue: -3
  },
  {
    name: 'Perception',
    stat: 'Wis',
    proficient: true,
    expectedValue: 2
  },
  {
    name: 'Performance',
    stat: 'Cha',
    proficient: true,
    expectedValue: 4
  },
  {
    name: 'Persuasion',
    stat: 'Cha',
    proficient: true,
    expectedValue: 4
  },
  {
    name: 'Religion',
    stat: 'Int',
    proficient: false,
    expectedValue: -3
  },
  {
    name: 'Sleight of Hand',
    stat: 'Dex',
    proficient: false,
    expectedValue: -1
  },
  {
    name: 'Stealth',
    stat: 'Dex',
    proficient: false,
    expectedValue: -1
  },
  {
    name: 'Survival',
    stat: 'Wis',
    proficient: true,
    expectedValue: 2
  },
]

const kuiniBaseSkills = [
  '-1 Acrobatics Dex',
  '+2 Animal Handling Wis',
  '-3 Arcana Int',
  '+5 Athletics Str',
  '+4 Deception Cha',
  '-3 History Int',
  '+2 Insight Wis',
  '+4 Intimidation Cha',
  '-3 Investigation Int',
  '+2 Medicine Wis',
  '-3 Nature Int',
  '+2 Perception Wis',
  '+4 Performance Cha',
  '+4 Persuasion Cha',
  '-3 Religion Int',
  '-1 Sleight of Hand Dex',
  '-1 Stealth Dex',
  '+2 Survival Wis',
]

const kuiniExpectedPrfoiciencyBonus = 6;

let electronApp: ElectronApplication;
let window: Page;
test.beforeAll(async () => {
  const obsidianOpen = 'obsidian://open?';
  const obsidianCreate = 'obsidian://new?';
  const testNoteName = 'Kuini_base_spec';
  // replace all '#' in the kuiniString
  const content = kuiniString.replace(/#/g, '%23');
 

  let args: string[] = [''];

  if(pathToVault) {
    args = [`${obsidianCreate}vault=${pathToVault}&name=${testNoteName}&content=${content}&overwrite`]
  }

  electronApp = await electron.launch({
    executablePath: pathToExe,
    args
  });
  window = await electronApp.firstWindow();

  await window.getByLabel('Open Character View').click();

  const characterSelectButton = await window.getByRole('button', { name: 'Select Character'});
  await expect(characterSelectButton).toBeVisible();

  characterSelectButton.click();

  window.locator('.prompt-input').fill(testNoteName);
  await window.locator('.suggestion-item').first().click();

  const title = await window.getByRole('heading', { level: 1});
  await expect(title).toHaveText(testNoteName);
});

test('check Stats', async () => {
  for (let i = 0; i < BaseStats.length; i++) {
    const stat = BaseStats[i];
    const text = await window.locator(`text=Stat Container for: ${stat.name}`).locator('..').textContent();
    expect(text).toContain(kuiniStats[i]);
  }
});

test('check Proficiency Bonus', async () => {
  const proficiencyBonus = parseInt(await window.getByTestId('proficiency-bonus').textContent() ?? '');
  expect(proficiencyBonus).toBe(kuiniExpectedPrfoiciencyBonus);
});

// run skill test individually for each skill

for (let i = 0; i < DnDBaseSkills.length; i++) {
  test(`check ${DnDBaseSkills[i].name} Skill`, async () => {    
    const proficiencyBonus = parseInt(await window.getByTestId('proficiency-bonus').textContent() ?? '');
    const skill = DnDBaseSkills[i];
    const skillContainer = window.getByTestId(`skill-container-${skill.name}`);
    const modifierLocator = skillContainer.getByTestId('skill-modifier');

    const proficiencyLocator = await window.getByRole('checkbox', {name: `Toggle ${skill.name} Proficiency`});
    
    let profModifier = parseInt(await proficiencyLocator.getAttribute('data-proficiency') ?? '');

    let modifier = await modifierLocator.textContent();
    expect(parseInt(modifier ?? '')).toBe(kuiniSkillsObj[i].expectedValue + proficiencyBonus * profModifier);

    await proficiencyLocator.click();
    profModifier = parseInt(await proficiencyLocator.getAttribute('data-proficiency') ?? '');    
    modifier = await modifierLocator.textContent();
    expect(parseInt(modifier ?? '')).toBe(kuiniSkillsObj[i].expectedValue + proficiencyBonus * profModifier);
    
    await proficiencyLocator.click();
    profModifier = parseInt(await proficiencyLocator.getAttribute('data-proficiency') ?? '');
    modifier = await modifierLocator.textContent();
    expect(parseInt(modifier ?? '')).toBe(kuiniSkillsObj[i].expectedValue + (proficiencyBonus * profModifier));
  });
}

test('Check Senses',async () => {
  await expect(window.getByText('18 Passive Wisdom (Perception)')).toBeVisible();
  await expect(window.getByText('18 Passive Wisdom (Perception)')).toBeVisible();
  await expect(window.getByText('13 Passive Intelligence (Investigation')).toBeVisible();

})

