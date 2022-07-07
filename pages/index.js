import Head from 'next/head'
import { useEffect, useState } from 'react'
import Pusher from 'pusher-js'
import axios from 'axios'
import { useSession, signIn, signOut } from "next-auth/react"
import Image from 'next/image'
import { useDebouncedCallback, useThrottledCallback } from 'use-debounce';


const effects = {
  '👏': [3.8, 7],
  '👍': [102.5, 103.8],
  '👏👏👏': [8.9, 16],
  '👎': [72.7, 74],
  '😮': [80.1, 82.1],
  '😻': [17.8, 19.2],
  '🥁🥁🥁': [43.9, 45.5],
  '✨': [97.6, 101.2],
  '💪': [90, 91],
  '💰': [33.8, 35.4],
  '🎉': [20.8, 22.7],
  '😥🎺': [91.9, 96],
  '🎉🎉': [24.9, 26.5],
  '🥂🍻': [36.8, 38.2],
  '🎉🎉🎉': [29, 30.8],
  '🦢': [50.9, 51.6],
  '🔥🔥🔥': [120.5, 121.5],
  '🤯🤯🤯': [104.6, 106.9],
  '😂🤭😂': [64.1, 66.3],
  '🐴🐴🐴': [59.8, 62.2],
  '⛏💀': [70.9, 71.8],
  '🐮🐮🐮': [40, 42.7],
  '🍖📯🔁': [52.6, 56],
  '🐈👎👎': [74.7, 78.6],
  '🥳🥳🥳': [111.6, 114.1],
  '🤷‍♂️': [116.4, 117.2],
  '🗓': [123.7, 125.2],
  '🐰': [127, 127.5],
  '🦗🦗🦗': [129.2, 133.2],
  '🧠': [136.5, 138],
  '🦄': [141.7, 143],
  '': [0, 0]
}
const PUSHER_CHANNEL_PREFIX = 'collabee'
const PUSHER_EVENT = 'play-sound'

export default function Home() {
  const audioPackSrc = process.env.NEXT_PUBLIC_AUDIO_PACK_SRC
  const [pusher, setPusher] = useState(null)
  const [forceInteract, setForceInteract] = useState(false)
  const [volume, setVolume] = useState(20)
  const { data: session } = useSession()

  useEffect(() => {
    if (session && pusher === null) {
      const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER
      })
      
      const domain = session.user?.email.split('@')[1]
      // pusherClient.subscribe(`${PUSHER_CHANNEL_PREFIX}-${domain}`)
      // console.log('push channel', `${PUSHER_CHANNEL_PREFIX}-${domain}`)
      pusherClient.subscribe(`${PUSHER_CHANNEL_PREFIX}`)
      console.log('push channel', `${PUSHER_CHANNEL_PREFIX}`)


      pusherClient.bind(PUSHER_EVENT, (data) => {
        console.log('received push', data)
        if (data?.email !== session?.user?.email) {
          playAudio(data.effect, data.name, false)
        }
      })

      pusherClient.bind('disconnected', () => {
        console.log('pusher is disconnected')
      })

      setPusher(pusherClient)
    }
  }, [session, pusher])

  const debouncedVolume = useDebouncedCallback(
    (value) => {
      setVolume(value);
    },
    300
  )

  const playAudio = useThrottledCallback(async(effect, broadcaster = null, broadcast = true) => {
    const [startTime, endTime] = effects[effect]
    const audioPack = new Audio(audioPackSrc)
    audioPack.currentTime = startTime
    audioPack.volume = volume / 100
    try {
      console.log('playing', effect)
      await audioPack.play()
    } catch(e) {
      if (e.name === 'NotAllowedError') {
        setForceInteract(true)
      }

      return false
    }

    if (broadcast) {
      axios({
        method: 'POST',
        url: '/api/push',
        data: {
          effect,
          name: session?.user?.name,
          email: session?.user?.email
        }
      })
    } else {
      bubble(effect, broadcaster)
    }

    const interval = setInterval(() => {
      if (audioPack.currentTime > endTime) {
        audioPack.pause()
        clearInterval(interval)
      }
    }, 100)
  }, 1000)

  const bubble = (effect, name) => {
    const width = window.innerWidth - 200
    const colors = ['red', 'blue', 'yellow', 'green']
    const color = colors[Math.floor(Math.random() * colors.length)]
    const el = document.createElement('div')

    el.className = `ease-in-out	transition-all px-4 absolute text-white max-w-fit 
                    text-l h-10 rounded-lg border-1 bg-${color}-400 flex items-center justify-center`
    el.style.top = `${parseInt(window.scrollY, 10)}px`
    el.style.left = `${Math.floor(Math.random() * (width - 100) + 100)}px`
    el.style.transitionDuration = '5s'
    el.innerHTML = `<span>${effect}&nbsp;&nbsp;${name}</span>`
    el.addEventListener('transitionend', (e) => {
      if(e.target) {
        e.target.remove()
      }
    })

    document.getElementsByTagName('body')[0].appendChild(el);
    setTimeout(() => {
      el.style.transform = 'translateY(800px)'
      el.style.opacity = 0
    }, 10)
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
        <div className="pl-4 w-full content-center mb-2">
          <h1 className="text-5xl font-semibold font-sans w-full text-center text-gray-200">
            🐝 Collabee
          </h1>
          <div className="text-center w-full italic mt-4 text-gray-500">you know what to do</div>
          {(session && forceInteract) && 
            <div
              className="
                w-full border-4 
                mt-5
                flex
                border-red-400 rounded-full h-20 bg-white cursor-pointer justify-center items-center"
              onClick={(e) => {
                e.stopPropagation()
                setForceInteract(false)
              }}>
                <span>🌈&nbsp;&nbsp;Click here to hear your colleagues!</span>
            </div>
          }
        </div>

        {session ? 
          <div className="w-full grid grid-cols-2 gap-x-8 gap-y-4 max-w-4xl">
            <div></div>
            <div className="flex justify-end text-l">
              <div className="flex-none pr-3">🔈</div>
              <div className="w-1/2">
                <input
                  type="range"
                  className="form-range h-6 p-0 bg-transparent w-full
                    focus:outline-none focus:ring-0 focus:shadow-none"
                  defaultValue={volume}
                  onChange={(e) => (debouncedVolume(e.target.value))}
                />
              </div>
              <div className="flex-none pl-3">🔊</div>
            </div>
            {Object.keys(effects).map((k) => {
              return <div 
                  className="
                    h-16 w-full
                    border-4 border-blue-400 rounded-full
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
            <div className="mt-20 w-full text-left text-gray-400">
              <p>connected: COMING SOON</p>
              <p>made with ❤️ by <a className="text-white" rel="noreferrer" target="_blank" href="https://inaccord.com/">accord</a> (inspired by bwamp.me)</p>
            </div>
            <div className="mt-20 w-full text-right">
              <a href="#" className="text-gray-400 hover:underline hover:text-gray-300" onClick={() => signOut()}>sign out as {session.user.email}</a>
            </div>
            <audio className="h-1 opacity-0" preload="auto">
              <source src={audioPackSrc} />
            </audio>
          </div>
        : authPage}
      </div>
    </>
  )
}
