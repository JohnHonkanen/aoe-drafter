import { DrafterAppPage } from './app.po';

describe('drafter-app App', function() {
  let page: DrafterAppPage;

  beforeEach(() => {
    page = new DrafterAppPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
