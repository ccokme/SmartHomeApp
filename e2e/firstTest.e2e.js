describe('Example', () => {
  beforeEach(async () => {
    // await device.reloadReactNative();
  });

  it('should have Scene screen', async () => {
    await element(by.id('SCENE')).tap();
    await expect(element(by.text('Scenes'))).toBeVisible();
  });

  it('tap scene', async () => {
    await element(by.id('SCENE')).tap();
    await element(by.id('card_menu')).atIndex(1).tap();

    await expect(element(by.text('Edit'))).toBeVisible();
    await element(by.text('Edit')).tap();
    await element(by.id('scene_input')).typeText('scene_1');
    await element(by.id('select_item')).atIndex(0).tap();
    
  });
  // it('should show hello screen after tap', async () => {
  //   await element(by.id('hello_button')).tap();
  //   await expect(element(by.text('Hello!!!'))).toBeVisible();
  // });

  // it('should show world screen after tap', async () => {
  //   await element(by.id('world_button')).tap();
  //   await expect(element(by.text('World!!!'))).toBeVisible();
  // });
});
