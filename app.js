require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

// mongoose.connect('mongodb://localhost:27017/animes', { useNewUrlParser: true, useUnifiedTopology: true });

const DB = process.env.DATA_BASE;

mongoose.connect(DB, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log('connection is successfull.');
}).catch((err) => {
    console.log(err);
});

// ======= creating the anime collection schema =====

const animeSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    info: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    episodes: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    poster: {
        type: String,
        require: true
    },
    watchurl: {
        type: String,
        require: true
    }
});

// ========= creating the model using schema ===

const Anime = mongoose.model('anime', animeSchema);

// ============ create the document for example =========

const one = new Anime({
    title: "naruto",
    info: "this is very popular anime in the world.",
    rating: 9.76,
    type: "TV series",
    episodes: 220,
    status: "completed",
    poster: "link of the poster be here",
    watchUrl: "watch lik in here."
});

// one.save(); 

// ================ creating watchlist collection schema ===============

const watchlistSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    info: {
        type: String,
        require: true
    },
    rating: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true
    },
    episodes: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    poster: {
        type: String,
        require: true
    },
    watchurl: {
        type: String,
        require: true
    }
});

// ========= creating the model using schema ===

const WatchlistAnime = mongoose.model('watchlistAnime', animeSchema);

// ============ create the document for example =========

const two = new WatchlistAnime({
    title: "naruto",
    info: "this is very popular anime in the world.",
    rating: 9.76,
    type: "TV series",
    episodes: 220,
    status: "completed",
    poster: "link of the poster be here",
    watchUrl: "watch lik in here."
});

// two.save();


// ================== home get route =============

app.get('/', (req, res) => {
    Anime.find(function(err, animes) {
        if(err) {
            res.send(err)
        } else {
            res.render('index', {animes: animes});
        }
    }).sort({rating: -1})
})

app.post('/', function(req, res) {
    
    let title = "";
    let info = "";
    let rating = "";
    let status = "";
    let episodes = "";
    let type = "";
    let poster = "";
    let watchurl = "";

    
    Anime.find(function(err, animes) {
        animes.forEach(function(anime) {
            if (_.lowerCase(anime.title) === _.lowerCase(req.body.title)){
                    title = anime.title,
                    info = anime.info,
                    rating = anime.rating,
                    status = anime.status,
                    episodes = anime.episodes,
                    type = anime.type,
                    poster = anime.poster,
                    watchurl = anime.watchurl
            }
        })

        res.render('article', {
            title: title,
            info: info,
            rating: rating,
            status: status,
            episodes: episodes,
            type: type,
            poster: poster,
            watchurl: watchurl,
            animes: animes
        })
    })

})


// ============= post route for the form ==============

app.get('/post', function(req, res) {
    res.render('post');
})

app.post('/post', function(req, res) {
    const newAnime = new Anime({
        title: req.body.title,
        info: req.body.info,
        rating: req.body.rating,
        status: req.body.status,
        episodes: req.body.episodes,
        type: req.body.type,
        poster: req.body.poster,
        watchurl: req.body.watchurl
    });
    
    newAnime.save();

    res.redirect('/');
});

// ============ all section route ================

app.get('/all', function(req, res) {

    Anime.find(function(err, animes) {
        if(err) {
            res.send(err)
        } else {
            res.render('all', {animes: animes});
        }
    })
    
})

// ============ trending section route ================

app.get('/trending', function(req, res) {
    Anime.find(function(err, animes){
        if(err) {
            res.send(err);
        } else {
            res.render('trending', {animes: animes});
        }
    }).sort({rating: -1});
})


// =================== top animes section route ==========

app.get('/topanimes', function(req, res) {
    Anime.find(function(err, animes) {
        res.render('topanimes', {animes: animes});
    }).sort({rating: -1}).limit(6)
})

// ==================== watchlist section route =============

app.get('/watchlist', function(req, res) {
    WatchlistAnime.find(function(err, animes) {
        res.render('watchlist', {animes: animes});
    }).sort({_id: -1})
})

app.post('/watchlist', function(req, res) {
    WatchlistAnime.deleteOne({title: req.body.sub}, function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/watchlist');
        }
    })
})


// ================= article section route ============

app.get('/article/:title', (req, res) => {

    let title = "";
    let info = "";
    let rating = "";
    let status = "";
    let episodes = "";
    let type = "";
    let poster = "";
    let watchurl = "";

    
    Anime.find(function(err, animes) {
        animes.forEach(function(anime) {
            if (_.lowerCase(anime.title) === _.lowerCase(req.params.title)){
                    title = anime.title,
                    info = anime.info,
                    rating = anime.rating,
                    status = anime.status,
                    episodes = anime.episodes,
                    type = anime.type,
                    poster = anime.poster,
                    watchurl = anime.watchurl
            }
        })

        res.render('article', {
            title: title,
            info: info,
            rating: rating,
            status: status,
            episodes: episodes,
            type: type,
            poster: poster,
            watchurl: watchurl,
            animes: animes
        })
    })
    
})


app.post('/article', function(req, res) {
    Anime.find({title: req.body.add}, function(err, anime) {
        const newWatchlistAnime = new WatchlistAnime({
            title: anime[0].title,
            info: anime[0].info,
            rating: anime[0].rating,
            status: anime[0].status,
            episodes: anime[0].episodes,
            type: anime[0].type,
            poster: anime[0].poster,
            watchurl: anime[0].watchurl
        });
        newWatchlistAnime.save()
        
    })

    res.redirect('/watchlist');
})

// ======================= movies section route =============
app.get('/movies', (req, res) => {
    Anime.find({type: "Movie"}, function(err, animes) {
        res.render('movies', {animes: animes});
    }).sort({rating: -1})
})





app.listen(3000, function() {
    console.log('server started at 3000.');
});
