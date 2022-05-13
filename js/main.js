const backAudio = new Audio('media/ron-gelinas-chillout-lounge-where-will-i-go.mp3');
let counter = 1;
document.querySelector('.backMusic i').addEventListener('click', () => {
    counter++;
    if (counter % 2 == 0) {
        backAudio.play();
        backAudio.loop = true;
    } else {
        backAudio.pause();
    }
});

const wrapper = document.querySelector('.wrapper'),
    searchInput = wrapper.querySelector('input'),
    synonyms = wrapper.querySelector('.synonyms .list'),
    hintText = wrapper.querySelector('.hintText'),
    volumeIcon = wrapper.querySelector('.word i'),
    removeIcon = wrapper.querySelector('.searchArea span');
let audio;

function data(result, word) {
    // checking if the api response is empty or not
    if (result.title) {
        hintText.innerHTML = `Can't find the meaning of <span>"${word}"</span> ... Please, try to search for another word`;
    } else {
        console.log(result);
        // if the api response is not empty then we are going to display the data
        wrapper.classList.add('active');
        let definitions = result[0].meanings[0].definitions[0],
            phonetics = `${result[0].meanings[0].partOfSpeech} /${result[0].phonetics[0].text}/`;

        document.querySelector('.word p').innerText = result[0].word;
        document.querySelector('.word span').innerText = phonetics;
        document.querySelector('.meaning span').innerText = definitions.definition;
        document.querySelector('.example span').innerText = definitions.example;
        for (i = 0; i < result[0].phonetics.length; i++) {
            if (result[0].phonetics[i].audio) {
                audio = new Audio(result[0].phonetics[i].audio);
                break;
            }
        }


        // Getting only 7 results of synonyms
        synonyms.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            if (result[0].meanings[0].synonyms[i] != undefined) {
                synonyms.parentElement.style.display = 'block';
                let tag = `<span onclick="search('${result[0].meanings[0].synonyms[i]}')">${result[0].meanings[0].synonyms[i]}</span>`;
                synonyms.insertAdjacentHTML('beforeend', tag);
            } else {
                synonyms.parentElement.style.display = 'none';
            }
        }
    }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}

function fetchApi(word) {
    wrapper.classList.remove('active');
    hintText.style.color = '#111';
    hintText.innerHTML = `Searching the meaning of <span>"${word}"</span> ...`;

    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    // fetching api response from the url and returning it with parsing into js object and in another then
    // method calling data function to display the data by passing api response & searched word as arguments
    fetch(url)
        .then(
            res => res.json()
        ).then(
            result => data(result, word)
        );
}


searchInput.addEventListener('keyup', e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener('click', () => {
    audio.play();
    // console.log(audio);
});

removeIcon.addEventListener('click', () => {
    searchInput.value = '';
    searchInput.focus();
    wrapper.classList.remove('active');
    hintText.style.color = '#9a9a9a';
    hintText.innerHTML = `Type a word and press Enter to search for this word meaning, example, pronunciation & synonyms.`;
});