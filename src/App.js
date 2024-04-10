import './App.css';
import Menu from './Components/Menu/Menu';
import {Fragment} from "react";

function App({user, logoutAction}) {

  return (
      <Fragment>
          <Menu
              user={user}
              logoutAction={logoutAction}
          />
      </Fragment>
  );
}

export default App;
