import { ElectronApplication, Page, _electron as electron } from '@playwright/test'
import { test, expect } from '@playwright/test'
import 'dotenv/config'
import { editedKuiniString, kuiniString, newParagraphString, newSubheadingString } from './testUtils';

const vaultName = process.env.VAULTNAME;
const pathToExe = process.env.TO_EXE;

let electronApp: ElectronApplication;
let window: Page;

const obsidianOpen = 'obsidian://open?';
const obsidianCreate = 'obsidian://new?';
const testNoteName = 'Kuini_base_spec';

test.beforeAll(async () => {
  // replace all '#' in the kuiniString
  const content = kuiniString.replace(/#/g, '%23');


  let args: string[] = [''];

  if(vaultName) {
    args = [`${obsidianCreate}vault=${vaultName}&name=${testNoteName}&content=${content}&overwrite`]
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

test('create new subheading', async () => {
    const subheadingButton = await window.getByRole('button', { name: 'Add Subheading'});
    await expect(subheadingButton).toBeVisible();
    subheadingButton.click();
    const newSubheadingInput = await window.getByRole('textbox', { name: 'New Subheading'});
    await expect(newSubheadingInput).toBeVisible();
    newSubheadingInput.fill(newSubheadingString);
    const createButton = await window.getByRole('button', { name: 'Add', exact: true});
    await expect(createButton).toBeVisible();
    createButton.click();
    const subheading = await window.getByRole('button', { name: newSubheadingString});
    await expect(subheading).toBeVisible();
    subheading.click();

    const subheadingParent = await subheading.locator('..');

    await expect(subheadingParent.getByText('New Paragraph')).toBeVisible();
    await subheadingParent.getByRole('button', { name: 'Edit'}).click();

    const paragraphInput = await subheadingParent.getByTestId('editable-paragraph');
    await expect(paragraphInput).toBeVisible();
    await paragraphInput.fill(newParagraphString);

    await window.keyboard.press('Control+s');

    await window.keyboard.press('Control+O');

    await window.getByPlaceholder('Find or create a note...').fill(testNoteName);
    await window.locator('.suggestion-item').first().click();


    await window.keyboard.press('Control+P');
    await window.getByPlaceholder('Select a command...').fill('Toggle Live Preview/Source mode');
    await window.keyboard.press('Enter');



    const fileText = await window.locator('.cm-contentContainer').allInnerTexts();
    console.log(fileText);

    expect(fileText.join('\n')).toEqual(editedKuiniString);

});

