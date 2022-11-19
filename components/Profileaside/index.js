import { Fragment } from "react";





export default function Profileaside(props){

    const html = (
      <Fragment>
        <aside>
          <nav>
            <a aria-current="page" className={ props.location == "verification" ? "active" : "" } href="verification.html">
              <span>Identity Verification</span>
            </a>
            {/* <a className={ props.location == "loyalty" ? "active" : "" } href="#" onClick={e => e.preventDefault()}>
              <span>Loyalty Levels</span>
            </a>
            <a className={ props.location == "referral" ? "active" : "" } href="#" onClick={e => e.preventDefault()}>
              <span>Refer a Friend</span>
            </a>
            <a className={ props.location == "settings" ? "active" : "" } href="#" onClick={e => e.preventDefault()}>
              <span>Settings</span>
            </a> */}
          </nav>
        </aside>
      </Fragment>
    );


    return html;


}