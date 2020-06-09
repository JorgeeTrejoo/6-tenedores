import React, { useState, useEffect } from "react";
import * as firebase from "firebase";

import UserGuest from "./UserGuest";
import UserLogged from "./UserLogged";
import Loading from "../../components/Loading";

export default function Account() {

    //Lo inicialisamos como null porque no sabes si el usuario esta logeado o no
    const [ login, setLogin ] = useState(null);

    //Hacemos la petición a firebase y le preguntamos si el usuario que esta visitando la app esta logeado o no
    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {

            //Si user es null entonces el usuario no esta logeado de lo contrario usuario esta logeado
            !user ? setLogin(false) : setLogin(true);
            //Esto es lo mismo que esto:
            /*
            if(!user){
                selLogin(false);
            }else{
                setLogin(true);
            }
            */
        })
    }, []);

    if(login === null) return <Loading isVisible={true} text = "Cargando..." />

    return login ? <UserLogged /> : <UserGuest />
    /*Esto es lo mismo que esto:
    if(login){
        return <UserLogged />
    }else{
        return <UserLogged />
    }
    */
}