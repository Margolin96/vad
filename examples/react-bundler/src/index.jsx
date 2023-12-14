import React, { useReducer, useState } from "react"
import ReactDOM from "react-dom"
import { useMicVAD, utils } from "@ricky0123/vad-react"

const domContainer = document.querySelector("#root")
const root = ReactDOM.createRoot(domContainer)
root.render(<App />)

function App() {
  const [audioList, setAudioList] = useState([])
  const vad = useMicVAD({
    onSpeechEnd: (audio) => {
      const wavBuffer = utils.encodeWAV(audio)
      const base64 = utils.arrayBufferToBase64(wavBuffer)
      const url = `data:audio/wav;base64,${base64}`
      setAudioList((old) => [url, ...old])
    },
  })
  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: 10 }}>
      <div style={{ background: '#FFF', boxShadow: '0 2px 5px 0 rgba(0,0,0,.1)' }}>
        <h1>VAD Demo</h1>
        <button style={{ margin: 10 }} onClick={vad.toggle}>Toggle VAD</button>
        <div style={{ padding: 10 }}>{vad.listening ? 'VAD is RUNNING' : 'VAD is STOPPED'}</div>
        {vad.userSpeaking && <UserSpeaking />}
        {!vad.userSpeaking && <UserNotSpeaking />}
        <ol id="playlist">
          {audioList.map((audioURL) => {
            return (
              <li key={audioURL.substring(-10)}>
                <audio controls src={audioURL} />
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function UserSpeaking() {
  return <span style={{ padding: 10, color: "green" }}>user is speaking</span>
}

function UserNotSpeaking() {
  return <span style={{ padding: 10, color: "red" }}>user is not speaking</span>
}
