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

    componentDidMount = async () => {
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
        this.setState({data: content, isLoading: false,});
    }

    render() {
        const { data, isLoading } = this.state;
        if (isLoading) {
            return <p>Loading ...</p>;
        }
        return  (
            <div className="all-words">
                {data.map(element => <Word difficulty={element.difficulty} optional={element.optional} wordId={element.wordId} />)}
            </div>    
        )       
    }
}

export default Dictionary;