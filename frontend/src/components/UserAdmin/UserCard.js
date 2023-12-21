import React, { Fragment } from 'react'
import "./UserCard.css"

const user={
    _id:1,
    username:"Yash_gupta_5532",
    email:"yashgupta5532@gmail.com",
    contactNo:8969364922,
    martialStatus:"Single",
    gender:"Male",
    branch:"CSE",
    yearOfStudy:2
}

const UserCard = () => {
  return (
    <Fragment>
        <div className="user-card-container">
            <div className="user-info">
                <div className="user-admin userId">userId :<b>{user._id}</b> </div>
                <div className="user-admin username">Username :<b>{user.username}</b> </div>
                <div className="user-admin email">Email :<b>{user.email}</b> </div>
                <div className="user-admin contactNo">ContactNo :<b>{user.contactNo}</b></div>
                <div className="user-admin martialStatus">MartialStatus :<b>{user.martialStatus}</b></div>
                <div className="user-admin gender">Gender :<b>{user.gender}</b></div>
                <div className="user-admin branch">Branch :<b>{user.branch}</b></div>
                <div className="user-admin yearOfStudy">yearOfStudy :<b>{user.yearOfStudy}</b></div>
            </div>
        </div>
    </Fragment>
  )
}

export default UserCard