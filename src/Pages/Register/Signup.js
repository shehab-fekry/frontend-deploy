import React, {useContext, useState} from "react";
import style from './Signup.module.css';

import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const Signin = () => {
    let navigate = useNavigate();
    const auth = useContext(AuthContext);
    let [step, setStep] = useState(0);
    let [avatar, setAvatar] = useState(''); // for UI porpose
    let [email, setEmail] = useState(''); // for UI porpose

    let [state, setState] = useState({
        inputs: {
            Name: {
                value: '',
                error: null,
            },
            Email: {
                value: '',
                error: null,
            },
            Password: {
                value: '',
                error: null,
            },
            confirmPassword: {
                value: '',
            },
        }
    })

    const updateStep = (updatedStep) => {
        updatedStep = updatedStep + 1;
        setStep(updatedStep)
    }

    const validateName = (name) => {
        let newState = {...state};
        if (name.length !== 0 && name !== ''){
            newState.inputs.Name.error = null;
            setState(newState)
            return true;
        }
        else {
            newState.inputs.Name.error = 'Please Pick A Name';
            setState(newState)
            return false;
        }
    }

    const validateEmail = async (email) => {
        let newState = {...state};

        return axios.post('https://chat-backend-z0wm.onrender.com/Auth/userExist', {email})
        .then(data => {
            let {name, imagePath} = data.data;
            if(!!name) {
                newState.inputs.Email.error = 'Email Already Exist';
                setState(newState);
                return false;
            } 
            else if(email.length !== 0) {
                if(email.includes('@')){
                    newState.inputs.Email.error = null;
                    setState(newState);
                    return true;
                } else {
                    newState.inputs.Email.error = 'Must Include @';
                    setState(newState);
                    return false;
                }
            } else {
                newState.inputs.Email.error = 'Email Is Required';
                setState(newState);
                return false;
            }
        })
        .catch(err => console.log(err))

    }

    const validatePassword = (password, confirmPassword) => {
        let newState = {...state};        

        if(password.length != 0 && password.length > 5) {
            if(password === confirmPassword) {
                newState.inputs.Password.error = null;
                setState(newState);
                return true;
            } else {
                newState.inputs.Password.error = 'Passwords Doesn\'t Match';
                setState(newState);
                return false;
            }
        } else {
            newState.inputs.Password.error = 'To Short Password';
            setState(newState);
            return false;
        }
    }

    const nextStepHandler = async () => {
        let updatedStep = step;
        let {Name, Email, Password, confirmPassword} = state.inputs;
        
        if(updatedStep === 0 && validateName(Name.value)) {
            setAvatar(Name.value);
            updateStep(updatedStep);
        }
        else if(updatedStep === 1) {
            const isValid = await validateEmail(Email.value)
            if(isValid){
                setEmail(Email.value);
                updateStep(updatedStep);
            }
        }
        else if(updatedStep === 2) {
            let isValid = validatePassword(Password.value, confirmPassword.value);
            if(isValid) regiserHandler();
        }
    }

    const prevStepHandler = () => {
        let updatedStep = step;
        if(updatedStep === 0) return
        if(updatedStep === 1) setAvatar('')
        if(updatedStep === 2) setEmail('')

        updatedStep = updatedStep - 1;
        setStep(updatedStep)
    }

    const changeHandler = (event, fieldName) => {
        let value = event.target.value;
        let newState = {...state};

        newState.inputs[fieldName].value = value;
        setState(newState);
    }

    const regiserHandler = (event) => {
        // event.preventDefault();
        let data = {
            name: state.inputs.Name.value, 
            email: state.inputs.Email.value,
            password: state.inputs.Password.value,
            confirmPass: state.inputs.confirmPassword.value,
        };

        axios.post('https://chat-backend-z0wm.onrender.com/Auth/signup', data)
        .then(response => {
            console.log(response)
            navigate('/signin');
        })
        .catch(err => console.log(err));
    }


    return (
        <div className={style.Signup}>
            {/* NAVBAR */}
            <div className={style.navBar}>
                <div className={style.title}>
                    <div className={style.icon}><img src={process.env.PUBLIC_URL + 'bot.png'}/></div>
                    <div className={style.title1}>ChatBot</div>
                    <div className={style.title2}>Signup</div>
                </div>
            </div>
            <div className={style.card}>
                {/* STEPPER COMPONENT */}
                <form className={style.stepperForm}>
                    <div className={style.firstHeader}>
                        <div className={style.firstHeaderBuble} 
                        style={{background: step <= 2 && !state.inputs.Name.error ? '#E5AD06' : (state.inputs.Name.error ? '#ff3333' : '#a6a6a6')}}>
                            {avatar ? <img width='100%' height='100%' src={'https://robohash.org/' + avatar}/> : '1'}
                        </div>
                        <div className={style.firstHeaderText} style={{color: step === 0 ? '#384850' : '#a6a6a6'}}>
                            {avatar ? avatar : 'Avatar'}
                        </div>
                    </div>
                    <div className={style.firstBody}
                    style={{
                        minHeight: step !== 0 ? '20px' : '100px',
                    }}>
                        {step === 0 && (<>
                        <div className={style.firstDescription}>Auto-Generated by the name you pick</div>
                        <div className={style.firstInputComp}>
                            <div className={style.image}>
                                {state.inputs.Name.value && <img alt="" src={'https://robohash.org/' + state.inputs.Name.value}/>}
                            </div>
                            <input type="text" value={state.inputs.Name.value} placeholder="Name" onChange={(e) => changeHandler(e, 'Name')}/>
                        </div>
                        {/* name error message */}
                        {state.inputs.Name.error && (
                            <div className={style.errorMessage}>
                                <FontAwesomeIcon className={style.warning} icon={faCircleExclamation} style={{color: "white"}}/>
                                <div>{state.inputs.Name.error}</div>
                            </div>
                        )}
                        
                        </>)}
                    </div>

                    <div className={style.secondHeader}>
                        <div className={style.secondHeaderBuble} style={{background: step >= 1 && !state.inputs.Email.error ? '#E5AD06' : (state.inputs.Email.error ? '#ff3333' : '#a6a6a6')}}>{email ? '@' : '2'}</div>
                        <div className={style.secondHeaderText} style={{color: step === 1 ? '#384850' : '#a6a6a6'}}>{email ? email : 'Email'}</div>
                    </div>
                    <div className={style.secondBody}
                    style={{
                        minHeight: step !== 1 ? '20px' : '80px',
                    }}>
                        {step === 1 && (<>
                        <div className={style.secondDescription}>Choose an email</div>
                        <div className={style.secondInputComp}>
                            <input type="email" value={state.inputs.Email.value} placeholder="example@gmail.com" onChange={(e) => changeHandler(e, 'Email')}/>
                        </div>
                        {/* email error message */}
                        {state.inputs.Email.error && (
                            <div className={style.errorMessage}>
                                <FontAwesomeIcon className={style.warning} icon={faCircleExclamation} style={{color: "white"}}/>
                                <div>{state.inputs.Email.error}</div>
                            </div>
                        )}
                        </>)}
                    </div>

                    <div className={style.thirdHeader}>
                        <div className={style.thirdHeaderBuble} style={{background: step === 2 && !state.inputs.Password.error ? '#E5AD06' : (state.inputs.Password.error ? '#ff3333' : '#a6a6a6')}}>3</div>
                        <div className={style.thirdHeaderText} style={{color: step === 2 ? '#384850' : '#a6a6a6'}}>Password</div>
                    </div>
                    <div className={style.thirdBody}
                    style={{
                        minHeight: step !== 2 ? '20px' : '130px',
                        borderLeft : step !== 2 ? 'none' : '2px',
                    }}>
                        {step === 2 && (<>
                        <div className={style.thirdDescription}>Type a valid password</div>
                        <div className={style.thirdInputComp}>
                            <input type="password" value={state.inputs.Password.value} placeholder="Password" onChange={(e) => changeHandler(e, 'Password')}/>
                            <input type="password" value={state.inputs.confirmPassword.value} placeholder="Confirm Password" onChange={(e) => changeHandler(e, 'confirmPassword')}/>
                        </div>
                        {/* password error message */}
                        {state.inputs.Password.error && (
                            <div className={style.errorMessage}>
                                <FontAwesomeIcon className={style.warning} icon={faCircleExclamation} style={{color: "white"}}/>
                                <div>{state.inputs.Password.error}</div>
                            </div>
                        )}
                        </>)}
                    </div>
                </form>
                {/* BUTTONS SECTION */}
                <div className={style.ButtonSection}>
                    <button 
                    className={style.back} 
                    onClick={prevStepHandler}
                    style={{
                        color: step === 0 ? '#a6a6a6' : '#384850',
                        cursor: step === 0 ? 'not-allowed' : 'pointer',
                    }}>Back</button>
                    <button className={style.continue} onClick={nextStepHandler}>
                        {step === 2 ? 'Submit' : 'Continue'}
                    </button>
                    <a href="/signin">Signin</a>
                </div>
            </div>
        </div>
    )
}

export default Signin;


// "#1ccc0f" green