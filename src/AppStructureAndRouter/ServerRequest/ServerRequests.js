const token = localStorage.getItem('token');

async function signInRequest(userData){
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

async function signUpRequest(userData){
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
    // с 0 не работает
    body: JSON.stringify({
      "wordsPerDay": 1,
      "optional": {
        'Level': 5,
        'Page':1,
        'Word':1,
        'AutoVoice': true,
        'Translate':true,
        'VoiceSentence': true,
        'PromtImage': false
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
      // console.log('Вызов настроек пользователя',content);
      return content;
}

async function getNewWords(page, group) {
  const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
}

const getUserWord = async (wordId, user) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/words/${wordId}`, {
      method: 'GET',
      withCredentials: true,
      headers: {
          'Authorization': `Bearer ${user.token}`,
          'Accept': 'application/json',
      }
  });
  if (rawResponse.status === 200) {
      const content = await rawResponse.json();
      console.log('get user word', content);
      return content;
  } else if (rawResponse.status === 404){
      return false;
  } else{ 
      throw new Error(rawResponse.status);
    }
};

const createUserWord = async ({ userId, wordId, word }) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();
  console.log('created', content);
};

const updateUserWord = async ({ userId, wordId, word }) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${userId}/words/${wordId}`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(word)
  });
  const content = await rawResponse.json();
  console.log('updated', content);
};

const getAllUserWords = async (user) => {
  const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${user.userId}/words/`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${user.token}`,
      'Accept': 'application/json',
    }
  });
  const content = await rawResponse.json();

  console.log(content);
  return content;
};

const loginUser = async user => {
  const rawResponse = await fetch('http://pacific-castle-12388.herokuapp.com/signin', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  });
  const content = await rawResponse.json();

  console.log(content);
};

export {loginUser, signInRequest, signUpRequest, startSettingsUser, addSettingsUser, getSettingsUser, getNewWords, getUserWord, getAllUserWords, createUserWord, updateUserWord}