const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const MP_STORAGE = 'Music Player Config'

const musicPlayer = $('#music-player')
const playlist = $('#playlist')
const cdThum = $('#cd-thum')
const dashboard = $('#dashboard')
const toggleBtn = $('.play-toggle-btn')
const title = $('#dashboard h2')
const audio = $('#audio')
const progress = $('#progress-bar')
const nextBtn = $('.next-btn')
const preBtn = $('.precious-btn')
const rpBtn = $('.repeat-btn')
const rdBtn = $('.random-btn')
const singer = $('#dashboard > span')
const currentTime = $('#current-time')
const duration = $('#duration')


class App {
    /*config*/ 
    config = JSON.parse(localStorage.getItem(MP_STORAGE)) || {};
    isPlaying = false;
    setConfig(key, value){
        this.config[key] = value;
        localStorage.setItem(MP_STORAGE, JSON.stringify(this.config))
    }
    apllyConfig(){
        rpBtn.classList.toggle('active', this.isRepeat)
        rdBtn.classList.toggle('active', this.isRandom)
    }

    /*property */
    currentIndex = this.config['currentIndex'] ? this.config['currentIndex'] : 0;
    isRandom = this.config['isRandom'] ? this.config['isRandom'] : false;
    isRepeat = this.config['isRepeat'] ? this.config['isRepeat'] : false;
    songs = [
        {
            name: "There's no one at all",
            singer: 'Sơn Tùng M-TP',
            image: './assets/img/img1.png',
            path: './assets/songs/b1.mp3'

        },
        {
            name: 'Tướng quân',
            singer: 'Nhật Phong',
            image: './assets/img/img2.jpg',
            path: './assets/songs/b2.mp3'

        },
        {
            name: 'Ai mang cô đơn di',
            singer: 'K-ICM ft APJ',
            image: './assets/img/img3.jpg',
            path: './assets/songs/b3.mp3'

        },

        {
            name: 'Anh nhà ở đâu thế',
            singer: 'Amee',
            image: './assets/img/img4.jpg',
            path: './assets/songs/b4.mp3'

        },
        {
            name: 'Người lạ ơi',
            singer: 'Karik, Orange, Superbrothers',
            image: './assets/img/img5.jpg',
            path: './assets/songs/b5.mp3'

        }, {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng M-TP',
            image: './assets/img/img6.jpg',
            path: './assets/songs/b6.mp3'

        },
        {
            name: 'Đoạn tuyệt nàng đi',
            singer: ' Phát Huy T4',
            image: './assets/img/img7.jpg',
            path: './assets/songs/b7.mp3'

        },
        {
            name: 'Fly way',
            singer: 'TheFatRat',
            image: './assets/img/img8.jpg',
            path: './assets/songs/b8.mp3'

        },
        {
            name: 'Never be alone',
            singer: 'TheFatRat',
            image: './assets/img/img9.jpg',
            path: './assets/songs/b9.mp3'

        },
        {
            name: 'Save me',
            singer: 'Deamn',
            image: './assets/img/img10.jpg',
            path: './assets/songs/b10.mp3'
        },
        {
            name: "Hoa hải đường",
            singer: 'Jack',
            image: './assets/img/img11.jpg',
            path: './assets/songs/b11.mp3'

        }
    ];
    defineProperties() {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    }

