import React, { useState } from "react";
import { View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import globalStyles from "../../../styles/Global";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props){

    const { email, setShowModal, toastRef, setReloadUserInfo } = props;
    const [ formData, setFormData ] = useState(defaultValue());
    const [ showPassword, setShowPassword ] = useState(false);
    const [ errors, setErrors ] = useState({});
    const [ isLoading, setIsLoading ] = useState(false);
    
    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = () => {
        //console.log("formulario enviado");
        //console.log(formData);
        setErrors({});
        if(!formData.email || email == formData.email){
            setErrors({
                email: "El email no ha cambiado"
            });
        }else if(!validateEmail(formData.email)){
            setErrors({
                email: "Email incorrecto"
            });
        }else if(!formData.password){
            setErrors({
                password: "El password no puede estar vacía"
            });
        }else{
            setIsLoading(true);
            reauthenticate(formData.password).then((response) => {
                //console.log(response);
                //Modificamos el email en firebase
                firebase
                    .auth()
                    .currentUser
                    .updateEmail(formData.email)
                    .then(() => {
                        setIsLoading(false);
                        setReloadUserInfo(true);
                        toastRef.current.show("Email actualizado");
                        setShowModal(false);
                    })
                    .catch(() => {
                        setErrors({
                            email: "Error al actualizar el email"
                        });
                        setIsLoading(false);
                    })

            }).catch(() => {
                setIsLoading(false);
                setErrors({
                    password: "El password es incorrecto"
                });
            })
        }
    }

    return(
        <View style = { globalStyles.containerViewUser } >
            <Input 
                placeholder = "Correo electrónico"
                containerStyle = { globalStyles.inputUser }
                defaultValue = { email || "" }
                rightIcon = {{
                    type: "material-community",
                    name: "at",
                    color: "#C2C2C2"
                }}
                onChange = { (e) => onChange(e, "email") }
                errorMessage = { errors.email }
            />
            <Input 
                placeholder = "Password"
                containerStyle = { globalStyles.inputUser }
                password = { true }
                secureTextEntry = { showPassword ? false : true }
                rightIcon = {{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#C2C2C2",
                    onPress: () => setShowPassword(!showPassword) 
                }}
                onChange = { (e) => onChange(e, "password") }
                errorMessage = { errors.password }
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

function defaultValue(){
    return{
        email: "",
        password: ""
    }
}