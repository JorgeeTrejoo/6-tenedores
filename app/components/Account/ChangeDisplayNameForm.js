import React, { useState } from "react";
import { View, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import globalStyles from "../../../styles/Global";

export default function ChangeDisplayNameForm(props){

    const { displayName, setShowModal, toastRef, setReloadUserInfo } = props;
    const [ newDisplayName, setNewDisplayName ] = useState(null);
    const [ error, setError ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);

    const onSubmit = () => {
        setError(null);
        //Si newDisplayName esta vacío
        if(!newDisplayName){
            setError("El nombre no puede estar vacío");
        }else if(displayName === newDisplayName){
            setError("El nombre no puede ser igual al actual");
        }else{
            setIsLoading(true);
            //El formulario es correcto y se puede mandar a firebase
            const update = {
                displayName: newDisplayName
            }

            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    setIsLoading(false);
                    setReloadUserInfo(true);
                    setShowModal(false);
                    //console.log("ok");
                })
                .catch(() => {
                    setError("Error al actualizar los datos");
                    setIsLoading(false);
                });
        }
    }

    return(
        <View style = { globalStyles.containerViewUser } >
            <Input 
                placeholder = "Nombre"
                containerStyle = { globalStyles.inputUser }
                rightIcon = {{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#C2C2C2"
                }}
                defaultValue = { displayName || "" }
                onChange = { e => setNewDisplayName(e.nativeEvent.text) }
                errorMessage = { error }
            />
            <Button 
                title = "Actualizar"
                containerStyle = { globalStyles.btnContainerUser }
                buttonStyle = { globalStyles.colorBtnDefault }
                onPress = { onSubmit }
                loading = { isLoading }
            />
        </View>
    )
}