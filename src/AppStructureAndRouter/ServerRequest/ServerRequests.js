const refreshToken = localStorage.getItem('refreshToken');
const token = localStorage.getItem('token');
const userId = localStorage.getItem('userId');
const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

async function signInRequest(userData){
  const rawResponse = await fetch(`${baseUrl}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  if(rawResponse.status === 200){
    const content = await rawResponse.json();
    localStorage.setItem('token', content.token);
    localStorage.setItem('userId', content.userId);
    localStorage.setItem('refreshToken', content.refreshToken)
    return content;
  }else{ 
    throw new Error(rawResponse.status);
  }
}
async function signUpRequest(userData){
  const rawResponse = await fetch(`${baseUrl}/users`, {
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

const startSettingsUser = async () => {
  let date = new Date()
  date.setDate(date.getDate() - 1);
  let yesterday = date.toLocaleDateString();
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/settings`, {
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await startSettingsUser();
  } else{ 
    throw new Error(rawResponse.status);
  }
}

 const addSettingsUser = async (settingsData) => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/settings`, {
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await addSettingsUser();
  } else{ 
    throw new Error(rawResponse.status);
  }
}

const getSettingsUser = async () => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/settings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'application/json',
        },
      });
      if (rawResponse.status === 200) {
        const content = await rawResponse.json();
        return content;
      } else if (rawResponse.status === 401) {
        await getRefreshToken();
        await getSettingsUser();
      } else{ 
        throw new Error(rawResponse.status);
      }
}

const updateStatisticsUser = async (statisticsData) => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/statistics`, {
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await updateStatisticsUser();
  } else{ 
    throw new Error(rawResponse.status);
  }
}

const getStatisticsUser = async () => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/statistics`, {
    method: 'GET',
    withCredentials: true,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
    },
  });
  if (rawResponse.status === 200) {
    const content = await rawResponse.json();
    return content;
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await getStatisticsUser();
  } else{ 
    throw new Error(rawResponse.status);
  }
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
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/${wordId}`, {
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await getUserWord(wordId);
  } else{ 
    throw new Error(rawResponse.status);
  }
};

const createUserWord = async (wordId, wordData) => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/${wordId}`, {
    method: 'POST',
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await createUserWord();
  } else{ 
    throw new Error(rawResponse.status);
  }
};

const updateUserWord = async (wordId, wordData) => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/${wordId}`, {
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
  } else if (rawResponse.status === 401) {
    await getRefreshToken();
    await updateUserWord();
  } else{ 
    throw new Error(rawResponse.status);
  }
};

const getAllUserWords = async () => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/`, {
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
  } else if (rawResponse.status === 402) {
    await getRefreshToken();
    await getAllUserWords();
  } else{ 
    throw new Error(rawResponse.status);
  }
};

async function getNewWordsWithExtraParams(page, group, wordsPerPage) {
  const url = `${baseUrl}/words?page=${page}&group=${group}&wordsPerExampleSentenceLTE=15&wordsPerPage=${wordsPerPage}`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
}

const getRefreshToken = async () => {
  const rawResponse = await fetch(`${baseUrl}/users/${userId}/tokens`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${refreshToken}`,
          'accept': 'application/json',
        },
      });
      if (rawResponse.status === 200) {
        const content = await rawResponse.json();
        localStorage.setItem('token', content.token)
        localStorage.setItem('refreshToken', content.refreshToken)
        return content;
      } else if (rawResponse.status === 403){
        document.location.reload();
      } else{ 
        throw new Error(rawResponse.status);
      }
}

const getWordById = async (wordId) => {
  const url = `${baseUrl}/words/${wordId}?noAssets=true`;
  const rawResponse = await fetch(url);
  const content = await rawResponse.json();
  return content;
}

export {getWordById, getRefreshToken, signInRequest, signUpRequest, startSettingsUser, addSettingsUser, getSettingsUser, updateStatisticsUser, getStatisticsUser,  getWordData, getNewWords, getUserWord, getAllUserWords, createUserWord, updateUserWord, getNewWordsWithExtraParams}
