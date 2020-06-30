**1. В начале игры делаете GET запрос на User/Words, чтоб получить изучаемые пользователем слова**

Этот проммис (и все последующие запросы) нужно будет импортировать из файлика с запросами (который пока в разработке).

Запрос возвращает массив объектов вида:

```javascript
[
  {
    "difficulty": "string", // 'hard', 'good', 'easy'
    "optional": {
      "deleted": false, // or true
      "hardWord": false, // or true
      "addingDate": "number", // таймстамп, дата добавления словав
      "lastTrain": "number", // таймстамп
      "repeats": "number",
      "nextTrain": "number" // таймстамп
    }
  }
]
```

Необходимо отфильтровать этот массив, как-то так (может написан бред, исправьте меня, если что):

```javascript
  cosnt filterUserWords = async () => {
    const userWords = await getUserWords(userId, token);
    const currentDate = new Date();
    const wordsForGame = userWords.filter(word => word.optional.deleted===false && word.optional.hardWord===false && word.nextTrain <= +currentDate);
    return wordsForGame;
  }
```

Если ваша игра требует определенное количество слов, проверте длину массива, хватает ли их. Если нет, слова нужно добрать из новых.
Если у вас нет конкретного лимита слов, нужно запросить дополнительный массив новых слов, или дозапрашивать их по ходу игры (зависит от вашей реализации).

Чтобы определить с какого уровня сложности и страницы запрашивать слова, необходимо сделать запрос GET на Users/Settings.
Придет объект вида:
```javascript
{
  "wordsPerDay": 10,
  "optional": {
    "lastWordsGroup": number,
    "lastWordsPage": number,
    "lastWord": "string", // id последнего изученного слова
    "basicGame": {
      "cardsPerDay": 20,
      "isTranslation": true,
      "isMeaning": true,
      "isExample": true,
      "isTranscription": true,
      "isImage": true,
    }
  }
}
```
После этого сделать запрос GET на Words, сo свойствами group=lastWordsGroup и page=lastWordsPage. Из массива, который прийдет, взять слова, которые после lastWord.



**2. Каждое отыграное слово необходимо обновить:**

* запросом PUT на User/Words, если слово было взято из User/Words.
* запросом POST на User/Words, если слово было новое.

Если запрос PUT, то передеваемый объект такого вида:
```javascript
[
  {
    "difficulty": "string", // не изменяется
    "optional": {
      "deleted": false, // не изменяется
      "hardWord": false, // не изменяется
      "addingDate": "number", // не изменяется
      "lastTrain": "number", // записать дату этой игры
      "repeats": "number", // увеличить на 1
      "nextTrain": "number" // записать дату следующей тренировки*
    }
  }
]
```
*если правильный ответ, то nextTrain = lastTrain + 1 день (интервал еще уточним). 
*если неправильные ответ, то nextTrain = lastTrain

Если запрос POST, то передеваемый объект такого вида:
```javascript
[
  {
    "difficulty": "",
    "optional": {
      "deleted": false, 
      "hardWord": false,
      "addingDate": "number", // записать дату этой игры
      "lastTrain": "string", // записать дату этой игры
      "repeats": 1,
      "nextTrain": "string" // записать дату следующей тренировки*
    }
  }
]
```
*если правильный ответ, то nextTrain = lastTrain + 1 день (интервал еще уточним). 
*если неправильные ответ, то nextTrain = lastTrain

**3.  По окончанию игры необходимо  вывести уведомление о результе игры и обновить долгосрочную статистику:**
Уведомление о результате игры состоит из двух списков:
*список ошибочных слов и их количество
*список правильных слов и их кол-во

3.1. для обновления долгострочной статистики вначале нужно запросить актуальную статистику запросом GET на User/Statistic. Придет объект вида:

```javascript
{
  "learnedWords": 0,
  "optional": {
    "basic": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
    "speakIt": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
    "puzzle": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
    "savannah": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
    "sprint": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
    "audioCall": [
      {
        "date": "string",
        "errors": number,
        "trues": number,
      },
      ...
    ],
  }
}
```

3.2. Запушить в массив optional[название вашей игры] объект с результатом текущей игры вида:
```javascript
{
  "date": "string", // дата игры
  "errors": number, // кол-во ошибок
  "trues": number, // кол-во правильных ответов
},
```

3.3. Вернуть обновленную статистику на сервер запросом PUT на User/Statistic 

3.4. Если в игре использовались новые слова, необходимо обновить User/Settings запросом PUT, отправив такой объект:
```javascript
{
  "wordsPerDay": 10,
  "optional": {
    "lastWordsGroup": number, // изменить в соответствии с тем, с какой группы последнее изученное слово
    "lastWordsPage": number, // изменить в соответствии с тем, с какой старницы последнее изученное слово
    "lastWord": "string", // изменить на id последнего изученного слова
    "basicGame": {
      "cardsPerDay": 20,
      "isTranslation": true,
      "isMeaning": true,
      "isExample": true,
      "isTranscription": true,
      "isImage": true,
    }
  }
}
```
