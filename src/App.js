import './App.css';
import { connect } from 'react-redux';
import { decrement, increment } from './redux/actionsTypes';
import Step1 from './components/Step1';

function App(props) {
  console.log(props)
  return (
    <div className="App">
      <Step1 />
    </div>
  );
}

const mapStateToProps = state => {
  return { count: state.count };
}
const mapDispatchToProps = dispatch => {
  return {
    increment: () => dispatch(increment()),
    decrement: () => dispatch(decrement())
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
