import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";

import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

//Obtenemos el ancho de la pantalla
const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props){

    const { toastRef, setIsLoading, navigation } = props;

    const [ restaurantName, setRestaurantName ] = useState("");
    const [ restaurantAddress, setRestaurantAddress ] = useState("");
    const [ restaurantDescription, setRestaurantDescription ] = useState("");

    //Estado para array de imagenes para seleccionar maximo 5 para el restaurant
    const [ imageSelected, setImageSelected ] = useState([]);

    const [ isVisibleMap, setIsVisibleMap ] = useState(false);

    const [locationRestaurant, setLocationRestaurant] = useState(null);
    
    const addRestaurant = () => {
        if(!restaurantName || !restaurantAddress || !restaurantDescription){
            toastRef.current.show("Todos los campos son obligatorios");
        }else if(size(imageSelected) === 0){
            toastRef.current.show("El Restaurante tiene que tener al menos una foto");
        }else if(!locationRestaurant){
            toastRef.current.show("El Restaurante tiene que tener ubicación");
        }else{

            setIsLoading(true);

            uploadImageStorage().then((response) => {
                //Subimos el restaruante a firestore la base de datos de firebase
                db.collection("restaurants")
                    .add({
                        name: restaurantName,
                        address: restaurantAddress,
                        description: restaurantDescription,
                        location: locationRestaurant,
                        images: response,
                        rating: 0,
                        ratingTotal: 0,
                        quantityVoting: 0,
                        createAt: new Date(),
                        createBy: firebase.auth().currentUser.uid,
                    })
                    .then(() => {
                        setIsLoading(false);
                        navigation.navigate("restaurants");
                    })
                    .catch(() => {
                        setIsLoading(false);
                        toastRef.current.show("Error al subir el restaurante, intentelo más tarde");
                    })
            });
        }
    };

    const uploadImageStorage = async () => {
        //console.log(imageSelected);
        const imageBlob = [];

        //Creamos una pormesa
        await Promise.all(
            //Guardamos las imagenes en el storage
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref("restaurants").child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase 
                                .storage()
                                .ref(`restaurants/${result.metadata.name}`)
                                .getDownloadURL()
                                .then(photoUrl => {
                                    imageBlob.push(photoUrl);
                                })
                });
            })
        );
        return imageBlob;
    };

    return(
        <ScrollView style = { StyleSheet.scrollView } >
            <ImageRestaurant imageRestaurant = { imageSelected[0] }/>
            <FormAdd 
                setRestaurantName = { setRestaurantName }
                setRestaurantAddress = { setRestaurantAddress }
                setRestaurantDescription = { setRestaurantDescription }
                setIsVisibleMap = { setIsVisibleMap }
                locationRestaurant = { locationRestaurant }
            />
            <UploadImage 
                toastRef = { toastRef } 
                imageSelected = { imageSelected } 
                setImageSelected = { setImageSelected } 
            />
            <Button 
                title = "Crear Restaurante"
                onPress = { addRestaurant }
                buttonStyle = { styles.btnAddRestaurant }
            />
            <Map 
                isVisibleMap = { isVisibleMap }
                setIsVisibleMap = { setIsVisibleMap }
                setLocationRestaurant = { setLocationRestaurant }
                toastRef = { toastRef }
            />
        </ScrollView>
    )
}

function ImageRestaurant(props){
    const { imageRestaurant } = props;
    return(
        <View style = { styles.viewPhoto } >
            <Image 
                source = {
                    imageRestaurant 
                        ? { uri: imageRestaurant } 
                        : require("../../../assets/img/no-photo.png")
                }
                style = {{
                    width: 300,
                    height: 300
                }}
            />
        </View>
    )
}

