import React, { useEffect } from 'react'
import {io} from "socket.io-client"
import { socketUrl } from '../../constants.js'

const SocketApp = () => {
    const socket=io(socketUrl)
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