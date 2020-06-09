import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from '@react-navigation/native';
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from '../../components/Restaurants/ListRestaurants';

const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {

    const { navigation } = props;

    //Creamos un estado para saber si el usuario esta logeado o no
    const [user, setUser] = useState(null);
    //Estado donde guardaremos todos los restaurantes
    const [ restaurants, setRestaurants ] = useState([]);
    //Estado para saber cuantos restaurantes tenemos en total
    const [ totalRestaurants, setTotalRestaurants ] = useState(0);
    //Estado por donde empezaran los restaurantes a mostrarse
    const [ startRestaurants, setStartRestaurants ] = useState(null);

    const [ isLoading, setIsLoading ] = useState(false);
    //console.log(totalRestaurants);
    const limitRestaurants = 10;

    useEffect(() => {
        firebase.auth().onAuthStateChanged((userInfo) => {
            //console.log(userInfo);
            setUser(userInfo);
        })
    }, []);

    //Traemos todos los restuarantes cada vez que se cargue la pagina de restuarants para obtener los nuevos 
    useFocusEffect(
        useCallback(() => {
            db.collection("restaurants").get().then((snap) => {
                setTotalRestaurants(snap.size);
            });
            //Obtenemos la información de todos los restaurantes
            const resultRestaurants = [];
            //Los ordenamos por fecha de creacion del ultimo al primero y le damos que nos muestre un limite 7 
            db.collection("restaurants")
                .orderBy("createAt", "desc")
                .limit(limitRestaurants)
                .get()
                .then((response) => {
                    
                    setStartRestaurants(response.docs[response.docs.length - 1]);
    
                    response.forEach((doc) => {
                        //console.log(doc.id);
                        const restaurant = doc.data();
                        restaurant.id = doc.id;
                        //console.log(restaurant);
                        resultRestaurants.push(restaurant);
                    });
                    setRestaurants(resultRestaurants);
                    
                });
        }, [])
    );

    const handleLoadMore = () => {
        const resultRestaurants = [];
        restaurants.length < totalRestaurants && setIsLoading(true);

        db.collection("restaurants")
                .orderBy("createAt", "desc")
                .startAfter(startRestaurants.data().createAt)
                .limit(limitRestaurants)
                .get()
                .then((response) => {
                    if(response.docs.length > 0){
                        setStartRestaurants(response.docs[response.docs.length - 1]);
                    }else{
                        setIsLoading(false);
                    }

                    response.forEach((doc) => {
                        const restaurant = doc.data();
                        restaurant.id = doc.id;
                        resultRestaurants.push(restaurant);
                    });

                    setRestaurants([...restaurants, ...resultRestaurants]);
                });
    };

    return ( 
        <View style = { styles.viewBody } >
            <ListRestaurants 
                restaurants = {restaurants}
                handleLoadMore={handleLoadMore}
                isLoading={isLoading}
            />

            { user && (
                <Icon 
                    type = "material-community"
                    name = "plus"
                    color  = "#689689"
                    reverse
                    containerStyle = { styles.btnContainer }
                    onPress = {() => navigation.navigate("add-restaurant")}
                />
            )}
        </View>
     );
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: "#FFF"
    },
    btnContainer: {
        position: "absolute",
        bottom: 20,
        right:20,
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.5
    }
});