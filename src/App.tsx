import { useEffect, useState } from 'react'

function App() {
  const [title, setTitle] = useState("タイトル")

  useEffect(() => {

  }, [])

  return (
    <>
      <div>{title}</div>
    </>
  )
}

export default App
