import Head from 'next/head'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import axios from 'axios'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'

const effects = {
  '👏': ['4', '7.5'],
  '👏👏👏': ['9', '15']
}
const PUSHER_CHANNEL = 'collabee'
const PUSHER_EVENT = 'play-sound'

export default function Home() {
  const audioPackSrc = "https://storage.googleapis.com/collabee/sounds.webm"
  const [audioPack, setAudioPack] = useState(null)
  const [pusher, setPusher] = useState(null)
  const { data: session } = useSession()
  console.log(session?.user.email, session?.user.name)

  useEffect(() => {
    setAudioPack(new Audio(audioPackSrc))
    const pusherClient = new Pusher('31e9185cd7028f216191', {
      cluster: 'us3'
    })
    pusherClient.subscribe(PUSHER_CHANNEL)
    
    pusherClient.bind(PUSHER_EVENT, (data) => {
      console.log(data)
    })

    setPusher(pusherClient)
  }, [])

  const playAudio = (effect) => {
    const [startTime, endTime] = effects[effect]
    audioPack.currentTime = startTime
    audioPack.play()

    axios({
      method: 'POST',
      url: '/api/push',
      data: {
        effect,
        name: '123'
      }
    })

    const interval = setInterval(() => {
      if (audioPack.currentTime > endTime) {
        audioPack.pause()
        clearInterval(interval)
      }
    }, 100)
  }

  const authPage = (
    <div className="w-full grid grid-cols-1 gap-8 max-w-4xl">
      <div className="w-full text-center">
        <h2 className="text-3xl mb-10">👋</h2>
        <button
          className="
            text-3xl h-20 w-96 rounded-full
            border-2 border-blue-400
            bg-white
            text-gray-600
            hover:bg-blue-100 hover:border-blue-700 hover:text-blue-600"
          onClick={() => signIn()}
        >
          <div className="inline align-middle">
            <Image width="30" height="30" className="inline" src="/btn-google.svg" />
          </div> Google Sign In
        </button>
      </div>
    </div>
  )

  return (
    <>
      <Head>
        <title>Collabee</title>
        <meta name="description" content="Collabee - inspired by bwamp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full md:max-w-4xl mx-auto flex flex-wrap items-center justify-between mt-10 py-3">
        <div className="pl-4 w-full content-center mb-10">
          <h1 className="text-5xl font-semibold font-sans w-full text-center text-gray-200">
            🐝 Collabee
          </h1>
          <div className="text-center w-full italic mt-4 text-gray-500">you know what to do</div>
        </div>

        {session ? 
          <div className="w-full grid grid-cols-2 gap-8 max-w-4xl">
            {Object.keys(effects).map((k) => {
              return <div 
                  className="
                    h-20 w-full
                    border-2 border-blue-400 rounded-full
                    bg-white
                    text-3xl
                    cursor-pointer
                    flex flex-col justify-center items-center
                    hover:border-blue-700 hover:bg-blue-100
                  "
                  key={k}
                  onClick={() => playAudio(k)}>
                    <span>{k}</span>
              </div>
            })}
            <div className="mt-20 w-full text-center">
              <a href="#" className="text-gray-400 hover:underline hover:text-gray-300" onClick={() => signOut()}>sign out</a>
            </div>
          </div>
        : authPage}
      </div>
    </>
  )
}
