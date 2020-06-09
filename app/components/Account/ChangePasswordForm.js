import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Input, Button } from "react-native-elements";
import globalStyles from "../../../styles/Global";
import { size } from "lodash";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/api";

export default function ChangePasswordForm(props){

    const { setShowModal, toastRef } = props;

    const [ showPassword, setShowPassword ] = useState(false);

    const [ formData, setFormData ] = useState(defaultValue());

    const [ errors, setErrors ] = useState({});

    const [ isLoading, setIsLoading ] = useState(false);

    const onChange = (e, type) => {
        //console.log(e.nativeEvent.text);
        //console.log(type);
        setFormData({...formData, [type]: e.nativeEvent.text });
    }

    const onSubmit = async () => {
        let isSetError = true;
        //console.log(formData);
        let errorsTemp = {};
        setErrors({});
        if(!formData.password || !formData.newPassword || !formData.repeatNewPassword){
            errorsTemp = {
                password: !formData.password ? "El password no puede estar vacío" : "",
                newPassword: !formData.newPassword ? "El password no puede estar vacío" : "",
                repeatNewPassword: !formData.repeatNewPassword ? "El password no puede estar vacío" : ""
            }
        } else if(formData.newPassword !== formData.repeatNewPassword){
            errorsTemp = {
                newPassword: "Los password no son iguales",
                repeatNewPassword: "Los password no son iguales"
            }
        }else if(size(formData.newPassword) < 6){
            errorsTemp = {
                newPassword: "El password tiene que ser mayor o igual a 6 caracteres",
                repeatNewPassword: "El password tiene que ser mayor o igual a 6 caracteres"
            }
        }else{
            setIsLoading(true);
            //console.log("ok");
            await reauthenticate(formData.password).then(async () => {
                //console.log("OK");
                await firebase
                    .auth()
                    .currentUser
                    .updatePassword(formData.newPassword).then(() => {
                        isSetError = false;
                        setIsLoading(false);
                        setShowModal(false);
                        firebase.auth().signOut();
                    })
                    .catch(() => {
                        errorsTemp = {
                            other: "Error al actualizar el password"
                        }
                        setIsLoading(false);
                    })
            }).catch(() => {
                errorsTemp = {
                    password: "El password no es correcto"
                };
                setIsLoading(false);
            })
        }

        isSetError && setErrors(errorsTemp);
    };

    return(
        <View style = { globalStyles.containerViewUser }>
            <Input 
                placeholder = "Password actual"
                containerStyle = { globalStyles.inputUser }
                password = { true }
                secureTextEntry = { showPassword ? false : true }
                rightIcon = {{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#C2C2C2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange = {(e) => onChange(e, "password")}
                errorMessage = { errors.password }
            />
            <Input 
                placeholder = "Nuevo password"
                containerStyle = { globalStyles.inputUser }
                password = { true }
                secureTextEntry = { showPassword ? false : true }
                rightIcon = {{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#C2C2C2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange = {(e) => onChange(e, "newPassword")}
                errorMessage = { errors.newPassword }
            />
            <Input 
                placeholder = "Repetir nuevo password"
                containerStyle = { globalStyles.inputUser }
                password = { true }
                secureTextEntry = { showPassword ? false : true }
                rightIcon = {{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline" : "eye-outline",
                    color: "#C2C2C2",
                    onPress: () => setShowPassword(!showPassword)
                }}
                onChange = {(e) => onChange(e, "repeatNewPassword")}
                errorMessage = { errors.repeatNewPassword }
            />
            <Button 
                title = "Actualizar"
                containerStyle = { globalStyles.btnContainerUser }
                buttonStyle = { globalStyles.colorBtnDefault }
                onPress = { onSubmit }
                loading = { isLoading }
            />
            <Text>
                { errors.other }
            </Text>
        </View>
    )
}

function defaultValue(){
    return{
        password: "",
        newPassword: "",
        repeatNewPassword: ""
    }
}