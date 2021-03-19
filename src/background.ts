import TabChangeInfo = chrome.tabs.TabChangeInfo;
import Tab = chrome.tabs.Tab;

console.log('background', 'test1');


chrome.runtime.onInstalled.addListener(() => {
  console.log('runtime.onInstalled');
  /*
  chrome.webNavigation.onCompleted.addListener(() => {
    console.log('webNavigation.onCompleted');
    chrome.tabs.query({active: true, currentWindow: true}, ([{id}]) => {
      if (typeof id === 'number') {
        chrome.pageAction.show(id);
      }
    });
  }, {url: [{urlMatches: 'google.com'}]});
 */


  document.addEventListener('patternmatch', (e: Event) => {
    console.log('patternmatch', e);
  });

  document.addEventListener('tabupdate', (e: any) => {
    console.log('tabupdate', e);
    chrome.tabs.get(e.detail.tabId, (tab: Tab) => {
      console.log('tabs.query', tab);
    });
  });

  chrome.tabs.onUpdated.addListener((tabId: number, props: TabChangeInfo) => {
    console.log('tabs.onUpdated', tabId, props);
    if (props.status === 'complete') {
      const update = new CustomEvent('tabupdate', {
        detail: {
          tabId
        }
      });
      document.dispatchEvent(update);
    }
  });


});
