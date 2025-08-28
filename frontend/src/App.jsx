import React, { use, useEffect, useRef, useState } from 'react'
import logo from '/url-logo.png'
import check from '/check.jpg'
import { QRCodeCanvas } from 'qrcode.react'
import axios from 'axios'
import './App.css'

function App() {

  const inpRef = useRef(null)

  const textRef = useRef(null)

  const [uri, setUri] = useState("")
  const [copied, setCopied] = useState(false)
  const [showQr, setShowQr] = useState(false)
  const [loading, setLoading] = useState(false)

  const [shortUrl, setShortUrl] = useState('')

  useEffect(()=>{
    inpRef.current.focus()
  },[])

  useEffect(()=>{
    setTimeout(() => {
      setCopied(false)
    }, 2000);
  }, [copied])


  const fetchUrl = async()=>{

    if (!uri){
      inpRef.current.focus()
      return
    }

    setShortUrl("")
    setShowQr(false)
    setLoading(true)

    try {


      const res = await axios.post(`${import.meta.env.VITE_BACK_URL}/api/v1/user/generate`,{uri}, {
        withCredentials : true
      })

      setShortUrl(res.data.data.shortUrl)
      
    } catch (error) {

      throw error


    }
    finally{
      setLoading(false)
    }


  }

  return (
    <div className='w-full h-screen flex flex-col font-mono'>
      <header className='w-full flex'>
          <img src={logo} className='h-50 aspect-auto' />
          <div className='flex flex-col justify-center'>
            <h1 className='font-bold text-4xl text-gray-800'>URL</h1>
            <h1 className='text-3xl font-semibold text-gray-600'>Shortener</h1>
          </div>
      </header>
      <main className='w-full flex justify-center pt-40'>


        <div className='w-[40%] flex flex-col gap-8 item-center max-md:w-[80%] max-sm:w-[85%]'>
            {/* input */}
            <input type="text" className='w-full outline-none px-4 py-3 rounded-xl border-[3px] border-cyan-900' placeholder='type your url here ...'
            ref={inpRef} value={uri} onChange={(e)=>{
              setUri(e.target.value)
            }}/>
            
            {/* button */}
            <div className='w-full flex justify-center'>
              <button className='outline-none text-white bg-sky-600 w-40 px-3 rounded-xl font-bold cursor-pointer h-13 flex items-center justify-center'
              onClick={fetchUrl}>
                {
                  loading ?(
                    <div className='w-full h-full loader'/>
                  ):(
                    <>Generate Url</>
                  )
                }
              </button>
            </div>

            {/* showing fetched url */}
            {shortUrl &&
              <div className='w-full flex flex-col mt-4 items-center gap-4'>

                <h1 className='w-full text-center text-slate-700 font-bold bg-slate-300 py-4' ref={textRef}>{shortUrl}</h1>

                <div className='w-full flex justify-center gap-4'>
                    <button className='h-12 aspect-square text-3xl border-[2px] rounded-lg p-1 border-slate-300 flex justify-center items-center
                    cursor-pointer'   
                    onMouseEnter={() => setShowQr(true)}
                    onMouseLeave={() => setShowQr(false)}>
                      <i class="ri-qr-code-line"></i>
                    </button>
                    <button className='h-12 aspect-square border-[2px] rounded-lg p-1 border-slate-300 flex justify-center items-center
                    cursor-pointer' onClick={()=>{
                      window.navigator.clipboard.writeText(shortUrl)
                      setCopied(true)
                    }}>
                      {
                        copied ? (
                          <img src={check} className='h-full w-full' />
                        ):(
                          <i className="ri-file-copy-line text-3xl text-gray-700"/>
                        )
                      }
                    </button>
                </div>
            
                {showQr && <div className='w-full flex justify-center mt-4'>
                  <QRCodeCanvas value={shortUrl} size={100}/>
                </div>}
              </div> 
            }
        </div>

      </main>
    </div>
  )
}

export default App