console.log("バックグラウンド起動");

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url?.startsWith("chrome://")) return

  if (changeInfo.status === "complete") {
    console.log(tabId, changeInfo, tab);
    send(JSON.stringify({ tabId: tabId, title: tab.title, update: true }))

    console.log("\u001b[31m---------------------\u001b[0m'");
  }
})

chrome.tabs.onActivated.addListener((activeInfo) => {
  let a = { ...activeInfo, update: true }
  console.log("tabが切り替えられた", a);

  send(JSON.stringify({ ...activeInfo, update: true }))
})

chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error))

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  let json = JSON.parse(message)
  if (json?.selectedText) {
    send(message)
  } else {
    send("background receive message [Success]")
  }
})


// message送信用
const send = (message: any) => {
  chrome.runtime.sendMessage(message)
}
