const login = document.querySelector(".login");
const signup = document.querySelector(".signup");
const form = document.querySelector("#form");
const loginform = document.querySelectorAll(".loginForm");

let current = 1;

//Only Signup Form is visible
function toggleright(){
    form.style.marginLeft = "-100%";
    login.style.background = "none";
    signup.style.background = "white";
    loginform[current-1].classList.add("active");
}
//Only Login Page is visible
function toggleleft(){
    form.style.marginLeft = "0";
    signup.style.background = "none";
    login.style.background = "white";
    loginform[current-1].classList.remove("active");
}

//Function to write error messages for the Login Form
function setLoginFormErrorMessage(message){
    const messageElement = document.querySelector(".login_error");

    messageElement.textContent = message;
}

//Removes Login Error messages
function clearLoginErrorMessage(){
    document.getElementById("user/psd").addEventListener("click" , e=> {
        document.querySelector(".login_error").textContent = "";
    });
}

//To write error messages for the signup form
function setSignupFormErrorMessage(message){
    const messageElement = document.querySelector(".signup_error");

    messageElement.textContent = message;
}

//Removes Error messages
function clearSignupErrorMessage(){
    document.getElementById("newUser/psd").addEventListener("click" , e=> {
        document.querySelector(".signup_error").textContent = "";
    });
}

//lets Signup form work
function userData(){
    let uname, psw, conf;
    uname = document.getElementById("newUser").value;
    psw = document.getElementById("pass").value;
    conf = document.getElementById("confpass").value;
    
    //saves user information in the array
    let user_info = new Array();
    user_info = JSON.parse(localStorage.getItem("users"))?JSON.parse(localStorage.getItem("users")):[]

    //All the fields of the sign up must be filled by the User
    if(uname.length==0 || psw.length==0 || conf.length==0){
        setSignupFormErrorMessage("*Please fill in all the fields");
    }
    else{
        //Username should be at least 5 letters and cannot have only numbers.
        if(uname.length >= 5 &&  /[a-zA-Z]/.test(uname)){
            //Password and Confirm Password should match
            if(psw == conf){
                //Password should be at least 6 letters. Password should be mixture of numbers, alphabets and special characters(@,#,$)
                if(psw.length >= 6 && /\d/.test(psw) && /[a-zA-Z]/.test(psw) && /[@$#]/.test(psw)){
                    //If User is unique then adds info in the array
                    if(!user_info.some(el=>el.uname==uname)){
              
                        user_info.push({
                            "Username":uname,
                            "Password":psw
                        })
                        localStorage.setItem("users",JSON.stringify(user_info));
                    } 
                    else{
                        setSignupFormErrorMessage("*Username Unavailable"); 
                    }
                }
                else{
                    setSignupFormErrorMessage("*Password must contain at least 6 letters,alphabets and 1 special character");
                }
            }
            else{
                setSignupFormErrorMessage("*Password doesn't match");
            }
        }
        else{
            setSignupFormErrorMessage("*Invalid Username");
        }
    }
    clearSignupErrorMessage();
    return user_info;
}

//lets Login Page work

function getInputValue(){
    var inputUser = document.getElementById("user").value;
    var inputpsd = document.getElementById("psd").value;
    
    let user_records = new Array;
    //gets the array containing user information
    user_records = userData();

    //All the fields must be filled by the user
    if(inputUser.length != 0 && inputpsd.length != 0){
        //checks if user information exists in the array
        for(i = 0; i < user_records.length; i++){
            if(inputUser == user_records[i].Username && inputpsd == user_records[i].Password){
                alert("Logged in");
                return
            }
        }
        setLoginFormErrorMessage("*Incorrect Username or Password");
    }
    else{
        setLoginFormErrorMessage("*Please fill in all the fields");
    }  
    clearLoginErrorMessage();
}

