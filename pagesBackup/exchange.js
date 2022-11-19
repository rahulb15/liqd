import { Fragment , useContext , useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Head from "next/head";
import Image from "next/image";
import Loader from "../../components/Loader";
import { UserContext } from "../../contexts/UserContext";
import { req,formatDate } from "../../Utils";
import IdentityVerification from '../../components/IdentityVerification';
import Swap from "../../components/Swap";



export default function Exchange(props){

    const [User,setUser] = useContext(UserContext);
    const [loading,setLoading] = useState(true);

    const [verificationStatus , setVerificationStatus] = useState({
        status : null,
        path : null,
        verified : null,
  
  
  
      });

    async function fetchVerificationStatus(){
        let resp = await req("verify");
        if (resp) {
          console.log(resp);
          setVerificationStatus(resp)
        }else{
          console.log("fetching verification failed");
        }
      }

    useEffect(
        () => {
          fetchVerificationStatus().then( () => {
            console.log("done fetching data")
          })
        }
        , []
    )

    const html = (
        <Fragment>
  
          <Head>
            <meta charSet="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no"
            />
            <link rel="manifest" href="/assets/meta/manifest.json" />
            <link rel="shortcut icon" href="/assets/images/LIQD_logo_Square.png" />
            <title>Exchange</title>
          </Head>
          
  
          <div id="liqid-platform" className="application">
            <Header location="exchange" setLoading={setLoading} />

            <main>
            <section className="DashboardPage">
                
            {  false && <div className="w-full h-[300px]">
                <IdentityVerification customText={"Complete Identity Verification to unlock the Exchange"}  />
                </div> }

            {
              true && <Swap />
            }

            </section>



                </main>
                </div>
                </Fragment>
    );




    return (loading ?  <Loader setLoading={setLoading} /> : html);




}