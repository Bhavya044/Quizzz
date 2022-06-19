import React from 'react';
import './TakeQuiz.css';
import Countdown from "react-countdown";

import $ from 'jquery';

import axios from 'axios';
let points=0
export default class TakeQuiz extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            quiz: {},
            authorized: false,
            answers: [],
            activeQuestionIdx: 0,
            percentage: 0,
            passingPoints: this.props.location.state.quiz.passingPoints,
            earnedPoints:0,
            duration: this.props.location.state.quiz.duration,
        
        }
        
    }

    timerOut = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a completed state
            return alert('time is up')
        } else {
            // Render a countdown
            return <span>{hours}:{minutes}:{seconds}</span>;
        }
    };
    

    componentDidMount() {
        $('#modal-wrapper-quiz').hide();
        if (this.props.location.state !== undefined) {
            this.setState({ authorized: true });
            this.setState({ quiz: this.props.location.state.quiz, answers: Array(this.props.location.state.quiz.questions.length).fill(0) });
         
        }
        this.setState({ duration: this.state.duration })
         this.setState({earnedPoints: this.currentPoints()});
        
    }

    currentPoints = (points) => {
        
       
        let answers = this.state.answers;
        if ( answers[this.state.activeQuestionIdx] ===true) {
            points += 1;
            // this.setState({ earnedPoints: points });
        }
       return points
    
      }



    nextQuestion = () => {
        let newIdx = this.state.activeQuestionIdx;
        newIdx++;
        if (newIdx === this.state.quiz.questions.length) return;
        this.setState({ activeQuestionIdx: newIdx });
        this.setState({ duration: this.state.duration });
          //this.setState({earnedPoints: this.currentPoints()});
    }

    getPercentage = (ans) => {
        let total = 0;
        ans.forEach(answer => {
            if (answer !== 0) {
                total += (1 / this.state.answers.length);
            }
        });
        this.setState({ percentage: total });
       
    }
    
  
    selectAnswer = (ans, idx) => {
        let questions = this.state.quiz;
        questions.questions[this.state.activeQuestionIdx].answers.forEach(ans => {
            ans.selected = false;
        });
        questions.questions[this.state.activeQuestionIdx].answers[idx].selected = true;
        let answers = this.state.answers;
        if (ans.name === this.state.quiz.questions[this.state.activeQuestionIdx].correctAnswer) {
            answers[this.state.activeQuestionIdx] = true;
        } else {
            answers[this.state.activeQuestionIdx] = false;
        }
        this.setState({quiz: questions, answers: answers});
        this.getPercentage(answers);
        this.setState({ percentage: this.state.percentage });
       
        
    }

    showModal = () => {
        $('#modal-wrapper-quiz').fadeIn(300);
    }

    hideModal = () => {
        $('#modal-wrapper-quiz').fadeOut(300);
    }

    finishQuiz = () => {
        axios.post("/api/quizzes/save-results", {
            currentUser: localStorage.getItem('_ID'),
            answers: this.state.answers,
            quizId: this.state.quiz._id,
            percentage: this.state.percentage
          
        }).then(res => {
            if (res.data) {
                this.props.history.push('/view-results?id=' + res.data.scoreId);
            }
        })
    }
    

    render() {
        let { quiz, activeQuestionIdx } = this.state;
        
        
        return (
              <>
                    <div id="modal-wrapper-quiz" className="modal-wrapper-quiz">
                        <div className="content">
                            <div className="header">Are you sure you wish to submit your answers</div>
                            <div className="buttons-wrapper">
                                <button onClick={this.hideModal}>Cancel</button>
                                <button onClick={this.finishQuiz}>Yes</button>
                            </div>
                        </div>
                    </div>
                    <div className="take-quiz-wrapper">
                        {this.state.authorized ?

                            <div className="content">
                                <div className="header">
                                <div className="left">
                                    Time remaining:       <Countdown date={Date.now() + this.state.duration * (6 * 10000)} renderer={this.timerOut} />
                                    <div >  Passing points: {this.state.passingPoints}</div>
                                    <div>  Earned points: {this.currentPoints(points)}</div>
                                    </div>
                                    
                                </div>

                                <div className="body">
                                    <div className="left">
                                        <div className="question-name">{quiz.questions[activeQuestionIdx].questionName}</div>
                                        <div className="question-bubble-wrapper">
                                            {this.state.quiz.questions.map((ans, idx) => (
                                                <span onClick={() => this.setState({ activeQuestionIdx: idx })} key={idx} className={this.state.activeQuestionIdx === idx ? 'question-bubble selected-bubble' : this.state.answers[idx] === 0 ? "question-bubble" : 'question-bubble bubble-correct'}>
                                                    {idx + 1}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="right">
                                        <div className="answers-wrapper">
                                            {quiz.questions[activeQuestionIdx].answers.map((ans, idx) => (
                                                <div key={idx} onClick={() => this.selectAnswer(ans, idx)} className={ans.selected === true ? 'selected' : 'answer'}>
                                                    {ans.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="footer">
                                    <div className="buttons-wrapper">
                                    <button onClick={this.nextQuestion}>Next</button> <button  onClick={this.showModal}>Submit Quiz</button>
                                    </div>
                                </div>
                            </div>

                            : <div>Not authorized</div>}
                    </div>
                </>
        )
    }
}