const express = require('express');
const Quizzes = require('../models/Quiz');
const checkAuth = require('../middleware/check-auth');
const Users = require('../models/Users');
const Score = require('../models/Scores');

const router = express.Router();


//create new quiz
router.post('/create', (req, res) => {
    let quiz = new Quizzes({
        ...req.body.quiz,
        createdBy: req.body.createdBy,
        passingPoints: req.body.quiz.passingPoints,
        questions: req.body.quiz.questions.map(ques => {
            return {
                ...ques,
                answers: ques.answers.map(ans => {
                    return {
                        name: ans,
                        selected: false
                    }
                })
            }
        })
    });
    quiz.save().then(result => {
        res.status(200).json({success: true});
    })
});
//delete
router.delete("/delete/:id", checkAuth, async(req, res) => {
    const id = req.params.id;
    console.log(id);
    
    let course;
    try {
        course = await Quizzes.findByIdAndDelete(id);
        console.log(course);
        await Quizzes.pull(course);
        
    }
    
    catch (err) {
        course = err;
    }
    return course;


});

//get my quiz

router.get("/my-quizzes/:id", (req, res) => {

    Quizzes.find({ createdBy: req.params.id })
        .then(result => {
            res.status(200).json(result);
        })
});


//get all quiz
router.get('/all-quizzes', (req, res) => {
    Quizzes.find()
        .then(result => {
            res.status(200).json(result);
        })
})


router.get('/get-quiz/:id', (req, res) => {
    Quizzes.findOne({ _id: req.params.id }).then(quiz => {
        res.status(200).json({quiz});
    }).catch(er => {
        res.status(500).send(er);
    })
})
//update
router.put('/update-quiz/:id', checkAuth, async(req, res) => { 
 
    const { id } = req.params;
    const { name, passingPoints} = req.body;
    let updatedQuiz;
    try {
        updatedQuiz = await Quizzes.findByIdAndUpdate(id, {
            name,passingPoints
        })
    } catch (error) {
        console.log(error);
    }
})
router.post('/add-comment', (req, res) => {
    Quizzes.updateOne({ _id: req.body.quizId }, {
        $push: {
            comments: {
                sentFromId: req.body.sentFromId,
                message: req.body.message,
                sentFromName:req.body.sentFromName
            }
        }
    }).then(quiz => {
        res.status(200).json({success: true});
    }).catch(er => {
        res.status(500).send(er);
    })
});

router.post('/like-quiz', (req, res) => {
    Users.findOne({_id: req.body.userId, likedQuizzes: {$in: [req.body.quizId]}}).then(async user => {
        if (!user) {
            await Users.updateOne({ _id: req.body.userId }, {
                $push: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({ _id: req.body.quizId }, {
                $inc: {
                    likes: 1
                }
            });
            res.status(200).json({message: 'Added To Liked'});
        } else {
            await Users.updateOne({ _id: req.body.userId }, {
                $pull: {
                    likedQuizzes: req.body.quizId
                }
            });
            await Quizzes.updateOne({_id: req.body.quizId}, {
                $inc: {
                    likes: -1
                }
            })
            res.status(200).json({message: 'Removed from liked'})
        }
    })
});

router.post('/save-results', (req, res) => {
    let score = new Score({
        userId: req.body.currentUser,
        answers: req.body.answers,
        quizId: req.body.quizId,
        percentage: req.body.percentage

    });
    score.save().then(async resp => {
        await Quizzes.updateOne({ _id: req.body.quizId }, {
            $push: {
                scores: resp._id,
                percentage:resp.percentage
            }
        });
        res.status(200).json({scoreId: resp._id,percentage:resp.percentage});
    })
});

router.get('/results/:id', (req, res) => {
    if (!req.params.id) {
        res.status(500).send("No id provided in params");
    } else {
        Score.findOne({_id: req.params.id}).then(data => {
            if (!data) {
                res.status(500).send("Error finding score");
            } else {
                Quizzes.findOne({_id: data.quizId}).then(quiz => {
                    if (!quiz) {
                        res.status(500).send("Error getting quiz");
                    } else {
                        res.status(200).json({score: data, quiz: quiz});
                    }
                })
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).send("Error finding score");
        })
    }
})

module.exports = router;