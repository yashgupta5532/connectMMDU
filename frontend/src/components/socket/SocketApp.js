import React, { useEffect } from 'react'
import {io} from "socket.io-client"

const SocketApp = () => {
    const socket=io("http://localhost:8000")
    useEffect(()=>{
        socket.on("connect",()=>{
            console.log("connected",socket.id)
        })
    },[socket])
  return (
    <div>SocketApp</div>
  )
}

export default SocketApp