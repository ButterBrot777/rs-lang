
async function singInRequest(userData){
  const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/signin', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if(rawResponse.status === 200){
    const content = await rawResponse.json();
    localStorage.setItem('token', content.token)
    localStorage.setItem('userId', content.userId)
    console.log(content)
    return content;
  }else{ 
    throw new Error(rawResponse.status);
  }
}

async function singUpRequest(userData){
  const rawResponse = await fetch('https://afternoon-falls-25894.herokuapp.com/users', {
     method: 'POST',
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
     },
     body: JSON.stringify(userData)
   });
   if(rawResponse.status === 200){
    return userData;
   }else{ 
    throw new Error(rawResponse.status);
   }
}

async function startSettingsUser(obj){
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${obj.userId}/settings`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${obj.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "wordsPerDay": 1,
      "optional": {
        'Level': 1,
        'Page':1,
        'Word':1,
        'AutoVoice': true,
        'Translate':true,
        'VoiceSentence': true,
        'PromtImage': false,
       }
    })
  });
  const content = await rawResponse.json();
  console.log('стартовые настройки',content);
  return obj;
}

 async function addSettingsUser(token, userId, obj){
 
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/settings`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj)
  });
  const content = await rawResponse.json();
  console.log(' тут я ', content);
}

async function getSettingsUser(obj){
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${obj.userId}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${obj.token}`,
          'accept': 'application/json',
        },
      });
      const content = await rawResponse.json();
      console.log('Вызов настроек пользователя',content);
      return content;
}

export {singInRequest, singUpRequest, startSettingsUser, addSettingsUser, getSettingsUser}