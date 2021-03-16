const socket = io();
const $messageform=document.querySelector('#messageform')
const $messageforminput=$messageform.querySelector('input');
const $messageformbutton=$messageform.querySelector('button')
const $sendlocationbutton=document.querySelector('#sendlocation')
const $messages=document.querySelector('#messages')

/// template 
const $messagetemplate=document.querySelector('#messagetemplate').innerHTML;
const $locationmessagetemplate = document.querySelector('#locationmessagetemplate').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}



socket.on('wel',(message)=>{
  console.log(message);
    const html = Mustache.render($messagetemplate, {
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()


})
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.on('locationmessage',(urlmess)=>{
    const html = Mustache.render($locationmessagetemplate, {
        username:urlmess.username,
        url:urlmess.url,
        createdAt: moment(urlmess.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()


})


socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


/*document.querySelector('#increase').addEventListener('click',()=>{
console.log('clicked')
socket.emit('clickedy')
})*/
$messageform.addEventListener('submit',(e)=>{
    e.preventDefault();
    $messageformbutton.setAttribute('disabled','disabled')
    const message=e.target.elements.message.value;
   // console.log(message)
    socket.emit('sendmessage',message,(error)=>{
        $messageformbutton.removeAttribute('disabled')
        $messageforminput.value="";
        $messageforminput.focus()
        if(error)
        console.log(error)
       // console.log('message has been delivered')
        
    });

})
$sendlocationbutton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('your browser is not supporting gelocation')
    }
    navigator.geolocation.getCurrentPosition(position=>{
        $sendlocationbutton.setAttribute('disabled','disabled')
       // console.log(position)
        socket.emit('sendlocationll',{
            
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            $sendlocationbutton.removeAttribute('disabled')
        })
        
    })
})
socket.emit('join',{username,room},(error)=>{
    if (error) {
        alert(error)
        location.href = '/'
    }

})