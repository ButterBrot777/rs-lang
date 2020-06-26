const token = localStorage.getItem('token');

async function addSettingsUser(token, userId, obj) {
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
    console.log(content);
}

async function getSettingsUser(obj) {
    const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${obj.userId}/settings`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${obj.token}`,
            'accept': 'application/json',
        },
    });
    const content = await rawResponse.json();
    return content;
}

async function getNewWords(page, group, wordsPerDay) {
    const url = `https://afternoon-falls-25894.herokuapp.com/words?page=${page}&group=${group}
&wordsPerExampleSentenceLTE=15&wordsPerPage=${wordsPerDay}`;
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
        console.log(content);
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

export { addSettingsUser, getSettingsUser, getNewWords, getUserWord, createUserWord, updateUserWord }