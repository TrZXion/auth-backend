const myname= "Sanskar";
const myname1= "Shivam";
const myname2= "Akash";

export const chargePercentage=()=>{
    return `${Math.floor(Math.random()*100)}%`;
};


// module.exports=myname;
export default myname;
export {myname1,myname2};