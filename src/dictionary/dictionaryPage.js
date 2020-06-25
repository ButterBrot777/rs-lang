import React from 'react';
import Word from './dictionaryWord';
import DictionaryHeader from './dictionaryHeader';
import './dictionary.css'


class Dictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            currentData: [],
            words: '',
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const userWordsUrl = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/words`;
        const rawResponse = await fetch(userWordsUrl, {
            method: 'GET',
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${this.props.token}`,
                'Accept': 'application/json',
            }
        });
        const content = await rawResponse.json();
        this.setState({allData: content, isLoading: false,})
        this.getLearning();
    }

    getLearning = () => {
        const learningWords = this.state.allData.filter(word => word.optional.deleted===false && word.optional.hardWord===false);
        this.setState({currentData: learningWords, words: 'learning', isLoading: false,});
    }

    getHard = () => {
        const hardWords = this.state.allData.filter(word => word.optional.hardWord===true);
        this.setState({currentData: hardWords, words: 'hard', isLoading: false,});
    }

    getDeleted = () => {
        const deletedWords = this.state.allData.filter(word => word.optional.deleted===true);
        this.setState({currentData: deletedWords, words: 'deleted', isLoading: false,});  
    }

    updateAllData = (wordObj) => {
        const newAllData = this.state.allData.map(word => word.wordId === wordObj.wordId ? wordObj : word);
        this.setState({allData: newAllData, isLoading: false,})
        this.state.words === "hard" ? this.getHard() : this.getDeleted();
    }

    render() {
        const { currentData, words, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return  (
            <div>
                <header>
                    <DictionaryHeader words={words} getLearning={this.getLearning} 
                    getHard={this.getHard} getDeleted={this.getDeleted} />
                </header>
                
                <div className="words-list">
                    {currentData.map(element => <Word userId={this.props.userId} token={this.props.token} difficulty={element.difficulty} optional={element.optional} wordId={element.wordId} words={words} onWordTypeChange={this.updateAllData} key={element.wordId} />)}
                </div>
                <div>
                    {words === "hard" ? <button className="dictionary-btn train-hard-btn">Повторить</button> : ''}
                </div>
               
            </div>
            
        )       
    }
}

export default Dictionary;
