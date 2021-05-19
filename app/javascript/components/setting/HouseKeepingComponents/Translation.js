import React from 'react'
import './translation.css'
const Translation = () => {
    return (
        <>
        <div className="demo-block">
        <div id="accordionGroup" className="Accordion" data-allow-toggle>
          <h3>
            <button aria-expanded="false" className="Accordion-trigger" aria-controls="sect1" id="accordion1id">
              <span className="Accordion-title">
                Personal Information
                <span className="Accordion-icon" />
              </span>
            </button>
          </h3>
          <div id="sect1" role="region" aria-labelledby="accordion1id" className="Accordion-panel">
            <div>
              <p>
                <label htmlFor="cufc1">
                  Name
                  <span aria-hidden="true">
                    *
                  </span>
                  :
                </label>
                <input type="text" defaultValue name="Name" id="cufc1" className="required" aria-required="true" />
              </p>
              <p>
                <label htmlFor="cufc2">
                  Email
                  <span aria-hidden="true">
                    *
                  </span>
                  :
                </label>
                <input type="text" defaultValue name="Email" id="cufc2" aria-required="true" />
              </p>
              <p>
                <label htmlFor="cufc3">
                  Phone:
                </label>
                <input type="text" defaultValue name="Phone" id="cufc3" />
              </p>
              <p>
                <label htmlFor="cufc4">
                  Extension:
                </label>
                <input type="text" defaultValue name="Ext" id="cufc4" />
              </p>
              <p>
                <label htmlFor="cufc5">
                  Country:
                </label>
                <input type="text" defaultValue name="Country" id="cufc5" />
              </p>
              <p>
                <label htmlFor="cufc6">
                  City/Province:
                </label>
                <input type="text" defaultValue name="City_Province" id="cufc6" />
              </p>
            </div>
          </div>
        </div>
      </div>
        </>
    )
}

export default Translation
