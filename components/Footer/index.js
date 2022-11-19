import { Fragment } from "react";





export default function Footer(props){

    const html = (
      <Fragment>
        <footer>
          <section>
            <button
              type="button"
              className="Button link LanguagePickerButton m-b-5"
              aria-expanded="false"
            >
              <i className="fa fa-language" /> English
            </button>
            <nav>
              ©2022{" "}
              <a href="https://liqd.fi/" target="_blank" rel="noopener noreferrer">
                LIQD
              </a>
              <i>•</i>
              <a href="https://liqd.fi/earn/" target="_blank" rel="noopener noreferrer">
                Earn
              </a>
              <i>•</i>
              <a href="https://liqd.fi/privacy/" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              <i>•</i>
              <a href="https://liqd.fi/terms/" target="_blank" rel="noopener noreferrer">
                Terms &amp; Conditions
              </a>
            </nav>
          </section>
        </footer>
      </Fragment>
    );


    return html;


}