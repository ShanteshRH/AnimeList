import React, { useEffect, useState } from 'react'
import './ProfilePage.css'
// import './FaTrash' from 'react-icons/fa';
const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingUsername,setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/profile', {
          method : 'GET',
          headers:{
            'Authorization':`Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user profile data:',error);
      }
    };
    fetchUserData();
  },[]);

  const handleUsernameChange = async (e) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/update-username',{
        method: 'PUT',
        headers: {
          'Content-type':'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: newUsername}),
      })
      console.log(response);
      if(response.ok){
        const updatedData = await response.json();
        setUserData((prev) => ({...prev, username: updatedData.username}));
        localStorage.setItem('username',newUsername);
        alert('Username updated successfully!');
        setIsEditingUsername(false);
      } else {
        alert('Failed to update username.');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      alert('Error updating username.');
    }
  }

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('profilePicture',file);

    try {
        const response = await fetch('http://localhost:5000/api/auth/upload-profile-picture',{
            method:'POST',
            headers:{
                'Authorization':`Bearer ${token}`,
            },
            body: formData
        });
        // console.log(response);
        const data = await response.json();
        if(response.ok){
          setUserData(prev => ({ ...prev,profilePicture: data.profilePicture.trim() || 'http://localhost:5000/uploads/default.jpg'}));
          alert('Profile picture updated successfully!');
        } else {
          alert('Failed to update profile picture.');
        }
        localStorage.setItem("profilePicture",data.profilePicture.trim());
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Error uploading profile picture.');
    }
  }

  const handleDeleteProfilePicture = async(e) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:5000/api/auth/delete-profile-picture',{
        method: 'DELETE',
        headers:{
          'Authorization': `Bearer ${token}`,
        }
      });

      if(response.ok) {
        setUserData((prev) => ({ ...prev, profilePicture: 'http://localhost:5000/uploads/default.jpg'}));
        alert('Profile picture deleted successfully!');
        localStorage.removeItem('profilePicture');
      } else {
        alert('Failed to delete profile picture');
      }
    } catch (error) {
      console.error('Error deleting profile picture',error);
      alert('Error deleting profile picture');
    }
  }

  if(!userData){
    return <div> Loading... </div>
  }

  return (
    <div className='profile-page'>
      <div className='profile-header'>
        <div 
        className="profile-picture-container"
        onMouseEnter={() => setIsEditing(true)}
        >
          <img 
          src={`${userData.profilePicture || 'http://localhost:5000/uploads/default.jpeg'}?t=${new Date().getTime()}`} 
          alt='Profile' 
          className='profile-picture'
          />
          {isEditing && (
            <>
              <label htmlFor="profilePictureInput" className='edit-icon'>
                ✏️
              </label>
              <button className='delete-icon' onClick={handleDeleteProfilePicture}>
                🗑️
              </button>
            </>
          )}
          <input 
            id='profilePictureInput'
            type='file'
            accept='image/*'
            onChange={handleProfilePictureChange}
            style={{display:'none'}}
          />
        </div>
        <div className="username-container">
          {isEditingUsername? (
            <div>
              <input 
                type='text'
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className='username-input'
              />
              <button onClick={handleUsernameChange} className="save-button">Save</button>
              <button onClick={() => setIsEditingUsername(false)} className="cancel-button">Cancel</button>
            </div>
          ):(
            <h1>
              {userData.username}{' '}
              <span
                className="edit-username-icon"
                onClick={() => setIsEditingUsername(true)}
              >
                ✏️
              </span>
            </h1>
          )}
        </div>
      </div>
      <div className="profile-info">
        <p><strong>Number of Animes in List: {userData.animeCount} </strong></p>
        <div>
          <strong>Score Distribution:</strong>
          <div className="score-bar-container">
            {userData.scoreDistribution.map((count,index) => {
              return (
                <div key={index} className="score-bar">
                  <span>{index+1}</span>
                  <div style={{width: `${(count / userData.validAnimeCount) * 100}%`}} />
                  {count>0 && <span>{count}</span>}
                </div>
              )
            })}
          </div>
        </div>
        <p><strong>Average Score:</strong>{userData.averageScore}</p>
      </div>
    </div>
  )
}

export default ProfilePage
