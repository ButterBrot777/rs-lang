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
      "repeatsStreak": number, // кол-во повторов до изменения сложности
      "repeatsTotal": number, // общее кол-во повторов
      "addingDate": "number", // таймстамп, дата добавления слова
      "lastTrain": "number", // таймстамп
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
    const wordsForGame = userWords.filter(word => word.optional.deleted===false && word.optional.hardWord===false && word.optional.nextTrain <= +currentDate);
    return wordsForGame;
  }
```

Если ваша игра требует определенное количество слов, проверте длину массива, хватает ли их. Если нет, слова нужно добрать из новых.
Если у вас нет конкретного лимита слов, нужно запросить дополнительный массив новых слов, или дозапрашивать их по ходу игры (зависит от вашей реализации).

Чтобы определить с какого уровня сложности и страницы запрашивать слова, необходимо сделать запрос GET на Users/Settings.
Придет объект вида:
```javascript
{
  "wordsPerDay": 20,
    "optional": {
      "maxWordsPerDay": 40,
      "level": 0,
      "page": 0,
      "wordsLearntPerPage": 0,
      "hints": {
        "meaningHint": true,
        "translationHint": true,
        "exampleHint": true,
        "soundHint": false,
        "imageHint": false,
        "transcriptionHint": false
    }
  }
}
```
После этого сделать запрос GET на Words, сo свойствами group=level и page=page. Из массива, который прийдет, взять слова, которые после уже изученного количества слов на странице (wordsLearntPerPage).



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
      "repeatsStreak": number, // увеличить на 1
      "repeatsTotal": number, // увеличить на 1
      "addingDate": "number", // не изменяется
      "lastTrain": "number", // записать дату этой игры
      "nextTrain": "number" // записать дату следующей тренировки*
    }
  }
]
```
*если правильный ответ, то nextTrain = lastTrain + interval.
```javascript
// базовый интервал по сложностям:
easyInterval = 3 * 86 400 000; // три дня для "difficulty": "easy"
goodInterval = 2 * 86 400 000; // два дня для "difficulty": "good"
hardInterval = 86 400 000; // один день для "difficulty": "hard"
// умножаем на количество повторов (это особенность интервального повторения)
interval = repeatsStreak * hardInterval (или good, или easy в зависимости от того, какая "difficulty")
nextTrain = lastTrain + interval;
```
*если неправильные ответ, то nextTrain = lastTrain

Если запрос POST, то передеваемый объект такого вида:
```javascript
[
  {
    "difficulty": "string", // записать сложность в зависимотси от ответа*
    "optional": {
      "deleted": false, 
      "hardWord": false,
      "repeatsStreak": 1,
      "repeatsTotal": 1,
      "addingDate": "number", // записать дату этой игры
      "lastTrain": "string", // записать дату этой игры
      "nextTrain": "string" // записать дату следующей тренировки*
    }
  }
]
```
*если правильный ответ, то:
 "difficulty": "good",
 nextTrain = lastTrain + goodInterval.
 goodInterval = 2 * 86 400 000; // два дня для "difficulty": "good"

*если неправильные ответ, то:
"difficulty": "hard",
 nextTrain = lastTrain

**3.  По окончанию игры необходимо  вывести уведомление о результе игры и обновить долгосрочную статистику:**
Уведомление о результате игры состоит из двух списков:
*список ошибочных слов и их количество
*список правильных слов и их кол-во

3.1. для обновления долгострочной статистики вначале нужно запросить актуальную статистику запросом GET на User/Statistic. Придет объект вида:

```javascript
{
  "learnedWords": 0,
  "optional": {
    "dateOfReg": "number", // таймстамп, дата регистрации пользователя
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
  "wordsPerDay": 20,
  "optional": {
    "maxWordsPerDay": 40,
    "level": 0, // изменить в соответствии с тем, с какой группы последнее изученное слово
    "page": 0, // изменить в соответствии с тем, с какой старницы последнее изученное слово
    "wordsLearntPerPage": 0, // изменить на количество изученных слов со страницы
    "hints": {
      "meaningHint": true,
      "translationHint": true,
      "exampleHint": true,
      "soundHint": false,
      "imageHint": false,
      "transcriptionHint": false
    }
  }
}
```
