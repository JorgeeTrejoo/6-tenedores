import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, Avatar, Rating } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { map } from 'lodash';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {

    const { navigation, idRestaurant } = props;

    const [userLogged, setUserLogged] = useState(false);
    //Estado para guardar las puntuaciones
    const [reviews, setReviews] = useState([]);

    //Preguntamos con firebase si el usuario esta logeado o no
    firebase.auth().onAuthStateChanged((user) => {

        user ? setUserLogged(true) : setUserLogged(false);

    });

    //Nos traemos todos los comentarios donde el id del restaurant sea igual al id restaurant
    useFocusEffect(
        useCallback(() => {
            db.collection("reviews")
                .where("idRestaurant", "==", idRestaurant)
                .get()
                .then((response) => {
    
                    const resultReview = [];
    
                    response.forEach(doc => {
                        const data = doc.data();
                        data.id = doc.id;
                        resultReview.push(data);
                    });
    
                    setReviews(resultReview);
                    
                })
        }, [])
    );

    return (
        <View>
            {userLogged ? (
                <Button 
                    title="Danos tu opinión"
                    buttonStyle={styles.btnAddReview}
                    titleStyle={styles.btnTitleReview}
                    icon={{
                        type: "material-community",
                        name: "weather-night",
                        color: "#689689"
                    }}
                    onPress={() => navigation.navigate("add-review-restaurant", {
                        idRestaurant: idRestaurant
                    })}
                />
            ) : (
                <View>
                    <Text 
                        style={{textAlign: "center", color: "#689689", fontWeight: "bold", padding: 20}}
                        onPress={() => navigation.navigate("login")}
                    >
                        INICIA SESIÓN PARA DAR TU OPINIÓN 
                    
                    </Text>
                </View>
            )}

            { map(reviews, (review, index) => (
                <Review key={index} review={review} />
            )) }
        </View>
    )
}

//Componente que renderiza todos los comentarios
function Review(props){

    const { title, review, rating, createAt, avatarUser } = props.review;
    const createReview = new Date(createAt.seconds * 1000);

    return(
        <View style={styles.viewReview}>
            <View style = {styles.viewImageAvatar}>
                <Avatar
                    size="large"
                    rounded
                    containerStyle={styles.imageAvatarUser}
                    source={avatarUser ? {uri: avatarUser} : require("../../../assets/img/user.png")}
                />
            </View>
            <View style={styles.viewInfo}>
                <Text style={styles.reviewTitle}>{title}</Text>
                <Text style={styles.reviewComent}>{review}</Text>
                <Rating  
                    imageSize={15}
                    startingValue={rating}
                    readonly
                />
                <Text 
                    style={styles.reviewDate}
                >
                    {createReview.getDate()}/
                    {createReview.getMonth() + 1}/
                    {createReview.getFullYear()} -{" "}
                    {createReview.getHours()}:
                    {createReview.getMinutes() < 10 ? "0" : ""}{createReview.getMinutes()}
                </Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    btnAddReview: {
        backgroundColor: "transparent",
        marginTop: 20,
        marginBottom: 40
    },
    btnTitleReview: {
        color: "#689689",
        fontWeight: "bold"
    },
    viewReview: {
        flexDirection: "row",
        padding: 10,
        paddingBottom: 20,
        borderBottomColor: "#e3e3e3",
        borderBottomWidth: 1
    },
    viewImageAvatar: {
        marginRight: 15
    },
    imageAvatarUser: {
        width: 50,
        height: 50
    },
    viewInfo: {
        flex: 1,
        alignItems: "flex-start"
    },
    reviewTitle: {
        fontWeight: "bold"
    },
    reviewComent: {
        paddingTop: 2,
        color: "grey",
        marginBottom: 5
    },
    reviewDate: {
        marginTop: 5,
        color: "grey",
        fontSize: 12,
        position: "absolute",
        right: 0,
        bottom: 0
    }
})
