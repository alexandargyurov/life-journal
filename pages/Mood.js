import React from "react";
import Slider from "react-native-slider";
import {TouchableHighlight, StyleSheet, View, Text} from "react-native";
import { SQLite } from "expo-sqlite";

const db = SQLite.openDatabase("database.db");

export default class MoodScreen extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            value: 0.5,
            moodId: 0,
            switchValue: true
        }

    }

    componentDidMount() {  
        db.transaction(
        tx => {
          tx.executeSql(
            "create table if not exists mood_reasons (id integer primary key not null, mood_id int, reason_id int);"
          );
  
          tx.executeSql(
            "create table if not exists reasons (id integer primary key not null, label text, UNIQUE(label));"
          );

          tx.executeSql(
            "create table if not exists moods (id integer primary key not null, mood int, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL);"
          );

          tx.executeSql(
            `INSERT OR IGNORE INTO reasons (label) values 
            ('friends'),
            ('family'),
            ('walking'),
            ('exercise'),
            ('travel'),
            ('alcohol'),
            ('dancing'),
            ('work'),
            ('colleagues'),
            ('movies'),
            ('business'),
            ('reading'),
            ('music'),
            ('concert'),
            ('gig'),
            ('driving'),
            ('eating-out'),
            ('tea'),
            ('coffee'),
            ('home'),
            ('love'),
            ('meditation'),
            ('yoga'),
            ('video-games'),
            ('board-games');
            `
          );

        })
      }

    _buttonSubmit() {
        db.transaction(
            tx => {
              tx.executeSql(`INSERT INTO moods (mood) VALUES (?);`, [
                this.state.value
              ], (tx, result) => this.setState({moodId: result.insertId})
              )
            }
          )

        console.log(this.state.moodId)  
        this.props.navigation.push('Reasons', {
            moodId: this.state.moodId
          });
      }

    _buttonReset() {
        db.transaction(
            tx => {
                tx.executeSql(`DROP TABLE moods;`)
                tx.executeSql(`DROP TABLE mood_reasons;`)
                tx.executeSql(`DROP TABLE reasons;`)
            }
        )
        console.log("DATABASE DROPPED")
    }

    render() {
        return (
            <View>
                <View style={styles.heading}>
                    <Text style={styles.title}>Life Tracker</Text>
                </View>

                <View style={styles.moodContainer}>

                    <View style={styles.moods}>
                        <Text styles={{width: 20}}>Terrible</Text>
                        <Text styles={{width: 20}}>Sad</Text>
                        <Text styles={{width: 20}}>OK</Text>
                        <Text styles={{width: 20}}>Happy</Text>
                        <Text styles={{width: 20}}>Amazed</Text>
                    </View>

                    <View style={styles.slider}>
                        <Slider
                            value={this.state.value}
                            onValueChange={value => this.setState({value})}
                        />

                        <Text>
                            Value: {this.state.value}
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <TouchableHighlight onPress={() => this._buttonSubmit()} underlayColor="white">
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>Next</Text>
                            </View>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => this._buttonReset()} underlayColor="white">
                            <View style={styles.button}>
                                <Text style={styles.buttonText}>RESET</Text>
                            </View>
                        </TouchableHighlight>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    heading: {
        paddingTop: 50,
        paddingBottom: 25
    },
    reasonsContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    reason: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between"

    },
    buttonContainer: {
        alignItems: "flex-end"
    },
    button: {
        width: "25%",
        borderRadius: 4,
        alignItems: 'center',
        backgroundColor: '#2196F3',
        marginRight: 20
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    buttonReasonText: {
        textAlign: 'center',
        padding: 7,
        color: 'white'
    },
    buttonReason: {
        width: "25%",
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: '#8134e5',
        marginRight: 20
    },
    title: {
        fontSize: 42,
        fontWeight: "bold",
        textAlign: "center",
    },
    moodContainer: {
        flex: 1,
        flexDirection: "column",
        marginTop: "40%"
    },
    moods: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around"
    },
    slider: {
        paddingLeft: 20,
        paddingRight: 20
    },
    container: {
        flex: 1,
        marginLeft: 10,
        marginRight: 10,
        flexDirection: "column",
        justifyContent: "flex-start",
        alignContent: "center"
    }
});
