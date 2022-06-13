import React from 'react';
import {Button, Modal, Select, InputNumber, Space} from 'antd';
import 'antd/dist/antd.css';
import './App.css';

const { Option } = Select;

function Variable (props) {
  const onChangeHandler = value => {
    props.setValue(value);
  };

  return (
    <InputNumber value={props.value} onChange={onChangeHandler} step="0.01"/>
  );
}

function Operator (props) {
  const onChangeHandler = value => {
    props.setValue(value);
  };

  return (
    <Select onChange={onChangeHandler} value={props.value}>
      {props.operators.map((operator) => <Option key={operator}>{operator}</Option>)}
    </Select>
  );
}


export default function App () {
  const [x1, setX1] = React.useState(1)
  const [x2, setX2] = React.useState(2)
  const [x3, setX3] = React.useState(3)
  const [result, setResult] = React.useState(6)

  const possibleOperators = ['+', '-', '/', '*', '%', '^', 'log']
  const [operator1, setOperator1] = React.useState(possibleOperators[0])
  const [operator2, setOperator2] = React.useState(possibleOperators[0])

  const operate = (a, operator, b) => {
    switch (operator) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '/':
        return a / b
      case '*':
        return a * b
      case '%':
        return a / 100 * b
      case '^':
        return a ** b
      case 'log':
        return Math.log(b) / Math.log(a)
    }
  }

  const reverse_right = (a, operator, b) => {
    switch (operator) {
      case '+':
          return a - b
        case '-':
          return -1 * (a - b)
        case '/':
          return b / a
        case '*':
          return a / b
        case '%':
          return a / b * 100
        case '^':
          return Math.log(a) / Math.log(b)
        case 'log':
          return b ** a
    }
  }

  const reverse_left = (a, operator, b) => {
    switch (operator) {
      case '+':
        return a - b
      case '-':
        return a + b
      case '/':
        return a * b
      case '*':
        return a / b
      case '%':
        return a / b * 100
      case '^':
        return a ** (1 / b)
      case 'log':
        return b ** (1 / a)
    }
  }

  const calculate = () => {
    let request = `(${x1} ${operator1} ${x2}) ${operator2} ${x3} = ${result}`.replace('null', 'x')
    let first = ''
    let answer = ''

    if (x1 !== null && x2 !== null && x3 !== null && result !== null) {
      first = operate(x1, operator1, x2)
      answer = Math.round(operate(first, operator2, x3) * 100) / 100

      if (answer === result) {
        Modal.success({
          title: 'Успешное выполнение',
          content: (
            <div>
              <p>Равенство соблюдается</p>
              <p>Запрос: {request}</p>
            </div>
          ),
          footer: (null),
        });
      } else {
        Modal.warning({
          title: 'Возникла проблема',
          content: (
            <div>
              <p>Равенство не соблюдается</p>
              <p>Запрос: {request}</p>
            </div>
          ),
          footer: (null),
        });
      
    }
    return;
    }

    if (result === null) {
      first = operate(x1, operator1, x2)
      answer = operate(first, operator2, x3)
    }

    else if (x3 === null) {
      first = operate(x1, operator1, x2)
      answer = reverse_right(result, operator2, first)
    }

    else {
      first = reverse_left(result, operator2, x3)
      if (x2 === null) {
        answer = reverse_right(first, operator1, x1)
      } else {
        answer = reverse_left(first, operator1, x2)
      }
    }

    console.log(answer)
    Modal.success({
      title: 'Успешное выполнение',
      content: (
        <div>
          <p>Запрос: {request}</p>
          <p>Ответ: х = {Math.round(answer * 100) / 100}</p>
        </div>
      ),
      footer: (null),
    });

  }

  return (
      <div className="centered background">
        <Space size={20} align='center' direction='vertical'>
        <div align='center'>
          <Space size={10}>
            <Variable value={x1} setValue={setX1}/>
            <Operator value={operator1} setValue={setOperator1} operators={possibleOperators}/>
            <Variable value={x2} setValue={setX2}/>
            <Operator value={operator2} setValue={setOperator2} operators={possibleOperators}/>
            <Variable value={x3} setValue={setX3}/>
            <span className='white_span'>=</span>
            <Variable value={result} setValue={setResult}/>
          </Space>
        </div>
        <div>
          <Button type="default" onClick={calculate}>Calculate</Button>
        </div>
        </Space>
      </div>
  );
}
