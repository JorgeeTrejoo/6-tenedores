import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from "react-native-elements";
import * as firebase from "firebase";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";

export default function InfoUser(props){

    const { userInfo: { uid, photoURL, displayName, email }, toastRef, setLoading, setLoadingText } = props;

    //console.log(props.userInfo);
    
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if(resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galería");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [ 4, 3]
            });

            if(result.cancelled){
                toastRef.current.show("Has cerrado la seleccion de imagenes");
            }else{
                uploadImage(result.uri).then(() => {
                    updatePhotoUrl();
                }).catch(() => {
                    toastRef.current.show("Error al actualizar la foto");
                })
            }
        }
        
    };

    //Función para subir la imagen al storage de firebase
    //Le mandamos como parametro la uri que es la direccion donde se encuentra la imagen en el telefono fisico
    const uploadImage = async (uri) => {

        setLoadingText("Actualizando foto");
        setLoading(true);

        const response = await fetch(uri);
        //console.log(JSON.stringify(response));
        const blob = await response.blob();
        //console.log(JSON.stringify(blob));

        //Seleccionamos la carpeta del storage de firebase y le damos un nombre a la imagen unico con el uid es tipo id unico de cada usuario
        const ref = firebase.storage().ref().child(`users/${uid}`);

        //La subimos al storage de firebase
        return ref.put(blob);
    }

    //Funcion para actualizar la imagen del usuario en firebase
    const updatePhotoUrl = () => {
        firebase
            .storage()
            .ref(`users/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                const update = {
                    photoURL: response
                };
                await firebase.auth().currentUser.updateProfile(update);
                //console.log("Imagen actualizada");
                setLoading(false);
            })
            .catch(() => {
                toastRef.current.show("Error al actualizar la foto");
            })
    }

    return(
        <View style = { styles.viewUserInfo } >
            <Avatar 
                rounded
                size = "large"
                showEditButton
                onEditPress = { () => changeAvatar() }
                containerStyle = { styles.userInfoAvatar }
                source = { 
                            photoURL 
                            ? { uri: photoURL }
                            : require("../../../assets/img/user.png")
                        }
            />
            <View>
                <Text style = { styles.displayName} >
                   { displayName ? displayName : "Anonimo" } 
                </Text>
                <Text>
                    { email ? email : "Email redes sociales" }
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#F2F2F2",
        paddingTop: 30,
        paddingBottom: 30
    },
    userInfoAvatar: {
        marginRight: 20
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 10
    }
});