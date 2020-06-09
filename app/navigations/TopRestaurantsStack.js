import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TopRestaurants from "../screens/TopRestaurants";

const Stack = createStackNavigator();

export default function TopRestaurantsStack(){
    return(
        <Stack.Navigator
            screenOptions = {{
                headerTitleAlign: "center"
            }}
        >
            <Stack.Screen 
                name = "restaurants"
                component = { TopRestaurants }
                options = {{
                    title: "Top 5 Restaurantes"
                }}
            />
        </Stack.Navigator>
    )
}