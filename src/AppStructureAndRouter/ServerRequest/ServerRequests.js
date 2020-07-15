const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

// Проверка на рабочий Token
const getToken = async () => {
  let dateNow = +new Date()
  if (localStorage.getItem('RefreshTime') > dateNow) {
    return localStorage.getItem('token');
  }
  return getRefreshToken()
}
// Запрос на обновление Token  
const getRefreshToken = async () => {
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/tokens`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('refreshToken')}`,
      'accept': 'application/json',
    },
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    let date = +new Date();
    const timeRefresh = 14400000

    date += timeRefresh;
    localStorage.setItem('RefreshTime', date);
    localStorage.setItem('token', content.token)
    localStorage.setItem('refreshToken', content.refreshToken)
    return localStorage.getItem('token')
  } else {
    localStorage.setItem('RefreshTime', '')
    localStorage.setItem('userId', '');
    localStorage.setItem('refreshToken', '')
    localStorage.setItem('token', '')
  }
}

async function signInRequest(userData) {
  const rawResponse = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    let date = +new Date();
    date += 14400000;
    localStorage.setItem('RefreshTime', date);
    localStorage.setItem('token', content.token);
    localStorage.setItem('userId', content.userId);
    localStorage.setItem('refreshToken', content.refreshToken)
    // return content;
  } else {
    throw new Error(rawResponse.status);
  }
}
async function signUpRequest(userData) {
  const rawResponse = await fetch(`${baseUrl}/users`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if (rawResponse.status === 200) {
    return userData;
  } else {
    throw new Error(rawResponse.status);
  }
}

const startStatisticsUser = async () => {
  const token = await getToken();
  const date = +new Date()
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/statistics`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "learnedWords": 0,
      "optional": {
        "dateOfReg": date,
        "speakIt": { neverPlayed: true },
        "puzzle": { neverPlayed: true },
        "savannah": { neverPlayed: true },
        "sprint": { neverPlayed: true },
        "audioCall": { neverPlayed: true }
      }
    })
  })
  const content = await rawResponse.json();
  return content;
}

const startSettingsUser = async () => {
  const token = await getToken();
  let date = new Date()
  date.setDate(date.getDate() - 1);
  let yesterday = date.toLocaleDateString();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/settings`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "wordsPerDay": 20,
      "optional": {
        "maxWordsPerDay": 40,
        "level": 0,
        "page": 0,
        "wordsLearntPerPage": 0,
        "lastTrain": yesterday,
        "hints": {
          "meaningHint": true,
          "translationHint": true,
          "exampleHint": true,
          "soundHint": false,
          "imageHint": false,
          "transcriptionHint": false
        }
      }
    })
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }else {
    throw new Error(rawResponse.status);
  }
}

const addSettingsUser = async (settingsData) => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/settings`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settingsData)
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }else {
    throw new Error(rawResponse.status);
  }
}

const getSettingsUser = async () => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/settings`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json',
    },
  });
  const content = await rawResponse.json();
  return content;
}

const updateStatisticsUser = async (statisticsData) => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/statistics`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(statisticsData)
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }else {
    throw new Error(rawResponse.status);
  }
}

// не работает в статистике 
const getStatisticsUser = async () => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/statistics`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  const content = await rawResponse.json()
  console.log(content, 'статистика')
  return content
}

const getNewWords = async (page, group) => {

  const url = `${baseUrl}/words?page=${page}&group=${group}`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
}

const getWordData = async (wordId) => {
  const rawResponse = await fetch(`${baseUrl}/words/${wordId}`);
  const content = await rawResponse.json();
  return content;
}

const getUserWord = async (wordId) => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/words/${wordId}`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }else if (rawResponse.status === 404) {
    return false;
  } else {
    throw new Error(rawResponse.status);
  }
};



const createUserWord = async (wordId, wordData) => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/words/${wordId}`, {
    method: 'POST',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wordData)
  });
  const content = await rawResponse.json();
  console.log(content)
  return content;
};

const updateUserWord = async (wordId, wordData) => {
  const token = await getToken();
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/words/${wordId}`, {
    method: 'PUT',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(wordData)
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }else {
    throw new Error(rawResponse.status);
  }
};

const getAllUserWords = async () => {
  const token = await getToken();
  console.log(token)
  const rawResponse = await fetch(`${baseUrl}/users/${localStorage.getItem('userId')}/words/`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    }
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  }
};

async function getNewWordsWithExtraParams(page, group, wordsPerPage) {
  const url = `${baseUrl}/words?page=${page}&group=${group}&wordsPerExampleSentenceLTE=15&wordsPerPage=${wordsPerPage}`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
}


const getWordById = async (wordId) => {
  const url = `${baseUrl}/words/${wordId}?noAssets=true`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
};
const filterUserWords = async () => {
  const userWords = await getAllUserWords();
  const currentDate = new Date();
  const wordsForGame = userWords.filter(word => word.optional.deleted === false && word.optional.hardWord === false && word.optional.nextTrain <= +currentDate);
  console.log(wordsForGame)
  return wordsForGame;
}

export { getWordData, getAllUserWords, signInRequest, signUpRequest, startSettingsUser, addSettingsUser, getSettingsUser, updateStatisticsUser, getStatisticsUser, getNewWords, getUserWord, createUserWord, updateUserWord, filterUserWords, getWordById, startStatisticsUser, getNewWordsWithExtraParams }
