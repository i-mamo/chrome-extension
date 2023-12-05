import { useEffect, useState } from 'react'
import "./style.scss"

function App() {
  const [firstInit, setFirstInit] = useState<boolean>(false)
  const [tabId, setTabId] = useState<number>(null!)
  const [tabTitle, setTabTitle] = useState<string>(null!)
  const [selectedText, setSelectedText] = useState<string>("")
  const [update, setUpdate] = useState<boolean>(false)


  useEffect(() => {
    console.log("最初のUSEEFFECT");
    init()
    chrome.runtime.onMessage.addListener(receiveMessage)
  }, [])

  useEffect(() => {
    console.log("tabIdまたはtabTitleが変更された");
    init()
    setUpdate(false)
  }, [!!firstInit && !!update ])

  const receiveMessage = (v: any) => {
    console.log("確認(message)=>", v);
    let json = JSON.parse(v)
    if (json?.title) {
      console.log("タイトル差分：", json.title === tabTitle);
      setTabTitle(json.title)
    }
    if (json?.selectedText) {
      setSelectedText(json.selectedText)
    }

    if (json?.update) {
      setUpdate(json.update)
      console.log("\u001b[31m アップデート \u001b[0m'");
    }

  }

  const init = async () => {
    setFirstInit(true)
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    setTabId(tab.id!)
    setTabTitle(tab.title!)
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => {
        const divElement = document.createElement("div")
        divElement.innerHTML = "拡張機能実行中"
        divElement.style.cssText = "background: white; color:red; font-size: large; padding: 3rem;"
        document.body.before(divElement)

        document.addEventListener("selectionchange", () => {
          let str = window.getSelection()?.toString()
          let json = { selectedText: str }
          str && chrome.runtime.sendMessage(JSON.stringify(json))
        })

      }
    })
  }

  return (
    <>
      <div>
        <div style={{ padding: "1rem", border: "solid 1px lightblue", borderRadius: "1rem", textAlign: "center" }}>拡張機能テスト</div>
        <div style={{ padding: "1rem" }}>
          <div>tabID:</div>
          <div style={{ background: "green" }}>&nbsp;{tabId}</div>
          <div>tabタイトル:</div>
          <div style={{ background: "rgb(0,120,154)" }}>&nbsp;{tabTitle}</div>
        </div>
        <div style={{ padding: "1rem" }}>
          <div>
            <textarea
              name=""
              id=""
              cols={30}
              rows={10}
              value={selectedText}
              onChange={(e) => setSelectedText(e.currentTarget.value)}
              style={{ width: "100%" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              children={"送信"}
              onClick={() => { console.log("送信") }}
              style={{ margin: "1rem", padding: "0 1rem", background: "" }}
            />
          </div>
        </div>

      </div>
    </>
  )
}

export default App
