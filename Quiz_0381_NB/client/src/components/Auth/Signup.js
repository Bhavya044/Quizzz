import React from 'react';

export default class Signup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            isTeacher: false,
        }
    }

    render() {
        return (
            <div className="sign-in-wrapper">
                <div className="form">
                    <div className="input-wrapper">
                        <div>Email Address</div> 
                        <input className="input" type="text" placeholder="Email Address" value={this.state.email} onChange={ e => this.setState({ email: e.target.value }) } />
                    </div>
                    <div className="input-wrapper">
                      <div>Password</div> 
                      <input className="input" type="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                    </div>

                    <div className="input-wrapper">
                        <div>First Name</div> 
                        <input className="input" type="text" placeholder="First Name" value={this.state.firstName} onChange={ e => this.setState({ firstName: e.target.value }) } />
                    </div>
                    <div className="input-wrapper">
                      <div>Last Name</div> 
                      <input className="input" type="text" placeholder="Last Name" value={this.state.lastName} onChange={e => this.setState({ lastName: e.target.value })} />
                    </div>
                    <div className='input-wrapper'>
                        <div >Are you a teacher?</div>
                        <br></br>
                        <select className="form-select" defaultValue={this.state.isTeacher} aria-label="Default select example" onChange={e => this.setState({ isTeacher: e.target.value })}>
 
                            <option value="true">Yes</option>
                            <option value="false" >No</option>
                            
                
                        </select>
                        </div>
            
                    <div className="btn " style={{textAlign: 'center'}} onClick={() => this.props.signUp({...this.state})}>Sign Up</div> 
                </div> 
            </div>
        )
    }
}