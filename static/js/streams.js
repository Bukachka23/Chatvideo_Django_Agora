// Setting constant variables for APP_ID and retrieving data from session storage.
const APP_ID = 'd96f80e9aae74632b0340048beb98c66'
const TOKEN = sessionStorage.getItem('token')
const CHANNEL = sessionStorage.getItem('room')
let UID = sessionStorage.getItem('UID')
let NAME = sessionStorage.getItem('name')

// Creating a new AgoraRTC client with mode set to 'rtc' and codec set to 'vp8'.
const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

// Initializing local tracks array and remote users object.
let localTracks = []
let remoteUsers = {}

// This function is used to join the video call and display local video stream.
let joinAndDisplayLocalStream = async () => {
    // Displaying the room name.
    document.getElementById('room-name').innerText = CHANNEL

    // Setting event listeners for user-published and user-left events.
    client.on('user-published', handleUserJoined)
    client.on('user-left', handleUserLeft)

    // Joining the video call and catching any errors.
    try{
        UID = await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.error(error)
        window.open('/', '_self')
    }

    // Creating audio and video tracks for the local user.
    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks()

    // Creating a new member for the room.
    let member = await createMember()

    // Creating a new video player for the local user.
    let player = `<div  class="video-container" id="user-container-${UID}">
                     <div class="video-player" id="user-${UID}"></div>
                     <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                  </div>`

    // Inserting the new video player into the 'video-streams' element.
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    // Playing the local user's video stream and publishing local user's tracks.
    localTracks[1].play(`user-${UID}`)
    await client.publish([localTracks[0], localTracks[1]])
}

// Function to handle the user-published event. This function is triggered when a new user joins the video call.
let handleUserJoined = async (user, mediaType) => {
    // Adding the new user to the remoteUsers object.
    remoteUsers[user.uid] = user
    await client.subscribe(user, mediaType)

    // If the media type is 'video', a new video player is created for the new user.
    if (mediaType === 'video'){
        // Removing existing player if exists.
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        // Fetching member info.
        let member = await getMember(user)

        // Creating a new video player for the new user.
        player = `<div  class="video-container" id="user-container-${user.uid}">
            <div class="video-player" id="user-${user.uid}"></div>
            <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
        </div>`

        // Inserting the new video player into the 'video-streams' element.
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        // Playing the new user's video stream.
        user.videoTrack.play(`user-${user.uid}`)
    }

    // If the media type is 'audio', the new user's audio stream is played.
    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

// Function to handle the user-left event. This function is triggered when a user leaves the video call.
let handleUserLeft = async (user) => {
    // Removing the user who left from the remoteUsers object.
    delete remoteUsers[user.uid]

    // Removing the video player of the user who left.
    document.getElementById(`user-container-${user.uid}`).remove()
}

// Function to leave the video call and remove local video stream.
let leaveAndRemoveLocalStream = async () => {
    // Stopping and closing all local tracks.
    for (let i=0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    // Leaving the video call.
    await client.leave()

    // Deleting the member from the server.
    deleteMember()

    // Redirecting to the home page.
    window.open('/', '_self')
}

// Function to toggle the local user's camera.
let toggleCamera = async (e) => {
    console.log('TOGGLE CAMERA TRIGGERED')
    // If the camera is currently muted, it is unmuted. Otherwise, it is muted.
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

// Function to toggle the local user's microphone.
let toggleMic = async (e) => {
    console.log('TOGGLE MIC TRIGGERED')
    // If the microphone is currently muted, it is unmuted. Otherwise, it is muted.
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

// Function to create a new member on the server.
let createMember = async () => {
    let response = await fetch('/create_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
    return member
}

// Function to retrieve a member's data from the server.
let getMember = async (user) => {
    let response = await fetch(`/get_member/?UID=${user.uid}&room_name=${CHANNEL}`)
    let member = await response.json()
    return member
}

// Function to delete a member from the server.
let deleteMember = async () => {
    let response = await fetch('/delete_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'room_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
}

// Event listener for beforeunload event. This event is triggered before the page is unloaded.
window.addEventListener("beforeunload",deleteMember);

// Joining the video call and displaying the local video stream.
joinAndDisplayLocalStream()

// Setting event listeners for the 'leave-btn', 'camera-btn', and 'mic-btn' buttons.
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)


