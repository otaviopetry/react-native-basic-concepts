import React, { useState, useEffect } from "react";

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import api from "./services/api";

export default function App() {

  // create the projects STATE
  const [projects, setProjects] = useState([]);

  // create effect to populate projects
  useEffect( () => {
    api.get('/repositories').then( (response) => {
      setProjects(response.data);
    })
  }, [])

  async function handleLikeRepository(id) {

    // store the updated project index
    const projectIndex = projects.findIndex(project => project.id === id);
    
    // create the post request as async function    
    const response = await api.post(`/repositories/${id}/like`);

    // create the new project with the new like
    const project = response.data;

    // remove the project from array and insert the updated one
    projects.splice(projectIndex, 1, project);

    // change the state with the updated array, important to use the spread operator
    setProjects([...projects]);
  }

  return (
    <>    
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList 
          data={projects}
          keyExtractor={project => project.id}
          renderItem={ ({ item: project }) => (
            <View style={styles.repositoryContainer}>
              <Text style={styles.repository}>{project.title}</Text>

              <View style={styles.techsContainer}>
                { project.techs.map( tech => (                  
                    <Text key={tech} style={styles.tech}>
                      {tech}
                    </Text>                  
                ))}
              </View>
              

              <View style={styles.likesContainer}>
                <Text
                  style={styles.likeText}
                  // Remember to replace "1" below with repository ID: {`repository-likes-${repository.id}`}
                  testID={`repository-likes-${project.id}`}
                >
                  {project.likes} curtidas
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(project.id)}
                // Remember to replace "1" below with repository ID: {`like-button-${repository.id}`}
                testID={`like-button-${project.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        
        />        
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    overflow: "hidden",
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 10,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    padding: 15,
  },
});
