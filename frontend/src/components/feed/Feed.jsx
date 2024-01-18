import React from 'react'
import "./feed.css"
import Share from '../share/Share'
import Post from '../post/Post'
import {Posts} from "../../dummyData"

export default function Feed({user}) {
  return (
    <div className='feed'>
      <div className="feedWrapper">
        <Share user={user}/>
        {Posts.map((p) =>(
          <Post key = {p.id} post ={p}/>
        ))}
      </div>
    </div>
  )
}
