import React from 'react';
import Word from './dictionaryWord';
import DictionaryHeader from './dictionaryHeader';
import { getAllUserWords, getSettingsUser } from '../ServerRequest/ServerRequests';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import './dictionary.css';

class Dictionary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            allData: [],
            currentData: [],
            words: '',
            meaningInfo: true,
            exampleInfo: true,
            transcriptionInfo: true,
            imageInfo: true,
            isLoading: false,
        }
    }

    componentDidMount = async () => {
        this.setState({ isLoading: true });
        this.getUserSettings();
        const content = await getAllUserWords();
        this.setState({ allData: content, isLoading: false, });
        this.getLearning();
    }

    getUserSettings = async () => {
        const content = await getSettingsUser();
        const wordInfo = content.optional.hints;
        this.setState({
            meaningInfo: wordInfo.meaningHint,
            exampleInfo: wordInfo.exampleHint,
            transcriptionInfo: wordInfo.transcriptionHint,
            imageInfo: wordInfo.imageHint
        })
    }

    getLearning = () => {
        const learningWords = this.state.allData.filter(word => word.optional.deleted === false && word.optional.hardWord === false);
        this.setState({ currentData: learningWords, words: 'learning', isLoading: false, });
    }

    getHard = () => {
        const hardWords = this.state.allData.filter(word => word.optional.hardWord === true);
        this.setState({ currentData: hardWords, words: 'hard', isLoading: false, });
    }

    getDeleted = () => {
        const deletedWords = this.state.allData.filter(word => word.optional.deleted === true);
        this.setState({ currentData: deletedWords, words: 'deleted', isLoading: false, });
    }

    updateAllData = (wordObj) => {
        const newAllData = this.state.allData.map(word => word.wordId === wordObj.wordId ? wordObj : word);
        this.setState({ allData: newAllData, isLoading: false, })
        this.state.words === "hard" ? this.getHard() : this.getDeleted();
    }

    render() {
        const { currentData, words, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return (
            <div>
                <header>
                    <DictionaryHeader words={words} getLearning={this.getLearning}
                        getHard={this.getHard} getDeleted={this.getDeleted} />
                </header>
                
                <div className="dictionary-words-list">
                    {currentData.map(element => <Word difficulty={element.difficulty} optional={element.optional} meaningInfo={this.state.meaningInfo} exampleInfo={this.state.exampleInfo} transcriptionInfo={this.state.transcriptionInfo} imageInfo={this.state.imageInfo} wordId={element.wordId} words={words} onWordTypeChange={this.updateAllData} key={element.wordId} />)}
                </div>
                <div className="train-hard-btn-container">
                    {words === "hard" ? <Link to="/BasicGame"><button className="dictionary-btn train-hard-btn" onClick={this.props.handlehardWordsTraining}>Train hard words</button></Link> : ''}
                </div>

            </div>

        )
    }
}

export default Dictionary;
