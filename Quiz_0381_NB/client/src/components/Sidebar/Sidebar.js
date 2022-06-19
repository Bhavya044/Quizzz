import React from 'react';
import store from '../../store/index';
import {NavLink} from 'react-router-dom';
import './Sidebar.css';

export default class Sidebar extends React.Component {

    componentDidMount() {
        this.unsubscribe = store.subscribe(() => this.forceUpdate());
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    bgImage = () => {
        if(store.getState().user.avatar && store.getState().user.avatar.url) {
            return `url(${store.getState().user.avatar.url})`;
            
        } else {
            return `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO0hdrY8JPa6KVVvEo0uKO68yOoVt_-xBzsw&usqp=CAU)`;
        }
    }

    render() {
        if (store.getState().user) {
            return (
                <div className="sidebar-wrapper">
            
    
                    <div className="user">
                        <div className="avatar" style={{backgroundImage: this.bgImage()}}></div>
                        <div className="name">{store.getState().user.firstName + ' ' + store.getState().user.lastName}</div>
                    </div>

                    <div className="links">
                        {/* <NavLink to="/dashboard"><div className="link">Dashboard <i class="fa-solid fa-table-columns"></i></div></NavLink> */}
                       
                       
                        {store.getState().user.isTeacher ?
                            <NavLink to="/my-quizzes"><div className="link">Created Quizzes <i class="fa-solid fa-feather"></i></div></NavLink> : null}
                        { store.getState().user.isTeacher?
                            <NavLink to="/create-quiz"><div className="link">Create Quiz <i class="fa-solid fa-plus"></i></div></NavLink> :null
                        }
                      
                        <NavLink to="/community-quizzes"><div className="link">Take Quiz <i class="fa-solid fa-users"></i></div></NavLink>
                    </div>
                </div>
                
            )
        } else {
            return (
                <div>Loading</div>
            )
        }
    }
}