    /*event */
    eventConditions = {
        progressUpdate: true
    }
    handleEvents() {
        const _this = this;

        //change cd thumnail when scroll
        const cdWidth = cdThum.offsetWidth;
        document.onscroll = () => {
            const scrollTop = document.documentElement.scrollTop || window.scrollY;
            var newWidth = cdWidth - scrollTop < 0 ? 0 : cdWidth - scrollTop

            cdThum.style.width = newWidth + 'px'
            cdThum.style.paddingTop = newWidth + 'px'
            cdThum.style.opacity = newWidth / cdWidth
        }

        const cdAnimation = cdThum.animate([
            { transform: 'rotate(360deg)' }
        ],
            {
                duration: 10000,
                iterations: Infinity
            })
        cdAnimation.pause()
        //play or pause
        toggleBtn.onclick = () => {
            _this.isPlaying = !_this.isPlaying
            if (_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }
        audio.onplay = () => {
            cdAnimation.play()
            musicPlayer.classList.add('playing')
            // if(audio.duration)
            //     duration.textContent = this.timeHandle(audio.duration)
        }
        audio.onpause = () => {
            cdAnimation.pause()
            musicPlayer.classList.remove('playing')
        }
        audio.oncanplay = () =>{
            setTimeout(() =>{
                duration.textContent = this.timeHandle(audio.duration)
            }, 250)
        }
        //rewind song
        progress.onchange = () => {
            audio.currentTime = audio.duration * progress.value / 100
            this.eventConditions.progressUpdate = true

            if(!this.isPlaying){
                toggleBtn.click()
            }
        }

        //gradient progress
        progress.oninput = () => {
            this.eventConditions.progressUpdate = false
            const currentPercent = +progress.value
            progress.style.backgroundImage = `linear-gradient(
                to right, 
                var(--primary-color) ${currentPercent}%,
                #8984B8 ${currentPercent}%)`
            currentTime.textContent = _this.timeHandle(audio.duration*currentPercent/100)
        }

        //update progress bar
        audio.ontimeupdate = () => {
            if (this.eventConditions.progressUpdate && audio.duration) {
                const currentPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = currentPercent
                currentTime.textContent = _this.timeHandle(audio.currentTime)
                progress.style.backgroundImage = `linear-gradient(
                to right, 
                var(--primary-color) ${currentPercent}%,
                #8984B8 ${currentPercent}%)`
            }
        }
        // song when end
        audio.onended = () => {
            setTimeout(() => {
                if (_this.isRepeat) {
                    audio.play()
                }
                else
                    nextBtn.click()
            }, 700)
        }
        //next button
        nextBtn.onclick = () => {
            if (_this.isRandom)
                this.playRandomSong()
            else
                this.playNextSong()
            this.updatePlaylist()
        }
        //previous button
        preBtn.onclick = () => {
            if (_this.isRandom)
                this.playRandomSong()
            else
                this.playPreviousSong()
            this.updatePlaylist()
        }


        //play song when click into playlist
        playlist.onclick = e => {
            const clickedNode = e.target.closest('.song:not(.active)')
            if (clickedNode) {
                _this.currentIndex = clickedNode.dataset.index;
                _this.playCurrentSong()
                this.updatePlaylist()
            }
        }
        //on/off random/repeat button
        rpBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat
            this.setConfig('isRepeat', _this.isRepeat)
            rpBtn.classList.toggle('active', _this.isRepeat)
        }
        rdBtn.onclick = () => {
            _this.isRandom = !_this.isRandom
            this.setConfig('isRandom', _this.isRandom)
            rdBtn.classList.toggle('active', _this.isRandom)
        }
    };
    scrollSong() {
        setTimeout(() => {
            $('.song.active').scrollIntoView()
        }, 250)
    }
    updatePlaylist() {
        $('.song.active').classList.remove('active')
        $(`.song[data-index="${this.currentIndex}"]`).classList.add('active')
        // this.scrollSong()
    }
    render() {
        let htmls = this.songs.map((song, index) => {
            return `<div class="song ${this.currentIndex === index ? 'active' : ''}" data-index="${index}">
                <div class="song__image">
                    <img src="${song.image}" alt="">
                </div>
                <div class="info">
                    <h3 class="song__name">${song.name}</h3>
                    <span class="singer-name">
                       ${song.singer}
                    </span>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('\n')
    };
    loadCurrentSong() {
        title.textContent = this.currentSong.name
        cdThum.style.backgroundImage = `url('${this.currentSong.image}')`
        singer.textContent = this.currentSong.singer
        audio.src = this.currentSong.path
        currentTime.textContent = '0:00'
        duration.textContent = '0:00'
        // console.log(audio.paused);
        // audio.load()
        // duration.textContent = this.timeHandle(audio.duration)
        
    }
    timeHandle(time){
        if(typeof time === 'number'){
            let minute = Math.floor(time/60)
            let second = Math.floor(time%60)

            if(second < 10)
                second = '0' + second
            
            return `${minute}:${second}`
        }
        return '0:00'
    }
    playCurrentSong() {
        this.loadCurrentSong()
        audio.play();
        this.setConfig('currentIndex', this.currentIndex)
    }
    playRandomSong() {
        do {
            var newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex == this.currentIndex)

        this.currentIndex = newIndex;
        this.playCurrentSong()
    }
    playNextSong() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length)
            this.currentIndex = 0
        this.playCurrentSong()
    }
    playPreviousSong() {
        this.currentIndex--
        if (this.currentIndex < 0)
            this.currentIndex = this.songs.length - 1;
        this.playCurrentSong()
    }
    start() {
        this.defineProperties()
        this.apllyConfig()
        this.loadCurrentSong()
        this.handleEvents()
        this.render()
    };
}

const app = new App()
app.start()
