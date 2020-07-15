
const baseUrl = 'https://afternoon-falls-25894.herokuapp.com';
const wordsPerSent = 15;
const wordsPerPage = 10;

const getWords = async (page, group) => {
    const url = `${baseUrl}/words?page=${page}&group=${group}
    &wordsPerExampleSentenceLTE=${wordsPerSent}&wordsPerPage=${wordsPerPage}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(response.statusText);
    } else {
        const data = await response.json();
        return data;
    }
}

export default getWords;