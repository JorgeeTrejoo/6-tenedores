import React, {useState, useRef, useCallback} from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { Image, Icon, Button } from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';

import {firebaseApp} from '../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function Favorites(props) {

    const { navigation } = props;

    //Estado donde guardaremos todos los restaurantes
    const [restaurants, setRestaurants] = useState(null);
    //Estado para comprobar si el usuario esta logeado
    const [userLogged, setUserLogged] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const [reloadData, setReloadData] = useState(false);
    //Toast
    const toastRef = useRef();

    //Comprobamos si el usuario esta logeado
    firebase.auth().onAuthStateChanged((user) => {
        user ? setUserLogged(true) : setUserLogged(false);
    });

    //Obtenemos los restaurantes
    useFocusEffect(
        useCallback(() => {
            if(userLogged){
                const idUser = firebase.auth().currentUser.uid;
                db.collection("favorites")
                        .where("idUser", "==", idUser)
                        .get()
                        .then((response) => {
                            const idRestaurantsArray = [];
                            response.forEach((doc) => {
                                //console.log(doc.data());
                                idRestaurantsArray.push(doc.data().idRestaurant);
                            });

                            //Esta funcion devuelve una promesa el response, que el response van hacer todos los restaurantes
                            getDataRestaurant(idRestaurantsArray).then((response) => {
                                const restaurants = [];
                                response.forEach((doc) => {
                                    //console.log(doc.data());
                                    const restaurant = doc.data();
                                    restaurant.id = doc.id;
                                    restaurants.push(restaurant);
                                });

                                setRestaurants(restaurants);
                            });
                        });
            }

            setReloadData(false);

        },[userLogged, reloadData])
    );

    //Obtenemos todos los datos de los restaurantes
    const getDataRestaurant = (idRestaurantsArray) => {
        const arrayRestaurants = [];
        idRestaurantsArray.forEach((idRestaurant) => {
            const result = db.collection("restaurants").doc(idRestaurant).get();

            arrayRestaurants.push(result);
        })

        return Promise.all(arrayRestaurants);
    };

    //Si el usuario no esta logeado mandamos el componente UserNoLogged
    if(!userLogged){
        return <UserNoLogged navigation={navigation} />
    }

    //Si restaurants es nulo mostramos un loading, porque al principio es nulo
    if(restaurants?.length === 0){
        return <NotFoundRestaurants />
    }

    return ( 
        <View style={styles.viewBody}>
           {restaurants ? (
               <FlatList 
                    data={restaurants}
                    renderItem={(restaurant) => (
                        <Restaurant 
                        restaurant={restaurant} 
                        setIsLoading={setIsLoading}
                        toastRef={toastRef}
                        setReloadData={setReloadData}
                        navigation={navigation}
                        />
                    )}

                    keyExtractor={(item, index) => index.toString()}
               />
           ) : (
               <View style={styles.loaderRestaurants}>
                   <ActivityIndicator size="large" />
                   <Text style={{ textAlign: "center" }}>Cargando restaurantes</Text>
               </View>
           )}
           <Toast ref={toastRef} position="center" opacity={0.9}/>
           <Loading text="Eliminando restaurante" isVisible={isLoading}/>
        </View>
     );
}

//Componente para mostrarselo al usuario si no tiene ningún restaurante añadido a favoritos
function NotFoundRestaurants(){
    return(
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Icon 
                type="material-community"
                name="emoticon-sad-outline"
                size={50}
            />
            <Text style={{fontSize: 18, fontWeight: "bold", marginTop: 5}}>
                Sin restaurantes favoritos
            </Text>
        </View>
    )
}

//Componente para mostrarlo en la pantalla de favoritos si los usuarios no estan logeados
function UserNoLogged(props){
    const { navigation } = props;

    return(
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <Icon 
                type="material-community"
                name="login"
                size={50}
            />
            <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10, textAlign: "center" }}>
                Es necesario estar logeado
            </Text>
            <Button 
                title="Iniciar Sesión"
                containerStyle={{ marginTop: 40, width: "80%", shadowColor: "#000", shadowOffset: { width: 5, height: 5 }, shadowOpacity: 0.3 }}
                buttonStyle={{ backgroundColor: "#689689" }}
                onPress={() => navigation.navigate("account", { screen: "login" })}
            />
        </View>
    )
}

function Restaurant(props){

    const { restaurant, setIsLoading, toastRef, setReloadData, navigation } = props;
    const { id, name, images } = restaurant.item;

    //Funcion para mandar la alerta de remover el restaurante de favoritos
    const confirmRemoveFavorite = () => {
        Alert.alert(
            "Eliminar restaurante de favoritos",
            "¿Estás seguro de eliminar el restaurante de favoritos?",
            [
                {
                    text: "Cancelar",
                    style: "cancel"
                },
                {
                    text: "Eliminar",
                    onPress: removeFavorite
                }
            ],
            {
                cancelable: false
            }
        )
    }

    //Funcion para eliminar el restaurante de favoritos
    const removeFavorite = () => {

        setIsLoading(true);

        db.collection("favorites")
                .where("idRestaurant", "==", id)
                .where("idUser", "==", firebase.auth().currentUser.uid)
                .get()
                .then((response) => {
                    response.forEach((doc) => {
                        const idFavorite = doc.id;
                        db.collection("favorites")
                                .doc(idFavorite)
                                .delete()
                                .then(() => {
                                    setIsLoading(false);
                                    setReloadData(true);
                                    toastRef.current.show("Restaurante eliminado");
                                })
                                .catch(() => {
                                    setIsLoading(false);
                                    toastRef.current.show("Error al eliminar restaurante");
                                });
                    })
                })
    }

    return(
        <View style={styles.restaurant}>
            <TouchableOpacity onPress={() =>
                 navigation.navigate("restaurants", { screen: "restaurant", params: { id: id } })}>
                <Image 
                    resizeMode="cover"
                    style={styles.imageRestaurant}
                    PlaceholderContent={<ActivityIndicator color="#fff" />}
                    source={images[0] ? {uri:images[0]} : require("../../assets/img/no-photo.png")}
                />
                <View style={styles.infoRestaurant}>
                    <Text style={styles.nameRestaurant}>{name}</Text>
                    <Icon 
                        type="material-community"
                        name="heart"
                        color="#f00"
                        containerStyle={styles.favorite}
                        onPress={confirmRemoveFavorite}
                        underlayColor="transparent"
                    />
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#f2f2f2"
    },
    loaderRestaurants: {
        marginTop: 10,
        marginBottom: 10
    },
    restaurant: {
        margin: 10
    },
    imageRestaurant: {
        width: "100%",
        height: 180
    },
    infoRestaurant: {
       flex: 1,
       alignItems: "center",
       justifyContent: "space-between",
       flexDirection: "row",
       paddingLeft: 20,
       paddingRight: 20,
       paddingTop: 10,
       paddingBottom: 10,
       marginTop: -30,
       backgroundColor: "#fff"
    },
    nameRestaurant: {
        fontWeight: "bold",
        fontSize: 24
    },
    favorite: {
        marginTop: -35,
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 100
    }
})