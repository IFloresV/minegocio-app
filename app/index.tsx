import { ScrollView, Text, View } from "react-native";

export default function HomeScreen() {
   return (
      <>
         <ScrollView className="flex-1 bg-mn-base">
            {/* Hero Section */}
            <View className="bg-gradient-to-r from-mn-primary to-mn-secondary p-6 m-4 rounded-xl mt-48">
               <Text className="text-mn-fc font-inter-italic text-2xl text-center mb-2">¡Bienvenido a zermat! 🚀</Text>
            </View>
            <Text className="text-mn-fc text-2xl  text-center mb-2">¡Bienvenido a zermat! 🚀</Text>
         </ScrollView>
      </>
   );
}
