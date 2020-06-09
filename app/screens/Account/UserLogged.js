import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-elements";
import Toast from "react-native-easy-toast";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import InfoUser from "../../components/Account/InfoUser";
import AccountOptions from "../../components/Account/AccountOptions"; 

export default function UserLogged() {

    //Estado para guardar usuario actual
    const [ userInfo, setUserInfo ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ loadingText, setLoadingText ] = useState("");
    //Estado para actualizar los datos del usuario sin recargar app
    const [ reloadUserInfo, setReloadUserInfo ] = useState(false); 

    const toastRef = useRef();

    useEffect(() => {
        //Función asincrona autoejecutable
        //Le pedimos una currentUser a firebase para que nos regrese el usuario actual
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })();
        setReloadUserInfo(false);
    }, [reloadUserInfo]);

    return ( 
        <View style = { styles.viewUserInfo } >

            { userInfo &&  <InfoUser 
                                userInfo = { userInfo } 
                                toastRef = { toastRef }
                                setLoading = { setLoading } 
                                setLoadingText = { setLoadingText }
                            /> }
            
            <AccountOptions 
                userInfo = { userInfo } 
                toastRef = { toastRef }
                setReloadUserInfo = { setReloadUserInfo } 
            />
            <Button 
                title = "Cerrar Sesión" 
                buttonStyle = { styles.btnCloseSession }
                titleStyle = { styles.bntCloseSessionText }
                onPress = { () => firebase.auth().signOut() } 
            />
            <Toast 
              ref = { toastRef }
              position = "center"
              opacity = { 0.9 }  
            />
            <Loading 
                text = { loadingText }
                isVisible = { loading }
            />
        </View>
     );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#F2F2F2"
    },
    btnCloseSession: {
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#FFF",
        borderTopWidth: 1,
        borderTopColor: "#E3E3E3",
        borderBottomWidth: 1,
        borderBottomColor: "#E3E3E3",
        paddingTop: 10,
        paddingBottom: 10
    },
    bntCloseSessionText: {
        color: "#00A680"
    }
});