import './AdminPanel.scss'
// import Maindash from './components/Maindash/maindash';
// import Sidebar from './components/sidebar/sidebar';
import Maindash from '../../Components/Maindash/maindash'
import Sidebar from '../../Components/sidebar/sidebar'

const AdminPanel=()=> {
  return (
    <div className="AdminPanel">
        <div className="AppGlass"> 
          
   
           <Maindash/> 
        </div>
    </div>
  );
}

export default AdminPanel;
