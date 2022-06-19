import React from 'react';
import './Dashboard.css';
import Sidebar from '../Sidebar/Sidebar';

export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            quiz:null
        }
    }

    componentDidMount() {
        if (!localStorage.getItem('JWT_PAYLOAD')) {
            this.props.history.push('/');
        }
        
    }

    render() {
        return (
            <div className="dashboard-wrapper">
                <div className="sidebar">
                    <Sidebar />
                </div>
                <div className="main">
                    <div className="top">
                        
                        <div className="header">Statistics</div>
                        </div>
                    
                    <div >
                         <table>
                                    <tr> 
                                        <td>
                                            <h2>Quiz name</h2>
                                </td>
                                <td>
<h2>Score</h2>
                                </td>
                                    </tr>
                                </table>
                     
                    </div>

                    <div className="bottom">
                        
                    </div>
                </div>
            </div>
        )
    }
}