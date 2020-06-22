import React from 'react';
import Word from './word';

class Dictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            isLoading: false,
        }
    }

    getUserWords = async () => {
        const user_words_url = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/words`;
        const rawResponse = await fetch(user_words_url, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlZjBhMmUwOTg5NmUxMDAxN2VlYTRlNSIsImlhdCI6MTU5Mjg0NzM0MCwiZXhwIjoxNTkyODYxNzQwfQ.0Hv_TI5axNY3dbZpB72c7_N6xAkpTCuiJ6XoAckaBiQ',
                'Accept': 'application/json',
            }
        });
        const content = await rawResponse.json();
        return content;
    }

    getAll = async () => {
        const content = await this.getUserWords();
        this.setState({data: content, isLoading: false,});
    }

    getHard = async () => {
        const content = await this.getUserWords();
        const hardWords = await content.filter(word => word.difficulty==="hard");
        this.setState({data: hardWords, isLoading: false,});
    }

    getDeleted = async () => {
        const content = await this.getUserWords();
        const deletedWords = await content.filter(word => word.optional.deleted===true);
        console.log(deletedWords);
        this.setState({data: deletedWords, isLoading: false,});
    }

    componentDidMount = async () => {
        await this.getAll();
    }

    render() {
        const { data, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return  (
            <div>
                <div className="buttons">
                    <button onClick={this.getAll}>Все слова</button>
                    <button onClick={this.getHard}>Сложные</button>
                    <button onClick={this.getDeleted}>Удаленные</button>
                </div>
                
                <div className="all-words">
                    {data.map(element => <Word difficulty={element.difficulty} optional={element.optional} wordId={element.wordId} />)}
                </div>    
            </div>
            
        )       
    }
}

export default Dictionary;
