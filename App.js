import React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Modal, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'
const sha256 = require("sha256");

const data = [
  { label: 'Model 1', value: 'modal1' },
  { label: 'Model 2', value: 'modal2' },
];
const MODEL1 = {
  "name": "Hash String",
  "fields": {
    "input": [
      {
        "label": "string1",
        "type": "string",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "string2",
        "type": "string",
        "readOnly": false,
        "calculate": null,
      },
    ],
    "output": [{
      "label": "result",
      "type": "string",
      "readOnly": true,
      "calculate": "sha256",
    }]
  }
} 
const MODEL2 = {
  "name": "Number",
  "fields": {
    "input": [
      {
        "label": "12",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "10",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "32",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "54",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "21",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "2",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "4",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "0",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "5",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
      {
        "label": "85",
        "type": "int",
        "readOnly": false,
        "calculate": null,
      },
    ],
    "output": [
      {
        "label": "",
        "type": "int",
        "readOnly": true,
        "calculate": "mean",
      },
      {
        "label": "",
        "type": "int",
        "readOnly": true,
        "calculate": "median",
      },
      {
        "label": "",
        "type": "int",
        "readOnly": true,
        "calculate": "standard",
      },
    ]
  }
} 


export default function App() {
  const [dropdown, setDropdown] = useState(null);
  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState({});
  
  useEffect(() => {
    console.log('effect')
    if (dropdown == 'modal1') {
      let array = MODEL1.fields.input.map((item, key) => item.label);
      if (array[0] == array[1]) {
          throw new Error('Input strings must be unique');
      }
      const combinedString = array[0] < array[1] ? array[0] + array[1] : array[1] + array[0];
      hashValue = sha256(combinedString, true);
      setOutput({
        0: hashValue
      });
    } else {
      let array = MODEL2.fields.input.map((item, key) => Number(item.label));
      firstValue = getMean(array); 
      secondValue = getMedian(array);
      thirdValue = getStandardDeviation(array);
      setOutput(
        {
          0: firstValue,
          1: secondValue,
          2: thirdValue
        }
      )
    }
    
  }, [dropdown])

  const onInputChange = (key, value) => {
    setInputs((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  function getMean(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += array[i];
    }
    let mean = sum / array.length;
    return mean;
  }

  function getMedian(array) {
    array.sort((a, b) => a - b);
    let median;
    const length = array.length;
    if (length % 2 === 0) {
      // If the array has an even number of elements, the median is the average of the two middle values
      median = (array[length / 2 - 1] + array[length / 2]) / 2;
    } else {
      // If the array has an odd number of elements, the median is the middle value
      median = array[Math.floor(length / 2)];
    }
    return median;
  }

  function getStandardDeviation(array) {
    const mean = array.reduce((acc, val) => acc + val, 0) / array.length;

    const squaredDiffs = array.map((val) => Math.pow(val - mean, 2));

    const avgSquaredDiff = squaredDiffs.reduce((acc, val) => acc + val, 0) / squaredDiffs.length;

    const standardDeviation = Math.sqrt(avgSquaredDiff);
    return standardDeviation;
  }

  const _renderItem = item => {
    return (
    <View style={[styles.item, {width: 300, height: 40, alignItems: 'center', justifyContent: 'center', borderBottomColor: 'black', borderBottomWidth: 2}]}>
        <Text style={{width: 100, height: 20, }}>{item.label}</Text>
    </View>
    );
  };

  const renderModel = (model) => {
    return (
      <ScrollView>
          <Text style={{marginVertical: 16, alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'red', fontSize: 24}}>{model.name}</Text>
          {model.fields.input.map((item, key) => {
            return <TextInput
              key={key}
              style={styles.input}
              onChangeText={(text) => onInputChange(key, text)}
              value={item.label}
            />
          })}
          {model.fields.output.map((item, key) => {
            return <TextInput
              key={key}
              style={styles.input}
              value={typeof(output[`${key}`]) == 'number' ? output[`${key}`].toString() : output[`${key}`]}
            />
          })}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Dropdown
        style={styles.dropdown}
        data={data}
        value={dropdown}
        placeholder='Select Item'
        containerStyle={{width:300,alignSelf: 'center'}}
        onChange={item => {
          setDropdown(item.value)
        }}
        renderItem={item => _renderItem(item)}
      />
      {dropdown == 'modal1' ? renderModel(MODEL1) : renderModel(MODEL2)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 70
  },
  input: {
    width: 300,
    height: 35,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  dropdown: {
    height: 50,
    width: 300,
    borderColor: 'grey',
    paddingHorizontal: 8,
    backgroundColor: 'yellow'
  },
});
