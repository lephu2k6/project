const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const header = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('audio')
const cd = $('.cd-thumb');
const btnPlay = $('.btn.btn-toggle-play')
const play = $('.player')
const progress  = $('#progress')
const btnnext = $('.btn-next');
const btnprev = $('.btn-prev')
const btnrepeat = $('.btn-repeat')
const btnrandom = $('.btn-random')
const playlist = $('.playlist')
const app = {
    isRandom : false,
    currentIndex : 0 ,
    isPlaying : false ,
    isRepeat :false , 
    songs: [
        
        {
            name: 'Đi Giữa Trời Rực Rỡ' ,
            singer: 'Ngô Lan Hương',
            path :'./assets/music/song1.mp3',
            image: './assets/image/song1.jpg'
        },
        {
            name: 'Hẹn Ngày Mai Yêu' ,
            singer: 'Long Cao',
            path :'./assets/music/song2.mp3',
            image: './assets/image/song2.jpg'
        },
        {
            name: 'Bánh Mì Không' ,
            singer: 'Đạt G - DuUyên',
            path :'./assets/music/song3.mp3',
            image: './assets/image/song3.jpg'
        },
        {
            name: 'Âm thầm bên em' ,
            singer: 'Sơn Tùng M-TP',
            path :'./assets/music/song4.mp3',
            image: './assets/image/song4.png'
        },
        {
            name: 'Ngày đẹp trời để nói chia' ,
            singer: 'Lou Hoàng',
            path :'./assets/music/song5.mp3',
            image: './assets/image/song5.jpg'
        },
        {
            name: 'Đom đóm' ,
            singer: 'J97',
            path :'./assets/music/song6.mp3',
            image: './assets/image/song6.jpg'
        },
        {
            name: 'Vô Tình' ,
            singer: 'Xesi x Hoaprox',
            path :'./assets/music/song7.mp3',
            image: './assets/image/song7.jpg'
        },
        {
            name: 'Cưới Thôi' ,
            singer: ' Masew x Masiu x B Ray x TAP',
            path :'./assets/music/song8.mp3',
            image: './assets/image/song8.jpg'
        }
       
        
    ],
    render:function () {
        const htmls = this.songs.map((song,index) => {


            return `<div class="song ${index === this.currentIndex ? 'active' : ''} "data-index=" ${index} ">
          <div class="thumb" style="background-image: url('${song.image}')">
          </div>
          <div class="body">
            <h3 class="title">${song.name}</h3>
            <p class="author">${song.singer}</p>
          </div>
          <div class="option">
            <i class="fas fa-ellipsis-h"></i>
          </div>
        </div>`
        

        })
        $('.playlist').innerHTML = htmls.join('')
    },
    handelEvent: function(){
        const _this = this
        console.log(_this)
        // phongs to thu nhỏ
       
       
       

        // Xu ly quay cd
        const cdThumbAnime = cd.animate ([ 
            {transform : 'rotate(0deg)'}  ,
            {transform : 'rotate(360deg)'} 
        ] , {
            duration : 10000 , 
            iterations: Infinity
        })
        cdThumbAnime.pause()
        
        
        document.onscroll = function(){
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            console.log(scrollTop)
            // console.log(newcdwwith)
            const newcdwidth = 200 - scrollTop
            cd.style.width = newcdwidth > 0 ? newcdwidth + 'px' : 0
            cd.style.height = newcdwidth > 0 ? newcdwidth + 'px' : 0
            cd.style.opacity =  newcdwidth / 200
             }
            
        
        // xử lý pause and play

        
        
        // Khi tien do bai hat thay doi 
        audio.ontimeupdate = function () {
            if(audio.duration) { 
                const progressPercent  = Math.floor(audio.currentTime / audio.duration *100) 
                progress.value = progressPercent 
            }
            // Xử lý khi tua xong 
            progress.onchange = function (e) {
                const seektime = audio.duration  / 100 * e.target.value
                audio.currentTime = seektime

            }
        }
        //xu ly tua video
        progress.onchange = function(e) {
            console.log(e.target.value)
        }
        btnPlay.onclick = function() {
            if (_this.isPlaying) { 
                audio.pause();
            } else { 
                audio.play();
            }
        }
        
        // Lắng nghe sự kiện khi audio phát hoặc tạm dừng
        audio.addEventListener('pause', function() { 
            _this.isPlaying = false;
            play.classList.remove('playing');
            cdThumbAnime.pause()
        });
        
        audio.addEventListener('play', function() {
            _this.isPlaying = true;
            play.classList.add('playing');
            cdThumbAnime.play()
        });
        audio.onended= function() {
            if(_this.isRepeat) {
                audio.play()

            }else {
                btnnext.click()
            }

        }
        
        btnnext.onclick = function () {
            if (_this.isRandom) { 
                _this.playRandomSong()
            } else {
                _this.nextsong()
                _this.render()
                _this.scrolltocc()
            }
            
            audio.play()
        }
        btnprev.onclick = function ()  {
            if(_this.isRandom)  {
                _this.playRandomSong()
            }else {
                _this.prevsong()
            }
            
            audio.play()
            _this.render()
        }
        btnrepeat.onclick = function() {
            _this.repeatsong()
        }//Xử lý random bật / tắt
        btnrandom.onclick = function() { 
            _this.isRandom = !_this.isRandom
            btnrandom.classList.toggle('active' , _this.isRandom)
            
        }
        // xu ly repeat 
        btnrepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            btnrepeat.classList.toggle('active' , _this.isRepeat)
            
        }
        //lắng nghe hành vi playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(songNode || e.target.closest('.option')){
                // xu ly click vao song
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
        
    },
    scrolltocc: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior : 'smooth',
                block : 'nearest'
            })
        }, 300);
    },
    defineProperties: function(){
        
        Object.defineProperty(this , 'currentSong' , {
            get : function() {
                return this.songs[this.currentIndex]

            }
        })

        
    },
    
    loadCurrentSong: function() { 
        
        header.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path 
    },
    nextsong : function () {
        this.currentIndex++ 
        if (this.currentIndex >= this.songs.length - 1) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevsong : function () {
        if (this.currentIndex > 0) {
             this.currentIndex--
        }
        
        if(this.currentIndex < 0 ) { 
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    playRandomSong : function() {
        let newIndex
        do {
            newIndex  = Math.floor(Math.random() * this.songs.length)
        } while (newIndex===this.currentIndex)
            this.currentIndex = newIndex
            this.loadCurrentSong()

    },


    start: function() {
        //Định nghĩa các thuộc tính
        this.defineProperties()
        // xử lý và lắng nghe các sự kiiện
        this.handelEvent()
        // render lại các playlist
        this.render()
        // 
        this.loadCurrentSong()
    }
    

    
}
app.start()