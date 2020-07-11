import React, {Component} from 'react';
// import {BrowserRouter as Router,Link} from "react-router-dom";


import './Game5.css'

// class Game5 extends Component{
//   constructor(props){
//     super(props)
//     this.state={
//        loading: true,
//        Game:false,
//        group:0,
//        page:0,
//        word:0,
//        statistic:{
//          trueWords:[],
//          falseWords:[]
//        }
//     }
//     this.requestWords = this.requestWords.bind(this)
//     this.startGame = this.startGame.bind(this)
//     this.nextWord = this.nextWord.bind(this)
//   }
//   componentDidMount(){
//     this.requestWords()
//   }
  
//   requestWords(){
//      fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=${this.state.page}&group=${this.state.group}`)
//      .then(res=>res.json())
//      .then(data=>{
//        this.setState({
//          words: data,
//          loading:false
//        })
//        console.log(data)
//        console.log(this.state)
//       })
//   }
//  startGame(){
//    this.setState({
//      startGame: !this.state.startGame
//    })
//  }

//   nextWord(){
//     if(this.state.word < 19){
//       this.setState({
//         word:this.state.word+1
//       })
//     }else if(this.state.page < 29){
//       this.setState({
//         page: this.state.page+1,
//         loading: true,
//         word:0
//       })
//       this.requestWords()
//     }else if(this.state.group < 5){
//       this.setState({
//         group: this.state.group+1,
//         page: 0,
//         loading: true,
//         word:0
//       })
//       this.requestWords()
//     }
//   }

//   render(){
//     if(this.state.loading){
//       return <div className="Game5"><Loading /></div>
//     }else {
//       return(
//           <div className="Game5">
//             <div>{this.state.words[this.state.word].word}</div>
//             <button onClick={this.nextWord}>True</button>
//             <button onClick={this.nextWord}>False</button>
//           </div>
//         )
//     }
//   }
// }
// export default Game5

import Loading from './Components/Loading'
import Game from './Components/Game'
import Statistic from './Components/Statistic'
import HomePage from './Components/HomePage'

import video from  './images/background-video.mp4'
class Game5 extends Component{
  constructor(props){
    super(props)
    this.state={
      difficultyGameSavannah: '9',
      startGame: false,
      loading: false,
      statistic: false
    }

    this.handleLoading = this.handleLoading.bind(this)
    this.handleGame = this.handleGame.bind(this)
    this.requestWords = this.requestWords.bind(this)
    // this.requestWordsSynonyms = this.requestWordsSynonyms.bind(this)
    this.handleDifficultyGameSavannah = this.handleDifficultyGameSavannah.bind(this)

  }
  handleDifficultyGameSavannah(value){
    this.setState({
     difficultyGameSavannah:value
    })
 }

  componentDidMount(){
    this.requestWords()
    // .then(res=>this.requestWordsSynonyms(res)).then(data=> console.log(data))
  }

  handleLoading(){
    this.setState({
      loading: !this.state.loading
    })
  }
  handleGame(){
    this.setState({
      startGame: !this.state.startGame,
      loading: !this.state.loading
    })
  }
  // async requestWordsSynonyms(res){
  //   return Promise.all(
  //     res.map((word)=> this.qwe(word))
  //   )
  // }
  // qwe =(word)=>{
  //   return fetch(`https://dictionary.skyeng.ru/api/public/v1/words/search?search=${word.word}`)
  //   .then(res =>  res.json())
  //   .then(data => {
  //     // let DATA= [
  //     //   data[0].meanings[0].translation.text,
  //     //   data[1].meanings[0].translation.text,

