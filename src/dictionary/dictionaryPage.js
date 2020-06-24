import React from 'react';
import Word from './word';
import DictionaryHeader from './dictionaryHeader'

class Dictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            currentData: [],
            isLoading: false,
        }
        this.words = '';
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        const user_words_url = `https://afternoon-falls-25894.herokuapp.com/users/${this.props.userId}/words`;
        const rawResponse = await fetch(user_words_url, {
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
        const learningWords = this.state.allData.filter(word => word.optional.deleted===false);
        console.log(learningWords);
        this.words = 'learning';
        this.setState({currentData: learningWords, isLoading: false,});
    }

    getHard = () => {
        const hardWords = this.state.allData.filter(word => word.difficulty==="hard" && word.optional.deleted===false);
        console.log(hardWords);
        this.words = 'hard';
        debugger
        this.setState({currentData: hardWords, isLoading: false,});
    }

    getDeleted = () => {
        const deletedWords = this.state.allData.filter(word => word.optional.deleted===true);
        console.log(deletedWords);
        this.words = 'deleted';
        this.setState({currentData: deletedWords, isLoading: false,});  
    }

    render() {
        const { currentData, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return  (
            <div>
                <header>
                    <DictionaryHeader words={this.words} getLearning={this.getLearning} 
                    getHard={this.getHard} getDeleted={this.getDeleted} />
                </header>
                
                <div className="words-list">
                    {currentData.map(element => <Word difficulty={element.difficulty} optional={element.optional} wordId={element.wordId} words={this.words} key={element.wordId} />)}
                </div>
                <div>
                    {this.words === "hard" ? <button className="train-hard-btn">Повторить</button> : ''}
                </div>
            </div>
            
        )       
    }
}

export default Dictionary;
