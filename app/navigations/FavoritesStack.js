import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Favorites from "../screens/Favorites";

const Stack = createStackNavigator();

export default function FavoritesStack(){
    return(
        <Stack.Navigator
            screenOptions = {{
                headerTitleAlign: "center"
            }}
        >
            <Stack.Screen 
                name = "favorites"
                component = { Favorites }
                options = {{
                    title: "Favoritos"
                }}
            />
        </Stack.Navigator>
    )
}
