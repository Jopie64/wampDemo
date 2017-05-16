import { WampDemoPage } from './app.po';

describe('wamp-demo App', () => {
  let page: WampDemoPage;

  beforeEach(() => {
    page = new WampDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
