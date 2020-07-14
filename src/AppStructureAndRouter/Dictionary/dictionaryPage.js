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
            learningWords: [],
            hardWords: [],
            deletedWords: [],
            page: 1,
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
        this.getWordsByType();
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

    getWordsByType = () => {
        const learningWords = this.state.allData.filter(word => word.optional.deleted === false && word.optional.hardWord === false);
        const hardWords = this.state.allData.filter(word => word.optional.hardWord === true);
        const deletedWords = this.state.allData.filter(word => word.optional.deleted === true);
        this.setState({ learningWords: learningWords, hardWords: hardWords, deletedWords: deletedWords });
    }

    getCurrentWordsByPage = (currentTypeData, page) => {
        
        const currentPageDataArr = currentTypeData.slice((page-1)*10, page*10);
        this.setState({ currentData: currentPageDataArr, page: page });
    }

    getNextPage = () => {
        const page = Math.ceil(this.state[`${this.state.words}Words`].length / 10) > this.state.page ? this.state.page + 1 : this.state.page;
        this.getCurrentWordsByPage(this.state[`${this.state.words}Words`], page);
    }

    getPrevPage = () => {
        const page = this.state.page > 1 ? this.state.page - 1 : 1; 
        this.getCurrentWordsByPage(this.state[`${this.state.words}Words`], page);
    }

    getLearning = () => {
        const learningWords = this.state.learningWords;
        this.getCurrentWordsByPage(learningWords, 1);
        this.setState({ page: 1, words: 'learning', isLoading: false, });
    }

    getHard = () => {
        const hardWords = this.state.hardWords;
        this.getCurrentWordsByPage(hardWords, 1);
        this.setState({ page: 1, words: 'hard', isLoading: false, });
    }

    getDeleted = () => {
        const deletedWords = this.state.deletedWords;
        this.getCurrentWordsByPage(deletedWords, 1);
        this.setState({ page: 1, words: 'deleted', isLoading: false, });
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

        let maxPage;
        if (words === 'learning') {
            maxPage = Math.ceil(this.state.learningWords.length / 10);
        } else if (words === 'hard') {
            maxPage = Math.ceil(this.state.hardWords.length / 10);
        } else {
            maxPage = Math.ceil(this.state.deletedWords.length / 10);
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
                <div className="dictionary-arrows-container">
                    <p className={this.state.page === 1 ? "dictionary-arrow-left dictionary-arrow-unable" : "dictionary-arrow-left"} onClick={this.getPrevPage} >&lt;</p>
                    <p className={this.state.page === maxPage ? "dictionary-arrow-right dictionary-arrow-unable" : "dictionary-arrow-right"} onClick={this.getNextPage} >&gt;</p>
                </div>
                <div className="train-hard-btn-container">
                    {words === "hard" ? <Link to="/BasicGame"><button className="dictionary-btn train-hard-btn" onClick={this.props.handlehardWordsTraining}>Train hard words</button></Link> : ''}
                </div>
            </div>

        )
    }
}

export default Dictionary;
