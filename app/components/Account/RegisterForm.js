import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/validations";
import Loading from "../Loading";
//Importamos size para validar que el password sea mayor de 6 caracteres y isEmpty para que no este vacio el campo password
import { size, isEmpty } from "lodash";

import * as firebase from "firebase";

import { useNavigation } from "@react-navigation/native";

export default function RegisterForm(props){

    const { toastRef } = props;

    const [ showPassword, setShowPassord ] = useState(false);
    const [ showConfirmPassword, setShowConfirmPassword ] = useState(false);
    const [ loading, setLoading ] = useState(false);

    const [formData, setFormData] = useState(defaultFormValue());

    const navigation = useNavigation();

    const onSubmit = () => {
        //Validamos que ningun campo este vacio con isEmpty de lodash
        if(isEmpty(formData.email) || isEmpty(formData.password) || isEmpty(formData.confirmPassword)){
            toastRef.current.show("Todos los campos son obligatorios");
        }else if(!validateEmail(formData.email)){
            //Validamos que sea un email valido
                toastRef.current.show("El Email no es correcto");
        }else if(formData.password !== formData.confirmPassword){
            //Validamos que los password deben ser iguales
            toastRef.current.show("Las contraseñas deben ser iguales");
        }else if(size(formData.password) < 6){
            //Validamos que password tiene que ser mayor a 6 cracteres
            toastRef.current.show("La contraseña debe tener al menos 6 caracteres");
        }else{
            setLoading(true);
            //Cuando todo esta correctamente mandamos los datos a la base de datos de firebase
            firebase
                .auth()
                .createUserWithEmailAndPassword(formData.email, formData.password)
                .then(() => {
                    setLoading(false);
                    navigation.navigate("account")
            })
            .catch( () => {
                setLoading(false);
                toastRef.current.show("¡El Email ya esta un uso, pruebe con otro!");
            }); 
        }
    }

    const onChange = (e, type) => {
        setFormData({ ...formData, [type]:e.nativeEvent.text });
    }

    return(
        <View style = { styles.formContainer } >
            <Input 
                placeholder = "Correo electrónico"
                containerStyle = { styles.inputForm }
                onChange = { (e) => onChange(e, "email") }
                rightIcon = { <Icon type = "material-community" name = "at" iconStyle = { styles.iconRight } /> }
            />
            <Input 
                placeholder = "Password"
                password = { true }
                secureTextEntry = { showPassword ? false : true }
                onChange = { (e) => onChange(e, "password") }
                containerStyle = { styles.inputForm }
                rightIcon = { <Icon 
                                type = "material-community" 
                                name = { showPassword ? "eye-off-outline" : "eye-outline" } 
                                iconStyle = { styles.iconRight } 
                                onPress = { () => setShowPassord(!showPassword) } 
                            /> }
            />
            <Input 
                placeholder = "Confirmar password"
                password = { true }
                secureTextEntry = { showConfirmPassword ? false : true }
                onChange = { (e) => onChange(e, "confirmPassword") }
                containerStyle = { styles.inputForm }
                rightIcon = { <Icon 
                                type = "material-community" 
                                name = { showConfirmPassword ? "eye-off-outline" : "eye-outline" }
                                iconStyle = { styles.iconRight } 
                                onPress = { () => setShowConfirmPassword(!showConfirmPassword) } 
                            /> }
            />
            <Button 
                title = "Registrarse"
                containerStyle = { styles.btnContainerRegistrarse }
                buttonStyle = { styles.btnRegister }
                onPress = { () => onSubmit() }
            />
            <Loading 
                isVisible = { loading }
                text = "Creando cuenta"
            />
        </View>
    )
}

function defaultFormValue(){
    return{
        email: "",
        password: "",
        confirmPassword: ""
    }
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30
    },
    inputForm: {
        width: "100%",
        marginTop: 20
    },
    btnContainerRegistrarse: {
        marginTop: 40,
        width: "70%"
    },
    btnRegister: {
        backgroundColor: "#00A680"
    },
    iconRight: {
        color: "#C1C1C1"
    }
});