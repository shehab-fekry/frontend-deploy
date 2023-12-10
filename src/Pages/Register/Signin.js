import React, {useContext, useState} from "react";
import style from './Signin.module.css';
import { NavLink } from "react-router-dom";
import Typed from 'typed.js';

import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";

const Signin = () => {
    const auth = useContext(AuthContext);
    let [userData, setUserData] = useState({
        exist: false,
        name: '',
        imagePath: '',
        errorMessage: '',
    });

    let [state, setState] = useState({
        inputs: {
            Email: {
                value: '',
            },
            Password: {
                value: '',
            },
        },
    })

    const changeHandler = (event, fieldName) => {
        let value = event.target.value;
        let newState = {...state};

        newState.inputs[fieldName].value = value;
        setState(newState);
    }

    const checkUserExist = () => {
        let email = state.inputs.Email.value;

        axios.post('https://chat-backend-z0wm.onrender.com/Auth/userExist', {email})
        .then(data => {
            let {name, imagePath} = data.data;
            if(!!name && !!imagePath)
            setUserData({exist: true, name, imagePath, errorMessage: ''});
            else {
                setUserData({exist: false, name: '', imagePath: '', errorMessage: data.data.message})
                setTimeout(() => {
                    setUserData({exist: false, name: '', imagePath: '', errorMessage: ''})
                }, 3000);
            }
        })
        .catch(err => console.log(err))
    }

    const regiserHandler = (event) => {
        event.preventDefault();
        let data = {email: state.inputs.Email.value, password: state.inputs.Password.value};
        
        axios.post('https://chat-backend-z0wm.onrender.com/Auth/signin', data)
        .then(response => {
            let {user, token} = response.data;
            auth.login(user, token);
        })
        .catch(err => console.log(err));
    }

    return (
        <div className={style.Signin}>
            <div className={style.navBar}>
                <div className={style.title}>
                    <div className={style.icon}><img src={process.env.PUBLIC_URL + 'bot.png'}/></div>
                    <div className={style.title1}>ChatBot</div>
                    <div className={style.title2}>Signin</div>
                </div>
            </div>
            <div className={style.container}>
                {/* Image Section */}
                <div className={style.imageSection}>
                    <div className={style.image}>
                        <img src={userData.exist ? userData.imagePath : process.env.PUBLIC_URL + 'robot11.png'}/>
                        <div className={style.eyeBlink}
                        style={{
                            display: userData.exist ? 'none' : 'flex',
                        }}>
                            <div className={style.eye}></div>
                            <div className={style.eye}></div>
                        </div>
                        <div className={style.botMessage} style={{
                            opacity: userData.errorMessage ? '1' : '0',
                        }}>
                            No Such Bot Exist!
                            <div className={style.buble}><div className={style.smallBuble}></div></div>
                        </div>
                    </div>
                </div>
                
                {/* Name Section */}
                <div className={style.nameSection} 
                style={{
                    opacity: userData.exist ? '1' : '0',
                    transform: userData.exist ? 'translateY(0px)' : 'translateY(-21px)',
                }}>
                    <div className={style.name}>{userData.exist ? userData.name : null}</div>
                    <div className={style.mark}>{userData.exist ? <img src={process.env.PUBLIC_URL + 'check.png'}/> : null}</div>
                </div>
                {/* Form Section */}
                <div className={style.formSection} 
                style={{
                    transform: userData.exist ? 'translateY(0px)' : 'translateY(-30px)',
                }}>
                    <div className={style.formComponent}>
                        <form>
                            <input 
                            type={userData.exist ? 'password' : 'email'}
                            placeholder={userData.exist ? 'Password' : 'example@gmail.com'}
                            value={userData.exist ? state.inputs.Password.value : state.inputs.Email.value} 
                            onChange={(e) => changeHandler(e, userData.exist ? 'Password' : 'Email')}/>
                        </form>
                        <button type="submit" onClick={userData.exist ? (e) => regiserHandler(e) : checkUserExist}>
                            <img src={process.env.PUBLIC_URL + 'next2.png'}/>
                        </button>
                    </div>
                    <a href="/signup">Signup</a>
                </div>
            </div>
            
        </div>
    )
}

export default Signin;