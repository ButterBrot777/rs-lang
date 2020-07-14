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

    paginationFunc = (currentTypeData, page) => {
        let leftArrowStyle = {};
        let rightArrowStyle = {};
        if (page === 1) {
            leftArrowStyle.color = "rgba(168, 167, 167, 0.6)";
        } else {
            leftArrowStyle.color = "rgba(19,40,59)";
        }
        if (page === Math.ceil(currentTypeData.length / 10)) {
            rightArrowStyle.color = "rgba(168, 167, 167, 0.6)";
        } else {
            rightArrowStyle.color = "rgba(19,40,59)";
        }
        const currentPageDataArr = currentTypeData.slice((page-1)*10, page*10);
        this.setState({ currentData: currentPageDataArr, page: page, leftArrowStyle: leftArrowStyle, rightArrowStyle: rightArrowStyle });
    }

    getNextPage = () => {
        if (this.state.words === 'learning') {
            if (Math.ceil(this.state.learningWords.length / 10) > this.state.page) {
                const page = this.state.page + 1;
                this.paginationFunc(this.state.learningWords, page);
            } else {
                const page = this.state.page;
                this.paginationFunc(this.state.learningWords, page);
            }
        } else if (this.state.words === 'hard') {
            if (Math.ceil(this.state.hardWords.length / 10) > this.state.page) {
                const page = this.state.page + 1;
                this.paginationFunc(this.state.hardWords, page);
            } else {
                const page = this.state.page;
                this.paginationFunc(this.state.hardWords, page);
            }
        } else {
            if (Math.ceil(this.state.hardWords.length / 10) > this.state.page) {
                const page = this.state.page + 1;
                this.paginationFunc(this.state.deletedWords, page)
            } else {
                const page = this.state.page;
                this.paginationFunc(this.state.deletedWords, page)
            }
        }
    }

    getPrevPage = () => {
        if (this.state.page > 1) {
            const page = this.state.page - 1;
            if (this.state.words === 'learning') {
                this.paginationFunc(this.state.learningWords, page);
            } else if (this.state.words === 'hard') {
                this.paginationFunc(this.state.hardWords, page);
            } else {
                this.paginationFunc(this.state.deletedWords, page)
            }
        } else {
            const page = 1;
            if (this.state.words === 'learning') {
                this.paginationFunc(this.state.learningWords, page);
            } else if (this.state.words === 'hard') {
                this.paginationFunc(this.state.hardWords, page);
            } else {
                this.paginationFunc(this.state.deletedWords, page)
            }
        }  
    }

    getLearning = () => {
        const learningWords = this.state.learningWords;
        this.paginationFunc(learningWords, 1);
        this.setState({ page: 1, words: 'learning', isLoading: false, });
    }

    getHard = () => {
        const hardWords = this.state.hardWords;
        this.paginationFunc(hardWords, 1);
        this.setState({ page: 1, words: 'hard', isLoading: false, });
    }

    getDeleted = () => {
        const deletedWords = this.state.deletedWords;
        this.paginationFunc(deletedWords, 1);
        this.setState({ page: 1, words: 'deleted', isLoading: false, });
    }

    updateAllData = (wordObj) => {
        const newAllData = this.state.allData.map(word => word.wordId === wordObj.wordId ? wordObj : word);
        this.setState({ allData: newAllData, isLoading: false, })
        this.state.words === "hard" ? this.getHard() : this.getDeleted();
    }

    render() {
        const { currentData, words, isLoading, leftArrowStyle, rightArrowStyle } = this.state;
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
                <div className="dictionary-arrows-container">
                    <p className="dictionary-arrow-left" onClick={this.getPrevPage} style={leftArrowStyle}>&lt;</p>
                    <p className="dictionary-arrow-right" onClick={this.getNextPage} style={rightArrowStyle}>&gt;</p>
                </div>
                <div className="train-hard-btn-container">
                    {words === "hard" ? <Link to="/BasicGame"><button className="dictionary-btn train-hard-btn" onClick={this.props.handlehardWordsTraining}>Train hard words</button></Link> : ''}
                </div>
                

            </div>

        )
    }
}

export default Dictionary;
