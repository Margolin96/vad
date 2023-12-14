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
    <>
      <div className="container">
        <div className="wrapper">
          <h1>VAD Demo</h1>

          <div className="state">
            <div className="state-running">{vad.listening ? 'RUNNING' : 'STOPPED'}</div>

            {vad.userSpeaking && <UserSpeaking />}
            {!vad.userSpeaking && <UserNotSpeaking />}
          </div>

          <button className="button" onClick={vad.toggle}>Toggle VAD</button>
        </div>
      </div>

      <ol id="playlist">
        {audioList.map((audioURL) => {
          return (
            <li key={audioURL.substring(-10)}>
              <audio controls src={audioURL} />
            </li>
          )
        })}
      </ol>
    </>
  )
}

function UserSpeaking() {
  return <span className="state-speaking">user is speaking</span>
}

function UserNotSpeaking() {
  return <span className="state-silent">user is not speaking</span>
}