function FormAdd(props){

    const { setRestaurantName, setRestaurantAddress, setRestaurantDescription, setIsVisibleMap, locationRestaurant } = props;

    return(
        <View style = { styles.viewForm } >
            <Input 
                placeholder = "Nombre del restaurante"
                containerStyle = { styles.input }
                onChange = {e => setRestaurantName(e.nativeEvent.text)}
            />
            <Input 
                placeholder = "Dirección"
                containerStyle = { styles.input }
                onChange = {e => setRestaurantAddress(e.nativeEvent.text)}
                rightIcon = {{
                    type: "material-community",
                    name: "google-maps",
                    color: locationRestaurant ? "#689689" : "#C2C2C2",
                    onPress: () => setIsVisibleMap(true) 
                }}
            />
            <Input 
                placeholder = "Descripción del restaurant"
                multiline = { true }
                inputContainerStyle = { styles.textArea }
                onChange = {e => setRestaurantDescription(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map(props){

    const { isVisibleMap, setIsVisibleMap, setLocationRestaurant, toastRef } = props;

    const [ location, setLocation ] = useState(null);

    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;

            if(statusPermissions !== "granted"){
                toastRef.current.show("Tienes que aceptar los permisos de localicación para crear un restaurante", 3000);
            }else{
                const loc = await Location.getCurrentPositionAsync({});
                //console.log(loc);
                setLocation({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001
                })
            }
        })()
    }, []);

    const confirmLocation = () => {
        setLocationRestaurant(location);
        toastRef.current.show("Localización guardara correctamente");
        setIsVisibleMap(false);
    }

    return(
        <Modal 
            isVisible = { isVisibleMap } 
            setIsVisible = { setIsVisibleMap } 
        >
            <View>
                { location && (
                    <MapView 
                        style = { styles.mapStyle }
                        initialRegion = { location }
                        showsUserLocation = { true } 
                        onRegionChange = {(region) => setLocation(region)}
                    >
                        <MapView.Marker 
                            coordinate = {{
                                latitude: location.latitude,
                                longitude: location.longitude
                            }}
                            draggable
                        />
                    </MapView>
                )}
                <View style = { styles.viewMapBtn }>
                    <Button 
                        title = "Guardar"
                        containerStyle = { styles.viewMapBtnContainerSave }
                        buttonStyle = { styles.viewMapBtnSave } 
                        onPress = { confirmLocation }
                    />
                    <Button 
                        title = "Cancelar"
                        containerStyle = { styles.viewMapBtnContainerCancel }
                        buttonStyle = { styles.viewMapBtnCancel }
                        onPress = {() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function UploadImage(props){

    const { toastRef, imageSelected, setImageSelected } = props;

    const imageSelect = async () => {
        const resultPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        //console.log(resultPermissions);
        if(resultPermissions === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galería, si los has rechazado tienes que ir a condiguración y activarlos manualmente", 3000);
        }else{
            //Si acepto los permisos accedemos a la galería
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [ 4, 3 ]
            });
            //console.log(result);
            if(result.cancelled){
                toastRef.current.show("Has cerrado la galería sin seleccionar ninguna imagen", 2000);
            }else{
                //console.log(result.uri);
                setImageSelected([...imageSelected, result.uri]);
            }
        }
    }

    const removeImage = (image) => {

        Alert.alert(
            "Eliminar Imagen",
            "¿Estás seguro de eliminar la imagen?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: () => {
                        //console.log("Eliminada");
                        setImageSelected(
                            filter(imageSelected, (imageUrl) => imageUrl !== image)
                        );
                    }
                }
            ],
            { cancelable: false }
        );
    }

    return(
        <View style = { styles.viewImages } >
            { size(imageSelected) < 4 && (
                <Icon 
                    type = "material-community"
                    name = "camera"
                    color = "#504136"
                    size = { 40 }
                    containerStyle = { styles.containerIcon }
                    onPress = { imageSelect }
                />
            )}
            { map(imageSelected, (imageRestaurant, index) => (
                <Avatar 
                    key = { index }
                    style = { styles.miniatureStyle }
                    source = {{
                        uri: imageRestaurant
                    }}
                    onPress = {() => removeImage(imageRestaurant)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: "100%"
    },
    viewForm: {
        marginLeft: 10,
        marginRight: 10
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: "100%",
        padding: 0,
        margin: 0

    },
    btnAddRestaurant: {
        backgroundColor: "#689689",
        margin: 40,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    },
    viewImages: {
        flexDirection: "row",
        marginLeft: 20,
        marginRight: 20,
        marginTop: 30,
        //alignItems: "center",
        //justifyContent: "center"
    },
    containerIcon: {
        alignItems: "center",
        justifyContent: "center",
        marginRight: 15,
        height: 70,
        width: 70,
        backgroundColor: "#A49E8D",
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    },
    miniatureStyle: {
        width: 70,
        height: 70,
        marginRight: 10
    },
    viewPhoto: {
        alignItems: "center",
        height: 300,
        marginBottom: 20,
        marginTop: 20
    },
    mapStyle: {
        width: "100%",
        height: 550
    },
    viewMapBtn: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10
    },
    viewMapBtnContainerCancel: {
        paddingLeft: 5
    },
    viewMapBtnCancel: {
        backgroundColor: "#A60D0D"
    },
    viewMapBtnContainerSave: {
        paddingRight: 5
    },
    viewMapBtnSave: {
        backgroundColor: "#689689"
    }
})