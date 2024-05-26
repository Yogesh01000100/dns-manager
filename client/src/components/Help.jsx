import withAuth from "./HOC";

function WHelp(){
    return <>Help component</>
}


const Help = withAuth(WHelp);
export default Help;