  //     // ]
  //     return data
  //     // console.log(data)
  //   })
  // }
 async requestWords(){
  
  

  // const getAggregateUserWords = async () => {
    // %7B%22%24or%22%3A%5B%7B%22%24and%22%3A%5B%7B%22userWord.optional.deleted%22%3A%22false%22%2C%20%22userWord.optional.hardWord%22%3Afalse%7D%5D%7D%2C%7B%22userWord%22%3Anull%7D%5D%7D
    // const ourFilter = {"userWord.difficulty":"hard", "userWord.optional.key":"value"};


  //   const rawResponse = await fetch(`https://afternoon-falls-25894.herokuapp.com/users/${localStorage.getItem('userId')}/aggregatedWords?filter=%7B%22%24or%22%3A%5B%7B%22userWord.optional.deleted%22%3Afalse%2C%20%22userWord.optional.hardWord%22%3Afalse%7D%5D%7D`, {
  //     method: 'GET',
  //     withCredentials: true,
  //     headers: {
  //       'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       'Accept': 'application/json',
  //     }
  //   });
  //   const content = await rawResponse.json();
  //   const result = content[0].paginatedResults;
  //   this.setState({
  //     words: result,
  //   })
  //   console.log(result);
  // };
  // getAggregateUserWords()



  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const baseUrl = 'https://afternoon-falls-25894.herokuapp.com'

  const getAllUserWords = async () => {
    const rawResponse = await fetch(`${baseUrl}/users/${userId}/words/`, {
      method: 'GET',
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      }
    });
    const content = await rawResponse.json();
    return content
     
  };
  
  const filterUserWords = async () => {
    const userWords = await getAllUserWords();
    const currentDate = new Date();
    const wordsForGame = userWords.filter(word => word.optional.deleted===false && word.optional.hardWord===false && word.optional.nextTrain <= +currentDate);
    return wordsForGame;
  }
  filterUserWords().then(wordsId=>{
    console.log(wordsId)
    return Promise.all(wordsId.map((wordId)=>getWordById(wordId.wordId))
  )
  }).then(res=>{
    console.log(res)
      this.setState({
        words: res,
      })
  })
  



  const getWordById = async (wordId) => {
    const url = `${baseUrl}/words/${wordId}?noAssets=true`;
    const rawResponse = await fetch(url);
    const content = await rawResponse.json();
    // console.log(content)
    return content;
  }



    // fetch(`https://afternoon-falls-25894.herokuapp.com/words?page=0&group=3`)
    //      .then(res=>res.json())
    //      .then(data=>{
    //       //  return data
    //        this.setState({
    //          words: data,
    //        })
    //       })

  }

  render(){
    
    if(this.state.startGame){
      return(
        <div  id="video-bg">
          <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
          <Game  difficulty={this.state.difficultyGameSavannah} words={this.state.words}/>
        </div>
      )   
    }else if(this.state.loading){
      return(
        <div  id="video-bg">
           <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
          <Loading timer={3}  handleGame={this.handleGame}/>
        </div>
      )
    }else if(this.state.statistic){
      return(
        <div id="video-bg">
          <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
          </video>
          <Statistic />
        </div>
      )
    }else {
      return(
        <div  id="video-bg">
            <video id="background-video" loop autoPlay>
              <source src={video} type='video/mp4' />
            </video>
            {/* <Statistic true={book1} false={book1}/> */}
          <HomePage handleLoading={this.handleLoading} handleDifficulty ={this.handleDifficultyGameSavannah} difficulty={this.state.difficultyGameSavannah}/>
        </div>
      )
    }
    
  }
}
export default Game5



