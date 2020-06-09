import React, {useState, useRef} from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/Loading';

import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {

    const { navigation, route } = props;
    const { idRestaurant } = route.params;

    const [rating, setRating] = useState(null);
    const [title, setTitle] = useState("");
    const [review, setReview] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const toastRef = useRef();

    const addReview = () => {
        if(!rating){
            toastRef.current.show("No has dejado ninguna puntuación");
        }else if(!title){
            toastRef.current.show("El título es obligatorio");
        }else if(!review){
            toastRef.current.show("El comentario es obligatorio");
        }else{

            setIsLoading(true);
            //Sacamos los datos del usuario que esta logeado
            const user = firebase.auth().currentUser;
            //Un payload son los datos que vamos a guardar en firestore
            const payload = {
                idUser: user.uid,
                avatarUser: user.photoURL,
                idRestaurant: idRestaurant,
                title: title,
                review: review,
                rating: rating,
                createAt: new Date()
            };

            //Insertamos todos los datos en firestore
            db.collection("reviews")
                    .add(payload)
                    .then(() => {
                        updateRestaurant();
                    }).catch(() => {
                        toastRef.current.show("Error al enviar el comentario");
                        setIsLoading(false);
                    });

        }
    }

    const updateRestaurant = () => {
        //Obtenemos la puntuación actual del restaurante
        const restaurantRef = db.collection("restaurants").doc(idRestaurant);

        restaurantRef.get().then((response) => {
            //Guardamos los datos del restaurante en una constante
            const restaurantData = response.data();

            //Calculamos el total de puntuación del restaurante
            const ratingTotal = restaurantData.ratingTotal + rating;
            
            //Cogemos todas las veces que se ha votado ese restaurant y ponemos un + 1
            const quantityVoting = restaurantData.quantityVoting + 1;

            //Sacamos la media de todas las votaciones
            const ratingResult = ratingTotal / quantityVoting;

            //Ahora si actualizamos el restaurante con los nuevos datos
            restaurantRef.update({
                rating: ratingResult,
                ratingTotal: ratingTotal,
                quantityVoting: quantityVoting
            }).then(() => {
                //Quitamos el setloading y regresamos a la pantalla de atras a la del restuarante
                setIsLoading(false);
                navigation.goBack();
            })
        });
    }

    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5}
                    reviews={[
                        "Pèsimo",
                        "Deficiente",
                        "Normal",
                        "Bueno",
                        "Excelente"
                    ]}
                    defaultRating={0}
                    size={30}
                    onFinishRating={(value) => {setRating(value)}}
                />
            </View>
            <View style={styles.formReview}>
                <Input 
                    placeholder="Titulo"
                    containerStyle={styles.input}
                    onChange={(e) => setTitle(e.nativeEvent.text)}
                />
                <Input 
                    placeholder="Comentario..."
                    multiline = { true }
                    inputContainerStyle = { styles.textArea }
                    onChange={(e) => setReview(e.nativeEvent.text)}
                />
                <Button
                    title="Enviar Comentario"
                    containerStyle={styles.btnEnviar}
                    buttonStyle={styles.btn}
                    onPress={addReview}
                >

                </Button>
            </View>
            <Toast ref={toastRef} position="center" opacity={0.9}/>
            <Loading isVisible={isLoading}  text="Enviando comentario"/>
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1
    },
    viewRating: {
        height: 110,
        backgroundColor: "#f2f2f2"
    },
    formReview: {
        flex: 1,
        alignItems: "center",
        margin: 10,
        marginTop: 40
    },
    input: {
        marginBottom: 10
    },
    textArea: {
        height: 150,
        width: "100%",
        padding: 0,
        margin: 0
    },
    btnEnviar: {
        flex: 1,
        justifyContent: "flex-end",
        marginTop: 20,
        marginBottom: 10,
        width: "95%",
        shadowColor: "#000",
        shadowOffset: { width: 5, height: 5 },
        shadowOpacity: 0.3
    },
    btn: {
        backgroundColor: "#689689"
    }
})