const book1 = [
  {
  "word": "agree",
  "image": "files/01_0001.jpg",
  "audio": "files/01_0001.mp3",
  "audioMeaning": "files/01_0001_meaning.mp3",
  "audioExample": "files/01_0001_example.mp3",
  "textMeaning": "To agree is to have the same opinion or belief as another person",
  "textExample": "The students agree they have too much homework",
  "transcription": "[əgríː]",
  "wordTranslate": "согласна",
  "textMeaningTranslate": "Согласиться - значит иметь то же мнение или убеждение, что и другой человек",
  "textExampleTranslate": "Студенты согласны, что у них слишком много домашней работы",
  "id": 1
},
{
  "word": "alcohol",
  "image": "files/01_0002.jpg",
  "audio": "files/01_0002.mp3",
  "audioMeaning": "files/01_0002_meaning.mp3",
  "audioExample": "files/01_0002_example.mp3",
  "textMeaning": "Alcohol is a type of drink that can make people drunk",
  "textExample": "A person should not drive a car after he or she has been drinking alcohol",
  "transcription": "[ǽlkəhɔ̀ːl]",
  "wordTranslate": "алкоголь",
  "textMeaningTranslate": "Алкоголь - это тип напитка, который может сделать людей пьяными",
  "textExampleTranslate": "Человек не должен водить машину после того, как он выпил алкоголь",
  "id": 2
},
{
  "word": "arrive",
  "image": "files/01_0003.jpg",
  "audio": "files/01_0003.mp3",
  "audioMeaning": "files/01_0003_meaning.mp3",
  "audioExample": "files/01_0003_example.mp3",
  "textMeaning": "To arrive is to get somewhere",
  "textExample": "They arrived at school at 7 a.m",
  "transcription": "[əráiv]",
  "wordTranslate": "прибыть",
  "textMeaningTranslate": "Приехать значит попасть куда-то",
  "textExampleTranslate": "Они прибыли в школу в 7 часов утра",
  "id": 3
},
{
  "word": "August",
  "image": "files/01_0004.jpg",
  "audio": "files/01_0004.mp3",
  "audioMeaning": "files/01_0004_meaning.mp3",
  "audioExample": "files/01_0004_example.mp3",
  "textMeaning": "August is the eighth month of the year",
  "textExample": "Is your birthday in August?",
  "transcription": "[ɔ́ːgəst]",
  "wordTranslate": "август",
  "textMeaningTranslate": "Август - восьмой месяц года",
  "textExampleTranslate": "У тебя день рождения в августе?",
  "id": 4
},
{
  "word": "boat",
  "image": "files/01_0005.jpg",
  "audio": "files/01_0005.mp3",
  "audioMeaning": "files/01_0005_meaning.mp3",
  "audioExample": "files/01_0005_example.mp3",
  "textMeaning": "A boat is a vehicle that moves across water",
  "textExample": "There is a small boat on the lake",
  "transcription": "[bout]",
  "wordTranslate": "лодка",
  "textMeaningTranslate": "Лодка - это транспортное средство, которое движется по воде",
  "textExampleTranslate": "На озере есть маленькая лодка",
  "id": 5
},
{
  "word": "breakfast",
  "image": "files/01_0006.jpg",
  "audio": "files/01_0006.mp3",
  "audioMeaning": "files/01_0006_meaning.mp3",
  "audioExample": "files/01_0006_example.mp3",
  "textMeaning": "Breakfast is the morning meal",
  "textExample": "I ate eggs for breakfast",
  "transcription": "[brekfəst]",
  "wordTranslate": "завтрак",
  "textMeaningTranslate": "Завтрак - это утренняя трапеза",
  "textExampleTranslate": "Я ел яйца на завтрак",
  "id": 6
},
{
  "word": "camera",
  "image": "files/01_0007.jpg",
  "audio": "files/01_0007.mp3",
  "audioMeaning": "files/01_0007_meaning.mp3",
  "audioExample": "files/01_0007_example.mp3",
  "textMeaning": "A camera is a piece of equipment that takes pictures",
  "textExample": "I brought my camera on my vacation",
  "transcription": "[kǽmərə]",
  "wordTranslate": "камера",
  "textMeaningTranslate": "Камера - это часть оборудования, которая делает снимки",
  "textExampleTranslate": "Я принес свою камеру в отпуск",
  "id": 7
},
{
  "word": "capital",
  "image": "files/01_0008.jpg",
  "audio": "files/01_0008.mp3",
  "audioMeaning": "files/01_0008_meaning.mp3",
  "audioExample": "files/01_0008_example.mp3",
  "textMeaning": "A capital is a city where a country’s government is based",
  "textExample": "The capital of the United States is Washington, D.C",
  "transcription": "[kæpətl]",
  "wordTranslate": "столица",
  "textMeaningTranslate": "Столица - это город, в котором базируется правительство страны",
  "textExampleTranslate": "Столица Соединенных Штатов - Вашингтон, округ Колумбия",
  "id": 8
},
{
  "word": "catch",
  "image": "files/01_0009.jpg",
  "audio": "files/01_0009.mp3",
  "audioMeaning": "files/01_0009_meaning.mp3",
  "audioExample": "files/01_0009_example.mp3",
  "textMeaning": "To catch is to grab or get something",
  "textExample": "Did you catch the ball during the baseball game?",
  "transcription": "[kætʃ]",
  "wordTranslate": "поймать",
  "textMeaningTranslate": "Поймать - значит схватить или получить что-то",
  "textExampleTranslate": "Вы поймали мяч во время игры в бейсбол?",
  "id": 9
},
{
  "word": "duck",
  "image": "files/01_0010.jpg",
  "audio": "files/01_0010.mp3",
  "audioMeaning": "files/01_0010_meaning.mp3",
  "audioExample": "files/01_0010_example.mp3",
  "textMeaning": "A duck is a small water bird",
  "textExample": "People feed ducks at the lake",
  "transcription": "[dʌk]",
  "wordTranslate": "утка",
  "textMeaningTranslate": "Утка - маленькая водяная птица",
  "textExampleTranslate": "Люди кормят уток у озера",
  "id": 10
},
{
  "word": "enjoy",
  "image": "files/01_0011.jpg",
  "audio": "files/01_0011.mp3",
  "audioMeaning": "files/01_0011_meaning.mp3",
  "audioExample": "files/01_0011_example.mp3",
  "textMeaning": "To enjoy is to like something",
  "textExample": "The woman enjoys riding her bicycle",
  "transcription": "[indʒɔ́i]",
  "wordTranslate": "наслаждаться",
  "textMeaningTranslate": "Наслаждаться значит любить что-то",
  "textExampleTranslate": "Женщина любит кататься на велосипеде",
  "id": 11
},
{
  "word": "invite",
  "image": "files/01_0012.jpg",
  "audio": "files/01_0012.mp3",
  "audioMeaning": "files/01_0012_meaning.mp3",
  "audioExample": "files/01_0012_example.mp3",
  "textMeaning": "To invite is to ask someone to come to a place or event",
  "textExample": "I will invite my friends to my birthday party",
  "transcription": "[inváit]",
  "wordTranslate": "пригласить",
  "textMeaningTranslate": "Пригласить - это попросить кого-нибудь прийти на место или событие",
  "textExampleTranslate": "Я приглашаю своих друзей на мой день рождения",
  "id": 12
},
{
  "word": "love",
  "image": "files/01_0013.jpg",
  "audio": "files/01_0013.mp3",
  "audioMeaning": "files/01_0013_meaning.mp3",
  "audioExample": "files/01_0013_example.mp3",
  "textMeaning": "To love is to like something or someone a lot",
  "textExample": "I love my family very much",
  "transcription": "[lʌv]",
  "wordTranslate": "любовь",
  "textMeaningTranslate": "Любить значит любить что-то или кого-то много",
  "textExampleTranslate": "Я очень люблю свою семью",
  "id": 13
},
{
  "word": "month",
  "image": "files/01_0014.jpg",
  "audio": "files/01_0014.mp3",
  "audioMeaning": "files/01_0014_meaning.mp3",
  "audioExample": "files/01_0014_example.mp3",
  "textMeaning": "A month is one of 12 periods of time in one year",
  "textExample": "January is the first month of the year",
  "transcription": "[mʌnθ]",
  "wordTranslate": "месяц",
  "textMeaningTranslate": "Месяц - это один из 12 периодов времени в году",
  "textExampleTranslate": "январь - первый месяц года",
  "id": 14
},
{
  "word": "travel",
  "image": "files/01_0015.jpg",
  "audio": "files/01_0015.mp3",
  "audioMeaning": "files/01_0015_meaning.mp3",
  "audioExample": "files/01_0015_example.mp3",
  "textMeaning": "To travel is to go to a faraway place on vacation or business",
  "textExample": "They will travel to Argentina this summer",
  "transcription": "[trǽvəl]",
  "wordTranslate": "путешествовать",
  "textMeaningTranslate": "Путешествовать - это отправиться в далекое место на отдых или по делам",
  "textExampleTranslate": "Этим летом они отправятся в Аргентину",
  "id": 15
},
{
  "word": "typical",
  "image": "files/01_0016.jpg",
  "audio": "files/01_0016.mp3",
  "audioMeaning": "files/01_0016_meaning.mp3",
  "audioExample": "files/01_0016_example.mp3",
  "textMeaning": "If something is typical, it is normal, or something that usually happens",
  "textExample": "My typical breakfast is toast and eggs",
  "transcription": "[típikəl]",
  "wordTranslate": "типичный",
  "textMeaningTranslate": "Если что-то типичное, это нормально, или что-то, что обычно происходит",
  "textExampleTranslate": "Мой типичный завтрак - тост и яйца",
  "id": 16
},
{
  "word": "visit",
  "image": "files/01_0017.jpg",
  "audio": "files/01_0017.mp3",
  "audioMeaning": "files/01_0017_meaning.mp3",
  "audioExample": "files/01_0017_example.mp3",
  "textMeaning": "To visit is to go and spend time in another place or see another person",
  "textExample": "She wants to visit her grandmother",
  "transcription": "[vízit]",
  "wordTranslate": "посещение",
  "textMeaningTranslate": "Посетить - значит пойти и провести время в другом месте или увидеть другого человека",
  "textExampleTranslate": "Она хочет навестить свою бабушку",
  "id": 17
},
{
  "word": "weather",
  "image": "files/01_0018.jpg",
  "audio": "files/01_0018.mp3",
  "audioMeaning": "files/01_0018_meaning.mp3",
  "audioExample": "files/01_0018_example.mp3",
  "textMeaning": "Weather is the temperature and the state of the outdoors",
  "textExample": "Today’s weather is rainy and cloudy",
  "transcription": "[weðər]",
  "wordTranslate": "погода",
  "textMeaningTranslate": "Погода это температура и состояние на улице",
  "textExampleTranslate": "Сегодня погода дождливая и облачная",
  "id": 18
},
{
  "word": "week",
  "image": "files/01_0019.jpg",
  "audio": "files/01_0019.mp3",
  "audioMeaning": "files/01_0019_meaning.mp3",
  "audioExample": "files/01_0019_example.mp3",
  "textMeaning": "A week is a period of time that is seven days long",
  "textExample": "What are you doing next week?",
  "transcription": "[wiːk]",
  "wordTranslate": "неделя",
  "textMeaningTranslate": "Неделя - это период времени, который длится семь дней",
  "textExampleTranslate": "Что ты делаешь на следующей неделе?",
  "id": 19
},
{
  "word": "wine",
  "image": "files/01_0020.jpg",
  "audio": "files/01_0020.mp3",
  "audioMeaning": "files/01_0020_meaning.mp3",
  "audioExample": "files/01_0020_example.mp3",
  "textMeaning": "Wine is an alcoholic drink made from grapes",
  "textExample": "The store carried both red and white wine",
  "transcription": "[wain]",
  "wordTranslate": "вино",
  "textMeaningTranslate": "Вино - это алкогольный напиток из винограда",
  "textExampleTranslate": "В магазине было красное и белое вино",
  "id": 20
},
{
  "word": "adventure",
  "image": "files/02_0021.jpg",
  "audio": "files/02_0021.mp3",
  "audioMeaning": "files/02_0021_meaning.mp3",
  "audioExample": "files/02_0021_example.mp3",
  "textMeaning": "An adventure is a fun or exciting thing that you do",
  "textExample": "Riding in the rough water was an adventure",
  "transcription": "[ədvéntʃər]",
  "wordTranslate": "приключение",
  "textMeaningTranslate": "Приключение - это забавная или захватывающая вещь, которую ты делаешь",
  "textExampleTranslate": "Езда в бурной воде была приключением",
  "id": 21
},
{
  "word": "approach",
  "image": "files/02_0022.jpg",
  "audio": "files/02_0022.mp3",
  "audioMeaning": "files/02_0022_meaning.mp3",
  "audioExample": "files/02_0022_example.mp3",
  "textMeaning": "To approach something means to move close to it",
  "textExample": "The boy approached his school",
  "transcription": "[əpróutʃ]",
  "wordTranslate": "подходить",
  "textMeaningTranslate": "Подойти к чему-то - значит приблизиться к нему",
  "textExampleTranslate": "Мальчик приблизился к своей школе",
  "id": 22
},
{
  "word": "carefully",
  "image": "files/02_0023.jpg",
  "audio": "files/02_0023.mp3",
  "audioMeaning": "files/02_0023_meaning.mp3",
  "audioExample": "files/02_0023_example.mp3",
  "textMeaning": "Carefully means with great attention, especially to detail or safety",
  "textExample": "The baby carefully climbed down the stairs",
  "transcription": "[kɛ́ərfəli]",
  "wordTranslate": "внимательно",
  "textMeaningTranslate": "Осторожно означает с большим вниманием, особенно к деталям или безопасности",
  "textExampleTranslate": "Малыш осторожно спускался по лестнице",
  "id": 23
},
{
  "word": "chemical",
  "image": "files/02_0024.jpg",
  "audio": "files/02_0024.mp3",
  "audioMeaning": "files/02_0024_meaning.mp3",
  "audioExample": "files/02_0024_example.mp3",
  "textMeaning": "A chemical is something that scientists use in chemistry",
  "textExample": "The scientist mixed the chemicals",
  "transcription": "[kémikəl]",
  "wordTranslate": "химический",
  "textMeaningTranslate": "Химическое вещество - это то, что ученые используют в химии",
  "textExampleTranslate": "Ученый смешал химикаты",
  "id": 24
},
{
  "word": "create",
  "image": "files/02_0025.jpg",
  "audio": "files/02_0025.mp3",
  "audioMeaning": "files/02_0025_meaning.mp3",
  "audioExample": "files/02_0025_example.mp3",
  "textMeaning": "To create means to make something new",
  "textExample": "She created an igloo from blocks of snow",
  "transcription": "[kriéit]",
  "wordTranslate": "создайте",
  "textMeaningTranslate": "Создать значит создать что-то новое",
  "textExampleTranslate": "Она создала иглу из снежных глыб",
  "id": 25
},
{
  "word": "evil",
  "image": "files/02_0026.jpg",
  "audio": "files/02_0026.mp3",
  "audioMeaning": "files/02_0026_meaning.mp3",
  "audioExample": "files/02_0026_example.mp3",
  "textMeaning": "Evil describes something or someone bad or cruel, not good",
  "textExample": "They felt a strange, evil presence as they got closer to the house",
  "transcription": "[íːvəl]",
  "wordTranslate": "злой",
  "textMeaningTranslate": "Зло описывает что-то или кого-то плохого или жестокого, а не хорошего",
  "textExampleTranslate": "Они почувствовали странное злое присутствие, когда приблизились к дому",
  "id": 26
}]